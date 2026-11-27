'use client';

import React, { useMemo } from 'react';
import { StepPlayer, type CWalkthroughStep } from './StepPlayer';

const HEAP_ADDRESS = '0x602000';

export function HeapWalkthrough({
  bytes,
  values,
}: {
  bytes: number;
  values: number[];
}) {
  const steps = useMemo<CWalkthroughStep[]>(() => {
    const heapView = (state: 'uninitialized' | 'filled' | 'freed', highlight?: number) => (
      <div className="space-y-2">
        <div className="rounded-lg border p-3 font-mono text-[10px]" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--c-muted)' }}>stack</span>
            <span style={{ color: 'var(--c-muted)' }}>0x7ffc1000</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-bold" style={{ color: 'var(--c-accent)' }}>int *p</span>
            <span className="font-bold">{state === 'freed' ? `0x... (dangling)` : HEAP_ADDRESS}</span>
          </div>
        </div>

        <div className="rounded-lg border p-3" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
          <div className="mb-2 flex items-center justify-between font-mono text-[9px]" style={{ color: 'var(--c-muted)' }}>
            <span>heap · {bytes} bytes</span>
            <span>{HEAP_ADDRESS}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: Math.max(1, values.length) }, (_, index) => {
              const active = highlight === index;
              return (
                <div
                  key={index}
                  className="rounded-md border p-2 text-center font-mono"
                  style={{
                    borderColor: active ? 'var(--c-primary)' : 'var(--c-border)',
                    backgroundColor: state === 'freed' ? 'var(--c-danger-soft)' : active ? 'var(--c-primary-soft)' : 'var(--c-surface)',
                    color: state === 'freed' ? 'var(--c-danger)' : active ? 'var(--c-primary)' : 'var(--c-text)',
                  }}
                >
                  <div className="text-[8px]" style={{ color: 'var(--c-muted)' }}>p[{index}]</div>
                  <div className="text-sm font-black">
                    {state === 'uninitialized' ? '??' : state === 'freed' ? 'freed' : values[index]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    return [
      {
        title: 'Allocate from the heap',
        description: `malloc(${bytes}) returns a heap block. p stores the block address; the bytes are uninitialized.`,
        content: heapView('uninitialized'),
      },
      {
        title: 'Write through p',
        description: 'p[0], p[1], p[2], and p[3] write into the heap block. The stack pointer p is unchanged.',
        content: heapView('filled'),
      },
      {
        title: 'Read a value',
        description: 'p[2] dereferences the heap block and reads 30. The pointer still owns the block.',
        content: heapView('filled', 2),
      },
      {
        title: 'Free the block',
        description: 'free(p) releases the heap block. p still contains the old address, so it is now dangling.',
        content: heapView('freed'),
      },
      {
        title: 'Clear the pointer',
        description: 'p = NULL; now a stray dereference is easier to detect and cannot touch freed memory.',
        content: (
          <div className="space-y-2">
            {heapView('freed')}
            <div className="rounded-lg border p-2 font-mono text-[10px]" style={{ borderColor: 'var(--c-ok)', backgroundColor: 'var(--c-ok-soft)', color: 'var(--c-ok)' }}>
              p = NULL
            </div>
          </div>
        ),
      },
    ];
  }, [bytes, values]);

  return <StepPlayer steps={steps} />;
}
