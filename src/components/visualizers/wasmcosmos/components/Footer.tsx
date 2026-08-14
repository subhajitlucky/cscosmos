'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--wasm-primary)]/10 border border-[var(--wasm-primary)]/30 flex items-center justify-center text-[var(--wasm-primary)]">
            <Cpu className="w-4 h-4 text-[var(--wasm-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--wasm-text)]">
              WASM::COSMOS
            </span>
            <p className="text-[11px] text-[var(--wasm-muted)] font-mono">
              WebAssembly Virtual Stack Machine &amp; Linear Memory Internals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--wasm-muted)] font-mono">
          <Link href="/wasmcosmos/learn" className="hover:text-[var(--wasm-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/wasmcosmos/stack-lab" className="hover:text-[var(--wasm-primary)] transition-colors">
            Stack Lab
          </Link>
          <Link href="/wasmcosmos/wat-compiler" className="hover:text-[var(--wasm-primary)] transition-colors">
            Bytecode Explorer
          </Link>
          <Link href="/wasmcosmos/about" className="hover:text-[var(--wasm-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--wasm-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--wasm-primary)]" />
        </div>
      </div>
    </footer>
  );
}
