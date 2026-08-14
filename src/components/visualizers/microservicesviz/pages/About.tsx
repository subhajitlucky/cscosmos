'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Layers, Cpu, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ms-primary)]/30 bg-[var(--ms-primary)]/10 text-[var(--ms-primary)] text-xs font-mono">
          <Network className="w-3.5 h-3.5" /> MICROSERVICES::VIZ Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ms-text)]">
          The Architecture of <span className="text-[var(--ms-primary)] ms-glow">Fault-Tolerant</span> Distributed Systems
        </h1>

        <p className="text-base md:text-lg text-[var(--ms-muted)] max-w-3xl leading-relaxed">
          Microservices architecture is the engineering discipline of designing systems that thrive amidst inevitable network partitions, node crashes, and downstream latency spikes.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--ms-primary)] font-bold">01 / AUTONOMOUS BOUNDS</span>
          <h3 className="font-display font-bold text-xl text-[var(--ms-text)]">Database-per-Service</h3>
          <p className="text-xs text-[var(--ms-muted)] leading-relaxed">
            Strict data encapsulation eliminates schema coupling and cross-team lock contention, allowing independent continuous deployments.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--ms-rose)] font-bold">02 / BLAST RADIUS CONTROL</span>
          <h3 className="font-display font-bold text-xl text-[var(--ms-text)]">Circuit Breakers</h3>
          <p className="text-xs text-[var(--ms-muted)] leading-relaxed">
            Fast-fail circuit breakers and bulkhead threadpools isolate downstream outages, preventing cascading threadpool exhaustion across the cluster.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--ms-sky)] font-bold">03 / OPENTELEMETRY TRACING</span>
          <h3 className="font-display font-bold text-xl text-[var(--ms-text)]">End-to-End Traces</h3>
          <p className="text-xs text-[var(--ms-muted)] leading-relaxed">
            W3C traceparent context propagation reconstructs synchronous RPC and asynchronous event execution DAGs for instant root-cause localization.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--ms-border)] bg-[var(--ms-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--ms-text)]">
            Ready to master Microservices architecture?
          </h3>
          <p className="text-xs text-[var(--ms-muted)]">
            Explore the complete 5-module curriculum map.
          </p>
        </div>

        <Link
          href="/microservicesviz/learn"
          className="px-6 py-3 rounded-lg bg-[var(--ms-primary)] text-white font-semibold text-xs hover:bg-[var(--ms-primary-hover)] transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
