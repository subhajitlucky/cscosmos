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
  Sparkle,
  Camera,
  Layers,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function FiltersConceptLesson() {
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);

  // Glassmorphism controls
  const [glassBlur, setGlassBlur] = useState(16);
  const [glassOpacity, setGlassOpacity] = useState(0.2);

  const filterString = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) invert(${invert}%)`;

  const resetFilters = () => {
    setBlur(0);
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
    setHueRotate(0);
    setInvert(0);
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
          <span>Track 5: Visual Styling</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Filters &amp; Backdrop Effects</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-500/15 dark:via-slate-950 dark:to-emerald-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Camera className="h-3.5 w-3.5" />
              Visual Styling · Track 5
            </span>
            <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-1 font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
              Core Concept 21
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Filters, Backdrop &amp; Glassmorphism
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Turn your CSS into Adobe Photoshop. Understand the critical architectural distinction between <code className="text-emerald-500 font-mono">filter</code> (which affects the element itself) and <code className="text-emerald-500 font-mono">backdrop-filter</code> (which blurs the universe behind it).
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
              Camera Lens vs Frosted Glass
            </a>
            <a
              href="#glassmorphism"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-500" />
              The Glassmorphism Recipe
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              Live Color Grading Studio
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
            1. Mental Model: Camera Lens Filter vs. Frosted Glass Pane
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-500" />
                The Camera Lens (<code className="font-mono text-emerald-500">filter</code>)
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When you put a sepia or polarized lens directly in front of your camera, the photo itself is altered.
              Applying <code className="font-mono">filter: blur(8px)</code> blurs the element, its text, and all its children.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
              <div>• Modifies the element itself &amp; its children</div>
              <div>• Operates on the rendered pixel buffer</div>
              <div>• Syntax: filter: blur(5px) grayscale(100%);</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkle className="h-4 w-4 text-teal-500" />
                The Frosted Window (<code className="font-mono text-teal-500">backdrop-filter</code>)
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Imagine looking through a frosted glass window in a shower. The text written on the glass surface is crystal clear;
              only the room <strong>behind the window</strong> appears blurred!
            </p>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
              <div>• Modifies only the area BEHIND the element</div>
              <div>• Child text remains 100% sharp and readable</div>
              <div>• Crucial: Requires semi-transparent background to see through</div>
            </div>
          </div>
        </div>
      </section>

      {/* Glassmorphism Anatomy */}
      <section id="glassmorphism" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The 4-Ingredient Glassmorphism Recipe
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Frosted glass interfaces look sleek on modern web apps (like macOS and iOS). To achieve this, you need four coordinated properties:
          </p>

          <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs sm:text-sm text-teal-300 space-y-2 overflow-x-auto">
            <div className="text-slate-400 font-sans font-bold">.glass-panel &#123;</div>
            <div className="pl-4 text-emerald-400">/* 1. Semi-transparent background (never solid!) */</div>
            <div className="pl-4">background: rgba(255, 255, 255, 0.15);</div>
            <div className="pl-4 text-emerald-400">/* 2. Backdrop blur */</div>
            <div className="pl-4">-webkit-backdrop-filter: blur(16px);</div>
            <div className="pl-4">backdrop-filter: blur(16px);</div>
            <div className="pl-4 text-emerald-400">/* 3. Subtle translucent rim border */</div>
            <div className="pl-4">border: 1px solid rgba(255, 255, 255, 0.25);</div>
            <div className="pl-4 text-emerald-400">/* 4. Deep soft elevation shadow */</div>
            <div className="pl-4">box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);</div>
            <div className="text-slate-400 font-sans font-bold">&#125;</div>
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
            3. Interactive Studio: Live Filter &amp; Glassmorphism Sandbox
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Photo Filter Controls
              </span>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Blur</span>
                  <span className="font-mono text-emerald-500">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Brightness</span>
                  <span className="font-mono text-teal-500">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Contrast</span>
                  <span className="font-mono text-cyan-500">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Grayscale</span>
                  <span className="font-mono text-slate-500">{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="w-full accent-slate-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Hue Rotate</span>
                  <span className="font-mono text-purple-500">{hueRotate}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hueRotate}
                  onChange={(e) => setHueRotate(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Invert</span>
                  <span className="font-mono text-rose-500">{invert}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={invert}
                  onChange={(e) => setInvert(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                CSS filter code
              </div>
              <div className="text-emerald-300 break-all">
                filter: {filterString};
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 space-y-6">
            {/* Filtered Canvas Target */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 p-6 shadow-xl">
              <div className="relative rounded-2xl overflow-hidden h-56 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-indigo-600 to-amber-400 transition-all duration-150"
                  style={{
                    filter: filterString,
                  }}
                />
                <div className="relative z-10 text-center text-white drop-shadow-lg p-4">
                  <h4 className="text-xl font-black">Filtered Subject Graphic</h4>
                  <p className="text-xs text-white/90 font-mono mt-1">Real-time GPU Filter Shader Pipeline</p>
                </div>
              </div>
            </div>

            {/* Glassmorphism Sandbox Target */}
            <div className="relative h-48 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-6 flex items-center justify-center">
              {/* Colorful shapes behind */}
              <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-rose-500 blur-sm animate-pulse" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-cyan-400 blur-sm" />
              <div className="absolute top-10 right-20 w-20 h-20 rounded-full bg-amber-400 blur-sm" />

              {/* Frosted Glass Overlay Card */}
              <div
                className="relative z-10 w-80 rounded-2xl p-5 border border-white/30 text-white shadow-2xl transition-all"
                style={{
                  background: `rgba(255, 255, 255, ${glassOpacity})`,
                  backdropFilter: `blur(${glassBlur}px)`,
                  WebkitBackdropFilter: `blur(${glassBlur}px)`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-white">Frosted Glass</span>
                  <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full">backdrop-filter</span>
                </div>
                <p className="text-xs text-white/90">
                  Notice how text remains ultra-sharp while background spheres dissolve into a buttery frosted haze!
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
          <h2 className="text-xl font-bold">First-Year Student Traps: Filters</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The Opaque Background Trap:</strong> If your card has <code className="font-mono">background: #ffffff</code>, adding <code className="font-mono">backdrop-filter: blur(12px)</code> will do <em>nothing</em>! You cannot see through opaque paint. Always use <code className="font-mono">rgba(255, 255, 255, 0.2)</code>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Fixed Position Stacking Trap:</strong> Applying any <code className="font-mono">filter</code> or <code className="font-mono">transform</code> to a container creates a new containing block. Any child with <code className="font-mono">position: fixed</code> will now be trapped inside this container instead of anchoring to the browser viewport!
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
            Clip-path, Geometric Shapes &amp; CSS Masking
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Cut elements like cookie dough with circle, polygon, and SVG paths, and master alpha masking.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/clipping"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 22</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
