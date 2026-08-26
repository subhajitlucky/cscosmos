// Speculative-execution side-channel playground - knowledge base.
// Pure data - no browser APIs - safe for module scope.
// Simplified teaching model: direct-mapped cache, synthetic timings.

export type Scenario = 'legit' | 'spectre' | 'meltdown';
export type Mitigation = 'none' | 'lfence' | 'kpti';

export const SECRET_BYTE = 0x4b; // ASCII 'K'
export const SECRET_CHAR = 'K';
export const ARRAY_LEN = 8;
export const KERNEL_BYTE = 0x33;

export interface MemSlot {
  addr: string;
  value: string;
  secret?: boolean;
}

/** User pages: eight in-bounds bytes followed by the out-of-bounds SECRET. */
export const MEMORY: MemSlot[] = [
  { addr: '0x9000', value: '0x11' },
  { addr: '0x9001', value: '0x23' },
  { addr: '0x9002', value: '0x37' },
  { addr: '0x9003', value: '0x4E' },
  { addr: '0x9004', value: '0x55' },
  { addr: '0x9005', value: '0x69' },
  { addr: '0x9006', value: '0x7A' },
  { addr: '0x9007', value: '0x2C' },
  { addr: '0x9008', value: '0x4B', secret: true },
];

export const KERNEL_ADDR = '0xffff8880_00f1';

export interface ScenarioInfo {
  title: string;
  blurb: string;
}

export const SCENARIO_INFO: Record<Scenario, ScenarioInfo> = {
  legit: {
    title: 'Legitimate execution',
    blurb:
      'Plain in-bounds reads. The branch predictor learns from honest history, real loads warm their cache lines, and no information ever escapes.',
  },
  spectre: {
    title: 'Spectre v1 - bounds-check bypass',
    blurb:
      'Train the predictor with valid indices, then feed an out-of-bounds one. The mispredicted branch speculatively reads the SECRET and encodes it into the cache even though the result is discarded. Flush+reload reads the fingerprint back.',
  },
  meltdown: {
    title: 'Meltdown - rogue data cache load',
    blurb:
      'A user-mode load touches kernel memory. The permission fault arrives late: the forbidden byte is already fetched and cached transiently. Timing again turns a squashed instruction into a readable secret.',
  },
};

export interface MitigationInfo {
  label: string;
  detail: string;
}

export const MITIGATION_INFO: Record<Mitigation, MitigationInfo> = {
  none: {
    label: 'No mitigation',
    detail: 'Stock speculative execution - leaks proceed freely.',
  },
  lfence: {
    label: 'lfence',
    detail:
      'Serializing instruction after the compare: dispatch stalls until the bounds check truly resolves. Blocks Spectre-style speculation; useless against Meltdown.',
  },
  kpti: {
    label: 'KPTI',
    detail:
      'Kernel Page Table Isolation: kernel pages are unmapped while in user mode, so a Meltdown load faults before any transient fetch. Does not stop Spectre v1.',
  },
};

export type StepAction =
  | 'check'
  | 'warm'
  | 'flush'
  | 'speculate'
  | 'discard'
  | 'probe'
  | 'reveal'
  | 'kload'
  | 'fault'
  | 'blocked';

export interface SimStep {
  /** Monospace code-ish label shown in the trace list. */
  label: string;
  /** Narration shown under the label. */
  detail: string;
  action: StepAction;
  /** Slot index for warm; 'secret' or 'kernel' for speculate/reveal. */
  target?: number | 'secret' | 'kernel';
  /** Branch-predictor display state after this step. */
  predictor?: string;
}

export interface ScriptResult {
  steps: SimStep[];
  outcome: 'safe' | 'leak' | 'blocked';
  verdictTitle: string;
  verdictText: string;
}

