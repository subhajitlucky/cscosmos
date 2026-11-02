'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Code2,
  AlertTriangle,
  Sliders,
  ArrowRight,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function FunctionsConceptLesson() {
  const [simViewportWidth, setSimViewportWidth] = useState(768);

  // clamp(1.5rem, 4vw, 3.5rem)
  // At 16px root: min = 24px, max = 56px, preferred = simViewportWidth * 0.04
  const preferredPx = simViewportWidth * 0.04;
  const clampedPx = Math.min(56, Math.max(24, Math.round(preferredPx)));

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 4: Units &amp; Math</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">Math Functions</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-slate-900/5 to-amber-500/10 dark:from-yellow-500/15 dark:via-slate-950 dark:to-amber-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-3 py-1 font-mono text-xs font-bold text-yellow-700 dark:text-yellow-300 border border-yellow-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              1st Year CS Foundation · Core Track 4
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 15
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Math Functions: calc, min, max, clamp
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            Turn CSS into a dynamic mathematical engine. Mix units with <code>calc()</code> and create fluid responsive typography that scales across mobile and desktop with <code>clamp()</code>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#clamp-simulator"
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Sliders className="h-4 w-4" />
              <span>Interactive clamp() Studio</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: The 4 Math Functions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-600 dark:text-yellow-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Core 4 Functions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Dynamic Math in Modern CSS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <code className="text-amber-600 dark:text-amber-400 font-bold text-sm">calc(...)</code>
            <p className="text-slate-600 dark:text-slate-400">
              Mixes incompatible units like percentages and pixels!
              <br />
              <code>width: calc(100% - 40px);</code>
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <code className="text-blue-600 dark:text-blue-400 font-bold text-sm">min(...)</code>
            <p className="text-slate-600 dark:text-slate-400">
              Picks the smallest value in the comma-separated list.
              <br />
              <code>width: min(100%, 800px);</code>
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <code className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">max(...)</code>
            <p className="text-slate-600 dark:text-slate-400">
              Picks the largest value in the list (sets safe minimums).
              <br />
              <code>padding: max(16px, 2vw);</code>
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 space-y-2">
            <code className="text-purple-600 dark:text-purple-400 font-bold text-sm">clamp(min, val, max)</code>
            <p className="text-slate-600 dark:text-slate-400">
              The holy grail! Pins a fluid scaling value between a minimum and maximum threshold.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Interactive clamp() Simulator */}
      <section id="clamp-simulator" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-600 dark:text-yellow-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>2. Live Fluid clamp() Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Simulate Viewport Scaling Across Devices
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-500">
              <span>Mobile (320px)</span>
              <span className="font-bold text-slate-900 dark:text-white">Simulated Screen: {simViewportWidth}px</span>
              <span>Desktop (1400px)</span>
            </div>
            <input
              type="range"
              min="320"
              max="1400"
              value={simViewportWidth}
              onChange={(e) => setSimViewportWidth(Number(e.target.value))}
              className="w-full accent-yellow-500"
            />
          </div>

          {/* Fluid Headline Preview */}
          <div className="rounded-xl bg-[#0b1324] p-8 text-center border border-slate-800 space-y-2">
            <div
              className="font-extrabold text-white tracking-tight transition-all"
              style={{
                fontSize: `${clampedPx}px`,
              }}
            >
              Fluid Typography
            </div>
            <div className="text-xs font-mono text-yellow-400">
              Active Computed Size: {clampedPx}px
            </div>
          </div>

          <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-200">
            <code>font-size: clamp(1.5rem, 4vw, 3.5rem);</code>
            <div className="text-slate-400 pt-1 text-[11px]">
              - Under 600px screen: Locked at 1.5rem (24px)
              <br />
              - Between 600px and 1400px screen: Scales smoothly with 4vw
              <br />
              - Above 1400px screen: Capped safely at 3.5rem (56px)
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next in Track 4</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">16. CSS Variables (Custom Properties)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Design tokens, component scoping, and instant dark mode theme switching.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/variables"
          className="inline-flex items-center gap-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to CSS Variables</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
