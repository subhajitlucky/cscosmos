export interface Instruction {
  addr: string;
  asm: string;
  desc: string;
}

export type PresetKey = 'addition' | 'loop' | 'branch';

export const ADDITION_PROGRAM: Instruction[] = [
  { addr: '0x00', asm: 'MOV R0, 15', desc: 'Put the value 15 into register R0' },
  { addr: '0x01', asm: 'MOV R1, 27', desc: 'Put the value 27 into register R1' },
  { addr: '0x02', asm: 'ADD R0, R1', desc: 'ALU computes R0 + R1 (42), stored in ACC and R0' },
  { addr: '0x03', asm: 'STORE [0x10], R0', desc: 'Write the value 42 into RAM address 0x10' },
  { addr: '0x04', asm: 'HALT', desc: 'Stop the fetch-execute cycle' },
];

export const LOOP_PROGRAM: Instruction[] = [
  { addr: '0x00', asm: 'MOV R0, 3', desc: 'Initialize loop counter R0 = 3' },
  { addr: '0x01', asm: 'DEC R0', desc: 'Decrement loop counter R0 by 1' },
  { addr: '0x02', asm: 'JNZ 0x01', desc: 'Jump back to 0x01 if R0 != 0 (Counter Loop)' },
  { addr: '0x03', asm: 'STORE [0x10], R0', desc: 'Write final counter (0) into RAM[0x10]' },
  { addr: '0x04', asm: 'HALT', desc: 'Stop the fetch-execute cycle' },
];

export const BRANCH_PROGRAM: Instruction[] = [
  { addr: '0x00', asm: 'MOV R0, 42', desc: 'Put the value 42 into register R0' },
  { addr: '0x01', asm: 'MOV R1, 10', desc: 'Put the value 10 into register R1' },
  { addr: '0x02', asm: 'CMP R0, R1', desc: 'ALU compares R0 with R1 (42 > 10)' },
  { addr: '0x03', asm: 'JGT 0x05', desc: 'Jump to 0x05 if R0 > R1 (Branch Taken)' },
  { addr: '0x04', asm: 'MOV R0, 0', desc: 'Fallback instruction (SKIPPED if branch taken)' },
  { addr: '0x05', asm: 'STORE [0x10], R0', desc: 'Write R0 (42) into RAM address 0x10' },
  { addr: '0x06', asm: 'HALT', desc: 'Stop the fetch-execute cycle' },
];

export const PROGRAM: Instruction[] = ADDITION_PROGRAM;

export const INITIAL_LOG =
  'Press “Step Instruction Cycle” (or the → key) to fetch and execute ROM[0x00].';

export interface MachineState {
  preset: PresetKey;
  pc: number;
  r0: number;
  r1: number;
  acc: number;
  ram0x10: number;
  /** Explicit flag because a stored zero is still a stored value. */
  ramStored: boolean;
  stage: string;
  halted: boolean;
  log: string;
}

export const INITIAL_MACHINE_STATE: MachineState = {
  preset: 'addition',
  pc: 0,
  r0: 0,
  r1: 0,
  acc: 0,
  ram0x10: 0,
  ramStored: false,
  stage: 'READY',
  halted: false,
  log: INITIAL_LOG,
};

export interface PresetInfo {
  id: PresetKey;
  title: string;
  badge: string;
  description: string;
  program: Instruction[];
  initialState: MachineState;
}

export const PRESETS: Record<PresetKey, PresetInfo> = {
  addition: {
    id: 'addition',
    title: 'Preset 1: Addition',
    badge: 'Sequential Arithmetic',
    description: 'A straight 5-instruction linear pipeline computing 15 + 27 = 42 and writing back to RAM.',
    program: ADDITION_PROGRAM,
    initialState: INITIAL_MACHINE_STATE,
  },
  loop: {
    id: 'loop',
    title: 'Preset 2: Counter Loop',
    badge: 'Loops & Jumps',
    description: 'Uses DEC R0 and JNZ (Jump if Not Zero) to execute a 3-step countdown loop before halting.',
    program: LOOP_PROGRAM,
    initialState: {
      preset: 'loop',
      pc: 0,
      r0: 0,
      r1: 0,
      acc: 0,
      ram0x10: 0,
      ramStored: false,
      stage: 'READY',
      halted: false,
      log: 'Press “Step Instruction Cycle” (or →) to start the 3-cycle countdown loop.',
    },
  },
  branch: {
    id: 'branch',
    title: 'Preset 3: Compare & Branch',
    badge: 'Conditional Branching',
    description: 'Evaluates CMP R0, R1 and conditionally jumps over instruction 0x04 when R0 > R1.',
    program: BRANCH_PROGRAM,
    initialState: {
      preset: 'branch',
      pc: 0,
      r0: 0,
      r1: 0,
      acc: 0,
      ram0x10: 0,
      ramStored: false,
      stage: 'READY',
      halted: false,
      log: 'Press “Step Instruction Cycle” (or →) to test the conditional branch (42 > 10).',
    },
  },
};

export type MachineAction =
  | { type: 'step' }
  | { type: 'reset' }
  | { type: 'setPreset'; preset: PresetKey };

