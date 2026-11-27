'use client';

import React, { useMemo, useState } from 'react';

const PLACES = [128, 64, 32, 16, 8, 4, 2, 1];

function toBits(value: number): boolean[] {
  return PLACES.map((place) => (value & place) !== 0);
}

export function BinaryBench() {
  const [value, setValue] = useState(65);
  const bits = useMemo(() => toBits(value), [value]);
  const binary = bits.map((bit) => (bit ? '1' : '0')).join('');
  const hex = value.toString(16).toUpperCase().padStart(2, '0');
  const ascii = value >= 32 && value < 127 ? String.fromCharCode(value) : '·';

  const toggle = (index: number) => {
    const next = bits.map((bit, bitIndex) => (bitIndex === index ? !bit : bit));
    setValue(next.reduce((total, bit, bitIndex) => total + (bit ? PLACES[bitIndex] : 0), 0));
  };

  const updateDecimal = (raw: string) => {
    if (raw === '') {
      setValue(0);
      return;
    }
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) setValue(Math.max(0, Math.min(255, Math.trunc(parsed))));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
        <label className="border p-4" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
          <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Decimal value</span>
          <input
            type="number"
            min={0}
            max={255}
            value={value}
            onChange={(event) => updateDecimal(event.target.value)}
            className="mt-2 w-full border-0 bg-transparent font-mono text-4xl font-bold outline-none"
            style={{ color: 'var(--it-text)' }}
            aria-label="Decimal value"
          />
          <span className="it-mono mt-1 block text-[9px]" style={{ color: 'var(--it-muted)' }}>0–255 · one byte</span>
        </label>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: 'Binary', value: binary },
            { label: 'Hex', value: `0x${hex}` },
            { label: 'ASCII', value: ascii },
            { label: 'Bits on', value: String(bits.filter(Boolean).length) },
          ].map((item) => (
            <div key={item.label} className="border p-3" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
              <div className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>{item.label}</div>
              <div className="it-mono mt-1 break-all text-lg font-bold">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-end justify-between">
          <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Click a switch</p>
          <p className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>128 · 64 · 32 · 16 · 8 · 4 · 2 · 1</p>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {PLACES.map((place, index) => (
            <button
              key={place}
              type="button"
              onClick={() => toggle(index)}
              className="border p-2 text-center"
              style={{
                borderColor: bits[index] ? 'var(--it-primary)' : 'var(--it-border)',
                backgroundColor: bits[index] ? 'var(--it-primary-soft)' : 'var(--it-surface)',
              }}
              aria-pressed={bits[index]}
              aria-label={`Bit ${place}`}
            >
              <span className="it-mono block text-[9px]" style={{ color: 'var(--it-muted)' }}>{place}</span>
              <span className="it-mono mt-1 block text-2xl font-bold" style={{ color: bits[index] ? 'var(--it-primary)' : 'var(--it-muted)' }}>{bits[index] ? '1' : '0'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border p-4" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
        <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>What changed</p>
        <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
          The byte <span className="it-mono" style={{ color: 'var(--it-text)' }}>{binary}</span> equals{' '}
          <span className="it-mono" style={{ color: 'var(--it-text)' }}>{value}</span> in decimal and{' '}
          <span className="it-mono" style={{ color: 'var(--it-text)' }}>0x{hex}</span> in hex. The character{' '}
          <span className="it-mono" style={{ color: 'var(--it-primary)' }}>{ascii}</span> is only meaningful because a character set maps this number to it.
        </p>
      </div>
    </div>
  );
}
