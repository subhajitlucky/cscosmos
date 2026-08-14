'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle, Cpu, Repeat, Code2, ArrowUpRight, Zap, CheckCircle2, Wind } from 'lucide-react';
import { getTailwindTopic, tailwindTopics } from '../data/topics';

export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getTailwindTopic(topicId) || tailwindTopics[0];
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Back Link */}
      <Link
        href="/tailwindcosmos/learn"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--twc-muted)] hover:text-[var(--twc-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Concept Map
      </Link>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--twc-primary)]/10 text-[var(--twc-primary)] border border-[var(--twc-primary)]/30 font-bold">
              {topic.kicker}
            </span>
            <span className="text-xs font-mono text-[var(--twc-muted)]">
              {topic.difficulty.toUpperCase()}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--twc-text)]">
            {topic.title}
          </h1>

          <p className="text-base md:text-lg text-[var(--twc-muted)] leading-relaxed border-l-4 border-[var(--twc-primary)]/30 pl-6 italic">
            &ldquo;{topic.definition}&rdquo;
          </p>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] space-y-4">
          <span className="text-xs font-mono text-[var(--twc-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Domain Category
          </span>
          <div className="font-display font-bold text-lg text-[var(--twc-text)]">
            {topic.group}
          </div>
          <p className="text-xs text-[var(--twc-muted)] leading-relaxed">
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Physical World Analogy */}
      <section className="p-8 rounded-2xl border border-[var(--twc-border)] bg-[var(--twc-surface)] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--twc-primary)]">
          <Repeat className="w-4 h-4" /> Physical World Analogy
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--twc-text)]">
          {topic.analogy}
        </h2>
      </section>

      {/* Code & Compiled CSS Comparison */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-mono text-[var(--twc-primary)] uppercase tracking-wider">
            Compilation Mechanics
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--twc-text)]">
            Tailwind Classes $\to$ Pure Compiled CSS Output
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* JSX / HTML Source */}
          <div className="lg:col-span-6 rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="px-4 py-3 border-b border-[var(--twc-border-subtle)] bg-[var(--twc-surface-2)] flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--twc-muted)] flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-[var(--twc-primary)]" />
                Template.tsx
              </span>
              <span className="text-[10px] font-mono text-[var(--twc-primary)] bg-[var(--twc-primary)]/10 px-2 py-0.5 rounded border border-[var(--twc-primary)]/20">
                JSX_INPUT
              </span>
            </div>

            <div className="p-6 font-mono text-xs overflow-x-auto flex-grow">
              <pre className="text-[var(--twc-text)] leading-relaxed">
                <code>{topic.tailwindSnippet}</code>
              </pre>
            </div>
          </div>

          {/* Compiled Pure CSS */}
          <div className="lg:col-span-6 rounded-2xl border border-[var(--twc-primary)]/30 bg-[var(--twc-surface-2)] overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="px-4 py-3 border-b border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--twc-primary)] flex items-center gap-2">
                <Wind className="w-3.5 h-3.5 text-[var(--twc-primary)]" />
                compiled.css (JIT Output)
              </span>
              <span className="text-[10px] font-mono text-[var(--twc-emerald)] bg-[var(--twc-emerald)]/10 px-2 py-0.5 rounded border border-[var(--twc-emerald)]/20">
                0 RUNTIME
              </span>
            </div>

            <div className="p-6 font-mono text-xs overflow-x-auto flex-grow">
              <pre className="text-emerald-400 leading-relaxed">
                <code>{topic.cssOutput}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Step Sequence */}
      <section className="p-8 rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[var(--twc-primary)] uppercase tracking-wider">
            Architecture Process
          </span>
          <h3 className="font-display font-bold text-xl text-[var(--twc-text)]">
            Execution &amp; Compilation Workflow
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topic.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--twc-border-subtle)] bg-[var(--twc-bg)] space-y-2 font-mono text-xs"
            >
              <div className="flex items-center gap-2 text-[var(--twc-primary)] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-[var(--twc-primary)]/10 border border-[var(--twc-primary)]/20 text-[10px]">
                  0{idx + 1}
                </span>
                <span>STEP</span>
              </div>
              <p className="text-[var(--twc-muted)] leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pitfalls & Performance Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-8 rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--twc-rose)] font-bold">
            <AlertTriangle className="w-4 h-4" /> Common Antipatterns
          </div>
          <div className="space-y-4">
            {topic.mistakes.map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[var(--twc-muted)] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--twc-rose)] mt-1.5 flex-shrink-0" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--twc-primary)] font-bold">
            <Cpu className="w-4 h-4" /> Performance &amp; Caching Win
          </div>
          <p className="text-xs text-[var(--twc-muted)] leading-relaxed">
            {topic.optimization}
          </p>
        </section>
      </div>

      {/* Related Topics */}
      <section className="space-y-6 border-t border-[var(--twc-border-subtle)] pt-12">
        <h2 className="font-display text-2xl font-bold text-[var(--twc-text)]">
          Related Utility Patterns
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topic.related.map((relId) => {
            const relTopic = getTailwindTopic(relId);
            if (!relTopic) return null;
            return (
              <Link
                key={relId}
                href={`/tailwindcosmos/learn/${relTopic.id}`}
                className="twc-card p-5 rounded-xl space-y-2 group"
              >
                <span className="text-[10px] font-mono text-[var(--twc-primary)]">
                  {relTopic.kicker}
                </span>
                <h4 className="font-display font-bold text-base text-[var(--twc-text)] group-hover:text-[var(--twc-primary)] transition-colors">
                  {relTopic.title}
                </h4>
                <span className="text-xs font-mono text-[var(--twc-primary)] flex items-center gap-1 pt-2">
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
