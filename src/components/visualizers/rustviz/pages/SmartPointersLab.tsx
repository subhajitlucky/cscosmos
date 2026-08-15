'use client';

import React from 'react';
import { SmartPointerVisualizer } from '../components/SmartPointerVisualizer';
import { Cpu, HardDrive, ShieldCheck, Zap } from 'lucide-react';

export function SmartPointersLab() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <Cpu className="h-3.5 w-3.5" />
          <span>Indirection &amp; Shared Ownership</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          Smart Pointers &amp; Memory Layout Sandbox
        </h1>
        <p className="text-sm text-[var(--rust-muted)] max-w-2xl">
          Simulate reference counter manipulation in Box, Rc, Arc, dynamic interior mutability with RefCell, and reference cycle prevention using Weak pointers.
        </p>
      </div>

      {/* Main Visualizer Container */}
      <div className="rust-card rounded-2xl p-6 sm:p-8 bg-[var(--rust-surface)]">
        <SmartPointerVisualizer />
      </div>

      {/* Smart Pointer Comparison Matrix */}
      <div className="rust-card rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-[var(--rust-text)] uppercase tracking-wider">
          Standard Smart Pointers Architectural Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-[var(--rust-text)]">
            <thead>
              <tr className="border-b border-[var(--rust-border)] text-[var(--rust-muted)] text-[10px] uppercase">
                <th className="pb-2">Pointer</th>
                <th className="pb-2">Ownership</th>
                <th className="pb-2">Thread Safety</th>
                <th className="pb-2">Mutability</th>
                <th className="pb-2">Runtime Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rust-border-subtle)]">
              <tr>
                <td className="py-2.5 font-bold text-[var(--rust-primary)]">Box&lt;T&gt;</td>
                <td>Unique (Single Owner)</td>
                <td>Send + Sync (if T: Send + Sync)</td>
                <td>Inherited from binding</td>
                <td>Zero-cost (8B stack pointer)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-[var(--rust-cyan)]">Rc&lt;T&gt;</td>
                <td>Shared (Ref-Counted)</td>
                <td className="text-rose-400">!Send, !Sync (Single Thread)</td>
                <td>Immutable</td>
                <td>Cell increments (Non-atomic)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-[var(--rust-emerald)]">Arc&lt;T&gt;</td>
                <td>Shared (Ref-Counted)</td>
                <td className="text-emerald-400">Send + Sync (Thread Safe)</td>
                <td>Immutable</td>
                <td>Atomic CPU fetch_add/sub</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-[var(--rust-amber)]">RefCell&lt;T&gt;</td>
                <td>Interior Mutability</td>
                <td className="text-rose-400">!Sync (Single Thread)</td>
                <td>Dynamic runtime borrows</td>
                <td>Borrow count integer check</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-[var(--rust-purple)]">Mutex&lt;T&gt;</td>
                <td>Interior Mutability</td>
                <td className="text-emerald-400">Send + Sync (Multi Thread)</td>
                <td>Exclusive Lock Guard</td>
                <td>OS / Futex lock contention</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
