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
  Compass,
  Play,
  RotateCw,
  AlertTriangle,
  Send,
  Milestone,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function MotionPathConceptLesson() {
  const [distance, setDistance] = useState(25);
  const [autoRide, setAutoRide] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // SVG curved path definition
  const pathD = 'M 40 180 Q 200 20 360 180 T 680 180';

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 8: Transitions &amp; Animation</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-cyan-600 dark:text-cyan-400 font-bold">Motion Path (offset-path)</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-teal-500/10 dark:from-cyan-500/15 dark:via-slate-950 dark:to-cyan-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              <Compass className="h-3.5 w-3.5" />
              Transitions &amp; Animation · Track 8 Capstone
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 33
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Motion Path (offset-path)
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Move beyond straight linear translation. Lock HTML elements onto curved SVG vector trajectories using
            <code className="text-cyan-500 font-mono"> offset-path</code>, throttle progress with <code className="text-cyan-500 font-mono">offset-distance</code>, and bank naturally into corners with <code className="text-cyan-500 font-mono">offset-rotate: auto</code>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
              Roller Coaster Track Model
            </a>
            <a
              href="#syntax-suite"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-blue-500" />
              The offset-* Property Suite
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-teal-500" />
              Interactive Flight Simulator
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: Roller Coaster Wheels Locked to Steel Rails
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            In classical CSS, if you wanted an airplane icon to fly in a semi-circle, you had to calculate intricate trigonometry in JavaScript or chain dozens of complex keyframes.
            With CSS Motion Path:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">1. Lay the Steel Rail</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <code className="font-mono">offset-path: path(...)</code> lays down the exact SVG vector spline rail.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">2. Throttle Progress</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <code className="font-mono">offset-distance: 50%</code> places the car exactly halfway along the track.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">3. Auto Bank Turns</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <code className="font-mono">offset-rotate: auto</code> rotates the nose of the plane along the curve&apos;s tangent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The offset-* Suite */}
      <section id="syntax-suite" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The 3 Core Motion Path Properties
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs sm:text-sm text-cyan-300 space-y-2 overflow-x-auto">
            <div className="text-slate-400 font-sans font-bold">.rocket-ship &#123;</div>
            <div className="pl-4 text-emerald-400">/* Define any arbitrary SVG curve path */</div>
            <div className="pl-4">offset-path: path(&apos;M 40 180 Q 200 20 360 180 T 680 180&apos;);</div>
            <div className="pl-4 text-emerald-400">/* Steer from 0% (start) to 100% (end) */</div>
            <div className="pl-4">offset-distance: 0%;</div>
            <div className="pl-4 text-emerald-400">/* Keep head aligned to direction of travel */</div>
            <div className="pl-4">offset-rotate: auto;</div>
            <div className="text-slate-400 font-sans font-bold">&#125;</div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live Roller Coaster Vector Flight
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>offset-distance Throttle</span>
                <span className="font-mono text-cyan-500">{distance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={distance}
                onChange={(e) => { setDistance(Number(e.target.value)); setAutoRide(false); }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>offset-rotate: auto (Face Tangent)</span>
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                />
              </label>

              <button
                onClick={() => setAutoRide(!autoRide)}
                className="w-full mt-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                <span>{autoRide ? 'Stop Coaster' : 'Auto Loop Coaster'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                CSS Motion Path Code
              </div>
              <div className="text-cyan-300 break-all">
                offset-distance: {distance}%;
                <br />
                offset-rotate: {autoRotate ? 'auto' : '0deg'};
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[360px] overflow-hidden">
            <div className="relative w-full max-w-xl h-60 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-inner flex items-center justify-center">
              {/* SVG Guide Line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 720 240" fill="none">
                <path
                  d={pathD}
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  opacity="0.5"
                />
              </svg>

              {/* Element Traveling on Path */}
              <div
                className={cn(
                  'absolute w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg flex items-center justify-center text-white text-lg',
                  autoRide && 'animate-pulse'
                )}
                style={{
                  offsetPath: `path("${pathD}")`,
                  offsetDistance: `${distance}%`,
                  offsetRotate: autoRotate ? 'auto' : '0deg',
                }}
              >
                🚀
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Motion Path</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Initial Element Rotation Offset:</strong> If your rocket ship SVG icon naturally points upwards (north) by default, <code className="font-mono">offset-rotate: auto</code> expects elements to point east (0 degrees). Add an angle offset like <code className="font-mono text-cyan-500">offset-rotate: auto 90deg;</code> so it faces forward!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Legacy <code className="font-mono">motion-path</code> Property:</strong> Years ago, Chrome experimentally named this <code className="font-mono">motion-path</code>. The official W3C web standard was finalized as <code className="font-mono text-cyan-500">offset-path</code>. Always use <code className="font-mono">offset-path</code> today.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Next Masterclass · Track 9 Engine Internals
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Browser Rendering Pipeline: DOM + CSSOM to Pixels
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Look under the browser hood: parse, construct Render Tree, calculate Layout, and rasterize Paint layers.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/rendering"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 34</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
