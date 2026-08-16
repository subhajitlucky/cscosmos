/**
 * Lightweight EVM Bytecode Interpreter for Educational Visualization
 * 
 * This is a simplified EVM that supports basic opcodes for demonstration.
 * It's designed to work reliably in the browser without heavy dependencies.
 */

// EVM Opcodes
const OPCODES: Record<number, string> = {
    0x00: 'STOP',
    0x01: 'ADD',
    0x02: 'MUL',
    0x03: 'SUB',
    0x04: 'DIV',
    0x05: 'SDIV',
    0x06: 'MOD',
    0x10: 'LT',
    0x11: 'GT',
    0x12: 'SLT',
    0x13: 'SGT',
    0x14: 'EQ',
    0x15: 'ISZERO',
    0x16: 'AND',
    0x17: 'OR',
    0x18: 'XOR',
    0x19: 'NOT',
    0x20: 'SHA3',
    0x5f: 'PUSH0',
    0x50: 'POP',
    0x51: 'MLOAD',
    0x52: 'MSTORE',
    0x54: 'SLOAD',
    0x55: 'SSTORE',
    0x56: 'JUMP',
    0x57: 'JUMPI',
    0x58: 'PC',
    0x59: 'MSIZE',
    0x5a: 'GAS',
    0x5b: 'JUMPDEST',
    0x60: 'PUSH1', 0x61: 'PUSH2', 0x62: 'PUSH3', 0x63: 'PUSH4',
    0x64: 'PUSH5', 0x65: 'PUSH6', 0x66: 'PUSH7', 0x67: 'PUSH8',
    0x68: 'PUSH9', 0x69: 'PUSH10', 0x6a: 'PUSH11', 0x6b: 'PUSH12',
    0x6c: 'PUSH13', 0x6d: 'PUSH14', 0x6e: 'PUSH15', 0x6f: 'PUSH16',
    0x70: 'PUSH17', 0x71: 'PUSH18', 0x72: 'PUSH19', 0x73: 'PUSH20',
    0x74: 'PUSH21', 0x75: 'PUSH22', 0x76: 'PUSH23', 0x77: 'PUSH24',
    0x78: 'PUSH25', 0x79: 'PUSH26', 0x7a: 'PUSH27', 0x7b: 'PUSH28',
    0x7c: 'PUSH29', 0x7d: 'PUSH30', 0x7e: 'PUSH31', 0x7f: 'PUSH32',
    0x80: 'DUP1', 0x81: 'DUP2', 0x82: 'DUP3', 0x83: 'DUP4',
    0x84: 'DUP5', 0x85: 'DUP6', 0x86: 'DUP7', 0x87: 'DUP8',
    0x88: 'DUP9', 0x89: 'DUP10', 0x8a: 'DUP11', 0x8b: 'DUP12',
    0x8c: 'DUP13', 0x8d: 'DUP14', 0x8e: 'DUP15', 0x8f: 'DUP16',
    0x90: 'SWAP1', 0x91: 'SWAP2', 0x92: 'SWAP3', 0x93: 'SWAP4',
    0x94: 'SWAP5', 0x95: 'SWAP6', 0x96: 'SWAP7', 0x97: 'SWAP8',
    0x98: 'SWAP9', 0x99: 'SWAP10', 0x9a: 'SWAP11', 0x9b: 'SWAP12',
    0x9c: 'SWAP13', 0x9d: 'SWAP14', 0x9e: 'SWAP15', 0x9f: 'SWAP16',
    0xf3: 'RETURN',
    0xfd: 'REVERT',
    0xfe: 'INVALID',
    0xff: 'SELFDESTRUCT'
};

// Gas costs (simplified)
const GAS_COSTS: Record<string, number> = {
    'STOP': 0, 'ADD': 3, 'MUL': 5, 'SUB': 3, 'DIV': 5, 'SDIV': 5, 'MOD': 5,
    'LT': 3, 'GT': 3, 'SLT': 3, 'SGT': 3, 'EQ': 3, 'ISZERO': 3,
    'AND': 3, 'OR': 3, 'XOR': 3, 'NOT': 3,
    'PUSH0': 2,
    'POP': 2, 'MLOAD': 3, 'MSTORE': 3, 'SLOAD': 100, 'SSTORE': 5000,
    'JUMP': 8, 'JUMPI': 10, 'PC': 2, 'MSIZE': 2, 'GAS': 2, 'JUMPDEST': 1,
    'PUSH': 3, 'DUP': 3, 'SWAP': 3,
    'RETURN': 0, 'REVERT': 0, 'INVALID': 0
};

export interface ExecutionStep {
    pc: number;
    opcode: string;
    stack: string[];
    memory: number[];
    storage: Record<string, string>;
    gasUsed: number;
    gasRemaining: number;
}

export interface ExecutionResult {
    steps: ExecutionStep[];
    returnValue: string;
    success: boolean;
    error?: string;
}

/**
 * Simple EVM Interpreter
 */
