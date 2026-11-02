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
  Square,
  Shapes,
  AlertTriangle,
  Focus,
  Maximize2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function BordersConceptLesson() {
  const [tl, setTl] = useState(30);
  const [tr, setTr] = useState(70);
  const [br, setBr] = useState(70);
  const [bl, setBl] = useState(30);
  const [borderWidth, setBorderWidth] = useState(4);
  const [borderStyle, setBorderStyle] = useState<'solid' | 'dashed' | 'dotted' | 'double'>('solid');
  const [outlineOffset, setOutlineOffset] = useState(4);
  const [showOutline, setShowOutline] = useState(false);

  // Compute organic 8-value radius
  const borderRadiusStyle = `${tl}% ${100 - tl}% ${br}% ${100 - br}% / ${100 - tr}% ${tr}% ${100 - bl}% ${bl}%`;

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
          <span>Track 5: Visual Styling</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-cyan-600 dark:text-cyan-400 font-bold">Borders &amp; Shapes</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-teal-500/10 dark:from-cyan-500/15 dark:via-slate-950 dark:to-cyan-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              <Square className="h-3.5 w-3.5" />
              Visual Styling · Track 5
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 19
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Borders, Outlines &amp; Organic Shapes
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Borders do far more than draw black boxes. Understand the critical layout difference between <code className="text-cyan-500 font-mono">border</code> and <code className="text-cyan-500 font-mono">outline</code>, unlock the secret 8-value slash syntax for morphing organic blobs, and master accessible focus rings.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#border-vs-outline"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
              Border vs. Outline Mental Model
            </a>
            <a
              href="#radius-anatomy"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-blue-500" />
              The 8-Value Slash Syntax
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-teal-500" />
              Organic Shape Studio
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="border-vs-outline" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. The Golden Rule: Border (Physical Frame) vs Outline (Hovering Ring)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Square className="h-4 w-4 text-cyan-500" />
                Physical Wooden Frame (<code className="font-mono text-cyan-500">border</code>)
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                Affects Layout
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A border has real physical thickness in the DOM box model. If you suddenly add <code className="font-mono">border: 4px solid red;</code> on <code className="font-mono">:hover</code>, it will push adjacent sibling buttons away, creating an ugly layout jitter!
            </p>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
              <div>• Takes up physical width and height</div>
              <div>• Follows `border-radius` corners perfectly</div>
              <div>• Can have different styles per side (border-top, border-left)</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Focus className="h-4 w-4 text-emerald-500" />
                Hovering Laser Pointer (<code className="font-mono text-emerald-500">outline</code>)
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Zero Reflow
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              An outline is drawn outside the element like a halo. It occupies <strong>zero space</strong> in the layout geometry. Adding a 20px outline will never nudge neighboring elements. This makes it ideal for keyboard focus indicators!
            </p>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
              <div>• Zero footprint in layout calculation (no reflow)</div>
              <div>• Supports `outline-offset` to float away from edges</div>
              <div>• Cannot style individual edges independently</div>
            </div>
          </div>
        </div>
      </section>

      {/* Anatomy of 8-Value Slash Syntax */}
      <section id="radius-anatomy" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Shapes className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Secret 8-Value Slash Syntax: How Designers Make Organic Blobs
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Most beginners think <code className="font-mono">border-radius</code> only accepts 1 value (<code className="font-mono">8px</code>) or 4 values (<code className="font-mono">8px 8px 0 0</code>).
            However, corners are actually quarter-ellipses with two radii: a <strong>horizontal radius</strong> and a <strong>vertical radius</strong>.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto space-y-2">
            <div className="text-slate-400 font-sans font-bold">/* Horizontal Radii / Vertical Radii */</div>
            <div>border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;</div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The values before the slash dictate how far along the top and bottom borders the curves stretch; the values after the slash dictate how far along the left and right edges they stretch.
          </p>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Organic Blob &amp; Focus Ring Generator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Border Thickness &amp; Style
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 w-10 text-right">
                  {borderWidth}px
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['solid', 'dashed', 'dotted', 'double'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setBorderStyle(style)}
                    className={cn(
                      'py-1.5 text-xs font-mono font-bold capitalize rounded-lg border transition-all',
                      borderStyle === style
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Corner Morphing Sliders (%)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>Top-Left</span>
                    <span>{tl}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={tl}
                    onChange={(e) => setTl(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>Top-Right</span>
                    <span>{tr}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={tr}
                    onChange={(e) => setTr(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>Bottom-Left</span>
                    <span>{bl}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={bl}
                    onChange={(e) => setBl(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>Bottom-Right</span>
                    <span>{br}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={br}
                    onChange={(e) => setBr(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>Enable Accessibility Outline Halo</span>
                <input
                  type="checkbox"
                  checked={showOutline}
                  onChange={(e) => setShowOutline(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                />
              </label>
              {showOutline && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>outline-offset</span>
                    <span>{outlineOffset}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={outlineOffset}
                    onChange={(e) => setOutlineOffset(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                Generated CSS
              </div>
              <div className="text-cyan-300">
                border: {borderWidth}px {borderStyle} #06b6d4;
              </div>
              <div className="text-blue-300 break-all">
                border-radius: {borderRadiusStyle};
              </div>
              {showOutline && (
                <div className="text-emerald-300">
                  outline: 3px solid #10b981;
                  <br />
                  outline-offset: {outlineOffset}px;
                </div>
              )}
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[360px]">
            <div
              className="w-56 h-56 bg-gradient-to-tr from-cyan-500 via-blue-500 to-teal-400 flex flex-col items-center justify-center p-6 text-center text-white shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
              style={{
                border: `${borderWidth}px ${borderStyle} #06b6d4`,
                borderRadius: borderRadiusStyle,
                outline: showOutline ? '3px solid #10b981' : 'none',
                outlineOffset: showOutline ? `${outlineOffset}px` : '0px',
              }}
            >
              <Shapes className="h-8 w-8 mb-2 drop-shadow" />
              <span className="font-bold text-sm drop-shadow">Morphing CSS Blob</span>
              <span className="text-[10px] text-white/80 font-mono mt-1">Click to animate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Borders &amp; Outlines</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Never write <code className="font-mono">outline: none</code> without a replacement!</strong> Stripping outlines kills keyboard accessibility for blind and motor-impaired users who navigate by pressing the <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">Tab</kbd> key. Always provide an explicit <code className="font-mono text-cyan-500">:focus-visible</code> ring!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Border Hover Jitter Trap:</strong> If you add a 2px border on hover (<code className="font-mono">button:hover &#123; border: 2px solid cyan; &#125;</code>), the button will grow by 4px and push surrounding elements around. Instead, give the base button a <code className="font-mono">border: 2px solid transparent</code> or use <code className="font-mono">box-shadow: inset 0 0 0 2px cyan;</code>.
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
            Realistic Box Shadows &amp; Drop Shadows
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Create layered natural shadows, understand the difference between box-shadow and SVG drop-shadow filter.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/shadows"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 20</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
