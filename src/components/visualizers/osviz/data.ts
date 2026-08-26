// CPU scheduling + two-level page-table walk knowledge base.
// Pure data and pure functions - no browser APIs - safe for module scope.

export type AlgoKey = 'fcfs' | 'sjf' | 'rr';

export interface ProcDef {
  id: string;
  name: string;
  arrival: number;
  burst: number;
}

export interface Segment {
  /** Proc id or 'idle'. */
  pid: string;
  start: number;
  end: number;
}

export interface ProcStat {
  id: string;
  name: string;
  arrival: number;
  burst: number;
  completion: number;
  turnaround: number;
  waiting: number;
}

export const ALGOS: { key: AlgoKey; label: string; sub: string }[] = [
  { key: 'fcfs', label: 'FCFS', sub: 'first come, first served' },
  { key: 'sjf', label: 'SJF', sub: 'shortest job first (non-preemptive)' },
  { key: 'rr', label: 'Round Robin', sub: 'fair time slicing, quantum q' },
];

export const PROCESS_DEFS: ProcDef[] = [
  { id: 'p1', name: 'P1', arrival: 0, burst: 7 },
  { id: 'p2', name: 'P2', arrival: 1, burst: 4 },
  { id: 'p3', name: 'P3', arrival: 2, burst: 8 },
  { id: 'p4', name: 'P4', arrival: 3, burst: 3 },
  { id: 'p5', name: 'P5', arrival: 6, burst: 5 },
  { id: 'p6', name: 'P6', arrival: 8, burst: 2 },
];

/** Non-preemptive FCFS/SJF, or preemptive Round Robin with the given quantum. */
export function computeSchedule(algo: AlgoKey, quantum: number): Segment[] {
  const procs = PROCESS_DEFS.map((p) => ({ ...p }));
  const segments: Segment[] = [];
  let now = 0;

  const push = (pid: string, end: number) => {
    const last = segments[segments.length - 1];
    if (last && last.pid === pid && last.end === now) last.end = end;
    else segments.push({ pid, start: now, end });
    now = end;
  };

  if (algo === 'fcfs') {
    const order = [...procs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
    for (const p of order) {
      if (now < p.arrival) push('idle', p.arrival);
      push(p.id, now + p.burst);
    }
    return segments;
  }

  if (algo === 'sjf') {
    const finished = new Set<string>();
    while (finished.size < procs.length) {
      const ready = procs.filter((p) => !finished.has(p.id) && p.arrival <= now);
      if (ready.length === 0) {
        const next = procs
          .filter((p) => !finished.has(p.id))
          .sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id))[0];
        push('idle', next.arrival);
        continue;
      }
      ready.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival || a.id.localeCompare(b.id));
      const job = ready[0];
      push(job.id, now + job.burst);
      finished.add(job.id);
    }
    return segments;
  }

  // Round Robin: ready queue, fixed quantum, arrivals join before the runner re-queues.
  const remaining = new Map(procs.map((p) => [p.id, p.burst]));
  const queue: string[] = [];
  const arrived = [...procs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let ai = 0;
  let done = 0;
  let guard = 0;
  while (done < procs.length && guard < 500) {
    guard += 1;
    while (ai < arrived.length && arrived[ai].arrival <= now) queue.push(arrived[ai++].id);
    if (queue.length === 0) {
      if (ai < arrived.length) {
        push('idle', arrived[ai].arrival);
        continue;
      }
      break;
    }
    const id = queue.shift() as string;
    const slice = Math.min(quantum, remaining.get(id) as number);
    const end = now + slice;
    while (ai < arrived.length && arrived[ai].arrival <= end) queue.push(arrived[ai++].id);
    const left = (remaining.get(id) as number) - slice;
    remaining.set(id, left);
    push(id, end);
    if (left > 0) queue.push(id);
    else done += 1;
  }
  return segments;
}

export function computeStats(segments: Segment[]): ProcStat[] {
  return PROCESS_DEFS.map((p) => {
    let first = Number.POSITIVE_INFINITY;
    let completion = 0;
    for (const s of segments) {
      if (s.pid !== p.id) continue;
      first = Math.min(first, s.start);
      completion = Math.max(completion, s.end);
    }
    const turnaround = completion - p.arrival;
    return { id: p.id, name: p.name, arrival: p.arrival, burst: p.burst, completion, turnaround, waiting: turnaround - p.burst };
  });
}

export function makespanOf(segments: Segment[]): number {
  return segments.reduce((m, s) => Math.max(m, s.end), 0);
}

// ---------------------------------------------------------------------------
// Two-level page-table walk: 32-bit virtual address, 4 KiB pages.
// 10-bit directory index | 10-bit table index | 12-bit offset.
// ---------------------------------------------------------------------------

/** Page-directory entries hold the frame number of a second-level table, or null when absent. */
export const PAGE_DIRECTORY: (number | null)[] = [40, null, 52, null, 61, null, null, 73];

export interface PageTableEntry {
  frame: number;
  present: boolean;
}

/** Sparse second-level tables, keyed by directory-entry frame then table index. */
export const PAGE_TABLES: Record<number, Record<number, PageTableEntry>> = {
  40: {
    0: { frame: 0xab, present: true },
    1: { frame: 0x31, present: true },
    3: { frame: 0xc4, present: true },
    700: { frame: 0x18, present: true },
  },
  52: {
    12: { frame: 0x09, present: true },
    50: { frame: 0x77, present: true },
    201: { frame: 0x12, present: true },
    900: { frame: 0x66, present: true },
  },
  61: {
    5: { frame: 0xe0, present: true },
    42: { frame: 0x5a, present: true },
  },
  73: {
    0: { frame: 0x21, present: true },
    333: { frame: 0x99, present: true },
  },
};

export const DEFAULT_VA = (2 << 22) | (50 << 12) | 0x04c;

export interface WalkResult {
  ok: boolean;
  reason: string;
  dirIndex: number;
  tableFrame: number | null;
  tableIndex: number;
  entry: PageTableEntry | null;
  frame: number | null;
  physical: number | null;
}

export function walkPageTable(va: number): WalkResult {
  const dirIndex = (va >>> 22) & 0x3ff;
  const tableIndex = (va >>> 12) & 0x3ff;
  const offset = va & 0xfff;
  const tableFrame = PAGE_DIRECTORY[dirIndex] ?? null;
  if (tableFrame === null) {
    return { ok: false, reason: 'page fault: directory entry not present', dirIndex, tableFrame: null, tableIndex, entry: null, frame: null, physical: null };
  }
  const table = PAGE_TABLES[tableFrame];
  const entry = table ? table[tableIndex] ?? null : null;
  if (!entry || !entry.present) {
    return { ok: false, reason: 'page fault: PTE marked not-present', dirIndex, tableFrame, tableIndex, entry, frame: null, physical: null };
  }
  return {
    ok: true,
    reason: 'hit',
    dirIndex,
    tableFrame,
    tableIndex,
    entry,
    frame: entry.frame,
    physical: ((entry.frame << 12) | offset) >>> 0,
  };
}

export const toHex = (n: number, digits = 8): string =>
  '0x' + (n >>> 0).toString(16).toUpperCase().padStart(digits, '0');

export const toBin = (n: number, width: number): string =>
  (n >>> 0).toString(2).padStart(width, '0');
