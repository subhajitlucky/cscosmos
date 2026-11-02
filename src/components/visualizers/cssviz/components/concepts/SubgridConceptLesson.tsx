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
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SubgridConceptLesson() {
  const [subgridEnabled, setSubgridEnabled] = useState(true);

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
          <span className="text-amber-600 dark:text-amber-400 font-bold">CSS Subgrid</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-slate-900/5 to-pink-500/10 dark:from-rose-500/15 dark:via-slate-950 dark:to-pink-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 font-mono text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Advanced Grid Alignment
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 12
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Subgrid
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            Never suffer from misaligned card buttons again. <code>grid-template-rows: subgrid</code> allows nested child components to participate directly in their parent grid tracks.
          </p>
        </div>
      </div>

      {/* SECTION 1: The Misaligned Card Problem */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Problem Subgrid Solves</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The Misaligned Card Nightmare
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Imagine 3 pricing cards side-by-side. Card 1 has a 1-line title, but Card 2 has a 3-line title. In regular CSS, each card handles its own layout, causing the buttons at the bottom to sit at staggered heights!
        </p>

        {/* Live Subgrid Toggle Simulator */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSubgridEnabled(!subgridEnabled)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2',
                subgridEnabled
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              )}
            >
              <span>{subgridEnabled ? '✓ Subgrid Active (Aligned Rows)' : 'Subgrid Off (Misaligned)'}</span>
            </button>
          </div>

          {/* 3 Cards Live Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Starter',
                desc: 'Essential tools for students getting started.',
                price: '$0/mo',
              },
              {
                title: 'Professional Growth & Enterprise Multi-Branch Bundle',
                desc: 'Advanced clustering, dedicated GPU engines, and unlimited cloud storage.',
                price: '$49/mo',
              },
              {
                title: 'Team Pro',
                desc: 'Collaborate with team members.',
                price: '$19/mo',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={cn(
                  'rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 flex flex-col',
                  subgridEnabled ? 'justify-between' : 'justify-start'
                )}
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base min-h-[48px]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">{card.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{card.price}</span>
                  <button className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold">
                    Choose
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Code Snippet */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
          <Code2 className="h-4 w-4" />
          <span>2. The Syntax</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          How to Declare a Subgrid
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0f172a] p-5 font-mono text-xs text-slate-200 space-y-2">
          <div className="text-slate-400">/* 1. Parent defines explicit rows */</div>
          <div className="text-rose-400">.pricing-grid &#123;</div>
          <div className="pl-4 text-emerald-300">display: grid;</div>
          <div className="pl-4 text-emerald-300">grid-template-columns: repeat(3, 1fr);</div>
          <div className="pl-4 text-emerald-300">grid-template-rows: auto 1fr auto;</div>
          <div className="text-rose-400">&#125;</div>
          <div className="pt-2 text-slate-400">/* 2. Child card inherits row tracks! */</div>
          <div className="text-rose-400">.card &#123;</div>
          <div className="pl-4 text-amber-300">grid-row: span 3; /* Spans all 3 parent rows */</div>
          <div className="pl-4 text-amber-300">display: grid;</div>
          <div className="pl-4 text-amber-300 font-bold">grid-template-rows: subgrid; /* Inherits! */</div>
          <div className="text-rose-400">&#125;</div>
        </div>
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next in Track 3</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">13. Multi-Column Layout</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            column-count, column-width, column-gap, and spanning headlines.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/multicolumn"
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to Multi-Column</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
