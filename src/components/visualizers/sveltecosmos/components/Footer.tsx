'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--svelte-primary)]/10 border border-[var(--svelte-primary)]/30 flex items-center justify-center text-[var(--svelte-primary)]">
            <Flame className="w-4 h-4 fill-[var(--svelte-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--svelte-text)]">
              SvelteCosmos
            </span>
            <p className="text-[11px] text-[var(--svelte-muted)] font-mono">
              Compile-time UI & Svelte 5 Runes Visualizer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--svelte-muted)] font-mono">
          <Link href="/sveltecosmos/learn" className="hover:text-[var(--svelte-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/sveltecosmos/runes" className="hover:text-[var(--svelte-primary)] transition-colors">
            Runes Sandbox
          </Link>
          <Link href="/sveltecosmos/compiler" className="hover:text-[var(--svelte-primary)] transition-colors">
            AST Compiler Lab
          </Link>
          <Link href="/sveltecosmos/about" className="hover:text-[var(--svelte-primary)] transition-colors">
            Manifesto
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--svelte-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--svelte-primary)]" />
        </div>
      </div>
    </footer>
  );
}
