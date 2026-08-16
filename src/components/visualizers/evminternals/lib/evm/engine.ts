import type { EVMState, Word } from '../../types/evm';

export const toHex = (num: number | bigint, pad: number = 64): string => {
  return '0x' + num.toString(16).padStart(pad, '0');
};

export const fromHex = (hex: string): bigint => {
  if (!hex) return BigInt(0);
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (!cleanHex) return BigInt(0);
  return BigInt('0x' + cleanHex);
};

export class EVMEngine {
  state: EVMState;
  history: EVMState[] = [];
  validJumps: Set<number> = new Set();

  constructor(code: Uint8Array, initialGas: number = 1000000) {
    this.state = {
      stack: [],
      memory: new Uint8Array(0),
      storage: {},
      pc: 0,
      gas: initialGas,
      gasDetails: {
        totalUsed: 0,
        lastCost: 0,
        refund: 0,
      },
      code,
      status: 'idle',
      logs: [],
    };
    this.analyzeJumpDests();
  }

  private analyzeJumpDests() {
    let i = 0;
    while (i < this.state.code.length) {
      const op = this.state.code[i];
      if (op === 0x5b) {
        this.validJumps.add(i);
      }
      if (op >= 0x60 && op <= 0x7f) {
        i += op - 0x60 + 1;
      }
      i++;
    }
  }

  step() {
    if (this.state.status === 'halted' || this.state.status === 'reverted' || this.state.status === 'error') {
      return;
    }

    this.history.push(this.cloneState(this.state));

    if (this.state.pc >= this.state.code.length) {
      this.state.status = 'halted';
      return;
    }

    const op = this.state.code[this.state.pc];
    this.executeOpcode(op);
  }

  undo() {
    if (this.history.length > 0) {
      this.state = this.history.pop()!;
    }
  }

  private useGas(amount: number) {
    this.state.gas -= amount;
    this.state.gasDetails.lastCost = amount;
    this.state.gasDetails.totalUsed += amount;
    if (this.state.gas < 0) {
      this.setError('Out of Gas');
    }
  }

  private calcMemoryExpansion(newSize: number): number {
    const currentWords = Math.ceil(this.state.memory.length / 32);
    const newWords = Math.ceil(newSize / 32);
    if (newWords <= currentWords) return 0;

    const currentCost = (currentWords * 3 + Math.floor(currentWords ** 2 / 512));
    const newCost = (newWords * 3 + Math.floor(newWords ** 2 / 512));
    return newCost - currentCost;
  }

