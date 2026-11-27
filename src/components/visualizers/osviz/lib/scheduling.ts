export interface OSProcess {
  id: string;
  arrival: number;
  burst: number;
  priority: number;
}

export interface GanttSlice {
  processId: string;
  start: number;
  end: number;
}

export interface ProcessMetrics {
  id: string;
  arrival: number;
  burst: number;
  completion: number;
  turnaround: number;
  waiting: number;
}

export type SchedulingAlgorithm = 'fcfs' | 'round-robin' | 'priority';

export interface ScheduleResult {
  algorithm: SchedulingAlgorithm;
  slices: GanttSlice[];
  metrics: ProcessMetrics[];
  averageWaiting: number;
  averageTurnaround: number;
}

function pushIdle(slices: GanttSlice[], start: number, end: number) {
  if (end > start) slices.push({ processId: 'idle', start, end });
}

function finalizeMetrics(
  processes: OSProcess[],
  completions: Map<string, number>,
  slices: GanttSlice[],
): ScheduleResult {
  const metrics = processes.map((process) => {
    const completion = completions.get(process.id) ?? 0;
    const turnaround = completion - process.arrival;
    return {
      id: process.id,
      arrival: process.arrival,
      burst: process.burst,
      completion,
      turnaround,
      waiting: turnaround - process.burst,
    };
  });

  const count = metrics.length || 1;
  return {
    algorithm: 'fcfs',
    slices,
    metrics,
    averageWaiting: metrics.reduce((sum, item) => sum + item.waiting, 0) / count,
    averageTurnaround: metrics.reduce((sum, item) => sum + item.turnaround, 0) / count,
  };
}

export function runFCFS(input: OSProcess[]): ScheduleResult {
  const processes = [...input].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const slices: GanttSlice[] = [];
  const completions = new Map<string, number>();
  let time = 0;

  for (const process of processes) {
    if (time < process.arrival) {
      pushIdle(slices, time, process.arrival);
      time = process.arrival;
    }
    const start = time;
    const end = start + process.burst;
    slices.push({ processId: process.id, start, end });
    completions.set(process.id, end);
    time = end;
  }

  return { ...finalizeMetrics(processes, completions, slices), algorithm: 'fcfs' };
}

export function runRoundRobin(input: OSProcess[], quantum: number): ScheduleResult {
  const q = Math.max(1, Math.floor(quantum));
  const processes = [...input].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const byId = new Map(processes.map((process) => [process.id, process]));
  const remaining = new Map(processes.map((process) => [process.id, process.burst]));
  const completions = new Map<string, number>();
  const slices: GanttSlice[] = [];
  const queue: string[] = [];
  let time = 0;
  let arrivalIndex = 0;

  const enqueueArrivals = (upTo: number) => {
    while (arrivalIndex < processes.length && processes[arrivalIndex].arrival <= upTo) {
      queue.push(processes[arrivalIndex].id);
      arrivalIndex += 1;
    }
  };

  enqueueArrivals(0);

  while (completions.size < processes.length) {
    if (queue.length === 0) {
      const next = processes[arrivalIndex];
      if (!next) break;
      if (time < next.arrival) {
        pushIdle(slices, time, next.arrival);
        time = next.arrival;
      }
      enqueueArrivals(time);
      continue;
    }

    const id = queue.shift() as string;
    const left = remaining.get(id) ?? 0;
    const runFor = Math.min(q, left);
    const start = time;
    const end = start + runFor;
    slices.push({ processId: id, start, end });
    time = end;
    const nextLeft = left - runFor;
    remaining.set(id, nextLeft);

    enqueueArrivals(time);

    if (nextLeft === 0) {
      completions.set(id, time);
    } else {
      queue.push(id);
    }
  }

  return {
    ...finalizeMetrics(processes, completions, slices),
    algorithm: 'round-robin',
  };
}

export function runPriority(input: OSProcess[]): ScheduleResult {
  const processes = [...input].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const remaining = new Set(processes.map((process) => process.id));
  const completions = new Map<string, number>();
  const slices: GanttSlice[] = [];
  let time = 0;

  while (remaining.size > 0) {
    const ready = processes.filter(
      (process) => remaining.has(process.id) && process.arrival <= time,
    );

    if (ready.length === 0) {
      const next = processes
        .filter((process) => remaining.has(process.id))
        .sort((a, b) => a.arrival - b.arrival)[0];
      if (!next) break;
      pushIdle(slices, time, next.arrival);
      time = next.arrival;
      continue;
    }

    const chosen = ready.sort(
      (a, b) => a.priority - b.priority || a.arrival - b.arrival || a.id.localeCompare(b.id),
    )[0];

    const start = time;
    const end = start + chosen.burst;
    slices.push({ processId: chosen.id, start, end });
    completions.set(chosen.id, end);
    remaining.delete(chosen.id);
    time = end;
  }

  return {
    ...finalizeMetrics(processes, completions, slices),
    algorithm: 'priority',
  };
}

export function schedule(
  algorithm: SchedulingAlgorithm,
  processes: OSProcess[],
  quantum = 2,
): ScheduleResult {
  if (algorithm === 'round-robin') return runRoundRobin(processes, quantum);
  if (algorithm === 'priority') return runPriority(processes);
  return runFCFS(processes);
}

export function formatMetric(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
