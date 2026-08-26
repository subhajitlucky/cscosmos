// CPU 5-stage pipeline + direct-mapped cache simulation kernels.
// Pure data structures and pure helpers - no browser APIs - safe for module scope.

/* ------------------------------ pipeline core ----------------------------- */

export type InstrKind = 'alu' | 'load' | 'store' | 'branch';

export interface Instr {
  id: number;
  kind: InstrKind;
  label: string;
  comment: string;
}

export const STAGE_NAMES: readonly string[] = ['Fetch', 'Decode', 'Execute', 'Mem', 'Writeback'];
export const STAGE_COUNT = STAGE_NAMES.length;

/** One residency of an instruction in the pipe. Ghosts are squashed speculative fetches. */
export interface PipeOccurrence {
  key: string;
  instrId: number;
  startCycle: number;
  /** Cycle at which speculation is cancelled; null for committed instructions. */
  killAt: number | null;
}

export interface PipelineSim {
  occurrences: PipeOccurrence[];
  totalCycles: number;
  squashed: number;
  branchResolveCycle: number | null;
}

const PROGRAM: Omit<Instr, 'id'>[] = [
  { kind: 'load', label: 'lw t0, A[0]', comment: 'load element 0' },
  { kind: 'alu', label: 'add s1, s1, t0', comment: 'running sum' },
  { kind: 'load', label: 'lw t0, A[1]', comment: 'load element 1' },
  { kind: 'alu', label: 'add s1, s1, t0', comment: 'running sum' },
  { kind: 'load', label: 'lw t0, A[2]', comment: 'load element 2' },
  { kind: 'alu', label: 'add s1, s1, t0', comment: 'running sum' },
  { kind: 'branch', label: 'bne t6, x0, sum', comment: 'loop back while counter nonzero' },
  { kind: 'alu', label: 'addi t6, t6, -1', comment: 'decrement counter' },
  { kind: 'store', label: 'sw s1, A[3]', comment: 'epilogue store' },
];

export function buildLoopProgram(): Instr[] {
  return PROGRAM.map((p, i) => ({ id: i, kind: p.kind, label: p.label, comment: p.comment }));
}

/**
 * In-order single-issue 5-stage schedule. Forwarding is assumed, so the only
 * modeled hazard is control: a mispredicted branch squashes the two speculative
 * fetches riding behind it and the correct path refills the pipe.
 */
export function simulatePipeline(mispredict: boolean): PipelineSim {
  const instrs = buildLoopProgram();
  const occurrences: PipeOccurrence[] = [];
  let nextFree = 1;
  let squashed = 0;
  let branchResolveCycle: number | null = null;
  for (const instr of instrs) {
    const start = nextFree;
    occurrences.push({
      key: 'i' + instr.id + '-a' + occurrences.length,
      instrId: instr.id,
      startCycle: start,
      killAt: null,
    });
    nextFree = start + 1;
    if (instr.kind === 'branch' && mispredict) {
      const resolve = start + 2; // branch sits in Execute during this cycle
      branchResolveCycle = resolve;
      for (let k = 1; k <= 2; k++) {
        const ghost = instrs[instr.id + k];
        if (!ghost) break;
        occurrences.push({
          key: 'i' + ghost.id + '-ghost',
          instrId: ghost.id,
          startCycle: start + k,
          killAt: resolve + 1,
        });
        squashed += 1;
      }
      nextFree = resolve + 1; // correct-path fetch restarts after resolution
    }
  }
  let totalCycles = 1;
  for (const o of occurrences) {
    const end = o.killAt ?? o.startCycle + STAGE_COUNT - 1;
    if (end > totalCycles) totalCycles = end;
  }
  return { occurrences, totalCycles, squashed, branchResolveCycle };
}

export interface FrameCell {
  occurrenceKey: string;
  instr: Instr;
  stage: number;
  ghost: boolean;
}

/** Who sits in each stage at a given cycle (index 0 = Fetch). */
export function frameCells(sim: PipelineSim, instrs: Instr[], cycle: number): (FrameCell | null)[] {
  const cells: (FrameCell | null)[] = new Array(STAGE_COUNT).fill(null);
  for (const o of sim.occurrences) {
    const stage = cycle - o.startCycle;
    if (stage < 0 || stage >= STAGE_COUNT) continue;
    if (o.killAt !== null && cycle >= o.killAt) continue;
    const instr = instrs[o.instrId];
    if (!instr) continue;
    cells[stage] = { occurrenceKey: o.key, instr, stage, ghost: o.killAt !== null };
  }
  return cells;
}

/** Retired (fully written-back) instruction count at a given cycle. */
export function retiredCount(sim: PipelineSim, cycle: number): number {
  const done = new Set<number>();
  for (const o of sim.occurrences) {
    if (o.killAt !== null) continue;
    if (o.startCycle + STAGE_COUNT - 1 <= cycle) done.add(o.instrId);
  }
  return done.size;
}

/* -------------------------------- cache core ------------------------------- */

export const ARRAY_LEN = 64;
export const WORDS_PER_BLOCK = 4;
export const CACHE_LINES = 16;

export interface AccessRecord {
  seq: number;
  pass: 1 | 2;
  index: number;
  block: number;
  line: number;
  hit: boolean;
}

/**
 * Sweep the array twice with the given stride against a direct-mapped cache.
 * Pass 1 exposes compulsory cold misses (and partial-block waste at coarse
 * strides); pass 2 shows warm hits once blocks are resident.
 */
export function runArrayPasses(stride: number, passes: 1 | 2): AccessRecord[] {
  const valid = new Array<boolean>(CACHE_LINES).fill(false);
  const tags = new Array<number>(CACHE_LINES).fill(-1);
  const recs: AccessRecord[] = [];
  let seq = 0;
  for (let pass = 1; pass <= passes; pass++) {
    for (let i = 0; i < ARRAY_LEN; i += stride) {
      const block = Math.floor(i / WORDS_PER_BLOCK);
      const line = block % CACHE_LINES;
      const hit = valid[line] && tags[line] === block;
      recs.push({ seq, pass: pass as 1 | 2, index: i, block, line, hit });
      seq += 1;
      valid[line] = true;
      tags[line] = block;
    }
  }
  return recs;
}

export function percent(part: number, total: number): string {
  if (total <= 0) return '0%';
  return Math.round((part / total) * 100) + '%';
}