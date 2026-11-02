'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Code2,
  Sliders,
  ArrowRight,
  ChevronRight,
  Flame,
  Zap,
  Layers,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ReflowRepaintConceptLesson() {
  const [isThrashing, setIsThrashing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [fps, setFps] = useState(60);

  const triggerSimulation = (thrash: boolean) => {
    setIsThrashing(thrash);
    setIsRunning(true);
    setFps(thrash ? 9 : 60);
    setTimeout(() => {
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 9: Engine Internals</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-rose-600 dark:text-rose-400 font-bold">Reflow &amp; Repaint</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-amber-500/10 dark:from-rose-500/15 dark:via-slate-950 dark:to-rose-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 font-mono text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-500/30">
              <Flame className="h-3.5 w-3.5" />
              Engine Internals · Track 9
            </span>
            <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 font-mono text-xs font-bold text-orange-700 dark:text-orange-300">
              Core Concept 35
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Reflow, Repaint &amp; Layout Thrashing
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            The secret cause of laggy websites. Discover why Repaint is fast but Reflow is expensive, understand the lethal performance killer known as <strong className="text-rose-500 font-semibold">Layout Thrashing (Forced Synchronous Layout)</strong>, and learn how batching DOM reads and writes saves 60fps frame rates.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-rose-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-rose-500" />
              Architect vs House Painter Model
            </a>
            <a
              href="#layout-thrashing"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-rose-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-orange-500" />
              The Read-Write Layout Trap
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-rose-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-amber-500" />
              Live FPS Thrashing Simulator
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: Knocking Down Walls (Reflow) vs. Repainting Walls (Repaint)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 p-6 space-y-3">
            <h3 className="font-bold text-rose-600 dark:text-rose-400 text-sm">
              Reflow (Layout): Heavy Structural Renovation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Knocking down a structural wall in a house. The roof settles, plumbing pipes must be rerouted, adjacent rooms shrink, and all furniture must be repositioned.
              Triggered by changing <code className="font-mono">width</code>, <code className="font-mono">height</code>, <code className="font-mono">font-size</code>, or adding/removing DOM elements.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-3">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              Repaint: Changing Wall Paint Color
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Painting your bedroom wall from yellow to blue. Zero walls move; furniture remains exactly where it was.
              Triggered by changing <code className="font-mono">color</code>, <code className="font-mono">background-color</code>, or <code className="font-mono">visibility</code>. Much faster than reflow!
            </p>
          </div>
        </div>
      </section>

      {/* Layout Thrashing */}
      <section id="layout-thrashing" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Deadly Crime: Layout Thrashing (Forced Synchronous Layout)
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Browsers normally batch DOM writes and execute them once at the end of the 16.6ms frame.
            However, if you write a style and then <strong>immediately ask for a geometric dimension</strong> in JavaScript, you force the browser to execute an emergency synchronous reflow on the spot!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-rose-500">❌ Layout Thrashing (Stutters at 5fps)</div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-rose-300 space-y-1">
                <div>cards.forEach(card =&gt; &#123;</div>
                <div className="pl-4 text-slate-400">// WRITE (invalidates layout):</div>
                <div className="pl-4">card.style.width = &apos;200px&apos;;</div>
                <div className="pl-4 text-rose-400">// READ (forces immediate emergency reflow!):</div>
                <div className="pl-4 text-rose-400">const h = card.offsetHeight;</div>
                <div>&#125;);</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-emerald-500">✅ Batched Execution (Silky 60fps)</div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 space-y-1">
                <div>// 1. Read all heights first (Zero reflow):</div>
                <div>const heights = cards.map(c =&gt; c.offsetHeight);</div>
                <div>// 2. Write all widths together (1 single reflow):</div>
                <div>cards.forEach(card =&gt; card.style.width = &apos;200px&apos;);</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Simulate Layout Thrashing vs. Batched Loop
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Run Benchmark Script
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => triggerSimulation(true)}
                className="py-3 px-4 rounded-xl border border-rose-500 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all flex flex-col items-center gap-1"
              >
                <Flame className="h-4 w-4" />
                <span>Simulate Thrashing</span>
              </button>

              <button
                onClick={() => triggerSimulation(false)}
                className="py-3 px-4 rounded-xl border border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all flex flex-col items-center gap-1"
              >
                <Zap className="h-4 w-4" />
                <span>Simulate Batched</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                Simulated Frame Budget
              </div>
              <div className="flex items-center justify-between">
                <span>Calculated Frame Rate:</span>
                <span className={cn('font-bold text-base', fps > 30 ? 'text-emerald-400' : 'text-rose-400')}>
                  {fps} FPS
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isThrashing
                  ? '⚠️ 100 forced synchronous reflows burned 120ms of CPU time!'
                  : '✓ Batched writes completed within the 16.6ms frame budget.'}
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[340px]">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">DOM Element Batch Progress</span>
                <span className={isThrashing ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                  {isRunning ? 'Processing...' : 'Idle'}
                </span>
              </div>

              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-10 rounded-xl border p-2 flex items-center justify-between text-xs font-mono transition-all',
                    isRunning && isThrashing
                      ? 'border-rose-500 bg-rose-500/20 animate-pulse text-rose-700 dark:text-rose-300'
                      : isRunning
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <span>#card-node-{i}</span>
                  <span>{isRunning && isThrashing ? 'Forced Reflow' : 'Ready'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Reflow &amp; Repaint</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Properties that Trigger Forced Reflow:</strong> Accessing any of these properties right after writing style changes will force an emergency reflow: <code className="font-mono text-rose-500">offsetWidth</code>, <code className="font-mono text-rose-500">offsetHeight</code>, <code className="font-mono text-rose-500">scrollTop</code>, <code className="font-mono text-rose-500">getBoundingClientRect()</code>, and <code className="font-mono text-rose-500">getComputedStyle()</code>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>FastDOM / requestAnimationFrame:</strong> If you must mutate DOM styles based on measurements, wrap reads in the current tick and wrap writes inside <code className="font-mono text-emerald-400">requestAnimationFrame(() =&gt; &#123; ... &#125;)</code> to let the browser execute them at the start of the next refresh cycle.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            GPU Acceleration &amp; will-change
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Promote elements into independent GPU compositing layers without causing memory leaks.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/gpu"
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 36</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
