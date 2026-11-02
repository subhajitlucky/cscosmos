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
  Boxes,
  Layers,
  Component,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function CssArchitectureConceptLesson() {
  const [modifier, setModifier] = useState<'default' | 'primary' | 'danger'>('primary');
  const [hasBadge, setHasBadge] = useState(true);

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 9: Engine Internals</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">CSS Architecture</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 dark:from-indigo-500/15 dark:via-slate-950 dark:to-indigo-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
              <Boxes className="h-3.5 w-3.5" />
              Architecture &amp; Scale · Track 9
            </span>
            <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-3 py-1 font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
              Core Concept 37
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Architecture: BEM, OOCSS &amp; CSS Modules
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Stop global CSS from polluting your entire project. Master <strong className="text-indigo-500 font-semibold">BEM (Block Element Modifier)</strong>, understand why keeping all selectors at flat specificity (0, 1, 0) prevents style wars, and compare CSS Modules with modern Utility-First CSS.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
              Lego Bricks vs Tangled Yarn
            </a>
            <a
              href="#bem-anatomy"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-500" />
              The BEM Naming Convention
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              Live BEM Component Studio
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: Modular Lego Bricks vs. The Tangled Yarn
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 p-6 space-y-3">
            <h3 className="font-bold text-rose-600 dark:text-rose-400 text-sm">
              The Tangled Ball of Global Yarn (No Architecture)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Writing generic selectors like <code className="font-mono text-rose-500">.title</code> or deep nesting like <code className="font-mono">.sidebar div ul li a span</code>. Six months later, nobody dares touch the CSS because modifying one class unintentionally breaks twelve other pages!
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-3">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              Modular Lego Bricks (BEM / Scoped Architecture)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every component is an independent, encapsulated island. All styles are scoped strictly to the component.
              You can safely delete or refactor a component without fearing accidental collateral damage anywhere else!
            </p>
          </div>
        </div>
      </section>

      {/* BEM Anatomy */}
      <section id="bem-anatomy" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Component className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The BEM Naming Convention: Block, Element, Modifier
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                1. Block (.card)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                The top-level container component. Standalone and reusable anywhere on the site.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                2. Element (.card__title)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                A child part inside the block separated by double underscores (<code className="font-mono">__</code>). Tied to the block.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                3. Modifier (.card--featured)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                A visual variation or state separated by double dashes (<code className="font-mono">--</code>).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live BEM Component Builder
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Block Modifier State
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['default', 'primary', 'danger'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setModifier(m)}
                    className={cn(
                      'py-2 text-xs font-mono font-bold capitalize rounded-lg border transition-all',
                      modifier === m
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    --{m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>Include Element: .card__badge</span>
                <input
                  type="checkbox"
                  checked={hasBadge}
                  onChange={(e) => setHasBadge(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                HTML with BEM Classes
              </div>
              <div className="text-indigo-300 break-all">
                &lt;div class=&quot;card card--{modifier}&quot;&gt;
                <br />
                &nbsp;&nbsp;&lt;h4 class=&quot;card__title&quot;&gt;BEM Component&lt;/h4&gt;
                <br />
                {hasBadge && (
                  <>
                    &nbsp;&nbsp;&lt;span class=&quot;card__badge&quot;&gt;Active&lt;/span&gt;
                    <br />
                  </>
                )}
                &lt;/div&gt;
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[340px]">
            <div
              className={cn(
                'w-72 rounded-2xl p-6 space-y-3 shadow-lg transition-all duration-200 border',
                modifier === 'default' && 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700',
                modifier === 'primary' && 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20',
                modifier === 'danger' && 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs opacity-75">.card--{modifier}</span>
                {hasBadge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 font-bold">
                    .card__badge
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold">.card__title</h4>
              <p className="text-xs opacity-80">
                Notice: Flat selector specificity (0, 1, 0) guarantees zero specificity overrides!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: CSS Architecture</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The Grandchild BEM Anti-Pattern:</strong> Never write <code className="font-mono text-rose-500">.card__header__title__icon</code>! Elements should always be direct children of the block in class naming: <code className="font-mono text-emerald-400">.card__icon</code>, regardless of how deep the HTML DOM tree nests.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>Overusing !important to Patch Specificity:</strong> When you start using <code className="font-mono">!important</code> to fix CSS bugs, you are writing an IOU against your future sanity. When another developer also needs to override your rule, they will have to write even higher specificity or chain multiple <code className="font-mono">!important</code> flags!
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            CSS Debugging Tools &amp; DevTools Mastery
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Inspect computed styles, force hover pseudo-states, visualize CSS Grid overlays, and audit layout shifts.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/debugging"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 38</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
