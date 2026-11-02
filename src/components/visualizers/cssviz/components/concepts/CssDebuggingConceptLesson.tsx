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
  Bug,
  Search,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function CssDebuggingConceptLesson() {
  const [enablePadding, setEnablePadding] = useState(true);
  const [enableBg, setEnableBg] = useState(true);
  const [enableBorder, setEnableBorder] = useState(false);
  const [forceHover, setForceHover] = useState(false);

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
          <span>Track 9: Engine Internals</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">DevTools Debugging</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 dark:from-amber-500/15 dark:via-slate-950 dark:to-amber-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Bug className="h-3.5 w-3.5" />
              DevTools Mastery · Track 9
            </span>
            <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 font-mono text-xs font-bold text-orange-700 dark:text-orange-300">
              Core Concept 38
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Debugging Tools &amp; DevTools Mastery
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Stop guessing and adding random margins. Learn how browser DevTools exposes the exact reasons rules are overridden, how to pin pseudo-states like <code className="text-amber-500 font-mono">:hover</code>, inspect Computed layout dimensions, and use the emergency universal outline trick.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
            >
              <Stethoscope className="h-3.5 w-3.5 text-amber-500" />
              The Medical X-Ray Model
            </a>
            <a
              href="#superpowers"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
            >
              <Search className="h-3.5 w-3.5 text-orange-500" />
              The 5 DevTools Superpowers
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-yellow-500" />
              Simulated DevTools Inspector
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Stethoscope className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: The Doctor&apos;s X-Ray vs. Wild Guesswork
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            When a patient is sick, a doctor doesn&apos;t perform surgery blindfolded; they take an X-ray to diagnose the exact bone fracture.
            Similarly, in web development, you should never guess why an element has a gap: press <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">F12</kbd> (or <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">Cmd+Option+I</kbd>) and let Chrome DevTools show you the truth!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Strikethrough Line</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                A crossed-out rule means another rule won the cascade or specificity battle.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Computed Tab</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Resolves all relative units (<code className="font-mono">rem</code>, <code className="font-mono">%</code>, <code className="font-mono">auto</code>) into concrete pixel values.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Force State (:hov)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Locks pseudo-classes like <code className="font-mono">:hover</code> permanently active on screen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Superpowers */}
      <section id="superpowers" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Search className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Nuclear Debugging Trick: The Universal Red Outline
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Ever had an invisible rogue element cause unwanted horizontal scrolling on a mobile phone?
            Instead of searching through 2,000 lines of CSS, paste this one nuclear line into your DevTools console or stylesheet:
          </p>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs sm:text-sm text-amber-300 space-y-1 overflow-x-auto">
            <div>* &#123; outline: 1px solid red !important; &#125;</div>
          </div>
          <p className="text-xs text-slate-500">
            Why <code className="font-mono">outline</code> instead of <code className="font-mono">border</code>? Because outlines take up <strong>zero space</strong> in the DOM geometry! A 1px border would add 2px to every single box, breaking the entire page layout.
          </p>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Simulated Browser DevTools Inspector
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Simulated DevTools Panel */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white p-5 font-mono text-xs space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-400 font-sans font-bold">DevTools · Styles Panel</span>
              <button
                onClick={() => setForceHover(!forceHover)}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] font-sans font-bold transition-all',
                  forceHover ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                )}
              >
                :hov {forceHover && '(:hover locked)'}
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-slate-400">.btn-primary &#123;</div>
              <div className="pl-4 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={enableBg}
                    onChange={(e) => setEnableBg(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>background: #f59e0b;</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={enablePadding}
                    onChange={(e) => setEnablePadding(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>padding: 12px 24px;</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={enableBorder}
                    onChange={(e) => setEnableBorder(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>border: 2px dashed #06b6d4;</span>
                </label>
              </div>
              <div className="text-slate-400">&#125;</div>
            </div>

            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-500 font-sans">
              Tip: Toggling checkboxes simulates enabling/disabling declarations in the browser live!
            </div>
          </div>

          {/* Rendered Live Preview Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[300px]">
            <button
              className={cn(
                'rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg',
                enableBg ? 'bg-amber-500 text-slate-950' : 'bg-transparent text-slate-900 dark:text-white',
                enablePadding ? 'px-6 py-3' : 'px-2 py-1',
                enableBorder && 'border-2 border-dashed border-cyan-500',
                forceHover && 'scale-110 shadow-amber-500/30'
              )}
            >
              Interactive Target Button
            </button>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: DevTools</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The &quot;Forgot to Save&quot; Disaster:</strong> DevTools lets you edit CSS live in the browser, but refreshing the page instantly wipes all your changes! Once you achieve the desired layout in DevTools, right-click the rule, select &quot;Copy rule&quot;, and paste it directly into your source code file.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Mystery User Agent Stylesheet:</strong> Sometimes an element has weird default margins or padding you never wrote. DevTools marks these as &quot;user agent stylesheet&quot; (the browser&apos;s internal default CSS). A CSS reset like <code className="font-mono text-amber-500">* &#123; margin: 0; box-sizing: border-box; &#125;</code> neutralizes them.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Next Masterclass · Houdini APIs
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            CSS Houdini Paint API: Custom Canvas Worklets
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Directly hook into the browser&apos;s paint stage to generate dynamic backgrounds with paint().
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/houdini-paint"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 39</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
