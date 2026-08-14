'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Wind, Activity, Layers, Palette, Eye, ArrowUpRight, CheckCircle2, Box, Sliders, Smartphone, Laptop } from 'lucide-react';
import { tailwindTopics } from '../data/topics';

export function Home() {
  const [padding, setPadding] = useState<'p-4' | 'p-6' | 'p-8'>('p-6');
  const [radius, setRadius] = useState<'rounded-lg' | 'rounded-2xl' | 'rounded-3xl'>('rounded-2xl');
  const [accent, setAccent] = useState<'cyan' | 'indigo' | 'emerald' | 'amber'>('cyan');
  const [showBoxDiagnostic, setShowBoxDiagnostic] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('desktop');

  const accentStyles = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      shadow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
      btn: 'bg-cyan-500 text-black hover:bg-cyan-400',
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      text: 'text-indigo-400',
      shadow: 'shadow-[0_0_25px_rgba(99,102,241,0.25)]',
      btn: 'bg-indigo-500 text-white hover:bg-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      shadow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      btn: 'bg-emerald-500 text-black hover:bg-emerald-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      shadow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
      btn: 'bg-amber-500 text-black hover:bg-amber-400',
    },
  };

  const cur = accentStyles[accent];
  const classListString = `flex flex-col gap-4 ${padding} ${radius} bg-slate-900 border ${cur.border} ${cur.shadow} transition-all`;

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="twc-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--twc-primary)]/30 bg-[var(--twc-primary)]/10 text-[var(--twc-primary)] text-xs font-mono">
              <Wind className="w-3.5 h-3.5 animate-pulse text-[var(--twc-primary)]" />
              Utility-First Design System Engine
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--twc-text)]">
              Atomic Design.<br />
              <span className="text-[var(--twc-primary)] twc-glow">Zero CSS Bloat.</span> Compiled On Demand.
            </h1>

            <p className="text-base md:text-lg text-[var(--twc-muted)] max-w-xl leading-relaxed">
              Explore the internals of utility-first styling. Deconstruct JIT Oxide compilation, Box Model geometry, responsive breakpoint matrices, and group/peer pseudo-state inheritance.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/tailwindcosmos/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--twc-primary)] text-black font-semibold text-sm hover:bg-[var(--twc-primary-hover)] transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/tailwindcosmos/playground"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--twc-border)] bg-[var(--twc-surface)] text-[var(--twc-text)] font-mono text-sm hover:border-[var(--twc-primary)] hover:text-[var(--twc-primary)] transition-all"
              >
                <Activity className="w-4 h-4 text-[var(--twc-primary)]" />
                Live JIT Playground
              </Link>

              <Link
                href="/tailwindcosmos/token-matrix"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--twc-border-subtle)] bg-[var(--twc-surface-2)] text-[var(--twc-muted)] font-mono text-sm hover:text-[var(--twc-text)] transition-all"
              >
                <Palette className="w-4 h-4 text-[var(--twc-indigo)]" />
                Token Scale
              </Link>
            </div>
          </div>

          {/* Right Live JIT Compiler & Box Inspector */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--twc-border)] bg-[var(--twc-surface)] shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--twc-border-subtle)] bg-[var(--twc-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-[var(--twc-muted)] ml-2">JIT::ComponentPreview</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBoxDiagnostic(!showBoxDiagnostic)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                      showBoxDiagnostic
                        ? 'bg-[var(--twc-primary)] text-black border-[var(--twc-primary)] font-bold'
                        : 'bg-[var(--twc-bg)] text-[var(--twc-muted)] border-[var(--twc-border-subtle)]'
                    }`}
                  >
                    <Box className="w-3 h-3" /> Box Wireframe
                  </button>
                </div>
              </div>

              <div className="p-6 font-mono text-xs space-y-6">
                {/* Visualizer Target Frame */}
                <div className={`p-4 rounded-xl bg-[var(--twc-bg)] border border-[var(--twc-border-subtle)] transition-all flex items-center justify-center min-h-[220px] ${viewport === 'mobile' ? 'max-w-[280px] mx-auto' : 'w-full'}`}>
                  <div className={`${classListString} ${showBoxDiagnostic ? 'ring-2 ring-emerald-500/70' : ''} max-w-sm w-full`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider ${cur.text}`}>
                        Tailwind Engine
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                        v4.0.0
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Instant JIT utility compiler generating zero runtime overhead.
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${cur.btn}`}>
                        Action Button
                      </button>
                      <span className="text-[11px] text-slate-400">0kB CSS Delta</span>
                    </div>
                  </div>
                </div>

                {/* Generated Class String Display */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--twc-muted)] uppercase tracking-wider">Compiled Class String</span>
                  <div className="p-3 rounded-lg bg-[var(--twc-bg)] border border-[var(--twc-border-subtle)] text-[11px] text-[var(--twc-primary)] break-all select-all">
                    class=&quot;{classListString}&quot;
                  </div>
                </div>

                {/* Interactive Toggles */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {(['p-4', 'p-6', 'p-8'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPadding(p)}
                        className={`py-1.5 rounded text-[10px] transition-all ${
                          padding === p
                            ? 'bg-[var(--twc-primary)] text-black font-bold'
                            : 'border border-[var(--twc-border-subtle)] bg-[var(--twc-surface-2)] text-[var(--twc-muted)]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {(['cyan', 'indigo', 'emerald', 'amber'] as const).map((acc) => (
                      <button
                        key={acc}
                        onClick={() => setAccent(acc)}
                        className={`py-1.5 rounded text-[10px] capitalize transition-all ${
                          accent === acc
                            ? 'bg-[var(--twc-primary)] text-black font-bold'
                            : 'border border-[var(--twc-border-subtle)] bg-[var(--twc-surface-2)] text-[var(--twc-muted)]'
                        }`}
                      >
                        {acc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Semantic CSS vs Utility-First */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--twc-primary)] uppercase tracking-wider">
            <Sliders className="w-4 h-4" /> CSS Architecture Paradigm
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--twc-text)]">
            Semantic Stylesheets vs Utility Composition
          </h2>
          <p className="text-sm text-[var(--twc-muted)]">
            Why traditional CSS files grow indefinitely while utility-first CSS plateaus at constant size.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Semantic BEM card */}
          <div className="p-8 rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--twc-text)]">Semantic BEM Stylesheets</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                O(N) Growth
              </span>
            </div>
            <p className="text-xs text-[var(--twc-muted)] leading-relaxed">
              Every new UI view requires new unique class names and redundant CSS property declarations. Unused CSS accumulates and causes fear of deletion.
            </p>
            <div className="p-4 rounded-lg bg-[var(--twc-bg)] font-mono text-[11px] text-[var(--twc-muted)] space-y-2 border border-[var(--twc-border-subtle)]">
              <div>• Unbounded CSS file size growth (500kB+ stylesheets)</div>
              <div>• High cognitive overhead inventing bespoke class names</div>
              <div>• High risk of unintended global style side-effects</div>
              <div>• Context switching between markup and stylesheet files</div>
            </div>
          </div>

          {/* Utility-First card */}
          <div className="p-8 rounded-2xl border-2 border-[var(--twc-primary)]/40 bg-[var(--twc-surface)] space-y-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--twc-text)]">Utility-First Tailwind CSS</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--twc-primary)]/10 text-[var(--twc-primary)] border border-[var(--twc-primary)]/30 font-bold">
                O(1) Flat Size
              </span>
            </div>
            <p className="text-xs text-[var(--twc-muted)] leading-relaxed">
              Components are composed using standardized atomic design tokens directly in HTML. Global CSS size plateaus at ~10kB and is cached across every route.
            </p>
            <div className="p-4 rounded-lg bg-[var(--twc-bg)] font-mono text-[11px] text-[var(--twc-muted)] space-y-2 border border-[var(--twc-primary)]/20">
              <div className="text-[var(--twc-primary)]">• Global CSS bundle size remains strictly constant</div>
              <div className="text-[var(--twc-sky)]">• Zero mental effort inventing arbitrary class names</div>
              <div className="text-[var(--twc-emerald)]">• Safe refactoring: change markup without global regressions</div>
              <div className="text-[var(--twc-text)]">• Sub-10ms JIT compilation with Rust Oxide engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--twc-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--twc-primary)] uppercase tracking-wider">
              Curriculum Tracks
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--twc-text)] mt-1">
              Tailwind Engineering Modules
            </h2>
          </div>
          <Link
            href="/tailwindcosmos/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--twc-primary)] hover:underline"
          >
            View all 8 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tailwindTopics.slice(0, 6).map((topic) => (
            <Link
              key={topic.id}
              href={`/tailwindcosmos/learn/${topic.id}`}
              className="twc-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--twc-primary)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--twc-muted)] group-hover:text-[var(--twc-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--twc-text)] group-hover:text-[var(--twc-primary)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--twc-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--twc-border-subtle)] text-[var(--twc-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--twc-muted)]">
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
