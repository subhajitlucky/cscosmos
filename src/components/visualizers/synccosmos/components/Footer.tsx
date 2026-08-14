'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--sync-primary)]/10 border border-[var(--sync-primary)]/30 flex items-center justify-center text-[var(--sync-primary)]">
            <RefreshCw className="w-4 h-4 text-[var(--sync-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--sync-text)]">
              SYNC::COSMOS
            </span>
            <p className="text-[11px] text-[var(--sync-muted)] font-mono">
              Conflict-Free Replicated Data Types (CRDTs) &bull; Operational Transformation &bull; Vector Clocks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--sync-muted)] font-mono">
          <Link href="/synccosmos/learn" className="hover:text-[var(--sync-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/synccosmos/crdt-lab" className="hover:text-[var(--sync-primary)] transition-colors">
            CRDT Text Lab
          </Link>
          <Link href="/synccosmos/vector-clock" className="hover:text-[var(--sync-primary)] transition-colors">
            Vector Clock Lab
          </Link>
          <Link href="/synccosmos/about" className="hover:text-[var(--sync-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--sync-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--sync-primary)]" />
        </div>
      </div>
    </footer>
  );
}
