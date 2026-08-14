'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Activity, Layers, ArrowUpRight, CheckCircle2, RotateCcw, Play, Zap, Cpu, Eye, ShieldCheck } from 'lucide-react';
import { browserTopics } from '../data/topics';

const CRP_STAGES = [
  { id: 'tokenize', name: '1. HTML Tokenizer & DOM', cost: 'Parsing Bytes', color: 'border-cyan-500/30 text-cyan-400' },
  { id: 'cssom', name: '2. CSSOM Rule Matching', cost: 'Cascading Selectors', color: 'border-blue-500/30 text-blue-400' },
  { id: 'render_tree', name: '3. Render Tree Filter', cost: 'Visible Geometry', color: 'border-purple-500/30 text-purple-400' },
  { id: 'layout', name: '4. Layout (Reflow)', cost: 'Box Coordinates', color: 'border-amber-500/30 text-amber-400' },
  { id: 'paint', name: '5. Paint Rasterization', cost: 'Skia Draw Calls', color: 'border-rose-500/30 text-rose-400' },
  { id: 'composite', name: '6. GPU Compositing', cost: 'VRAM Textures', color: 'border-emerald-500/30 text-emerald-400' },
];

export function Home() {
  const [mutationType, setMutationType] = useState<'transform' | 'color' | 'layout'>('transform');
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Chromium Blink rendering engine ready.',
    '[READY] Select mutation type and click "Render Pipeline Trigger".'
  ]);

  const triggerPipeline = () => {
    setIsRendering(true);
    setActiveStage(0);

    let startStep = 0;
    if (mutationType === 'transform') {
      startStep = 5; // Direct to GPU Compositing!
      setLogs([
        '[GPU TRANSFORM] CSS transform: translate3d(20px, 0, 0)',
        '[FAST PATH] Skipped Layout (Reflow) & Paint! Executed in 0.2ms on GPU Compositor thread.',
        '[FPS] 120 FPS rock-solid with zero main-thread jank.'
      ]);
      setActiveStage(5);
      setTimeout(() => setIsRendering(false), 500);
      return;
    }

    if (mutationType === 'color') {
      startStep = 4; // Paint -> Composite
      setLogs([
        '[PAINT RECALC] CSS background-color changed to #10b981',
        '[SKIPPED LAYOUT] Geometry unchanged; recalculating Skia raster bitmap layers.',
        '[COMPOSITING] Updated texture uploaded to GPU (1.2ms).'
      ]);
      setActiveStage(4);
      setTimeout(() => {
        setActiveStage(5);
        setTimeout(() => setIsRendering(false), 300);
      }, 300);
      return;
    }

    // Full layout reflow
    setLogs([
      '[REFLOW MUTATION] CSS width: 320px -> 480px (Box Model resized)',
      '[LAYOUT RECALC] Calculating coordinates for element & 14 parent/sibling nodes (3.8ms)',
      '[PAINT] Re-rasterizing damaged visual tiles on CPU',
      '[COMPOSITE] Uploading layers to GPU VRAM'
    ]);
    setActiveStage(3);
    setTimeout(() => {
      setActiveStage(4);
      setTimeout(() => {
        setActiveStage(5);
        setTimeout(() => setIsRendering(false), 300);
      }, 300);
    }, 300);
  };

  const resetPipeline = () => {
    setMutationType('transform');
    setActiveStage(null);
    setIsRendering(false);
    setLogs(['[RESET] Render tree normalized.']);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="bu-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--bu-primary)]/30 bg-[var(--bu-primary)]/10 text-[var(--bu-primary)] text-xs font-mono">
              <Compass className="w-3.5 h-3.5 animate-spin text-[var(--bu-primary)]" />
              DOM &bull; CSSOM &bull; V8 JIT &bull; Event Loop &bull; Multi-Process
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--bu-text)]">
              Pixels from Bytes.<br />
              <span className="text-[var(--bu-primary)] bu-glow">Blink &amp; V8 Engine</span> Internals.
            </h1>

            <p className="text-base md:text-lg text-[var(--bu-muted)] max-w-xl leading-relaxed">
              Deconstruct the modern web browser. Explore the Critical Rendering Path, V8 TurboFan JIT compilation, 16.6ms Event Loop frame budgets, and Multi-Process Sandboxing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/browseruniverse/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--bu-primary)] text-black font-semibold text-sm hover:bg-[var(--bu-primary-hover)] transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/browseruniverse/crp-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--bu-border)] bg-[var(--bu-surface)] text-[var(--bu-text)] font-mono text-sm hover:border-[var(--bu-primary)] hover:text-[var(--bu-primary)] transition-all"
              >
                <Eye className="w-4 h-4 text-[var(--bu-primary)]" />
                CRP &amp; Reflow Lab
              </Link>

              <Link
                href="/browseruniverse/v8-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--bu-border-subtle)] bg-[var(--bu-surface-2)] text-[var(--bu-muted)] font-mono text-sm hover:text-[var(--bu-text)] transition-all"
              >
                <Cpu className="w-4 h-4 text-[var(--bu-v8-orange)]" />
                V8 JIT Lab
              </Link>
            </div>
          </div>

          {/* Right Live Critical Rendering Path Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--bu-border)] bg-[var(--bu-surface)] shadow-2xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-3 border-b border-[var(--bu-border-subtle)] bg-[var(--bu-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-[var(--bu-muted)] ml-2">Blink::RenderPipeline</span>
                </div>
                <button
                  onClick={resetPipeline}
                  className="text-[10px] text-[var(--bu-muted)] hover:text-[var(--bu-primary)]"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Mutation Type Selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--bu-muted)]">Select DOM/CSS Mutation:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['transform', 'GPU Transform', 'Composite only (Fastest)'],
                      ['color', 'Color Change', 'Paint + Composite'],
                      ['layout', 'Resize Width', 'Full Reflow (Slowest)'],
                    ].map(([mId, label, sub]) => (
                      <button
                        key={mId}
                        onClick={() => setMutationType(mId as 'transform' | 'color' | 'layout')}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          mutationType === mId
                            ? 'border-[var(--bu-primary)] bg-[var(--bu-primary)]/15 text-white font-bold'
                            : 'border-[var(--bu-border-subtle)] bg-[var(--bu-bg)] text-[var(--bu-muted)]'
                        }`}
                      >
                        <div className="text-[10px]">{label}</div>
                        <div className="text-[8px] opacity-75">{sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pipeline Stage Sequence */}
                <div className="space-y-2">
                  {CRP_STAGES.map((stage, idx) => {
                    const isActive = activeStage === idx;
                    return (
                      <div
                        key={stage.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                          isActive
                            ? 'border-[var(--bu-primary)] bg-[var(--bu-primary)]/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : 'border-[var(--bu-border-subtle)] bg-[var(--bu-bg)] text-[var(--bu-muted)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`} />
                          <span className="font-bold">{stage.name}</span>
                        </div>
                        <span className="text-[9px] opacity-75">{stage.cost}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Render Trigger */}
                <button
                  onClick={triggerPipeline}
                  disabled={isRendering}
                  className="w-full py-3 rounded-lg bg-[var(--bu-primary)] text-black font-bold hover:bg-[var(--bu-primary-hover)] transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  {isRendering ? 'Traversing Render Pipeline...' : 'Trigger DOM Mutation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rendering Cost Comparison */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--bu-primary)] uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Rendering Engine Cost Breakdown
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--bu-text)]">
            Reflow vs Repaint vs Composite
          </h2>
          <p className="text-sm text-[var(--bu-muted)]">
            How choice of CSS properties dictates whether rendering takes 16ms of CPU time or 0.2ms of GPU time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-xs">
          {/* Reflow Card */}
          <div className="p-8 rounded-2xl border border-rose-500/30 bg-[var(--bu-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--bu-text)]">Layout (Reflow)</span>
              <span className="text-[10px] px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                HEAVIEST (CPU)
              </span>
            </div>
            <p className="text-xs text-[var(--bu-muted)] leading-relaxed font-sans">
              Mutating geometry triggers recalculation of bounding boxes and reflow of all affected parent and sibling elements across the entire document.
            </p>
            <div className="p-4 rounded-lg bg-[var(--bu-bg)] space-y-1.5 text-[11px] text-[var(--bu-muted)] border border-rose-500/20">
              <div className="text-rose-400">• width, height, margin, padding</div>
              <div className="text-rose-400">• top, left, font-size, display</div>
              <div>• Forces Paint + Composite stages</div>
            </div>
          </div>

          {/* Repaint Card */}
          <div className="p-8 rounded-2xl border border-amber-500/30 bg-[var(--bu-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--bu-text)]">Paint (Rasterize)</span>
              <span className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                MEDIUM (CPU)
              </span>
            </div>
            <p className="text-xs text-[var(--bu-muted)] leading-relaxed font-sans">
              Geometry remains untouched, but visual pixels must be re-rasterized into bitmaps using Skia draw commands.
            </p>
            <div className="p-4 rounded-lg bg-[var(--bu-bg)] space-y-1.5 text-[11px] text-[var(--bu-muted)] border border-amber-500/20">
              <div className="text-amber-400">• color, background-color, border-style</div>
              <div className="text-amber-400">• box-shadow, visibility, outline</div>
              <div>• Forces Composite stage</div>
            </div>
          </div>

          {/* Composite Card */}
          <div className="p-8 rounded-2xl border-2 border-emerald-500/40 bg-[var(--bu-surface)] space-y-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--bu-text)]">GPU Compositing</span>
              <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                FASTEST (GPU)
              </span>
            </div>
            <p className="text-xs text-[var(--bu-muted)] leading-relaxed font-sans">
              Executes entirely on the GPU compositor thread without touching the main JavaScript thread, achieving 120 FPS animations.
            </p>
            <div className="p-4 rounded-lg bg-[var(--bu-bg)] space-y-1.5 text-[11px] text-[var(--bu-muted)] border border-emerald-500/20">
              <div className="text-emerald-400">• transform: translate / scale / rotate</div>
              <div className="text-emerald-400">• opacity, filter, will-change</div>
              <div className="text-emerald-300">• 0ms Reflow &amp; 0ms Paint overhead</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--bu-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--bu-primary)] uppercase tracking-wider">
              Architecture Tracks
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--bu-text)] mt-1">
              Browser Engine Core Modules
            </h2>
          </div>
          <Link
            href="/browseruniverse/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--bu-primary)] hover:underline"
          >
            View all 5 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {browserTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/browseruniverse/learn/${topic.id}`}
              className="bu-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--bu-primary)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--bu-muted)] group-hover:text-[var(--bu-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--bu-text)] group-hover:text-[var(--bu-primary)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--bu-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--bu-border-subtle)] text-[var(--bu-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--bu-muted)]">
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
