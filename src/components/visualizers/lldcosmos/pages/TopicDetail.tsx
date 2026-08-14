'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle, Cpu, Repeat, Code2, ArrowUpRight, Zap, CheckCircle2, Box } from 'lucide-react';
import { getLldTopic, lldTopics } from '../data/topics';

export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getLldTopic(topicId) || lldTopics[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Back Link */}
      <Link
        href="/lldcosmos/learn"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--lld-muted)] hover:text-[var(--lld-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Architecture Map
      </Link>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--lld-primary)]/10 text-[var(--lld-primary)] border border-[var(--lld-primary)]/30 font-bold">
              {topic.kicker}
            </span>
            <span className="text-xs font-mono text-[var(--lld-muted)]">
              {topic.difficulty.toUpperCase()}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--lld-text)]">
            {topic.title}
          </h1>

          <p className="text-base md:text-lg text-[var(--lld-muted)] leading-relaxed border-l-4 border-[var(--lld-primary)]/30 pl-6 italic">
            &ldquo;{topic.definition}&rdquo;
          </p>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] space-y-4">
          <span className="text-xs font-mono text-[var(--lld-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Domain Category
          </span>
          <div className="font-display font-bold text-lg text-[var(--lld-text)]">
            {topic.group}
          </div>
          <p className="text-xs text-[var(--lld-muted)] leading-relaxed">
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Physical World Analogy */}
      <section className="p-8 rounded-2xl border border-[var(--lld-border)] bg-[var(--lld-surface)] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--lld-primary)]">
          <Repeat className="w-4 h-4" /> Physical World Analogy
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--lld-text)]">
          {topic.analogy}
        </h2>
      </section>

      {/* Code Contract Implementation */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-mono text-[var(--lld-primary)] uppercase tracking-wider">
            Low-Level Design Code Contract
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--lld-text)]">
            Clean TypeScript / Java Implementation
          </h2>
        </div>

        <div className="rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] overflow-hidden shadow-xl font-mono text-xs">
          <div className="px-4 py-3 border-b border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] flex items-center justify-between">
            <span className="text-xs text-[var(--lld-muted)] flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[var(--lld-primary)]" />
              {topic.id}.ts
            </span>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              CLEAN ARCHITECTURE
            </span>
          </div>

          <div className="p-6 overflow-x-auto">
            <pre className="text-[var(--lld-text)] leading-relaxed">
              <code>{topic.codeSnippet}</code>
            </pre>
          </div>

          <div className="px-4 py-2.5 border-t border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] text-[10px] text-[var(--lld-muted)]">
            {topic.outputDescription}
          </div>
        </div>
      </section>

      {/* Step Sequence */}
      <section className="p-8 rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[var(--lld-primary)] uppercase tracking-wider">
            Refactoring &amp; Implementation Lifecycle
          </span>
          <h3 className="font-display font-bold text-xl text-[var(--lld-text)]">
            Class Decomposition Sequence
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topic.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--lld-border-subtle)] bg-[var(--lld-bg)] space-y-2 font-mono text-xs"
            >
              <div className="flex items-center gap-2 text-[var(--lld-primary)] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-[var(--lld-primary)]/10 border border-[var(--lld-primary)]/20 text-[10px]">
                  0{idx + 1}
                </span>
                <span>STEP</span>
              </div>
              <p className="text-[var(--lld-muted)] leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pitfalls & Performance Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-8 rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--lld-rose)] font-bold">
            <AlertTriangle className="w-4 h-4" /> Code Smells &amp; Anti-Patterns
          </div>
          <div className="space-y-4">
            {topic.mistakes.map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[var(--lld-muted)] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--lld-rose)] mt-1.5 flex-shrink-0" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--lld-emerald)] font-bold">
            <Cpu className="w-4 h-4" /> Systems Engineering Optimization
          </div>
          <p className="text-xs text-[var(--lld-muted)] leading-relaxed">
            {topic.optimization}
          </p>
        </section>
      </div>

      {/* Related Topics */}
      <section className="space-y-6 border-t border-[var(--lld-border-subtle)] pt-12">
        <h2 className="font-display text-2xl font-bold text-[var(--lld-text)]">
          Related Design Patterns
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topic.related.map((relId) => {
            const relTopic = getLldTopic(relId);
            if (!relTopic) return null;
            return (
              <Link
                key={relId}
                href={`/lldcosmos/learn/${relTopic.id}`}
                className="lld-card p-5 rounded-xl space-y-2 group"
              >
                <span className="text-[10px] font-mono text-[var(--lld-primary)]">
                  {relTopic.kicker}
                </span>
                <h4 className="font-display font-bold text-base text-[var(--lld-text)] group-hover:text-[var(--lld-primary)] transition-colors">
                  {relTopic.title}
                </h4>
                <span className="text-xs font-mono text-[var(--lld-primary)] flex items-center gap-1 pt-2">
                  View concept <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
