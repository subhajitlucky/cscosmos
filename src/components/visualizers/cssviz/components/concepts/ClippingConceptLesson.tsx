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
  Scissors,
  Shapes,
  AlertTriangle,
  Layers,
  Sparkle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

type ShapePreset = 'circle' | 'polygon-star' | 'polygon-hex' | 'polygon-chevron' | 'inset-card';

export default function ClippingConceptLesson() {
  const [activeShape, setActiveShape] = useState<ShapePreset>('polygon-hex');
  const [insetRadius, setInsetRadius] = useState(24);

  let clipPathStyle = '';
  if (activeShape === 'circle') {
    clipPathStyle = 'circle(50% at 50% 50%)';
  } else if (activeShape === 'polygon-star') {
    clipPathStyle =
      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
  } else if (activeShape === 'polygon-hex') {
    clipPathStyle = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
  } else if (activeShape === 'polygon-chevron') {
    clipPathStyle = 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)';
  } else {
    clipPathStyle = `inset(10% 10% 10% 10% round ${insetRadius}px)`;
  }

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 5: Visual Styling</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-teal-600 dark:text-teal-400 font-bold">Clip-Path &amp; Masking</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-emerald-500/10 dark:from-teal-500/15 dark:via-slate-950 dark:to-teal-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 font-mono text-xs font-bold text-teal-700 dark:text-teal-300 border border-teal-500/30">
              <Scissors className="h-3.5 w-3.5" />
              Visual Styling · Track 5 Capstone
            </span>
            <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
              Core Concept 22
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Clip-Path, Shapes &amp; CSS Masking
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Break free from rectangular boxes. Learn how <code className="text-teal-500 font-mono">clip-path</code> cuts elements like a laser stencil, how to animate morphing polygon shapes, and how <code className="text-teal-500 font-mono">mask-image</code> creates smooth gradient fade-outs.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#cookie-cutter"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-teal-500" />
              Cookie Cutter Mental Model
            </a>
            <a
              href="#clipping-vs-masking"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-cyan-500" />
              clip-path vs. mask-image
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-emerald-500" />
              Interactive Shape Cutter
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="cookie-cutter" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: The Cookie Dough Cutter
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Every element in HTML begins life as a flat sheet of cookie dough (a rectangle).
            When you apply <code className="font-mono text-teal-500">clip-path</code>, a metal shape stamp presses down into the dough.
            Everything inside the outline remains visible; everything outside the stamp is instantly discarded into the void.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">No Hit Testing Outside</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Unlike <code className="font-mono">opacity: 0</code>, clipped-away areas do NOT block clicks. Users can click elements underneath!
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">GPU Accelerated</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Vector clipping paths are calculated directly by the graphics chip, allowing 60fps morphing animations.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Cuts Everything</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Backgrounds, child text, borders, and images are all sliced cleanly along the exact same path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* clip-path vs mask-image */}
      <section id="clipping-vs-masking" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Architectural Difference: clip-path vs. mask-image
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scissors className="h-4 w-4 text-teal-500" />
                Hard Edge Cookie Cutter (<code className="font-mono text-teal-500">clip-path</code>)
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Binary visibility: A pixel is either 100% visible or 0% discarded. Perfect for sharp geometric polygons, stars, angled diagonal section dividers, and badge cutouts.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-teal-300">
              clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-500" />
                Soft Alpha Transparency (<code className="font-mono text-cyan-500">mask-image</code>)
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Continuous alpha blending: Uses the opacity of a gradient or PNG to fade an element gradually from opaque to transparent. Used for gradient scroll fades!
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300">
              mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live Geometric Cookie Cutter
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Shape Cutouts
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'polygon-hex', label: 'Hexagon' },
                    { id: 'polygon-star', label: '10-Pt Star' },
                    { id: 'polygon-chevron', label: 'Chevron' },
                    { id: 'circle', label: 'Circle' },
                    { id: 'inset-card', label: 'Inset Rounded' },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveShape(s.id)}
                    className={cn(
                      'py-2 px-3 text-xs font-bold rounded-lg border transition-all text-left flex items-center justify-between',
                      activeShape === s.id
                        ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    )}
                  >
                    <span>{s.label}</span>
                    <Shapes className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>

            {activeShape === 'inset-card' && (
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Corner Radius</span>
                  <span className="font-mono text-teal-500">{insetRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={insetRadius}
                  onChange={(e) => setInsetRadius(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                Generated CSS
              </div>
              <div className="text-teal-300 break-all">
                clip-path: {clipPathStyle};
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[380px]">
            <div
              className="w-64 h-64 bg-gradient-to-tr from-teal-500 via-cyan-600 to-emerald-400 flex flex-col items-center justify-center p-8 text-center text-white shadow-2xl transition-all duration-500 hover:scale-105"
              style={{
                clipPath: clipPathStyle,
              }}
            >
              <Scissors className="h-8 w-8 mb-2 drop-shadow" />
              <h4 className="font-black text-lg drop-shadow">Laser Cut</h4>
              <p className="text-[11px] text-white/90 drop-shadow mt-1">
                Zero SVG files required. Built with pure browser CSS geometry!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Clipping &amp; Masking</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The Missing Shadow Gotcha:</strong> Any <code className="font-mono">box-shadow</code> defined on an element with <code className="font-mono">clip-path</code> will be clipped away and disappear! To fix this, place a wrapper parent <code className="font-mono">&lt;div&gt;</code> and apply <code className="font-mono text-teal-500">filter: drop-shadow(...)</code> on the wrapper instead.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>Polygon Morphing Animation Rule:</strong> To animate <code className="font-mono">clip-path</code> smoothly with a CSS transition, the starting shape and ending shape <strong>must have the identical number of coordinate points</strong>. You cannot morph a 3-point triangle into a 5-point star without glitchy jumps!
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Next Masterclass · Track 6 Typography
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Typography, Golden Ratios &amp; Text Layout
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Master line-height scales, letter-spacing, text-wrap: balance, and embedded typography studio.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/typography"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 23</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
