'use client';

import React from 'react';
import { BorrowCheckerVisualizer } from '../components/BorrowCheckerVisualizer';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

export function BorrowCheckerLab() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Aliasing XOR Mutability</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          Borrow Checker &amp; NLL Inspector
        </h1>
        <p className="text-sm text-[var(--rust-muted)] max-w-2xl">
          Observe how the compiler enforces compile-time reader/writer locks and computes Non-Lexical Lifetime live ranges across control flow branches.
        </p>
      </div>

      {/* Main Visualizer Container */}
      <div className="rust-card rounded-2xl p-6 sm:p-8 bg-[var(--rust-surface)]">
        <BorrowCheckerVisualizer />
      </div>

      {/* Deep Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="rust-card rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold uppercase text-[var(--rust-emerald)] font-mono flex items-center">
            <Lock className="h-3.5 w-3.5 mr-1.5" /> Shared Borrows (&amp;T) Freeze State
          </div>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            When an immutable reference is active, the original value is read-locked (frozen). Neither the owner nor any other part of the program can mutate it until all shared loans expire.
          </p>
        </div>

        <div className="rust-card rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold uppercase text-[var(--rust-primary)] font-mono flex items-center">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Non-Lexical Lifetimes (NLL)
          </div>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Borrows do not need to last until the closing curly brace <code>{'}'}</code>. NLL tracks the exact Control Flow Graph (CFG) line where the reference is last accessed.
          </p>
        </div>
      </div>

    </div>
  );
}
