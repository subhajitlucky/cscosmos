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
  Image as ImageIcon,
  Layers,
  AlertTriangle,
  Move,
  RotateCw,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function BackgroundsConceptLesson() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState('#ec4899');
  const [color2, setColor2] = useState('#8b5cf6');
  const [color3, setColor3] = useState('#3b82f6');
  const [stop1, setStop1] = useState(0);
  const [stop2, setStop2] = useState(50);
  const [stop3, setStop3] = useState(100);
  const [patternOverlay, setPatternOverlay] = useState(true);

  // Computed background gradient
  let gradientCode = '';
  if (gradientType === 'linear') {
    gradientCode = `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%, ${color3} ${stop3}%)`;
  } else if (gradientType === 'radial') {
    gradientCode = `radial-gradient(circle at center, ${color1} ${stop1}%, ${color2} ${stop2}%, ${color3} ${stop3}%)`;
  } else {
    gradientCode = `conic-gradient(from ${angle}deg at 50% 50%, ${color1} ${stop1}%, ${color2} ${stop2}%, ${color3} ${stop3}%)`;
  }

  const fullBackgroundStyle = patternOverlay
    ? `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px), ${gradientCode}`
    : gradientCode;

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
          <span>Track 5: Visual Styling</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-purple-600 dark:text-purple-400 font-bold">Backgrounds &amp; Parallax</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-pink-500/10 dark:from-purple-500/15 dark:via-slate-950 dark:to-indigo-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 font-mono text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/30">
              <ImageIcon className="h-3.5 w-3.5" />
              Visual Styling · Track 5
            </span>
            <span className="rounded-full bg-pink-500/15 border border-pink-500/30 px-3 py-1 font-mono text-xs font-bold text-pink-700 dark:text-pink-300">
              Core Concept 18
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Backgrounds, Gradients &amp; Multi-Layers
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Every element in CSS is a canvas that can stack multiple layers: transparent dot matrices, rich linear &amp; conic
            gradients, and responsive background images with pure CSS fixed parallax scrolling.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-purple-500" />
              The Acetate Sheet Model
            </a>
            <a
              href="#gradient-families"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-pink-500" />
              Linear vs Radial vs Conic
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-indigo-500" />
              Live Gradient Studio
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Layers className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. The Mental Model: Stack of Transparent Glass Sheets
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            In CSS, <code className="font-mono text-purple-500">background-image</code> accepts a comma-separated list of values.
            Think of each item as a transparent glass sheet stacked on top of your desk:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-pink-200 dark:border-pink-900/50 bg-pink-50/50 dark:bg-pink-950/20 space-y-2">
              <span className="font-mono text-xs font-bold text-pink-600 dark:text-pink-400">Sheet 1 (Topmost / Closest to Eye)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Pattern overlay or semi-transparent noise dots. Anything transparent here reveals the sheet underneath.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
              <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">Sheet 2 (Middle)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Gradient or hero illustration. First declared layer renders on top of later declared layers!
              </p>
            </div>
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">The Desk Surface (Bottom)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <code className="font-mono">background-color</code> is always the fallback bottom surface beneath all image layers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Families */}
      <section id="gradient-families" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The 3 Gradient Types in Modern CSS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="h-28 bg-gradient-to-r from-pink-500 to-purple-600" />
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white">Linear Gradient</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Transitions colors along a straight ray defined by an angle (e.g. <code className="font-mono">90deg</code>) or directional keywords (<code className="font-mono">to bottom right</code>).
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-950 text-pink-300 font-mono text-[11px] overflow-x-auto">
                linear-gradient(45deg, #ec4899, #8b5cf6)
              </pre>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div
              className="h-28"
              style={{ background: 'radial-gradient(circle at center, #8b5cf6, #1e1b4b)' }}
            />
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white">Radial Gradient</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Radiates outward from a central anchor point in concentric circles or ellipses. Perfect for spot lights, badges, and glow orbs.
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-950 text-purple-300 font-mono text-[11px] overflow-x-auto">
                radial-gradient(circle at center, #8b5cf6, #1e1b4b)
              </pre>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div
              className="h-28"
              style={{ background: 'conic-gradient(from 0deg, #ec4899, #8b5cf6, #3b82f6, #ec4899)' }}
            />
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white">Conic Gradient</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Rotates colors around a center pin like a radar sweep or color wheel. Build pure CSS pie charts and circular progress bars!
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-950 text-indigo-300 font-mono text-[11px] overflow-x-auto">
                conic-gradient(from 0deg, #ec4899, #3b82f6)
              </pre>
            </div>
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
            3. Interactive Studio: Gradient Mixer &amp; Multi-Layer Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Gradient Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setGradientType(t)}
                    className={cn(
                      'py-2 text-xs font-bold capitalize rounded-xl border transition-all',
                      gradientType === t
                        ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {gradientType !== 'radial' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <RotateCw className="h-3.5 w-3.5 text-purple-500" />
                    Angle / Rotation
                  </span>
                  <span className="font-mono text-purple-500">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Color Stops &amp; Percentages
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stop1}
                    onChange={(e) => setStop1(Number(e.target.value))}
                    className="w-full text-center text-xs font-mono rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stop2}
                    onChange={(e) => setStop2(Number(e.target.value))}
                    className="w-full text-center text-xs font-mono rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="color"
                    value={color3}
                    onChange={(e) => setColor3(e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stop3}
                    onChange={(e) => setStop3(Number(e.target.value))}
                    className="w-full text-center text-xs font-mono rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>Multi-Layer Dot Matrix Overlay</span>
                <input
                  type="checkbox"
                  checked={patternOverlay}
                  onChange={(e) => setPatternOverlay(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                CSS Background Code
              </div>
              <div className="text-purple-300 break-all">
                background: {fullBackgroundStyle};
              </div>
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative h-72 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 border border-white/20"
              style={{
                backgroundImage: fullBackgroundStyle,
                backgroundSize: patternOverlay ? '16px 16px, auto' : 'auto',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-black/50 backdrop-blur-md px-3.5 py-1 font-mono text-xs font-bold text-white border border-white/20">
                  {gradientType.toUpperCase()} CANVAS
                </span>
                {patternOverlay && (
                  <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 font-mono text-xs font-bold text-white">
                    2 Layers Active
                  </span>
                )}
              </div>

              <div className="rounded-2xl bg-black/40 backdrop-blur-lg p-5 border border-white/20 text-white space-y-1 max-w-sm">
                <h4 className="font-bold text-base">Pure CSS Hero Card</h4>
                <p className="text-xs text-white/80">
                  Zero external image files required. Pure mathematical GPU rasterization renders instantaneously on any screen resolution.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Move className="h-4 w-4 text-purple-500" />
                Pure CSS Parallax in 1 Line
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Add <code className="font-mono text-pink-500">background-attachment: fixed;</code> to make an image stick to the browser viewport while the rest of the document scrolls past it. No JavaScript event listeners or scroll lagging!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Backgrounds</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The Background Shorthand Slash Syntax:</strong> In the shorthand <code className="font-mono">background</code> property, you <em>must</em> separate position and size with a slash: <code className="font-mono text-purple-400">background: url('bg.jpg') center / cover no-repeat;</code>. Leaving out the slash makes the browser drop the size entirely!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>Mobile iOS Fixed Background Bug:</strong> <code className="font-mono">background-attachment: fixed</code> often malfunctions or triggers heavy repaint stutters in Safari on iOS devices. The modern workaround is a fixed pseudo-element with <code className="font-mono">position: fixed; inset: 0; z-index: -1;</code>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">3.</span>
            <span>
              <strong>The Missing Fallback Color:</strong> Never declare a dark text hero over a dark image without adding a matching <code className="font-mono">background-color: #0f172a</code> fallback. If the client has a 3G network or ad-blocker blocking images, the user will see black text on white default background!
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
            Borders, Outlines &amp; Geometric Shapes
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Master 8-value border-radius blobs, outline offsets for accessibility, and border-image ribbons.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/borders"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 19</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
