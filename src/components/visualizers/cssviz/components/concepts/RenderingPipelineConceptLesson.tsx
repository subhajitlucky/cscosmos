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
  Cpu,
  Layers,
  Layout,
  Paintbrush,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
} from 'lucide-react';
import { cn } from '../../utils/cn';

type PipelineStage = 'parse' | 'rendertree' | 'layout' | 'paint' | 'composite';

export default function RenderingPipelineConceptLesson() {
  const [activeStage, setActiveStage] = useState<PipelineStage>('parse');

  const stageData = {
    parse: {
      title: '1. Parsing: DOM + CSSOM Construction',
      tag: 'Raw Bytes → C++ Tree Nodes',
      desc: 'The browser streams HTML and CSS text files over the network, tokenizes characters into tokens, and constructs two independent memory trees: the DOM (Document Object Model) and the CSSOM (CSS Object Model).',
      code: 'HTML Bytes → Tokens → Nodes → DOM Tree\nCSS Bytes  → Tokens → Nodes → CSSOM Tree',
    },
    rendertree: {
      title: '2. Render Tree Construction',
      tag: 'Visual Marriage of Content & Styles',
      desc: 'The browser traverses the DOM and attaches computed styles from the CSSOM. Crucial rule: Elements with display: none and <head> tags are completely excluded from the Render Tree! (Whereas visibility: hidden elements remain in the tree).',
      code: 'DOM + CSSOM = Render Tree (Visual Nodes Only)',
    },
    layout: {
      title: '3. Layout (Reflow): Exact Geometry',
      tag: 'Box Coordinate Mathematics',
      desc: 'The browser calculates the exact pixel coordinates (X, Y, width, height) of every box on the viewport screen. It resolves percentages, flex ratios, and grid tracks into concrete integers.',
      code: 'Box Model Math: resolving 50% → 420px, auto margins, text flow',
    },
    paint: {
      title: '4. Paint (Rasterization): Pixels to Tiles',
      tag: 'Vector to Bitmap Conversion',
      desc: 'The browser converts geometric layout rectangles into actual colored pixels on screen tiles. Background gradients, text glyphs, shadows, and borders are rasterized into bitmaps.',
      code: 'Rasterizing layers: fills, borders, text, box-shadows',
    },
    composite: {
      title: '5. Compositing: GPU Layer Stacking',
      tag: 'Graphics Hardware Acceleration',
      desc: 'The browser uploads individual painted layers to the GPU (Graphics Processing Unit). The GPU draws all layers on top of each other at 60fps / 120fps using hardware matrix transforms.',
      code: 'GPU Compositor Thread: hardware blend & draw to screen display',
    },
  };

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 9: Engine Internals</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Rendering Pipeline</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-500/15 dark:via-slate-950 dark:to-emerald-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Cpu className="h-3.5 w-3.5" />
              Engine Internals · Track 9
            </span>
            <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-1 font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
              Core Concept 34
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Browser Rendering Pipeline: Bytes to Pixels
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            What happens between you saving a CSS file and the human eye seeing a button? Peek under the hood of Google Chrome and Firefox: understand DOM + CSSOM parsing, Render Tree construction, Layout coordinate calculation, and GPU layer compositing.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
              The Automobile Factory Model
            </a>
            <a
              href="#pipeline-steps"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-teal-500" />
              The 5 Pipeline Stages
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              Interactive Pipeline Inspector
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: The Industrial Car Assembly Line
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            The browser engine (Blink in Chrome, Gecko in Firefox, WebKit in Safari) is not a simple interpreter.
            It is a high-speed multi-threaded factory line that transforms static text into 60fps moving computer graphics:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Raw Steel &amp; Blueprints</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                HTML is the raw steel skeleton (DOM). CSS is the visual blueprint booklet (CSSOM).
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Measuring the Chassis</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Layout uses rulers to calculate exact bumper width and tire placement on the road.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Paint Shop &amp; Delivery</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Paint sprays the colors and finishes; Compositor stacks glass windows over body panels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. Interactive Studio: Step-Through Pipeline Inspector
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls / Stage Selector */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Assembly Pipeline Stages
            </span>

            {(
              [
                { id: 'parse', label: '1. Parsing (DOM + CSSOM)', icon: Cpu },
                { id: 'rendertree', label: '2. Render Tree', icon: Layers },
                { id: 'layout', label: '3. Layout (Reflow)', icon: Layout },
                { id: 'paint', label: '4. Paint (Rasterization)', icon: Paintbrush },
                { id: 'composite', label: '5. Compositing (GPU)', icon: Sparkles },
              ] as const
            ).map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStage(s.id)}
                  className={cn(
                    'w-full py-2.5 px-3.5 text-xs font-bold rounded-xl border flex items-center justify-between transition-all text-left',
                    activeStage === s.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{s.label}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                </button>
              );
            })}
          </div>

          {/* Stage Details Inspector */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-5 shadow-sm min-h-[340px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {stageData[activeStage].tag}
                </span>
                <span className="text-xs font-mono text-slate-400">Step {activeStage.toUpperCase()}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {stageData[activeStage].title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {stageData[activeStage].desc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{stageData[activeStage].code}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Rendering Pipeline</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>CSS is Render-Blocking:</strong> Until all linked stylesheets in <code className="font-mono">&lt;head&gt;</code> are completely downloaded and parsed into the CSSOM, the browser refuses to render a single pixel to avoid flashes of unstyled content (FOUC). Keep CSS files lean!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>display: none vs visibility: hidden in the Render Tree:</strong> Elements with <code className="font-mono">display: none</code> are completely omitted from the Render Tree (generating 0 layout nodes). Elements with <code className="font-mono">visibility: hidden</code> ARE included in the Render Tree and take up physical layout space, but paint transparently!
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Reflow, Repaint &amp; Layout Thrashing
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Learn why reading offsetHeight in a loop freezes the browser and triggers forced synchronous layouts.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/reflow"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 35</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
