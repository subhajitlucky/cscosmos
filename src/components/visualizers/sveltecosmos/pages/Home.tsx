'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, Cpu, Layers, Zap, Code2, ArrowUpRight, Play, CheckCircle2 } from 'lucide-react';
import { svelteTopics } from '../data/topics';

export function Home() {
  const [count, setCount] = useState(3);
  const [multiplier, setMultiplier] = useState(2);
  const [activeTab, setActiveTab] = useState<'source' | 'compiled' | 'ast'>('source');

  const derivedTotal = count * multiplier;

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="svelte-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--svelte-primary)]/30 bg-[var(--svelte-primary)]/10 text-[var(--svelte-primary)] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[var(--svelte-primary)]" />
              Svelte 5 Runes & Signals Compiler
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--svelte-text)]">
              No Virtual DOM.<br />
              <span className="text-[var(--svelte-primary)] svelte-glow">Pure Surgical</span> Reactivity.
            </h1>

            <p className="text-base md:text-lg text-[var(--svelte-muted)] max-w-xl leading-relaxed">
              Step inside the Svelte compiler engine. Witness how <span className="font-mono text-[var(--svelte-text)]">$state</span>, <span className="font-mono text-[var(--svelte-text)]">$derived</span>, and <span className="font-mono text-[var(--svelte-text)]">$effect</span> turn into high-performance, pinpoint vanilla JavaScript without reconciliation diffing overhead.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/sveltecosmos/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--svelte-primary)] text-white font-medium text-sm hover:bg-[var(--svelte-primary-hover)] transition-all shadow-[0_0_20px_rgba(255,62,0,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/sveltecosmos/runes"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--svelte-border)] bg-[var(--svelte-surface)] text-[var(--svelte-text)] font-mono text-sm hover:border-[var(--svelte-primary)] hover:text-[var(--svelte-primary)] transition-all"
              >
                <Sparkles className="w-4 h-4 text-[var(--svelte-primary)]" />
                Runes Sandbox
              </Link>

              <Link
                href="/sveltecosmos/compiler"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface-2)] text-[var(--svelte-muted)] font-mono text-sm hover:text-[var(--svelte-text)] transition-all"
              >
                <Cpu className="w-4 h-4" />
                AST Compiler
              </Link>
            </div>
          </div>

          {/* Right Live Interactive Visualizer Widget */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--svelte-border)] bg-[var(--svelte-surface)] shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="px-4 py-3 border-b border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-[var(--svelte-muted)] ml-2">SignalTelemetry.svelte</span>
                </div>
                <div className="flex items-center gap-1 bg-[var(--svelte-bg)] p-1 rounded-md border border-[var(--svelte-border-subtle)]">
                  <button
                    onClick={() => setActiveTab('source')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                      activeTab === 'source' ? 'bg-[var(--svelte-primary)] text-white' : 'text-[var(--svelte-muted)] hover:text-[var(--svelte-text)]'
                    }`}
                  >
                    .svelte
                  </button>
                  <button
                    onClick={() => setActiveTab('compiled')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                      activeTab === 'compiled' ? 'bg-[var(--svelte-primary)] text-white' : 'text-[var(--svelte-muted)] hover:text-[var(--svelte-text)]'
                    }`}
                  >
                    Vanilla JS
                  </button>
                </div>
              </div>

              {/* Code Preview / Compiler Tab */}
              <div className="p-5 font-mono text-xs space-y-4">
                {activeTab === 'source' ? (
                  <div className="space-y-2 text-[var(--svelte-muted)] leading-relaxed">
                    <div><span className="text-[var(--svelte-primary)] font-bold">&lt;script&gt;</span></div>
                    <div className="pl-4">
                      let count = <span className="text-[var(--svelte-accent)]">$state</span>({count});
                    </div>
                    <div className="pl-4">
                      let multiplier = <span className="text-[var(--svelte-accent)]">$state</span>({multiplier});
                    </div>
                    <div className="pl-4">
                      let total = <span className="text-[var(--svelte-mint)]">$derived</span>(count * multiplier);
                    </div>
                    <div className="pl-4">
                      <span className="text-[var(--svelte-cyan)]">$effect</span>(() =&gt; console.log(&apos;Signal update:&apos;, count));
                    </div>
                    <div><span className="text-[var(--svelte-primary)] font-bold">&lt;/script&gt;</span></div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-[var(--svelte-muted)] leading-relaxed text-[11px]">
                    <div className="text-[var(--svelte-primary)]">// Direct DOM node pointers (Zero VDOM)</div>
                    <div>const count = $.source({count});</div>
                    <div>const multiplier = $.source({multiplier});</div>
                    <div>const total = $.derive(() =&gt; $.get(count) * $.get(multiplier));</div>
                    <div className="text-[var(--svelte-mint)]">// Pinpoint textContent update:</div>
                    <div>$.render_effect(() =&gt; total_node.data = $.get(total));</div>
                  </div>
                )}

                {/* Live Interactive Signal Controls */}
                <div className="pt-4 border-t border-[var(--svelte-border-subtle)] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--svelte-muted)]">Signal: count</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCount(c => Math.max(0, c - 1))}
                        className="w-7 h-7 rounded border border-[var(--svelte-border)] bg-[var(--svelte-surface-2)] text-[var(--svelte-text)] hover:border-[var(--svelte-primary)]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-[var(--svelte-primary)]">{count}</span>
                      <button
                        onClick={() => setCount(c => c + 1)}
                        className="w-7 h-7 rounded border border-[var(--svelte-border)] bg-[var(--svelte-surface-2)] text-[var(--svelte-text)] hover:border-[var(--svelte-primary)]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--svelte-muted)]">Signal: multiplier</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMultiplier(m => Math.max(1, m - 1))}
                        className="w-7 h-7 rounded border border-[var(--svelte-border)] bg-[var(--svelte-surface-2)] text-[var(--svelte-text)] hover:border-[var(--svelte-primary)]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-[var(--svelte-accent)]">{multiplier}</span>
                      <button
                        onClick={() => setMultiplier(m => m + 1)}
                        className="w-7 h-7 rounded border border-[var(--svelte-border)] bg-[var(--svelte-surface-2)] text-[var(--svelte-text)] hover:border-[var(--svelte-primary)]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Derived Result Output Banner */}
                  <div className="p-3 rounded-lg border border-[var(--svelte-mint)]/30 bg-[var(--svelte-mint)]/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-[var(--svelte-mint)] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> $derived(count × multiplier):
                    </span>
                    <span className="font-mono font-bold text-base text-[var(--svelte-mint)]">
                      {derivedTotal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Virtual DOM vs Svelte Compiler */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--svelte-primary)] uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> Architectural Comparison
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--svelte-text)]">
            Virtual DOM vs Svelte Compiler
          </h2>
          <p className="text-sm text-[var(--svelte-muted)]">
            Why shifting work from browser runtime to compile-time creates faster web applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional VDOM card */}
          <div className="p-8 rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--svelte-text)]">Runtime VDOM Model</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                React / Vue 2
              </span>
            </div>
            <p className="text-xs text-[var(--svelte-muted)] leading-relaxed">
              Every state change generates a brand new Virtual DOM JavaScript tree. The runtime recursively diffs the new tree against the old tree to find mutations before patching the real DOM.
            </p>
            <div className="p-4 rounded-lg bg-[var(--svelte-bg)] font-mono text-[11px] text-[var(--svelte-muted)] space-y-2 border border-[var(--svelte-border-subtle)]">
              <div>1. State mutation: <span className="text-red-400">count = 4</span></div>
              <div>2. Render function re-executes whole component</div>
              <div>3. Build in-memory VNode tree (allocates objects)</div>
              <div>4. Diff VNode tree vs Previous VNode tree</div>
              <div>5. Patch browser DOM</div>
            </div>
          </div>

          {/* Svelte Compiler card */}
          <div className="p-8 rounded-2xl border-2 border-[var(--svelte-primary)]/40 bg-[var(--svelte-surface)] space-y-6 shadow-[0_0_30px_rgba(255,62,0,0.1)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--svelte-text)]">Svelte 5 Signals Engine</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--svelte-primary)]/10 text-[var(--svelte-primary)] border border-[var(--svelte-primary)]/30 font-bold">
                Zero VDOM
              </span>
            </div>
            <p className="text-xs text-[var(--svelte-muted)] leading-relaxed">
              The Svelte compiler transforms templates into pinpoint DOM updates at build time. When state changes, only the exact text node pointer is updated directly.
            </p>
            <div className="p-4 rounded-lg bg-[var(--svelte-bg)] font-mono text-[11px] text-[var(--svelte-muted)] space-y-2 border border-[var(--svelte-primary)]/20">
              <div>1. State mutation: <span className="text-[var(--svelte-primary)]">count.set(4)</span></div>
              <div>2. Signal notifies exact consumer effect</div>
              <div className="text-[var(--svelte-mint)]">3. Direct mutate: count_text_node.data = 4</div>
              <div className="text-[var(--svelte-accent)]">✓ 0 reconciliation passes · 0 tree diffing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--svelte-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--svelte-primary)] uppercase tracking-wider">
              Curriculum Roadmap
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--svelte-text)] mt-1">
              Interactive Deep Dives
            </h2>
          </div>
          <Link
            href="/sveltecosmos/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--svelte-primary)] hover:underline"
          >
            View all 10 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {svelteTopics.slice(0, 6).map((topic) => (
            <Link
              key={topic.id}
              href={`/sveltecosmos/learn/${topic.id}`}
              className="svelte-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--svelte-primary)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--svelte-muted)] group-hover:text-[var(--svelte-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--svelte-text)] group-hover:text-[var(--svelte-primary)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--svelte-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--svelte-border-subtle)] text-[var(--svelte-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--svelte-muted)]">
                  {topic.group}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
