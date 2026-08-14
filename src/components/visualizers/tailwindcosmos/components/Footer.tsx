'use client';

import React from 'react';
import Link from 'next/link';
import { Wind, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--twc-primary)]/10 border border-[var(--twc-primary)]/30 flex items-center justify-center text-[var(--twc-primary)]">
            <Wind className="w-4 h-4 text-[var(--twc-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--twc-text)]">
              TAILWIND::COSMOS
            </span>
            <p className="text-[11px] text-[var(--twc-muted)] font-mono">
              Utility-First Design Systems &amp; JIT Engine Internals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--twc-muted)] font-mono">
          <Link href="/tailwindcosmos/learn" className="hover:text-[var(--twc-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/tailwindcosmos/playground" className="hover:text-[var(--twc-primary)] transition-colors">
            Playground
          </Link>
          <Link href="/tailwindcosmos/token-matrix" className="hover:text-[var(--twc-primary)] transition-colors">
            Tokens
          </Link>
          <Link href="/tailwindcosmos/about" className="hover:text-[var(--twc-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--twc-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--twc-primary)]" />
        </div>
      </div>
    </footer>
  );
}
