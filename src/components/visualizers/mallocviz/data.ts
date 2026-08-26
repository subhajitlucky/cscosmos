// Heap allocator sandbox model. Pure data + pure functions - no browser APIs.

export const HEAP_SIZE = 64;

export type Strategy = 'first' | 'best';

export interface Allocation {
  id: number;
  label: string;
  start: number;
  len: number;
}

export interface HeapState {
  /** Alloc id per block, or null when the block is free. */
  cells: (number | null)[];
  allocs: Record<number, Allocation>;
  nextId: number;
  failures: number;
}

export const STRATS: { key: Strategy; label: string; sub: string }[] = [
  { key: 'first', label: 'First-Fit', sub: 'take the first hole big enough' },
  { key: 'best', label: 'Best-Fit', sub: 'take the tightest hole big enough' },
];

const LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function labelOf(id: number): string {
  return LABELS[id % LABELS.length];
}

export function newHeap(): HeapState {
  return { cells: Array(HEAP_SIZE).fill(null), allocs: {}, nextId: 0, failures: 0 };
}

function findHole(cells: (number | null)[], size: number, strat: Strategy): number {
  let i = 0;
  let bestStart = -1;
  let bestLen = HEAP_SIZE + 1;
  while (i < HEAP_SIZE) {
    if (cells[i] !== null) {
      i += 1;
      continue;
    }
    let j = i;
    while (j < HEAP_SIZE && cells[j] === null) j += 1;
    const len = j - i;
    if (len >= size) {
      if (strat === 'first') return i;
      if (len < bestLen) {
        bestLen = len;
        bestStart = i;
      }
    }
    i = j;
  }
  return bestStart;
}

export interface OpResult {
  heap: HeapState;
  ok: boolean;
  note: string;
}

export function malloc(state: HeapState, size: number, strat: Strategy): OpResult {
  const cells = [...state.cells];
  const start = findHole(cells, size, strat);
  if (start < 0) {
    return {
      heap: { ...state, failures: state.failures + 1 },
      ok: false,
      note: `malloc(${size}) -> NULL  (no free run big enough)`,
    };
  }
  const id = state.nextId;
  for (let k = start; k < start + size; k++) cells[k] = id;
  const alloc: Allocation = { id, label: labelOf(id), start, len: size };
  return {
    heap: { ...state, cells, allocs: { ...state.allocs, [id]: alloc }, nextId: id + 1 },
    ok: true,
    note: `malloc(${size}) -> '${alloc.label}' @ blocks ${start}-${start + size - 1}`,
  };
}

export function freeAlloc(state: HeapState, id: number): OpResult {
  const alloc = state.allocs[id];
  if (!alloc) {
    return { heap: state, ok: false, note: `free('${labelOf(id)}') - invalid handle` };
  }
  const leftFree = alloc.start > 0 && state.cells[alloc.start - 1] === null;
  const rightEnd = alloc.start + alloc.len;
  const rightFree = rightEnd < HEAP_SIZE && state.cells[rightEnd] === null;
  const cells = [...state.cells];
  for (let k = alloc.start; k < rightEnd; k++) cells[k] = null;
  const rest: Record<number, Allocation> = {};
  for (const key of Object.keys(state.allocs)) {
    const num = Number(key);
    if (num !== id) rest[num] = state.allocs[num];
  }
  const merged = (leftFree ? 1 : 0) + (rightFree ? 1 : 0);
  const note =
    merged > 0
      ? `free('${alloc.label}') - blocks ${alloc.start}-${rightEnd - 1} released, coalesced with ${merged} adjacent free run${merged > 1 ? 's' : ''}`
      : `free('${alloc.label}') - blocks ${alloc.start}-${rightEnd - 1} now free`;
  return { heap: { ...state, cells, allocs: rest }, ok: true, note };
}

export interface FreeSummary {
  count: number;
  total: number;
  largest: number;
}

export function freeRuns(cells: (number | null)[]): FreeSummary {
  let count = 0;
  let total = 0;
  let largest = 0;
  let i = 0;
  while (i < HEAP_SIZE) {
    if (cells[i] !== null) {
      i += 1;
      continue;
    }
    count += 1;
    let j = i;
    while (j < HEAP_SIZE && cells[j] === null) j += 1;
    const len = j - i;
    total += len;
    largest = Math.max(largest, len);
    i = j;
  }
  return { count, total, largest };
}

/** External fragmentation 0-100: how far the biggest hole is from absorbing all free space. */
export function fragmentation(cells: (number | null)[]): number {
  const f = freeRuns(cells);
  if (f.total === 0) return 0;
  return Math.round((1 - f.largest / f.total) * 100);
}

export type PresetOp =
  | { op: 'malloc'; size: number }
  | { op: 'free'; label: string }
  | { op: 'note'; text: string };

/**
 * Scripted workload that makes First-Fit and Best-Fit diverge:
 * two holes form (7 wide at block 0, 5 wide at block 10), then
 * X=4 and Y=3 land in different places under each strategy.
 */
export const PRESET_WORKLOAD: PresetOp[] = [
  { op: 'malloc', size: 7 }, // A @ 0-6
  { op: 'malloc', size: 3 }, // B @ 7-9
  { op: 'malloc', size: 5 }, // C @ 10-14
  { op: 'malloc', size: 10 }, // D
  { op: 'malloc', size: 10 }, // E
  { op: 'malloc', size: 10 }, // F
  { op: 'malloc', size: 10 }, // G
  { op: 'malloc', size: 9 }, // H  - heap is now exactly full
  { op: 'note', text: '--- heap full: holes of 7 @0 and 5 @10 will open below ---' },
  { op: 'free', label: 'A' },
  { op: 'free', label: 'C' },
  { op: 'note', text: '--- request X=4 then Y=3: strategies split here ---' },
  { op: 'malloc', size: 4 }, // X: first-fit -> hole @0, best-fit -> hole @10
  { op: 'malloc', size: 3 }, // Y: lands differently per strategy
];
