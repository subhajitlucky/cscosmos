'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Layers, Box, Zap, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--wasm-primary)]/30 bg-[var(--wasm-primary)]/10 text-[var(--wasm-primary)] text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" /> WASM::COSMOS Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--wasm-text)]">
          The Architecture of <span className="text-[var(--wasm-primary)] wasm-glow">Near-Native</span> Sandboxed Computing
        </h1>

        <p className="text-base md:text-lg text-[var(--wasm-muted)] max-w-3xl leading-relaxed">
          WebAssembly is not a programming language; it is a universal, sandboxed virtual machine binary format designed to execute code across any hardware architecture at physical CPU limits.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--wasm-primary)] font-bold">01 / STACK MACHINE</span>
          <h3 className="font-display font-bold text-xl text-[var(--wasm-text)]">Structured Bytecode</h3>
          <p className="text-xs text-[var(--wasm-muted)] leading-relaxed">
            By banning arbitrary goto jumps and using an abstract evaluation stack, Wasm code is statically verifiable for memory safety in a single linear pass.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--wasm-cyan)] font-bold">02 / ZERO-COPY MEMORY</span>
          <h3 className="font-display font-bold text-xl text-[var(--wasm-text)]">Linear ArrayBuffer</h3>
          <p className="text-xs text-[var(--wasm-muted)] leading-relaxed">
            64KB memory pages allow high-speed numeric computation and direct byte sharing with JavaScript TypedArrays without data copying.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--wasm-emerald)] font-bold">03 / CAPABILITY SANDBOX</span>
          <h3 className="font-display font-bold text-xl text-[var(--wasm-text)]">WASI Security</h3>
          <p className="text-xs text-[var(--wasm-muted)] leading-relaxed">
            A WebAssembly module has 0 access to host files, network, or hardware unless explicitly granted capabilities via host import tables.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--wasm-border)] bg-[var(--wasm-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--wasm-text)]">
            Ready to master WebAssembly internals?
          </h3>
          <p className="text-xs text-[var(--wasm-muted)]">
            Explore the complete 8-module curriculum map.
          </p>
        </div>

        <Link
          href="/wasmcosmos/learn"
          className="px-6 py-3 rounded-lg bg-[var(--wasm-primary)] text-white font-semibold text-xs hover:bg-[var(--wasm-primary-hover)] transition-all shadow-[0_0_20px_rgba(101,79,240,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
