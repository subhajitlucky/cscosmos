'use client';

import React, { useState } from 'react';
import { Palette, Copy, Check, Sliders, Type, Maximize2 } from 'lucide-react';

const COLOR_SCALES = {
  Cyan: [
    { stop: '50', hex: '#ecfeff' },
    { stop: '100', hex: '#cffafe' },
    { stop: '200', hex: '#a5f3fc' },
    { stop: '300', hex: '#67e8f9' },
    { stop: '400', hex: '#22d3ee' },
    { stop: '500', hex: '#06b6d4' },
    { stop: '600', hex: '#0891b2' },
    { stop: '700', hex: '#0e7490' },
    { stop: '800', hex: '#155e75' },
    { stop: '900', hex: '#164e63' },
    { stop: '950', hex: '#083344' },
  ],
  Indigo: [
    { stop: '50', hex: '#eef2ff' },
    { stop: '100', hex: '#e0e7ff' },
    { stop: '200', hex: '#c7d2fe' },
    { stop: '300', hex: '#a5b4fc' },
    { stop: '400', hex: '#818cf8' },
    { stop: '500', hex: '#6366f1' },
    { stop: '600', hex: '#4f46e5' },
    { stop: '700', hex: '#4338ca' },
    { stop: '800', hex: '#3730a3' },
    { stop: '900', hex: '#312e81' },
    { stop: '950', hex: '#1e1b4b' },
  ],
  Emerald: [
    { stop: '50', hex: '#ecfdf5' },
    { stop: '100', hex: '#d1fae5' },
    { stop: '200', hex: '#a7f3d0' },
    { stop: '300', hex: '#6ee7b7' },
    { stop: '400', hex: '#34d399' },
    { stop: '500', hex: '#10b981' },
    { stop: '600', hex: '#059669' },
    { stop: '700', hex: '#047857' },
    { stop: '800', hex: '#065f46' },
    { stop: '900', hex: '#064e3b' },
    { stop: '950', hex: '#022c22' },
  ],
  Amber: [
    { stop: '50', hex: '#fffbeb' },
    { stop: '100', hex: '#fef3c7' },
    { stop: '200', hex: '#fde68a' },
    { stop: '300', hex: '#fcd34d' },
    { stop: '400', hex: '#fbbf24' },
    { stop: '500', hex: '#f59e0b' },
    { stop: '600', hex: '#d97706' },
    { stop: '700', hex: '#b45309' },
    { stop: '800', hex: '#92400e' },
    { stop: '900', hex: '#78350f' },
    { stop: '950', hex: '#451a03' },
  ],
  Rose: [
    { stop: '50', hex: '#fff1f2' },
    { stop: '100', hex: '#ffe4e6' },
    { stop: '200', hex: '#fecdd3' },
    { stop: '300', hex: '#fda4af' },
    { stop: '400', hex: '#fb7185' },
    { stop: '500', hex: '#f43f5e' },
    { stop: '600', hex: '#e11d48' },
    { stop: '700', hex: '#be123c' },
    { stop: '800', hex: '#9f1239' },
    { stop: '900', hex: '#881337' },
    { stop: '950', hex: '#4c0519' },
  ],
};

const SPACING_SCALE = [
  { token: '1', rem: '0.25rem', px: '4px' },
  { token: '2', rem: '0.5rem', px: '8px' },
  { token: '3', rem: '0.75rem', px: '12px' },
  { token: '4', rem: '1rem', px: '16px' },
  { token: '6', rem: '1.5rem', px: '24px' },
  { token: '8', rem: '2rem', px: '32px' },
  { token: '12', rem: '3rem', px: '48px' },
  { token: '16', rem: '4rem', px: '64px' },
  { token: '24', rem: '6rem', px: '96px' },
];

export function TokenMatrix() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--twc-primary)]/30 bg-[var(--twc-primary)]/10 text-[var(--twc-primary)] text-xs font-mono">
          <Palette className="w-3.5 h-3.5" /> Design System Tokens
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--twc-text)]">
          Tailwind <span className="text-[var(--twc-primary)] twc-glow">Token Matrix</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--twc-muted)] max-w-2xl leading-relaxed">
          Standardized harmonious color palettes, strict mathematical 4px spacing scale, and optical typography tokens.
        </p>
      </div>

      {/* Color Palettes Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[var(--twc-border-subtle)] pb-4">
          <Palette className="w-5 h-5 text-[var(--twc-primary)]" />
          <h2 className="font-display text-2xl font-bold text-[var(--twc-text)]">
            Harmonious Color Scales
          </h2>
        </div>

        <div className="space-y-6">
          {Object.entries(COLOR_SCALES).map(([name, scale]) => (
            <div key={name} className="space-y-2">
              <div className="text-xs font-mono font-bold text-[var(--twc-text)]">
                {name} Scale
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-11 gap-2">
                {scale.map((c) => (
                  <button
                    key={c.stop}
                    onClick={() => copyToClipboard(c.hex)}
                    className="p-3 rounded-xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] space-y-2 text-left hover:scale-105 transition-transform group"
                  >
                    <div
                      className="w-full h-8 rounded-lg shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="font-mono text-[10px] space-y-0.5">
                      <div className="text-[var(--twc-text)] font-bold">{c.stop}</div>
                      <div className="text-[var(--twc-muted)] flex items-center justify-between">
                        <span>{c.hex}</span>
                        {copiedHex === c.hex ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : null}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing Scale Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[var(--twc-border-subtle)] pb-4">
          <Sliders className="w-5 h-5 text-[var(--twc-indigo)]" />
          <h2 className="font-display text-2xl font-bold text-[var(--twc-text)]">
            Mathematical Spacing System (4px Base)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {SPACING_SCALE.map((s) => (
            <div
              key={s.token}
              className="p-4 rounded-xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-[120px]">
                <span className="font-bold text-[var(--twc-primary)]">w-{s.token} / p-{s.token}</span>
                <span className="text-[10px] text-[var(--twc-muted)]">({s.px})</span>
              </div>

              <div className="flex-grow flex items-center justify-end">
                <div
                  className="h-4 bg-[var(--twc-primary)] rounded"
                  style={{ width: s.px }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
