'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--bu-border-subtle)] bg-[var(--bu-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--bu-primary)]/10 border border-[var(--bu-primary)]/30 flex items-center justify-center text-[var(--bu-primary)]">
            <Compass className="w-4 h-4 text-[var(--bu-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--bu-text)]">
              BROWSER::UNIVERSE
            </span>
            <p className="text-[11px] text-[var(--bu-muted)] font-mono">
              Critical Rendering Path &bull; V8 Engine &bull; Event Loop &bull; Multi-Process Architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--bu-muted)] font-mono">
          <Link href="/browseruniverse/learn" className="hover:text-[var(--bu-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/browseruniverse/crp-lab" className="hover:text-[var(--bu-primary)] transition-colors">
            CRP &amp; Reflow Lab
          </Link>
          <Link href="/browseruniverse/v8-lab" className="hover:text-[var(--bu-primary)] transition-colors">
            V8 JIT Lab
          </Link>
          <Link href="/browseruniverse/about" className="hover:text-[var(--bu-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--bu-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--bu-primary)]" />
        </div>
      </div>
    </footer>
  );
}
