'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, Layers, Cpu, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--sync-primary)]/30 bg-[var(--sync-primary)]/10 text-[var(--sync-primary)] text-xs font-mono">
          <RefreshCw className="w-3.5 h-3.5" /> SYNC::COSMOS Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--sync-text)]">
          The Architecture of <span className="text-[var(--sync-primary)] sync-glow">Strong Eventual</span> Consistency
        </h1>

        <p className="text-base md:text-lg text-[var(--sync-muted)] max-w-3xl leading-relaxed">
          Distributed systems synchronization is the mathematical discipline of enabling concurrent collaborative mutations across unreliable networks with mathematically provable deterministic convergence.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--sync-primary)] font-bold">01 / JOIN-SEMILATTICES</span>
          <h3 className="font-display font-bold text-xl text-[var(--sync-text)]">Mathematical Merge</h3>
          <p className="text-xs text-[var(--sync-muted)] leading-relaxed">
            Commutative, Associative, and Idempotent merge operators guarantee that all replicas converge to the exact same state regardless of packet arrival order or duplicates.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--sync-teal)] font-bold">02 / LOCAL-FIRST P2P</span>
          <h3 className="font-display font-bold text-xl text-[var(--sync-text)]">Zero Latency Writes</h3>
          <p className="text-xs text-[var(--sync-muted)] leading-relaxed">
            By operating on local immutable data structures, users type with 0ms input lag, synchronizing deltas across peer-to-peer WebRTC channels in the background.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--sync-amber)] font-bold">03 / CAUSAL VECTOR CLOCKS</span>
          <h3 className="font-display font-bold text-xl text-[var(--sync-text)]">Happens-Before Order</h3>
          <p className="text-xs text-[var(--sync-muted)] leading-relaxed">
            Logical clocks establish strict partial causal ordering across independent computers without relying on drift-prone physical hardware clocks.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--sync-border)] bg-[var(--sync-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--sync-text)]">
            Ready to master Real-Time Sync &amp; CRDTs?
          </h3>
          <p className="text-xs text-[var(--sync-muted)]">
            Explore the complete 5-module curriculum map.
          </p>
        </div>

        <Link
          href="/synccosmos/learn"
          className="px-6 py-3 rounded-lg bg-[var(--sync-primary)] text-black font-semibold text-xs hover:bg-[var(--sync-primary-hover)] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
