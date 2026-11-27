'use client';

import React, { useMemo } from 'react';
import { StepPlayer, type CWalkthroughStep } from './StepPlayer';

function bits(value: number): number[] {
  return (value & 0xff)
    .toString(2)
    .padStart(8, '0')
    .split('')
    .map(Number);
}

function BitRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 font-mono text-[10px] font-bold" style={{ color: accent ? 'var(--c-primary)' : 'var(--c-muted)' }}>
        {label}
      </span>
      <div className="flex gap-1">
        {bits(value).map((bit, index) => (
          <span
            key={index}
            className="flex h-7 w-6 items-center justify-center rounded border font-mono text-[10px] font-bold"
            style={{
              borderColor: bit ? (accent ? 'var(--c-primary)' : 'var(--c-border-strong)') : 'var(--c-border)',
              backgroundColor: bit ? (accent ? 'var(--c-primary-soft)' : 'var(--c-surface-2)') : 'var(--c-surface)',
              color: bit ? (accent ? 'var(--c-primary)' : 'var(--c-text)') : 'var(--c-muted)',
            }}
          >
            {bit}
          </span>
        ))}
      </div>
      <span className="font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
        {value} · 0x{value.toString(16).padStart(2, '0')}
      </span>
    </div>
  );
}

export function BitwiseWalkthrough({ mode }: { mode: 'operators' | 'masks' }) {
  const steps = useMemo<CWalkthroughStep[]>(() => {
    if (mode === 'operators') {
      const a = 12;
      const b = 10;
      const rows = [
        { title: 'Start with two operands', description: 'a = 12 (00001100), b = 10 (00001010).', result: null as number | null, expression: 'a, b' },
        { title: 'Bitwise AND', description: 'AND keeps a bit only where both operands have a 1.', result: a & b, expression: 'a & b' },
        { title: 'Bitwise OR', description: 'OR sets a bit when either operand has a 1.', result: a | b, expression: 'a | b' },
        { title: 'Bitwise XOR', description: 'XOR sets a bit when the operands differ.', result: a ^ b, expression: 'a ^ b' },
        { title: 'Bitwise NOT', description: 'NOT flips every bit. Masked to 8 bits here.', result: ~a & 0xff, expression: '~a & 0xFF' },
        { title: 'Left shift', description: 'a << 1 moves every bit one position left, multiplying by 2.', result: (a << 1) & 0xff, expression: 'a << 1' },
        { title: 'Right shift', description: 'a >> 1 moves every bit one position right, dividing by 2.', result: (a >> 1) & 0xff, expression: 'a >> 1' },
      ];

      return rows.map((row) => ({
        title: row.title,
        description: row.description,
        content: (
          <div className="space-y-2">
            <BitRow label="a" value={a} />
            <BitRow label="b" value={b} />
            {row.result !== null && <BitRow label={row.expression} value={row.result} accent />}
          </div>
        ),
      }));
    }

    const READ = 1;
    const WRITE = 2;
    const EXEC = 4;
    const rows = [
      { title: 'Start with no permissions', description: 'perms = 0. No flag is set.', value: 0, expression: 'perms = 0' },
      { title: 'Set READ and WRITE', description: 'OR the masks together: perms = READ | WRITE.', value: READ | WRITE, expression: 'perms | READ | WRITE' },
      { title: 'Set EXEC', description: 'OR the EXEC mask into perms.', value: READ | WRITE | EXEC, expression: 'perms | EXEC' },
      { title: 'Clear WRITE', description: 'AND with the complement of WRITE clears only that bit.', value: READ | EXEC, expression: 'perms & ~WRITE' },
      { title: 'Test READ', description: '(perms & READ) != 0 is true, so READ is set.', value: READ | EXEC, expression: '(perms & READ) != 0' },
      { title: 'Toggle EXEC', description: 'XOR with EXEC flips that bit off.', value: READ, expression: 'perms ^ EXEC' },
    ];

    return rows.map((row) => ({
      title: row.title,
      description: row.description,
      content: (
        <div className="space-y-2">
          <BitRow label="perms" value={row.value} accent />
          <div className="flex flex-wrap gap-2 font-mono text-[9px]">
            {[
              { name: 'READ', bit: READ },
              { name: 'WRITE', bit: WRITE },
              { name: 'EXEC', bit: EXEC },
            ].map((flag) => (
              <span
                key={flag.name}
                className="rounded border px-2 py-0.5 font-bold"
                style={{
                  borderColor: row.value & flag.bit ? 'var(--c-ok)' : 'var(--c-border)',
                  backgroundColor: row.value & flag.bit ? 'var(--c-ok-soft)' : 'var(--c-surface)',
                  color: row.value & flag.bit ? 'var(--c-ok)' : 'var(--c-muted)',
                }}
              >
                {flag.name} {row.value & flag.bit ? 'set' : 'clear'}
              </span>
            ))}
          </div>
          <div className="rounded border px-2 py-1 font-mono text-[10px]" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
            {row.expression}
          </div>
        </div>
      ),
    }));
  }, [mode]);

  return <StepPlayer steps={steps} />;
}
