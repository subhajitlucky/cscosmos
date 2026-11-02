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
  Zap,
  Cpu,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function GpuAccelerationConceptLesson() {
  const [gpuPromoted, setGpuPromoted] = useState(true);

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
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">GPU Acceleration</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-500/15 dark:via-slate-950 dark:to-emerald-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Zap className="h-3.5 w-3.5" />
              Engine Internals · Track 9
            </span>
            <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-1 font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
              Core Concept 36
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            GPU Acceleration &amp; will-change
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Offload pixel rendering from the CPU to the graphics card. Learn how the browser promotes elements to independent hardware compositing textures, how to use <code className="text-emerald-500 font-mono">will-change</code> responsibly, and how to avoid the deadly &quot;Layer Explosion&quot; memory crash.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
              Hollywood Green Screen Model
            </a>
            <a
              href="#will-change-usage"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-teal-500" />
              The will-change Lifecycle
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              Compositing Layer Lab
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
            1. Mental Model: The Hollywood Green Screen Compositor
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            In film production, actors are filmed against green screens, creating separate visual video layers.
            The final film compositor stacks the background galaxy, spaceship layer, and actor layer on top of each other.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Single Flat Layer (Standard)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The CPU draws everything onto one single giant bitmap canvas. If one small element moves, the CPU has to repaint the entire page behind it!
              </p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">GPU Composited Layer</span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                The element is extracted onto its own dedicated GPU hardware texture. When it translates or scales, the GPU simply shifts the bitmap texture across screen memory. Zero repaints!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The will-change Rule */}
      <section id="will-change-usage" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Modern Standard: will-change vs. The translateZ(0) Hack
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-slate-500">Legacy Hack (2012)</div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300">
                .animated-card &#123;
                <br />
                &nbsp;&nbsp;/* Trick browser into 3D GPU layer: */
                <br />
                &nbsp;&nbsp;transform: translateZ(0);
                <br />
                &#125;
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-emerald-500">Modern W3C Standard</div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300">
                .animated-card &#123;
                <br />
                &nbsp;&nbsp;/* Explicit engine intent: */
                <br />
                &nbsp;&nbsp;will-change: transform, opacity;
                <br />
                &#125;
              </div>
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
            3. Interactive Studio: GPU Layer Texture Inspector
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Compositing Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGpuPromoted(false)}
                  className={cn(
                    'py-2.5 px-3 text-xs font-bold rounded-lg border transition-all',
                    !gpuPromoted
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  CPU Flat Layout
                </button>
                <button
                  onClick={() => setGpuPromoted(true)}
                  className={cn(
                    'py-2.5 px-3 text-xs font-bold rounded-lg border transition-all',
                    gpuPromoted
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  GPU Composited Layer
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                Hardware Diagnostics
              </div>
              <div className="flex justify-between">
                <span>Rasterization Thread:</span>
                <span className={gpuPromoted ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {gpuPromoted ? 'GPU Hardware Texture' : 'CPU Main Thread'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Motion Repaint Cost:</span>
                <span className={gpuPromoted ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {gpuPromoted ? '0ms (Free)' : '8ms - 16ms / frame'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[340px]">
            <div
              className={cn(
                'w-64 h-36 rounded-2xl p-5 flex flex-col justify-between text-white shadow-xl transition-all duration-300',
                gpuPromoted
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 border-2 border-emerald-400 shadow-emerald-500/20'
                  : 'bg-slate-800 border-2 border-slate-600'
              )}
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span>{gpuPromoted ? 'GPU Layer Active' : 'CPU Canvas'}</span>
                <Zap className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-base">Hardware Texture Node</h4>
              <p className="text-[11px] opacity-80">
                {gpuPromoted
                  ? 'Isolated in VRAM. GPU transforms without triggering layout reflow.'
                  : 'Baked into DOM. Transforms force repaint on adjacent elements.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: GPU Acceleration</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Never write <code className="font-mono">* &#123; will-change: transform; &#125;</code>:</strong> Every compositing layer allocates physical GPU VRAM memory. Promoting hundreds of elements causes &quot;Layer Explosion&quot;, immediately crashing mobile browsers! Apply <code className="font-mono text-emerald-500">will-change</code> only to the specific element that is currently animating.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Blurry Text Gotcha:</strong> When an element is promoted to the GPU, text subpixel antialiasing is sometimes disabled, causing text to appear slightly blurry. Always keep text sharp by removing <code className="font-mono">will-change</code> when animations complete.
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
            CSS Architecture: BEM, OOCSS &amp; CSS Modules
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Keep codebases scalable without specificity conflicts or accidental style collisions.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/architecture"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 37</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
