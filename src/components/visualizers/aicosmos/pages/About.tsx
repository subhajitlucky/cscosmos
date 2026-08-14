'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Bot, Network, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ai-primary)]/30 bg-[var(--ai-primary)]/10 text-[var(--ai-primary)] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" /> AI::COSMOS Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ai-text)]">
          The Architecture of <span className="text-[var(--ai-primary)] ai-glow">Reliable, Grounded</span> AI Systems
        </h1>

        <p className="text-base md:text-lg text-[var(--ai-muted)] max-w-3xl leading-relaxed">
          AI Application Engineering is the discipline of wrapping non-deterministic probabilistic foundation models with deterministic software engineering patterns—delivering sub-second latency, zero hallucinations, and high observability.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--ai-cyan)] font-bold">01 / DENSE &amp; SPARSE HYBRID</span>
          <h3 className="font-display font-bold text-xl text-[var(--ai-text)]">Hybrid Retrieval</h3>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            Combining HNSW vector embeddings with BM25 keyword inverted indexes guarantees both high semantic understanding and exact keyword/ID retrieval recall.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--ai-amber)] font-bold">02 / STRUCTURED AGENTS</span>
          <h3 className="font-display font-bold text-xl text-[var(--ai-text)]">ReAct Tool Calling</h3>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            Grammar-constrained JSON schema outputs allow autonomous agents to reliably invoke production APIs, query SQL databases, and self-correct with observations.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--ai-emerald)] font-bold">03 / CONTINUOUS EVALUATION</span>
          <h3 className="font-display font-bold text-xl text-[var(--ai-text)]">The RAG Triad</h3>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            Automated CI/CD evaluation of Context Relevance, Groundedness, and Answer Relevance ensures production models maintain &gt;95% factual accuracy.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--ai-text)]">
            Ready to master AI Application Engineering?
          </h3>
          <p className="text-xs text-[var(--ai-muted)]">
            Explore the complete 5-module curriculum map.
          </p>
        </div>

        <Link
          href="/aicosmos/learn"
          className="px-6 py-3 rounded-lg bg-[var(--ai-primary)] text-white font-semibold text-xs hover:bg-[var(--ai-primary-hover)] transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
