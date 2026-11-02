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
import MultiColumnLab from '../visualizers/MultiColumnLab';
import { cn } from '../../utils/cn';

export default function MultiColumnConceptLesson() {
  const [colCount, setColCount] = useState(3);
  const [colGap, setColGap] = useState(24);

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
          <span className="text-amber-600 dark:text-amber-400 font-bold">Multi-Column Layout</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 via-slate-900/5 to-purple-500/10 dark:from-fuchsia-500/15 dark:via-slate-950 dark:to-purple-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/20 px-3 py-1 font-mono text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Editorial Flow · Track 3 Capstone
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 13
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Multi-Column Layout
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            Pour text like water through magazine columns. Learn <code>column-count</code>, <code>column-width</code>, decorative <code>column-rule</code> dividers, and spanning headlines.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#multicolumn-lab"
              className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <FlaskConical className="h-4 w-4" />
              <span>Multi-Column Visualizer Lab</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactive Lab Integration */}
      <section id="multicolumn-lab" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>Interactive Editorial Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Magazine Text Flow Lab
        </h2>
        <MultiColumnLab />
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Track 3 Complete! Next: Track 4</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">14. CSS Units (px, rem, vh, ch)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Absolute vs Relative units, accessible rem root scaling, and viewport units.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/units"
          className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Begin Track 4: CSS Units</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
