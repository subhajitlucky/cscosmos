export type Word = string; // 32-byte hex string, e.g., "0x..."

export interface Log {
  address?: string;
  data: string;
  topics: string[];
}

export interface GasDetails {
  totalUsed: number;
  lastCost: number;
  refund: number;
}

export interface EVMState {
  stack: Word[];
  memory: Uint8Array;
  storage: Record<string, Word>;
  pc: number;
  gas: number;
  gasDetails: GasDetails;
  code: Uint8Array;
  status: 'idle' | 'running' | 'halted' | 'reverted' | 'error';
  error?: string;
  logs: Log[];
}

export interface Opcode {
  name: string;
  code: number;
  gas: number;
  execute: (state: EVMState) => void;
  description: string;
}

export interface ExecutionStep {
  state: EVMState;
  opcode: Opcode | undefined;
}
