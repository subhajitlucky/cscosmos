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
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Sliders,
  Scale,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function CascadeLayersConceptLesson() {
  // Layer ordering state for simulation
  const [layersOrder, setLayersOrder] = useState<'reset-first' | 'components-first'>('reset-first');

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
          <span className="text-amber-600 dark:text-amber-400 font-bold">Cascade Layers (@layer)</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-slate-900/5 to-cyan-500/10 dark:from-indigo-500/15 dark:via-slate-950 dark:to-cyan-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Modern CSS Architecture
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 05 (Cap of Track 1)
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Cascade Layers (@layer)
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            Tired of CSS specificity wars? <code>@layer</code> lets you define explicit priority tiers for your styles. An ID inside an earlier layer will be defeated by a simple class in a later layer!
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#layer-simulator"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Sliders className="h-4 w-4" />
              <span>Interactive Layer Simulator</span>
            </a>
            <a
              href="#unlayered-rule"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <Scale className="h-4 w-4 text-cyan-400" />
              <span>The Unlayered Golden Rule</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Why @layer Exists */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Problem @layer Solves</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Killing Specificity Wars in Modern Codebases
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Imagine you import a third-party UI library. It styled a button with <code>button.btn.btn-primary.large</code> (specificity 0,0,3,1). To change its color in your app, you previously had to write an even uglier selector or use <code>!important</code>.
        </p>

        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            With @layer: Order Beats Specificity!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            By declaring layers, the browser checks <strong>which layer came later</strong> before it ever looks at selector specificity!
          </p>
          <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-200 space-y-1">
            <div className="text-amber-400">@layer framework, my-app;</div>
            <div className="pt-2 text-slate-400">/* Framework has 3 classes + 1 ID: */</div>
            <div>@layer framework &#123; #nav .btn.primary &#123; color: red; &#125; &#125;</div>
            <div className="pt-2 text-slate-400">/* Your app has just 1 simple class: */</div>
            <div className="text-emerald-400">@layer my-app &#123; .btn &#123; color: blue; &#125; &#125;</div>
            <div className="pt-2 text-emerald-300">/* RESULT: BLUE WINS! Because &apos;my-app&apos; layer comes after &apos;framework&apos;! */</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Interactive Layer Order Simulator */}
      <section id="layer-simulator" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>2. Live Layer Precedence Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Swap Layer Order &amp; Watch the Winner Change
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Notice how the winning background color is completely dictated by the <code>@layer</code> declaration at the top:
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Order Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Declared Layer Order:</span>
            <button
              onClick={() => setLayersOrder('reset-first')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all',
                layersOrder === 'reset-first'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              )}
            >
              @layer base, components;
            </button>
            <button
              onClick={() => setLayersOrder('components-first')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all',
                layersOrder === 'components-first'
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              )}
            >
              @layer components, base;
            </button>
          </div>

          {/* Live Preview Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-3">
              <button
                className={cn(
                  'px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all',
                  layersOrder === 'reset-first' ? 'bg-indigo-600' : 'bg-cyan-600'
                )}
              >
                Rendered Button
              </button>
              <div className="text-xs font-mono text-slate-500">
                Winning Layer: {layersOrder === 'reset-first' ? 'components (Indigo)' : 'base (Cyan)'}
              </div>
            </div>

            <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-200 space-y-2">
              <div className="text-amber-400">
                {layersOrder === 'reset-first' ? '@layer base, components;' : '@layer components, base;'}
              </div>
              <div className="text-slate-400">
                @layer base &#123; button &#123; background: #06b6d4; &#125; &#125;
              </div>
              <div className="text-slate-400">
                @layer components &#123; button &#123; background: #4f46e5; &#125; &#125;
              </div>
              <div className="text-emerald-400 pt-2">
                Winner: {layersOrder === 'reset-first' ? 'components layer is last' : 'base layer is last'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: The Unlayered Rule */}
      <section id="unlayered-rule" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
          <Scale className="h-4 w-4" />
          <span>3. The Unlayered Styles Rule</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Unlayered Styles ALWAYS Win!
        </h2>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 p-6 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                What happens to normal CSS written outside of any @layer block?
              </p>
              <p>
                Styles written outside of any layer are called <strong>unlayered styles</strong>. In the CSS cascade specification, <strong>unlayered styles sit at the very top of the priority ladder</strong>! They will seamlessly override any layered style.
              </p>
              <div className="font-mono bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                /* Inside layer: */
                <br />
                @layer theme &#123; h1 &#123; color: purple; &#125; &#125;
                <br /><br />
                /* Outside layer: */
                <br />
                h1 &#123; color: black; &#125; /* BLACK WINS! Unlayered styles have higher priority. */
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Track 1 Complete! Next: Track 2</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">6. The Box Model &amp; Geometry</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Content, padding, border, margin, box-sizing: border-box, and margin collapsing.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/box-model"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Begin Track 2: Box Model</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
