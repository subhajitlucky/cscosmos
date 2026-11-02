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
  Play,
  RotateCcw,
  Zap,
  Gauge,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function TransitionsConceptLesson() {
  const [duration, setDuration] = useState(0.4);
  const [timing, setTiming] = useState<'ease' | 'linear' | 'ease-out' | 'cubic-bezier(0.34, 1.56, 0.64, 1)'>('ease');
  const [delay, setDelay] = useState(0);
  const [isMoved, setIsMoved] = useState(false);

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
          <span>Track 8: Transitions &amp; Animation</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">Transitions &amp; Timing</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 dark:from-amber-500/15 dark:via-slate-950 dark:to-amber-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Zap className="h-3.5 w-3.5" />
              Transitions &amp; Animation · Track 8
            </span>
            <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 font-mono text-xs font-bold text-orange-700 dark:text-orange-300">
              Core Concept 30
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Transitions &amp; Timing Functions
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Eliminate jarring, abrupt visual snaps. Learn how the browser calculates intermediate animation frames,
            master the <strong className="text-amber-500 font-semibold">sacred 60fps GPU rule</strong> (transform &amp; opacity only!), and build snappy bouncy interfaces with custom <code className="text-amber-500 font-mono">cubic-bezier()</code> curves.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-500" />
              Elevator Doors Mental Model
            </a>
            <a
              href="#gpu-rule"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
            >
              <Gauge className="h-3.5 w-3.5 text-orange-500" />
              The Sacred 60fps GPU Rule
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-yellow-500" />
              Live Easing Drag Strip
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: Elevator Doors vs. Sci-Fi Teleportation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 p-6 space-y-3">
            <div className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
              Without Transitions: Instant Pop
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When a CSS pseudo-state (like <code className="font-mono">:hover</code> or <code className="font-mono">:active</code>) matches, the browser instantly changes properties in a single frame (0ms). To the human eye, this feels unnatural, robotic, and abrasive.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-3">
            <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              With CSS Transitions: Physics In-Betweening
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              A transition tells the browser: <em>&quot;Don&apos;t teleport immediately. Interpolate smoothly from State A to State B over 300 milliseconds using physics curves!&quot;</em>
            </p>
          </div>
        </div>
      </section>

      {/* The 60fps GPU Rule */}
      <section id="gpu-rule" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Gauge className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Sacred 60fps Rule: What Properties Can You Safely Animate?
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">CSS Properties</th>
                <th className="p-4">Browser Pipeline Cost</th>
                <th className="p-4">Frame Rate Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr className="bg-emerald-500/5 hover:bg-emerald-500/10">
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  GPU Composited (Gold Standard)
                </td>
                <td className="p-4 font-mono text-xs text-emerald-600 dark:text-emerald-300 font-bold">
                  transform, opacity
                </td>
                <td className="p-4 text-xs">Compositing ONLY (Zero layout, zero repaint!)</td>
                <td className="p-4 text-xs font-bold text-emerald-500">Silky Smooth 60fps / 120fps ProMotion</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-amber-600 dark:text-amber-400">Paint Triggering</td>
                <td className="p-4 font-mono text-xs text-amber-600 dark:text-amber-300">
                  color, background-color, box-shadow
                </td>
                <td className="p-4 text-xs">Triggers Paint + Composite</td>
                <td className="p-4 text-xs text-amber-500">Fine for small buttons; lags full-screen elements</td>
              </tr>
              <tr className="bg-rose-500/5 hover:bg-rose-500/10">
                <td className="p-4 font-bold text-rose-600 dark:text-rose-400">
                  Layout Thrashing (The CPU Killer)
                </td>
                <td className="p-4 font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                  width, height, top, left, margin, padding
                </td>
                <td className="p-4 text-xs">Triggers Layout + Paint + Composite!</td>
                <td className="p-4 text-xs font-bold text-rose-500">Horrible stuttering and battery drain</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live Timing Function Race Track
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Duration</span>
                <span className="font-mono text-amber-500">{duration}s</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.05"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Delay</span>
                <span className="font-mono text-orange-500">{delay}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Timing Function
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'ease', label: 'ease (Default)' },
                    { id: 'linear', label: 'linear (Constant)' },
                    { id: 'ease-out', label: 'ease-out (Decelerate)' },
                    { id: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Elastic Bounce' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTiming(t.id)}
                    className={cn(
                      'py-2 px-3 text-xs font-bold rounded-lg border transition-all text-left',
                      timing === t.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMoved(!isMoved)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {isMoved ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isMoved ? 'Reset Animation' : 'Trigger Transition'}</span>
            </button>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                CSS Transition Shorthand
              </div>
              <div className="text-amber-300 break-all">
                transition: transform {duration}s {timing} {delay}s;
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col justify-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[340px] space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Race Track Preview</span>
              <div className="relative h-16 w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 flex items-center">
                <div
                  className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 shadow-md flex items-center justify-center text-slate-950 font-bold text-xs cursor-pointer select-none"
                  style={{
                    transform: isMoved ? 'translateX(calc(100% + 200px))' : 'translateX(0px)',
                    transition: `transform ${duration}s ${timing} ${delay}s`,
                  }}
                  onClick={() => setIsMoved(!isMoved)}
                >
                  🚀
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notice how the elastic bounce timing function overshoots its target and settles back into place naturally!
            </p>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Transitions</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Never write <code className="font-mono">transition: all 0.3s;</code>!</strong> Transitioning &quot;all&quot; forces the browser to watch and recalculate all 300+ CSS properties on every frame. If an ancestor element changes font or color, the entire DOM tree stutters. Always specify exact properties: <code className="font-mono text-amber-500">transition: transform 0.2s ease, opacity 0.2s ease;</code>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>Putting transition inside :hover instead of the base class:</strong> If you write <code className="font-mono">.btn:hover &#123; transition: transform 0.3s; &#125;</code>, the button will animate smoothly when mouse enters, but snap abruptly back when the mouse leaves! Place <code className="font-mono">transition</code> on the base <code className="font-mono">.btn</code> selector so it animates smoothly both ways.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Keyframe Animations &amp; animation-fill-mode
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Create autonomous loops, multi-step choreographies with @keyframes, and embedded Animation Studio.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/animations"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 31</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