  private executeOpcode(op: number) {
    this.state.status = 'running';

    // PUSH1 - PUSH32
    if (op >= 0x60 && op <= 0x7f) {
      const size = op - 0x60 + 1;
      this.useGas(3);
      const valueBytes = this.state.code.slice(this.state.pc + 1, this.state.pc + 1 + size);
      let value = BigInt(0);
      for (const byte of valueBytes) {
        value = (value << BigInt(8)) | BigInt(byte);
      }
      this.pushStack(toHex(value));
      this.state.pc += 1 + size;
      return;
    }

    // DUP1 - DUP16
    if (op >= 0x80 && op <= 0x8f) {
      const index = op - 0x80;
      this.useGas(3);
      if (this.state.stack.length <= index) {
        this.setError('Stack Underflow');
        return;
      }
      const val = this.state.stack[this.state.stack.length - 1 - index];
      this.pushStack(val);
      this.state.pc++;
      return;
    }

    // SWAP1 - SWAP16
    if (op >= 0x90 && op <= 0x9f) {
      const index = op - 0x90 + 1;
      this.useGas(3);
      if (this.state.stack.length <= index) {
        this.setError('Stack Underflow');
        return;
      }
      const topIdx = this.state.stack.length - 1;
      const targetIdx = this.state.stack.length - 1 - index;
      const tmp = this.state.stack[topIdx];
      this.state.stack[topIdx] = this.state.stack[targetIdx];
      this.state.stack[targetIdx] = tmp;
      this.state.pc++;
      return;
    }

    switch (op) {
      case 0x00: // STOP
        this.useGas(0);
        this.state.status = 'halted';
        this.state.pc++;
        break;

      case 0x01: // ADD
        this.useGas(3);
        this.binaryOp((a, b) => (a + b) % (BigInt(2) ** BigInt(256)));
        break;
      case 0x02: // MUL
        this.useGas(5);
        this.binaryOp((a, b) => (a * b) % (BigInt(2) ** BigInt(256)));
        break;
      case 0x03: // SUB
        this.useGas(3);
        this.binaryOp((a, b) => (a - b + (BigInt(2) ** BigInt(256))) % (BigInt(2) ** BigInt(256)));
        break;
      case 0x04: // DIV
        this.useGas(5);
        this.binaryOp((a, b) => (b === BigInt(0) ? BigInt(0) : a / b));
        break;
      case 0x06: // MOD
        this.useGas(5);
        this.binaryOp((a, b) => (b === BigInt(0) ? BigInt(0) : a % b));
        break;
      case 0x0a: // EXP
        {
          const a = fromHex(this.popStack());
          const b = fromHex(this.popStack());
          const exponentGas = 50 * Math.ceil(b.toString(2).length / 8);
          this.useGas(10 + exponentGas);
          // Simple exponentiation for visualization (limit to avoid overflow issues in JS)
          let res = BigInt(1);
          for(let i = BigInt(0); i < b; i++) {
             res = (res * a) % (BigInt(2) ** BigInt(256));
             if (i > BigInt(1000)) break; // Safety break for UI
          }
          this.pushStack(toHex(res));
          this.state.pc++;
        }
        break;

      case 0x10: // LT
        this.useGas(3);
        this.binaryOp((a, b) => (a < b ? BigInt(1) : BigInt(0)));
        break;
      case 0x11: // GT
        this.useGas(3);
        this.binaryOp((a, b) => (a > b ? BigInt(1) : BigInt(0)));
        break;
      case 0x14: // EQ
        this.useGas(3);
        this.binaryOp((a, b) => (a === b ? BigInt(1) : BigInt(0)));
        break;
      case 0x15: // ISZERO
        {
          this.useGas(3);
          const a = fromHex(this.popStack());
          this.pushStack(toHex(a === BigInt(0) ? BigInt(1) : BigInt(0)));
          this.state.pc++;
        }
        break;
      case 0x16: // AND
        this.useGas(3);
        this.binaryOp((a, b) => a & b);
        break;
      case 0x17: // OR
        this.useGas(3);
        this.binaryOp((a, b) => a | b);
        break;
      case 0x18: // XOR
        this.useGas(3);
        this.binaryOp((a, b) => a ^ b);
        break;
      case 0x19: // NOT
        this.useGas(3);
        this.pushStack(toHex((~fromHex(this.popStack())) & ((BigInt(1) << BigInt(256)) - BigInt(1))));
        this.state.pc++;
        break;

      case 0x20: // KECCAK256 (MOCK)
        {
          const offset = Number(fromHex(this.popStack()));
          const size = Number(fromHex(this.popStack()));
          const memGas = this.calcMemoryExpansion(offset + size);
          this.useGas(30 + 6 * Math.ceil(size / 32) + memGas);
          this.ensureMemory(offset + size);
          // Mock hash
          this.pushStack(toHex(BigInt(offset + size) * BigInt(0x12345678)));
          this.state.pc++;
        }
        break;

      case 0x33: // CALLER
        this.useGas(2);
        this.pushStack(toHex(BigInt('0x1234567890abcdef1234567890abcdef12345678'), 40));
        this.state.pc++;
        break;
      case 0x34: // CALLVALUE
        this.useGas(2);
        this.pushStack(toHex(BigInt(0)));
        this.state.pc++;
        break;

      case 0x50: // POP
        this.useGas(2);
        this.popStack();
        this.state.pc++;
        break;

      case 0x51: // MLOAD
        {
          const offset = Number(fromHex(this.popStack()));
          const memGas = this.calcMemoryExpansion(offset + 32);
          this.useGas(3 + memGas);
          this.ensureMemory(offset + 32);
          const value = this.mload(offset);
          this.pushStack(toHex(value));
          this.state.pc++;
        }
        break;

      case 0x52: // MSTORE
        {
          const offset = Number(fromHex(this.popStack()));
          const value = fromHex(this.popStack());
          const memGas = this.calcMemoryExpansion(offset + 32);
          this.useGas(3 + memGas);
          this.mstore(offset, value);
          this.state.pc++;
        }
        break;

      case 0x53: // MSTORE8
        {
          const offset = Number(fromHex(this.popStack()));
          const value = fromHex(this.popStack()) & BigInt(0xff);
          const memGas = this.calcMemoryExpansion(offset + 1);
          this.useGas(3 + memGas);
          this.ensureMemory(offset + 1);
          this.state.memory[offset] = Number(value);
          this.state.pc++;
        }
        break;

      case 0x54: // SLOAD
        this.useGas(2100); // Cold access mock
        {
          const key = this.popStack();
          this.pushStack(this.state.storage[key] || toHex(BigInt(0)));
          this.state.pc++;
        }
        break;

      case 0x55: // SSTORE
        {
          const key = this.popStack();
          const value = this.popStack();
          const oldValue = this.state.storage[key] || toHex(BigInt(0));
          
          if (value === oldValue) {
            this.useGas(100);
          } else if (oldValue === toHex(BigInt(0))) {
            this.useGas(20000);
          } else {
            this.useGas(2900);
            if (value === toHex(BigInt(0))) {
              this.state.gasDetails.refund += 4800;
            }
          }
          
          this.state.storage[key] = value;
          this.state.pc++;
        }
        break;

      case 0x56: // JUMP
        this.useGas(8);
        {
          const dest = Number(fromHex(this.popStack()));
          if (!this.validJumps.has(dest)) {
            this.setError('Invalid Jump Destination');
            return;
          }
          this.state.pc = dest;
        }
        break;

      case 0x57: // JUMPI
        this.useGas(10);
        {
          const dest = Number(fromHex(this.popStack()));
          const condition = fromHex(this.popStack());
          if (condition !== BigInt(0)) {
            if (!this.validJumps.has(dest)) {
              this.setError('Invalid Jump Destination');
              return;
            }
            this.state.pc = dest;
          } else {
            this.state.pc++;
          }
        }
        break;

      case 0x58: // PC
        this.useGas(2);
        this.pushStack(toHex(BigInt(this.state.pc)));
        this.state.pc++;
        break;

      case 0x59: // MSIZE
        this.useGas(2);
        this.pushStack(toHex(BigInt(this.state.memory.length)));
        this.state.pc++;
        break;

      case 0x5b: // JUMPDEST
        this.useGas(1);
        this.state.pc++;
        break;

      case 0xf3: // RETURN
        {
          this.popStack(); // offset
          this.popStack(); // size
          this.useGas(0);
          this.state.status = 'halted';
          this.state.pc++;
        }
        break;

      case 0xfd: // REVERT
        {
          this.popStack(); // offset
          this.popStack(); // size
          this.useGas(0);
          this.state.status = 'reverted';
          this.state.pc++;
        }
        break;

      default:
        this.setError(`Unknown opcode: 0x${op.toString(16)}`);
        this.state.pc++;
    }
  }

