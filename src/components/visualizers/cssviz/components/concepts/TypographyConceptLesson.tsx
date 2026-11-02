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
  Type,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react';
import TypographyLab from '../visualizers/TypographyLab';
import { cn } from '../../utils/cn';

export default function TypographyConceptLesson() {
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'justify'>('left');
  const [textWrapBalance, setTextWrapBalance] = useState(true);

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
          <span>Track 6: Typography</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Typography &amp; Layout</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-purple-500/10 dark:from-indigo-500/15 dark:via-slate-950 dark:to-indigo-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
              <Type className="h-3.5 w-3.5" />
              Typography · Track 6
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 23
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Typography, Vertical Rhythm &amp; Readability
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            95% of web design is typography. Master why you must <strong className="text-indigo-500 font-semibold">always use unitless line-height</strong>, the 65-character rule for human eye comfort, and modern CSS <code className="text-indigo-500 font-mono">text-wrap: balance</code>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
              Vertical Rhythm Mental Model
            </a>
            <a
              href="#unitless-lineheight"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-500" />
              The Unitless line-height Rule
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-blue-500" />
              Live Readability Studio
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
            1. The Gutenberg Mental Model: The 65-Character Line Length Rule
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            When humans read a line of text, our eyes travel horizontally from left to right.
            At the end of the line, our brain performs a "carriage return" to locate the beginning of the next line.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 space-y-2">
              <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">Line Too Long (&gt; 85 characters)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                If text stretches all the way across a 27-inch 4K monitor, your eyes lose their place when jumping back to the next line. Readers constantly reread the same line twice, causing extreme eye fatigue!
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">The Golden Ratio (45 - 75 characters)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Set <code className="font-mono text-emerald-500">max-width: 65ch;</code> on your prose articles. The <code className="font-mono">ch</code> unit matches the exact width of the character "0", guaranteeing effortless reading rhythm!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Sacred Unitless line-height Rule */}
      <section id="unitless-lineheight" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Most Important Rule in CSS Typography: Always Use Unitless line-height!
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="font-bold text-rose-500 font-mono text-xs">❌ NEVER DO THIS: line-height: 1.5em;</div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-rose-300 space-y-1">
                <div>body &#123;</div>
                <div className="pl-4">font-size: 16px;</div>
                <div className="pl-4 text-rose-400">line-height: 1.5em; /* Computes to 24px! */</div>
                <div>&#125;</div>
                <div>h1 &#123;</div>
                <div className="pl-4">font-size: 48px;</div>
                <div className="pl-4 text-rose-400">/* Inherits fixed 24px! Letters collide and overlap! */</div>
                <div>&#125;</div>
              </div>
              <p className="text-xs text-slate-500">
                When you use a unit like <code className="font-mono">em</code>, the parent computes a static pixel value once (16 × 1.5 = 24px). The child heading inherits the static 24px height, causing 48px letters to crash into each other!
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-emerald-500 font-mono text-xs">✅ ALWAYS DO THIS: line-height: 1.5;</div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 space-y-1">
                <div>body &#123;</div>
                <div className="pl-4">font-size: 16px;</div>
                <div className="pl-4 text-emerald-400">line-height: 1.5; /* Unitless multiplier! */</div>
                <div>&#125;</div>
                <div>h1 &#123;</div>
                <div className="pl-4">font-size: 48px;</div>
                <div className="pl-4 text-emerald-400">/* Computes 48px × 1.5 = 72px! Perfect spacing! */</div>
                <div>&#125;</div>
              </div>
              <p className="text-xs text-slate-500">
                A unitless number is inherited as a pure mathematical multiplier. Every child element multiplies its own font-size by 1.5!
              </p>
            </div>
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
            3. Interactive Studio: Live Readability &amp; text-wrap: balance
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Font Size</span>
                  <span className="font-mono text-indigo-500">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="32"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Line Height (Unitless Multiplier)</span>
                  <span className="font-mono text-purple-500">{lineHeight.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.4"
                  step="0.05"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Letter Spacing (Tracking)</span>
                  <span className="font-mono text-blue-500">{letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="6"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Text Alignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'left', icon: AlignLeft },
                      { id: 'center', icon: AlignCenter },
                      { id: 'justify', icon: AlignJustify },
                    ] as const
                  ).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setTextAlign(item.id)}
                        className={cn(
                          'py-1.5 flex items-center justify-center rounded-lg border capitalize text-xs font-bold transition-all',
                          textAlign === item.id
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span>text-wrap: balance (No Lonely Widows)</span>
                  <input
                    type="checkbox"
                    checked={textWrapBalance}
                    onChange={(e) => setTextWrapBalance(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
                CSS Typography Rules
              </div>
              <div className="text-indigo-300">font-size: {fontSize}px;</div>
              <div className="text-purple-300">line-height: {lineHeight};</div>
              <div className="text-blue-300">letter-spacing: {letterSpacing}px;</div>
              <div className="text-emerald-300">text-align: {textAlign};</div>
              {textWrapBalance && <div className="text-pink-300">text-wrap: balance;</div>}
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6 shadow-sm">
            <div className="space-y-3">
              <h3
                className="text-2xl font-black text-slate-900 dark:text-white"
                style={{
                  textWrap: textWrapBalance ? ('balance' as any) : 'wrap',
                }}
              >
                The Future of Modern Web Interface Typography
              </h3>
              <p
                className="text-slate-700 dark:text-slate-300 transition-all max-w-[65ch]"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  letterSpacing: `${letterSpacing}px`,
                  textAlign: textAlign,
                }}
              >
                Good typography makes words feel natural and frictionless. When line-height is proportional to font size and line length is capped at sixty-five characters, users can read thousands of words without experiencing cognitive exhaustion.
              </p>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>
                <strong>text-wrap: balance</strong> automatically calculates line breaks so all headline lines have roughly equal width!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Visualizer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <FlaskConical className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            4. Deep Visualizer: Variable Font Axes &amp; Rhythm
          </h2>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-950/50 p-4 sm:p-6 shadow-inner">
          <TypographyLab />
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Typography</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>The Mobile Long Word Overflow Trap:</strong> Long URLs or words like <code className="font-mono">Supercalifragilisticexpialidocious</code> will burst through card borders on mobile viewports. Always add <code className="font-mono text-indigo-500">overflow-wrap: break-word;</code> to prevent horizontal page scrolling!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The <code className="font-mono">text-align: justify</code> River Trap:</strong> While newspaper print engines hyphenate carefully, browsers doing <code className="font-mono">text-align: justify</code> stretch whitespace unevenly, creating distracting white "rivers" flowing through paragraphs. Stick with <code className="font-mono">text-align: left</code> or combine with <code className="font-mono">hyphens: auto</code>.
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
            Web Fonts, @font-face &amp; Variable Fonts
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Eliminate FOUT/FOIT with font-display: swap, preload critical woff2 assets, and master multi-axis variable fonts.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/fonts"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 24</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
