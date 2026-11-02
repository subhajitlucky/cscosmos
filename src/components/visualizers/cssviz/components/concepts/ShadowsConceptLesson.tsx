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
  SunMedium,
  Layers,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ShadowsConceptLesson() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(12);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(-4);
  const [opacity, setOpacity] = useState(0.15);
  const [isInset, setIsInset] = useState(false);
  const [preset, setPreset] = useState<'custom' | 'card' | 'hover' | 'modal' | 'inset'>('hover');

  const applyPreset = (type: 'card' | 'hover' | 'modal' | 'inset') => {
    setPreset(type);
    if (type === 'card') {
      setX(0); setY(2); setBlur(8); setSpread(0); setOpacity(0.08); setIsInset(false);
    } else if (type === 'hover') {
      setX(0); setY(12); setBlur(24); setSpread(-4); setOpacity(0.15); setIsInset(false);
    } else if (type === 'modal') {
      setX(0); setY(25); setBlur(50); setSpread(-12); setOpacity(0.25); setIsInset(false);
    } else if (type === 'inset') {
      setX(0); setY(3); setBlur(6); setSpread(0); setOpacity(0.2); setIsInset(true);
    }
  };

  const shadowColor = `rgba(0, 0, 0, ${opacity})`;
  const shadowValue = `${isInset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${shadowColor}`;

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
          <span>Track 5: Visual Styling</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">Shadows &amp; Elevation</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 dark:from-amber-500/15 dark:via-slate-950 dark:to-amber-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <SunMedium className="h-3.5 w-3.5" />
              Visual Styling · Track 5
            </span>
            <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 font-mono text-xs font-bold text-orange-700 dark:text-orange-300">
              Core Concept 20
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Box Shadows, Drop Shadows &amp; Elevation
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            In physical reality, light produces natural ambient diffusion. Learn how to simulate physical depth with
            multi-layered shadows, and discover why <code className="text-amber-500 font-mono">filter: drop-shadow()</code> is required for transparent PNGs and speech-bubble arrows.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-500" />
              The Desk Lamp Model
            </a>
            <a
              href="#box-vs-filter"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-orange-500" />
              box-shadow vs. filter: drop-shadow
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-yellow-500" />
              Live Elevation Studio
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. The Real-World Mental Model: Desk Lamp &amp; Elevation
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Imagine a paper postcard resting on a desk with a lamp overhead.
            As you lift the card higher into the air (increasing its virtual Z-index elevation):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Low (Flat / Card)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Lying flat on desk. Shadow is sharp, dark, and hugs the edges tightly (<code className="font-mono">0 2px 4px rgba(0,0,0,0.06)</code>).
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Medium (Hover / Dropdown)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Lifted 2 inches. Shadow expands, softens, and drifts downward (<code className="font-mono">0 10px 20px -3px rgba(0,0,0,0.12)</code>).
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">High (Modal Dialog)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Hovering way above desk. Deep ambient diffusion creates broad, airy softness (<code className="font-mono">0 25px 50px -12px rgba(0,0,0,0.25)</code>).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Box-shadow vs Filter Drop-Shadow */}
      <section id="box-vs-filter" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Big Revelation: box-shadow vs. filter: drop-shadow()
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-rose-500" />
                box-shadow (Casts on Bounding Box)
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <code className="font-mono">box-shadow</code> only knows about the rectangular CSS box. If you apply it to a transparent PNG logo, star icon, or speech bubble with a pointy triangle arrow, it casts an ugly rectangular shadow around the invisible empty frame!
            </p>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <div
                className="w-20 h-20 bg-amber-400 clip-triangle flex items-center justify-center font-bold text-slate-900 text-xs"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.5)',
                }}
              >
                Triangle
              </div>
            </div>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              Notice: The box-shadow is completely invisible or clipped because clip-path chops it off!
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                filter: drop-shadow() (Traces Pixels)
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <code className="font-mono">filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2))</code> traces the actual alpha transparency channel of your element! It faithfully casts shadows along triangle edges, SVG stars, and PNG cutouts.
            </p>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <div
                className="w-20 h-20 bg-amber-400 flex items-center justify-center font-bold text-slate-900 text-xs"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  filter: 'drop-shadow(0 12px 12px rgba(0,0,0,0.35))',
                }}
              >
                Triangle
              </div>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Perfection! The shadow wraps the triangle's actual geometry.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Elevation Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Shadow Elevation Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Elevation Presets
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['card', 'hover', 'modal', 'inset'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    className={cn(
                      'py-1.5 text-xs font-bold capitalize rounded-lg border transition-all',
                      preset === p
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Y Offset (Vertical Drop)</span>
                  <span className="font-mono text-amber-500">{y}px</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="60"
                  value={y}
                  onChange={(e) => { setY(Number(e.target.value)); setPreset('custom'); }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Blur Radius (Diffusion)</span>
                  <span className="font-mono text-amber-500">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={blur}
                  onChange={(e) => { setBlur(Number(e.target.value)); setPreset('custom'); }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Spread Radius (Growth)</span>
                  <span className="font-mono text-amber-500">{spread}px</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="30"
                  value={spread}
                  onChange={(e) => { setSpread(Number(e.target.value)); setPreset('custom'); }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Shadow Opacity</span>
                  <span className="font-mono text-amber-500">{(opacity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => { setOpacity(Number(e.target.value)); setPreset('custom'); }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span>Inset Shadow (Indented Hole)</span>
                  <input
                    type="checkbox"
                    checked={isInset}
                    onChange={(e) => { setIsInset(e.target.checked); setPreset('custom'); }}
                    className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                Generated CSS
              </div>
              <div className="text-amber-300 break-all">
                box-shadow: {shadowValue};
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[380px]">
            <div
              className="w-72 rounded-3xl bg-white dark:bg-slate-900 p-6 flex flex-col justify-between transition-all duration-200 border border-slate-200/60 dark:border-slate-800/60 cursor-pointer"
              style={{
                boxShadow: shadowValue,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="font-mono text-[11px] text-slate-400">Elevation Card</span>
              </div>
              <div className="my-6 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Photorealistic Softness</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Negative spread radius pulls the shadow inward, eliminating harsh side edges!
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                <span>{preset.toUpperCase()}</span>
                <span>Y: {y}px</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Shadows</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The Harsh Pure Black Trap:</strong> Never write <code className="font-mono">box-shadow: 0 4px 10px black</code>. In the real world, shadows absorb ambient room color. Use low-opacity alpha values like <code className="font-mono">rgba(0, 0, 0, 0.08)</code> or tint the shadow with your brand hue (e.g. <code className="font-mono">rgba(15, 23, 42, 0.12)</code>).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Performance Killer:</strong> Animating <code className="font-mono">box-shadow</code> during a 60fps hover transition forces the browser CPU to re-paint blur pixels on every single animation frame. The professional trick is to put a second pseudo-element with the heavy shadow at <code className="font-mono">opacity: 0</code> and transition <code className="font-mono">opacity</code> instead (which is 100% GPU accelerated!).
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
            CSS Filters, Backdrop Effects &amp; Glassmorphism
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Build modern frosted glass UIs with backdrop-filter, explore mix-blend-mode, and color grading.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/filters"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 21</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
