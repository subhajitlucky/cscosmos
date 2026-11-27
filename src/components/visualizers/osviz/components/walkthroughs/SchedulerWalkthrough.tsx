'use client';

import React, { useMemo } from 'react';
import {
  schedule,
  type OSProcess,
  type SchedulingAlgorithm,
} from '../../lib/scheduling';
import { StepPlayer, type WalkthroughStep } from './StepPlayer';

const COLORS = ['#0f766e', '#b45309', '#2563eb', '#9333ea', '#be123c', '#4d7c0f'];

const LABELS: Record<SchedulingAlgorithm, string> = {
  fcfs: 'FCFS',
  sjf: 'SJF',
  srtf: 'SRTF',
  'round-robin': 'Round Robin',
  priority: 'Priority',
};

export function SchedulerWalkthrough({
  processes,
  algorithm,
  quantum = 2,
}: {
  processes: OSProcess[];
  algorithm: SchedulingAlgorithm;
  quantum?: number;
}) {
  const result = useMemo(
    () => schedule(algorithm, processes, quantum),
    [algorithm, processes, quantum],
  );

  const color = (id: string) => {
    const index = processes.findIndex((process) => process.id === id);
    return COLORS[index % COLORS.length];
  };

  const steps = useMemo<WalkthroughStep[]>(() => {
    if (result.slices.length === 0) {
      return [
        {
          title: 'No work',
          description: 'The ready queue is empty.',
          content: <p className="text-xs">No process to run.</p>,
        },
      ];
    }

    const total = Math.max(1, ...result.slices.map((slice) => slice.end));

    return result.slices.map((slice, sliceIndex) => {
      const timeStart = slice.start;
      const timeEnd = slice.end;
      const running = slice.processId;

      const runSoFar = new Map<string, number>();
      for (let i = 0; i <= sliceIndex; i += 1) {
        const current = result.slices[i];
        if (current.processId === 'idle') continue;
        runSoFar.set(
          current.processId,
          (runSoFar.get(current.processId) ?? 0) + (current.end - current.start),
        );
      }

      const completion = new Map<string, number>();
      for (let i = 0; i <= sliceIndex; i += 1) {
        const current = result.slices[i];
        if (current.processId === 'idle') continue;
        const process = processes.find((item) => item.id === current.processId);
        if (!process) continue;
        if ((runSoFar.get(current.processId) ?? 0) >= process.burst) {
          completion.set(current.processId, current.end);
        }
      }

      const ready = processes
        .filter((process) => process.arrival <= timeEnd && !completion.has(process.id))
        .map((process) => process.id);

      let description: string;
      if (running === 'idle') {
        description = `The CPU is idle from t=${timeStart} to t=${timeEnd} because no process has arrived yet.`;
      } else {
        const process = processes.find((item) => item.id === running);
        const burst = process?.burst ?? 0;
        const remaining = Math.max(0, burst - (runSoFar.get(running) ?? 0));

        description =
          algorithm === 'round-robin'
            ? `At t=${timeStart}, ${running} takes the CPU for a quantum of ${quantum}. It has ${remaining} unit${remaining === 1 ? '' : 's'} left after this slice.`
            : algorithm === 'srtf'
              ? `At t=${timeStart}, ${running} has the shortest remaining time, so it runs until t=${timeEnd}.`
              : algorithm === 'sjf'
                ? `At t=${timeStart}, ${running} has the shortest ready burst, so it runs until t=${timeEnd}.`
                : algorithm === 'priority'
                  ? `At t=${timeStart}, ${running} has the highest priority among ready processes, so it runs until t=${timeEnd}.`
                  : `At t=${timeStart}, ${running} is first in arrival order, so it runs until t=${timeEnd}.`;
      }

      const stateLabel = (id: string) => {
        if (completion.has(id)) return 'done';
        if (id === running) return 'running';
        const arrival = processes.find((process) => process.id === id)?.arrival ?? 0;
        return arrival <= timeEnd ? 'ready' : 'not arrived';
      };

      return {
        title: `t = ${timeStart} → ${timeEnd}${running === 'idle' ? ' · idle' : ` · ${running}`}`,
        description,
        content: (
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between font-mono text-[9px]" style={{ color: 'var(--os-muted)' }}>
                <span>Gantt chart</span>
                <span>{LABELS[algorithm]}{algorithm === 'round-robin' ? ` · q=${quantum}` : ''}</span>
              </div>
              <div className="flex h-10 w-full overflow-hidden rounded-lg border" style={{ borderColor: 'var(--os-border)' }}>
                {result.slices.map((item, index) => {
                  const width = ((item.end - item.start) / total) * 100;
                  const past = index <= sliceIndex;
                  const current = index === sliceIndex;
                  return (
                    <div
                      key={`${item.processId}-${item.start}-${index}`}
                      className="flex items-center justify-center border-r border-white/20 font-mono text-[9px] font-bold text-white last:border-r-0"
                      style={{
                        width: `${width}%`,
                        backgroundColor: past ? color(item.processId) : 'var(--os-surface-2)',
                        color: past ? '#fff' : 'var(--os-muted)',
                        outline: current ? '2px solid var(--os-accent)' : 'none',
                        outlineOffset: '-2px',
                      }}
                      title={`${item.processId} ${item.start}-${item.end}`}
                    >
                      {width > 8 ? item.processId : ''}
                    </div>
                  );
                })}
              </div>
              <div className="mt-1 flex justify-between font-mono text-[8px]" style={{ color: 'var(--os-muted)' }}>
                <span>0</span>
                <span>{total}</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--os-border)' }}>
              <div className="grid grid-cols-6 gap-1 border-b px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
                <span>PID</span>
                <span>Arr</span>
                <span>Burst</span>
                <span>Rem</span>
                <span>State</span>
                <span>Done</span>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--os-border)' }}>
                {processes.map((process) => {
                  const done = completion.get(process.id);
                  const rem = Math.max(0, process.burst - (runSoFar.get(process.id) ?? 0));
                  const state = stateLabel(process.id);
                  return (
                    <div
                      key={process.id}
                      className="grid grid-cols-6 gap-1 px-2 py-1 font-mono text-[10px]"
                      style={{
                        backgroundColor: process.id === running ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                        color: process.id === running ? 'var(--os-primary)' : 'var(--os-text)',
                      }}
                    >
                      <span className="font-bold" style={{ color: color(process.id) }}>{process.id}</span>
                      <span>{process.arrival}</span>
                      <span>{process.burst}</span>
                      <span>{rem}</span>
                      <span style={{ color: state === 'done' ? 'var(--os-ok)' : state === 'running' ? 'var(--os-primary)' : 'var(--os-muted)' }}>{state}</span>
                      <span>{done ?? '—'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[9px]" style={{ color: 'var(--os-muted)' }}>
              <span>ready at t={timeEnd}:</span>
              {ready.length === 0 ? <span>none</span> : ready.map((id) => (
                <span key={id} className="rounded border px-1.5 py-0.5 font-bold" style={{ borderColor: color(id), color: color(id) }}>
                  {id}
                </span>
              ))}
            </div>
          </div>
        ),
      };
    });
  }, [algorithm, processes, quantum, result]);

  return <StepPlayer steps={steps} />;
}