  private binaryOp(fn: (a: bigint, b: bigint) => bigint) {
    const a = fromHex(this.popStack());
    const b = fromHex(this.popStack());
    this.pushStack(toHex(fn(a, b)));
    this.state.pc++;
  }

  private pushStack(value: Word) {
    if (this.state.stack.length >= 1024) {
      this.setError('Stack Overflow');
      return;
    }
    this.state.stack.push(value);
  }

  private popStack(): Word {
    if (this.state.stack.length === 0) {
      this.setError('Stack Underflow');
      return toHex(BigInt(0));
    }
    return this.state.stack.pop()!;
  }

  private setError(msg: string) {
    this.state.status = 'error';
    this.state.error = msg;
  }

  private ensureMemory(size: number) {
    if (size > this.state.memory.length) {
      const roundedSize = Math.ceil(size / 32) * 32;
      const newMemory = new Uint8Array(roundedSize);
      newMemory.set(this.state.memory);
      this.state.memory = newMemory;
    }
  }

  private mstore(offset: number, value: bigint) {
    this.ensureMemory(offset + 32);
    for (let i = 0; i < 32; i++) {
      this.state.memory[offset + 31 - i] = Number((value >> BigInt(i * 8)) & BigInt(0xff));
    }
  }

  private mload(offset: number): bigint {
    this.ensureMemory(offset + 32);
    let value = BigInt(0);
    for (let i = 0; i < 32; i++) {
      const byte = this.state.memory[offset + i] || 0;
      value = (value << BigInt(8)) | BigInt(byte);
    }
    return value;
  }

  private cloneState(state: EVMState): EVMState {
    return {
      ...state,
      stack: [...state.stack],
      memory: new Uint8Array(state.memory),
      storage: { ...state.storage },
      gasDetails: { ...state.gasDetails },
      logs: [...state.logs],
    };
  }

  getState(): EVMState {
    return this.cloneState(this.state);
  }
}