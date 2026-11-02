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
  Printer,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileDown,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function PrintStylingConceptLesson() {
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [showUrls, setShowUrls] = useState(true);

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          href="/fullstack/css-cosmos/concepts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Concepts</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>CSS Universe</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Track 7: Responsive Architecture</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">Print Stylesheets</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-400/30 bg-gradient-to-br from-slate-400/10 via-slate-600/5 to-slate-800/10 dark:from-slate-700/20 dark:via-slate-950 dark:to-slate-900/40 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/20 px-3 py-1 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-500/30">
              <Printer className="h-3.5 w-3.5" />
              Responsive Architecture · Track 7 Capstone
            </span>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              Core Concept 29
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Print Stylesheets &amp; Clean PDF Output
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Every e-commerce receipt, resume, and medical portal requires physical paper printing.
            Learn how <code className="text-blue-500 font-mono">@media print</code> strips useless navigation bars, prevents cards from being sliced across page breaks, and automatically prints link URLs!
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#mental-model"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-slate-500 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-slate-600" />
              Laser Printer vs Glass Screen
            </a>
            <a
              href="#page-breaks"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-slate-500 transition-all"
            >
              <Code2 className="h-3.5 w-3.5 text-blue-500" />
              Page Breaks &amp; @page Margins
            </a>
            <a
              href="#interactive-studio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-slate-500 transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-indigo-500" />
              Live Print Simulator
            </a>
          </div>
        </div>
      </div>

      {/* Mental Model */}
      <section id="mental-model" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Mental Model: Continuous Pixels vs. Discrete Physical Paper
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            The web is an infinite scroll continuous canvas. But when sent to a printer, the browser must divide your page into rigid physical paper boundaries (like A4 or US Letter sheets).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Kill the Clutter</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Hide navbars, sidebars, video players, and action buttons. Paper cannot be clicked!
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Save Black Ink</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Invert rich dark themes to crisp black text on pure white paper.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Prevent Page Slicing</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Use <code className="font-mono">break-inside: avoid;</code> so an invoice row isn&apos;t cut across sheets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Page Breaks & @page */}
      <section id="page-breaks" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. The Essential Print CSS Toolkit
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs sm:text-sm text-slate-300 space-y-2 overflow-x-auto">
            <div className="text-slate-400 font-sans font-bold">@media print &#123;</div>
            <div className="pl-4 text-rose-400">/* 1. Hide interactive elements */</div>
            <div className="pl-4">nav, footer, .sidebar, button, .ads &#123; display: none !important; &#125;</div>
            <div className="pl-4 text-emerald-400">/* 2. Print readable link URLs */</div>
            <div className="pl-4">a[href^=&quot;http&quot;]::after &#123; content: &quot; (&quot; attr(href) &quot;)&quot;; font-size: 80%; &#125;</div>
            <div className="pl-4 text-cyan-400">/* 3. Protect tables and cards from being split in half */</div>
            <div className="pl-4">.invoice-card, tr &#123; break-inside: avoid; &#125;</div>
            <div className="text-slate-400 font-sans font-bold">&#125;</div>

            <div className="text-slate-400 font-sans font-bold pt-2">/* Configure physical paper margins */</div>
            <div>@page &#123;</div>
            <div className="pl-4 text-indigo-300">size: A4 portrait;</div>
            <div className="pl-4 text-indigo-300">margin: 20mm;</div>
            <div>&#125;</div>
          </div>
        </div>
      </section>

      {/* Interactive Studio */}
      <section id="interactive-studio" className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400">
            <Sliders className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Interactive Studio: Web View vs. Print Sheet Preview
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Display Engine Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsPrintMode(false)}
                  className={cn(
                    'py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-2',
                    !isPrintMode
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <Eye className="h-4 w-4" />
                  <span>Web Screen View</span>
                </button>
                <button
                  onClick={() => setIsPrintMode(true)}
                  className={cn(
                    'py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-2',
                    isPrintMode
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <Printer className="h-4 w-4" />
                  <span>@media print Sheet</span>
                </button>
              </div>
            </div>

            {isPrintMode && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span>Append URL footnotes (attr(href))</span>
                  <input
                    type="checkbox"
                    checked={showUrls}
                    onChange={(e) => setShowUrls(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-950 min-h-[360px]">
            {/* The Document Sheet */}
            <div
              className={cn(
                'w-full max-w-md rounded-2xl p-6 transition-all duration-300 shadow-xl space-y-4',
                isPrintMode
                  ? 'bg-white text-slate-900 border border-slate-300'
                  : 'bg-slate-900 text-white border border-slate-700'
              )}
            >
              {!isPrintMode && (
                <div className="flex items-center justify-between border-b border-slate-700 pb-2 text-xs">
                  <span className="font-bold text-blue-400">Global Website Navbar</span>
                  <button className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px]">Logout</button>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-xl font-black">Official Customer Receipt</h4>
                <p className="text-xs opacity-70">Invoice #INV-2026-9042</p>
              </div>

              <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Pro Cloud Subscription (1 yr)</span>
                  <span className="font-mono font-bold">$120.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Priority CDN Bandwidth</span>
                  <span className="font-mono font-bold">$24.00</span>
                </div>
              </div>

              <div className="border-t border-slate-300 dark:border-slate-700 pt-2 flex justify-between font-bold text-sm">
                <span>Total Paid</span>
                <span>$144.00</span>
              </div>

              <div className="pt-2 text-[11px] text-blue-600 dark:text-blue-400">
                <span className="underline">View online receipt</span>
                {isPrintMode && showUrls && (
                  <span className="text-slate-600 text-[10px] ml-1 font-mono">(https://cscosmos.app/receipts/9042)</span>
                )}
              </div>

              {!isPrintMode && (
                <button className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
                  Download PDF Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Traps */}
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-xl font-bold">First-Year Student Traps: Print Styles</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">1.</span>
            <span>
              <strong>Browsers strip background colors by default!</strong> To save expensive printer ink, Chrome and Safari strip all <code className="font-mono">background-color</code> values when printing. If you have essential color badges or highlight chips, force the browser to print them using: <code className="font-mono text-blue-500">print-color-adjust: exact; -webkit-print-color-adjust: exact;</code>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">2.</span>
            <span>
              <strong>The Legacy page-break-inside Syntax:</strong> Older browsers used <code className="font-mono">page-break-inside: avoid</code>. The modern standard is <code className="font-mono text-emerald-500">break-inside: avoid</code>. For maximum browser compatibility across all print engines, declare both properties together!
            </span>
          </li>
        </ul>
      </section>

      {/* Next Concept Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Next Masterclass · Track 8 Transitions &amp; Animation
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            CSS Transitions &amp; Timing Functions
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Smoothly interpolate property state changes with transition-duration, cubic-bezier curves, and GPU acceleration.
          </p>
        </div>
        <Link
          href="/fullstack/css-cosmos/transitions"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Continue to Concept 30</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
