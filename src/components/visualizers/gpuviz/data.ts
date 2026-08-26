// GPU vs CPU execution-model kernels: scalar issue, SIMT warp scheduling,
// memory hierarchy ladders and a fragment-shader wave simulator.
// Pure data structures and helpers - no browser APIs - safe for module scope.

/* ------------------------------ workload core ------------------------------ */

export const ARRAY_LEN = 64;
export const WARP_SIZE = 32;
export const WARPS = ARRAY_LEN / WARP_SIZE;

export type OpKind = 'load' | 'compute' | 'branch' | 'store';

export interface IssueSlot {
  /** Global issue-slot (cycle) index, 1-based. */
  cycle: number;
  label: string;
  kind: OpKind;
  /** Which lanes do real work this slot (length = lanesTotal). */
  laneMask: boolean[];
  /** Human hint shown under the scheduler, e.g. "THEN path". */
  note: string;
}

export interface TraceResult {
  slots: IssueSlot[];
  totalCycles: number;
  /** Lane-ops that did real work (mask true). */
  usefulLaneOps: number;
  /** Lane-op capacity burned = slots * lanesTotal. */
  occupiedLaneOps: number;
}

/**
 * Scalar CPU trace of c[i] = a[i] + b[i]; if (c[i] > T) c[i] *= 2.
 * One physical ALU: every element walks load/load/add/cmp/mul/store alone.
 */
export function scalarTrace(): TraceResult {
  const slots: IssueSlot[] = [];
  let cycle = 1;
  const one = [true];
  for (let i = 0; i < ARRAY_LEN; i++) {
    slots.push({ cycle: cycle++, label: 'ld t0, a[' + i + ']', kind: 'load', laneMask: one, note: 'item ' + i });
    slots.push({ cycle: cycle++, label: 'ld t1, b[' + i + ']', kind: 'load', laneMask: one, note: 'item ' + i });
    slots.push({ cycle: cycle++, label: 'add t2, t0, t1', kind: 'compute', laneMask: one, note: 'item ' + i });
    slots.push({ cycle: cycle++, label: 'cmp t2, THRESH; @BRT', kind: 'branch', laneMask: one, note: 'item ' + i });
    slots.push({ cycle: cycle++, label: 'mul t2, t2, 2', kind: 'compute', laneMask: one, note: 'item ' + i });
    slots.push({ cycle: cycle++, label: 'st c[' + i + '], t2', kind: 'store', laneMask: one, note: 'item ' + i });
  }
  return { slots, totalCycles: slots.length, usefulLaneOps: slots.length, occupiedLaneOps: slots.length };
}

function fullMask(): boolean[] {
  return new Array<boolean>(WARP_SIZE).fill(true);
}

function parityMask(evenActive: boolean): boolean[] {
  return new Array<boolean>(WARP_SIZE).fill(false).map((_, l) => (l % 2 === 0) === evenActive);
}

/**
 * SIMT trace. One warp-wide instruction stream per warp of 32 lanes.
 * coherent=false makes every warp split at the branch: both paths are
 * executed serially while the complementary lanes sit masked off.
 */
export function simtTrace(coherent: boolean): TraceResult {
  const slots: IssueSlot[] = [];
  let cycle = 1;
  let useful = 0;
  let occupied = 0;
  const push = (slot: Omit<IssueSlot, 'cycle'>): void => {
    slots.push({ ...slot, cycle });
    for (const m of slot.laneMask) {
      occupied += 1;
      if (m) useful += 1;
    }
    cycle += 1;
  };
  for (let w = 0; w < WARPS; w++) {
    const tag = 'warp ' + w;
    push({ label: 'ld r0, a[w' + w + '.lane]', kind: 'load', laneMask: fullMask(), note: tag });
    push({ label: 'ld r1, b[w' + w + '.lane]', kind: 'load', laneMask: fullMask(), note: tag });
    push({ label: 'add r2, r0, r1', kind: 'compute', laneMask: fullMask(), note: tag });
    push({ label: 'cmp r2, THRESH; @BRT', kind: 'branch', laneMask: fullMask(), note: tag });
    if (coherent) {
      // Whole warp agrees: warp 0 takes THEN together, warp 1 skips it.
      if (w === 0) {
        push({ label: 'mul r2, r2, 2', kind: 'compute', laneMask: fullMask(), note: tag + ' - THEN (unanimous)' });
      }
    } else {
      // Mixed lanes: THEN executed for even lanes, ELSE hop serially after.
      push({ label: 'mul r2, r2, 2', kind: 'compute', laneMask: parityMask(true), note: tag + ' - THEN path (odd lanes parked)' });
      push({ label: 'nop [ELSE hop]', kind: 'branch', laneMask: parityMask(false), note: tag + ' - ELSE path (even lanes parked)' });
    }
    push({ label: 'st c[lane], r2', kind: 'store', laneMask: fullMask(), note: tag });
  }
  return { slots, totalCycles: slots.length, usefulLaneOps: useful, occupiedLaneOps: occupied };
}

/** Share of occupied lane-slots that performed masked-off (wasted) work, in %. */
export function wastedLanePercent(t: TraceResult): number {
  if (t.occupiedLaneOps <= 0) return 0;
  return Math.round(((t.occupiedLaneOps - t.usefulLaneOps) / t.occupiedLaneOps) * 100);
}

/* --------------------------- memory hierarchy data -------------------------- */

export interface MemLevel {
  name: string;
  latencyCycles: number;
  note: string;
  width01: number;
}

export const CPU_MEMORY_LADDER: readonly MemLevel[] = [
  { name: 'L1d cache', latencyCycles: 4, note: '~32 KB per core', width01: 0.04 },
  { name: 'L2 cache', latencyCycles: 14, note: '~512 KB per core', width01: 0.12 },
  { name: 'L3 cache', latencyCycles: 50, note: '~24 MB shared', width01: 0.34 },
  { name: 'DRAM (DDR5)', latencyCycles: 160, note: 'deep queue, long stall', width01: 1 },
];

export const BANDWIDTH_BARS: readonly { name: string; gbs: number; width01: number; tone: 'cpu' | 'gpu' }[] = [
  { name: 'GPU HBM3 stack', gbs: 3072, width01: 1, tone: 'gpu' },
  { name: 'CPU DDR5 DIMM', gbs: 76, width01: 0.03, tone: 'cpu' },
];

/* ---------------------------- fragment-stage demo --------------------------- */

export const FRAG_GRID = 16;
export const FRAG_TOTAL = FRAG_GRID * FRAG_GRID;
export const FRAG_WAVES = Math.ceil(FRAG_TOTAL / WARP_SIZE);

/**
 * Lambert-style falloff for fragment (fx, fy) lit from (lx, ly), both in
 * grid units. Returns brightness clamped to 0..1.
 */
export function fragmentBrightness(fx: number, fy: number, lx: number, ly: number): number {
  const dx = fx - lx;
  const dy = fy - ly;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, 1 - dist / (FRAG_GRID * 0.75));
}

/** Number of fragments fully retired after completing a given count of waves. */
export function fragsRetiredAfter(wave: number): number {
  return Math.min(FRAG_TOTAL, Math.max(0, wave) * WARP_SIZE);
}
