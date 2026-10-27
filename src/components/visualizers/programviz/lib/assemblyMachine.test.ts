import { describe, expect, it } from 'vitest';
import {
  INITIAL_MACHINE_STATE,
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
});
