'use client';

import React from 'react';
import { ConcurrencyVisualizer } from '../components/ConcurrencyVisualizer';
import { GitBranch, Zap, ShieldCheck, Cpu } from 'lucide-react';

export function ConcurrencyLab() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <GitBranch className="h-3.5 w-3.5" />
          <span>Fearless Multithreading</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          Concurrency &amp; Channels Lab
        </h1>
        <p className="text-sm text-[var(--rust-muted)] max-w-2xl">
          Simulate actor-style message passing over <code>mpsc</code> channels, backpressure in bounded queues, and thread-safe data synchronization without data races.
        </p>
      </div>

      {/* Main Visualizer Container */}
      <div className="rust-card rounded-2xl p-6 sm:p-8 bg-[var(--rust-surface)]">
        <ConcurrencyVisualizer />
      </div>

      {/* Concurrency Core Traits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="rust-card rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold uppercase text-[var(--rust-primary)] font-mono flex items-center">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> The Send Trait (Move Across Threads)
          </div>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Indicates that ownership of the data can be safely transferred to another OS thread. If a type does not contain thread-bound handles (like raw pointers or Rc), Rust auto-implements Send.
          </p>
        </div>

        <div className="rust-card rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold uppercase text-[var(--rust-cyan)] font-mono flex items-center">
            <Cpu className="h-3.5 w-3.5 mr-1.5" /> The Sync Trait (Shared References Across Threads)
          </div>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Indicates that immutable references (<code>&amp;T</code>) can be read concurrently from multiple threads without data races. Mathematically: <code>T: Sync &lt;=&gt; &amp;T: Send</code>.
          </p>
        </div>
      </div>

    </div>
  );
}
