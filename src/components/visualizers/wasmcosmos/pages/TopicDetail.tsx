'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle, Cpu, Repeat, Code2, ArrowUpRight, Zap, CheckCircle2, Binary } from 'lucide-react';
import { getWasmTopic, wasmTopics } from '../data/topics';

export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getWasmTopic(topicId) || wasmTopics[0];
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Back Link */}
      <Link
        href="/wasmcosmos/learn"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--wasm-muted)] hover:text-[var(--wasm-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Architecture Map
      </Link>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--wasm-primary)]/10 text-[var(--wasm-primary)] border border-[var(--wasm-primary)]/30 font-bold">
              {topic.kicker}
            </span>
            <span className="text-xs font-mono text-[var(--wasm-muted)]">
              {topic.difficulty.toUpperCase()}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--wasm-text)]">
            {topic.title}
          </h1>

          <p className="text-base md:text-lg text-[var(--wasm-muted)] leading-relaxed border-l-4 border-[var(--wasm-primary)]/30 pl-6 italic">
            &ldquo;{topic.definition}&rdquo;
          </p>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] space-y-4">
          <span className="text-xs font-mono text-[var(--wasm-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Track Domain
          </span>
          <div className="font-display font-bold text-lg text-[var(--wasm-text)]">
            {topic.group}
          </div>
          <p className="text-xs text-[var(--wasm-muted)] leading-relaxed">
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Physical World Analogy */}
      <section className="p-8 rounded-2xl border border-[var(--wasm-border)] bg-[var(--wasm-surface)] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--wasm-primary)]">
          <Repeat className="w-4 h-4" /> Physical World Analogy
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--wasm-text)]">
          {topic.analogy}
        </h2>
      </section>

      {/* WAT Bytecode vs JS Bridge Code Comparison */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-mono text-[var(--wasm-primary)] uppercase tracking-wider">
            Virtual Machine Implementation
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--wasm-text)]">
            WAT Text Bytecode $\to$ JavaScript Host Bridge
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* WAT S-Expressions */}
          <div className="lg:col-span-6 rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="px-4 py-3 border-b border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface-2)] flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--wasm-muted)] flex items-center gap-2">
                <Binary className="w-3.5 h-3.5 text-[var(--wasm-primary)]" />
                module.wat (S-Expressions)
              </span>
              <span className="text-[10px] font-mono text-[var(--wasm-primary)] bg-[var(--wasm-primary)]/10 px-2 py-0.5 rounded border border-[var(--wasm-primary)]/20">
                WAT_SOURCE
              </span>
            </div>

            <div className="p-6 font-mono text-xs overflow-x-auto flex-grow">
              <pre className="text-[var(--wasm-text)] leading-relaxed">
                <code>{topic.watSnippet}</code>
              </pre>
            </div>
          </div>

          {/* JS Host Bridge */}
          <div className="lg:col-span-6 rounded-2xl border border-[var(--wasm-primary)]/30 bg-[var(--wasm-surface-2)] overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="px-4 py-3 border-b border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--wasm-primary)] flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-[var(--wasm-primary)]" />
                bridge.js (Host FFI)
              </span>
              <span className="text-[10px] font-mono text-[var(--wasm-emerald)] bg-[var(--wasm-emerald)]/10 px-2 py-0.5 rounded border border-[var(--wasm-emerald)]/20">
                0 JIT DEOPT
              </span>
            </div>

            <div className="p-6 font-mono text-xs overflow-x-auto flex-grow">
              <pre className="text-cyan-400 leading-relaxed">
                <code>{topic.jsBridgeSnippet}</code>
              </pre>
            </div>

            <div className="px-4 py-2.5 border-t border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] text-[10px] font-mono text-[var(--wasm-muted)]">
              {topic.outputDescription}
            </div>
          </div>
        </div>
      </section>

      {/* Step Sequence */}
      <section className="p-8 rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[var(--wasm-primary)] uppercase tracking-wider">
            Execution Steps
          </span>
          <h3 className="font-display font-bold text-xl text-[var(--wasm-text)]">
            Virtual Machine State Lifecycle
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topic.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-bg)] space-y-2 font-mono text-xs"
            >
              <div className="flex items-center gap-2 text-[var(--wasm-primary)] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-[var(--wasm-primary)]/10 border border-[var(--wasm-primary)]/20 text-[10px]">
                  0{idx + 1}
                </span>
                <span>STATE</span>
              </div>
              <p className="text-[var(--wasm-muted)] leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pitfalls & Performance Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-8 rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--wasm-rose)] font-bold">
            <AlertTriangle className="w-4 h-4" /> Traps &amp; Common Pitfalls
          </div>
          <div className="space-y-4">
            {topic.mistakes.map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[var(--wasm-muted)] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--wasm-rose)] mt-1.5 flex-shrink-0" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--wasm-cyan)] font-bold">
            <Cpu className="w-4 h-4" /> Systems Engineering Optimization
          </div>
          <p className="text-xs text-[var(--wasm-muted)] leading-relaxed">
            {topic.optimization}
          </p>
        </section>
      </div>

      {/* Related Topics */}
      <section className="space-y-6 border-t border-[var(--wasm-border-subtle)] pt-12">
        <h2 className="font-display text-2xl font-bold text-[var(--wasm-text)]">
          Related WebAssembly Primitives
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topic.related.map((relId) => {
            const relTopic = getWasmTopic(relId);
            if (!relTopic) return null;
            return (
              <Link
                key={relId}
                href={`/wasmcosmos/learn/${relTopic.id}`}
                className="wasm-card p-5 rounded-xl space-y-2 group"
              >
                <span className="text-[10px] font-mono text-[var(--wasm-primary)]">
                  {relTopic.kicker}
                </span>
                <h4 className="font-display font-bold text-base text-[var(--wasm-text)] group-hover:text-[var(--wasm-primary)] transition-colors">
                  {relTopic.title}
                </h4>
                <span className="text-xs font-mono text-[var(--wasm-primary)] flex items-center gap-1 pt-2">
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
