'use client';

import React, { useState } from 'react';
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
  Calculator,
  Trophy,
  ArrowRight,
  ChevronRight,
  Info,
  Scale,
  GitBranch,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface CascadeQuizRound {
  id: number;
  title: string;
  scenario: string;
  htmlSnippet: string;
  options: {
    rule: string;
    score: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const CASCADE_ROUNDS: CascadeQuizRound[] = [
  {
    id: 1,
    title: 'Round 1: Inheritance vs Direct Targeting',
    scenario: 'The container has color: blue. A paragraph inside has no color specified, but a global "p" rule says color: red. What color is the text?',
    htmlSnippet: '<div class="card" style="color: blue;">\n  <p>Hello CSS World</p>\n</div>\n\n/* In stylesheet: */\np { color: red; }',
    options: [
      {
        rule: 'Blue (inherited from .card style="...")',
        score: 'Inherited Value',
        isCorrect: false,
        explanation: 'Myth alert! Inherited styles carry ZERO specificity when competing against a direct selector targeting the element.',
      },
      {
        rule: 'Red (from p { color: red; })',
        score: '(0, 0, 0, 1) Direct Element',
        isCorrect: true,
        explanation: 'WINNER! Any directly targeted rule (even with lowest specificity 0,0,0,1) beats inherited styles 100% of the time.',
      },
    ],
  },
  {
    id: 2,
    title: 'Round 2: The "inherit" Keyword Override',
    scenario: 'What happens if we add "color: inherit" to the paragraph?',
    htmlSnippet: '<div class="parent" style="color: purple;">\n  <p class="child">Inherit in Action</p>\n</div>\n\n/* In stylesheet: */\np.child { color: inherit; }\np { color: red; }',
    options: [
      {
        rule: 'Purple (forced inheritance from parent)',
        score: '(0, 0, 1, 1)',
        isCorrect: true,
        explanation: 'WINNER! "color: inherit" explicitly tells the browser to copy the parent computed value (purple). Since p.child has higher specificity than p, it applies!',
      },
      {
        rule: 'Red (from p rule)',
        score: '(0, 0, 0, 1)',
        isCorrect: false,
        explanation: 'p.child has specificity (0, 0, 1, 1), beating p (0, 0, 0, 1).',
      },
    ],
  },
  {
    id: 3,
    title: 'Round 3: "initial" vs "revert"',
    scenario: 'We set "display: revert" on a <div>. What does it become?',
    htmlSnippet: 'div.special {\n  display: revert;\n}',
    options: [
      {
        rule: 'display: inline (the CSS spec initial value)',
        score: 'Initial Spec Value',
        isCorrect: false,
        explanation: '"initial" resets to the CSS specification default (which for display is "inline" for all elements).',
      },
      {
        rule: 'display: block (the browser user-agent default for div)',
        score: 'UA Default',
        isCorrect: true,
        explanation: 'WINNER! "revert" rolls back to the browser User-Agent stylesheet, restoring a div to its natural "block" display!',
      },
    ],
  },
];

export default function CascadeConceptLesson() {
  // Simulator State
  const [parentColor, setParentColor] = useState('#6366f1'); // Indigo
  const [parentFontSize, setParentFontSize] = useState('18px');
  const [parentPadding, setParentPadding] = useState('16px');
  const [childExplicitColor, setChildExplicitColor] = useState<string>('none');

  // Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const currentQuiz = CASCADE_ROUNDS[quizIdx];

  const handleQuizSelect = (idx: number) => {
    if (quizAnswered) return;
    setSelectedOpt(idx);
    setQuizAnswered(true);
  };

  const nextQuiz = () => {
    setSelectedOpt(null);
    setQuizAnswered(false);
    setQuizIdx((prev) => (prev + 1) % CASCADE_ROUNDS.length);
  };

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
          <span className="text-amber-600 dark:text-amber-400 font-bold">Cascade & Inheritance</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-slate-900/5 to-purple-500/10 dark:from-blue-500/15 dark:via-slate-950 dark:to-purple-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              1st Year CS & Web Engineering Foundation
            </span>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Core Concept 02
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Cascade & Inheritance
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            Why is it called <em>Cascading</em> Style Sheets? Understand how values flow like water down the DOM tree, how inheritance works, and how the browser resolves property clashes.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#inheritance-simulator"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Interactive Inheritance Lab</span>
            </a>
            <a
              href="#cascade-quiz"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Play Cascade Quiz</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Mental Model */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Mental Model</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Genetic DNA vs The Waterfall Appeal
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          CSS blends two foundational mechanisms to calculate the final style of every HTML element:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">1. Inheritance (DNA Passing)</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Just like children inherit their parents&apos; hair color and eye color, elements inherit typographic properties like <code>color</code>, <code>font-family</code>, and <code>line-height</code> from their parent containers.
            </p>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-xs space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400">What does NOT inherit:</span>
              <p className="text-slate-500">
                You do NOT inherit your parent&apos;s shoes or jacket size! Similarly, geometry properties (<code>margin</code>, <code>padding</code>, <code>border</code>, <code>background</code>) <strong>NEVER</strong> inherit automatically.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">2. The Cascade (Court of Appeals)</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When multiple rules target the exact same element with conflicting values (e.g. <code>color: red</code> vs <code>color: blue</code>), the Cascade algorithm acts as judge:
            </p>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-xs space-y-1">
              <ol className="list-decimal pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                <li><strong>Origin &amp; Importance:</strong> Browser default vs User vs Author vs <code>!important</code></li>
                <li><strong>Specificity:</strong> <code>(A, B, C, D)</code> score vector</li>
                <li><strong>Source Order:</strong> The last rule in the stylesheet breaks ties!</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Inherited vs Non-Inherited Properties */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
          <Layers className="h-4 w-4" />
          <span>2. Inheritance Property Matrix</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          What Inherits Automatically (And What Doesn&apos;t)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300">✅ Inherited Properties (Typographic)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                Flows down naturally
              </span>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <li><code>color</code> — Text foreground color</li>
              <li><code>font-family, font-size, font-weight</code> — Typography attributes</li>
              <li><code>line-height, letter-spacing</code> — Text pacing</li>
              <li><code>text-align, text-transform</code> — Alignment &amp; casing</li>
              <li><code>visibility</code> — Hidden but takes layout space</li>
              <li><code>list-style</code> — Bullet points and numbers</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-rose-800 dark:text-rose-300">❌ Non-Inherited Properties (Box Geometry)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                Stops at parent
              </span>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <li><code>margin, padding, border</code> — Box model dimensions</li>
              <li><code>width, height, max-width</code> — Element dimensions</li>
              <li><code>background-color, background-image</code> — Visual surface</li>
              <li><code>display, position, top, left</code> — Layout positioning</li>
              <li><code>overflow, z-index</code> — Containment &amp; layering</li>
              <li><code>transform, opacity</code> — Graphic rendering</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: The 4 Universal CSS Keywords */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
          <Code2 className="h-4 w-4" />
          <span>3. The Universal Value Keywords</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          `inherit`, `initial`, `revert`, and `unset`
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Every single CSS property accepts these four universal keywords to manually control the cascade:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <code className="text-blue-600 dark:text-blue-400 font-bold text-sm">inherit</code>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Forces the child element to take the exact computed value of its direct parent, even for non-inherited properties!
            </p>
            <div className="text-[11px] font-mono bg-slate-100 dark:bg-slate-950 p-2 rounded">
              button &#123; font-family: inherit; &#125;
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <code className="text-amber-600 dark:text-amber-400 font-bold text-sm">initial</code>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Resets property to the official W3C specification initial default (e.g. <code>color: #000</code>, <code>display: inline</code>).
            </p>
            <div className="text-[11px] font-mono bg-slate-100 dark:bg-slate-950 p-2 rounded">
              p &#123; color: initial; &#125;
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <code className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">revert</code>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Rolls back the property to the browser&apos;s User-Agent stylesheet default (e.g. restoring link underlines).
            </p>
            <div className="text-[11px] font-mono bg-slate-100 dark:bg-slate-950 p-2 rounded">
              a.reset &#123; color: revert; &#125;
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <code className="text-purple-600 dark:text-purple-400 font-bold text-sm">unset</code>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A hybrid: acts like <code>inherit</code> if the property naturally inherits, or like <code>initial</code> if it doesn&apos;t!
            </p>
            <div className="text-[11px] font-mono bg-slate-100 dark:bg-slate-950 p-2 rounded">
              all: unset; /* Complete reset */
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Inheritance Simulator */}
      <section id="inheritance-simulator" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
          <RefreshCw className="h-4 w-4" />
          <span>4. Live Inheritance Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Watch DNA Flow Down the DOM Tree
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Adjust the parent properties below. Notice how <strong>color</strong> and <strong>font-size</strong> naturally flow to child elements, while <strong>padding</strong> stays strictly on the parent!
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Parent Color (Inherited)</label>
              <div className="flex gap-1.5">
                {['#6366f1', '#10b981', '#f59e0b', '#ef4444'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setParentColor(c)}
                    className={cn(
                      'h-7 w-7 rounded-lg border-2 transition-all',
                      parentColor === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Parent Font Size (Inherited)</label>
              <select
                value={parentFontSize}
                onChange={(e) => setParentFontSize(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-xs"
              >
                <option value="14px">14px (Small)</option>
                <option value="18px">18px (Medium)</option>
                <option value="24px">24px (Large)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Parent Padding (Non-Inherited)</label>
              <select
                value={parentPadding}
                onChange={(e) => setParentPadding(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-xs"
              >
                <option value="8px">8px</option>
                <option value="16px">16px</option>
                <option value="32px">32px</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Child Explicit Override</label>
              <select
                value={childExplicitColor}
                onChange={(e) => setChildExplicitColor(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-xs"
              >
                <option value="none">No override (inherit parent)</option>
                <option value="#06b6d4">Explicit cyan (#06b6d4)</option>
                <option value="#ec4899">Explicit pink (#ec4899)</option>
              </select>
            </div>
          </div>

          {/* Live Preview Container */}
          <div
            className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 transition-all space-y-3"
            style={{
              color: parentColor,
              fontSize: parentFontSize,
              padding: parentPadding,
            }}
          >
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-70">
              &lt;div class=&quot;parent-box&quot;&gt;
            </div>

            <p className="leading-relaxed">
              I am parent text. My color is <strong>{parentColor}</strong> and font-size is <strong>{parentFontSize}</strong>.
            </p>

            {/* Child Node */}
            <div
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 space-y-2 transition-all shadow-sm"
              style={{
                color: childExplicitColor !== 'none' ? childExplicitColor : undefined,
              }}
            >
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500">
                &lt;div class=&quot;child-node&quot;&gt;
              </div>
              <p className="font-medium text-sm">
                I am a nested child paragraph!
              </p>
              <div className="text-xs text-slate-500 font-mono">
                Active text color: {childExplicitColor !== 'none' ? `${childExplicitColor} (explicit override)` : `${parentColor} (inherited from parent)`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Cascade Quiz */}
      <section id="cascade-quiz" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
          <Trophy className="h-4 w-4" />
          <span>5. The Cascade Battle Arena</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Which Value Cascades Through?
          </h2>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30">
            Round {quizIdx + 1} of {CASCADE_ROUNDS.length}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-md">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-slate-500">{currentQuiz.title}</div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{currentQuiz.scenario}</p>
            <div className="rounded-xl bg-[#0b1324] p-4 font-mono text-xs text-amber-300 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap">{currentQuiz.htmlSnippet}</pre>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Contestant Rules:</div>
            <div className="grid grid-cols-1 gap-3">
              {currentQuiz.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const showSuccess = quizAnswered && opt.isCorrect;
                const showError = quizAnswered && isSelected && !opt.isCorrect;

                return (
                  <button
                    key={idx}
                    disabled={quizAnswered}
                    onClick={() => handleQuizSelect(idx)}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border text-left font-mono text-xs sm:text-sm transition-all',
                      !quizAnswered && 'hover:border-blue-500 hover:bg-blue-500/5 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800',
                      showSuccess && 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-bold',
                      showError && 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200 font-bold',
                      quizAnswered && !showSuccess && !showError && 'opacity-60 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {showSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                      {showError && <XCircle className="h-5 w-5 text-rose-500 shrink-0" />}
                      {!quizAnswered && <span className="h-4 w-4 rounded-full border border-slate-400 shrink-0" />}
                      <span className="font-semibold">{opt.rule}</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      {opt.score}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {quizAnswered && (
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div
                className={cn(
                  'p-4 rounded-xl text-xs sm:text-sm leading-relaxed border',
                  selectedOpt !== null && currentQuiz.options[selectedOpt].isCorrect
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200'
                    : 'border-blue-500/40 bg-blue-500/10 text-blue-950 dark:text-blue-200'
                )}
              >
                <div className="font-bold text-sm mb-1">
                  {selectedOpt !== null && currentQuiz.options[selectedOpt].isCorrect
                    ? '🎉 Spot On!'
                    : '💡 Cascade Insight:'}
                </div>
                <p>{currentQuiz.options[currentQuiz.options.findIndex((o) => o.isCorrect)].explanation}</p>
              </div>

              <button
                onClick={nextQuiz}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: 3 Classic 1st-Year Traps */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
          <AlertTriangle className="h-4 w-4" />
          <span>6. Common Traps & Pro-Tips</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          3 Big Cascade Traps for Beginners
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-500 uppercase">Trap 1: The Button Font Trap</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Why don&apos;t buttons have my body font?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              HTML form controls (<code>&lt;button&gt;</code>, <code>&lt;input&gt;</code>) have User-Agent defaults that stop font inheritance!
              <br />
              <strong>Fix:</strong> Add <code>button, input &#123; font-family: inherit; &#125;</code> to your base reset.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-500 uppercase">Trap 2: `initial` vs `revert`</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              `display: initial` makes divs inline!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The W3C initial spec for <code>display</code> is <code>inline</code>. If you use <code>initial</code> on a div, it collapses into an inline element!
              <br />
              <strong>Fix:</strong> Use <code>revert</code> to get back the browser&apos;s block default.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-500 uppercase">Best Practice: Source Order</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Write Base First, Overrides Last
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When specificity ties occur, CSS resolves ties by source order. Always load your base resets first, component styles second, and utility override modifiers at the very bottom!
            </p>
          </div>
        </div>
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next Concept in Curriculum</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">3. Pseudo-Classes &amp; Elements</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Dynamic UI states (:hover, :focus-visible, :nth-child) and virtual sub-elements (::before, ::after).
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/pseudo-classes"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to Pseudo-Classes</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
