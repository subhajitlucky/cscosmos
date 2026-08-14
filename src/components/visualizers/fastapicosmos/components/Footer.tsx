'use client';

import React from 'react';
import Link from 'next/link';
import { Server, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--fastapi-teal)]/10 border border-[var(--fastapi-teal)]/30 flex items-center justify-center text-[var(--fastapi-teal)]">
            <Server className="w-4 h-4 text-[var(--fastapi-teal)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--fastapi-text)]">
              FASTAPI::COSMOS
            </span>
            <p className="text-[11px] text-[var(--fastapi-muted)] font-mono">
              High-Performance Python AsyncIO, Pydantic V2 &amp; Dependency Injection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--fastapi-muted)] font-mono">
          <Link href="/fastapicosmos/learn" className="hover:text-[var(--fastapi-teal)] transition-colors">
            Concept Map
          </Link>
          <Link href="/fastapicosmos/di-graph" className="hover:text-[var(--fastapi-teal)] transition-colors">
            DI Graph Lab
          </Link>
          <Link href="/fastapicosmos/async-lab" className="hover:text-[var(--fastapi-teal)] transition-colors">
            AsyncIO Lab
          </Link>
          <Link href="/fastapicosmos/about" className="hover:text-[var(--fastapi-teal)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--fastapi-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--fastapi-teal)]" />
        </div>
      </div>
    </footer>
  );
}
