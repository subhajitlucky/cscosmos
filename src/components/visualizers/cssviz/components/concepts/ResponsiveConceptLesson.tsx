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
  Smartphone,
  Tablet,
  Monitor,
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import ResponsiveDesignLab from '../visualizers/ResponsiveDesignLab';
import { cn } from '../../utils/cn';

export default function ResponsiveConceptLesson() {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

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
          <span>Track 7: Responsive Architecture</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-cyan-600 dark:text-cyan-400 font-bold">Responsive Design Principles</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-teal-500/10 dark:from-cyan-500/15 dark:via-slate-950 dark:to-cyan-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              <Smartphone className="h-3.5 w-3.5" />
              Responsive Architecture · Track 7
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 25
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Responsive Design &amp; The Mobile-First Mindset
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Over 60% of web traffic originates on mobile phones. Learn the water-like fluidity of CSS, why you must build
            <strong className="text-cyan-500 font-semibold"> mobile-first with min-width</strong>, and the 3 cardinal rules of responsive images.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
              Water in the Container Model
            </a>
            <a
              href="#mobile-first"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-blue-500" />
              Mobile-First vs Desktop-Down
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-teal-500" />
              Device Simulator Lab
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
            1. The Mental Model: Content is Water, Screen is the Vessel
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            As Bruce Lee famously said: <em>&quot;You put water into a cup, it becomes the cup. You put water into a bottle, it becomes the bottle.&quot;</em>
            CSS is inherently fluid by default until developers freeze it with rigid fixed widths like <code className="font-mono text-rose-500">width: 800px;</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Fluid Widths</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Always prefer percentages, flex, grid, or <code className="font-mono">max-width: 100%</code> instead of fixed <code className="font-mono">width: 600px</code>.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Flexible Images</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Rule #1: <code className="font-mono">img &#123; max-width: 100%; height: auto; &#125;</code> prevents oversized images from blowing out mobile screens.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Touch Targets</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Fingers are clumsy compared to mouse pointers. Ensure buttons have at least <code className="font-mono">min-height: 44px;</code> padding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-First vs Desktop-Down */}
      <section id="mobile-first" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. Mobile-First (min-width) vs Desktop-Down (max-width)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 p-6 space-y-3">
            <div className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
              ❌ Desktop-Down (max-width) Nightmare
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Writing 3-column complex desktop CSS first, then writing dozens of <code className="font-mono">@media (max-width: 768px)</code> rules trying to undo floats, reset widths to 100%, and hide navigation bars. Messy and bloated!
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-3">
            <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ✅ Mobile-First (min-width) Zen
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Write clean 1-column stacked layout as base styles. Then add <code className="font-mono">@media (min-width: 768px)</code> only when extra screen real estate becomes available to expand columns. Simple, progressive enhancement!
            </p>
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
            3. Interactive Studio: Responsive Viewport Adaptability
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Device Switcher */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Simulate Device Frame
            </span>
            <div className="flex items-center gap-2">
              {(
                [
                  { id: 'mobile', label: 'Mobile (360px)', icon: Smartphone },
                  { id: 'tablet', label: 'Tablet (640px)', icon: Tablet },
                  { id: 'desktop', label: 'Desktop (100%)', icon: Monitor },
                ] as const
              ).map((d) => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDeviceMode(d.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border',
                      deviceMode === d.id
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulated Screen */}
          <div className="flex justify-center bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl overflow-x-auto">
            <div
              className={cn(
                'transition-all duration-300 rounded-2xl border-4 border-slate-800 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-2xl',
                deviceMode === 'mobile' && 'w-[360px]',
                deviceMode === 'tablet' && 'w-[640px]',
                deviceMode === 'desktop' && 'w-full'
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                <span className="font-mono text-xs font-bold text-slate-400">Viewport: {deviceMode.toUpperCase()}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>

              {/* Responsive Layout Cards */}
              <div
                className={cn(
                  'grid gap-4 transition-all',
                  deviceMode === 'mobile' ? 'grid-cols-1' : deviceMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'
                )}
              >
                {[1, 2, 3].map((card) => (
                  <div
                    key={card}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="h-20 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      Card #{card}
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Fluid Grid Item</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Adapts automatically from 1-column stack to multi-column grid without overflow!
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Visualizer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
            <FlaskConical className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            4. Deep Visualizer: Fluid clamp() Scaling Engine
          </h2>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-950/50 p-4 sm:p-6 shadow-inner">
          <ResponsiveDesignLab />
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Responsive Design</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The Missing Viewport Meta Tag:</strong> If you omit <code className="font-mono text-cyan-500">&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;</code> in your HTML, mobile browsers pretend they are a 980px desktop monitor and zoom out, rendering your responsive styles completely useless!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Dreaded Horizontal Scrollbar:</strong> Having an element with <code className="font-mono">width: 100vw</code> or a fixed <code className="font-mono">width: 500px</code> causes horizontal scrolling on phones. Always use <code className="font-mono">max-width: 100%</code> and inspect with <code className="font-mono">* &#123; outline: 1px solid red; &#125;</code> to find the culprit overflow!
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Media Queries &amp; Modern Range Syntax
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Write clean @media (width &gt;= 768px) syntax, detect prefers-color-scheme and prefers-reduced-motion.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/media-queries"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 26</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