export class SimpleEVM {
    private stack: bigint[] = [];
    private memory: number[] = [];
    private storage: Map<string, bigint> = new Map();
    private pc: number = 0;
    private gasRemaining: number;
    private gasUsed: number = 0;
    private steps: ExecutionStep[] = [];
    private stopped: boolean = false;

    constructor(gasLimit: number = 100000) {
        this.gasRemaining = gasLimit;
    }

    /**
     * Execute bytecode and return step-by-step results
     */
    execute(bytecode: Uint8Array): ExecutionResult {
        this.reset();
        const maxSteps = 1000; // Prevent infinite loops
        let stepCount = 0;

        while (this.pc < bytecode.length && !this.stopped && stepCount < maxSteps) {
            const opcode = bytecode[this.pc];
            const opcodeName = this.getOpcodeName(opcode);

            // Check gas
            const gasCost = this.getGasCost(opcodeName);
            if (this.gasRemaining < gasCost) {
                return this.createResult(false, 'Out of gas');
            }
            this.gasRemaining -= gasCost;
            this.gasUsed += gasCost;

            // Record state BEFORE execution (with operand if applicable)
            let operand: string | undefined;
            if (opcode >= 0x60 && opcode <= 0x7f) { // PUSH
                const numBytes = opcode - 0x5f;
                let value = BigInt(0);
                for (let i = 0; i < numBytes; i++) {
                    value = (value << BigInt(8)) | BigInt(bytecode[this.pc + 1 + i] || 0);
                }
                operand = '0x' + value.toString(16);
            }

            this.recordStep(opcodeName, operand);

            // Execute opcode
            try {
                this.executeOpcode(opcode, bytecode);
            } catch (err: any) {
                return this.createResult(false, err.message);
            }

            stepCount++;
        }

        if (stepCount >= maxSteps) {
            return this.createResult(false, 'Execution limit exceeded');
        }

        return this.createResult(true);
    }

    private reset() {
        this.stack = [];
        this.memory = [];
        this.storage = new Map();
        this.pc = 0;
        this.gasUsed = 0;
        this.steps = [];
        this.stopped = false;
    }

    private getOpcodeName(opcode: number): string {
        // Handle PUSH opcodes
        if (opcode >= 0x60 && opcode <= 0x7f) {
            return `PUSH${opcode - 0x5f}`;
        }
        // Handle DUP opcodes
        if (opcode >= 0x80 && opcode <= 0x8f) {
            return `DUP${opcode - 0x7f}`;
        }
        // Handle SWAP opcodes
        if (opcode >= 0x90 && opcode <= 0x9f) {
            return `SWAP${opcode - 0x8f}`;
        }
        return OPCODES[opcode] || `UNKNOWN(0x${opcode.toString(16)})`;
    }

    private getGasCost(opcodeName: string): number {
        if (opcodeName.startsWith('PUSH')) return GAS_COSTS['PUSH'];
        if (opcodeName.startsWith('DUP')) return GAS_COSTS['DUP'];
        if (opcodeName.startsWith('SWAP')) return GAS_COSTS['SWAP'];
        return GAS_COSTS[opcodeName] || 3;
    }

    private recordStep(opcodeName: string, operand?: string) {
        this.steps.push({
            pc: this.pc,
            opcode: operand ? `${opcodeName} ${operand}` : opcodeName,
            stack: this.stack.map(v => '0x' + v.toString(16)),
            memory: [...this.memory],
            storage: this.storageToObject(),
            gasUsed: this.gasUsed,
            gasRemaining: this.gasRemaining
        });
    }

    private storageToObject(): Record<string, string> {
        const obj: Record<string, string> = {};
        this.storage.forEach((value, key) => {
            obj[key] = '0x' + value.toString(16);
        });
        return obj;
    }

