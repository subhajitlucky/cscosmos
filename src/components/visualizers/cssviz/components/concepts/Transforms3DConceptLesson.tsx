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
  Box,
  Rotate3d,
  Layers,
  AlertTriangle,
  RotateCw,
  Eye,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Transforms3DConceptLesson() {
  const [perspective, setPerspective] = useState(800);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeRotateY = isFlipped ? rotateY + 180 : rotateY;

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 8: Transitions &amp; Animation</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">3D Transforms &amp; Perspective</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 dark:from-indigo-500/15 dark:via-slate-950 dark:to-indigo-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
              <Box className="h-3.5 w-3.5" />
              Transitions &amp; Animation · Track 8
            </span>
            <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-3 py-1 font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
              Core Concept 32
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            3D Transforms, Perspective &amp; Card Flips
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Break through the screen surface. Learn the 3D coordinate system (X, Y, Z), understand how <code className="text-indigo-500 font-mono">perspective</code> controls camera focal length, and build the classic 3D flipping card with <code className="text-indigo-500 font-mono">preserve-3d</code> and <code className="text-indigo-500 font-mono">backface-visibility</code>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
              Cinema Camera Distance Model
            </a>
            <a
              href="#card-flip-trinity"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-500" />
              The 3D Card Flip Trinity
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              Interactive 3D Card Studio
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: Camera Distance &amp; The Z-Axis
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            In 2D CSS, you only have X (horizontal) and Y (vertical). 3D introduces the <strong>Z-axis</strong>, pointing directly perpendicular from your monitor screen into your eyes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Small perspective (200px)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Camera is 2 inches away. Extreme fisheye lens drama! Edge vanishing points slant sharply.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Sweet Spot (800px - 1000px)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Matches the natural perspective of a human standing 2 feet away from a desktop computer monitor.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">No perspective (Default)</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Orthographic projection. Rotating an element in 3D just squishes it flat like a deflating balloon!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 3D Card Flip Trinity */}
      <section id="card-flip-trinity" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Sacred 3D Card Flip Trinity
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs sm:text-sm text-indigo-300 space-y-3 overflow-x-auto">
            <div className="text-slate-400 font-sans font-bold">/* 1. Parent: Establishes the 3D Theater room */</div>
            <div>.card-container &#123;</div>
            <div className="pl-4 text-cyan-300">perspective: 1000px;</div>
            <div>&#125;</div>

            <div className="text-slate-400 font-sans font-bold pt-2">/* 2. Flipper: Preserves true 3D spatial depth for children */</div>
            <div>.card-flipper &#123;</div>
            <div className="pl-4 text-purple-300">transform-style: preserve-3d;</div>
            <div className="pl-4">transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);</div>
            <div>&#125;</div>

            <div className="text-slate-400 font-sans font-bold pt-2">/* 3. Faces: Front &amp; Back hide their reverse sides */</div>
            <div>.card-front, .card-back &#123;</div>
            <div className="pl-4 text-emerald-400">backface-visibility: hidden;</div>
            <div className="pl-4">position: absolute; inset: 0;</div>
            <div>&#125;</div>
            <div>.card-back &#123;</div>
            <div className="pl-4 text-indigo-300">transform: rotateY(180deg);</div>
            <div>&#125;</div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live 3D Credit Card Gimbal
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Camera Perspective</span>
                  <span className="font-mono text-indigo-500">{perspective}px</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={perspective}
                  onChange={(e) => setPerspective(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Rotate X (Pitch / Tilt)</span>
                  <span className="font-mono text-purple-500">{rotateX}°</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={rotateX}
                  onChange={(e) => setRotateX(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Rotate Y (Yaw / Spin)</span>
                  <span className="font-mono text-cyan-500">{rotateY}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={rotateY}
                  onChange={(e) => setRotateY(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              <span>{isFlipped ? 'Flip Back to Front' : 'Flip Card 180°'}</span>
            </button>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                Computed 3D Transform
              </div>
              <div className="text-indigo-300 break-all">
                perspective: {perspective}px;
                <br />
                transform: rotateX({rotateX}deg) rotateY({activeRotateY}deg);
              </div>
            </div>
          </div>

          {/* Interactive 3D Canvas */}
          <div
            className="lg:col-span-7 flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[380px]"
            style={{ perspective: `${perspective}px` }}
          >
            {/* The 3D Rotating Flipper */}
            <div
              className="relative w-72 h-44 cursor-pointer select-none transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotateX}deg) rotateY(${activeRotateY}deg)`,
              }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front Face */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-6 flex flex-col justify-between text-white shadow-2xl border border-white/20"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs tracking-widest uppercase font-bold">Titanium Metal</span>
                  <Box className="h-5 w-5 opacity-80" />
                </div>
                <div className="font-mono text-base tracking-widest">•••• •••• •••• 8842</div>
                <div className="flex justify-between items-center text-xs opacity-90">
                  <span>CS COSMOS PRO</span>
                  <span className="font-mono">11/28</span>
                </div>
              </div>

              {/* Back Face */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 flex flex-col justify-between text-white shadow-2xl border border-white/10"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="h-7 w-full bg-slate-950 rounded -mx-6 px-6 mt-1" />
                <div className="flex items-center justify-end gap-2 text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">CVV</span>
                  <span className="font-mono font-bold bg-white text-slate-900 px-2 py-0.5 rounded">942</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Authorized signature required. Issued by CSS Universe Bank.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: 3D Transforms</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Declaring perspective on the wrong element:</strong> Always put <code className="font-mono">perspective: 1000px</code> on the <strong>parent container</strong> (the scene wrapper), NOT on the rotating card itself! Declaring perspective on the element itself creates bizarre localized camera distortions.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Missing WebKit Prefix for backface-visibility:</strong> Safari on macOS and iOS frequently glitches or fails to hide the back face of 3D cards without <code className="font-mono text-indigo-400">-webkit-backface-visibility: hidden;</code>. Always declare both prefixes together!
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Motion Path: offset-path &amp; SVG Trajectories
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Animate icons and rockets along custom curved SVG paths using offset-path and offset-distance.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/motion-path"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 33</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
