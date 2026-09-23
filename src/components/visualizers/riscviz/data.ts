// RV32I instruction encoding, a tiny stepping interpreter and an SoC
// address-map builder. Pure deterministic helpers - safe for module scope.

export type InsnKind = 'add' | 'addi' | 'lw' | 'sw' | 'beq' | 'jal';
export type InsnFormat = 'R' | 'I' | 'S' | 'B' | 'J';

export interface FieldSpan {
  name: string;
  hi: number;
  lo: number;
}

const LAYOUTS: Record<InsnFormat, FieldSpan[]> = {
  R: [
    { name: 'funct7', hi: 31, lo: 25 },
    { name: 'rs2', hi: 24, lo: 20 },
    { name: 'rs1', hi: 19, lo: 15 },
    { name: 'funct3', hi: 14, lo: 12 },
    { name: 'rd', hi: 11, lo: 7 },
    { name: 'opcode', hi: 6, lo: 0 },
  ],
  I: [
    { name: 'imm[11:0]', hi: 31, lo: 20 },
    { name: 'rs1', hi: 19, lo: 15 },
    { name: 'funct3', hi: 14, lo: 12 },
    { name: 'rd', hi: 11, lo: 7 },
    { name: 'opcode', hi: 6, lo: 0 },
  ],
  S: [
    { name: 'imm[11:5]', hi: 31, lo: 25 },
    { name: 'rs2', hi: 24, lo: 20 },
    { name: 'rs1', hi: 19, lo: 15 },
    { name: 'funct3', hi: 14, lo: 12 },
    { name: 'imm[4:0]', hi: 11, lo: 7 },
    { name: 'opcode', hi: 6, lo: 0 },
  ],
  B: [
    { name: 'imm[12|10:5]', hi: 31, lo: 25 },
    { name: 'rs2', hi: 24, lo: 20 },
    { name: 'rs1', hi: 19, lo: 15 },
    { name: 'funct3', hi: 14, lo: 12 },
    { name: 'imm[4:1|11]', hi: 11, lo: 7 },
    { name: 'opcode', hi: 6, lo: 0 },
  ],
  J: [
    { name: 'imm[20|10:1]', hi: 31, lo: 21 },
    { name: 'imm[11]', hi: 20, lo: 20 },
    { name: 'imm[19:12]', hi: 19, lo: 12 },
    { name: 'rd', hi: 11, lo: 7 },
    { name: 'opcode', hi: 6, lo: 0 },
  ],
};

export interface InsnDef {
  kind: InsnKind;
  asm: string;
  fmt: InsnFormat;
  opcode: string;
  funct3?: string;
  funct7?: string;
  desc: string;
}

export const INSN_DEFS: Record<InsnKind, InsnDef> = {
  add:  { kind: 'add',  asm: 'add rd, rs1, rs2',   fmt: 'R', opcode: '0110011', funct3: '000', funct7: '0000000', desc: 'rd = rs1 + rs2' },
  addi: { kind: 'addi', asm: 'addi rd, rs1, imm',  fmt: 'I', opcode: '0010011', funct3: '000', desc: 'rd = rs1 + signext(imm)' },
  lw:   { kind: 'lw',   asm: 'lw rd, imm(rs1)',    fmt: 'I', opcode: '0000011', funct3: '010', desc: 'rd = Mem32[rs1 + imm]' },
  sw:   { kind: 'sw',   asm: 'sw rs2, imm(rs1)',   fmt: 'S', opcode: '0100011', funct3: '010', desc: 'Mem32[rs1 + imm] = rs2' },
  beq:  { kind: 'beq',  asm: 'beq rs1, rs2, imm',  fmt: 'B', opcode: '1100011', funct3: '000', desc: 'if rs1 == rs2: pc += imm' },
  jal:  { kind: 'jal',  asm: 'jal rd, imm',        fmt: 'J', opcode: '1101111', desc: 'rd = pc+4; pc += imm' },
};

export const INSN_ORDER: readonly InsnKind[] = ['add', 'addi', 'lw', 'sw', 'beq', 'jal'];

/* ---------------------------------- encoding ---------------------------------- */

function u(value: number, width: number): number {
  return value & ((1 << width) - 1);
}

function regBits(reg: number): number {
  return u(reg, 5);
}

export interface FieldValue {
  name: string;
  hi: number;
  lo: number;
  binary: string;
}

export interface BitCell {
  bit: number;
  val: 0 | 1;
  field: string;
}

export interface Encoded {
  word: number;
  hex: string;
  binary: string;
  fields: FieldValue[];
  cells: BitCell[];
}

export interface Operands {
  rd?: number;
  rs1?: number;
  rs2?: number;
  imm?: number;
}

