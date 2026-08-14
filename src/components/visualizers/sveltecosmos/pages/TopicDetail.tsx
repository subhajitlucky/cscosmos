'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle, Cpu, Repeat, Code2, ArrowUpRight, Zap, CheckCircle2, RotateCcw } from 'lucide-react';
import { getSvelteTopic, svelteTopics } from '../data/topics';

export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getSvelteTopic(topicId) || svelteTopics[0];
  const [editableCode, setEditableCode] = useState(topic.codeExample);
  const [activeTab, setActiveTab] = useState<'source' | 'compiled'>('source');
  const [simValue, setSimValue] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Back Link */}
      <Link
        href="/sveltecosmos/learn"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--svelte-muted)] hover:text-[var(--svelte-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Architecture Map
      </Link>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--svelte-primary)]/10 text-[var(--svelte-primary)] border border-[var(--svelte-primary)]/30">
              {topic.kicker}
            </span>
            <span className="text-xs font-mono text-[var(--svelte-muted)]">
              {topic.difficulty.toUpperCase()}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--svelte-text)]">
            {topic.title}
          </h1>

          <p className="text-base md:text-lg text-[var(--svelte-muted)] leading-relaxed border-l-4 border-[var(--svelte-primary)]/30 pl-6 italic">
            &ldquo;{topic.definition}&rdquo;
          </p>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] space-y-4">
          <span className="text-xs font-mono text-[var(--svelte-primary)] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Domain Category
          </span>
          <div className="font-display font-bold text-lg text-[var(--svelte-text)]">
            {topic.group}
          </div>
          <p className="text-xs text-[var(--svelte-muted)] leading-relaxed">
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Real-world Analogy */}
      <section className="p-8 rounded-2xl border border-[var(--svelte-border)] bg-[var(--svelte-surface)] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--svelte-accent)]">
          <Repeat className="w-4 h-4" /> Real-World Mental Model
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--svelte-text)]">
          {topic.analogy}
        </h2>
      </section>

      {/* Interactive Code & Live Compiler Lab */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[var(--svelte-primary)] uppercase tracking-wider">
              Compiler Output Inspection
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--svelte-text)]">
              Svelte Code vs Compiled Vanilla JS
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('source')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                activeTab === 'source'
                  ? 'bg-[var(--svelte-primary)] text-white'
                  : 'border border-[var(--svelte-border-subtle)] text-[var(--svelte-muted)] hover:text-[var(--svelte-text)]'
              }`}
            >
              .svelte Source
            </button>
            <button
              onClick={() => setActiveTab('compiled')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                activeTab === 'compiled'
                  ? 'bg-[var(--svelte-primary)] text-white'
                  : 'border border-[var(--svelte-border-subtle)] text-[var(--svelte-muted)] hover:text-[var(--svelte-text)]'
              }`}
            >
              Generated JS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Code Viewer Panel */}
          <div className="lg:col-span-8 rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] overflow-hidden flex flex-col justify-between">
            <div className="px-4 py-3 border-b border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface-2)] flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--svelte-muted)]">
                {activeTab === 'source' ? `${topic.id}.svelte` : `${topic.id}.client.js`}
              </span>
              <button
                onClick={() => setEditableCode(topic.codeExample)}
                className="text-[10px] font-mono text-[var(--svelte-muted)] hover:text-[var(--svelte-primary)] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="p-6 font-mono text-xs overflow-x-auto flex-grow">
              <pre className="text-[var(--svelte-text)] leading-relaxed">
                <code>{activeTab === 'source' ? editableCode : topic.compiledJs}</code>
              </pre>
            </div>

            <div className="px-4 py-2.5 border-t border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface-2)] flex items-center justify-between text-[10px] font-mono text-[var(--svelte-muted)]">
              <span>Zero Virtual DOM Compilation</span>
              <span>Svelte 5 Runes Engine</span>
            </div>
          </div>

          {/* Interactive Live State Preview */}
          <div className="lg:col-span-4 rounded-2xl border border-[var(--svelte-border)] bg-[var(--svelte-surface-2)] p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[var(--svelte-primary)] uppercase tracking-wider">
                Live State Preview
              </span>
              <h3 className="font-display font-bold text-lg text-[var(--svelte-text)]">
                Reactive Signal Probe
              </h3>
              <p className="text-xs text-[var(--svelte-muted)]">
                Modify the state variable below to watch the signal update the output without VDOM diffing:
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[var(--svelte-bg)] border border-[var(--svelte-border-subtle)] text-center space-y-4">
              <div className="text-xs font-mono text-[var(--svelte-muted)]">Current Signal Value</div>
              <div className="font-display font-black text-5xl text-[var(--svelte-primary)] svelte-glow">
                {simValue}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setSimValue(v => Math.max(0, v - 1))}
                  className="px-4 py-2 rounded-lg bg-[var(--svelte-surface)] border border-[var(--svelte-border-subtle)] text-xs font-mono hover:border-[var(--svelte-primary)]"
                >
                  - Decrement
                </button>
                <button
                  onClick={() => setSimValue(v => v + 1)}
                  className="px-4 py-2 rounded-lg bg-[var(--svelte-primary)] text-white text-xs font-mono hover:bg-[var(--svelte-primary-hover)]"
                >
                  + Increment
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--svelte-mint)]/10 border border-[var(--svelte-mint)]/30 text-[11px] font-mono text-[var(--svelte-mint)] flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Surgical TextNode patch executed.
            </div>
          </div>
        </div>
      </section>

      {/* Execution Steps & Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sequence Steps */}
        <section className="p-8 rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--svelte-primary)]">
            <Cpu className="w-4 h-4" /> Compilation &amp; Execution Steps
          </div>
          <div className="space-y-4">
            {topic.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 text-xs leading-relaxed">
                <span className="font-mono text-[10px] text-[var(--svelte-primary)] font-bold bg-[var(--svelte-primary)]/10 px-2 py-0.5 rounded border border-[var(--svelte-primary)]/20">
                  0{idx + 1}
                </span>
                <span className="text-[var(--svelte-text)]">{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Common Pitfalls & Optimization */}
        <section className="p-8 rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <AlertTriangle className="w-4 h-4" /> Common Pitfalls to Avoid
          </div>
          <div className="space-y-4">
            {topic.mistakes.map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[var(--svelte-muted)] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--svelte-border-subtle)] space-y-2">
            <div className="text-[10px] font-mono text-[var(--svelte-mint)] uppercase tracking-wider">
              Compiler Optimization Note
            </div>
            <p className="text-xs text-[var(--svelte-muted)] leading-relaxed">
              {topic.optimization}
            </p>
          </div>
        </section>
      </div>

      {/* Related Topics */}
      <section className="space-y-6 border-t border-[var(--svelte-border-subtle)] pt-12">
        <h2 className="font-display text-2xl font-bold text-[var(--svelte-text)]">
          Related Svelte Concepts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topic.related.map((relId) => {
            const relTopic = getSvelteTopic(relId);
            if (!relTopic) return null;
            return (
              <Link
                key={relId}
                href={`/sveltecosmos/learn/${relTopic.id}`}
                className="svelte-card p-5 rounded-xl space-y-2 group"
              >
                <span className="text-[10px] font-mono text-[var(--svelte-primary)]">
                  {relTopic.kicker}
                </span>
                <h4 className="font-display font-bold text-base text-[var(--svelte-text)] group-hover:text-[var(--svelte-primary)] transition-colors">
                  {relTopic.title}
                </h4>
                <span className="text-xs font-mono text-[var(--svelte-primary)] flex items-center gap-1 pt-2">
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
