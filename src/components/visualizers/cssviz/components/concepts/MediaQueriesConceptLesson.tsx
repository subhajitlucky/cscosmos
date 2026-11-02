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
  Tv,
  Moon,
  Sun,
  EyeOff,
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react';
import MediaQueriesLab from '../visualizers/MediaQueriesLab';
import { cn } from '../../utils/cn';

export default function MediaQueriesConceptLesson() {
  const [simulatedWidth, setSimulatedWidth] = useState(820);
  const [colorScheme, setColorScheme] = useState<'system' | 'dark' | 'light'>('system');
  const [reducedMotion, setReducedMotion] = useState(false);

  const isMobile = simulatedWidth < 640;
  const isTablet = simulatedWidth >= 640 && simulatedWidth < 1024;
  const isDesktop = simulatedWidth >= 1024;

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
          <span>Track 7: Responsive Architecture</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-blue-600 dark:text-blue-400 font-bold">Media Queries &amp; Range Syntax</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10 dark:from-blue-500/15 dark:via-slate-950 dark:to-blue-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-500/30">
              <Tv className="h-3.5 w-3.5" />
              Responsive Architecture · Track 7
            </span>
            <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
              Core Concept 26
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Media Queries &amp; Modern Range Syntax
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Ditch confusing <code className="text-blue-500 font-mono">min-width</code> inversions. Master the modern mathematical range syntax <code className="text-blue-500 font-mono">@media (width &gt;= 768px)</code>, query device features like <code className="text-blue-500 font-mono">hover: hover</code>, and respect user accessibility preferences.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-500" />
              Traffic Officer Mental Model
            </a>
            <a
              href="#range-syntax"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-indigo-500" />
              Modern Mathematical Range Syntax
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              Live Range Simulator
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
            1. Mental Model: The Highway Traffic Director
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Think of a media query as an intelligent traffic officer standing at the entrance to your CSS rules.
            Before letting the browser execute the styling block, the officer checks the user's passport:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Dimension Check</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                &quot;Is the viewport at least 768px wide?&quot; (<code className="font-mono">width &gt;= 768px</code>)
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Input Capabilities</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                &quot;Does this device have a real mouse pointer, or a clumsy touch finger?&quot; (<code className="font-mono">hover: hover</code>)
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">User Health &amp; Preferences</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                &quot;Has the user requested reduced motion due to motion sickness?&quot; (<code className="font-mono">prefers-reduced-motion</code>)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Range Syntax */}
      <section id="range-syntax" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Modern Syntax Leap: Mathematical Inequality Operators
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Intent</th>
                <th className="p-4">Legacy Syntax (Confusing)</th>
                <th className="p-4">Modern Range Syntax (Clear Math)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Tablet and Above</td>
                <td className="p-4 font-mono text-xs text-slate-500">@media (min-width: 768px)</td>
                <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                  @media (width &gt;= 768px)
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Mobile Only</td>
                <td className="p-4 font-mono text-xs text-slate-500">@media (max-width: 767.98px)</td>
                <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                  @media (width &lt; 768px)
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Between Tablet and Laptop</td>
                <td className="p-4 font-mono text-xs text-slate-500">
                  @media (min-width: 768px) and (max-width: 1024px)
                </td>
                <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                  @media (768px &lt;= width &lt;= 1024px)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live Breakpoint &amp; Preference Simulator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Simulated Viewport Width</span>
                <span className="font-mono text-blue-500">{simulatedWidth}px</span>
              </div>
              <input
                type="range"
                min="320"
                max="1400"
                value={simulatedWidth}
                onChange={(e) => setSimulatedWidth(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>320px (Mobile)</span>
                <span>768px (Tablet)</span>
                <span>1200px+ (Desktop)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                User Accessibility Preferences
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                  className={cn(
                    'py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-between transition-all',
                    colorScheme === 'dark'
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <span>Dark Mode</span>
                  {colorScheme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={cn(
                    'py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-between transition-all',
                    reducedMotion
                      ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <span>Reduced Motion</span>
                  <EyeOff className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                Active Media Query Evaluator
              </div>
              <div className="text-emerald-400 font-bold">
                {isMobile && '/* Active: @media (width < 640px) [Mobile] */'}
                {isTablet && '/* Active: @media (640px <= width < 1024px) [Tablet] */'}
                {isDesktop && '/* Active: @media (width >= 1024px) [Desktop] */'}
              </div>
              {reducedMotion && (
                <div className="text-purple-300">
                  @media (prefers-reduced-motion: reduce) &#123; * &#123; animation: none !important; &#125; &#125;
                </div>
              )}
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-8 flex flex-col items-center justify-center min-h-[340px]">
            <div
              className={cn(
                'rounded-2xl p-6 text-center space-y-3 transition-all duration-300 border shadow-lg max-w-sm',
                isMobile && 'bg-rose-500 text-white border-rose-400',
                isTablet && 'bg-amber-500 text-white border-amber-400',
                isDesktop && 'bg-blue-600 text-white border-blue-500'
              )}
            >
              <span className="font-mono text-xs uppercase tracking-widest opacity-80">Device Category</span>
              <h3 className="text-2xl font-black">
                {isMobile ? 'Smartphone Layout' : isTablet ? 'Tablet Portrait' : 'Desktop Wide Screen'}
              </h3>
              <p className="text-xs opacity-90">
                Evaluated Viewport: <strong>{simulatedWidth}px</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Visualizer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <FlaskConical className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            4. Deep Visualizer: Breakpoint Triggers &amp; Themes
          </h2>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-950/50 p-4 sm:p-6 shadow-inner">
          <MediaQueriesLab />
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Media Queries</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The Exact Breakpoint Collision Bug:</strong> Writing <code className="font-mono">@media (max-width: 768px)</code> and <code className="font-mono">@media (min-width: 768px)</code> means that on a tablet with exactly 768px width, <em>both queries match simultaneously</em>, triggering conflicting cascade battles! The modern range syntax <code className="font-mono text-blue-500">@media (width &lt; 768px)</code> and <code className="font-mono text-blue-500">@media (width &gt;= 768px)</code> eliminates this overlap forever.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>Assuming Mobile Means No Hover:</strong> Modern touchscreen laptops (like Surface Pro or iPad Pro with Magic Keyboard) support both touch AND precision mouse hovers! Never test screen width to guess input capabilities; test <code className="font-mono text-indigo-400">@media (hover: hover)</code> directly.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Container Queries (@container): Component-Driven Design
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Style components based on their parent container's width, not the global browser viewport!
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/container-queries"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 27</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
