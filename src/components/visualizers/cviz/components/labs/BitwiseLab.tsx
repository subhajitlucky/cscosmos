'use client';

import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

type BitOp = 'AND' | 'OR' | 'XOR' | 'NOT' | 'SHL' | 'SHR';

const OPS: { id: BitOp; label: string; symbol: string }[] = [
  { id: 'AND', label: 'AND', symbol: '&' },
  { id: 'OR', label: 'OR', symbol: '|' },
  { id: 'XOR', label: 'XOR', symbol: '^' },
  { id: 'NOT', label: 'NOT', symbol: '~' },
  { id: 'SHL', label: 'Left shift', symbol: '<<' },
  { id: 'SHR', label: 'Right shift', symbol: '>>' },
];

function toBits(value: number, width = 8): string {
  return (value & 0xff).toString(2).padStart(width, '0');
}

function bitRows(value: number): number[] {
  return toBits(value)
    .split('')
    .map((bit) => Number(bit));
}

export function BitwiseLab() {
  const [a, setA] = useState(0b11001010);
  const [b, setB] = useState(0b10101010);
  const [op, setOp] = useState<BitOp>('AND');
  const [shift, setShift] = useState(1);

  const result = useMemo(() => {
    switch (op) {
      case 'AND':
        return a & b;
      case 'OR':
        return a | b;
      case 'XOR':
        return a ^ b;
      case 'NOT':
        return ~a & 0xff;
      case 'SHL':
        return (a << shift) & 0xff;
      case 'SHR':
        return (a >> shift) & 0xff;
      default:
        return 0;
    }
  }, [a, b, op, shift]);

  const expression = useMemo(() => {
    switch (op) {
      case 'AND':
        return 'a & b';
      case 'OR':
        return 'a | b';
      case 'XOR':
        return 'a ^ b';
      case 'NOT':
        return '~a & 0xFFu';
      case 'SHL':
        return `a << ${shift}`;
      case 'SHR':
        return `a >> ${shift}`;
    }
  }, [op, shift]);

  const toggleBit = (which: 'a' | 'b', index: number) => {
    const mask = 1 << (7 - index);
    if (which === 'a') setA((value) => value ^ mask);
    else setB((value) => value ^ mask);
  };

  const reset = () => {
    setA(0b11001010);
    setB(0b10101010);
    setOp('AND');
    setShift(1);
  };

  const aBits = bitRows(a);
  const bBits = bitRows(b);
  const resultBits = bitRows(result);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Bit playground</h3>
                <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>
                  Click a bit to flip it. All values are 8-bit unsigned.
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold"
                style={{ borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}
              >
                <RotateCcw className="h-3 w-3" /> reset
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'a', value: a, bits: aBits },
                { name: 'b', value: b, bits: bBits },
              ].map((row) => (
                <div key={row.name} className="flex flex-wrap items-center gap-2">
                  <span className="w-14 font-mono text-xs font-black" style={{ color: 'var(--c-primary)' }}>
                    {row.name} = {row.value}
                  </span>
                  <div className="flex gap-1">
                    {row.bits.map((bit, index) => (
                      <button
                        key={`${row.name}-${index}`}
                        type="button"
                        onClick={() => toggleBit(row.name as 'a' | 'b', index)}
                        className="flex h-8 w-7 items-center justify-center rounded border font-mono text-xs font-bold transition-colors"
                        style={{
                          borderColor: bit ? 'var(--c-primary)' : 'var(--c-border)',
                          backgroundColor: bit ? 'var(--c-primary-soft)' : 'var(--c-surface-2)',
                          color: bit ? 'var(--c-primary)' : 'var(--c-muted)',
                        }}
                        aria-label={`Toggle bit ${7 - index} of ${row.name}`}
                      >
                        {bit}
                      </button>
                    ))}
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
                    0x{row.value.toString(16).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
            <h3 className="mb-2 text-sm font-bold">Operation</h3>
            <div className="flex flex-wrap gap-1.5">
              {OPS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOp(item.id)}
                  className="rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-bold transition-colors"
                  style={{
                    borderColor: op === item.id ? 'var(--c-primary)' : 'var(--c-border)',
                    backgroundColor: op === item.id ? 'var(--c-primary-soft)' : 'var(--c-surface-2)',
                    color: op === item.id ? 'var(--c-primary)' : 'var(--c-muted)',
                  }}
                >
                  {item.label} <span className="opacity-60">{item.symbol}</span>
                </button>
              ))}
            </div>

            {(op === 'SHL' || op === 'SHR') && (
              <div className="mt-3 flex items-center gap-3">
                <span className="font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
                  shift amount
                </span>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={shift}
                  onChange={(event) => setShift(Number(event.target.value))}
                  className="w-40 accent-[var(--c-primary)]"
                />
                <span className="font-mono text-xs font-bold">{shift}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border-strong)', backgroundColor: 'var(--c-surface)' }}>
            <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--c-muted)' }}>
              result
            </div>
            <div className="font-mono text-sm font-bold" style={{ color: 'var(--c-primary)' }}>
              {expression}
            </div>
            <div className="mt-3 font-mono text-3xl font-black">{result}</div>
            <div className="mt-1 font-mono text-xs" style={{ color: 'var(--c-muted)' }}>
              hex 0x{result.toString(16).padStart(2, '0')} · bin {toBits(result)}
            </div>

            <div className="mt-4 flex gap-1">
              {resultBits.map((bit, index) => (
                <div
                  key={`result-${index}`}
                  className="flex h-9 flex-1 items-center justify-center rounded border font-mono text-xs font-bold"
                  style={{
                    borderColor: bit ? 'var(--c-primary)' : 'var(--c-border)',
                    backgroundColor: bit ? 'var(--c-primary-soft)' : 'var(--c-surface-2)',
                    color: bit ? 'var(--c-primary)' : 'var(--c-muted)',
                  }}
                >
                  {bit}
                </div>
              ))}
            </div>
          </div>

          <CodeBlock
            caption="bitwise.c"
            code={`unsigned a = ${a};  /* ${toBits(a)} */
unsigned b = ${b};  /* ${toBits(b)} */

printf("%u", ${expression});  /* ${result} */`}
          />

          <div className="rounded-2xl border p-4 text-[11px] leading-relaxed" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)', color: 'var(--c-muted)' }}>
            <strong style={{ color: 'var(--c-text)' }}>Exam note:</strong> bitwise operators work on each bit,
            while <span className="cviz-kbd">&amp;&amp;</span> and <span className="cviz-kbd">||</span> work on
            truth values. Do not mix them up in output-prediction questions.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
        <h3 className="mb-3 text-sm font-bold">Mask cheat sheet</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Test bit 2', code: '(x & (1u << 2)) != 0' },
            { label: 'Set bit 2', code: 'x |= (1u << 2)' },
            { label: 'Clear bit 2', code: 'x &= ~(1u << 2)' },
            { label: 'Toggle bit 2', code: 'x ^= (1u << 2)' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border p-2.5" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
              <div className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                {item.label}
              </div>
              <code className="mt-1 block font-mono text-[11px] font-bold" style={{ color: 'var(--c-primary)' }}>
                {item.code}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
