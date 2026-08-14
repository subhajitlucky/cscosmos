'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--lld-primary)]/10 border border-[var(--lld-primary)]/30 flex items-center justify-center text-[var(--lld-primary)]">
            <Box className="w-4 h-4 text-[var(--lld-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--lld-text)]">
              LLD::COSMOS
            </span>
            <p className="text-[11px] text-[var(--lld-muted)] font-mono">
              Low-Level Design &bull; SOLID Principles &bull; Design Patterns &bull; Clean Architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--lld-muted)] font-mono">
          <Link href="/lldcosmos/learn" className="hover:text-[var(--lld-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/lldcosmos/solid-lab" className="hover:text-[var(--lld-primary)] transition-colors">
            SOLID Lab
          </Link>
          <Link href="/lldcosmos/patterns-lab" className="hover:text-[var(--lld-primary)] transition-colors">
            GoF Patterns Lab
          </Link>
          <Link href="/lldcosmos/about" className="hover:text-[var(--lld-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--lld-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--lld-primary)]" />
        </div>
      </div>
    </footer>
  );
}
