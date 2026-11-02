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
  Binary,
  Cpu,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function HoudiniTypedOmConceptLesson() {
  const [pixelValue, setPixelValue] = useState(32);

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
          <span>Track 9: Houdini APIs</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-cyan-600 dark:text-cyan-400 font-bold">Typed OM</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-teal-500/10 dark:from-cyan-500/15 dark:via-slate-950 dark:to-cyan-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              <Binary className="h-3.5 w-3.5" />
              Houdini API Trilogy · Concept 40
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Type-Safe CSS
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Houdini Typed OM: Goodbye String Parsing
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            For 25 years, JavaScript treated CSS as raw strings like <code className="text-cyan-500 font-mono">&quot;24px&quot;</code>, requiring messy <code className="font-mono">parseInt()</code> and string concatenation. The Houdini Typed Object Model turns CSS into strongly-typed objects: <code className="text-cyan-500 font-mono">CSS.px(24)</code>, eliminating string parsing bugs and boosting performance by up to 30%!
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
              String Clutter vs Typed Objects
            </a>
            <a
              href="#typed-syntax"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-blue-500" />
              attributeStyleMap &amp; CSS.px()
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-teal-500" />
              Live Typed Math Playground
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
            1. Mental Model: String Chopping vs. Native Integers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 p-6 space-y-3">
            <h3 className="font-bold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Legacy CSSOM (String Concatenation Hell)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              To add 10px in classic JavaScript, you had to slice the <code className="font-mono">&quot;px&quot;</code> off the string, parse it as an integer, add 10, re-concatenate <code className="font-mono">+ &apos;px&apos;</code>, and set it. The browser then had to re-parse the string back into C++ floating-point numbers!
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-3">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Houdini Typed OM (Direct C++ Memory)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              With Typed OM, properties are direct numeric objects: <code className="font-mono text-emerald-500">CSS.px(32)</code>. The browser speaks directly to its C++ memory layout engine with zero string serialization or parsing overhead!
            </p>
          </div>
        </div>
      </section>

      {/* Typed OM Syntax */}
      <section id="typed-syntax" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. Code Comparison: Legacy style vs. attributeStyleMap
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-rose-500">Old String Way (Slow &amp; Bug-Prone)</div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-rose-300 space-y-1">
                <div>// Setting:</div>
                <div>el.style.fontSize = (size + 4) + &apos;px&apos;;</div>
                <div className="pt-2">// Reading:</div>
                <div>const raw = el.style.fontSize; // &quot;24px&quot;</div>
                <div>const num = parseInt(raw, 10); // 24</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-emerald-500">New Typed OM (Type-Safe &amp; Fast)</div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 space-y-1">
                <div>// Setting:</div>
                <div>el.attributeStyleMap.set(&apos;font-size&apos;, CSS.px(28));</div>
                <div className="pt-2">// Reading:</div>
                <div>const unitValue = el.attributeStyleMap.get(&apos;font-size&apos;);</div>
                <div>console.log(unitValue.value); // 28 (pure number!)</div>
              </div>
            </div>
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
            3. Interactive Studio: Live Typed Unit Arithmetic
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>CSS.px() Constructor Value</span>
                <span className="font-mono text-cyan-500">{pixelValue}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="64"
                value={pixelValue}
                onChange={(e) => setPixelValue(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                Typed Object Representation
              </div>
              <div className="text-cyan-300">
                CSSUnitValue &#123; value: {pixelValue}, unit: &quot;px&quot; &#125;
              </div>
              <div className="text-emerald-400">
                el.attributeStyleMap.set(&apos;font-size&apos;, CSS.px({pixelValue}));
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[300px]">
            <div
              className="text-center font-black text-slate-900 dark:text-white transition-all duration-150"
              style={{ fontSize: `${pixelValue}px` }}
            >
              Type-Safe Typography
            </div>
            <p className="text-xs font-mono text-slate-500 mt-2">
              Value stored as native integer: <strong>{pixelValue}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Typed OM</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Kebab-case property names in attributeStyleMap:</strong> When using <code className="font-mono">el.style</code>, you wrote camelCase: <code className="font-mono">el.style.fontSize</code>. In Typed OM&apos;s <code className="font-mono">attributeStyleMap</code>, you write the true CSS kebab-case string: <code className="font-mono text-cyan-500">el.attributeStyleMap.set(&apos;font-size&apos;, CSS.px(24))</code>!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>computedStyleMap vs attributeStyleMap:</strong> <code className="font-mono">el.attributeStyleMap</code> only accesses inline styles. To inspect inherited or stylesheet values, use <code className="font-mono text-blue-500">el.computedStyleMap().get(&apos;font-size&apos;)</code>.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Final Masterclass · Concept 41 (Grand Finale)
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            CSS Houdini Layout API: Custom Layout Algorithms
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Write your own custom display layouts in browser worklets, like masonry grids and circular layouts.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/houdini-layout"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Final Concept 41</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
