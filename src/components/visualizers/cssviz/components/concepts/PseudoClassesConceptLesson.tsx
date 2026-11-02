'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Code2,
  AlertTriangle,
  Layers,
  Trophy,
  ArrowRight,
  ChevronRight,
  MousePointerClick,
  Sliders,
  Eye,
  Smile,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NthChildItem {
  id: number;
}

export default function PseudoClassesConceptLesson() {
  // Nth-child sandbox state
  const [nthFormula, setNthFormula] = useState<string>('2n + 1');

  // Interactive Button State for LVHA demo
  const [activeBtnState, setActiveBtnState] = useState<'normal' | 'hover' | 'focus' | 'active'>('normal');

  // Pseudo-Element Before/After toggle
  const [badgeText, setBadgeText] = useState('New');
  const [showBeforeDot, setShowBeforeDot] = useState(true);

  // Compute matched 1-based indices for nth-child sandbox (items 1..10)
  const matchedIndices = useMemo(() => {
    const matched = new Set<number>();
    const formula = nthFormula.trim().toLowerCase();

    if (formula === 'odd') {
      for (let i = 1; i <= 10; i += 2) matched.add(i);
      return matched;
    }
    if (formula === 'even') {
      for (let i = 2; i <= 10; i += 2) matched.add(i);
      return matched;
    }

    // Try parsing An + B
    const match = formula.match(/^([+-]?\d*)?n\s*([+-]\s*\d+)?$/);
    if (match) {
      const aStr = match[1];
      let a = 1;
      if (aStr === '-') a = -1;
      else if (aStr === '+') a = 1;
      else if (aStr !== undefined && aStr !== '') a = parseInt(aStr, 10);

      const bStr = match[2]?.replace(/\s+/g, '');
      const b = bStr ? parseInt(bStr, 10) : 0;

      for (let n = -10; n <= 20; n += 1) {
        const index = a * n + b;
        if (index >= 1 && index <= 10) {
          matched.add(index);
        }
      }
      return matched;
    }

    // Try single integer
    const single = parseInt(formula, 10);
    if (!isNaN(single) && single >= 1 && single <= 10) {
      matched.add(single);
    }

    return matched;
  }, [nthFormula]);

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
          <span>Curriculum</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">Pseudo-Classes &amp; Elements</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-slate-900/5 to-pink-500/10 dark:from-purple-500/15 dark:via-slate-950 dark:to-pink-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 font-mono text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              1st Year CS &amp; Web Engineering Foundation
            </span>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Core Concept 03
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pseudo-Classes &amp; Elements
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            Bring your interfaces to life without JavaScript! Style dynamic user states (hover, focus, active), target structural positions (<code>:nth-child</code>), and inject decorative virtual sub-elements (<code>::before</code>, <code>::after</code>).
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#nth-child-lab"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Sliders className="h-4 w-4" />
              <span>Interactive :nth-child() Lab</span>
            </a>
            <a
              href="#pseudo-elements-demo"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span>::before &amp; ::after Studio</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Mental Model */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Mental Model</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Moods vs Accessories
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          The difference between a <strong>pseudo-class</strong> and a <strong>pseudo-element</strong> is simple:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                :pseudo-class (Single Colon) = The Mood/State
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Describes the temporary condition or structural role of an existing element. The element didn&apos;t change; its mood changed!
            </p>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-xs font-mono text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-slate-800">
              button:hover &#123; transform: translateY(-2px); &#125;
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Specificity contribution: <strong>(0, 0, 1, 0)</strong> — Same as 1 Class!
            </div>
          </div>

          <div className="rounded-2xl border border-pink-200 dark:border-pink-900/40 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                ::pseudo-element (Double Colon) = The Accessory
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Creates or targets an invisible virtual sub-element. Like putting a hat (<code>::before</code>) or backpack (<code>::after</code>) on an element without writing extra HTML tags!
            </p>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-xs font-mono text-pink-700 dark:text-pink-300 border border-slate-200 dark:border-slate-800">
              .badge::before &#123; content: &quot;★&quot;; margin-right: 4px; &#125;
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Specificity contribution: <strong>(0, 0, 0, 1)</strong> — Same as 1 Element tag!
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: The LVHA Link Ordering Rule */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
          <MousePointerClick className="h-4 w-4" />
          <span>2. Interaction States &amp; The LVHA Rule</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Why Does Link Hover Sometimes Fail? (The LVHA Order)
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          All link pseudo-classes have identical specificity <code>(0, 0, 1, 0)</code>. If written in the wrong source order in your stylesheet, an active or visited style can permanently block hover effects!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">1. :link</span>
            <p className="text-slate-500 font-sans">Unvisited links.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">2. :visited</span>
            <p className="text-slate-500 font-sans">Already clicked in history.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">3. :hover</span>
            <p className="text-slate-500 font-sans">Mouse cursor over link.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-rose-600 dark:text-rose-400 font-bold text-sm">4. :active</span>
            <p className="text-slate-500 font-sans">Mouse button pressed down.</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Memory Mnemonic:</strong> Remember <strong>L-o-V-e H-A-t-e</strong> (Link, Visited, Hover, Active). Always write them in this order!
          </span>
        </div>
      </section>

      {/* SECTION 3: Interactive :nth-child() Lab */}
      <section id="nth-child-lab" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
          <Sliders className="h-4 w-4" />
          <span>3. Interactive :nth-child(An + B) Sandbox</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Master the An + B Math Formula
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          The <code>:nth-child(An + B)</code> formula matches elements in cycles: <strong>A</strong> is cycle size, <strong>B</strong> is starting offset. Try typing any formula or picking a preset:
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Formula :nth-child(...)
              </label>
              <input
                type="text"
                value={nthFormula}
                onChange={(e) => setNthFormula(e.target.value)}
                placeholder="e.g. 2n+1, even, odd, 3n, -n+4"
                className="w-full sm:w-64 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2 font-mono text-sm text-slate-900 dark:text-white"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">Presets:</span>
              {[
                { label: 'Odd (2n+1)', val: '2n+1' },
                { label: 'Even (2n)', val: '2n' },
                { label: 'Every 3rd (3n)', val: '3n' },
                { label: 'First 3 (-n+3)', val: '-n+3' },
                { label: 'From 4th (n+4)', val: 'n+4' },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setNthFormula(p.val)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs font-mono hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 10 Items Visual Row */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-500">10 DOM Child Nodes &lt;li&gt;:</div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                const isMatched = matchedIndices.has(num);
                return (
                  <div
                    key={num}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all duration-300',
                      isMatched
                        ? 'border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300 scale-105 shadow-md font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400'
                    )}
                  >
                    <span className="text-xs">Item</span>
                    <span className="text-base font-bold">#{num}</span>
                    <span className="text-[10px] uppercase mt-1">
                      {isMatched ? 'MATCH' : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Pseudo-Elements ::before and ::after */}
      <section id="pseudo-elements-demo" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
          <Eye className="h-4 w-4" />
          <span>4. Virtual Elements Studio (::before &amp; ::after)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Injecting Icons &amp; Badges Without Extra HTML
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          The #1 rule of <code>::before</code> and <code>::after</code>: <strong>They MUST have <code>content: &quot;&quot;</code>!</strong> Without the <code>content</code> property, browsers will not generate the pseudo-element at all.
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Badge Content
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showBeforeDot}
                onChange={(e) => setShowBeforeDot(e.target.checked)}
                className="rounded"
              />
              <span>Enable ::before pulse dot</span>
            </label>
          </div>

          {/* Live Component Preview */}
          <div className="rounded-xl bg-[#0b1324] p-6 flex flex-col items-center justify-center gap-4">
            <div className="relative inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-300 shadow-sm">
              {showBeforeDot && (
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
              <span>{badgeText}</span>
              <span className="text-[10px] text-purple-400">::after</span>
            </div>

            <div className="text-xs font-mono text-slate-400">
              HTML remains clean: <code>&lt;span class=&quot;badge&quot;&gt;{badgeText}&lt;/span&gt;</code>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Traps & Best Practices */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
          <AlertTriangle className="h-4 w-4" />
          <span>5. Common Traps &amp; Pro-Tips</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The Infamous `:first-child` Trap
        </h2>

        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 p-5 space-y-3">
          <h3 className="font-bold text-rose-800 dark:text-rose-300 text-base">
            Why does `p:first-child` match nothing when an `&lt;h1&gt;` is present?
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <code>p:first-child</code> does <strong>NOT</strong> mean &quot;find the first paragraph inside the div&quot;. It means <em>&quot;Is this element a paragraph AND is it the very first child of its parent?&quot;</em>
          </p>
          <div className="rounded-xl bg-[#0f172a] p-3 text-xs font-mono text-slate-300 space-y-1">
            <div>&lt;div class=&quot;article&quot;&gt;</div>
            <div className="pl-4 text-slate-400">&lt;h1&gt;Title&lt;/h1&gt; <span className="text-amber-400">&lt;-- Child #1</span></div>
            <div className="pl-4 text-rose-400">&lt;p&gt;Paragraph 1&lt;/p&gt; <span className="text-rose-400">&lt;-- Child #2 (p:first-child FAILS!)</span></div>
            <div>&lt;/div&gt;</div>
          </div>
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            Fix: Use <code>p:first-of-type</code>! It specifically scans for the first <code>&lt;p&gt;</code> element regardless of preceding headings!
          </div>
        </div>
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next Concept in Curriculum</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">4. :is(), :where(), and :has()</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Modern relational parent selectors and zero-specificity baseline reset functions.
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/is-where-has"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to Modern Selectors</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
