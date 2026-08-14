'use client';

import React from 'react';
import Link from 'next/link';
import { Server, Layers, Cpu, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--fastapi-teal)]/30 bg-[var(--fastapi-teal)]/10 text-[var(--fastapi-teal)] text-xs font-mono">
          <Server className="w-3.5 h-3.5" /> FASTAPI::COSMOS Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--fastapi-text)]">
          The Architecture of <span className="text-[var(--fastapi-teal)] fastapi-glow">High-Throughput</span> Async Python
        </h1>

        <p className="text-base md:text-lg text-[var(--fastapi-muted)] max-w-3xl leading-relaxed">
          FastAPI modernizes Python web development by bridging high-level type-hint ergonomics with compiled Rust validation and native asynchronous cooperative multitasking.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--fastapi-teal)] font-bold">01 / ASGI EVENT LOOP</span>
          <h3 className="font-display font-bold text-xl text-[var(--fastapi-text)]">Cooperative Concurrency</h3>
          <p className="text-xs text-[var(--fastapi-muted)] leading-relaxed">
            By running on Uvicorn with uvloop, non-blocking coroutines eliminate thread exhaustion, easily serving 50,000+ simultaneous connections.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--fastapi-sky)] font-bold">02 / RUST PYDANTIC V2</span>
          <h3 className="font-display font-bold text-xl text-[var(--fastapi-text)]">Zero-Overhead Typing</h3>
          <p className="text-xs text-[var(--fastapi-muted)] leading-relaxed">
            Pydantic V2 compiles JSON parsing and validation into Rust machine code, delivering a 20x throughput increase over legacy Python dictionaries.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--fastapi-purple)] font-bold">03 / DEPENDENCY DAG</span>
          <h3 className="font-display font-bold text-xl text-[var(--fastapi-text)]">Atomic Lifecycles</h3>
          <p className="text-xs text-[var(--fastapi-muted)] leading-relaxed">
            Hierarchical Depends() constructs topological dependency trees with automatic memoization and guaranteed context teardowns.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--fastapi-border)] bg-[var(--fastapi-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--fastapi-text)]">
            Ready to master FastAPI backend architecture?
          </h3>
          <p className="text-xs text-[var(--fastapi-muted)]">
            Explore the complete 5-module curriculum map.
          </p>
        </div>

        <Link
          href="/fastapicosmos/learn"
          className="px-6 py-3 rounded-lg bg-[var(--fastapi-primary)] text-white font-semibold text-xs hover:bg-[var(--fastapi-primary-hover)] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
