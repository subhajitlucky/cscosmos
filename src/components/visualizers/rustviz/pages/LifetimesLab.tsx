'use client';

import React from 'react';
import { LifetimeVisualizer } from '../components/LifetimeVisualizer';
import { Clock, GitBranch, Sparkles, CheckCircle2 } from 'lucide-react';

export function LifetimesLab() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <Clock className="h-3.5 w-3.5" />
          <span>Lifespan Overlap Proofs</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          Lifetimes &amp; Variance Lab
        </h1>
        <p className="text-sm text-[var(--rust-muted)] max-w-2xl">
          Visualize lifetime relationships (&apos;a), the 3 lifetime elision rules, and subtyping variance rules (Covariance vs Invariance).
        </p>
      </div>

      {/* Main Visualizer Container */}
      <div className="rust-card rounded-2xl p-6 sm:p-8 bg-[var(--rust-surface)]">
        <LifetimeVisualizer />
      </div>

      {/* 3 Elision Rules Overview */}
      <div className="rust-card rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-[var(--rust-text)] uppercase tracking-wider flex items-center">
          <Sparkles className="h-4 w-4 text-[var(--rust-primary)] mr-2" />
          The 3 Lifetime Elision Rules Desugared
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-[var(--rust-muted)]">
          <div className="p-4 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)] space-y-2">
            <div className="font-bold text-[var(--rust-text)] font-sans">Rule 1: Input Parameters</div>
            <p className="font-sans leading-relaxed">
              Each elided lifetime in function arguments is assigned its own distinct lifetime parameter.
            </p>
            <div className="text-[10px] text-[var(--rust-primary)]">fn f(x: &amp;i32, y: &amp;i32) &rarr; fn f&lt;&apos;a, &apos;b&gt;</div>
          </div>

          <div className="p-4 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)] space-y-2">
            <div className="font-bold text-[var(--rust-text)] font-sans">Rule 2: Single Input</div>
            <p className="font-sans leading-relaxed">
              If there is exactly one input lifetime, that lifetime is assigned to all output references.
            </p>
            <div className="text-[10px] text-[var(--rust-cyan)]">fn f(x: &amp;str) &rarr; &amp;str &rarr; fn f&lt;&apos;a&gt;(&apos;a) &rarr; &apos;a</div>
          </div>

          <div className="p-4 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)] space-y-2">
            <div className="font-bold text-[var(--rust-text)] font-sans">Rule 3: &amp;self / &amp;mut self</div>
            <p className="font-sans leading-relaxed">
              If there are multiple input parameters and one is &amp;self, the lifetime of self is assigned to all outputs.
            </p>
            <div className="text-[10px] text-[var(--rust-emerald)]">fn get(&amp;self, x: &amp;str) &rarr; &amp;str &rarr; output borrows self</div>
          </div>
        </div>
      </div>

    </div>
  );
}
