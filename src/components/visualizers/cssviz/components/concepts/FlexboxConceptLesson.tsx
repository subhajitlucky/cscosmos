'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Code2,
  AlertTriangle,
  Layers,
  Sliders,
  ArrowRight,
  ChevronRight,
  FlaskConical,
} from 'lucide-react';
import FlexboxLab from '../visualizers/FlexboxLab';
import { cn } from '../../utils/cn';

export default function FlexboxConceptLesson() {
  const [flexDirection, setFlexDirection] = useState<'row' | 'column'>('row');
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'center' | 'space-between' | 'space-around'>('center');
  const [alignItems, setAlignItems] = useState<'stretch' | 'center' | 'flex-start' | 'flex-end'>('center');
  const [gap, setGap] = useState(16);

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
          <span className="text-amber-600 dark:text-amber-400 font-bold">Flexbox Visualizer</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-slate-900/5 to-indigo-500/10 dark:from-violet-500/15 dark:via-slate-950 dark:to-indigo-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 font-mono text-xs font-bold text-violet-700 dark:text-violet-300 border border-violet-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              1st Year CS Foundation · Core Track 3
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 10
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Flexbox Layout Studio
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            1-Dimensional layout powerhouse. Master Main Axis vs Cross Axis, justify-content, align-items, flex-grow, and the legendary CSS 1-line vertical centering trick.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#flex-simulator"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Sliders className="h-4 w-4" />
              <span>Interactive Axis Studio</span>
            </a>
            <a
              href="#flex-lab"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <FlaskConical className="h-4 w-4 text-violet-400" />
              <span>Full Flexbox Lab</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Main Axis vs Cross Axis */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-600 dark:text-violet-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Core Mental Model</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Main Axis vs Cross Axis (The Secret to Flexbox)
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          The single biggest mistake 1st-year students make is thinking <code>justify-content</code> always controls horizontal alignment. <strong>It doesn&apos;t!</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-violet-200 dark:border-violet-900/40 bg-white dark:bg-slate-900 space-y-2">
            <span className="font-bold text-violet-700 dark:text-violet-300 text-base">
              justify-content = Aligns along MAIN Axis
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If <code>flex-direction: row</code>, Main Axis is <strong>horizontal</strong> (left-to-right).
              <br />
              If <code>flex-direction: column</code>, Main Axis switches to <strong>vertical</strong> (top-to-bottom)!
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-white dark:bg-slate-900 space-y-2">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 text-base">
              align-items = Aligns along CROSS Axis
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Cross Axis is always perpendicular (90 degrees) to the Main Axis.
              <br />
              Default value is <code>stretch</code> (items expand to match tallest item!).
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Interactive Axis Studio */}
      <section id="flex-simulator" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-600 dark:text-violet-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>2. Live Flexbox Axis Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Rotate Axes &amp; Test Alignments Live
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-mono">flex-direction</label>
              <select
                value={flexDirection}
                onChange={(e) => setFlexDirection(e.target.value as typeof flexDirection)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 font-mono text-xs"
              >
                <option value="row">row (Horizontal)</option>
                <option value="column">column (Vertical)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-mono">justify-content (Main)</label>
              <select
                value={justifyContent}
                onChange={(e) => setJustifyContent(e.target.value as typeof justifyContent)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 font-mono text-xs"
              >
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-mono">align-items (Cross)</label>
              <select
                value={alignItems}
                onChange={(e) => setAlignItems(e.target.value as typeof alignItems)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 font-mono text-xs"
              >
                <option value="center">center</option>
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="stretch">stretch</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-mono">gap: {gap}px</label>
              <input
                type="range"
                min="0"
                max="32"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div
            className="h-64 rounded-xl bg-[#0b1324] border border-slate-800 p-4 transition-all duration-300 flex"
            style={{
              flexDirection: flexDirection,
              justifyContent: justifyContent,
              alignItems: alignItems,
              gap: `${gap}px`,
            }}
          >
            <div className="rounded-xl bg-violet-600 text-white font-mono text-xs font-bold p-4 shadow-md flex items-center justify-center">
              Item 1
            </div>
            <div className="rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold p-4 shadow-md flex items-center justify-center">
              Item 2
            </div>
            <div className="rounded-xl bg-purple-600 text-white font-mono text-xs font-bold p-4 shadow-md flex items-center justify-center">
              Item 3
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: The 3-Line Vertical Centering Trick */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-600 dark:text-violet-400 font-bold">
          <Code2 className="h-4 w-4" />
          <span>3. The Holy Grail Center</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Perfect Vertical &amp; Horizontal Centering
        </h2>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0f172a] p-5 font-mono text-xs text-slate-200 space-y-1">
          <div className="text-slate-400">/* Center anything perfectly inside its container: */</div>
          <div className="text-violet-400">.parent &#123;</div>
          <div className="pl-4 text-emerald-300">display: flex;</div>
          <div className="pl-4 text-emerald-300">justify-content: center; /* Main axis center */</div>
          <div className="pl-4 text-emerald-300">align-items: center;     /* Cross axis center */</div>
          <div className="text-violet-400">&#125;</div>
        </div>
      </section>

      {/* SECTION 4: Interactive Lab Integration */}
      <section id="flex-lab" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-600 dark:text-violet-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>4. Full Flexbox Workbench</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Interactive Flexbox Visualizer
        </h2>
        <FlexboxLab />
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next in Track 3</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">11. CSS Grid</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            2-Dimensional grid tracks, fr units, minmax, auto-fit vs auto-fill, and grid-template-areas.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/grid"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to CSS Grid</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
