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
  Accessibility,
  Eye,
  Keyboard,
  Contrast,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function AccessibilityConceptLesson() {
  const [bgLightness, setBgLightness] = useState(95);
  const [textLightness, setTextLightness] = useState(20);
  const [isKeyboardTab, setIsKeyboardTab] = useState(true);

  // Approximate relative luminance calculation
  const l1 = Math.max(bgLightness, textLightness) / 100;
  const l2 = Math.min(bgLightness, textLightness) / 100;
  const contrastRatio = ((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
  const passesNormalText = Number(contrastRatio) >= 4.5;
  const passesLargeText = Number(contrastRatio) >= 3.0;

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 7: Responsive Architecture</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-rose-600 dark:text-rose-400 font-bold">Accessibility in CSS (a11y)</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-purple-500/10 dark:from-rose-500/15 dark:via-slate-950 dark:to-rose-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 font-mono text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-500/30">
              <Accessibility className="h-3.5 w-3.5" />
              Responsive Architecture · Track 7
            </span>
            <span className="rounded-full bg-pink-500/15 border border-pink-500/30 px-3 py-1 font-mono text-xs font-bold text-pink-700 dark:text-pink-300">
              Core Concept 28
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Accessibility in CSS (a11y)
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Building accessible websites isn&apos;t just empathy—it&apos;s good engineering and law (WCAG 2.2). Master the superpower of <code className="text-rose-500 font-mono">:focus-visible</code>, calculate mathematical color contrast ratios, and master the bulletproof <code className="text-rose-500 font-mono">.sr-only</code> pattern.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#focus-visible"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-rose-500 transition-all"
            >
              <Keyboard className="h-3.5 w-3.5 text-rose-500" />
              :focus vs. :focus-visible
            </a>
            <a
              href="#contrast-math"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-rose-500 transition-all"
            >
              <Contrast className="h-3.5 w-3.5 text-pink-500" />
              WCAG 4.5:1 Contrast Ratio
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-rose-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-purple-500" />
              Live Accessibility Simulator
            </a>
          </div>
        </div>
      </div>

      {/* Focus vs Focus-Visible */}
      <section id="focus-visible" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
            <Keyboard className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. The Keyboard Warrior: :focus vs. :focus-visible
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-amber-500 font-mono text-xs">The Old Issue</span>
              <span>The :focus Pseudo-Class</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Whenever a user clicks a button with a mouse, <code className="font-mono">:focus</code> applies.
              Designers hated the blue halo on mouse clicks and rashly wrote <code className="font-mono text-rose-500">outline: none;</code>, making the site unusable for blind/motor-impaired users navigating with keyboard Tab keys!
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-3 shadow-sm">
            <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <span className="text-emerald-500 font-mono text-xs">The Modern Standard</span>
              <span>The :focus-visible Pseudo-Class</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <code className="font-mono text-emerald-500">:focus-visible</code> only activates when the browser detects keyboard navigation (pressing Tab or Arrow keys)! Mouse clicks remain clean, while keyboard users get bright, glowing navigation rings.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300">
              button:focus-visible &#123;
              <br />
              &nbsp;&nbsp;outline: 3px solid #3b82f6;
              <br />
              &nbsp;&nbsp;outline-offset: 4px;
              <br />
              &#125;
            </div>
          </div>
        </div>
      </section>

      {/* Screen Reader Only Pattern */}
      <section id="contrast-math" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
            <Eye className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Bulletproof .sr-only Pattern (Screen Reader Only)
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Never use <code className="font-mono text-rose-500">display: none</code> or <code className="font-mono text-rose-500">visibility: hidden</code> to hide visual icons. Screen readers completely drop elements with <code className="font-mono">display: none</code> from the accessibility accessibility tree! Use this standard 7-line utility instead:
          </p>

          <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs sm:text-sm text-pink-300 space-y-1 overflow-x-auto">
            <div className="text-slate-400 font-sans font-bold">.sr-only &#123;</div>
            <div className="pl-4">position: absolute;</div>
            <div className="pl-4">width: 1px;</div>
            <div className="pl-4">height: 1px;</div>
            <div className="pl-4">padding: 0;</div>
            <div className="pl-4">margin: -1px;</div>
            <div className="pl-4">overflow: hidden;</div>
            <div className="pl-4">clip-path: inset(50%);</div>
            <div className="pl-4">white-space: nowrap;</div>
            <div className="pl-4">border: 0;</div>
            <div className="text-slate-400 font-sans font-bold">&#125;</div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Live Focus Ring &amp; Contrast Analyzer
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Background Lightness</span>
                  <span className="font-mono text-rose-500">{bgLightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bgLightness}
                  onChange={(e) => setBgLightness(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Text Lightness</span>
                  <span className="font-mono text-pink-500">{textLightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={textLightness}
                  onChange={(e) => setTextLightness(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span>Simulate Keyboard Navigation (Tab Mode)</span>
                  <input
                    type="checkbox"
                    checked={isKeyboardTab}
                    onChange={(e) => setIsKeyboardTab(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-3 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-sans font-bold uppercase tracking-wider">
                  WCAG 2.2 Contrast Ratio
                </span>
                <span className="text-base font-bold text-white">{contrastRatio} : 1</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  {passesNormalText ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                  <span>Normal Text (Requires 4.5:1): {passesNormalText ? 'PASS' : 'FAIL'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {passesLargeText ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                  <span>Large Text 18pt+ (Requires 3.0:1): {passesLargeText ? 'PASS' : 'FAIL'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[340px]">
            <div
              className="w-full max-w-md rounded-3xl p-8 space-y-5 shadow-lg transition-all duration-150"
              style={{
                backgroundColor: `hsl(0 0% ${bgLightness}%)`,
                color: `hsl(0 0% ${textLightness}%)`,
              }}
            >
              <h4 className="text-2xl font-black">Accessibility Verification</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Legibility allows users in bright sunlight, on low-end screens, or with visual impairments to consume your interface without squinting.
              </p>

              <button
                className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: `hsl(0 0% ${textLightness}%)`,
                  color: `hsl(0 0% ${bgLightness}%)`,
                  outline: isKeyboardTab ? '3px solid #3b82f6' : 'none',
                  outlineOffset: '4px',
                }}
              >
                {isKeyboardTab ? ':focus-visible active (Tab Key)' : 'Mouse Clicked (Clean Ring)'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Accessibility</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Relying Exclusively on Color for Error States:</strong> If an invalid input field only turns red without an error text icon or message, the 8% of male users with red-green colorblindness will have no idea why their form won&apos;t submit! Always pair color with an icon and clear message.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>Ignoring Reduced Motion Preferences:</strong> Excessive parallax scrolling or bouncing hero animations can trigger genuine vertigo and nausea in users with vestibular disorders. Always wrap intense animations in <code className="font-mono text-rose-500">@media (prefers-reduced-motion: no-preference)</code>!
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Next Masterclass
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Print Stylesheets &amp; Clean PDF Generation
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Format invoices and receipts for physical paper with @media print, page breaks, and @page margins.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/print"
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 29</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
