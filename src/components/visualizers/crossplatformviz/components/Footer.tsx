'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--cp-border-subtle)] bg-[var(--cp-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--cp-primary)]/10 border border-[var(--cp-primary)]/30 flex items-center justify-center text-[var(--cp-primary)]">
            <Smartphone className="w-4 h-4 text-[var(--cp-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--cp-text)]">
              MOBILE::INTERNALS
            </span>
            <p className="text-[11px] text-[var(--cp-muted)] font-mono">
              React Native JSI &bull; Fabric &bull; Flutter Impeller &bull; Kotlin Multiplatform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--cp-muted)] font-mono">
          <Link href="/crossplatformviz/learn" className="hover:text-[var(--cp-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/crossplatformviz/bridge-sim" className="hover:text-[var(--cp-primary)] transition-colors">
            Bridge vs JSI Lab
          </Link>
          <Link href="/crossplatformviz/engine-matrix" className="hover:text-[var(--cp-primary)] transition-colors">
            Engine Matrix
          </Link>
          <Link href="/crossplatformviz/about" className="hover:text-[var(--cp-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--cp-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--cp-primary)]" />
        </div>
      </div>
    </footer>
  );
}
