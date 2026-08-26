// Quantum-circuit simulation kernels: state vectors, gate application,
// shot sampling and separability checks.
// Pure data structures and helpers - no browser APIs - safe for module scope.

/* --------------------------------- complex --------------------------------- */

export interface Cx {
  re: number;
  im: number;
}

export const CX_ZERO: Cx = { re: 0, im: 0 };
const cx = (re: number, im: number): Cx => ({ re, im });
const mul = (a: Cx, b: Cx): Cx => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const add = (a: Cx, b: Cx): Cx => ({ re: a.re + b.re, im: a.im + b.im });
export const mag = (a: Cx): number => Math.sqrt(a.re * a.re + a.im * a.im);

/** Phase angle in degrees, normalized to [0, 360). */
export function phaseDeg(a: Cx): number {
  const deg = (Math.atan2(a.im, a.re) * 180) / Math.PI;
  return deg < 0 ? deg + 360 : deg;
}

/* ------------------------------ circuit model ------------------------------ */

export const MAX_WIRES = 3;
export const MAX_COLS = 12;

export type GateKind = 'H' | 'X' | 'Z' | 'CNOT' | 'M';

export interface Placement {
  id: number;
  col: number;
  kind: GateKind;
  /** Main wire; for CNOT this is the CONTROL wire. */
  wire: number;
  /** Only for CNOT: the TARGET wire. */
  targetWire?: number;
}

export function makePlacements(raw: Omit<Placement, 'id'>[]): Placement[] {
  return raw.map((p, i) => ({ ...p, id: i + 1 }));
}

/** |00...0> start. */
export function emptyState(nWires: number): Cx[] {
  const dim = 2 ** nWires;
  const s: Cx[] = new Array(dim);
  for (let i = 0; i < dim; i++) s[i] = i === 0 ? cx(1, 0) : cx(0, 0);
  return s;
}

/** Qubit `wire` is the bit at position (nWires-1-wire) counting from LSB? No: qubit 0 is the MOST significant bit. */
function bitOf(index: number, wire: number, nWires: number): number {
  return (index >> (nWires - 1 - wire)) & 1;
}

const INV_SQRT2 = 1 / Math.sqrt(2);

/** Apply an arbitrary 2x2 unitary [[m00,m01],[m10,m11]] to one wire. */
function applySingle(
  state: Cx[],
  nWires: number,
  wire: number,
  m00: Cx,
  m01: Cx,
  m10: Cx,
  m11: Cx,
): Cx[] {
  const out = state.map((c) => ({ ...c }));
  const dim = state.length;
  const stride = 2 ** (nWires - 1 - wire);
  for (let i = 0; i < dim; i++) {
    if (bitOf(i, wire, nWires) !== 0) continue;
    const i0 = i;
    const i1 = i + stride;
    const a0 = state[i0];
    const a1 = state[i1];
    out[i0] = add(mul(m00, a0), mul(m01, a1));
    out[i1] = add(mul(m10, a0), mul(m11, a1));
  }
  return out;
}

export function applyH(state: Cx[], nWires: number, wire: number): Cx[] {
  return applySingle(state, nWires, wire, cx(INV_SQRT2, 0), cx(INV_SQRT2, 0), cx(INV_SQRT2, 0), cx(-INV_SQRT2, 0));
}

export function applyX(state: Cx[], nWires: number, wire: number): Cx[] {
  return applySingle(state, nWires, wire, CX_ZERO, cx(1, 0), cx(1, 0), CX_ZERO);
}

export function applyZ(state: Cx[], nWires: number, wire: number): Cx[] {
  return applySingle(state, nWires, wire, cx(1, 0), CX_ZERO, CX_ZERO, cx(-1, 0));
}

export function applyCNOT(state: Cx[], nWires: number, control: number, target: number): Cx[] {
  const out = state.map((c) => ({ ...c }));
  const dim = state.length;
  for (let i = 0; i < dim; i++) {
    if (bitOf(i, control, nWires) !== 1) continue;
    if (bitOf(i, target, nWires) !== 0) continue;
    const j = i | (1 << (nWires - 1 - target));
    const tmp = { ...out[i] };
    out[i] = { ...out[j] };
    out[j] = tmp;
  }
  return out;
}

/** Evolve |0..0> through every placement in column order (measurement gates are annotations). */
export function runCircuit(nWires: number, placements: Placement[]): Cx[] {
  let state = emptyState(nWires);
  const ordered = [...placements].sort((a, b) => a.col - b.col || a.wire - b.wire);
  for (const p of ordered) {
    if (p.kind === 'M') continue;
    if (p.kind === 'CNOT') {
      if (p.targetWire === undefined || p.targetWire === p.wire) continue;
      state = applyCNOT(state, nWires, p.wire, p.targetWire);
    } else if (p.kind === 'H') {
      state = applyH(state, nWires, p.wire);
    } else if (p.kind === 'X') {
      state = applyX(state, nWires, p.wire);
    } else {
      state = applyZ(state, nWires, p.wire);
    }
  }
  return state;
}

