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
  Paintbrush,
  Cpu,
  Layers,
  AlertTriangle,
  Wand2,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function HoudiniPaintConceptLesson() {
  const [bubbleColor, setBubbleColor] = useState('#8b5cf6');
  const [bubbleRadius, setBubbleRadius] = useState(30);

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
          <span>Track 9: Houdini APIs</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-purple-600 dark:text-purple-400 font-bold">Paint API Worklet</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-pink-500/10 dark:from-purple-500/15 dark:via-slate-950 dark:to-purple-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 font-mono text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/30">
              <Wand2 className="h-3.5 w-3.5" />
              Houdini API Trilogy · Concept 39
            </span>
            <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
              Deep Engine Hook
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Houdini Paint API: Custom Paint Worklets
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Stop waiting years for browser makers to implement new CSS background styles.
            With the Houdini Paint API, you can write JavaScript Worklets that hook directly into the browser&apos;s native rasterization pipeline to draw custom 2D canvas backgrounds via <code className="text-purple-500 font-mono">background: paint(myWorklet)</code>!
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-purple-500" />
              The Magician&apos;s Backdoor Model
            </a>
            <a
              href="#worklet-architecture"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-indigo-500" />
              registerPaint() Architecture
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-pink-500" />
              Live Paint Worklet Simulator
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Wand2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: Why Name It &quot;Houdini&quot;?
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Harry Houdini was the world&apos;s greatest escape artist. For decades, web developers were locked in a cage: if CSS didn&apos;t have a feature (like smooth squircle corners or rippling water backgrounds), developers had to wait 5 to 10 years for the W3C committee and browser teams to implement it.
            Houdini &quot;escapes the cage&quot; by letting <em>you</em> write code that executes directly inside the browser&apos;s C++ render engine!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Regular Canvas vs Paint Worklet</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                An HTML <code className="font-mono">&lt;canvas&gt;</code> element blocks the main JavaScript thread and needs DOM positioning. A Houdini Paint Worklet runs off the main thread in a background worker directly during the browser&apos;s Paint phase!
              </p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Responsive to CSS Variables</span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You feed input CSS variables (<code className="font-mono">--bubble-color: #8b5cf6</code>) to the worklet. When the variable transitions, the worklet re-executes automatically!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="worklet-architecture" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The 3-Step Houdini Paint Architecture
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs sm:text-sm text-purple-300 space-y-2 overflow-x-auto">
            <div className="text-slate-400 font-sans font-bold">/* 1. In my-paint-worklet.js */</div>
            <div>registerPaint(&apos;circlePattern&apos;, class &#123;</div>
            <div className="pl-4 text-emerald-400">static get inputProperties() &#123; return [&apos;--bubble-color&apos;]; &#125;</div>
            <div className="pl-4">paint(ctx, geometry, properties) &#123;</div>
            <div className="pl-8">const color = properties.get(&apos;--bubble-color&apos;).toString();</div>
            <div className="pl-8">ctx.fillStyle = color;</div>
            <div className="pl-8">ctx.beginPath();</div>
            <div className="pl-8">ctx.arc(geometry.width / 2, geometry.height / 2, 30, 0, 2 * Math.PI);</div>
            <div className="pl-8">ctx.fill();</div>
            <div className="pl-4">&#125;</div>
            <div>&#125;);</div>

            <div className="text-slate-400 font-sans font-bold pt-2">/* 2. In Main JavaScript */</div>
            <div>CSS.paintWorklet.addModule(&apos;my-paint-worklet.js&apos;);</div>

            <div className="text-slate-400 font-sans font-bold pt-2">/* 3. In Pure CSS */</div>
            <div>.cool-card &#123;</div>
            <div className="pl-4 text-pink-300">--bubble-color: #8b5cf6;</div>
            <div className="pl-4 text-cyan-300 font-bold">background: paint(circlePattern);</div>
            <div>&#125;</div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live Houdini Paint Worklet Simulator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                --bubble-color Token
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bubbleColor}
                  onChange={(e) => setBubbleColor(e.target.value)}
                  className="h-9 w-12 rounded cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs font-bold text-purple-500">{bubbleColor}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>--bubble-radius</span>
                <span className="font-mono text-purple-500">{bubbleRadius}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={bubbleRadius}
                onChange={(e) => setBubbleRadius(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                CSS Paint Invocation
              </div>
              <div className="text-purple-300">--bubble-color: {bubbleColor};</div>
              <div className="text-pink-300">--bubble-radius: {bubbleRadius}px;</div>
              <div className="text-cyan-300">background: paint(circlePattern);</div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[340px]">
            <div
              className="w-72 h-48 rounded-3xl p-6 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden border border-white/20"
              style={{
                backgroundColor: '#0f172a',
              }}
            >
              {/* Simulated Paint Worklet Canvas Output */}
              <div
                className="absolute inset-0 transition-all duration-200 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at center, ${bubbleColor} ${bubbleRadius}px, transparent ${bubbleRadius + 2}px)`,
                  backgroundSize: '80px 80px',
                  opacity: 0.85,
                }}
              />

              <div className="relative z-10 flex justify-between items-center text-xs font-mono font-bold">
                <span>Houdini Paint Worklet</span>
                <Sparkles className="h-4 w-4" />
              </div>

              <div className="relative z-10 space-y-1">
                <h4 className="font-bold text-base">Procedural CSS Canvas</h4>
                <p className="text-[11px] opacity-80">
                  Vector graphics rendered directly by the browser paint stage without image assets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Houdini Paint API</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Zero DOM or Storage Access in Worklets:</strong> A Paint Worklet runs in a sandboxed, multi-threaded environment. You cannot access <code className="font-mono">window</code>, <code className="font-mono">document</code>, or <code className="font-mono">localStorage</code> inside the worklet script! Everything must be passed through CSS custom properties.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>Safari Progressive Enhancement:</strong> Chromium browsers support Paint Worklets fully, but Safari support is still experimental. Always provide a fallback background: <code className="font-mono text-purple-400">background: #8b5cf6; background: paint(circlePattern);</code>.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Next Masterclass · Houdini Part 2
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            CSS Houdini Typed OM: Type-Safe Styles
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Eliminate string concatenation bugs and performance parsing overhead with CSS.px() and attributeStyleMap.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/houdini-typedom"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 40</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
