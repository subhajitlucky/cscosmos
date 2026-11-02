'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Code2,
  AlertTriangle,
  Layers,
  Trophy,
  ArrowRight,
  ChevronRight,
  Eye,
  Sliders,
  Check,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function IsWhereHasConceptLesson() {
  // :has() interactive playground
  const [hasAvatar, setHasAvatar] = useState(false);
  const [isInputInvalid, setIsInputInvalid] = useState(false);

  // :is vs :where specificity tab
  const [activeFunc, setActiveFunc] = useState<'is' | 'where'>('is');

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
          <span>Curriculum</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">:is(), :where(), and :has()</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/5 to-teal-500/10 dark:from-emerald-500/15 dark:via-slate-950 dark:to-teal-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Modern CSS 2026 Standards
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 04
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            :is(), :where(), and :has()
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            The modern holy grail of CSS. Style a parent container based on what&apos;s inside it with <code>:has()</code>, and tame specificity once and for all with <code>:is()</code> and zero-weight <code>:where()</code>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#has-playground"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Eye className="h-4 w-4" />
              <span>Interactive :has() Studio</span>
            </a>
            <a
              href="#is-vs-where"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <Layers className="h-4 w-4 text-emerald-500" />
              <span>:is() vs :where() Specificity</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: :has() The Parent Selector */}
      <section id="has-playground" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Holy Grail: :has()</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The Relational &quot;Parent&quot; Selector
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          For 25 years, CSS could only look downward in the DOM tree (styling children). <code>:has()</code> allows an element to style itself conditionally based on its children or sibling elements!
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setHasAvatar(!hasAvatar)}
              className={cn(
                'px-4 py-2 rounded-xl border transition-all flex items-center gap-2',
                hasAvatar
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              )}
            >
              <span>{hasAvatar ? '✓ Child .avatar Present' : '+ Add .avatar to card'}</span>
            </button>

            <button
              onClick={() => setIsInputInvalid(!isInputInvalid)}
              className={cn(
                'px-4 py-2 rounded-xl border transition-all flex items-center gap-2',
                isInputInvalid
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              )}
            >
              <span>{isInputInvalid ? '✓ Sibling input is invalid' : 'Toggle invalid input state'}</span>
            </button>
          </div>

          {/* Interactive Card Live Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Preview */}
            <div
              className={cn(
                'rounded-2xl border-2 p-6 transition-all duration-300 flex items-center gap-4',
                hasAvatar
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
              )}
            >
              {hasAvatar && (
                <div className="h-12 w-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0">
                  JD
                </div>
              )}
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  {hasAvatar ? 'VIP Profile Card (with avatar)' : 'Standard Text Card'}
                </div>
                <p className="text-xs text-slate-500">
                  {hasAvatar
                    ? 'Card automatically expanded padding and added glowing border via .card:has(.avatar)!'
                    : 'No avatar present. Card renders in compact layout.'}
                </p>
              </div>
            </div>

            {/* CSS Code Display */}
            <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-200 space-y-1">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-2">CSS in action:</div>
              <div className="text-emerald-400">.card:has(.avatar) &#123;</div>
              <div className="pl-4 text-sky-300">border-color: #10b981;</div>
              <div className="pl-4 text-sky-300">background: rgba(16, 185, 129, 0.1);</div>
              <div>&#125;</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: :is() vs :where() */}
      <section id="is-vs-where" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
          <Layers className="h-4 w-4" />
          <span>2. Specificity Transformers</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          `:is()` vs `:where()`
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Both pseudo-classes let you group multiple selectors cleanly without repeating rules. But they handle <strong>specificity</strong> completely differently:
        </p>

        {/* Comparison Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <code className="text-blue-600 dark:text-blue-400 font-bold text-base">:is(a, b, c)</code>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                Highest Specificity
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <code>:is()</code> adopts the specificity of its <strong>most specific argument</strong>!
            </p>
            <div className="rounded-xl bg-[#0f172a] p-3 text-xs font-mono text-slate-200 space-y-1">
              <div>:is(header, #main-nav, footer) a &#123;</div>
              <div className="pl-4 text-sky-300">color: blue;</div>
              <div>&#125;</div>
            </div>
            <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
              Specificity: (0, 1, 0, 1) — Because #main-nav is an ID!
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <code className="text-emerald-600 dark:text-emerald-400 font-bold text-base">:where(a, b, c)</code>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                ZERO Specificity (0, 0, 0, 0)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <code>:where()</code> contributes <strong>ZERO specificity</strong>! The arguments are completely ignored in scoring.
            </p>
            <div className="rounded-xl bg-[#0f172a] p-3 text-xs font-mono text-slate-200 space-y-1">
              <div>:where(header, #main-nav, footer) a &#123;</div>
              <div className="pl-4 text-sky-300">color: blue;</div>
              <div>&#125;</div>
            </div>
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Specificity: (0, 0, 0, 1) — Just the &apos;a&apos; tag! Even the ID counts as 0!
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 text-xs text-indigo-950 dark:text-indigo-200">
          <strong>Why does :where() matter?</strong> Component libraries and design systems use <code>:where()</code> to provide default base styles that developers can effortlessly override with a single normal class without having to fight specificity wars!
        </div>
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next Concept in Curriculum</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">5. Cascade Layers (@layer)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Explicit architecture ordering that triumphs over selector specificity.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/cascade-layers"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to Cascade Layers</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
