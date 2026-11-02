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
  Download,
  Zap,
  AlertTriangle,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function FontsConceptLesson() {
  const [weight, setWeight] = useState(600);
  const [width, setWidth] = useState(100);
  const [slant, setSlant] = useState(0);
  const [fontDisplayMode, setFontDisplayMode] = useState<'swap' | 'optional' | 'block'>('swap');

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 6: Typography</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-blue-600 dark:text-blue-400 font-bold">Web Fonts &amp; Variable Fonts</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10 dark:from-blue-500/15 dark:via-slate-950 dark:to-blue-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-500/30">
              <Zap className="h-3.5 w-3.5" />
              Typography · Track 6 Capstone
            </span>
            <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
              Core Concept 24
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Web Fonts, @font-face &amp; Variable Fonts
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Eliminate web font performance penalties. Master <code className="text-blue-500 font-mono">@font-face</code> loading, understand the difference between FOUT and FOIT with <code className="text-blue-500 font-mono">font-display: swap</code>, and unlock infinite weights using modern Variable Fonts.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-500" />
              Delivery Truck vs Rubber Stamp
            </a>
            <a
              href="#fout-foit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-indigo-500" />
              FOUT vs. FOIT &amp; font-display
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              Live Variable Font Studio
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: Static Font Files vs. The Variable Rubber Stamp
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="h-4 w-4 text-rose-500" />
              Legacy Static Fonts (12 Heavy Trucks)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In traditional web design, if your site used Roboto Regular, Medium, Bold, and Italic, the user's phone had to make 4 to 8 separate HTTP network requests downloading 300KB+ of static binary files.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1">
              <div>• roboto-regular.woff2 (35KB)</div>
              <div>• roboto-medium.woff2 (35KB)</div>
              <div>• roboto-bold.woff2 (35KB)</div>
              <div>• roboto-italic.woff2 (35KB)</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Modern Variable Fonts (1 Single Morphing File)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A Variable Font stores vector math curves with adjustable control points along continuous axes. One single 45KB file can render weight 100, 432, 678, or 900 without downloading a single extra byte!
            </p>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 space-y-1">
              <div>• inter-variable.woff2 (48KB)</div>
              <div>• Supports infinite continuous weights 100 → 900</div>
              <div>• Supports optical sizing, width, and slant axes</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUT vs FOIT */}
      <section id="fout-foit" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Battle for Instant Pages: FOUT vs. FOIT &amp; font-display
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 p-5 space-y-3">
            <div className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
              font-display: block (FOIT)
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Flash of Invisible Text</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The browser renders an empty blank box for up to 3 seconds while waiting for the web font. Users on slow mobile connections stare at a ghost page!
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 space-y-3">
            <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              font-display: swap (FOUT - Recommended)
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Flash of Unstyled Text</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Browser immediately renders fallback system font (Arial/Roboto). Once the custom font arrives over the network, it swaps in seamlessly. Zero blank screens!
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/10 p-5 space-y-3">
            <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              font-display: optional (Zero CLS)
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Maximum Speed &amp; No Jitter</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Browser gives the font 100ms. If it's cached, it uses it; if not, it stays on the system font forever for this page view, caching it for next time. Zero layout shifts!
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Variable Font Continuous Axes
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Weight Axis (&apos;wght&apos;)</span>
                  <span className="font-mono text-blue-500">{weight}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="25"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Width Axis (&apos;wdth&apos;)</span>
                  <span className="font-mono text-indigo-500">{width}%</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="125"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Slant Angle (&apos;slnt&apos;)</span>
                  <span className="font-mono text-cyan-500">{slant}°</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="0"
                  value={slant}
                  onChange={(e) => setSlant(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  font-display strategy
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['swap', 'optional', 'block'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFontDisplayMode(mode)}
                      className={cn(
                        'py-1.5 text-xs font-mono font-bold capitalize rounded-lg border transition-all',
                        fontDisplayMode === mode
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                @font-face &amp; Variation CSS
              </div>
              <div className="text-blue-300">
                font-variation-settings: &apos;wght&apos; {weight}, &apos;wdth&apos; {width};
              </div>
              <div className="text-indigo-300">font-display: {fontDisplayMode};</div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[380px]">
            <div className="space-y-4 text-center max-w-lg">
              <h3
                className="text-4xl sm:text-5xl text-slate-900 dark:text-white transition-all duration-150 leading-tight"
                style={{
                  fontWeight: weight,
                  fontStretch: `${width}%`,
                  transform: `skewX(${slant}deg)`,
                }}
              >
                Dynamic Variable Typography
              </h3>
              <p
                className="text-base text-slate-600 dark:text-slate-400 transition-all duration-150"
                style={{
                  fontWeight: Math.max(300, weight - 200),
                }}
              >
                Zero jumpiness. Smooth vector interpolation between razor-thin hairline and ultra-black bold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Web Fonts</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Never use uncompressed .ttf or .otf files on the web!</strong> Raw TrueType (.ttf) files are often 500KB+ each. Modern browsers universally support <code className="font-mono text-blue-500">.woff2</code> (Web Open Font Format 2), which uses Brotli compression to shrink files by over 70%!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Missing Preload Trap:</strong> Browsers do not download a web font until they parse the HTML, parse the CSS, and find an element in the DOM that actually uses the font! For your critical above-the-fold heading, add <code className="font-mono text-indigo-400">&lt;link rel=&quot;preload&quot; href=&quot;font.woff2&quot; as=&quot;font&quot; type=&quot;font/woff2&quot; crossorigin&gt;</code> in your HTML head to start downloading immediately.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Next Masterclass · Track 7 Responsive
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Responsive Design Principles &amp; Fluid Layouts
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Mobile-first mindset, fluid typography, touch targets, and embedded responsive testing studio.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/responsive"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 25</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
