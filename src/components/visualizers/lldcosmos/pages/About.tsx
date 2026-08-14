'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Layers, Cpu, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--lld-primary)]/30 bg-[var(--lld-primary)]/10 text-[var(--lld-primary)] text-xs font-mono">
          <Box className="w-3.5 h-3.5" /> LLD::COSMOS Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--lld-text)]">
          The Architecture of <span className="text-[var(--lld-primary)] lld-glow">Clean, Maintainable</span> Object-Oriented Code
        </h1>

        <p className="text-base md:text-lg text-[var(--lld-muted)] max-w-3xl leading-relaxed">
          Low-Level Design is the craft of organizing software into flexible, decoupled class hierarchies that remain easy to test, extend, and maintain as requirements evolve over years.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--lld-primary)] font-bold">01 / SOLID FOUNDATION</span>
          <h3 className="font-display font-bold text-xl text-[var(--lld-text)]">Single Responsibility</h3>
          <p className="text-xs text-[var(--lld-muted)] leading-relaxed">
            By assigning exactly one reason to change per class, systems achieve loose coupling and maximum unit test coverage with fast mocks.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--lld-emerald)] font-bold">02 / OPEN FOR EXTENSION</span>
          <h3 className="font-display font-bold text-xl text-[var(--lld-text)]">Polymorphic Strategy</h3>
          <p className="text-xs text-[var(--lld-muted)] leading-relaxed">
            Interchangeable strategy and state patterns eliminate brittle cyclomatic switch branching, enabling zero-regression feature additions.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--lld-purple)] font-bold">03 / INVERSION OF CONTROL</span>
          <h3 className="font-display font-bold text-xl text-[var(--lld-text)]">Dependency Inversion</h3>
          <p className="text-xs text-[var(--lld-muted)] leading-relaxed">
            High-level business rules never depend on low-level database or network drivers; both depend on stable abstract interfaces.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--lld-border)] bg-[var(--lld-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--lld-text)]">
            Ready to master Low-Level Design &amp; SOLID?
          </h3>
          <p className="text-xs text-[var(--lld-muted)]">
            Explore the complete 5-module curriculum map.
          </p>
        </div>

        <Link
          href="/lldcosmos/learn"
          className="px-6 py-3 rounded-lg bg-[var(--lld-primary)] text-white font-semibold text-xs hover:bg-[var(--lld-primary-hover)] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
