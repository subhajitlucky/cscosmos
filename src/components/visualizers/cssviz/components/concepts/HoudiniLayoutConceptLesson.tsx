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
  LayoutGrid,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Compass,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function HoudiniLayoutConceptLesson() {
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState(16);

  const cardHeights = [140, 200, 160, 220, 150, 180];

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 9: Houdini APIs</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Layout API (Grand Finale)</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-500/15 dark:via-slate-950 dark:to-emerald-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              Final Concept 41 · CSS Universe Capstone
            </span>
            <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-1 font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
              Custom Engine Algorithms
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Houdini Layout API: Build Your Own display
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            The ultimate frontier of CSS. Instead of being restricted to <code className="text-emerald-500 font-mono">display: flex</code> or <code className="text-emerald-500 font-mono">grid</code>, write your own layout algorithm worklets—like Pinterest masonry or circular radial layouts—that run natively inside the browser&apos;s C++ layout stage!
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
              Custom Engine Algorithms Model
            </a>
            <a
              href="#layout-syntax"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-teal-500" />
              registerLayout() Architecture
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              Interactive Masonry Worklet Studio
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: Why We Need Custom Layout Worklets
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            For 10 years, if an e-commerce or photo portfolio site wanted a masonry grid (where cards with different aspect ratios fit tightly together without empty vertical gaps), developers had to load bulky JavaScript packages like Masonry.js.
            Those libraries work by measuring heights in the main thread and setting absolute coordinates, causing severe layout thrashing!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Legacy JS Layout Hacks</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Runs on main thread, measures DOM, forces layout thrashing, and repositioning causes visible flicker on page load.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Houdini Layout Worklet</span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Executes directly inside the browser&apos;s Layout phase in an asynchronous worker thread. Zero flicker, zero absolute-position hacks!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Breakdown */}
      <section id="layout-syntax" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The registerLayout() Worklet Specification
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs sm:text-sm text-emerald-300 space-y-2 overflow-x-auto">
            <div className="text-slate-400 font-sans font-bold">/* In masonry-layout-worklet.js */</div>
            <div>registerLayout(&apos;masonry&apos;, class &#123;</div>
            <div className="pl-4 text-cyan-300">static get inputProperties() &#123; return [&apos;--columns&apos;, &apos;--gap&apos;]; &#125;</div>
            <div className="pl-4 text-purple-400">async layout(children, edges, constraints, styleMap) &#123;</div>
            <div className="pl-8 text-slate-400">// Calculate column heights and position child fragment boxes:</div>
            <div className="pl-8">const childFragments = await Promise.all(children.map(c =&gt; c.layoutNextFragment()));</div>
            <div className="pl-8">return &#123; childFragments &#125;;</div>
            <div className="pl-4">&#125;</div>
            <div>&#125;);</div>

            <div className="text-slate-400 font-sans font-bold pt-2">/* In Pure CSS */</div>
            <div>.photo-feed &#123;</div>
            <div className="pl-4 text-pink-300 font-bold">display: layout(masonry);</div>
            <div className="pl-4">--columns: 3;</div>
            <div className="pl-4">--gap: 16px;</div>
            <div>&#125;</div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live Masonry Worklet Simulation
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>--columns Token</span>
                <span className="font-mono text-emerald-500">{columns}</span>
              </div>
              <input
                type="range"
                min="2"
                max="4"
                value={columns}
                onChange={(e) => setColumns(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>--gap Token</span>
                <span className="font-mono text-teal-500">{gap}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                step="4"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                CSS Layout Declaration
              </div>
              <div className="text-pink-300 font-bold">display: layout(masonry);</div>
              <div className="text-emerald-300">--columns: {columns};</div>
              <div className="text-teal-300">--gap: {gap}px;</div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[360px]">
            <div
              className="w-full grid transition-all duration-300"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
              }}
            >
              {cardHeights.map((h, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between shadow-sm transition-all hover:border-emerald-500"
                  style={{ minHeight: `${h}px` }}
                >
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Card #{i + 1}
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Height: {h}px
                  </div>
                  <span className="text-[10px] text-slate-400">Masonry Fragment</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Completion Trophy Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 p-8 sm:p-12 text-center space-y-5 shadow-2xl">
        <div className="inline-flex p-4 rounded-full bg-amber-500/20 text-amber-500 mx-auto border border-amber-500/30">
          <Trophy className="h-10 w-10 animate-bounce" />
        </div>
        <div className="space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Congratulations! You Mastered CSS Universe!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            You have journeyed through all 41 core concepts across 9 tracks—from fundamental selectors, specificity math, the box model, and modern flexbox/grid, to container queries, accessibility, and low-level Houdini engine APIs.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/fullstack/css-cosmos/concepts"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-3.5 text-sm font-extrabold shadow-xl transition-transform hover:scale-105"
          >
            <span>Return to Concept Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
