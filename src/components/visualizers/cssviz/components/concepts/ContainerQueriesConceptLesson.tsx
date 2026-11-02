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
  Box,
  LayoutGrid,
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
  Columns,
} from 'lucide-react';
import ContainerQueriesLab from '../visualizers/ContainerQueriesLab';
import { cn } from '../../utils/cn';

export default function ContainerQueriesConceptLesson() {
  const [containerWidth, setContainerWidth] = useState(480);

  const isWideContainer = containerWidth >= 420;

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
          <span>Track 7: Responsive Architecture</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Container Queries (@container)</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-500/15 dark:via-slate-950 dark:to-emerald-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Box className="h-3.5 w-3.5" />
              Responsive Architecture · Track 7
            </span>
            <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-1 font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
              Core Concept 27
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Container Queries: The Component Holy Grail
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            The biggest CSS breakthrough in 15 years. Instead of asking how wide the global browser window is, components can now inspect their <strong className="text-emerald-500 font-semibold">immediate parent container</strong>, allowing one single card component to thrive anywhere in your design system!
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
              The Sidebar Card Dilemma
            </a>
            <a
              href="#syntax-steps"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-teal-500" />
              The 2-Step Container Syntax
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              Live Parent Resizer Lab
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
            1. The Problem: The Sidebar Card Nightmare
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 p-6 space-y-3">
            <div className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
              The Flaw with Viewport Media Queries (@media)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Suppose you are on a 1920px widescreen monitor. Your page has a narrow 280px sidebar.
              If you put a card in that sidebar, the media query sees 1920px and says: <em>&quot;Great, render wide desktop layout with 3 horizontal columns!&quot;</em>.
              The card is crushed to death and overflows the sidebar!
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-3">
            <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              The Solution: Container Queries (@container)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              With container queries, the card doesn&apos;t care what device the user is holding. It asks its parent box:
              <em>&quot;Do I have 400px of space right here?&quot;</em> If yes, expand horizontally. If placed in a 280px sidebar, stack vertically. True component independence!
            </p>
          </div>
        </div>
      </section>

      {/* 2-Step Container Syntax */}
      <section id="syntax-steps" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The 2-Step Implementation Recipe
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs sm:text-sm text-emerald-300 space-y-3 overflow-x-auto">
            <div className="text-slate-400 font-sans font-bold">
              /* Step 1: Tell the browser the parent is a measurement container */
            </div>
            <div>.parent-container &#123;</div>
            <div className="pl-4 text-emerald-400">container-type: inline-size;</div>
            <div className="pl-4 text-slate-500">container-name: cardContainer; /* optional */</div>
            <div>&#125;</div>

            <div className="text-slate-400 font-sans font-bold pt-2">
              /* Step 2: Query the parent container directly! */
            </div>
            <div>@container (min-width: 420px) &#123;</div>
            <div className="pl-4">.user-card &#123;</div>
            <div className="pl-8 text-cyan-300">display: flex;</div>
            <div className="pl-8 text-cyan-300">flex-direction: row;</div>
            <div className="pl-4">&#125;</div>
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
            3. Interactive Studio: Drag to Resize the Parent Container
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Parent Container Width</span>
                <span className="font-mono text-emerald-500">{containerWidth}px</span>
              </div>
              <input
                type="range"
                min="240"
                max="650"
                value={containerWidth}
                onChange={(e) => setContainerWidth(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>240px (Sidebar)</span>
                <span>Breakpoint: 420px</span>
                <span>650px (Main Body)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                Current Component Layout State
              </div>
              <div className={isWideContainer ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {isWideContainer
                  ? '✓ @container (min-width: 420px) matched! Horizontal Flex Layout.'
                  : '— Container < 420px: Compact Vertical Stack Layout.'}
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-6 flex flex-col items-center justify-center min-h-[340px]">
            {/* The Resizable Container */}
            <div
              className="transition-all duration-200 border-2 border-dashed border-emerald-500/60 rounded-3xl p-4 bg-white/50 dark:bg-slate-900/50"
              style={{ width: `${containerWidth}px` }}
            >
              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mb-2 font-bold flex justify-between">
                <span>container-type: inline-size</span>
                <span>{containerWidth}px</span>
              </div>

              {/* The Autonomous Component */}
              <div
                className={cn(
                  'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all',
                  isWideContainer ? 'flex items-center gap-4' : 'flex flex-col items-start gap-3'
                )}
              >
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  CSS
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Smart Responsive Widget</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isWideContainer
                      ? 'Wide container unlocked! Avatar and text sit side by side.'
                      : 'Narrow container detected! Stacked layout for compact spaces.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Visualizer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <FlaskConical className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            4. Deep Visualizer: Container Query Interactive Lab
          </h2>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-950/50 p-4 sm:p-6 shadow-inner">
          <ContainerQueriesLab />
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Container Queries</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Always use <code className="font-mono">inline-size</code>, not <code className="font-mono">size</code>:</strong> <code className="font-mono">container-type: size</code> requires the browser to calculate both width AND height upfront. If your container doesn&apos;t have an explicit height, it collapses to 0px! <code className="font-mono text-emerald-500">container-type: inline-size</code> looks only at width and is what you want in 99% of web apps.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>A container cannot style itself via @container:</strong> An element with <code className="font-mono">container-type</code> cannot query itself inside <code className="font-mono">@container</code> (to prevent infinite layout recursion loops). Only its children can query it!
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Accessibility in CSS (WCAG, Focus, High Contrast)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Master :focus-visible, accessible color contrast ratios (4.5:1), and screen-reader .sr-only patterns.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/css-a11y"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 28</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