function trainSteps(): SimStep[] {
  return [
    {
      label: 'if (idx < LEN) // idx=0',
      detail: 'In-bounds check resolves honestly; predictor records TAKEN.',
      action: 'check',
      predictor: 'trained: T',
    },
    {
      label: 'load array1[0]',
      detail: 'Real fetch pulls cache line 0 up from RAM.',
      action: 'warm',
      target: 0,
    },
    {
      label: 'if (idx < LEN) // idx=1',
      detail: 'Another honest pass - the predictor grows confident.',
      action: 'check',
      predictor: 'trained: T,T',
    },
    {
      label: 'load array1[1]',
      detail: 'Line 1 warmed alongside its predecessor.',
      action: 'warm',
      target: 1,
    },
    {
      label: 'if (idx < LEN) // idx=2',
      detail: 'Third valid check. History now reads T,T,T.',
      action: 'check',
      predictor: 'trained: T,T,T',
    },
    {
      label: 'load array1[2]',
      detail: 'Line 2 warmed. Training phase complete.',
      action: 'warm',
      target: 2,
    },
  ];
}

const FLUSH_STEP: SimStep = {
  label: 'clflush array1[0..8], secret',
  detail: 'Attacker evicts every relevant line - a clean slate for a clean timing oracle.',
  action: 'flush',
};

const PROBE_STEP: SimStep = {
  label: 'flush+reload sweep over candidates',
  detail: 'Reload every candidate line and time it: cold lines crawl, a transiently warmed line flies.',
  action: 'probe',
};