/** Build the exact 32-bit word for the given instruction instance. */
export function encodeInsn(kind: InsnKind, ops: Operands): Encoded {
  const def = INSN_DEFS[kind];
  let word = parseInt(def.opcode, 2);
  const put = (hi: number, lo: number, value: number): void => {
    const width = hi - lo + 1;
    word |= u(value, width) << lo;
  };
  const imm = ops.imm ?? 0;
  switch (def.fmt) {
    case 'R':
      put(31, 25, parseInt(def.funct7 ?? '0', 2));
      put(24, 20, regBits(ops.rs2 ?? 0));
      put(19, 15, regBits(ops.rs1 ?? 0));
      put(14, 12, parseInt(def.funct3 ?? '0', 2));
      put(11, 7, regBits(ops.rd ?? 0));
      break;
    case 'I':
      put(31, 20, u(imm, 12));
      put(19, 15, regBits(ops.rs1 ?? 0));
      put(14, 12, parseInt(def.funct3 ?? '0', 2));
      put(11, 7, regBits(ops.rd ?? 0));
      break;
    case 'S':
      put(31, 25, u(imm >> 5, 7));
      put(24, 20, regBits(ops.rs2 ?? 0));
      put(19, 15, regBits(ops.rs1 ?? 0));
      put(14, 12, parseInt(def.funct3 ?? '0', 2));
      put(11, 7, u(imm, 5));
      break;
    case 'B': {
      const b = imm & 0x1ffe;
      put(31, 25, ((b >> 12) & 1) << 6 | ((b >> 5) & 0x3f));
      put(24, 20, regBits(ops.rs2 ?? 0));
      put(19, 15, regBits(ops.rs1 ?? 0));
      put(14, 12, parseInt(def.funct3 ?? '0', 2));
      put(11, 7, ((b >> 1) & 0xf) << 1 | ((b >> 11) & 1));
      break;
    }
    case 'J': {
      const j = imm & 0x1fffff;
      put(31, 25, ((j >> 20) & 1) << 6 | ((j >> 1) & 0x3f));
      put(24, 21, (j >> 5) & 0xf);
      put(20, 20, (j >> 11) & 1);
      put(19, 12, (j >> 12) & 0xff);
      put(11, 7, regBits(ops.rd ?? 0));
      break;
    }
  }
  const fields: FieldValue[] = LAYOUTS[def.fmt].map((span) => {
    const width = span.hi - span.lo + 1;
    const slice = (word >>> span.lo) & ((1 << width) - 1);
    return { ...span, binary: slice.toString(2).padStart(width, '0') };
  });
  const cells: BitCell[] = [];
  for (let bit = 31; bit >= 0; bit--) {
    const owner = LAYOUTS[def.fmt].find((s) => bit <= s.hi && bit >= s.lo);
    cells.push({ bit, val: ((word >>> bit) & 1) as 0 | 1, field: owner ? owner.name : '?' });
  }
  return {
    word,
    hex: '0x' + (word >>> 0).toString(16).toUpperCase().padStart(8, '0'),
    binary: fields.map((f) => f.binary).join(' '),
    fields,
    cells,
  };
}

/* ------------------------------- demo program -------------------------------- */

export interface ProgStep {
  kind: InsnKind;
  rd?: number;
  rs1?: number;
  rs2?: number;
  imm?: number;
  comment: string;
}

export const DEMO_PROGRAM: readonly ProgStep[] = [
  { kind: 'addi', rd: 1, rs1: 0, imm: 5, comment: 'x1 = 5' },
  { kind: 'addi', rd: 2, rs1: 0, imm: 7, comment: 'x2 = 7' },
  { kind: 'add', rd: 3, rs1: 1, rs2: 2, comment: 'x3 = x1 + x2 = 12' },
  { kind: 'sw', rs1: 0, rs2: 3, imm: 256, comment: 'Mem[0x100] = x3' },
  { kind: 'lw', rd: 4, rs1: 0, imm: 256, comment: 'x4 = Mem[0x100]' },
  { kind: 'beq', rs1: 3, rs2: 4, imm: 8, comment: 'store-load matched: skip the trap' },
  { kind: 'addi', rd: 5, rs1: 0, imm: 99, comment: 'only reached if compare failed' },
  { kind: 'jal', rd: 0, imm: 0, comment: 'jump to self: program halts here' },
];

export interface CpuState {
  pc: number;
  regs: number[];
  mem: Record<number, number>;
  halted: boolean;
  trace: string;
}

export function initialCpu(): CpuState {
  return { pc: 0, regs: new Array(32).fill(0), mem: {}, halted: false, trace: 'reset' };
}

