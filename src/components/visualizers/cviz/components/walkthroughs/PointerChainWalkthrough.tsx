'use client';

import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { StepPlayer, type CWalkthroughStep } from './StepPlayer';

const X_ADDR = '0x7ffc1000';
const P_ADDR = '0x7ffc1004';
const PP_ADDR = '0x7ffc1008';

export function PointerChainWalkthrough() {
  const steps = useMemo<CWalkthroughStep[]>(() => {
    const memory = (
      x: number,
      pValue: string,
      ppValue: string,
      highlight: 'x' | 'p' | 'pp',
    ) => (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          { name: 'pp', type: 'int **', address: PP_ADDR, value: ppValue, color: 'var(--c-ok)' },
          { name: 'p', type: 'int *', address: P_ADDR, value: pValue, color: 'var(--c-accent)' },
          { name: 'x', type: 'int', address: X_ADDR, value: String(x), color: 'var(--c-primary)' },
        ].map((cell) => (
          <div
            key={cell.name}
            className="rounded-xl border p-3"
            style={{
              borderColor: highlight === cell.name ? cell.color : 'var(--c-border)',
              backgroundColor: highlight === cell.name ? 'var(--c-surface-2)' : 'var(--c-surface)',
              outline: highlight === cell.name ? `2px solid ${cell.color}` : 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black" style={{ color: cell.color }}>{cell.name}</span>
              <span className="font-mono text-[9px]" style={{ color: 'var(--c-muted)' }}>{cell.type}</span>
            </div>
            <div className="mt-2 font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>{cell.address}</div>
            <div className="mt-1 break-all font-mono text-sm font-bold">{cell.value}</div>
          </div>
        ))}
      </div>
    );

    return [
      {
        title: 'Create x',
        description: 'int x = 42; stores 42 at address 0x7ffc1000.',
        content: memory(42, 'uninitialized', 'uninitialized', 'x'),
      },
      {
        title: 'Create p and point it at x',
        description: 'int *p = &x; stores the address of x in p. p does not contain 42; it contains the address where 42 lives.',
        content: (
          <div className="space-y-2">
            {memory(42, X_ADDR, 'uninitialized', 'p')}
            <div className="flex items-center gap-2 font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
              <span>p</span><ArrowRight className="h-3 w-3" /><span>x</span>
            </div>
          </div>
        ),
      },
      {
        title: 'Create pp and point it at p',
        description: 'int **pp = &p; stores the address of p. Now pp → p → x is a two-level chain.',
        content: (
          <div className="space-y-2">
            {memory(42, X_ADDR, P_ADDR, 'pp')}
            <div className="flex items-center gap-2 font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
              <span>pp</span><ArrowRight className="h-3 w-3" /><span>p</span><ArrowRight className="h-3 w-3" /><span>x</span>
            </div>
          </div>
        ),
      },
      {
        title: 'Write through p',
        description: '*p = 99; follows p to x and changes x to 99.',
        content: memory(99, X_ADDR, P_ADDR, 'x'),
      },
      {
        title: 'Write through pp',
        description: '**pp = 7; follows pp to p, then p to x, and changes x to 7.',
        content: memory(7, X_ADDR, P_ADDR, 'x'),
      },
      {
        title: 'Break the chain',
        description: 'p = NULL; p no longer points to x. Dereferencing *p now would be invalid.',
        content: memory(7, 'NULL', P_ADDR, 'p'),
      },
    ];
  }, []);

  return <StepPlayer steps={steps} />;
}
