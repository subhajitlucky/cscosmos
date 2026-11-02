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
  Compass,
} from 'lucide-react';
import PositioningLab from '../visualizers/PositioningLab';
import { cn } from '../../utils/cn';

export default function PositioningConceptLesson() {
  const [activePos, setActivePos] = useState<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>('relative');
  const [topOffset, setTopOffset] = useState(20);
  const [leftOffset, setLeftOffset] = useState(40);

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
          <span>Track 2: Geometry</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">Positioning</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-slate-900/5 to-blue-500/10 dark:from-sky-500/15 dark:via-slate-950 dark:to-blue-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-1 font-mono text-xs font-bold text-sky-700 dark:text-sky-300 border border-sky-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              1st Year CS Foundation · Core Track 2
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 08
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Positioning
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            Escape the normal document flow. Master <code>static</code>, <code>relative</code>, <code>absolute</code>, <code>fixed</code>, <code>sticky</code>, and the 3D stacking context of <code>z-index</code>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#positioning-sandbox"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Compass className="h-4 w-4" />
              <span>Interactive Positioning Studio</span>
            </a>
            <a
              href="#positioning-lab"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <FlaskConical className="h-4 w-4 text-sky-400" />
              <span>Visualizer Lab</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: The 5 Positioning Modes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The 5 Positioning Modes</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Where Do Elements Anchor?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <code className="text-slate-900 dark:text-white font-bold text-sm">static</code>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>The Default.</strong> Natural document flow. <code>top</code>, <code>left</code>, and <code>z-index</code> are completely ignored!
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/20 space-y-2">
            <code className="text-blue-600 dark:text-blue-400 font-bold text-sm">relative</code>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>The Ghost Footprint.</strong> Shifts from where it would have been, but leaves its space reserved. Also acts as anchor for absolute children!
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/20 space-y-2">
            <code className="text-amber-600 dark:text-amber-400 font-bold text-sm">absolute</code>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Ripped from Flow.</strong> Takes zero space. Teleports relative to its closest non-static ancestor (usually a <code>position: relative</code> parent).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 space-y-2">
            <code className="text-purple-600 dark:text-purple-400 font-bold text-sm">fixed</code>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Glued to Viewport.</strong> Anchored to the browser screen glass. Never moves, even when user scrolls (e.g. sticky headers, back-to-top buttons).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
            <code className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">sticky</code>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>The Hybrid.</strong> Behaves like <code>relative</code> until scroll threshold (e.g. <code>top: 0</code>) is reached, then sticks like <code>fixed</code>!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Interactive Sandbox */}
      <section id="positioning-sandbox" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>2. Live Positioning Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Inspect Relative vs Absolute Movement
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Position Mode:</span>
            {(['static', 'relative', 'absolute', 'fixed', 'sticky'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setActivePos(pos)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all',
                  activePos === pos
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Offsets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-mono">top: {topOffset}px</label>
              <input
                type="range"
                min="0"
                max="80"
                value={topOffset}
                onChange={(e) => setTopOffset(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-mono">left: {leftOffset}px</label>
              <input
                type="range"
                min="0"
                max="120"
                value={leftOffset}
                onChange={(e) => setLeftOffset(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>
          </div>

          {/* Canvas */}
          <div className="relative h-48 rounded-xl bg-[#0b1324] p-4 border border-slate-800 overflow-hidden">
            <div className="text-[10px] font-mono text-slate-500">
              Container (position: relative, overflow: hidden)
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Sibling Element A (occupies flow space)
            </div>

            {/* Target Box */}
            <div
              className="rounded-lg bg-sky-500 border border-sky-400 text-slate-950 font-mono text-xs font-bold p-3 shadow-lg transition-all"
              style={{
                position: activePos,
                top: activePos !== 'static' ? `${topOffset}px` : undefined,
                left: activePos !== 'static' ? `${leftOffset}px` : undefined,
                width: '180px',
              }}
            >
              position: {activePos}
              <div className="text-[10px] font-normal text-slate-900">
                top: {topOffset}px, left: {leftOffset}px
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-400">
              Sibling Element B (notice how it moves when Target is absolute!)
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: The Golden Pair: Parent Relative, Child Absolute */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
          <Code2 className="h-4 w-4" />
          <span>3. The Most Common Real-World Pattern</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The Parent `relative` + Child `absolute` Pattern
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          How do you place a badge on the top-right corner of a card? Or a close icon on a modal dialog?
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0f172a] p-5 font-mono text-xs text-slate-200 space-y-2">
          <div className="text-slate-400">/* 1. Set parent container to position: relative */</div>
          <div className="text-sky-400">.card &#123;</div>
          <div className="pl-4 text-emerald-300">position: relative; /* Becomes anchor point! */</div>
          <div className="text-sky-400">&#125;</div>
          <div className="pt-2 text-slate-400">/* 2. Pin child to the top-right corner */</div>
          <div className="text-sky-400">.card__badge &#123;</div>
          <div className="pl-4 text-amber-300">position: absolute;</div>
          <div className="pl-4 text-amber-300">top: 12px;</div>
          <div className="pl-4 text-amber-300">right: 12px;</div>
          <div className="text-sky-400">&#125;</div>
        </div>
      </section>

      {/* SECTION 4: Interactive Lab Integration */}
      <section id="positioning-lab" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>4. Hands-on Positioning Workbench</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Full Positioning Visualizer
        </h2>
        <PositioningLab />
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next in Track 2</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">9. Floats &amp; Clearfix</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Text wrapping around images, clearfix micro-hacks, and Block Formatting Contexts.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/floats"
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to Floats</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
