// Automata workbench kernels + big-O growth-curve math.
// Pure data structures and pure helpers - no browser APIs - safe for module scope.

export const BOARD_W = 520;
export const BOARD_H = 320;
export const STATE_R = 24;

/* ------------------------------ machine core ------------------------------- */

export interface StateNode {
  id: number;
  x: number;
  y: number;
  final: boolean;
}

/** delta[from][symbol] = list of target state ids (empty or absent = no transition). */
export type Delta = Record<number, Record<string, number[]>>;

export interface Machine {
  states: StateNode[];
  alphabet: string[];
  delta: Delta;
  start: number;
}

export function presetEvenAs(): Machine {
  // accepts every string whose number of a-symbols is even
  return {
    states: [
      { id: 0, x: 140, y: 160, final: true },
      { id: 1, x: 380, y: 160, final: false },
    ],
    alphabet: ['a', 'b'],
    delta: {
      0: { a: [1], b: [0] },
      1: { a: [0], b: [1] },
    },
    start: 0,
  };
}

export function presetEndsAb(): Machine {
  // accepts exactly the strings ending in the suffix ab
  return {
    states: [
      { id: 0, x: 100, y: 160, final: false },
      { id: 1, x: 260, y: 90, final: false },
      { id: 2, x: 420, y: 160, final: true },
    ],
    alphabet: ['a', 'b'],
    delta: {
      0: { a: [1], b: [0] },
      1: { a: [1], b: [2] },
      2: { a: [1], b: [0] },
    },
    start: 0,
  };
}

/** One NFA step: union of all targets from every current state. */
export function stepMachine(m: Machine, current: number[], sym: string): number[] {
  const out = new Set<number>();
  for (const s of current) {
    const targets = m.delta[s] ? m.delta[s][sym] : undefined;
    if (!targets) continue;
    for (const t of targets) out.add(t);
  }
  return Array.from(out).sort((a, b) => a - b);
}

export function isAccepting(m: Machine, states: number[]): boolean {
  return states.some((s) => {
    const n = m.states.find((x) => x.id === s);
    return n ? n.final : false;
  });
}

/* --------------------------- pure editing helpers --------------------------- */

const SLOTS: readonly [number, number][] = [
  [80, 80],
  [260, 60],
  [440, 80],
  [80, 240],
  [260, 260],
  [440, 240],
];

function nextSlot(m: Machine): [number, number] {
  for (const s of SLOTS) {
    const taken = m.states.some((st) => Math.abs(st.x - s[0]) < 10 && Math.abs(st.y - s[1]) < 10);
    if (!taken) return s;
  }
  const last = m.states[m.states.length - 1];
  const baseX = last ? last.x : 40;
  const baseY = last ? last.y : 40;
  return [Math.max(40, (baseX + 60) % (BOARD_W - 60)), Math.max(40, (baseY + 70) % (BOARD_H - 60))];
}

export function withAddedState(m: Machine): Machine {
  let id = 0;
  for (const s of m.states) id = Math.max(id, s.id + 1);
  const slot = nextSlot(m);
  const delta: Delta = Object.assign({}, m.delta);
  delta[id] = {};
  return Object.assign({}, m, {
    states: m.states.concat({ id, x: slot[0], y: slot[1], final: false }),
    delta,
  });
}

export function withRemovedState(m: Machine, id: number): Machine {
  if (m.states.length <= 1 || id === m.start) return m;
  const states = m.states.filter((s) => s.id !== id);
  const delta: Delta = {};
  for (const key of Object.keys(m.delta)) {
    const from = Number(key);
    if (from === id) continue;
    const row: Record<string, number[]> = {};
    for (const sym of Object.keys(m.delta[from])) {
      row[sym] = m.delta[from][sym].filter((t) => t !== id);
    }
    delta[from] = row;
  }
  return Object.assign({}, m, { states, delta });
}

export function withMovedState(m: Machine, id: number, x: number, y: number): Machine {
  return Object.assign({}, m, {
    states: m.states.map((s) => (s.id === id ? Object.assign({}, s, { x, y }) : s)),
  });
}

export function withToggledFinal(m: Machine, id: number): Machine {
  return Object.assign({}, m, {
    states: m.states.map((s) => (s.id === id ? Object.assign({}, s, { final: !s.final }) : s)),
  });
}

export function withNewStart(m: Machine, id: number): Machine {
  return Object.assign({}, m, { start: id });
}