/** One retire-per-step execution over DEMO_PROGRAM; x0 stays hardwired to zero. */
export function stepCpu(state: CpuState): CpuState {
  if (state.halted) return state;
  const idx = Math.floor(state.pc / 4);
  const step = DEMO_PROGRAM[idx];
  if (!step) return { ...state, halted: true, trace: 'pc ran past the program' };
  const regs = [...state.regs];
  const mem = { ...state.mem };
  let nextPc = state.pc + 4;
  let trace = '';
  switch (step.kind) {
    case 'addi':
      regs[step.rd ?? 0] = regs[step.rs1 ?? 0] + (step.imm ?? 0);
      trace = 'x' + step.rd + ' = ' + regs[step.rd ?? 0];
      break;
    case 'add':
      regs[step.rd ?? 0] = regs[step.rs1 ?? 0] + regs[step.rs2 ?? 0];
      trace = 'x' + step.rd + ' = x' + step.rs1 + ' + x' + step.rs2 + ' = ' + regs[step.rd ?? 0];
      break;
    case 'sw': {
      const addr = regs[step.rs1 ?? 0] + (step.imm ?? 0);
      mem[addr] = regs[step.rs2 ?? 0];
      trace = 'Mem[0x' + addr.toString(16) + '] = ' + mem[addr];
      break;
    }
    case 'lw': {
      const addr = regs[step.rs1 ?? 0] + (step.imm ?? 0);
      regs[step.rd ?? 0] = mem[addr] ?? 0;
      trace = 'x' + step.rd + ' = Mem[0x' + addr.toString(16) + '] = ' + regs[step.rd ?? 0];
      break;
    }
    case 'beq':
      if (regs[step.rs1 ?? 0] === regs[step.rs2 ?? 0]) nextPc = state.pc + (step.imm ?? 0);
      trace = 'compare x' + step.rs1 + ' vs x' + step.rs2 + (nextPc !== state.pc + 4 ? ': taken' : ': not taken');
      break;
    case 'jal': {
      const target = state.pc + (step.imm ?? 0);
      regs[step.rd ?? 0] = state.pc + 4;
      trace = 'x' + step.rd + ' = ' + (state.pc + 4) + ', jump to ' + target;
      nextPc = target;
      break;
    }
  }
  regs[0] = 0;
  const idxNext = Math.floor(nextPc / 4);
  const selfLoop = step.kind === 'jal' && (step.imm ?? 0) === 0;
  const halted = selfLoop || idxNext < 0 || idxNext >= DEMO_PROGRAM.length;
  return {
    pc: halted && selfLoop ? nextPc : nextPc,
    regs,
    mem,
    halted,
    trace,
  };
}

export function disassemble(step: ProgStep): string {
  const r = (n?: number): string => 'x' + (n ?? 0);
  switch (step.kind) {
    case 'add':
      return 'add x' + step.rd + ', x' + step.rs1 + ', x' + step.rs2;
    case 'addi':
      return 'addi x' + step.rd + ', x' + step.rs1 + ', ' + step.imm;
    case 'lw':
      return 'lw x' + step.rd + ', ' + step.imm + '(x' + step.rs1 + ')';
    case 'sw':
      return 'sw x' + step.rs2 + ', ' + step.imm + '(x' + step.rs1 + ')';
    case 'beq':
      return 'beq x' + step.rs1 + ', x' + step.rs2 + ', pc+' + step.imm;
    case 'jal':
      return 'jal x' + step.rd + ', pc+' + step.imm;
  }
}

/* --------------------------------- SoC corner --------------------------------- */

export interface SocBlock {
  id: string;
  name: string;
  role: string;
  base: number;
  sizeKB: number;
  fixed: boolean;
}

export const SOC_BLOCKS: readonly SocBlock[] = [
  { id: 'core', name: 'RV32I core', role: '2-stage in-order pipeline, 32 regs', base: 0, sizeKB: 0, fixed: true },
  { id: 'sram', name: 'SRAM', role: 'scratchpad memory the demo stores into', base: 0x00000000, sizeKB: 64, fixed: false },
  { id: 'uart', name: 'UART 16550', role: 'serial console prints hello world', base: 0x10000000, sizeKB: 4, fixed: false },
  { id: 'gpio', name: 'GPIO', role: '8 controllable pins for an LED blink', base: 0x10012000, sizeKB: 4, fixed: false },
];

export interface AddrRow {
  id: string;
  name: string;
  baseHex: string;
  endHex: string;
  sizeLabel: string;
}

/** Rebuild the memory map from whichever peripherals are enabled right now. */
export function buildAddressMap(enabledIds: ReadonlySet<string>): AddrRow[] {
  return SOC_BLOCKS.filter((b) => b.sizeKB > 0 && enabledIds.has(b.id))
    .sort((a, b) => a.base - b.base)
    .map((b) => ({
      id: b.id,
      name: b.name,
      baseHex: '0x' + b.base.toString(16).toUpperCase().padStart(8, '0'),
      endHex: '0x' + (b.base + b.sizeKB * 1024 - 1).toString(16).toUpperCase().padStart(8, '0'),
      sizeLabel: b.sizeKB >= 1024 ? (b.sizeKB / 1024) + ' MB' : b.sizeKB + ' KB',
    }));
}
