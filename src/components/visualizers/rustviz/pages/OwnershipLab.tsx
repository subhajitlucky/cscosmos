'use client';

import React from 'react';
import { OwnershipVisualizer } from '../components/OwnershipVisualizer';
import { Layers, Sparkles, HardDrive, CheckCircle2 } from 'lucide-react';

export function OwnershipLab() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <Layers className="h-3.5 w-3.5" />
          <span>Physical Memory Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          Ownership &amp; Move Semantics Lab
        </h1>
        <p className="text-sm text-[var(--rust-muted)] max-w-2xl">
          Observe how the compiler manages 24-byte fat pointer stack descriptors, dynamic heap buffer transfers, and zero-cost automatic drops.
        </p>
      </div>

      {/* Main Visualizer Container */}
      <div className="rust-card rounded-2xl p-6 sm:p-8 bg-[var(--rust-surface)]">
        <OwnershipVisualizer />
      </div>

      {/* Deep-Dive Technical Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="rust-card rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold uppercase text-[var(--rust-primary)] font-mono flex items-center">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Move Semantics
          </div>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Assigning a heap-backed variable in Rust only copies the 24-byte pointer metadata on the stack. The source variable is statically marked uninitialized.
          </p>
        </div>

        <div className="rust-card rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold uppercase text-[var(--rust-cyan)] font-mono flex items-center">
            <HardDrive className="h-3.5 w-3.5 mr-1.5" /> Zero Double-Free
          </div>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Because moved variables are invalidated, when the enclosing scope exits, only the active owner&apos;s Drop implementation triggers memory deallocation.
          </p>
        </div>

        <div className="rust-card rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold uppercase text-[var(--rust-amber)] font-mono flex items-center">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Copy vs Clone
          </div>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Types implementing <code>Copy</code> (i32, bool, [T; N]) duplicate their bits on the stack. Heap types require explicit <code>.clone()</code> to duplicate buffers.
          </p>
        </div>
      </div>

    </div>
  );
}
