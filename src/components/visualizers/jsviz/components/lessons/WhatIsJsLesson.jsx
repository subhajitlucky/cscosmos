'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Layers, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Check, 
  Copy, 
  GitBranch, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  Flame, 
  FileCode2 
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'The Java Myth',
    badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Is JavaScript a simplified version of the Java programming language?',
    code: `// Are Java and JavaScript related?\nconsole.log(java === javascript);`,
    options: [
      { 
        letter: 'A',
        label: 'No, they are completely different languages named similarly for marketing.', 
        correct: true, 
        why: 'Netscape licensed the name "Java" from Sun Microsystems in 1995 purely as a marketing tactic because Java was popular at the time. Their architectures, type systems, and semantics are unrelated.' 
      },
      { 
        letter: 'B',
        label: 'Yes, JavaScript was originally created as a lightweight scripting extension for Java applets.', 
        correct: false, 
        why: 'JavaScript was created independently by Brendan Eich in 10 days under the codename Mocha, drawing inspiration from Scheme, Self, and C—not Java.' 
      }
    ],
    explanationCorrect: 'Correct! As the classic computer science saying goes: "Java is to JavaScript as Car is to Carpet." They share syntax inspiration from C, but have completely different object models, runtimes, and design philosophies.',
    explanationIncorrect: 'Incorrect. While Netscape used the name for marketing in 1995, JavaScript is an independent language with dynamic typing, prototypal inheritance, and first-class functions.'
  },
  {
    id: 'q2',
    category: 'Spec vs Language',
    badgeClass: 'text-emerald-700 dark:text-brand-lime bg-emerald-500/10 border-emerald-500/20',
    title: 'What is the relationship between ECMAScript and JavaScript?',
    code: `// ECMA-262 defines the standard.\n// JavaScript engines implement it.`,
    options: [
      { 
        letter: 'A',
        label: 'ECMAScript is the official written specification; JavaScript is the programming language that implements it.', 
        correct: true, 
        why: 'ECMA-262 is the international technical standard maintained by the TC39 committee. Browser engines (like V8 and SpiderMonkey) read the ECMAScript spec and write code to execute JavaScript according to those rules.' 
      },
      { 
        letter: 'B',
        label: 'ECMAScript is an obsolete predecessor language that was replaced by JavaScript in 2015.', 
        correct: false, 
        why: 'ECMAScript is actively maintained today. In fact, ECMAScript 2026 is published and 2027 draft specifications are currently in progress.' 
      }
    ],
    explanationCorrect: 'Correct! Think of ECMAScript as the blueprint/recipe book, and JavaScript engines (like Chrome V8, Safari JavaScriptCore) as the builders who construct the actual runtime according to the blueprint.',
    explanationIncorrect: 'Incorrect. ECMAScript is the living technical standard (ECMA-262) that defines the JavaScript language specifications every year.'
  },
  {
    id: 'q3',
    category: 'TC39 Release Cadence',
    badgeClass: 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'How often does the TC39 committee release new official ECMAScript standards today?',
    code: `// Annual release cycle since 2015:\n// ES2015, ES2016, ... ES2026, ES2027`,
    options: [
      { 
        letter: 'A',
        label: 'Every year in June with an annual snapshot of finished proposals.', 
        correct: true, 
        why: 'Since ES2015 (ES6), TC39 abandoned multi-year megareleases in favor of an agile annual cadence. Every June, whatever proposals have reached Stage 4 are officially published as that year’s specification.' 
      },
      { 
        letter: 'B',
        label: 'Every 5 to 10 years whenever all major browser vendors agree on a complete rewrite.', 
        correct: false, 
        why: 'This was the old legacy model that caused a 10-year gap between ES3 (1999) and ES5 (2009). Since 2015, TC39 uses an annual release cycle.' 
      }
    ],
    explanationCorrect: 'Correct! TC39 ships an official ECMAScript edition every single year. Features advance through a 5-stage pipeline (Stage 0 to Stage 4), and all Stage 4 features get included in the upcoming annual edition.',
    explanationIncorrect: 'Incorrect. Prior to 2015, specifications took years to draft. Since ES2015, ECMAScript follows a predictable annual release cadence every summer.'
  }
];

