'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Code2,
  AlertTriangle,
  Layers,
  Sliders,
  ArrowRight,
  ChevronRight,
  FlaskConical,
} from 'lucide-react';
import DisplayModesLab from '../visualizers/DisplayModesLab';
import { cn } from '../../utils/cn';

export default function DisplayModesConceptLesson() {
  const [activeDisplay, setActiveDisplay] = useState<'block' | 'inline' | 'inline-block' | 'none'>('inline-block');
  const [boxWidth, setBoxWidth] = useState(140);
  const [boxHeight, setBoxHeight] = useState(60);

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
          <span>Track 2: Geometry</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">Display Modes</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-slate-900/5 to-emerald-500/10 dark:from-teal-500/15 dark:via-slate-950 dark:to-emerald-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 font-mono text-xs font-bold text-teal-700 dark:text-teal-300 border border-teal-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              1st Year CS Foundation · Core Track 2
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 07
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Display Modes
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            How elements sit on a page. The difference between giant heavy bricks (<code>block</code>), flowing river words (<code>inline</code>), versatile hybrid chips (<code>inline-block</code>), and the invisible cloak (<code>none</code>).
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#display-simulator"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Sliders className="h-4 w-4" />
              <span>Interactive Display Studio</span>
            </a>
            <a
              href="#display-lab"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <FlaskConical className="h-4 w-4 text-teal-400" />
              <span>Full Visualizer Lab</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Comparison Matrix */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Display Modes Matrix</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Block vs Inline vs Inline-Block vs None
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-700 dark:text-slate-300">
              <tr>
                <th className="p-3 sm:p-4">Display Mode</th>
                <th className="p-3 sm:p-4">Starts New Line?</th>
                <th className="p-3 sm:p-4">Respects Width/Height?</th>
                <th className="p-3 sm:p-4">Vertical Margin/Padding?</th>
                <th className="p-3 sm:p-4">Typical HTML Elements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="p-3 sm:p-4 font-bold text-blue-500">block</td>
                <td className="p-3 sm:p-4 text-emerald-500">YES (100% line)</td>
                <td className="p-3 sm:p-4 text-emerald-500">YES</td>
                <td className="p-3 sm:p-4 text-emerald-500">YES</td>
                <td className="p-3 sm:p-4 text-slate-500">&lt;div&gt;, &lt;p&gt;, &lt;h1&gt;, &lt;section&gt;</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="p-3 sm:p-4 font-bold text-amber-500">inline</td>
                <td className="p-3 sm:p-4 text-rose-500">NO (Flows in text)</td>
                <td className="p-3 sm:p-4 text-rose-500">NO (IGNORED!)</td>
                <td className="p-3 sm:p-4 text-rose-500">NO (Top/bottom ignored)</td>
                <td className="p-3 sm:p-4 text-slate-500">&lt;span&gt;, &lt;a&gt;, &lt;strong&gt;, &lt;em&gt;</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="p-3 sm:p-4 font-bold text-teal-500">inline-block</td>
                <td className="p-3 sm:p-4 text-rose-500">NO (Sits side-by-side)</td>
                <td className="p-3 sm:p-4 text-emerald-500">YES (Fully custom)</td>
                <td className="p-3 sm:p-4 text-emerald-500">YES (Pushes elements)</td>
                <td className="p-3 sm:p-4 text-slate-500">&lt;button&gt;, &lt;input&gt;, &lt;img&gt;</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="p-3 sm:p-4 font-bold text-purple-500">none</td>
                <td className="p-3 sm:p-4 text-slate-400">Removed from flow</td>
                <td className="p-3 sm:p-4 text-slate-400">No layout space</td>
                <td className="p-3 sm:p-4 text-slate-400">Zero footprint</td>
                <td className="p-3 sm:p-4 text-slate-500">Modal dialogs, hidden tabs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: Interactive Display Studio */}
      <section id="display-simulator" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>2. Live Display Mode Sandbox</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Switch Display on Sibling Boxes
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">display:</span>
            {(['block', 'inline', 'inline-block', 'none'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveDisplay(mode)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all',
                  activeDisplay === mode
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-mono">Width: {boxWidth}px</label>
              <input
                type="range"
                min="80"
                max="240"
                value={boxWidth}
                onChange={(e) => setBoxWidth(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-mono">Height: {boxHeight}px</label>
              <input
                type="range"
                min="40"
                max="100"
                value={boxHeight}
                onChange={(e) => setBoxHeight(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
          </div>

          {/* Visual Canvas */}
          <div className="rounded-xl bg-[#0b1324] p-6 text-slate-300 text-sm leading-relaxed border border-slate-800">
            <span>Before text... </span>

            <div
              className={cn(
                'rounded-lg bg-teal-500/20 border-2 border-teal-500 text-teal-300 font-mono text-xs font-bold p-2 text-center transition-all',
                activeDisplay === 'none' && 'hidden'
              )}
              style={{
                display: activeDisplay,
                width: activeDisplay !== 'inline' ? `${boxWidth}px` : undefined,
                height: activeDisplay !== 'inline' ? `${boxHeight}px` : undefined,
                margin: '8px',
              }}
            >
              Box 1 ({activeDisplay})
            </div>

            <div
              className={cn(
                'rounded-lg bg-indigo-500/20 border-2 border-indigo-500 text-indigo-300 font-mono text-xs font-bold p-2 text-center transition-all',
                activeDisplay === 'none' && 'hidden'
              )}
              style={{
                display: activeDisplay,
                width: activeDisplay !== 'inline' ? `${boxWidth}px` : undefined,
                height: activeDisplay !== 'inline' ? `${boxHeight}px` : undefined,
                margin: '8px',
              }}
            >
              Box 2 ({activeDisplay})
            </div>

            <span> ...after text continues seamlessly here.</span>
          </div>

          <div className="text-xs font-mono text-slate-500">
            {activeDisplay === 'inline' && 'Notice: Width and height sliders are completely ignored by the browser in display: inline!'}
            {activeDisplay === 'block' && 'Notice: Each box breaks onto its own new line, pushing following content down!'}
            {activeDisplay === 'inline-block' && 'Notice: Boxes sit side-by-side like words, but respect your exact width and height!'}
            {activeDisplay === 'none' && 'Notice: Elements disappear completely and release their layout space back to the text!'}
          </div>
        </div>
      </section>

      {/* SECTION 3: display: none vs visibility: hidden vs opacity: 0 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
          <AlertTriangle className="h-4 w-4" />
          <span>3. The Invisible Triad (Interview Classic)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          `display: none` vs `visibility: hidden` vs `opacity: 0`
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <code className="text-rose-600 dark:text-rose-400 font-bold text-sm">display: none</code>
            <p className="text-slate-600 dark:text-slate-400">
              <strong>Evicted from layout.</strong> Takes zero space on screen. Screen readers ignore it. Click events cannot trigger.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <code className="text-amber-600 dark:text-amber-400 font-bold text-sm">visibility: hidden</code>
            <p className="text-slate-600 dark:text-slate-400">
              <strong>Ghost on the wall.</strong> Invisible, but still occupies its exact width and height in the layout flow!
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <code className="text-teal-600 dark:text-teal-400 font-bold text-sm">opacity: 0</code>
            <p className="text-slate-600 dark:text-slate-400">
              <strong>100% Transparent.</strong> Takes space AND user can still accidentally click buttons inside it! Animatable with transitions.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Lab Integration */}
      <section id="display-lab" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>4. Display Modes Playground</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Full Display Modes Lab
        </h2>
        <DisplayModesLab />
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next in Track 2</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">8. Positioning</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            static, relative, absolute, fixed, sticky, and z-index stacking contexts.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/positioning"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to Positioning</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
