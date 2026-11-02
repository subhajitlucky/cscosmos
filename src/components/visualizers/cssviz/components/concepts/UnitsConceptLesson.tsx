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
  FlaskConical,
} from 'lucide-react';
import UnitsFunctionsLab from '../visualizers/UnitsFunctionsLab';
import { cn } from '../../utils/cn';

export default function UnitsConceptLesson() {
  const [rootFontSize, setRootFontSize] = useState(16);
  const [remValue, setRemValue] = useState(1.5);

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
          <span className="text-amber-600 dark:text-amber-400 font-bold">CSS Units</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/5 to-yellow-500/10 dark:from-amber-500/15 dark:via-slate-950 dark:to-yellow-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              1st Year CS Foundation · Core Track 4
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 14
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Units (px, rem, em, vh, ch)
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            Never use raw pixels for font sizes again. Master relative scaling, accessible <code>rem</code> root calculations, viewport metrics (<code>vh</code>, <code>dvh</code>), and typographic <code>ch</code> constraints.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#units-lab"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <FlaskConical className="h-4 w-4" />
              <span>Units &amp; Math Workbench</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Absolute vs Relative Units */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Core Comparison</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Why Professionals Build with `rem` Instead of `px`
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <span className="font-bold text-rose-600 dark:text-rose-400 text-base">
              Pixels (`px`): The Rigid Metal Ruler
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              If an elderly user increases their default browser font size from 16px to 24px for accessibility, <code>font-size: 16px</code> ignores their setting completely!
              <br />
              <strong>Only use px for:</strong> Thin 1px borders, subtle box-shadow offsets.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-white dark:bg-slate-900 space-y-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 text-base">
              Root EM (`rem`): The Accessible Elastic Unit
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <code>1rem</code> equals the root <code>&lt;html&gt;</code> font size (default 16px).
              <br />
              If the user changes their browser preferences, all <code>rem</code> dimensions scale proportionally across the entire site!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Interactive rem to px Calculator */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>2. Live rem Calculator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          See How Root Changes Propagate
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-500">Root Font Size (&lt;html&gt;): {rootFontSize}px</label>
              <input
                type="range"
                min="12"
                max="24"
                value={rootFontSize}
                onChange={(e) => setRootFontSize(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500">Target Value: {remValue}rem</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.25"
                value={remValue}
                onChange={(e) => setRemValue(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0f172a] text-center font-mono">
            <div className="text-xs text-slate-400">Formula: {remValue}rem × {rootFontSize}px =</div>
            <div className="text-2xl font-bold text-amber-400 pt-1">
              {remValue * rootFontSize}px Computed On-Screen
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Visualizer Lab Integration */}
      <section id="units-lab" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>3. Units &amp; Functions Workbench</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Interactive Units Studio
        </h2>
        <UnitsFunctionsLab />
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next in Track 4</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">15. Math Functions (calc, min, max, clamp)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Fluid typography, viewport constraints, and clamp() magic.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/functions"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to Math Functions</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