export function WhatIsJsLesson({ topic }) {
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Quick Quiz Answers state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  const totalQuizQuestions = QUIZ_QUESTIONS.length;
  const answeredQuizCount = Object.keys(quizAnswers).length;
  const correctQuizCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] !== undefined && q.options[quizAnswers[q.id]]?.correct
  ).length;

  const currentQ = QUIZ_QUESTIONS[activeQuizIndex] || QUIZ_QUESTIONS[0];
  const currentAnswer = quizAnswers[currentQ.id];
  const isCurrentAnswered = currentAnswer !== undefined;
  const isCurrentCorrect = isCurrentAnswered && currentQ.options[currentAnswer]?.correct;

  const handleCopy = (code, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuizSelect = (questionId, optionIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleQuizReset = () => {
    setQuizAnswers({});
    setActiveQuizIndex(0);
  };

  const eras = [
    {
      id: '1995',
      year: '1995',
      title: 'The 10-Day Creation',
      tag: 'Mocha to JavaScript',
      desc: 'Brendan Eich created Mocha at Netscape in just 10 days in May 1995. Renamed to LiveScript and quickly to JavaScript as a marketing tie-in with Sun Microsystems Java.',
      code: `// 1995: LiveScript / Early JavaScript
function showGreeting() {
  alert("Welcome to the World Wide Web!");
}

// Simple form validation and basic button clicks
// Handled directly inside HTML attributes:
// <input type="button" onclick="showGreeting()">`
    },
    {
      id: '2009',
      year: '2009',
      title: 'ES5 & Standardization',
      tag: 'Strict Mode & JSON',
      desc: 'After years of browser wars and stalled progress, ECMAScript 5 formalized modern JavaScript. It added native JSON support, array iteration methods (map, filter), and strict mode.',
      code: `// 2009: ECMAScript 5 (ES5)
"use strict";

var numbers = [1, 2, 3, 4, 5];
var doubled = numbers.map(function(n) {
  return n * 2;
});

// Built-in JSON serialization:
var payload = JSON.stringify({ items: doubled });
console.log(payload); // "{"items":[2,4,6,8,10]}"`
    },
    {
      id: '2015',
      year: '2015',
      title: 'The ES6 / ES2015 Revolution',
      tag: 'The Modern Era',
      desc: 'The single most transformative update in JavaScript history. Introduced let & const, arrow functions, classes, template literals, destructuring, Promises, modules, and generators.',
      code: `// 2015: ECMAScript 2015 (ES6)
const fetchUser = async (id) => {
  const { name, role = "developer" } = await api.getUser(id);
  return \`Welcome \${name}! Your role is \${role}.\`;
};

class Team {
  constructor(name) {
    this.name = name;
  }
}`
    },
    {
      id: '2027',
      year: '2026/2027',
      title: 'Modern Living Specification',
      tag: 'Annual Releases & TC39',
      desc: 'ECMAScript evolves continuously with annual summer editions. Modern features include Object.groupBy(), Set mathematical operations (union, intersection), modern iterator helpers, and Error.isError().',
      code: `// Modern ECMAScript (2026 / 2027 Standards)
const scores = [85, 92, 78, 96, 64];

// Modern array grouping:
const grouped = Object.groupBy(scores, score => score >= 80 ? "pass" : "review");

// Set mathematical operations:
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);
const common = setA.intersection(setB); // Set { 3 }`
    }
  ];

  return (
    <div className="space-y-10 w-full">

      {/* =========================================================================
          1. LESSON HEADER
         ========================================================================= */}
      <header className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-brand-lime font-bold border border-emerald-500/20">
            Module 01: JavaScript Foundations &amp; Environment
          </span>
          <span>&bull;</span>
          <span className="font-bold text-[var(--text-main)]">Concept 01 of 100</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-main)]">
          What is JavaScript? History, Evolution &amp; ECMAScript
        </h1>

        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          How did a scripting language created in just 10 days to animate images on Netscape Navigator become the engine of the entire web, cloud backends, mobile apps, and machine learning interfaces? Here is the mental model behind JavaScript, its living standard <strong className="text-[var(--text-main)] font-semibold">ECMAScript</strong>, and how the language evolves.
        </p>
      </header>

      {/* =========================================================================
          2. THE CORE IDEA: THE BLUEPRINT VS THE ENGINE
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Core Idea: Specification vs. Implementation
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          One of the first confusions beginners face is hearing the terms <strong className="text-[var(--text-main)] font-semibold">JavaScript</strong>, <strong className="text-[var(--text-main)] font-semibold">ECMAScript</strong>, and <strong className="text-[var(--text-main)] font-semibold">TC39</strong> used interchangeably. Here is the clear distinction:
        </p>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: ECMAScript */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> The Blueprint
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                ECMAScript (ECMA-262)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                The official written standard. It dictates the grammar, keywords (<code className="font-mono">const</code>, <code className="font-mono">function</code>), built-in prototypes (<code className="font-mono">Array</code>, <code className="font-mono">Map</code>), and execution rules.
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-500/20 text-xs font-mono text-emerald-900 dark:text-emerald-300 font-semibold">
              // Theoretical Specification
            </div>
          </div>

          {/* Card 2: JavaScript */}
          <div className="p-5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4" /> The Language
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                JavaScript Runtimes
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                The actual language you write and run. JavaScript engines (Google V8, Apple JavaScriptCore, SpiderMonkey) implement ECMAScript and add host capabilities (DOM in browsers, <code className="font-mono">fs</code> in Node.js).
              </p>
            </div>
            <div className="pt-2 border-t border-blue-500/20 text-xs font-mono text-blue-900 dark:text-blue-300 font-semibold">
              // Executable Implementation
            </div>
          </div>

          {/* Card 3: TC39 */}
          <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4" /> The Guardians
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                TC39 Committee
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Technical Committee 39. Composed of browser vendors, engine architects, academics, and corporations. They review feature proposals and publish the annual standard every June.
              </p>
            </div>
            <div className="pt-2 border-t border-purple-500/20 text-xs font-mono text-purple-900 dark:text-purple-300 font-semibold">
              // Democratic Evolution
            </div>
          </div>

        </div>

        {/* Clear ASCII Architecture Diagram */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 sm:p-5 overflow-x-auto text-center shadow-xs">
          <div className="text-xs font-mono text-slate-400 mb-2 font-bold uppercase tracking-wider text-left">
            How JavaScript Features Become Standard:
          </div>
          <pre className="font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed inline-block text-left select-none">
{`┌────────────────────────────────────────────────────────┐
│             TC39 5-STAGE PROPOSAL PIPELINE             │
└───────────────────────────┬────────────────────────────┘
                            │
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   STAGE 1    │ ──▶ │   STAGE 2    │ ──▶ │   STAGE 3    │ ──▶ │   STAGE 4    │
│   Proposal   │     │    Draft     │     │  Candidate   │     │   Finished   │
├──────────────┤     ├──────────────┤     ├──────────────┤     ├──────────────┤
│ Initial idea │     │ Formal spec  │     │ Implemented  │     │ Merged into  │
│ & problem to │     │ syntax & API │     │ in 2+ engines│     │ the upcoming │
│ solve        │     │ description  │     │ for testing  │     │ annual ECMA  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘`}
          </pre>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE ERA EXPLORER
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Evolution of JavaScript: 4 Defining Eras
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Click an era below to see how JavaScript transformed from simple form scripts into a full-scale systems language:
        </p>

        {/* Segmented Era Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {eras.map((era, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={era.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-emerald-600 dark:border-brand-lime bg-emerald-50 dark:bg-emerald-950/30 text-[var(--text-main)] shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <span className="block font-mono text-xs font-bold text-emerald-700 dark:text-brand-lime">
                  {era.year}
                </span>
                <span className="block text-xs font-semibold truncate text-[var(--text-main)] mt-0.5">
                  {era.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Era Card */}
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime">
                Era: {eras[activeTab].year} &bull; {eras[activeTab].tag}
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)] mt-0.5">
                {eras[activeTab].title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(eras[activeTab].code, `era-${activeTab}`)}
              className="text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)] flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {copiedId === `era-${activeTab}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === `era-${activeTab}` ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {eras[activeTab].desc}
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto shadow-inner">
            <pre className="whitespace-pre leading-relaxed">
              <code>{eras[activeTab].code}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE 3 BIGGEST BEGINNER MYTHS BUSTED
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Common Misconceptions vs. Reality
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> Myth 1: Java &amp; JS
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
              &quot;JavaScript is just a scripting dialect of the Java language.&quot;
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-main)] pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <strong className="text-emerald-700 dark:text-brand-lime">Reality:</strong> They are fundamentally different languages with different type models, execution paradigms, and runtimes.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> Myth 2: Browser-Only
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
              &quot;JavaScript only runs inside web browsers to animate HTML.&quot;
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-main)] pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <strong className="text-emerald-700 dark:text-brand-lime">Reality:</strong> Node.js, Deno, and Bun run JavaScript on web servers, IoT microcontrollers, cloud functions, and desktop software.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> Myth 3: Slow &amp; Interpreted
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
              &quot;JavaScript is inherently slow because it is an interpreted language.&quot;
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-main)] pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <strong className="text-emerald-700 dark:text-brand-lime">Reality:</strong> Modern engines use sophisticated Just-In-Time (JIT) compilers that compile hot functions directly into native machine code.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. QUICK 3-QUESTION PRACTICE CHECK (ONE-BY-ONE FOCUSED)
         ========================================================================= */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
                Quick Knowledge Check
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                Test your understanding on these 3 simple questions (one by one):
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
              Score: <strong className="text-emerald-700 dark:text-brand-lime">{correctQuizCount}</strong> / {totalQuizQuestions}
            </span>
            {answeredQuizCount > 0 && (
              <button
                type="button"
                onClick={handleQuizReset}
                title="Reset all questions"
                className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Selector Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const isTabActive = activeQuizIndex === idx;
            const tabAnswer = quizAnswers[q.id];
            const isTabAnswered = tabAnswer !== undefined;
            const isTabCorrect = isTabAnswered && q.options[tabAnswer]?.correct;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setActiveQuizIndex(idx)}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                  isTabActive
                    ? 'border-emerald-600 dark:border-brand-lime bg-emerald-50/70 dark:bg-emerald-950/30 text-[var(--text-main)] shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                    isTabActive
                      ? 'bg-emerald-600 text-white dark:bg-brand-lime dark:text-slate-950'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <span className="block text-xs font-semibold truncate text-[var(--text-main)]">
                      {q.category}
                    </span>
                    <span className="hidden sm:block text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      Question {idx + 1}
                    </span>
                  </div>
                </div>

                {isTabAnswered && (
                  isTabCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-1.5" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Focused Single Question Card */}
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${currentQ.badgeClass}`}>
              Question {activeQuizIndex + 1} of {totalQuizQuestions} &bull; {currentQ.category}
            </span>

            {isCurrentAnswered && (
              <span className={`text-xs font-mono font-bold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${
                isCurrentCorrect
                  ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                  : 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400'
              }`}>
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" /> Incorrect
                  </>
                )}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] leading-snug">
            {currentQ.title}
          </h3>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto shadow-inner">
            <pre className="whitespace-pre">
              <code>{currentQ.code}</code>
            </pre>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
              Select an answer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = currentAnswer === optIdx;
                let optionStyle = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60';

                if (isSelected) {
                  if (opt.correct) {
                    optionStyle = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 shadow-xs font-bold';
                  } else {
                    optionStyle = 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30 shadow-xs font-bold';
                  }
                } else if (isCurrentAnswered && opt.correct) {
                  optionStyle = 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleQuizSelect(currentQ.id, optIdx)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between gap-2 ${optionStyle}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                          isSelected
                            ? opt.correct
                              ? 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950'
                              : 'bg-rose-600 text-white dark:bg-rose-400 dark:text-slate-950'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}>
                          {opt.letter}
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-semibold">
                          Option {opt.letter}
                        </span>
                      </div>

                      {isSelected && (
                        opt.correct ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        )
                      )}
                    </div>

                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {opt.label}
                    </p>

                    {isCurrentAnswered && (
                      <p className="text-xs font-sans text-zinc-600 dark:text-zinc-300 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 leading-relaxed">
                        {opt.why}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {isCurrentAnswered && (
            <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${
              isCurrentCorrect
                ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                : 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="p-1 rounded-md shrink-0 mt-0.5 bg-white/60 dark:bg-zinc-900/60">
                {isCurrentCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <div className="space-y-1">
                <p className="font-semibold">
                  {isCurrentCorrect ? 'Concept Verified' : 'Conceptual Clarification'}
                </p>
                <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {isCurrentCorrect ? currentQ.explanationCorrect : currentQ.explanationIncorrect}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Stepper Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              disabled={activeQuizIndex === 0}
              onClick={() => setActiveQuizIndex(prev => Math.max(0, prev - 1))}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {QUIZ_QUESTIONS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveQuizIndex(dotIdx)}
                  title={`Jump to Question ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    activeQuizIndex === dotIdx
                      ? 'w-6 bg-emerald-600 dark:bg-brand-lime'
                      : 'w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600'
                  }`}
                />
              ))}
            </div>

            {activeQuizIndex < totalQuizQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setActiveQuizIndex(prev => Math.min(totalQuizQuestions - 1, prev + 1))}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-brand-lime dark:text-slate-950 hover:brightness-105 transition-all shadow-xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveQuizIndex(0)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Back to Q1</span>
              </button>
            )}
          </div>
        </div>

        {answeredQuizCount === totalQuizQuestions && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-brand-lime shrink-0" />
              <p className="text-xs sm:text-sm font-medium">
                {correctQuizCount === totalQuizQuestions ? (
                  <><strong>Perfect Score! 3 / 3 correct.</strong> You understand the origins of JavaScript and the role of TC39.</>
                ) : (
                  <><strong>Quiz Completed ({correctQuizCount}/{totalQuizQuestions} correct).</strong> Review the questions above to solidify the difference between ECMAScript and JavaScript.</>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuizReset}
              className="text-xs font-semibold font-mono underline hover:no-underline shrink-0 text-emerald-700 dark:text-brand-lime"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </section>

      {/* Footer Next Concept Link */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/jsviz/learn"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Curriculum Index</span>
        </Link>

        <Link
          href="/jsviz/topic/javascript-runtime-environments-browser-vs-nodejs"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-brand-lime dark:text-slate-950 font-mono text-xs font-bold transition-all shadow-xs"
        >
          <span>Next: Concept 02 (Browser vs Node.js)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

export default WhatIsJsLesson;
