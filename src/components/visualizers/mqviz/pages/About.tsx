'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Layers, Server, ShieldAlert, Cpu } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--mq-primary)]/30 bg-[var(--mq-primary)]/10 text-[var(--mq-primary)] text-xs font-mono">
          <Radio className="w-3.5 h-3.5" /> MQ::STREAM Systems Engineering
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--mq-text)]">
          The Architecture of <span className="text-[var(--mq-primary)] mq-glow">High-Throughput</span> Event Streaming
        </h1>

        <p className="text-base md:text-lg text-[var(--mq-muted)] max-w-3xl leading-relaxed">
          Modern distributed systems are not built on synchronous RPC waterfalls. They are built on asynchronous, fault-tolerant append-only commit logs that decouple services, buffer spikes, and preserve an immutable record of historical truth.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--mq-primary)] font-bold">01 / IMMUTABILITY</span>
          <h3 className="font-display font-bold text-xl text-[var(--mq-text)]">Append-Only Logs</h3>
          <p className="text-xs text-[var(--mq-muted)] leading-relaxed">
            By avoiding random memory updates and in-place mutations, sequential disk writes achieve physical throughput speeds comparable to raw network bandwidth.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--mq-cyan)] font-bold">02 / ZERO-COPY I/O</span>
          <h3 className="font-display font-bold text-xl text-[var(--mq-text)]">Kernel PageCache</h3>
          <p className="text-xs text-[var(--mq-muted)] leading-relaxed">
            Leveraging Linux sendfile() transfers cached disk blocks straight to network sockets without crossing user-space memory or burning CPU cycles.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--mq-rose)] font-bold">03 / FAULT RESILIENCE</span>
          <h3 className="font-display font-bold text-xl text-[var(--mq-text)]">Quorum &amp; DLQs</h3>
          <p className="text-xs text-[var(--mq-muted)] leading-relaxed">
            In-Sync Replicas guarantee data survival across full server crashes, while dead-letter queues protect pipelines from poison pills.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--mq-text)]">
            Ready to master distributed messaging?
          </h3>
          <p className="text-xs text-[var(--mq-muted)]">
            Explore the complete 10-module curriculum map.
          </p>
        </div>

        <Link
          href="/mqviz/learn"
          className="px-6 py-3 rounded-lg bg-[var(--mq-primary)] text-black font-semibold text-xs hover:bg-[var(--mq-primary-hover)] transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