    private executeOpcode(opcode: number, bytecode: Uint8Array) {
        // STOP
        if (opcode === 0x00) {
            this.stopped = true;
            this.pc++;
            return;
        }

        // PUSH0 (Shannon/Shanghai)
        if (opcode === 0x5f) {
            this.stack.push(BigInt(0));
            this.pc++;
            return;
        }

        // PUSH1-PUSH32
        if (opcode >= 0x60 && opcode <= 0x7f) {
            const numBytes = opcode - 0x5f;
            let value = BigInt(0);
            for (let i = 0; i < numBytes; i++) {
                value = (value << BigInt(8)) | BigInt(bytecode[this.pc + 1 + i] || 0);
            }
            this.stack.push(value);
            this.pc += 1 + numBytes;
            return;
        }

        // DUP1-DUP16
        if (opcode >= 0x80 && opcode <= 0x8f) {
            const idx = opcode - 0x80;
            if (this.stack.length <= idx) throw new Error('Stack underflow');
            this.stack.push(this.stack[this.stack.length - 1 - idx]);
            this.pc++;
            return;
        }

        // SWAP1-SWAP16
        if (opcode >= 0x90 && opcode <= 0x9f) {
            const idx = opcode - 0x8f;
            if (this.stack.length <= idx) throw new Error('Stack underflow');
            const topIdx = this.stack.length - 1;
            const swapIdx = this.stack.length - 1 - idx;
            [this.stack[topIdx], this.stack[swapIdx]] = [this.stack[swapIdx], this.stack[topIdx]];
            this.pc++;
            return;
        }

        // Arithmetic & Logic
        switch (opcode) {
            case 0x01: // ADD
                this.binaryOp((a, b) => a + b);
                break;
            case 0x02: // MUL
                this.binaryOp((a, b) => a * b);
                break;
            case 0x03: // SUB
                this.binaryOp((a, b) => a - b);
                break;
            case 0x04: // DIV
                this.binaryOp((a, b) => b === BigInt(0) ? BigInt(0) : a / b);
                break;
            case 0x06: // MOD
                this.binaryOp((a, b) => b === BigInt(0) ? BigInt(0) : a % b);
                break;
            case 0x10: // LT
                this.binaryOp((a, b) => a < b ? BigInt(1) : BigInt(0));
                break;
            case 0x11: // GT
                this.binaryOp((a, b) => a > b ? BigInt(1) : BigInt(0));
                break;
            case 0x14: // EQ
                this.binaryOp((a, b) => a === b ? BigInt(1) : BigInt(0));
                break;
            case 0x15: // ISZERO
                this.unaryOp(a => a === BigInt(0) ? BigInt(1) : BigInt(0));
                break;
            case 0x16: // AND
                this.binaryOp((a, b) => a & b);
                break;
            case 0x17: // OR
                this.binaryOp((a, b) => a | b);
                break;
            case 0x18: // XOR
                this.binaryOp((a, b) => a ^ b);
                break;
            case 0x19: // NOT
                this.unaryOp(a => ~a & ((BigInt(1) << BigInt(256)) - BigInt(1)));
                break;
            case 0x50: // POP
                if (this.stack.length === 0) throw new Error('Stack underflow');
                this.stack.pop();
                this.pc++;
                break;
            case 0x52: // MSTORE
                this.mstore();
                break;
            case 0x54: // SLOAD
                this.sload();
                break;
            case 0x55: // SSTORE
                this.sstore();
                break;
            case 0x56: // JUMP
                this.jump();
                return; // Don't increment PC
            case 0x57: // JUMPI
                this.jumpi();
                return; // Don't increment PC
            case 0x58: // PC
                this.stack.push(BigInt(this.pc));
                this.pc++;
                break;
            case 0x5a: // GAS
                this.stack.push(BigInt(this.gasRemaining));
                this.pc++;
                break;
            case 0x5b: // JUMPDEST
                this.pc++;
                break;
            case 0xf3: // RETURN
                this.stopped = true;
                this.pc++;
                break;
            case 0xfd: // REVERT
                this.stopped = true;
                this.pc++;
                break;
            default:
                this.pc++;
        }
    }

    private binaryOp(fn: (a: bigint, b: bigint) => bigint) {
        if (this.stack.length < 2) throw new Error('Stack underflow');
        const a = this.stack.pop()!;
        const b = this.stack.pop()!;
        this.stack.push(fn(a, b));
        this.pc++;
    }

    private unaryOp(fn: (a: bigint) => bigint) {
        if (this.stack.length < 1) throw new Error('Stack underflow');
        const a = this.stack.pop()!;
        this.stack.push(fn(a));
        this.pc++;
    }

    private mstore() {
        if (this.stack.length < 2) throw new Error('Stack underflow');
        const offset = Number(this.stack.pop()!);
        const value = this.stack.pop()!;

        // Expand memory if needed
        while (this.memory.length < offset + 32) {
            this.memory.push(0);
        }

        // Store 32 bytes (big-endian)
        for (let i = 0; i < 32; i++) {
            this.memory[offset + i] = Number((value >> BigInt((31 - i) * 8)) & BigInt(0xff));
        }
        this.pc++;
    }

    private sload() {
        if (this.stack.length < 1) throw new Error('Stack underflow');
        const key = '0x' + this.stack.pop()!.toString(16);
        const value = this.storage.get(key) || BigInt(0);
        this.stack.push(value);
        this.pc++;
    }

    private sstore() {
        if (this.stack.length < 2) throw new Error('Stack underflow');
        const key = '0x' + this.stack.pop()!.toString(16);
        const value = this.stack.pop()!;
        this.storage.set(key, value);
        this.pc++;
    }

    private jump() {
        if (this.stack.length < 1) throw new Error('Stack underflow');
        this.pc = Number(this.stack.pop()!);
    }

    private jumpi() {
        if (this.stack.length < 2) throw new Error('Stack underflow');
        const dest = Number(this.stack.pop()!);
        const cond = this.stack.pop()!;
        this.pc = cond !== BigInt(0) ? dest : this.pc + 1;
    }

    private createResult(success: boolean, error?: string): ExecutionResult {
        return {
            steps: this.steps,
            returnValue: '',
            success,
            error
        };
    }
}

/**
 * Parse hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
    const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
    }
    return bytes;
}
