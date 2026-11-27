'use client';

import React, { useMemo, useState } from 'react';
import { RotateCcw, Timer, Zap } from 'lucide-react';
import {
  formatMetric,
  schedule,
  type OSProcess,
  type SchedulingAlgorithm,
} from '../../lib/scheduling';

const INITIAL_PROCESSES: OSProcess[] = [
  { id: 'P1', arrival: 0, burst: 5, priority: 3 },
  { id: 'P2', arrival: 1, burst: 3, priority: 1 },
  { id: 'P3', arrival: 2, burst: 8, priority: 2 },
  { id: 'P4', arrival: 4, burst: 2, priority: 4 },
];

const COLORS = ['#0f766e', '#b45309', '#2563eb', '#9333ea', '#be123c', '#4d7c0f'];
const ALGORITHMS: { id: SchedulingAlgorithm; label: string; note: string }[] = [
  { id: 'fcfs', label: 'FCFS', note: 'Runs in arrival order. Simple, but a long job can block everyone behind it.' },
  { id: 'round-robin', label: 'Round Robin', note: 'Rotates through the queue with a fixed quantum. Better response time.' },
  { id: 'priority', label: 'Priority', note: 'Runs the highest-priority ready process (lower number = higher priority).' },
];

export function SchedulerLab() {
  const [processes, setProcesses] = useState<OSProcess[]>(INITIAL_PROCESSES);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('fcfs');
  const [quantum, setQuantum] = useState(2);

  const result = useMemo(() => schedule(algorithm, processes, quantum), [algorithm, processes, quantum]);
  const totalTime = Math.max(1, ...result.slices.map((slice) => slice.end));
  const processColor = (id: string) => {
    if (id === 'idle') return 'var(--os-muted)';
    const index = processes.findIndex((process) => process.id === id);
    return COLORS[index % COLORS.length];
  };

  const updateProcess = (id: string, field: 'arrival' | 'burst' | 'priority', value: number) => {
    setProcesses((current) =>
      current.map((process) =>
        process.id === id
          ? {
              ...process,
              [field]: field === 'arrival' ? Math.max(0, value) : Math.max(1, value),
            }
          : process,
      ),
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Process set</h3>
                <p className="text-[11px]" style={{ color: 'var(--os-muted)' }}>
                  Arrival, burst, and priority. Lower priority number = higher priority.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProcesses(INITIAL_PROCESSES)}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold"
                style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}
              >
                <RotateCcw className="h-3 w-3" /> reset
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                    <th className="pb-2">PID</th>
                    <th className="pb-2">Arrival</th>
                    <th className="pb-2">Burst</th>
                    <th className="pb-2">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process, index) => (
                    <tr key={process.id}>
                      <td className="py-1 pr-2">
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-[10px] font-bold text-white"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {process.id}
                        </span>
                      </td>
                      {(['arrival', 'burst', 'priority'] as const).map((field) => (
                        <td key={field} className="py-1 pr-2">
                          <input
                            type="number"
                            min={field === 'arrival' ? 0 : 1}
                            value={process[field]}
                            onChange={(event) => updateProcess(process.id, field, Number(event.target.value))}
                            className="w-16 rounded-md border px-2 py-1 font-mono text-xs outline-none focus:border-[var(--os-primary)]"
                            style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-text)' }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <h3 className="mb-2 text-sm font-bold">Policy</h3>
            <div className="flex flex-wrap gap-1.5">
              {ALGORITHMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAlgorithm(item.id)}
                  className="rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-bold"
                  style={{
                    borderColor: algorithm === item.id ? 'var(--os-primary)' : 'var(--os-border)',
                    backgroundColor: algorithm === item.id ? 'var(--os-primary-soft)' : 'var(--os-surface-2)',
                    color: algorithm === item.id ? 'var(--os-primary)' : 'var(--os-muted)',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {algorithm === 'round-robin' && (
              <div className="mt-3 flex items-center gap-3">
                <span className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                  quantum
                </span>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={quantum}
                  onChange={(event) => setQuantum(Number(event.target.value))}
                  className="w-40 accent-[var(--os-primary)]"
                />
                <span className="font-mono text-xs font-bold">{quantum}</span>
              </div>
            )}

            <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
              {ALGORITHMS.find((item) => item.id === algorithm)?.note}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border-strong)', backgroundColor: 'var(--os-surface)' }}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">Gantt chart</h3>
              <span className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                total {totalTime} units
              </span>
            </div>

            <div className="flex h-12 w-full overflow-hidden rounded-lg border" style={{ borderColor: 'var(--os-border)' }}>
              {result.slices.map((slice, index) => {
                const width = ((slice.end - slice.start) / totalTime) * 100;
                return (
                  <div
                    key={`${slice.processId}-${slice.start}-${index}`}
                    className="flex items-center justify-center overflow-hidden border-r border-white/20 font-mono text-[10px] font-bold text-white last:border-r-0"
                    style={{
                      width: `${width}%`,
                      minWidth: width > 0 ? 2 : 0,
                      backgroundColor: processColor(slice.processId),
                      opacity: slice.processId === 'idle' ? 0.35 : 1,
                    }}
                    title={`${slice.processId} ${slice.start}-${slice.end}`}
                  >
                    {width > 7 ? slice.processId : ''}
                  </div>
                );
              })}
            </div>

            <div className="mt-2 flex justify-between font-mono text-[9px]" style={{ color: 'var(--os-muted)' }}>
              <span>0</span>
              <span>{totalTime}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {processes.map((process, index) => (
                <span key={process.id} className="inline-flex items-center gap-1 font-mono text-[10px]">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {process.id}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--os-muted)', opacity: 0.4 }} />
                idle
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--os-border)' }}>
            <div className="grid grid-cols-5 gap-2 border-b px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
              <span>PID</span>
              <span>Arrive</span>
              <span>Burst</span>
              <span>Wait</span>
              <span>Turn</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--os-border)' }}>
              {result.metrics.map((metric) => (
                <div key={metric.id} className="grid grid-cols-5 gap-2 px-3 py-2 font-mono text-[11px]" style={{ backgroundColor: 'var(--os-surface)' }}>
                  <span className="font-bold" style={{ color: processColor(metric.id) }}>{metric.id}</span>
                  <span>{metric.arrival}</span>
                  <span>{metric.burst}</span>
                  <span>{metric.waiting}</span>
                  <span>{metric.turnaround}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-3" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                <Timer className="h-3 w-3" /> avg waiting
              </div>
              <div className="mt-1 font-mono text-xl font-black" style={{ color: 'var(--os-primary)' }}>
                {formatMetric(result.averageWaiting)}
              </div>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                <Zap className="h-3 w-3" /> avg turnaround
              </div>
              <div className="mt-1 font-mono text-xl font-black" style={{ color: 'var(--os-accent)' }}>
                {formatMetric(result.averageTurnaround)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
