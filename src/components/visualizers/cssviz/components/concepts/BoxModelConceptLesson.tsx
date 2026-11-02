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
  Trophy,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import BoxModelLab from '../visualizers/BoxModelLab';
import { cn } from '../../utils/cn';

export default function BoxModelConceptLesson() {
  // Box sizing toggle
  const [boxSizing, setBoxSizing] = useState<'content-box' | 'border-box'>('border-box');
  const [contentWidth, setContentWidth] = useState(200);
  const [padding, setPadding] = useState(24);
  const [borderWidth, setBorderWidth] = useState(4);
  const [margin, setMargin] = useState(20);

  // Computed total rendered width
  const totalRenderedWidth =
    boxSizing === 'content-box'
      ? contentWidth + padding * 2 + borderWidth * 2
      : contentWidth;

  const actualContentWidth =
    boxSizing === 'content-box'
      ? contentWidth
      : Math.max(0, contentWidth - padding * 2 - borderWidth * 2);

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
          <span className="text-amber-600 dark:text-amber-400 font-bold">The Box Model</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/5 to-orange-500/10 dark:from-amber-500/15 dark:via-slate-950 dark:to-orange-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              1st Year CS Foundation · Core Track 2
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 06
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            The CSS Box Model
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            In CSS, literally everything is a rectangular box. Learn how Content, Padding, Border, and Margin fit together, and why <code>box-sizing: border-box</code> is the single most important reset in web development.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#box-sizing-comparison"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Sliders className="h-4 w-4" />
              <span>border-box vs content-box Studio</span>
            </a>
            <a
              href="#box-visualizer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <FlaskConical className="h-4 w-4 text-orange-400" />
              <span>Interactive Box Visualizer</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: The Framed Painting Analogy */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Mental Model</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The Framed Painting Analogy
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Think of every HTML element as an art piece hanging on a gallery wall:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 space-y-2">
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-sm">1. Content</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>The Painting Canvas.</strong> Your text, image, or video lives here. Dimensions controlled by <code>width</code> and <code>height</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">2. Padding</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>The Cardboard Mat.</strong> Breathing room <em>inside</em> the frame. Still colored by your element&apos;s <code>background-color</code>!
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 space-y-2">
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-sm">3. Border</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>The Wooden Picture Frame.</strong> Wraps right around the padding edge with color, thickness, and style.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 space-y-2">
            <span className="font-mono text-rose-600 dark:text-rose-400 font-bold text-sm">4. Margin</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>The Empty Wall Space.</strong> Invisible buffer pushing other paintings away. Never shows the background color!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: content-box vs border-box */}
      <section id="box-sizing-comparison" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>2. The Great Math Battle</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          `box-sizing: border-box` vs `content-box`
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Toggle between the two box sizing models below. Notice how in <code>content-box</code>, adding padding makes your element expand and break responsive grids!
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Box Sizing:</span>
              <button
                onClick={() => setBoxSizing('border-box')}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all',
                  boxSizing === 'border-box'
                    ? 'bg-amber-600 text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}
              >
                border-box (Modern Standard)
              </button>
              <button
                onClick={() => setBoxSizing('content-box')}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all',
                  boxSizing === 'content-box'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}
              >
                content-box (Legacy Default)
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-mono">Set Width: {contentWidth}px</label>
              <input
                type="range"
                min="140"
                max="320"
                value={contentWidth}
                onChange={(e) => setContentWidth(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-mono">Padding: {padding}px</label>
              <input
                type="range"
                min="0"
                max="40"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-mono">Border: {borderWidth}px</label>
              <input
                type="range"
                min="0"
                max="12"
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-mono">Margin: {margin}px</label>
              <input
                type="range"
                min="0"
                max="30"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          {/* Live Visual Box Model Display */}
          <div className="rounded-xl bg-[#0b1324] p-6 flex flex-col items-center justify-center gap-4">
            <div
              className="transition-all duration-200 border-2 border-dashed border-rose-500/50 bg-rose-500/10"
              style={{
                padding: `${margin}px`,
              }}
            >
              <div className="text-[10px] font-mono text-rose-400 mb-1 text-center">margin: {margin}px</div>
              <div
                className="transition-all duration-200 border-solid border-amber-400 bg-emerald-500/20 text-center"
                style={{
                  borderWidth: `${borderWidth}px`,
                  padding: `${padding}px`,
                  width: `${contentWidth}px`,
                  boxSizing: boxSizing,
                }}
              >
                <div className="text-[10px] font-mono text-emerald-400">padding: {padding}px</div>
                <div className="p-2 rounded bg-blue-500/30 text-blue-300 font-mono text-xs font-bold mt-1">
                  Content ({actualContentWidth}px)
                </div>
              </div>
            </div>

            {/* Readout */}
            <div className="text-center font-mono text-xs space-y-1">
              <div className="text-slate-300">
                CSS <code>width</code> set to: <strong>{contentWidth}px</strong>
              </div>
              <div className="text-amber-400 font-bold text-sm">
                Total Rendered Screen Width: {totalRenderedWidth}px
              </div>
              <div className="text-slate-400 text-[11px]">
                {boxSizing === 'content-box'
                  ? `Expanded! (Width ${contentWidth} + Padding ${padding * 2} + Border ${borderWidth * 2} = ${totalRenderedWidth}px)`
                  : `Locked! The padding is absorbed inside your ${contentWidth}px constraint.`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Margin Collapsing */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <AlertTriangle className="h-4 w-4" />
          <span>3. Margin Collapsing (The Weirdest CSS Quirk)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Why 20px + 30px = 30px (Not 50px!)
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            When two vertical block elements touch each other, their top and bottom margins <strong>collapse into a single margin</strong> equal to the larger of the two values.
          </p>
          <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-300 space-y-1">
            <div>h1 &#123; margin-bottom: 30px; &#125;</div>
            <div>p  &#123; margin-top: 20px; &#125;</div>
            <div className="pt-2 text-amber-400">
              /* The gap between h1 and p on screen is 30px, NOT 50px! */
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Note: Horizontal margins never collapse! Flexbox and Grid items also never collapse margins.
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Lab Integration */}
      <section id="box-visualizer" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>4. Hands-on Box Model Workbench</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Interactive Box Studio
        </h2>
        <BoxModelLab />
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next in Track 2</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">7. Display Modes</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            block, inline, inline-block, none, and modern flow-root formatting contexts.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/display"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to Display Modes</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