export function withToggledTransition(m: Machine, from: number, sym: string, to: number): Machine {
  const row: Record<string, number[]> = Object.assign({}, m.delta[from]);
  const cur = row[sym] ? row[sym].slice() : [];
  const idx = cur.indexOf(to);
  if (idx >= 0) cur.splice(idx, 1);
  else cur.push(to);
  row[sym] = cur.sort((a, b) => a - b);
  const delta: Delta = Object.assign({}, m.delta);
  delta[from] = row;
  return Object.assign({}, m, { delta });
}

export function withAlphabetAdd(m: Machine, letter: string): Machine {
  if (m.alphabet.includes(letter) || m.alphabet.length >= 5) return m;
  return Object.assign({}, m, { alphabet: m.alphabet.concat([letter]) });
}

export function withAlphabetRemove(m: Machine, letter: string): Machine {
  if (!m.alphabet.includes(letter)) return m;
  const delta: Delta = {};
  for (const key of Object.keys(m.delta)) {
    const row: Record<string, number[]> = {};
    for (const sym of Object.keys(m.delta[Number(key)])) {
      if (sym !== letter) row[sym] = m.delta[Number(key)][sym];
    }
    delta[Number(key)] = row;
  }
  return Object.assign({}, m, {
    alphabet: m.alphabet.filter((c) => c !== letter),
    delta,
  });
}

export interface MachineIssue {
  kind: 'nondet' | 'missing';
  text: string;
}

/** Determinism and completeness notes shown under the transition table. */
export function dfaIssues(m: Machine): MachineIssue[] {
  const issues: MachineIssue[] = [];
  for (const st of m.states) {
    for (const sym of m.alphabet) {
      const targets = m.delta[st.id] ? m.delta[st.id][sym] : undefined;
      if (!targets || targets.length === 0) {
        issues.push({ kind: 'missing', text: 'q' + st.id + ' --' + sym + '-- has no target (implicit trap)' });
      } else if (targets.length > 1) {
        const set = targets
          .map((t) => 'q' + t)
          .join(', ');
        issues.push({ kind: 'nondet', text: 'q' + st.id + ' --' + sym + '-- {' + set + '} - NFA branch' });
      }
    }
  }
  return issues.slice(0, 6);
}

/* ----------------------------- growth curves -------------------------------- */

export type GrowthFn = (n: number) => number;

export interface GrowthCurve {
  key: string;
  label: string;
  fn: GrowthFn;
}

export const GROWTH_CURVES: GrowthCurve[] = [
  { key: 'const', label: 'O(1)', fn: () => 1 },
  { key: 'log', label: 'O(log n)', fn: (n) => Math.log2(Math.max(2, n)) },
  { key: 'linear', label: 'O(n)', fn: (n) => n },
  { key: 'linlog', label: 'O(n log n)', fn: (n) => n * Math.log2(Math.max(2, n)) },
  { key: 'quad', label: 'O(n^2)', fn: (n) => n * n },
  { key: 'exp', label: 'O(2^n)', fn: (n) => Math.pow(2, Math.min(n, 512)) },
];

export interface GrowthPaths {
  curves: { key: string; points: string }[];
  maxY: number;
}

/** Sampled polyline points for each curve over n in [1, nMax]. */
export function buildGrowthPaths(nMax: number, samples: number, w: number, h: number, logScale: boolean): GrowthPaths {
  const grid: number[][] = GROWTH_CURVES.map(() => []);
  let maxV = 0;
  for (let i = 0; i <= samples; i++) {
    const n = Math.max(1, Math.round((i / samples) * nMax));
    for (let c = 0; c < GROWTH_CURVES.length; c++) {
      const raw = GROWTH_CURVES[c].fn(n);
      const v = logScale ? Math.log2(1 + raw) : raw;
      grid[c].push(v);
      if (v > maxV) maxV = v;
    }
  }
  const safeMax = maxV > 0 ? maxV : 1;
  const curves = grid.map((ys, c) => ({
    key: GROWTH_CURVES[c].key,
    points: ys
      .map((v, i) => {
        const px = (i / (ys.length - 1)) * w;
        const py = h - Math.min(1, v / safeMax) * h;
        return px.toFixed(1) + ',' + py.toFixed(1);
      })
      .join(' '),
  }));
  return { curves, maxY: safeMax };
}

export function formatBig(v: number): string {
  if (v < 1000) return String(Math.round(v * 10) / 10);
  const exp = Math.floor(Math.log10(v));
  const mant = v / Math.pow(10, exp);
  return mant.toFixed(1) + 'e' + exp;
}
