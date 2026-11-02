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
  Film,
  Play,
  Pause,
  Repeat,
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react';
import AnimationLab from '../visualizers/AnimationLab';
import { cn } from '../../utils/cn';

export default function AnimationsConceptLesson() {
  const [fillMode, setFillMode] = useState<'forwards' | 'none' | 'backwards' | 'both'>('forwards');
  const [iterations, setIterations] = useState<'1' | 'infinite'>('infinite');
  const [direction, setDirection] = useState<'normal' | 'alternate'>('alternate');
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 8: Transitions &amp; Animation</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-purple-600 dark:text-purple-400 font-bold">Keyframe Animations</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10 dark:from-purple-500/15 dark:via-slate-950 dark:to-purple-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 font-mono text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/30">
              <Film className="h-3.5 w-3.5" />
              Transitions &amp; Animation · Track 8
            </span>
            <span className="rounded-full bg-pink-500/15 border border-pink-500/30 px-3 py-1 font-mono text-xs font-bold text-pink-700 dark:text-pink-300">
              Core Concept 31
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Keyframe Animations &amp; fill-mode
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Direct complex autonomous motion choreographies. Master <code className="text-purple-500 font-mono">@keyframes</code> waypoints, understand why <code className="text-purple-500 font-mono">animation-fill-mode: forwards</code> prevents annoying snapping bugs, and create infinite pulsing rings.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-purple-500" />
              Disney Storyboard Model
            </a>
            <a
              href="#fill-mode-guide"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-pink-500" />
              The 4 fill-mode Values
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-indigo-500" />
              Live Keyframe Studio
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: The Disney Animator's Storyboard
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            In traditional hand-drawn animation, the lead director sketches the major emotional milestones (the &quot;keyframes&quot; at 0%, 50%, and 100%).
            Then assistant animators draw all the fluid in-between frames.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Transitions (A → B)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Needs user interaction (hover). Moves from point A directly to point B.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Keyframes (A → B → C → D)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Autonomous and multi-stage. Bounce up, squish down, fade out, rotate 360 degrees!
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Pause &amp; Resume</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Freeze in mid-air using <code className="font-mono">animation-play-state: paused;</code> on hover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* fill-mode Breakdown */}
      <section id="fill-mode-guide" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The 4 animation-fill-mode Values Explained
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">fill-mode</th>
                <th className="p-4">During Delay (Before Start)</th>
                <th className="p-4">After Finish (After 100%)</th>
                <th className="p-4">Common Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-mono font-bold text-rose-500">none (Default)</td>
                <td className="p-4 text-xs">Standard CSS styles apply</td>
                <td className="p-4 text-xs">Instantly snaps back to base styles!</td>
                <td className="p-4 text-xs">Continuous looping animations only</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 bg-purple-500/5">
                <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">forwards (Most Used)</td>
                <td className="p-4 text-xs">Standard CSS styles apply</td>
                <td className="p-4 text-xs font-bold text-emerald-500">Freezes at final 100% keyframe forever!</td>
                <td className="p-4 text-xs">Fade-in entry animations, slide-in banners</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-mono font-bold text-blue-500">backwards</td>
                <td className="p-4 text-xs">Applies 0% keyframe immediately during delay</td>
                <td className="p-4 text-xs">Snaps back to base styles</td>
                <td className="p-4 text-xs">Staggered entrance delays</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-mono font-bold text-emerald-500">both</td>
                <td className="p-4 text-xs">Applies 0% during delay</td>
                <td className="p-4 text-xs">Freezes at 100% when finished</td>
                <td className="p-4 text-xs">Complex delayed choreographies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live Keyframe Director
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                animation-fill-mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['forwards', 'none', 'backwards', 'both'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFillMode(mode)}
                    className={cn(
                      'py-2 px-3 text-xs font-mono font-bold rounded-lg border transition-all text-left',
                      fillMode === mode
                        ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Direction &amp; Repeat
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIterations(iterations === 'infinite' ? '1' : 'infinite')}
                  className={cn(
                    'py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-between transition-all',
                    iterations === 'infinite'
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <span>Loop: {iterations}</span>
                  <Repeat className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDirection(direction === 'alternate' ? 'normal' : 'alternate')}
                  className={cn(
                    'py-2 px-3 text-xs font-bold rounded-lg border transition-all',
                    direction === 'alternate'
                      ? 'border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  Direction: {direction}
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              <span>{isPaused ? 'Resume Playback' : 'Pause at Current Frame'}</span>
            </button>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                CSS Animation Code
              </div>
              <div className="text-purple-300 break-all">
                animation: floatOrb 2s ease-in-out {iterations} {direction} {fillMode};
              </div>
              <div className="text-pink-400">
                animation-play-state: {isPaused ? 'paused' : 'running'};
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[340px]">
            <div
              className={cn(
                'w-32 h-32 rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 shadow-2xl flex flex-col items-center justify-center text-white text-center p-4 transition-all',
                isPaused ? 'opacity-70' : 'animate-bounce'
              )}
            >
              <Film className="h-7 w-7 mb-1" />
              <span className="font-bold text-xs">@keyframes</span>
              <span className="text-[10px] opacity-80 font-mono mt-0.5">{fillMode}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Deep Visualizer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <FlaskConical className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            4. Deep Visualizer: Interactive Keyframe Studio
          </h2>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-950/50 p-4 sm:p-6 shadow-inner">
          <AnimationLab />
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Animations</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The &quot;Snapping Back&quot; Glitch:</strong> You animate a modal fading in and translating down. The moment the animation reaches 100%, it vanishes or snaps back to the top of the screen! Solution: Add <code className="font-mono text-purple-500">animation-fill-mode: forwards;</code> so the browser preserves the final keyframe.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>Creating Infinite Loops with Heavy Repaints:</strong> If you loop an animation with <code className="font-mono">box-shadow</code> or <code className="font-mono">filter: blur()</code>, the browser will burn CPU cycles non-stop, draining mobile batteries in 20 minutes. Keep infinite loops restricted strictly to <code className="font-mono">transform</code> and <code className="font-mono">opacity</code>!
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            3D Transforms, Perspective &amp; Card Flips
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Step into the 3rd dimension with perspective, transform-style: preserve-3d, and backface-visibility.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/3d"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 32</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
