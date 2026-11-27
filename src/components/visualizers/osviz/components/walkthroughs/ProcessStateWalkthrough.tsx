'use client';

import React, { useMemo } from 'react';
import { StepPlayer, type WalkthroughStep } from './StepPlayer';

const STATES = ['new', 'ready', 'running', 'waiting', 'terminated'] as const;
type StateName = (typeof STATES)[number];

export function ProcessStateWalkthrough({ processId = 'P1' }: { processId?: string }) {
  const steps = useMemo<WalkthroughStep[]>(() => {
    const frames: { state: StateName; title: string; description: string; event: string }[] = [
      {
        state: 'new',
        title: `${processId} is created`,
        description: 'The kernel allocates a PCB, a process ID, and an address space. The process is not yet ready to run.',
        event: 'create()',
      },
      {
        state: 'ready',
        title: `${processId} enters the ready queue`,
        description: 'The process is loaded and waiting for the CPU. It is ready to run, but the scheduler has not chosen it yet.',
        event: 'admit',
      },
      {
        state: 'running',
        title: `${processId} is dispatched`,
        description: 'The scheduler selects the process, restores its context, and starts executing its instructions.',
        event: 'dispatch',
      },
      {
        state: 'waiting',
        title: `${processId} blocks on I/O`,
        description: 'The process issues a blocking I/O request. It leaves the CPU and waits for the device to finish. It is not on the ready queue.',
        event: 'I/O request',
      },
      {
        state: 'ready',
        title: `${processId} becomes ready again`,
        description: 'The I/O completes. The kernel moves the process back to the ready queue, not directly to running.',
        event: 'I/O complete',
      },
      {
        state: 'running',
        title: `${processId} resumes`,
        description: 'The scheduler dispatches the process again. It continues from the instruction after the blocking call.',
        event: 'dispatch',
      },
      {
        state: 'terminated',
        title: `${processId} exits`,
        description: 'The process returns or calls exit. The kernel releases its memory, files, and PCB.',
        event: 'exit',
      },
    ];

    return frames.map((frame) => ({
      title: frame.title,
      description: frame.description,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {STATES.map((state) => {
              const active = state === frame.state;
              return (
                <div
                  key={state}
                  className="rounded-lg border px-2 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    borderColor: active ? 'var(--os-primary)' : 'var(--os-border)',
                    backgroundColor: active ? 'var(--os-primary-soft)' : 'var(--os-surface-2)',
                    color: active ? 'var(--os-primary)' : 'var(--os-muted)',
                  }}
                >
                  {state}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <span style={{ color: 'var(--os-muted)' }}>event</span>
            <span className="font-bold" style={{ color: 'var(--os-accent)' }}>{frame.event}</span>
          </div>
          <div className="rounded-lg border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
            ready queue: {frame.state === 'ready' ? processId : '—'} · running: {frame.state === 'running' ? processId : '—'} · waiting: {frame.state === 'waiting' ? processId : '—'}
          </div>
        </div>
      ),
    }));
  }, [processId]);

  return <StepPlayer steps={steps} />;
}