export function buildScript(scenario: Scenario, mitigation: Mitigation): ScriptResult {
  if (scenario === 'legit') {
    return {
      steps: [
        ...trainSteps(),
        {
          label: 'program exit(0)',
          detail: 'Every access stayed inside the array. Nothing out-of-bounds was ever touched.',
          action: 'discard',
          predictor: 'idle',
        },
      ],
      outcome: 'safe',
      verdictTitle: 'No leak - architecture held',
      verdictText:
        'In-bounds indices mean the branch always resolves correctly. The predictor trained, cache lines warmed, and the program ended exactly as written. Side channels need speculation or privilege confusion - legitimate execution provides neither.',
    };
  }

  if (scenario === 'spectre') {
    if (mitigation === 'lfence') {
      return {
        steps: [
          ...trainSteps(),
          FLUSH_STEP,
          {
            label: 'if (idx < LEN) // idx=999  +  lfence',
            detail: 'Attacker feeds an out-of-bounds index hoping for a mispredict...',
            action: 'check',
            predictor: 'stalled by lfence',
          },
          {
            label: 'lfence: dispatch frozen',
            detail:
              'The fence drains the pipeline before any later load can issue. No speculative read of the SECRET happens, so no cache line warms.',
            action: 'blocked',
          },
          PROBE_STEP,
        ],
        outcome: 'blocked',
        verdictTitle: 'Leak blocked by lfence',
        verdictText:
          'With dispatch serialized behind the bounds check there is no transient window: the secret line stays cold and the timing sweep finds nothing but uniformly slow rows.',
      };
    }
    const kptiNote =
      mitigation === 'kpti'
        ? ' KPTI is irrelevant here - it isolates page tables, not branch predictors.'
        : '';
    return {
      steps: [
        ...trainSteps(),
        FLUSH_STEP,
        {
          label: 'if (idx < LEN) // idx=999',
          detail:
            'Out-of-bounds index. Resolution takes hundreds of cycles - the predictor bets on TAKEN from training.',
          action: 'check',
          predictor: 'MISPREDICTED: taken',
        },
        {
          label: 'probe[array1[999] * 4096]  (transient)',
          detail:
            'Speculative OOB read yields the SECRET byte 0x4B; the dependent probe touches the line encoding byte 0x4B. All transient.',
          action: 'speculate',
          target: 'secret',
        },
        {
          label: 'compare finally resolves: REJECT',
          detail:
            'The branch squashes every speculative result - architecturally nothing happened. Microarchitecturally, one cache line is now hot.',
          action: 'discard',
          predictor: 'recovering',
        },
        PROBE_STEP,
        {
          label: 'decode timing -> hit at 0x4B',
          detail:
            "One row returns in a fraction of the others' time. Byte 0x4B is ASCII 'K' - the SECRET is out.",
          action: 'reveal',
          target: 'secret',
        },
      ],
      outcome: 'leak',
      verdictTitle: "SECRET leaked: 'K'",
      verdictText:
        'The result was discarded, yet flush+reload recovered it from cache timing.' + kptiNote,
    };
  }

  // meltdown
  if (mitigation === 'kpti') {
    return {
      steps: [
        {
          label: 'mov al, [' + KERNEL_ADDR + ']',
          detail: 'User code aims a load at kernel memory...',
          action: 'kload',
          target: 'kernel',
        },
        {
          label: 'page walk fails: PTE absent',
          detail:
            'Under KPTI the user page table simply has no mapping for kernel space. The TLB miss aborts before any byte is fetched - no transient window, no cache fingerprint.',
          action: 'blocked',
        },
      ],
      outcome: 'blocked',
      verdictTitle: 'Leak blocked by KPTI',
      verdictText:
        'Kernel pages are unmapped in user mode, so the rogue load dies at address translation - long before it could transiently fetch or encode anything.',
    };
  }

  if (mitigation === 'lfence') {
    return {
      steps: [
        {
          label: 'mov al, [' + KERNEL_ADDR + ']',
          detail: 'The kernel read begins regardless of fences behind it.',
          action: 'kload',
          target: 'kernel',
        },
        {
          label: '#PF raised - byte already fetched',
          detail:
            'lfence orders LATER instructions; it cannot un-fetch this one. The faulting load itself fills the cache line with kernel data.',
          action: 'fault',
          target: 'kernel',
        },
        {
          label: 'probe[byte * 4096]  (transient)',
          detail: 'The dependent touch encodes the stolen kernel byte 0x33 into the cache anyway.',
          action: 'speculate',
          target: 'kernel',
        },
        PROBE_STEP,
        {
          label: 'decode timing -> kernel byte 0x33',
          detail: 'Same story as unmitigated Meltdown - lfence was never the right tool.',
          action: 'reveal',
          target: 'kernel',
        },
      ],
      outcome: 'leak',
      verdictTitle: 'Kernel byte leaked: 0x33',
      verdictText:
        'lfence cannot help against Meltdown: the faulting load populates the cache before any fence could matter. Only unmapping kernel pages (KPTI) removes the transient window.',
    };
  }

  return {
    steps: [
      {
        label: 'mov al, [' + KERNEL_ADDR + ']',
        detail: 'Ring-3 code reads kernel memory. The MMU starts translating anyway.',
        action: 'kload',
        target: 'kernel',
      },
      {
        label: '#PF raised - too late',
        detail:
          'Permission checks retire AFTER execution begins: the forbidden byte is already inside the pipeline.',
        action: 'fault',
        target: 'kernel',
      },
      {
        label: 'probe[al * 4096]  (transient)',
        detail: 'Before the fault lands, a dependent access encodes byte 0x33 into a cache line.',
        action: 'speculate',
        target: 'kernel',
      },
      {
        label: 'fault handler squashes the load',
        detail:
          'Architecturally the instruction never happened - the register is zeroed. The cache disagrees.',
        action: 'discard',
      },
      PROBE_STEP,
      {
        label: 'decode timing -> kernel byte 0x33',
        detail: 'One hot row among the candidates hands the attacker a privileged byte from userland.',
        action: 'reveal',
        target: 'kernel',
      },
    ],
    outcome: 'leak',
    verdictTitle: 'Kernel byte leaked: 0x33',
    verdictText:
      'The fault fired, the register was rolled back - yet flush+reload still reads the byte from cache timing. Privilege isolation lost to microarchitecture.',
  };
}

/** Candidate bytes probed during flush+reload (0x48..0x4F). */
export const PROBE_CANDIDATES: number[] = [0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f];

export const HOT_INDEX = PROBE_CANDIDATES.indexOf(SECRET_BYTE);

/** Synthetic cycle counts for the timing bars: hot line fast, everything else slow. */
export function cyclesFor(i: number): number {
  return i === HOT_INDEX ? 42 : 190 + ((i * 37) % 90);
}
