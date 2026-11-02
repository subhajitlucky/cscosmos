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
  Sun,
  Moon,
} from 'lucide-react';
import VariablesLab from '../visualizers/VariablesLab';
import { cn } from '../../utils/cn';

export default function VariablesConceptLesson() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [brandColor, setBrandColor] = useState('#f59e0b');
  const [cardRadius, setCardRadius] = useState(16);

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
          <span>Track 4: Units &amp; Math</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">CSS Variables</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-lime-500/30 bg-gradient-to-br from-lime-500/10 via-slate-900/5 to-emerald-500/10 dark:from-lime-500/15 dark:via-slate-950 dark:to-emerald-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/20 px-3 py-1 font-mono text-xs font-bold text-lime-700 dark:text-lime-300 border border-lime-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Dynamic Tokens · Track 4 Capstone
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 16
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Custom Properties (Variables)
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            Live, reactive design tokens in pure CSS. Define variables on <code>:root</code>, scope them to components, update them with JavaScript, and toggle dark mode themes in 1 line of code.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#variables-theme-studio"
              className="inline-flex items-center gap-2 rounded-xl bg-lime-600 hover:bg-lime-500 text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Sliders className="h-4 w-4" />
              <span>Interactive Theme Tokens</span>
            </a>
            <a
              href="#variables-lab"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <FlaskConical className="h-4 w-4 text-lime-400" />
              <span>Variables Visualizer Lab</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Theme Tokens Demo */}
      <section id="variables-theme-studio" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lime-600 dark:text-lime-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>1. Live CSS Variable Token Sandbox</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Inspect Scoped Design Tokens
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <button
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 font-bold flex items-center gap-2"
            >
              {themeMode === 'dark' ? <Moon className="h-4 w-4 text-amber-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
              <span>Theme: --bg &amp; --text ({themeMode})</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">--brand-color:</span>
              {['#f59e0b', '#6366f1', '#10b981', '#ec4899'].map((c) => (
                <button
                  key={c}
                  onClick={() => setBrandColor(c)}
                  className="h-6 w-6 rounded-full border-2 border-slate-300 dark:border-slate-700"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="space-y-1">
              <span className="text-slate-500">--radius: {cardRadius}px</span>
              <input
                type="range"
                min="0"
                max="32"
                value={cardRadius}
                onChange={(e) => setCardRadius(Number(e.target.value))}
                className="w-28 accent-lime-500"
              />
            </div>
          </div>

          {/* Card rendered purely using CSS variables */}
          <div
            className="p-6 transition-all duration-300 shadow-md border"
            style={
              {
                '--card-bg': themeMode === 'dark' ? '#0f172a' : '#ffffff',
                '--card-text': themeMode === 'dark' ? '#f8fafc' : '#0f172a',
                '--card-border': themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                '--card-brand': brandColor,
                '--card-radius': `${cardRadius}px`,
                backgroundColor: 'var(--card-bg)',
                color: 'var(--card-text)',
                borderColor: 'var(--card-border)',
                borderRadius: 'var(--card-radius)',
              } as React.CSSProperties
            }
          >
            <div className="space-y-2">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold"
                style={{
                  backgroundColor: 'var(--card-brand)',
                  color: '#0f172a',
                }}
              >
                var(--card-brand)
              </span>
              <h3 className="font-bold text-lg">Reactive Component Token</h3>
              <p className="text-xs text-slate-400">
                Notice: The HTML element doesn&apos;t care if it&apos;s dark mode or light mode! It simply reads <code>var(--card-bg)</code> and <code>var(--card-text)</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Visualizer Lab Integration */}
      <section id="variables-lab" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lime-600 dark:text-lime-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>2. Full Variables Workbench</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Interactive Variables Visualizer
        </h2>
        <VariablesLab />
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Track 4 Complete! Next: Track 5</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">17. Colors &amp; Modern OKLCH</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            P3 wide gamut color spaces, perceptual lightness in OKLCH, and accessible contrast.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/colors"
          className="inline-flex items-center gap-2 rounded-xl bg-lime-600 hover:bg-lime-500 text-slate-950 font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Begin Track 5: Colors</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
