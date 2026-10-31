'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Sparkles, BookOpen, Activity, Table, Info } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--cp-border)] bg-[var(--cp-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--cp-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--cp-surface-2)] border border-[var(--cp-border)] flex items-center justify-center text-[var(--cp-primary)]">
              <Smartphone className="w-4 h-4 text-[var(--cp-primary)]" />
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-wide text-[var(--cp-text)]">
                MOBILE::INTERNALS
              </span>
              <p className="text-[11px] text-[var(--cp-muted)] font-mono">
                14-Topic Progressive Curriculum &bull; OS Pipeline to C++ JSI &amp; Impeller
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--cp-muted)] font-mono">
            <Link href="/crossplatformviz/learn" className="hover:text-[var(--cp-primary)] transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Concept Map (14 Topics)
            </Link>
            <Link href="/crossplatformviz/bridge-sim" className="hover:text-[var(--cp-primary)] transition-colors flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Bridge vs JSI Lab
            </Link>
            <Link href="/crossplatformviz/engine-matrix" className="hover:text-[var(--cp-primary)] transition-colors flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5" /> Engine Matrix
            </Link>
            <Link href="/crossplatformviz/about" className="hover:text-[var(--cp-primary)] transition-colors flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Architecture
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--cp-muted)]">
          <p>
            Curriculum: Foundations &rarr; React Native JSI &rarr; Flutter Impeller &rarr; Kotlin Multiplatform
          </p>
          <div className="flex items-center gap-2">
            <span>Part of CSCosmos</span>
            <Sparkles className="w-3.5 h-3.5 text-[var(--cp-primary)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