export function bitstring(index: number, nWires: number): string {
  let s = '';
  for (let w = 0; w < nWires; w++) s += String(bitOf(index, w, nWires));
  return s;
}

/** Sample the computational basis `shots` times according to |amplitude|^2. */
export function sampleShots(state: Cx[], shots: number): { label: string; index: number; counts: number }[] {
  const nWires = Math.log2(state.length);
  const cum: number[] = [];
  let acc = 0;
  for (const a of state) {
    acc += a.re * a.re + a.im * a.im;
    cum.push(acc);
  }
  const tally = new Map<number, number>();
  for (let s = 0; s < shots; s++) {
    const r = Math.random() * (acc || 1);
    let idx = cum.length - 1;
    for (let k = 0; k < cum.length; k++) {
      if (r <= cum[k]) {
        idx = k;
        break;
      }
    }
    tally.set(idx, (tally.get(idx) ?? 0) + 1);
  }
  const rows = [...tally.entries()]
    .map(([index, counts]) => ({ label: bitstring(index, nWires), index, counts }))
    .sort((a, b) => b.counts - a.counts);
  return rows;
}

/**
 * Purity Tr(rho_0^2) of qubit 0's reduced density matrix.
 * Exactly 1 for separable states, below 1 once entangled with the rest.
 */
export function qubit0Purity(state: Cx[]): number {
  const dim = state.length;
  const half = dim / 2;
  let r00 = 0;
  let r11 = 0;
  let r01re = 0;
  let r01im = 0;
  for (let j = 0; j < half; j++) {
    const a0 = state[j];
    const a1 = state[j + half];
    r00 += a0.re * a0.re + a0.im * a0.im;
    r11 += a1.re * a1.re + a1.im * a1.im;
    r01re += a0.re * a1.re + a0.im * a1.im;
    r01im += a0.im * a1.re - a0.re * a1.im;
  }
  return r00 * r00 + r11 * r11 + 2 * (r01re * r01re + r01im * r01im);
}

const PURITY_EPSILON = 1 - 1e-9;

/** A multi-qubit system is entangled when qubit 0's reduced state is mixed. */
export function isEntangled(state: Cx[]): boolean {
  if (state.length < 4) return false; // need at least two qubits
  return qubit0Purity(state) < PURITY_EPSILON;
}

/* ----------------------------- prebuilt circuits ---------------------------- */

export interface Prebuilt {
  key: string;
  name: string;
  description: string;
  nWires: number;
  placements: Placement[];
}

export const PREBUILTS: readonly Prebuilt[] = [
  {
    key: 'bell',
    name: 'Bell pair',
    description: 'H then CNOT: maximally entangled - measuring one qubit decides both.',
    nWires: 2,
    placements: makePlacements([
      { col: 0, kind: 'H', wire: 0 },
      { col: 1, kind: 'CNOT', wire: 0, targetWire: 1 },
      { col: 2, kind: 'M', wire: 0 },
      { col: 2, kind: 'M', wire: 1 },
    ]),
  },
  {
    key: 'superposition',
    name: 'Superposition basics',
    description: 'Hadamards put each qubit in an even blend of 0 and 1 - four outcomes, 25% each.',
    nWires: 2,
    placements: makePlacements([
      { col: 0, kind: 'H', wire: 0 },
      { col: 0, kind: 'H', wire: 1 },
      { col: 1, kind: 'M', wire: 0 },
      { col: 1, kind: 'M', wire: 1 },
    ]),
  },
  {
    key: 'grover',
    name: 'Grover search (toy)',
    description: 'One iteration over 2 qubits amplifies the marked item |11> from 25% to ~100%.',
    nWires: 2,
    placements: makePlacements([
      // uniform superposition
      { col: 0, kind: 'H', wire: 0 },
      { col: 0, kind: 'H', wire: 1 },
      // oracle CZ = H(target) . CNOT . H(target): phase-flips |11> only
      { col: 1, kind: 'H', wire: 1 },
      { col: 2, kind: 'CNOT', wire: 0, targetWire: 1 },
      { col: 3, kind: 'H', wire: 1 },
      // diffuser = H^2 . X^2 . CZ . X^2 . H^2
      { col: 4, kind: 'H', wire: 0 },
      { col: 4, kind: 'H', wire: 1 },
      { col: 5, kind: 'X', wire: 0 },
      { col: 5, kind: 'X', wire: 1 },
      { col: 6, kind: 'H', wire: 1 },
      { col: 7, kind: 'CNOT', wire: 0, targetWire: 1 },
      { col: 8, kind: 'H', wire: 1 },
      { col: 9, kind: 'X', wire: 0 },
      { col: 9, kind: 'X', wire: 1 },
      { col: 10, kind: 'H', wire: 0 },
      { col: 10, kind: 'H', wire: 1 },
      { col: 11, kind: 'M', wire: 0 },
      { col: 11, kind: 'M', wire: 1 },
    ]),
  },
];
