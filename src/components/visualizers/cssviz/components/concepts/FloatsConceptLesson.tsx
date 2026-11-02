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
import FloatsLab from '../visualizers/FloatsLab';
import { cn } from '../../utils/cn';

export default function FloatsConceptLesson() {
  const [floatDir, setFloatDir] = useState<'left' | 'right' | 'none'>('left');
  const [hasClearfix, setHasClearfix] = useState(true);

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
          <span className="text-amber-600 dark:text-amber-400 font-bold">Floats &amp; Clearfix</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-slate-900/5 to-amber-500/10 dark:from-orange-500/15 dark:via-slate-950 dark:to-amber-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 font-mono text-xs font-bold text-orange-700 dark:text-orange-300 border border-orange-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Legacy &amp; Editorial Typography · Track 2 Capstone
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 09
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Floats &amp; Clearfix
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            The newspaper article effect. How text flows gracefully around images, why floating elements cause parent heights to collapse, and how to tame them with modern <code>display: flow-root</code>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#floats-studio"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Sliders className="h-4 w-4" />
              <span>Interactive Newspaper Wrap</span>
            </a>
            <a
              href="#floats-lab"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <FlaskConical className="h-4 w-4 text-orange-400" />
              <span>Floats Lab Workbench</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: The Newspaper Analogy */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Purpose of Floats</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Why Floats Were Invented (And Why NOT To Use Them For Layouts)
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Floats were designed for <strong>one specific job</strong>: wrapping text around an image or pull-quote in an editorial article. Before Flexbox and Grid arrived, web developers hijacked floats to build entire multi-column page layouts—leading to fragile code and countless clearfix bugs!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">✅ Use Floats For:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
              <li>Wrapping article text around an editorial photo.</li>
              <li>Floating a large decorative first-letter drop cap.</li>
              <li>Pull quotes floating to the margin of a blog post.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20 space-y-2">
            <span className="font-bold text-rose-800 dark:text-rose-300 text-sm">❌ NEVER Use Floats For:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
              <li>Building navbar layouts (Use <code>display: flex</code>).</li>
              <li>Multi-column grid cards (Use <code>display: grid</code>).</li>
              <li>Centering elements vertically (Use Flexbox/Grid).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2: The Parent Collapse & Clearfix */}
      <section id="floats-studio" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>2. The Zero-Height Parent Collapse</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Why Does the Parent Box Collapse?
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          When an element floats, it is taken out of normal block flow. If a parent container has only floated children, the parent collapses to <strong>0px height</strong> because it thinks it is empty!
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">float:</span>
              {(['left', 'right', 'none'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setFloatDir(dir)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all',
                    floatDir === dir
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {dir}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasClearfix}
                onChange={(e) => setHasClearfix(e.target.checked)}
                className="rounded"
              />
              <span>Enable Container Containment (display: flow-root)</span>
            </label>
          </div>

          {/* Live Article Wrap Container */}
          <div
            className={cn(
              'rounded-xl border-2 p-5 bg-[#0b1324] text-slate-300 text-sm leading-relaxed transition-all',
              hasClearfix ? 'border-emerald-500' : 'border-rose-500'
            )}
            style={{
              display: hasClearfix ? 'flow-root' : 'block',
            }}
          >
            {/* Floated Image Box */}
            <div
              className={cn(
                'w-36 h-28 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-3 text-slate-950 font-bold text-xs flex flex-col justify-between shadow-md transition-all',
                floatDir === 'left' && 'float-left mr-4 mb-2',
                floatDir === 'right' && 'float-right ml-4 mb-2',
                floatDir === 'none' && 'mb-4'
              )}
            >
              <span>Floated Photo</span>
              <span className="font-mono text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded text-white self-start">
                float: {floatDir}
              </span>
            </div>

            <p>
              In the heart of the CSS cosmos, elements drift through the document river. When a photo is floated to the {floatDir}, typography bends around its rectangular perimeter just like in a classic print magazine.
            </p>
            <p className="mt-2">
              Notice how text seamlessly fills the remaining inline space. Without containment, the parent border would snap above the floated image!
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            {hasClearfix
              ? '✅ Parent is properly containing the floated image with modern display: flow-root.'
              : '⚠️ Clearfix disabled! If text was short, the parent container would collapse, letting the photo spill out!'}
          </div>
        </div>
      </section>

      {/* SECTION 3: Modern Clearfix */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold">
          <Code2 className="h-4 w-4" />
          <span>3. The Modern Solution: display: flow-root</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Say Goodbye to Micro-Clearfix Hacks
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          In older tutorials, you will see messy pseudo-elements used to clear floats. Today, modern CSS has a built-in one-liner that creates a clean Block Formatting Context:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0f172a] text-slate-300 space-y-1">
            <div className="text-rose-400">/* Old Hacky Way (Avoid): */</div>
            <div>.container::after &#123;</div>
            <div className="pl-4 text-slate-400">content: &quot;&quot;;</div>
            <div className="pl-4 text-slate-400">display: table;</div>
            <div className="pl-4 text-slate-400">clear: both;</div>
            <div>&#125;</div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/40 bg-[#0f172a] text-slate-300 space-y-1">
            <div className="text-emerald-400">/* Modern Clean Standard (Use This): */</div>
            <div>.container &#123;</div>
            <div className="pl-4 text-emerald-300 font-bold">display: flow-root;</div>
            <div>&#125;</div>
            <div className="text-[11px] text-slate-500 pt-2 font-sans">
              Instantly establishes a new BFC containing all internal floats!
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Lab Integration */}
      <section id="floats-lab" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>4. Floats Lab Workbench</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Interactive Floats Lab
        </h2>
        <FloatsLab />
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Track 2 Complete! Next: Track 3</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">10. Flexbox Visualizer</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Main axis, cross axis, justify-content, align-items, flex-grow, and gap.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/flexbox"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Begin Track 3: Flexbox</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
