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
  FlaskConical,
} from 'lucide-react';
import GridLab from '../visualizers/GridLab';
import { cn } from '../../utils/cn';

export default function GridConceptLesson() {
  const [columnsCount, setColumnsCount] = useState(3);
  const [gridGap, setGridGap] = useState(16);
  const [isAutoFit, setIsAutoFit] = useState(false);

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
          <span>Track 3: Flexbox &amp; Grid</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">CSS Grid</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-slate-900/5 to-rose-500/10 dark:from-pink-500/15 dark:via-slate-950 dark:to-rose-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/20 px-3 py-1 font-mono text-xs font-bold text-pink-700 dark:text-pink-300 border border-pink-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              2-Dimensional Layout Architecture
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 11
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Grid Layout
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            The king of 2D layouts. Coordinate rows and columns simultaneously with the revolutionary <code>fr</code> unit, <code>minmax()</code>, and the magic responsive one-liner.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#grid-simulator"
              className="inline-flex items-center gap-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Sliders className="h-4 w-4" />
              <span>Interactive Grid Studio</span>
            </a>
            <a
              href="#grid-lab"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <FlaskConical className="h-4 w-4 text-pink-400" />
              <span>Full Grid Lab</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Flexbox vs Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Core Mental Model</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          When to Use Flexbox vs When to Use Grid
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl border border-violet-200 dark:border-violet-900/40 bg-white dark:bg-slate-900 space-y-2">
            <span className="font-bold text-violet-700 dark:text-violet-300 text-base">
              Flexbox: 1-Dimensional (Content-First)
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Use Flexbox when you want items to sit in a single row or column, and let the content size dictate where each item lands.
              <br />
              <strong>Best for:</strong> Navbars, button groups, modal footers, tag lists.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-pink-200 dark:border-pink-900/40 bg-white dark:bg-slate-900 space-y-2">
            <span className="font-bold text-pink-700 dark:text-pink-300 text-base">
              CSS Grid: 2-Dimensional (Layout-First)
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Use Grid when you have both horizontal columns and vertical rows that must line up strictly like a spreadsheet.
              <br />
              <strong>Best for:</strong> Full page layouts, dashboard bento grids, card directories.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: The Magic Responsive One-Liner */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold">
          <Code2 className="h-4 w-4" />
          <span>2. The Magic Responsive Formula</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          `repeat(auto-fit, minmax(250px, 1fr))`
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          The single most famous CSS Grid snippet. It creates a completely responsive grid of cards with <strong>zero media queries</strong>:
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0f172a] p-5 font-mono text-xs text-slate-200 space-y-2">
          <div className="text-pink-400">.card-grid &#123;</div>
          <div className="pl-4 text-emerald-300">display: grid;</div>
          <div className="pl-4 text-emerald-300">grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));</div>
          <div className="pl-4 text-emerald-300">gap: 1.5rem;</div>
          <div className="text-pink-400">&#125;</div>
          <div className="pt-2 text-slate-400">
            /* How it works:
               - minmax(250px, 1fr): Each card is at least 250px wide, but stretches to fill free space.
               - auto-fit: Automatically wraps into 4, 3, 2, or 1 column depending on screen width! */
          </div>
        </div>
      </section>

      {/* SECTION 3: Interactive Grid Studio */}
      <section id="grid-simulator" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>3. Live Grid Track Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Adjust Columns &amp; Fr Track Sizing
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-500">Columns: {columnsCount}</label>
              <input
                type="range"
                min="1"
                max="4"
                value={columnsCount}
                onChange={(e) => setColumnsCount(Number(e.target.value))}
                className="w-36 accent-pink-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500">gap: {gridGap}px</label>
              <input
                type="range"
                min="8"
                max="32"
                value={gridGap}
                onChange={(e) => setGridGap(Number(e.target.value))}
                className="w-36 accent-pink-500"
              />
            </div>
          </div>

          {/* Grid Canvas */}
          <div
            className="rounded-xl bg-[#0b1324] border border-slate-800 p-4 transition-all duration-300"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
              gap: `${gridGap}px`,
            }}
          >
            {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className="rounded-xl bg-pink-600/20 border border-pink-500 text-pink-300 font-mono text-xs font-bold p-4 text-center shadow-sm"
              >
                Card #{n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Lab Integration */}
      <section id="grid-lab" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>4. Full Grid Workbench</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Interactive Grid Visualizer
        </h2>
        <GridLab />
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next in Track 3</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">12. CSS Subgrid</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Align nested card titles, buttons, and content directly to parent grid rows.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/subgrid"
          className="inline-flex items-center gap-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to CSS Subgrid</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
