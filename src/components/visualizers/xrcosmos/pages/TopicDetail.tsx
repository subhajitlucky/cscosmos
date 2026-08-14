'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle, Cpu, Repeat, Code2, ArrowUpRight, Zap, CheckCircle2, Glasses } from 'lucide-react';
import { getXrTopic, xrTopics } from '../data/topics';

export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getXrTopic(topicId) || xrTopics[0];
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Back Link */}
      <Link
        href="/xrcosmos/learn"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--xr-muted)] hover:text-[var(--xr-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Architecture Map
      </Link>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--xr-primary)]/10 text-[var(--xr-primary)] border border-[var(--xr-primary)]/30 font-bold">
              {topic.kicker}
            </span>
            <span className="text-xs font-mono text-[var(--xr-muted)]">
              {topic.difficulty.toUpperCase()}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--xr-text)]">
            {topic.title}
          </h1>

          <p className="text-base md:text-lg text-[var(--xr-muted)] leading-relaxed border-l-4 border-[var(--xr-primary)]/30 pl-6 italic">
            &ldquo;{topic.definition}&rdquo;
          </p>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] space-y-4">
          <span className="text-xs font-mono text-[var(--xr-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Domain Category
          </span>
          <div className="font-display font-bold text-lg text-[var(--xr-text)]">
            {topic.group}
          </div>
          <p className="text-xs text-[var(--xr-muted)] leading-relaxed">
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Physical World Analogy */}
      <section className="p-8 rounded-2xl border border-[var(--xr-border)] bg-[var(--xr-surface)] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--xr-primary)]">
          <Repeat className="w-4 h-4" /> Physical World Analogy
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--xr-text)]">
          {topic.analogy}
        </h2>
      </section>

      {/* Code Contract Implementation */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-mono text-[var(--xr-primary)] uppercase tracking-wider">
            WebXR Implementation Contract
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--xr-text)]">
            Production 3D Shader &amp; Tracking Code
          </h2>
        </div>

        <div className="rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] overflow-hidden shadow-xl">
          <div className="px-4 py-3 border-b border-[var(--xr-border-subtle)] bg-[var(--xr-surface-2)] flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--xr-muted)] flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[var(--xr-primary)]" />
              {topic.id}.ts (WebXR &amp; Three.js)
            </span>
            <span className="text-[10px] font-mono text-[var(--xr-teal)] bg-[var(--xr-teal)]/10 px-2 py-0.5 rounded border border-[var(--xr-teal)]/20">
              90 FPS VERIFIED
            </span>
          </div>

          <div className="p-6 font-mono text-xs overflow-x-auto">
            <pre className="text-[var(--xr-text)] leading-relaxed">
              <code>{topic.codeSnippet}</code>
            </pre>
          </div>

          <div className="px-4 py-2.5 border-t border-[var(--xr-border-subtle)] bg-[var(--xr-surface-2)] text-[10px] font-mono text-[var(--xr-muted)]">
            {topic.outputDescription}
          </div>
        </div>
      </section>

      {/* Step Sequence */}
      <section className="p-8 rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[var(--xr-primary)] uppercase tracking-wider">
            Execution Lifecycle
          </span>
          <h3 className="font-display font-bold text-xl text-[var(--xr-text)]">
            Pipeline Execution Flow
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topic.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--xr-border-subtle)] bg-[var(--xr-bg)] space-y-2 font-mono text-xs"
            >
              <div className="flex items-center gap-2 text-[var(--xr-primary)] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-[var(--xr-primary)]/10 border border-[var(--xr-primary)]/20 text-[10px]">
                  0{idx + 1}
                </span>
                <span>STEP</span>
              </div>
              <p className="text-[var(--xr-muted)] leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pitfalls & Performance Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-8 rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--xr-rose)] font-bold">
            <AlertTriangle className="w-4 h-4" /> Spatial UX Antipatterns &amp; Nausea Triggers
          </div>
          <div className="space-y-4">
            {topic.mistakes.map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[var(--xr-muted)] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--xr-rose)] mt-1.5 flex-shrink-0" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--xr-teal)] font-bold">
            <Cpu className="w-4 h-4" /> GPU &amp; Fillrate Optimization
          </div>
          <p className="text-xs text-[var(--xr-muted)] leading-relaxed">
            {topic.optimization}
          </p>
        </section>
      </div>

      {/* Related Topics */}
      <section className="space-y-6 border-t border-[var(--xr-border-subtle)] pt-12">
        <h2 className="font-display text-2xl font-bold text-[var(--xr-text)]">
          Related Spatial Concepts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topic.related.map((relId) => {
            const relTopic = getXrTopic(relId);
            if (!relTopic) return null;
            return (
              <Link
                key={relId}
                href={`/xrcosmos/learn/${relTopic.id}`}
                className="xr-card p-5 rounded-xl space-y-2 group"
              >
                <span className="text-[10px] font-mono text-[var(--xr-primary)]">
                  {relTopic.kicker}
                </span>
                <h4 className="font-display font-bold text-base text-[var(--xr-text)] group-hover:text-[var(--xr-primary)] transition-colors">
                  {relTopic.title}
                </h4>
                <span className="text-xs font-mono text-[var(--xr-primary)] flex items-center gap-1 pt-2">
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
