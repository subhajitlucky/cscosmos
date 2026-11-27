'use client';

import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { StepPlayer, type CWalkthroughStep } from './StepPlayer';

const ARRAY = [10, 20, 30, 40];
const BASE = 0x7ffc2000;
const SIZE = 4;

export function ArrayWalkWalkthrough() {
  const steps = useMemo<CWalkthroughStep[]>(() => {
    const view = (offset: number, label: string) => {
      const address = BASE + offset * SIZE;
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ARRAY.map((value, index) => {
              const active = index === offset;
              return (
                <div
                  key={index}
                  className="rounded-xl border p-3"
                  style={{
                    borderColor: active ? 'var(--c-primary)' : 'var(--c-border)',
                    backgroundColor: active ? 'var(--c-primary-soft)' : 'var(--c-surface-2)',
                    outline: active ? '2px solid var(--c-primary)' : 'none',
                  }}
                >
                  <div className="font-mono text-[9px]" style={{ color: 'var(--c-muted)' }}>
                    a[{index}] · 0x{(BASE + index * SIZE).toString(16)}
                  </div>
                  <div className="mt-1 font-mono text-lg font-black">{value}</div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
            <span style={{ color: 'var(--c-muted)' }}>{label}</span>
            <ArrowRight className="h-3 w-3" style={{ color: 'var(--c-muted)' }} />
            <span className="font-bold" style={{ color: 'var(--c-primary)' }}>0x{address.toString(16)}</span>
            <span style={{ color: 'var(--c-muted)' }}>→</span>
            <span className="font-bold">{ARRAY[offset]}</span>
          </div>
        </div>
      );
    };

    return [
      {
        title: 'Create the array',
        description: 'int a[4] = {10, 20, 30, 40}; stores four ints contiguously. Each int is 4 bytes here.',
        content: view(0, 'a[0]'),
      },
      {
        title: 'Point p at the first element',
        description: 'int *p = a; the array name decays to a pointer to a[0].',
        content: view(0, 'p'),
      },
      {
        title: 'Move one element forward',
        description: 'p + 1 advances by one int, which is 4 bytes, not 1 byte.',
        content: view(1, 'p + 1'),
      },
      {
        title: 'Move two elements forward',
        description: 'p + 2 points at a[2]. The address is base + 2 × 4.',
        content: view(2, 'p + 2'),
      },
      {
        title: 'Move three elements forward',
        description: 'p + 3 points at a[3]. This is still inside the array.',
        content: view(3, 'p + 3'),
      },
      {
        title: 'Increment the pointer itself',
        description: 'p++ changes p to point at the next element. The array did not move; the pointer did.',
        content: view(1, 'p after p++'),
      },
    ];
  }, []);

  return <StepPlayer steps={steps} />;
}
