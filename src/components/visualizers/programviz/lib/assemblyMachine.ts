export interface Instruction {
  addr: string;
  asm: string;
  desc: string;
}

export const PROGRAM: Instruction[] = [
  { addr: '0x00', asm: 'MOV R0, 15', desc: 'Put the value 15 into register R0' },
  { addr: '0x01', asm: 'MOV R1, 27', desc: 'Put the value 27 into register R1' },
  { addr: '0x02', asm: 'ADD R0, R1', desc: 'ALU computes R0 + R1 (42), stored in ACC and R0' },
  { addr: '0x03', asm: 'STORE [0x10], R0', desc: 'Write the value 42 into RAM address 0x10' },
  { addr: '0x04', asm: 'HALT', desc: 'Stop the fetch-execute cycle' },
];

export const INITIAL_LOG =
  'Press “Step Instruction Cycle” (or the → key) to fetch and execute ROM[0x00].';

export interface MachineState {
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

export type MachineAction = { type: 'step' } | { type: 'reset' };

export function assemblyReducer(state: MachineState, action: MachineAction): MachineState {
  if (action.type === 'reset') return INITIAL_MACHINE_STATE;
  if (state.halted) return state;

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
