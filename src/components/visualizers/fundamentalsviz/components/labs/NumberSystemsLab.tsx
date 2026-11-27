'use client';

import React, { useMemo, useState } from 'react';

function toBits(value: number): string {
  return (value & 0xff).toString(2).padStart(8, '0');
}

function bcd(value: number): string {
  return String(value)
    .split('')
    .map((digit) => Number(digit).toString(2).padStart(4, '0'))
    .join(' ');
}

export function NumberSystemsLab() {
  const [value, setValue] = useState(45);
  const [mode, setMode] = useState<'unsigned' | 'signed'>('unsigned');

  const result = useMemo(() => {
    const normalized = Math.max(0, Math.min(255, Math.trunc(value)));
    const bits = toBits(normalized);
    const signed = normalized > 127 ? normalized - 256 : normalized;
    return {
      bits,
      octal: normalized.toString(8).toUpperCase(),
      hex: normalized.toString(16).toUpperCase().padStart(2, '0'),
      bcd: bcd(normalized),
      signed,
      twos: toBits(normalized),
    };
  }, [value]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
        <label className="border p-4" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
          <span className="it-kicker text-[10px]" style={{ color: 'var(--it-muted)' }}>Decimal value</span>
          <input
            type="number"
            min={0}
            max={255}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="mt-2 w-full border-0 bg-transparent font-mono text-4xl font-bold outline-none"
            aria-label="Decimal value"
          />
          <span className="it-mono mt-1 block text-[10px]" style={{ color: 'var(--it-muted)' }}>0–255 · one byte</span>
        </label>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { label: 'Binary', value: result.bits },
            { label: 'Octal', value: `0o${result.octal}` },
            { label: 'Hexadecimal', value: `0x${result.hex}` },
            { label: 'BCD', value: result.bcd },
            { label: '2’s complement', value: `0b${result.twos}` },
            { label: 'Signed value', value: String(result.signed) },
          ].map((item) => (
            <div key={item.label} className="border p-3" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
              <div className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>{item.label}</div>
              <div className="it-mono mt-1 break-all text-[13px] font-bold">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>Read the bits as</span>
        {(['unsigned', 'signed'] as const).map((item) => (
          <button key={item} type="button" onClick={() => setMode(item)} className="border-b-2 px-2 py-1 text-[12px] font-semibold" style={{ borderColor: mode === item ? 'var(--it-primary)' : 'transparent', color: mode === item ? 'var(--it-text)' : 'var(--it-muted)' }}>{item}</button>
        ))}
        <span className="it-mono text-[11px]" style={{ color: 'var(--it-muted)' }}>{mode === 'unsigned' ? `${value} is ${result.bits}` : `the same bits mean ${result.signed} in signed 8-bit`}</span>
      </div>

      <div className="border p-4" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
        <p className="it-kicker text-[10px]" style={{ color: 'var(--it-muted)' }}>How to read it</p>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
          Binary place values are 128, 64, 32, 16, 8, 4, 2, 1. Group the bits in fours to read hex, in threes to read octal.
          BCD stores each decimal digit separately in four bits; it is not the same as binary.
        </p>
      </div>
    </div>
  );
}
