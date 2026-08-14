'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle, Cpu, Repeat, Code2, ArrowUpRight, Zap, CheckCircle2, Bot } from 'lucide-react';
import { getAiTopic, aiTopics } from '../data/topics';

export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getAiTopic(topicId) || aiTopics[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Back Link */}
      <Link
        href="/aicosmos/learn"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Architecture Map
      </Link>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--ai-primary)]/10 text-[var(--ai-primary)] border border-[var(--ai-primary)]/30 font-bold">
              {topic.kicker}
            </span>
            <span className="text-xs font-mono text-[var(--ai-muted)]">
              {topic.difficulty.toUpperCase()}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ai-text)]">
            {topic.title}
          </h1>

          <p className="text-base md:text-lg text-[var(--ai-muted)] leading-relaxed border-l-4 border-[var(--ai-primary)]/30 pl-6 italic">
            &ldquo;{topic.definition}&rdquo;
          </p>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-4">
          <span className="text-xs font-mono text-[var(--ai-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Domain Category
          </span>
          <div className="font-display font-bold text-lg text-[var(--ai-text)]">
            {topic.group}
          </div>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Physical World Analogy */}
      <section className="p-8 rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface)] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ai-primary)]">
          <Repeat className="w-4 h-4" /> Physical World Analogy
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--ai-text)]">
          {topic.analogy}
        </h2>
      </section>

      {/* Code Contract Implementation */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-mono text-[var(--ai-primary)] uppercase tracking-wider">
            AI Engineering Code Contract
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--ai-text)]">
            TypeScript / Python Implementation
          </h2>
        </div>

        <div className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] overflow-hidden shadow-xl font-mono text-xs">
          <div className="px-4 py-3 border-b border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] flex items-center justify-between">
            <span className="text-xs text-[var(--ai-muted)] flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[var(--ai-primary)]" />
              {topic.id}.ts
            </span>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              AI APPLICATION SYSTEM
            </span>
          </div>

          <div className="p-6 overflow-x-auto">
            <pre className="text-[var(--ai-text)] leading-relaxed">
              <code>{topic.codeSnippet}</code>
            </pre>
          </div>

          <div className="px-4 py-2.5 border-t border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] text-[10px] text-[var(--ai-muted)]">
            {topic.outputDescription}
          </div>
        </div>
      </section>

      {/* Step Sequence */}
      <section className="p-8 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[var(--ai-primary)] uppercase tracking-wider">
            Execution Lifecycle
          </span>
          <h3 className="font-display font-bold text-xl text-[var(--ai-text)]">
            Pipeline Execution Steps
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topic.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-bg)] space-y-2 font-mono text-xs"
            >
              <div className="flex items-center gap-2 text-[var(--ai-primary)] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-[var(--ai-primary)]/10 border border-[var(--ai-primary)]/20 text-[10px]">
                  0{idx + 1}
                </span>
                <span>STEP</span>
              </div>
              <p className="text-[var(--ai-muted)] leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pitfalls & Performance Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-8 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--ai-rose)] font-bold">
            <AlertTriangle className="w-4 h-4" /> Production Pitfalls &amp; Hallucinations
          </div>
          <div className="space-y-4">
            {topic.mistakes.map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[var(--ai-muted)] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ai-rose)] mt-1.5 flex-shrink-0" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--ai-emerald)] font-bold">
            <Cpu className="w-4 h-4" /> Performance &amp; Cost Optimization
          </div>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            {topic.optimization}
          </p>
        </section>
      </div>

      {/* Related Topics */}
      <section className="space-y-6 border-t border-[var(--ai-border-subtle)] pt-12">
        <h2 className="font-display text-2xl font-bold text-[var(--ai-text)]">
          Related AI Engineering Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topic.related.map((relId) => {
            const relTopic = getAiTopic(relId);
            if (!relTopic) return null;
            return (
              <Link
                key={relId}
                href={`/aicosmos/learn/${relTopic.id}`}
                className="ai-card p-5 rounded-xl space-y-2 group"
              >
                <span className="text-[10px] font-mono text-[var(--ai-primary)]">
                  {relTopic.kicker}
                </span>
                <h4 className="font-display font-bold text-base text-[var(--ai-text)] group-hover:text-[var(--ai-primary)] transition-colors">
                  {relTopic.title}
                </h4>
                <span className="text-xs font-mono text-[var(--ai-primary)] flex items-center gap-1 pt-2">
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
