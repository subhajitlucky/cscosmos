'use client';

import React from 'react';
import Link from 'next/link';
import { Wind, Layers, Box, Cpu, Palette } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--twc-primary)]/30 bg-[var(--twc-primary)]/10 text-[var(--twc-primary)] text-xs font-mono">
          <Wind className="w-3.5 h-3.5" /> TAILWIND::COSMOS Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--twc-text)]">
          The Architecture of <span className="text-[var(--twc-primary)] twc-glow">Utility-First</span> Design Systems
        </h1>

        <p className="text-base md:text-lg text-[var(--twc-muted)] max-w-3xl leading-relaxed">
          Tailwind CSS inverted 20 years of CSS conventions by proving that composing atomic, immutable utility tokens directly in template markup scales better than naming bespoke semantic classes for every UI element.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--twc-primary)] font-bold">01 / O(1) BUNDLE SIZE</span>
          <h3 className="font-display font-bold text-xl text-[var(--twc-text)]">Finite CSS Scale</h3>
          <p className="text-xs text-[var(--twc-muted)] leading-relaxed">
            Because utility classes are reused thousands of times across hundreds of components, your global stylesheet stops growing and stabilizes at ~10-15kB.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--twc-indigo)] font-bold">02 / LOCAL REFACTORING</span>
          <h3 className="font-display font-bold text-xl text-[var(--twc-text)]">Zero Side Effects</h3>
          <p className="text-xs text-[var(--twc-muted)] leading-relaxed">
            Changing markup or deleting a component removes its styles locally without the lingering fear of breaking a completely different page.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--twc-emerald)] font-bold">03 / JIT COMPILATION</span>
          <h3 className="font-display font-bold text-xl text-[var(--twc-text)]">Rust Oxide Engine</h3>
          <p className="text-xs text-[var(--twc-muted)] leading-relaxed">
            Tailwind scans candidate tokens directly in template markup and generates custom on-demand CSS in under 10ms with zero runtime JavaScript overhead.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--twc-border)] bg-[var(--twc-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--twc-text)]">
            Ready to master utility-first design systems?
          </h3>
          <p className="text-xs text-[var(--twc-muted)]">
            Explore the complete 8-module curriculum map.
          </p>
        </div>

        <Link
          href="/tailwindcosmos/learn"
          className="px-6 py-3 rounded-lg bg-[var(--twc-primary)] text-black font-semibold text-xs hover:bg-[var(--twc-primary-hover)] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
