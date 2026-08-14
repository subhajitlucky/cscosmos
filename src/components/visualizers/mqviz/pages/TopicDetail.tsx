'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle, Cpu, Repeat, Code2, ArrowUpRight, Zap, CheckCircle2, RotateCcw, Server } from 'lucide-react';
import { getMqTopic, mqTopics } from '../data/topics';

export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getMqTopic(topicId) || mqTopics[0];
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Back Link */}
      <Link
        href="/mqviz/learn"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--mq-muted)] hover:text-[var(--mq-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Architecture Map
      </Link>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--mq-primary)]/10 text-[var(--mq-primary)] border border-[var(--mq-primary)]/30 font-bold">
              {topic.kicker}
            </span>
            <span className="text-xs font-mono text-[var(--mq-muted)]">
              {topic.difficulty.toUpperCase()}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--mq-text)]">
            {topic.title}
          </h1>

          <p className="text-base md:text-lg text-[var(--mq-muted)] leading-relaxed border-l-4 border-[var(--mq-primary)]/30 pl-6 italic">
            &ldquo;{topic.definition}&rdquo;
          </p>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-4">
          <span className="text-xs font-mono text-[var(--mq-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Track Domain
          </span>
          <div className="font-display font-bold text-lg text-[var(--mq-text)]">
            {topic.group}
          </div>
          <p className="text-xs text-[var(--mq-muted)] leading-relaxed">
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Real-world Analogy */}
      <section className="p-8 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--mq-primary)]">
          <Repeat className="w-4 h-4" /> Physical World Analogy
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--mq-text)]">
          {topic.analogy}
        </h2>
      </section>

      {/* Interactive Code & Step Flow */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-mono text-[var(--mq-primary)] uppercase tracking-wider">
            Architecture Implementation
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--mq-text)]">
            Production Pattern &amp; Code Contract
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Code Viewer Panel */}
          <div className="lg:col-span-7 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="px-4 py-3 border-b border-[var(--mq-border-subtle)] bg-[var(--mq-surface-2)] flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--mq-muted)] flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-[var(--mq-primary)]" />
                {topic.id}.ts
              </span>
              <span className="text-[10px] font-mono text-[var(--mq-cyan)] bg-[var(--mq-cyan)]/10 px-2 py-0.5 rounded border border-[var(--mq-cyan)]/20">
                PROD_VERIFIED
              </span>
            </div>

            <div className="p-6 font-mono text-xs overflow-x-auto flex-grow">
              <pre className="text-[var(--mq-text)] leading-relaxed">
                <code>{topic.codeSnippet}</code>
              </pre>
            </div>

            <div className="px-4 py-2.5 border-t border-[var(--mq-border-subtle)] bg-[var(--mq-surface-2)] text-[10px] font-mono text-[var(--mq-muted)]">
              {topic.outputDescription}
            </div>
          </div>

          {/* Interactive Step Timeline */}
          <div className="lg:col-span-5 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface-2)] p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[var(--mq-primary)] uppercase tracking-wider">
                Execution Workflow
              </span>
              <h3 className="font-display font-bold text-lg text-[var(--mq-text)]">
                Step-by-Step State Flow
              </h3>
            </div>

            <div className="space-y-3">
              {topic.steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-start gap-3 ${
                      isActive
                        ? 'border-[var(--mq-primary)] bg-[var(--mq-primary)]/10 text-[var(--mq-text)] shadow-md'
                        : 'border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] text-[var(--mq-muted)] hover:text-[var(--mq-text)]'
                    }`}
                  >
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive ? 'bg-[var(--mq-primary)] text-black' : 'bg-[var(--mq-surface-2)] text-[var(--mq-muted)]'
                    }`}>
                      0{idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-lg bg-[var(--mq-emerald)]/10 border border-[var(--mq-emerald)]/30 text-[11px] font-mono text-[var(--mq-emerald)] flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Workflow step 0{activeStep + 1} selected.
            </div>
          </div>
        </div>
      </section>

      {/* Pitfalls & Performance Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-8 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--mq-rose)] font-bold">
            <AlertTriangle className="w-4 h-4" /> Critical Pitfalls to Avoid
          </div>
          <div className="space-y-4">
            {topic.mistakes.map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[var(--mq-muted)] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--mq-rose)] mt-1.5 flex-shrink-0" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--mq-cyan)] font-bold">
            <Cpu className="w-4 h-4" /> Systems Engineering Optimization
          </div>
          <p className="text-xs text-[var(--mq-muted)] leading-relaxed">
            {topic.optimization}
          </p>
        </section>
      </div>

      {/* Related Topics */}
      <section className="space-y-6 border-t border-[var(--mq-border-subtle)] pt-12">
        <h2 className="font-display text-2xl font-bold text-[var(--mq-text)]">
          Related Messaging Primitives
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topic.related.map((relId) => {
            const relTopic = getMqTopic(relId);
            if (!relTopic) return null;
            return (
              <Link
                key={relId}
                href={`/mqviz/learn/${relTopic.id}`}
                className="mq-card p-5 rounded-xl space-y-2 group"
              >
                <span className="text-[10px] font-mono text-[var(--mq-primary)]">
                  {relTopic.kicker}
                </span>
                <h4 className="font-display font-bold text-base text-[var(--mq-text)] group-hover:text-[var(--mq-primary)] transition-colors">
                  {relTopic.title}
                </h4>
                <span className="text-xs font-mono text-[var(--mq-primary)] flex items-center gap-1 pt-2">
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
