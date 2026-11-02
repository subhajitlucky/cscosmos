'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Code2,
  AlertTriangle,
  Layers,
  Hash,
  Tag,
  MousePointerClick,
  Calculator,
  FlaskConical,
  Trophy,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Info,
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import SelectorsLab from '../visualizers/SelectorsLab';
import { computeSpecificity } from '../../utils/specificity';
import { cn } from '../../utils/cn';

// Quiz Battle Rounds
interface BattleRound {
  id: number;
  title: string;
  scenario: string;
  htmlSnippet: string;
  options: {
    rule: string;
    score: string;
    points: { id: number; cls: number; elem: number };
    color: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const BATTLE_ROUNDS: BattleRound[] = [
  {
    id: 1,
    title: 'Round 1: The Intro Paragraph',
    scenario: 'Which rule will style the color of this introductory paragraph?',
    htmlSnippet: '<p id="intro" class="lead text-highlight">Welcome to CSS!</p>',
    options: [
      {
        rule: 'p { color: red; }',
        score: '(0, 0, 0, 1)',
        points: { id: 0, cls: 0, elem: 1 },
        color: 'text-rose-500',
        isCorrect: false,
        explanation: '1 element selector = Score (0,0,0,1). Lowest priority among the contestants.',
      },
      {
        rule: '.lead.text-highlight { color: blue; }',
        score: '(0, 0, 2, 0)',
        points: { id: 0, cls: 2, elem: 0 },
        color: 'text-blue-500',
        isCorrect: false,
        explanation: '2 classes = Score (0,0,2,0). Stronger than the element, but cannot beat an ID!',
      },
      {
        rule: '#intro { color: emerald; }',
        score: '(0, 1, 0, 0)',
        points: { id: 1, cls: 0, elem: 0 },
        color: 'text-emerald-500',
        isCorrect: true,
        explanation: 'WINNER! 1 ID = Score (0,1,0,0). Even 100 classes cannot beat 1 ID in CSS specificity!',
      },
    ],
  },
  {
    id: 2,
    title: 'Round 2: The Navigation Link',
    scenario: 'We have an active navigation link inside a header nav. Which color wins?',
    htmlSnippet: '<nav id="main-nav"><ul class="nav-list"><li class="item"><a class="link active">Home</a></li></ul></nav>',
    options: [
      {
        rule: 'nav ul li a { color: gray; }',
        score: '(0, 0, 0, 4)',
        points: { id: 0, cls: 0, elem: 4 },
        color: 'text-slate-400',
        isCorrect: false,
        explanation: '4 elements = (0,0,0,4). Multiple elements still have zero class or ID points.',
      },
      {
        rule: '.nav-list .item a.active { color: purple; }',
        score: '(0, 0, 3, 2)',
        points: { id: 0, cls: 3, elem: 2 },
        color: 'text-purple-500',
        isCorrect: false,
        explanation: '3 classes + 2 elements = (0,0,3,2). Strong, but notice contestant 3 has an ID!',
      },
      {
        rule: '#main-nav a { color: amber; }',
        score: '(0, 1, 0, 1)',
        points: { id: 1, cls: 0, elem: 1 },
        color: 'text-amber-500',
        isCorrect: true,
        explanation: 'WINNER! (0,1,0,1) beats (0,0,3,2). In CSS, the ID column (B) is evaluated before classes (C). 1 ID > any number of classes!',
      },
    ],
  },
  {
    id: 3,
    title: 'Round 3: Source Order Tie-Breaker',
    scenario: 'Both selectors have identical specificity (0, 0, 1, 0). Which color wins?',
    htmlSnippet: '<button class="btn primary">Launch Engine</button>\n\n/* Stylesheet order: */\n.primary { color: skyblue; }\n.btn { color: coral; }',
    options: [
      {
        rule: '.primary { color: skyblue; } (written 1st)',
        score: '(0, 0, 1, 0)',
        points: { id: 0, cls: 1, elem: 0 },
        color: 'text-sky-500',
        isCorrect: false,
        explanation: 'Tied specificity! When scores match, CSS checks stylesheet order. The earlier rule gets overridden.',
      },
      {
        rule: '.btn { color: coral; } (written 2nd)',
        score: '(0, 0, 1, 0)',
        points: { id: 0, cls: 1, elem: 0 },
        color: 'text-orange-500',
        isCorrect: true,
        explanation: 'WINNER! The "Cascade" rule: when specificity is tied, the rule written LAST in the stylesheet wins (Source Order).',
      },
    ],
  },
  {
    id: 4,
    title: 'Round 4: Attribute & State vs Direct Child',
    scenario: 'An input checkbox is currently checked. Who styles the border?',
    htmlSnippet: '<form class="auth-form"><input type="checkbox" checked class="agree-box" /></form>',
    options: [
      {
        rule: 'form > input.agree-box { border: 2px solid cyan; }',
        score: '(0, 0, 1, 2)',
        points: { id: 0, cls: 1, elem: 2 },
        color: 'text-cyan-500',
        isCorrect: false,
        explanation: '1 class (.agree-box) + 2 elements (form, input) = (0, 0, 1, 2).',
      },
      {
        rule: 'input[type="checkbox"]:checked { border: 2px solid green; }',
        score: '(0, 0, 2, 1)',
        points: { id: 0, cls: 2, elem: 1 },
        color: 'text-emerald-500',
        isCorrect: true,
        explanation: 'WINNER! Attribute [type="checkbox"] counts as 1 class point, and :checked counts as 1 class point! Total = (0, 0, 2, 1), which beats (0, 0, 1, 2)!',
      },
    ],
  },
];

export default function SelectorsConceptLesson() {
  // Selector Family Tabs
  const [activeFamilyTab, setActiveFamilyTab] = useState<'type' | 'class' | 'id' | 'universal' | 'attribute'>('type');

  // Combinator Demo Tab
  const [activeCombinator, setActiveCombinator] = useState<'descendant' | 'child' | 'adjacent' | 'sibling'>('descendant');

  // Interactive Quiz State
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Live Calculator State
  const [calcInput, setCalcInput] = useState('header.main-nav > ul.menu-list li#active a:hover');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const calcSpecificity = useMemo(() => {
    return computeSpecificity(calcInput.trim() || '*');
  }, [calcInput]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const currentRound = BATTLE_ROUNDS[currentRoundIdx];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOptionIdx(idx);
    setHasAnswered(true);
  };

  const nextBattleRound = () => {
    setSelectedOptionIdx(null);
    setHasAnswered(false);
    setCurrentRoundIdx((prev) => (prev + 1) % BATTLE_ROUNDS.length);
  };

  return (
    <div className="space-y-12">
      {/* Top Breadcrumb & Navigation */}
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
          <span className="text-amber-600 dark:text-amber-400 font-bold">Selectors & Specificity</span>
        </div>
      </div>

      {/* Hero Masterclass Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/5 to-indigo-500/10 dark:from-amber-500/15 dark:via-slate-950 dark:to-indigo-950/30 p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              1st Year CS & Web Engineering Foundation
            </span>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Core Concept 01
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Selectors & Specificity
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
            How CSS finds HTML elements on your page, and the mathematical formula the browser uses to decide which rule wins when styles collide.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#battle-arena"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all"
            >
              <Trophy className="h-4 w-4" />
              <span>Play Battle Arena Quiz</span>
            </a>
            <a
              href="#live-calculator"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <Calculator className="h-4 w-4 text-amber-500" />
              <span>Specificity Calculator</span>
            </a>
            <a
              href="#visualizer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2.5 text-xs sm:text-sm transition-all"
            >
              <FlaskConical className="h-4 w-4 text-indigo-400" />
              <span>Interactive DOM Lab</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Mental Model & Postal Analogy */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <BookOpen className="h-4 w-4" />
          <span>1. The Mental Model</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The Postal Delivery Analogy
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Imagine a courier trying to deliver mail on a university campus. How the envelope is addressed dictates who gets it and how precise the instruction is:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">General Mail</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Score: 1 pt
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Element Selector (`p`, `div`)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Address:</strong> &quot;To all students in Hostel 4&quot;. Everyone gets a copy. Very broad, easily overridden by more specific mail.
            </p>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-950 p-2 font-mono text-xs text-amber-600 dark:text-amber-400">
              p &#123; color: gray; &#125;
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">Club Badge</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                Score: 10 pts
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Class Selector (`.lead`, `.btn`)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Address:</strong> &quot;To students wearing the Robotics Club badge&quot;. Targets any student carrying this reusable label.
            </p>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-950 p-2 font-mono text-xs text-blue-600 dark:text-blue-400">
              .lead &#123; color: blue; &#125;
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">Roll Number</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                Score: 100 pts
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              ID Selector (`#student-42`)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Address:</strong> &quot;Student ID: CS-2026-042&quot;. Exactly one individual on campus. Outranks any number of club badges!
            </p>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-950 p-2 font-mono text-xs text-amber-600 dark:text-amber-400">
              #intro &#123; color: amber; &#125;
            </div>
          </div>

          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">Hand Delivery</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                Score: 1000 pts
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Inline Style (`style=&quot;...&quot;`)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Address:</strong> The Dean personally walks up to the student&apos;s desk and hands over the letter. Overrides all mailbox rules!
            </p>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-950 p-2 font-mono text-xs text-rose-600 dark:text-rose-400">
              style=&quot;color: red;&quot;
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Anatomy of a CSS Rule */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <Code2 className="h-4 w-4" />
          <span>2. Syntax Anatomy</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Anatomy of a CSS Rule
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Before diving into combinators, understand the four parts that make up every single CSS rule:
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0b1324] p-6 text-white font-mono space-y-6 shadow-md">
          {/* Visual Code Breakdown */}
          <div className="text-sm sm:text-lg overflow-x-auto pb-2">
            <span className="text-amber-400 font-bold">article.featured h2 &gt; span.badge</span>{' '}
            <span className="text-slate-400">&#123;</span>
            <div className="pl-6 py-1">
              <span className="text-sky-400">background-color</span>
              <span className="text-slate-400">: </span>
              <span className="text-emerald-300">#f59e0b</span>
              <span className="text-slate-400">;</span>
            </div>
            <div className="pl-6 py-1">
              <span className="text-sky-400">font-size</span>
              <span className="text-slate-400">: </span>
              <span className="text-emerald-300">0.875rem</span>
              <span className="text-slate-400">;</span>
            </div>
            <span className="text-slate-400">&#125;</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-amber-400 font-bold uppercase tracking-wider">1. Selector</span>
              <p className="text-slate-400 font-sans">
                <strong>&quot;Who?&quot;</strong> Matches the HTML element(s) in the DOM tree.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sky-400 font-bold uppercase tracking-wider">2. Property</span>
              <p className="text-slate-400 font-sans">
                <strong>&quot;What?&quot;</strong> The visual feature being modified (color, margin, width).
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-emerald-300 font-bold uppercase tracking-wider">3. Value</span>
              <p className="text-slate-400 font-sans">
                <strong>&quot;How?&quot;</strong> The exact setting applied to that property.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-300 font-bold uppercase tracking-wider">4. Declaration</span>
              <p className="text-slate-400 font-sans">
                A pair of <code>property: value;</code> terminated by a semicolon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: The 5 Core Selector Families */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <Layers className="h-4 w-4" />
          <span>3. The 5 Core Selector Families</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Mastering the Basic Selectors
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Click any selector family below to see how it works, its specificity value, and concrete examples:
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { id: 'type', label: '1. Type / Tag', icon: Tag },
            { id: 'class', label: '2. Class (.)', icon: Layers },
            { id: 'id', label: '3. ID (#)', icon: Hash },
            { id: 'universal', label: '4. Universal (*)', icon: Sparkles },
            { id: 'attribute', label: '5. Attribute ([attr])', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFamilyTab(tab.id as typeof activeFamilyTab)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all',
                  activeFamilyTab === tab.id
                    ? 'bg-amber-600 text-slate-950 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          {activeFamilyTab === 'type' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Type (Element) Selectors: `h1`, `p`, `button`, `ul`
                </h3>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Specificity: (0, 0, 0, 1)
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Targets elements based directly on their HTML tag name. Because it affects every single tag of that kind on the whole website, it should only be used for base typographic resets and document defaults.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-white space-y-1">
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-2">CSS Code</div>
                  <div><span className="text-amber-400">p</span> &#123;</div>
                  <div className="pl-4 text-sky-400">line-height<span className="text-slate-400">: </span><span className="text-emerald-300">1.6</span><span className="text-slate-400">;</span></div>
                  <div className="pl-4 text-sky-400">color<span className="text-slate-400">: </span><span className="text-emerald-300">#334155</span><span className="text-slate-400">;</span></div>
                  <div>&#125;</div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">When to use:</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Setting base font sizes on <code>html</code> and <code>body</code>.</li>
                    <li>Removing margin defaults on <code>h1, h2, h3</code>.</li>
                    <li>Removing list bullet padding on <code>ul, ol</code>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeFamilyTab === 'class' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Class Selectors: `.card`, `.btn-primary`, `.badge`
                </h3>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Specificity: (0, 0, 1, 0)
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The absolute backbone of professional web development. Prefix with a dot <code>.</code> in CSS. An HTML element can have multiple classes (separated by spaces), and one class can be reused across thousands of elements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-white space-y-1">
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-2">CSS Code</div>
                  <div><span className="text-blue-400">.btn</span> &#123; <span className="text-sky-300">padding</span>: <span className="text-emerald-300">8px 16px</span>; &#125;</div>
                  <div><span className="text-blue-400">.btn-primary</span> &#123; <span className="text-sky-300">background</span>: <span className="text-emerald-300">#f59e0b</span>; &#125;</div>
                  <div className="pt-2 text-slate-400 text-[11px] uppercase tracking-wider">HTML Usage</div>
                  <div className="text-amber-300">&lt;button class=&quot;btn btn-primary&quot;&gt;Save&lt;/button&gt;</div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Key Superpowers:</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Composable: Mix and match utility and component classes.</li>
                    <li>Predictable Specificity: Keeps your CSS flat at (0, 0, 1, 0).</li>
                    <li>Standard in Tailwind, Bootstrap, and BEM architecture.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeFamilyTab === 'id' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  ID Selectors: `#navbar`, `#submit-order`
                </h3>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  Specificity: (0, 1, 0, 0)
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Prefix with a hash <code>#</code> in CSS. Matches the element with matching <code>id=&quot;...&quot;</code>. HTML IDs <strong>MUST</strong> be unique per page.
              </p>
              <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-500/10 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <strong>1st Year Golden Rule:</strong> Avoid using IDs for CSS styling! Because an ID has a massive specificity of (0,1,0,0), you cannot override it with classes later without writing ugly hacks or using <code>!important</code>. Reserve IDs for JavaScript hooks and anchor navigation!
                </div>
              </div>
            </div>
          )}

          {activeFamilyTab === 'universal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Universal Selector: `*`
                </h3>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Specificity: (0, 0, 0, 0)
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The wildcard that matches literally every element in the document tree. It carries zero specificity points, meaning any class or tag rule will seamlessly override it.
              </p>
              <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-white space-y-1">
                <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">Standard Box-Sizing Reset</div>
                <div><span className="text-amber-400">*, *::before, *::after</span> &#123;</div>
                <div className="pl-4 text-sky-400">box-sizing<span className="text-slate-400">: </span><span className="text-emerald-300">border-box</span><span className="text-slate-400">;</span></div>
                <div>&#125;</div>
              </div>
            </div>
          )}

          {activeFamilyTab === 'attribute' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Attribute Selectors: `[type=&quot;checkbox&quot;]`, `a[href^=&quot;https&quot;]`
                </h3>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Specificity: (0, 0, 1, 0)
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Targets elements based on HTML attributes. Carries the exact same specificity weight as a class selector <code>(0, 0, 1, 0)</code>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-1 bg-slate-50 dark:bg-slate-950">
                  <code className="text-amber-600 dark:text-amber-400 font-bold">[disabled]</code>
                  <p className="text-slate-500">Matches any element with the <code>disabled</code> attribute present.</p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-1 bg-slate-50 dark:bg-slate-950">
                  <code className="text-amber-600 dark:text-amber-400 font-bold">input[type=&quot;email&quot;]</code>
                  <p className="text-slate-500">Exact match on input type attribute.</p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-1 bg-slate-50 dark:bg-slate-950">
                  <code className="text-amber-600 dark:text-amber-400 font-bold">a[href^=&quot;https://&quot;]</code>
                  <p className="text-slate-500"><strong>Starts with:</strong> Targets external secure links.</p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-1 bg-slate-50 dark:bg-slate-950">
                  <code className="text-amber-600 dark:text-amber-400 font-bold">a[href$=&quot;.pdf&quot;]</code>
                  <p className="text-slate-500"><strong>Ends with:</strong> Targets PDF document downloads.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: Combinators & The DOM Tree */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <Layers className="h-4 w-4" />
          <span>4. Combinators (Relationships)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The 4 Combinators: Navigating the DOM Family Tree
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          How do you style an element based on its parent, sibling, or ancestor? Combinators describe relationships between multiple selectors:
        </p>

        {/* Combinator Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'descendant', label: 'Descendant (A B)', symbol: 'space' },
            { id: 'child', label: 'Direct Child (A > B)', symbol: '>' },
            { id: 'adjacent', label: 'Adjacent Sibling (A + B)', symbol: '+' },
            { id: 'sibling', label: 'General Sibling (A ~ B)', symbol: '~' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCombinator(c.id as typeof activeCombinator)}
              className={cn(
                'p-3 rounded-xl border text-left transition-all',
                activeCombinator === c.id
                  ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white font-bold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              )}
            >
              <div className="font-mono text-xs text-amber-600 dark:text-amber-400">{c.symbol}</div>
              <div className="text-sm font-semibold truncate">{c.label}</div>
            </button>
          ))}
        </div>

        {/* Interactive Visual Explanation */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          {activeCombinator === 'descendant' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Descendant Combinator: `div p` (Separated by space)
                </h3>
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                  Matches Any Nesting Depth
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Matches <strong>every</strong> <code>&lt;p&gt;</code> that is inside a <code>&lt;div&gt;</code>, whether it is a child, grandchild, or 10 levels deep inside another container.
              </p>
              <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-200 space-y-1">
                <div>&lt;div class=&quot;parent&quot;&gt;</div>
                <div className="pl-4 text-emerald-400">&lt;p&gt;Child 1: MATCHED!&lt;/p&gt;</div>
                <div className="pl-4">&lt;section&gt;</div>
                <div className="pl-8 text-emerald-400">&lt;p&gt;Grandchild: ALSO MATCHED!&lt;/p&gt;</div>
                <div className="pl-4">&lt;/section&gt;</div>
                <div>&lt;/div&gt;</div>
              </div>
            </div>
          )}

          {activeCombinator === 'child' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Child Combinator: `div &gt; p`
                </h3>
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                  Direct Immediate Children Only
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Matches only <code>&lt;p&gt;</code> elements whose <strong>direct parent</strong> is that <code>&lt;div&gt;</code>. Nested grandchildren are ignored.
              </p>
              <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-200 space-y-1">
                <div>&lt;div class=&quot;parent&quot;&gt;</div>
                <div className="pl-4 text-emerald-400">&lt;p&gt;Immediate child: MATCHED!&lt;/p&gt;</div>
                <div className="pl-4">&lt;section&gt;</div>
                <div className="pl-8 text-rose-400">&lt;p&gt;Grandchild: NOT matched (parent is section, not div)&lt;/p&gt;</div>
                <div className="pl-4">&lt;/section&gt;</div>
                <div>&lt;/div&gt;</div>
              </div>
            </div>
          )}

          {activeCombinator === 'adjacent' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Adjacent Sibling Combinator: `h2 + p`
                </h3>
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                  The Very Next Neighbor Only
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Matches the <code>&lt;p&gt;</code> that appears <strong>immediately after</strong> the <code>&lt;h2&gt;</code> on the same DOM hierarchy level.
              </p>
              <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-200 space-y-1">
                <div>&lt;h2&gt;Chapter 1&lt;/h2&gt;</div>
                <div className="text-emerald-400">&lt;p&gt;Paragraph 1: MATCHED! (First neighbor)&lt;/p&gt;</div>
                <div className="text-rose-400">&lt;p&gt;Paragraph 2: NOT matched (not adjacent to h2)&lt;/p&gt;</div>
              </div>
            </div>
          )}

          {activeCombinator === 'sibling' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  General Sibling Combinator: `h2 ~ p`
                </h3>
                <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold">
                  All Following Siblings
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Matches <strong>all</strong> <code>&lt;p&gt;</code> elements that come after <code>&lt;h2&gt;</code>, as long as they share the same parent element.
              </p>
              <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-200 space-y-1">
                <div>&lt;h2&gt;Chapter 1&lt;/h2&gt;</div>
                <div className="text-emerald-400">&lt;p&gt;Paragraph 1: MATCHED!&lt;/p&gt;</div>
                <div>&lt;div class=&quot;divider&quot;&gt;&lt;/div&gt;</div>
                <div className="text-emerald-400">&lt;p&gt;Paragraph 2: ALSO MATCHED! (Same parent)&lt;/p&gt;</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: Pseudo-classes vs Pseudo-elements */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <Sparkles className="h-4 w-4" />
          <span>5. Pseudo-Classes vs Pseudo-Elements</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The Colon Rule: Single `:` vs Double `::`
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          This is one of the most common interview and exam questions for 1st-year students:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">:single-colon</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pseudo-Class</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Describes a State or Dynamic Condition
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Styles an existing HTML element when it is in a particular user interaction state or structural position.
            </p>
            <div className="space-y-1 font-mono text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div><code>:hover</code> — Cursor hovering over element</div>
              <div><code>:focus-visible</code> — Keyboard focused (Tab key)</div>
              <div><code>:nth-child(even)</code> — Every second item</div>
              <div><code>:not(.disabled)</code> — Negation filter</div>
            </div>
            <div className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
              Specificity Weight: (0, 0, 1, 0) — Counts as 1 Class!
            </div>
          </div>

          <div className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400">::double-colon</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pseudo-Element</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Creates or Targets a Sub-Part of the Element
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Creates a virtual piece of the DOM that does not exist in your HTML markup, or targets specific internal parts.
            </p>
            <div className="space-y-1 font-mono text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div><code>::before</code> — Injected child before content</div>
              <div><code>::after</code> — Injected child after content</div>
              <div><code>::placeholder</code> — Input ghost text</div>
              <div><code>::selection</code> — Highlighted user text</div>
            </div>
            <div className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
              Specificity Weight: (0, 0, 0, 1) — Counts as 1 Element!
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: The Specificity Formula Scoreboard */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <Calculator className="h-4 w-4" />
          <span>6. The Specificity Calculation Formula</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The 4-Slot Specificity Tuple: (A, B, C, D)
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          The browser uses a 4-slot comparison vector <code>(A, B, C, D)</code> to resolve conflicts. The comparison starts from the leftmost column (A). If A is tied, it checks B, then C, then D.
        </p>

        {/* The 4 Slot Breakdown Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-700 dark:text-slate-300">
              <tr>
                <th className="p-3 sm:p-4">Slot</th>
                <th className="p-3 sm:p-4">Category</th>
                <th className="p-3 sm:p-4">What Counts</th>
                <th className="p-3 sm:p-4">Example Selector</th>
                <th className="p-3 sm:p-4">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="p-3 sm:p-4 font-bold text-rose-500">A</td>
                <td className="p-3 sm:p-4 font-sans font-semibold text-slate-900 dark:text-white">Inline Styles</td>
                <td className="p-3 sm:p-4 font-sans text-slate-600 dark:text-slate-400">Written in HTML <code>style=&quot;...&quot;</code></td>
                <td className="p-3 sm:p-4 text-rose-500">&lt;div style=&quot;color:red&quot;&gt;</td>
                <td className="p-3 sm:p-4 font-bold text-rose-500">(1, 0, 0, 0)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="p-3 sm:p-4 font-bold text-amber-500">B</td>
                <td className="p-3 sm:p-4 font-sans font-semibold text-slate-900 dark:text-white">IDs</td>
                <td className="p-3 sm:p-4 font-sans text-slate-600 dark:text-slate-400">HTML IDs with hash <code>#id</code></td>
                <td className="p-3 sm:p-4 text-amber-500">#main-header</td>
                <td className="p-3 sm:p-4 font-bold text-amber-500">(0, 1, 0, 0)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="p-3 sm:p-4 font-bold text-blue-500">C</td>
                <td className="p-3 sm:p-4 font-sans font-semibold text-slate-900 dark:text-white">Classes, Attributes, Pseudo-classes</td>
                <td className="p-3 sm:p-4 font-sans text-slate-600 dark:text-slate-400"><code>.class</code>, <code>[type]</code>, <code>:hover</code></td>
                <td className="p-3 sm:p-4 text-blue-500">.btn:hover[disabled]</td>
                <td className="p-3 sm:p-4 font-bold text-blue-500">(0, 0, 3, 0)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="p-3 sm:p-4 font-bold text-emerald-500">D</td>
                <td className="p-3 sm:p-4 font-sans font-semibold text-slate-900 dark:text-white">Elements & Pseudo-elements</td>
                <td className="p-3 sm:p-4 font-sans text-slate-600 dark:text-slate-400">HTML tags <code>p</code>, <code>div</code>, <code>::before</code></td>
                <td className="p-3 sm:p-4 text-emerald-500">p::first-line</td>
                <td className="p-3 sm:p-4 font-bold text-emerald-500">(0, 0, 0, 2)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="p-3 sm:p-4 font-bold text-slate-400">-</td>
                <td className="p-3 sm:p-4 font-sans font-semibold text-slate-900 dark:text-white">Universal & Combinators</td>
                <td className="p-3 sm:p-4 font-sans text-slate-600 dark:text-slate-400"><code>*</code>, <code>&gt;</code>, <code>+</code>, <code>~</code>, <code>:where()</code></td>
                <td className="p-3 sm:p-4 text-slate-400">* or div &gt; p</td>
                <td className="p-3 sm:p-4 font-bold text-slate-400">(0, 0, 0, 0)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Crucial Insight Callout */}
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 space-y-2 text-xs text-indigo-950 dark:text-indigo-200">
          <div className="font-bold text-sm text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Mythbuster: Specificity is NOT Base-10 Arithmetic!</span>
          </div>
          <p className="leading-relaxed">
            Many 1st-year students mistakenly think of (0, 1, 0, 0) as 100 and (0, 0, 1, 0) as 10, believing that 11 classes (110) will beat 1 ID (100).
            <strong> That is 100% false!</strong> The columns are compared independently. <code>1 ID (0, 1, 0, 0)</code> will always beat <code>1,000 Classes (0, 0, 1000, 0)</code>!
          </p>
        </div>
      </section>

      {/* SECTION 7: Specificity Battle Arena (Interactive Quiz) */}
      <section id="battle-arena" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <Trophy className="h-4 w-4" />
          <span>7. Specificity Battle Arena</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Which Rule Wins? (Interactive Quiz)
          </h2>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            Round {currentRoundIdx + 1} of {BATTLE_ROUNDS.length}
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Put your skills to the test! Inspect the HTML and pick the rule that wins the clash:
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-md">
          {/* Scenario & HTML */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-slate-500">{currentRound.title}</div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{currentRound.scenario}</p>
            <div className="rounded-xl bg-[#0b1324] p-4 font-mono text-xs text-amber-300 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap">{currentRound.htmlSnippet}</pre>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Contestant Rules:</div>
            <div className="grid grid-cols-1 gap-3">
              {currentRound.options.map((opt, idx) => {
                const isSelected = selectedOptionIdx === idx;
                const showSuccess = hasAnswered && opt.isCorrect;
                const showError = hasAnswered && isSelected && !opt.isCorrect;

                return (
                  <button
                    key={idx}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border text-left font-mono text-xs sm:text-sm transition-all',
                      !hasAnswered && 'hover:border-amber-500 hover:bg-amber-500/5 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800',
                      showSuccess && 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-bold',
                      showError && 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200 font-bold',
                      hasAnswered && !showSuccess && !showError && 'opacity-60 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {showSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                      {showError && <XCircle className="h-5 w-5 text-rose-500 shrink-0" />}
                      {!hasAnswered && <span className="h-4 w-4 rounded-full border border-slate-400 shrink-0" />}
                      <span className="font-semibold">{opt.rule}</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      Score: {opt.score}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer Feedback Banner */}
          {hasAnswered && (
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div
                className={cn(
                  'p-4 rounded-xl text-xs sm:text-sm leading-relaxed border',
                  selectedOptionIdx !== null && currentRound.options[selectedOptionIdx].isCorrect
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200'
                    : 'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200'
                )}
              >
                <div className="font-bold text-sm mb-1">
                  {selectedOptionIdx !== null && currentRound.options[selectedOptionIdx].isCorrect
                    ? '🎉 Spot On!'
                    : '💡 Take a closer look at the scoreboard:'}
                </div>
                <p>{currentRound.options[currentRound.options.findIndex((o) => o.isCorrect)].explanation}</p>
              </div>

              <button
                onClick={nextBattleRound}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
              >
                <span>Next Battle Round</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 8: Live Specificity Calculator Sandbox */}
      <section id="live-calculator" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <Calculator className="h-4 w-4" />
          <span>8. Live Specificity Calculator Sandbox</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Test ANY Selector in Real-Time
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Type any CSS selector below or click one of the presets to see its exact mathematical breakdown:
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-md">
          {/* Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Type or edit selector:
            </label>
            <input
              type="text"
              value={calcInput}
              onChange={(e) => setCalcInput(e.target.value)}
              placeholder="e.g. nav.navbar ul.menu-list li:first-child a#active:hover"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">Try Presets:</span>
            {[
              'body > div.app p.lead',
              '#main-content h1.title:first-child',
              'form[data-active="true"] input[type="text"]:focus',
              'header#top-nav a.brand::after',
              ':is(h1, h2, h3) > a:hover',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => setCalcInput(preset)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Calculation Result Scoreboard */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                  Total Specificity Vector:
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white pt-1">
                  (0, {calcSpecificity.ids}, {calcSpecificity.classes}, {calcSpecificity.elements})
                </div>
              </div>

              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Format: <code>(Inline, IDs, Classes/Attrs/Pseudos, Elements)</code>
              </div>
            </div>

            {/* Pillar Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-center">
                <div className="text-xs text-slate-500 font-mono uppercase">Inline Styles</div>
                <div className="text-xl font-bold font-mono text-slate-400">0</div>
                <div className="text-[10px] text-slate-500">External rule</div>
              </div>

              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-center">
                <div className="text-xs text-amber-600 dark:text-amber-400 font-mono uppercase">IDs</div>
                <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{calcSpecificity.ids}</div>
                <div className="text-[10px] text-slate-500">x 100 pt weight</div>
              </div>

              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-center">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-mono uppercase">Classes / Attrs / Pseudos</div>
                <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">{calcSpecificity.classes}</div>
                <div className="text-[10px] text-slate-500">x 10 pt weight</div>
              </div>

              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-center">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono uppercase">Elements / Tags</div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{calcSpecificity.elements}</div>
                <div className="text-[10px] text-slate-500">x 1 pt weight</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: Visualizer Lab Integration */}
      <section id="visualizer" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <FlaskConical className="h-4 w-4" />
          <span>9. Hands-On Interactive DOM Lab</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Interactive Selector Target Sandbox
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Use the live visualizer below to see which HTML nodes get matched in real-time and copy the exact CSS rule:
        </p>

        {/* Existing SelectorsLab Embedded seamlessly */}
        <SelectorsLab />
      </section>

      {/* SECTION 10: 5 Classic 1st-Year Traps & Best Practices */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
          <AlertTriangle className="h-4 w-4" />
          <span>10. Common Traps & Pro-Tips</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          5 Classic 1st-Year Traps (And How to Avoid Them)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2 shadow-xs">
            <span className="text-xs font-mono font-bold text-rose-500 uppercase">Trap 1: The Accidental Space</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              `.btn.primary` vs `.btn .primary`
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <code>.btn.primary</code> (no space) means <strong>the same element</strong> must have BOTH classes.
              <br />
              <code>.btn .primary</code> (with a space) means an element with class <code>.primary</code> is <strong>nested inside</strong> an element with class <code>.btn</code>!
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2 shadow-xs">
            <span className="text-xs font-mono font-bold text-rose-500 uppercase">Trap 2: The `:first-child` Gotcha</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              `p:first-child` does NOT mean &quot;first paragraph&quot;!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              It means: <em>&quot;The element is a paragraph AND it is the very first child of its parent&quot;</em>. If your container starts with an <code>&lt;h1&gt;</code>, <code>p:first-child</code> matches <strong>NOTHING</strong>!
              <br />
              <strong>Fix:</strong> Use <code>p:first-of-type</code> instead!
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2 shadow-xs">
            <span className="text-xs font-mono font-bold text-rose-500 uppercase">Trap 3: Chaining Overkill</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              `body div#app main.container div.card p`
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Writing deep selector chains makes your styles brittle. If someone wraps the card in a <code>&lt;section&gt;</code>, your styling breaks!
              <br />
              <strong>Fix:</strong> Use a single class like <code>.card__text</code> (BEM methodology).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2 shadow-xs">
            <span className="text-xs font-mono font-bold text-emerald-500 uppercase">Best Practice: BEM Architecture</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Block__Element--Modifier
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              BEM names elements with single classes:
              <br />
              <code>.card</code> (Block)
              <br />
              <code>.card__title</code> (Element)
              <br />
              <code>.card__title--featured</code> (Modifier)
              <br />
              Every rule stays at a clean, predictable <code>(0, 0, 1, 0)</code>, completely eradicating specificity wars!
            </p>
          </div>
        </div>
      </section>

      {/* Footer Navigation Next Step */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase">Next Concept in Curriculum</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">2. Cascade & Inheritance</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            How browsers calculate computed values, CSS inheritance rules, and cascade layers (@layer).
          </p>
        </div>

        <Link
          href="/fullstack/css-cosmos/topics/cascade"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <span>Continue to Cascade</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