function stepAddition(state: MachineState): MachineState {
  switch (state.pc) {
    case 0:
      return {
        ...state,
        r0: 15,
        pc: 1,
        stage: 'EXECUTE: MOV',
        log: 'Fetched ROM[0x00] “MOV R0, 15” → R0 = 15. PC moved to 0x01.',
      };
    case 1:
      return {
        ...state,
        r1: 27,
        pc: 2,
        stage: 'EXECUTE: MOV',
        log: 'Fetched ROM[0x01] “MOV R1, 27” → R1 = 27. PC moved to 0x02.',
      };
    case 2:
      return {
        ...state,
        acc: 42,
        r0: 42,
        pc: 3,
        stage: 'EXECUTE: ALU ADD',
        log: 'Fetched ROM[0x02] “ADD R0, R1” → ALU: 15 + 27 = 42. ACC and R0 now hold 42. PC moved to 0x03.',
      };
    case 3:
      return {
        ...state,
        ram0x10: 42,
        ramStored: true,
        pc: 4,
        stage: 'WRITE-BACK: STORE',
        log: 'Fetched ROM[0x03] “STORE [0x10], R0” → RAM[0x10] = 42. PC moved to 0x04.',
      };
    case 4:
      return {
        ...state,
        halted: true,
        stage: 'HALTED',
        log: 'Fetched ROM[0x04] “HALT” → the CPU stops fetching. Final state: RAM[0x10] holds 42. Press Reset (or R) to run again.',
      };
    default:
      return state;
  }
}

function stepLoop(state: MachineState): MachineState {
  switch (state.pc) {
    case 0:
      return {
        ...state,
        r0: 3,
        pc: 1,
        stage: 'EXECUTE: MOV',
        log: 'Fetched ROM[0x00] “MOV R0, 3” → Loop counter initialized: R0 = 3. PC moved to 0x01.',
      };
    case 1: {
      const nextR0 = state.r0 - 1;
      return {
        ...state,
        r0: nextR0,
        pc: 2,
        stage: 'EXECUTE: DEC',
        log: `Fetched ROM[0x01] “DEC R0” → Decremented counter: R0 is now ${nextR0}. PC moved to 0x02.`,
      };
    }
    case 2:
      if (state.r0 > 0) {
        return {
          ...state,
          pc: 1,
          stage: 'BRANCH: JNZ (TAKEN)',
          log: `Fetched ROM[0x02] “JNZ 0x01” → R0 = ${state.r0} (non-zero). Loop jump taken back to 0x01!`,
        };
      } else {
        return {
          ...state,
          pc: 3,
          stage: 'BRANCH: JNZ (FALLTHROUGH)',
          log: 'Fetched ROM[0x02] “JNZ 0x01” → R0 = 0. Condition false; loop exited! PC moved to 0x03.',
        };
      }
    case 3:
      return {
        ...state,
        ram0x10: state.r0,
        ramStored: true,
        pc: 4,
        stage: 'WRITE-BACK: STORE',
        log: `Fetched ROM[0x03] “STORE [0x10], R0” → RAM[0x10] = ${state.r0}. PC moved to 0x04.`,
      };
    case 4:
      return {
        ...state,
        halted: true,
        stage: 'HALTED',
        log: 'Fetched ROM[0x04] “HALT” → Counter loop completed successfully! Final RAM[0x10] = 0.',
      };
    default:
      return state;
  }
}

function stepBranch(state: MachineState): MachineState {
  switch (state.pc) {
    case 0:
      return {
        ...state,
        r0: 42,
        pc: 1,
        stage: 'EXECUTE: MOV',
        log: 'Fetched ROM[0x00] “MOV R0, 42” → R0 = 42. PC moved to 0x01.',
      };
    case 1:
      return {
        ...state,
        r1: 10,
        pc: 2,
        stage: 'EXECUTE: MOV',
        log: 'Fetched ROM[0x01] “MOV R1, 10” → R1 = 10. PC moved to 0x02.',
      };
    case 2:
      return {
        ...state,
        pc: 3,
        stage: 'EXECUTE: ALU CMP',
        log: `Fetched ROM[0x02] “CMP R0, R1” → ALU compares ${state.r0} vs ${state.r1}: 42 > 10 (GREATER flag set). PC moved to 0x03.`,
      };
    case 3:
      // In this preset, R0 (42) > R1 (10) is true, so branch is taken to 0x05
      return {
        ...state,
        pc: 5,
        stage: 'BRANCH: JGT (TAKEN)',
        log: 'Fetched ROM[0x03] “JGT 0x05” → Greater flag is set! Jumping over 0x04 directly to 0x05.',
      };
    case 4:
      return {
        ...state,
        r0: 0,
        pc: 5,
        stage: 'EXECUTE: MOV',
        log: 'Fetched ROM[0x04] “MOV R0, 0” → Fallback reached: R0 = 0. PC moved to 0x05.',
      };
    case 5:
      return {
        ...state,
        ram0x10: state.r0,
        ramStored: true,
        pc: 6,
        stage: 'WRITE-BACK: STORE',
        log: `Fetched ROM[0x05] “STORE [0x10], R0” → RAM[0x10] = ${state.r0}. PC moved to 0x06.`,
      };
    case 6:
      return {
        ...state,
        halted: true,
        stage: 'HALTED',
        log: 'Fetched ROM[0x06] “HALT” → Branch executed! ROM[0x04] was safely skipped because 42 > 10.',
      };
    default:
      return state;
  }
}

export function assemblyReducer(state: MachineState, action: MachineAction): MachineState {
  if (action.type === 'setPreset') {
    return PRESETS[action.preset].initialState;
  }

  if (action.type === 'reset') {
    return PRESETS[state.preset ?? 'addition'].initialState;
  }

  if (state.halted) return state;

  const currentPreset = state.preset ?? 'addition';
  switch (currentPreset) {
    case 'loop':
      return stepLoop(state);
    case 'branch':
      return stepBranch(state);
    case 'addition':
    default:
      return stepAddition(state);
  }
}
