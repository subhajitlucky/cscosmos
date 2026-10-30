import { describe, expect, it } from 'vitest';
import {
  INITIAL_MACHINE_STATE,
  PRESETS,
  PROGRAM,
  assemblyReducer,
  type MachineState,
} from './assemblyMachine';

function step(state: MachineState): MachineState {
  return assemblyReducer(state, { type: 'step' });
}

describe('assemblyMachine', () => {
  it('starts ready at address 0x00 with zeroed registers', () => {
    expect(INITIAL_MACHINE_STATE.pc).toBe(0);
    expect(INITIAL_MACHINE_STATE.stage).toBe('READY');
    expect(INITIAL_MACHINE_STATE.r0).toBe(0);
    expect(INITIAL_MACHINE_STATE.r1).toBe(0);
    expect(INITIAL_MACHINE_STATE.acc).toBe(0);
    expect(INITIAL_MACHINE_STATE.ramStored).toBe(false);
    expect(INITIAL_MACHINE_STATE.halted).toBe(false);
    expect(PROGRAM).toHaveLength(5);
  });

  it('executes MOV R0, MOV R1, ADD, STORE, and HALT in order', () => {
    let state = INITIAL_MACHINE_STATE;

    state = step(state);
    expect(state).toMatchObject({ pc: 1, r0: 15, stage: 'EXECUTE: MOV' });

    state = step(state);
    expect(state).toMatchObject({ pc: 2, r1: 27, stage: 'EXECUTE: MOV' });

    state = step(state);
    expect(state).toMatchObject({ pc: 3, r0: 42, acc: 42, stage: 'EXECUTE: ALU ADD' });

    state = step(state);
    expect(state).toMatchObject({ pc: 4, ram0x10: 42, ramStored: true, stage: 'WRITE-BACK: STORE' });

    state = step(state);
    expect(state).toMatchObject({ halted: true, stage: 'HALTED' });
  });

  it('ignores further steps after halt', () => {
    let state = INITIAL_MACHINE_STATE;
    for (let i = 0; i < PROGRAM.length; i += 1) state = step(state);

    const halted = state;
    expect(step(halted)).toBe(halted);
  });

  it('resets to the initial state from any point', () => {
    let halted = INITIAL_MACHINE_STATE;
    for (let i = 0; i < PROGRAM.length; i += 1) halted = step(halted);

    expect(assemblyReducer(halted, { type: 'reset' })).toEqual(INITIAL_MACHINE_STATE);
  });

  it('tracks whether RAM has been written separately from its displayed value', () => {
    const beforeStore: MachineState = {
      ...INITIAL_MACHINE_STATE,
      pc: 3,
      r0: 0,
      stage: 'EXECUTE: ALU ADD',
    };
    const afterStore = step(beforeStore);

    expect(afterStore.ram0x10).toBe(42);
    expect(afterStore.ramStored).toBe(true);
  });

  it('executes the counter loop preset through 3 iterations to termination', () => {
    let state = assemblyReducer(INITIAL_MACHINE_STATE, { type: 'setPreset', preset: 'loop' });
    expect(state.preset).toBe('loop');
    expect(state.pc).toBe(0);

    // Step 1: MOV R0, 3
    state = step(state);
    expect(state).toMatchObject({ pc: 1, r0: 3, stage: 'EXECUTE: MOV' });

    // Iteration 1: DEC R0 (-> 2), JNZ (jump back to 0x01)
    state = step(state);
    expect(state).toMatchObject({ pc: 2, r0: 2, stage: 'EXECUTE: DEC' });
    state = step(state);
    expect(state).toMatchObject({ pc: 1, stage: 'BRANCH: JNZ (TAKEN)' });

    // Iteration 2: DEC R0 (-> 1), JNZ (jump back to 0x01)
    state = step(state);
    expect(state).toMatchObject({ pc: 2, r0: 1, stage: 'EXECUTE: DEC' });
    state = step(state);
    expect(state).toMatchObject({ pc: 1, stage: 'BRANCH: JNZ (TAKEN)' });

    // Iteration 3: DEC R0 (-> 0), JNZ (fallthrough to 0x03)
    state = step(state);
    expect(state).toMatchObject({ pc: 2, r0: 0, stage: 'EXECUTE: DEC' });
    state = step(state);
    expect(state).toMatchObject({ pc: 3, stage: 'BRANCH: JNZ (FALLTHROUGH)' });

    // STORE [0x10], R0
    state = step(state);
    expect(state).toMatchObject({ pc: 4, ram0x10: 0, ramStored: true, stage: 'WRITE-BACK: STORE' });

    // HALT
    state = step(state);
    expect(state).toMatchObject({ halted: true, stage: 'HALTED' });
  });

  it('executes the conditional branch preset, taking the branch when R0 > R1', () => {
    let state = assemblyReducer(INITIAL_MACHINE_STATE, { type: 'setPreset', preset: 'branch' });
    expect(state.preset).toBe('branch');

    // Step 0: MOV R0, 42
    state = step(state);
    expect(state).toMatchObject({ pc: 1, r0: 42 });

    // Step 1: MOV R1, 10
    state = step(state);
    expect(state).toMatchObject({ pc: 2, r1: 10 });

    // Step 2: CMP R0, R1
    state = step(state);
    expect(state).toMatchObject({ pc: 3, stage: 'EXECUTE: ALU CMP' });

    // Step 3: JGT 0x05 (branch taken! jumps over 0x04 straight to 0x05)
    state = step(state);
    expect(state).toMatchObject({ pc: 5, stage: 'BRANCH: JGT (TAKEN)' });

    // Step 5: STORE [0x10], R0
    state = step(state);
    expect(state).toMatchObject({ pc: 6, ram0x10: 42, ramStored: true, stage: 'WRITE-BACK: STORE' });

    // Step 6: HALT
    state = step(state);
    expect(state).toMatchObject({ halted: true, stage: 'HALTED' });
  });

  it('resets correctly for the active preset', () => {
    let loopState = assemblyReducer(INITIAL_MACHINE_STATE, { type: 'setPreset', preset: 'loop' });
    loopState = step(loopState);
    loopState = step(loopState);
    expect(loopState.r0).toBe(2);

    const resetState = assemblyReducer(loopState, { type: 'reset' });
    expect(resetState).toEqual(PRESETS.loop.initialState);
  });
});
