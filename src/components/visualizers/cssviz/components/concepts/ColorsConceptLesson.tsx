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
  FlaskConical,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Info,
} from 'lucide-react';
import ColorLab from '../visualizers/ColorLab';
import { cn } from '../../utils/cn';

export default function ColorsConceptLesson() {
  const [hue, setHue] = useState(250);
  const [saturation, setSaturation] = useState(85);
  const [lightness, setLightness] = useState(55);
  const [alpha, setAlpha] = useState(1);
  const [colorSpace, setColorSpace] = useState<'hsl' | 'oklch' | 'rgb'>('oklch');

  // Computed colors
  const hslString = `hsl(${hue} ${saturation}% ${lightness}% / ${alpha})`;
  // Approximate conversion for OKLCH demonstration
  const oklchLightness = (lightness / 100).toFixed(2);
  const oklchChroma = ((saturation / 100) * 0.28).toFixed(3);
  const oklchString = `oklch(${oklchLightness} ${oklchChroma} ${hue} / ${alpha})`;

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-pink-600 dark:text-slate-300 dark:hover:text-pink-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 5: Visual Styling</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-pink-600 dark:text-pink-400 font-bold">Colors &amp; Color Spaces</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-rose-500/10 dark:from-pink-500/15 dark:via-slate-950 dark:to-purple-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/20 px-3 py-1 font-mono text-xs font-bold text-pink-700 dark:text-pink-300 border border-pink-500/30">
              <Palette className="h-3.5 w-3.5" />
              Visual Styling · Track 5
            </span>
            <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-3 py-1 font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
              Core Concept 17
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Colors, Gamuts &amp; Color Spaces
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Stop picking random hex codes from Google. Master how computer monitors generate light, why the 30-year-old
            sRGB standard fails on modern Retina screens, and how the modern <code className="text-pink-500 font-mono">oklch()</code> space gives you mathematically uniform, perceptual colors.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-pink-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-pink-500" />
              The Light Beam Mental Model
            </a>
            <a
              href="#color-spaces"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-pink-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-500" />
              Hex vs RGB vs HSL vs OKLCH
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-pink-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-rose-500" />
              Interactive Gamut Lab
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model Section */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. The 1st-Year Mental Model: Additive Light vs Physical Paint
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Real World Art Class (Subtractive Pigment)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When painting on paper, paint reflects ambient light while absorbing other wavelengths. If you mix Red, Yellow, and Blue together, it turns into a murky brown/black.
              Darkness is the baseline; ink takes light away.
            </p>
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs font-mono text-rose-800 dark:text-rose-300">
              Primary: Cyan, Magenta, Yellow, Black (CMYK)
              <br />
              All pigments combined = #000000 Black
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Your Monitor Screen (Additive Light)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A computer display is millions of microscopic LED flashlights. Black is the monitor turned off.
              When you fire all Red, Green, and Blue sub-pixels at 100% brightness simultaneously, the human eye perceives blinding pure White light!
            </p>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs font-mono text-emerald-800 dark:text-emerald-300">
              Primary: Red, Green, Blue (RGB)
              <br />
              All lights at maximum (255, 255, 255) = Pure White #ffffff
            </div>
          </div>
        </div>
      </section>

      {/* Evolution of Color Spaces */}
      <section id="color-spaces" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The 4 Generations of CSS Color Formats
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Format</th>
                <th className="p-4">Modern Syntax</th>
                <th className="p-4">Mental Formula</th>
                <th className="p-4">Limitation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Hexadecimal</td>
                <td className="p-4 font-mono text-xs text-pink-600 dark:text-pink-400">#3b82f6 or #3b82f6cc</td>
                <td className="p-4 text-xs">Base-16 red, green, blue (00-ff) + alpha</td>
                <td className="p-4 text-xs text-rose-500">Incomprehensible to humans without color picker</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">RGB (Legacy &amp; Modern)</td>
                <td className="p-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">rgb(59 130 246 / 0.8)</td>
                <td className="p-4 text-xs">0 to 255 channel levels + alpha opacity</td>
                <td className="p-4 text-xs text-amber-500">Hard to calculate "make this 15% darker" in head</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">HSL (Human Friendly)</td>
                <td className="p-4 font-mono text-xs text-emerald-600 dark:text-emerald-400">hsl(217 91% 60%)</td>
                <td className="p-4 text-xs">Hue wheel (0-360°), Saturation %, Lightness %</td>
                <td className="p-4 text-xs text-amber-500">
                  Perceptually uneven (Yellow 50% looks blinding; Blue 50% looks dark)
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 bg-pink-500/5">
                <td className="p-4 font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  OKLCH (Next-Gen)
                </td>
                <td className="p-4 font-mono text-xs text-pink-600 dark:text-pink-300 font-bold">
                  oklch(0.65 0.22 250 / 0.9)
                </td>
                <td className="p-4 text-xs">
                  Lightness (0-1), Chroma/Purity (0-0.4), Hue angle (0-360°)
                </td>
                <td className="p-4 text-xs text-emerald-500 font-semibold">
                  Zero flaw! Truly uniform human perception + accesses wide P3 gamut
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Color Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Lab: Test HSL vs Modern OKLCH
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Format Mode</span>
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                {(['oklch', 'hsl'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setColorSpace(mode)}
                    className={cn(
                      'px-3 py-1 text-xs font-mono font-bold rounded-md uppercase transition-colors',
                      colorSpace === mode
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Hue Angle</span>
                  <span className="font-mono text-pink-500">{hue}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Saturation / Chroma</span>
                  <span className="font-mono text-purple-500">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Lightness</span>
                  <span className="font-mono text-blue-500">{lightness}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={lightness}
                  onChange={(e) => setLightness(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Opacity / Alpha</span>
                  <span className="font-mono text-emerald-500">{alpha.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={alpha}
                  onChange={(e) => setAlpha(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">CSS Code Output</div>
              <div className="text-pink-400">
                {colorSpace === 'oklch' ? (
                  <>color: <span className="text-white font-bold">{oklchString}</span>;</>
                ) : (
                  <>color: <span className="text-white font-bold">{hslString}</span>;</>
                )}
              </div>
            </div>
          </div>

          {/* Preview Sandbox */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative h-64 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 border border-white/20"
              style={{
                backgroundColor: colorSpace === 'oklch' ? oklchString : hslString,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 font-mono text-xs font-bold text-white border border-white/20">
                  {colorSpace.toUpperCase()} Render Target
                </span>
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 font-mono text-xs font-bold text-white">
                  Alpha: {(alpha * 100).toFixed(0)}%
                </span>
              </div>

              <div className="space-y-2 text-white drop-shadow-md">
                <h3 className="text-2xl font-black">Modern UI Card Example</h3>
                <p className="text-xs max-w-md text-white/90">
                  Notice how altering hue in OKLCH keeps perceived brightness steady, preventing the washed-out yellow or dim blue problem common to HSL!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Display P3 Gamut</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  +25% Extra Vibrant Colors
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Accessibility Contrast</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-purple-500" />
                  {lightness > 60 ? 'Use Dark Text' : 'Use Light Text'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Deep Visualizer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
            <FlaskConical className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            4. Deep Visualizer: Gradients &amp; System Palette
          </h2>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-950/50 p-4 sm:p-6 shadow-inner">
          <ColorLab />
        </div>
      </section>

      {/* 5 First-Year Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: CSS Colors</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The Comma Trap:</strong> Modern CSS syntax uses spaces instead of commas: <code className="font-mono text-pink-500">rgb(255 100 50 / 0.8)</code> instead of <code className="font-mono text-slate-500">rgba(255, 100, 50, 0.8)</code>. The slash syntax clearly delineates channels from alpha!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Gray Mud Trap in Gradients:</strong> Interpolating between two colors in legacy sRGB often passes through an ugly desaturated gray middle. With modern CSS, add <code className="font-mono text-pink-500">in oklch</code>: <code className="font-mono text-purple-400">linear-gradient(in oklch to right, red, blue)</code> for breathtaking vibrant transitions.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">3.</span>
            <span>
              <strong>The "transparent" Keyword Trap:</strong> Historically, <code className="font-mono">transparent</code> was computed as <code className="font-mono">rgba(0, 0, 0, 0)</code> (transparent black). When fading from white to transparent, you might see a dirty grayish flash! Always fade to <code className="font-mono">rgb(255 255 255 / 0)</code> instead.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Backgrounds, Gradients &amp; Parallax Layers
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Stack multiple images, build pure CSS pie charts with conic gradients, and create fixed parallax effects.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/backgrounds"
          className="inline-flex items-center gap-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 18</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
