'use client';

import React, { useState, useMemo } from 'react';
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
  Globe, 
  Server, 
  ShieldCheck, 
  Copy, 
  Check, 
  Terminal, 
  Cpu, 
  FileCode2 
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'The Global Object',
    badgeClass: 'text-emerald-700 dark:text-brand-lime bg-emerald-500/10 border-emerald-500/20',
    title: 'What is the universal global object that safely works across Browsers, Node.js, and Web Workers?',
    code: `// Modern universal global access:\nconsole.log(typeof ???);`,
    options: [
      { 
        letter: 'A',
        label: 'globalThis', 
        correct: true, 
        why: 'Introduced in ES2020, globalThis provides a standardized, universal reference to the top-level global scope regardless of whether you are in a Browser (window), Node.js (global), or Web Worker (self).' 
      },
      { 
        letter: 'B',
        label: 'window', 
        correct: false, 
        why: 'window is specific to the Browser DOM environment. Trying to access window in Node.js throws a ReferenceError: window is not defined.' 
      }
    ],
    explanationCorrect: 'Correct! Before ES2020, writing cross-platform code required fragile checks like `typeof window !== "undefined" ? window : global`. Today, `globalThis` is the official standard everywhere.',
    explanationIncorrect: 'Incorrect. While `window` exists in browsers, it does not exist in Node.js or Service Workers. Use `globalThis` for cross-environment code.'
  },
  {
    id: 'q2',
    category: 'Security Sandboxing',
    badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Why can Node.js read local hard drive files with fs, but browser JavaScript cannot?',
    code: `// Node.js can do this; Browsers block it:\nconst fs = require('fs');\nconst secret = fs.readFileSync('/etc/passwd');`,
    options: [
      { 
        letter: 'A',
        label: 'Browsers enforce strict sandbox security to prevent malicious websites from reading your private files.', 
        correct: true, 
        why: 'If browser JavaScript had unrestricted filesystem access, visiting any random website would allow attackers to steal your personal documents and passwords. Browsers strictly sandbox the runtime.' 
      },
      { 
        letter: 'B',
        label: 'JavaScript engines lack the binary data structures needed to represent disk files.', 
        correct: false, 
        why: 'JavaScript has ArrayBuffer, TypedArrays, and Blobs. The limitation is purely security policy enforced by the browser host environment.' 
      }
    ],
    explanationCorrect: 'Correct! The runtime environment sets the boundaries. Node.js is an operating system tool for developers with full disk access, whereas the browser is a zero-trust sandbox designed to keep users safe.',
    explanationIncorrect: 'Incorrect. JavaScript has all the binary types needed; the restriction is a fundamental security sandbox enforced by browser runtimes.'
  },
  {
    id: 'q3',
    category: 'ECMAScript vs Host APIs',
    badgeClass: 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'Where do document.querySelector and window come from in JavaScript?',
    code: `const button = document.querySelector('button');`,
    options: [
      { 
        letter: 'A',
        label: 'They are Web APIs provided by the Browser host environment, not part of the core ECMAScript specification.', 
        correct: true, 
        why: 'The ECMA-262 specification only defines the core language (strings, numbers, objects, arrays, promises). The Document Object Model (DOM) and window are defined separately by the W3C and WHATWG as Web APIs.' 
      },
      { 
        letter: 'B',
        label: 'They are built-in ECMAScript keywords defined in the core language alongside Array and Object.', 
        correct: false, 
        why: 'If document were a core ECMAScript feature, Node.js would have it natively. It doesn’t because document belongs to the browser environment.' 
      }
    ],
    explanationCorrect: 'Correct! The DOM (`document`) is injected by the browser. Core ECMAScript has no concept of HTML elements, screens, or user clicks.',
    explanationIncorrect: 'Incorrect. `document` is not part of ECMAScript. It is an external API injected by the browser environment so JavaScript can manipulate web pages.'
  }
];

export function RuntimeEnvironmentsLesson({ topic, content }) {
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Quick Quiz Answers state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  const quizList = useMemo(() => {
    if (content?.quiz && Array.isArray(content.quiz) && content.quiz.length > 0) {
      return content.quiz;
    }
    return QUIZ_QUESTIONS;
  }, [content]);

  const totalQuizQuestions = quizList.length;
  const answeredQuizCount = Object.keys(quizAnswers).length;
  const correctQuizCount = quizList.filter(
    (q) => quizAnswers[q.id] !== undefined && q.options[quizAnswers[q.id]]?.correct
  ).length;

  const currentQ = quizList[activeQuizIndex] || quizList[0];
  const currentAnswer = quizAnswers[currentQ?.id];
  const isCurrentAnswered = currentAnswer !== undefined;
  const isCurrentCorrect = isCurrentAnswered && currentQ?.options?.[currentAnswer]?.correct;

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

  const runtimeScenarios = [
    {
      id: 'globals',
      title: '1. Accessing Globals',
      badge: 'Scope',
      desc: 'Browsers use `window`, Node.js uses `global`, but modern code uses universal `globalThis`.',
      browserCode: `// In Browser:
console.log(window.location.href);
console.log(window === globalThis); // true`,
      nodeCode: `// In Node.js:
console.log(process.version);
console.log(global === globalThis); // true`
    },
    {
      id: 'io',
      title: '2. I/O & Filesystem',
      badge: 'Security',
      desc: 'Browsers are sandboxed from disk; Node.js can interact with local files and operating systems.',
      browserCode: `// In Browser (Sandboxed):
// ❌ No direct disk access!
// ✅ Fetch over HTTP network only:
fetch('/api/user.json')
  .then(res => res.json())
  .then(data => console.log(data));`,
      nodeCode: `// In Node.js (System Access):
import fs from 'node:fs';

// Read file directly from local SSD:
const data = fs.readFileSync('./user.json', 'utf8');
console.log(JSON.parse(data));`
    },
    {
      id: 'apis',
      title: '3. Host Capabilities',
      badge: 'APIs',
      desc: 'Browsers manipulate DOM trees and cameras; Node.js manages TCP sockets, servers, and processes.',
      browserCode: `// Browser Web APIs:
document.title = "New Message";
navigator.geolocation.getCurrentPosition(pos => {
  console.log(pos.coords.latitude);
});`,
      nodeCode: `// Node.js System APIs:
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end('Hello from Node Server!');
});
server.listen(3000);`
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
          <span className="font-bold text-[var(--text-main)]">Concept 02 of 100</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-main)]">
          JavaScript Runtime Environments: Browser vs Node.js
        </h1>

        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          JavaScript does not execute in a vacuum. By itself, ECMAScript cannot create an HTTP server or click a button on a web page. Those superpowers are injected by the <strong className="text-[var(--text-main)] font-semibold">Host Runtime Environment</strong>.
        </p>
      </header>

      {/* =========================================================================
          2. THE CORE IDEA: THE RUNTIME FORMULA
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Core Idea: The Runtime Equation
          </h2>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 font-mono text-xs sm:text-sm text-center text-emerald-900 dark:text-brand-lime font-bold">
          JavaScript Runtime = Core Engine (V8) + Host APIs + Event Loop Coordinator
        </div>

        {/* 2-Column Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Browser Card */}
          <div className="p-5 sm:p-6 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Client Host
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                The Browser Runtime
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Designed for user interaction, visual rendering, and zero-trust security.
              </p>
              <div className="pt-2 border-t border-blue-500/20 space-y-1 text-xs font-mono text-zinc-800 dark:text-zinc-200">
                <div>&bull; <strong className="text-[var(--text-main)]">Global Object:</strong> <code className="text-blue-700 dark:text-blue-400">window</code></div>
                <div>&bull; <strong className="text-[var(--text-main)]">DOM &amp; UI:</strong> <code className="text-blue-700 dark:text-blue-400">document, Canvas</code></div>
                <div>&bull; <strong className="text-[var(--text-main)]">Network:</strong> <code className="text-blue-700 dark:text-blue-400">fetch, WebSocket</code></div>
                <div>&bull; <strong className="text-[var(--text-main)]">Security:</strong> Sandboxed (No arbitrary filesystem)</div>
              </div>
            </div>
            <div className="pt-2 text-xs font-mono text-blue-900 dark:text-blue-300 font-semibold">
              // Focus: Rendering &amp; User Experience
            </div>
          </div>

          {/* Node.js Card */}
          <div className="p-5 sm:p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime flex items-center gap-1.5">
                <Server className="w-4 h-4" /> Server Host
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                The Node.js Runtime
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Created in 2009 by Ryan Dahl using Google V8 and <code className="font-mono">libuv</code> for high-throughput network servers.
              </p>
              <div className="pt-2 border-t border-emerald-500/20 space-y-1 text-xs font-mono text-zinc-800 dark:text-zinc-200">
                <div>&bull; <strong className="text-[var(--text-main)]">Global Object:</strong> <code className="text-emerald-700 dark:text-brand-lime">global</code></div>
                <div>&bull; <strong className="text-[var(--text-main)]">Filesystem:</strong> <code className="text-emerald-700 dark:text-brand-lime">fs, path</code></div>
                <div>&bull; <strong className="text-[var(--text-main)]">Operating System:</strong> <code className="text-emerald-700 dark:text-brand-lime">process, os</code></div>
                <div>&bull; <strong className="text-[var(--text-main)]">Networking:</strong> <code className="text-emerald-700 dark:text-brand-lime">http, net, crypto</code></div>
              </div>
            </div>
            <div className="pt-2 text-xs font-mono text-emerald-900 dark:text-emerald-300 font-semibold">
              // Focus: Backend Servers &amp; CLI Tools
            </div>
          </div>

        </div>

        {/* ASCII Architecture Comparison */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 overflow-x-auto text-center shadow-xs">
          <div className="text-xs font-mono text-slate-400 mb-2 font-bold uppercase tracking-wider text-left">
            How The Runtimes Wrap the Same Engine:
          </div>
          <pre className="font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed inline-block text-left select-none">
{`┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│         BROWSER RUNTIME         │       │         NODE.JS RUNTIME         │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ Web APIs:                       │       │ C++ Bindings & Libuv:           │
│ • document, window, DOM events  │       │ • fs, path, process             │
│ • fetch, localStorage, Canvas   │       │ • http, net, crypto, stream     │
│                                 │       │                                 │
│      ┌───────────────────┐      │       │      ┌───────────────────┐      │
│      │   CORE V8 ENGINE  │      │       │      │   CORE V8 ENGINE  │      │
│      │ • Stack & Heap    │      │       │      │ • Stack & Heap    │      │
│      │ • Garbage Collec. │      │       │      │ • Garbage Collec. │      │
│      │ • ECMAScript Spec │      │       │      │ • ECMAScript Spec │      │
│      └───────────────────┘      │       │      └───────────────────┘      │
│                                 │       │                                 │
│ Sandboxed (No OS Disk Access)   │       │ Full Operating System Access    │
└─────────────────────────────────┘       └─────────────────────────────────┘`}
          </pre>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE RUNTIME COMPARATOR
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Side-by-Side: Browser vs. Node.js in Action
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Select a common programming task to see how the code differs across environments:
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {runtimeScenarios.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-2 rounded-xl border text-xs font-mono font-medium transition-all ${
                activeTab === idx
                  ? 'border-emerald-600 dark:border-brand-lime bg-emerald-50 dark:bg-emerald-950/30 text-[var(--text-main)] font-bold shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>

        {/* Comparison Viewer */}
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-4">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
            {runtimeScenarios[activeTab].desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Browser Code */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Inside Browser Runtime
              </span>
              <div className="rounded-xl border border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-slate-950 p-4 font-mono text-xs text-zinc-900 dark:text-slate-100 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre leading-relaxed">
                  <code>{runtimeScenarios[activeTab].browserCode}</code>
                </pre>
              </div>
            </div>

            {/* Node.js Code */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-brand-lime flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> Inside Node.js Runtime
              </span>
              <div className="rounded-xl border border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-slate-950 p-4 font-mono text-xs text-zinc-900 dark:text-slate-100 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre leading-relaxed">
                  <code>{runtimeScenarios[activeTab].nodeCode}</code>
                </pre>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. COMPARISON MATRIX TABLE
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Runtime Feature Matrix
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[var(--text-main)] font-semibold">
              <tr>
                <th className="py-2.5 px-4 font-mono">Feature</th>
                <th className="py-2.5 px-4">Browser Runtime</th>
                <th className="py-2.5 px-4">Node.js Runtime</th>
                <th className="py-2.5 px-4 font-mono">Universal Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200">
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-[var(--text-main)]">Global Object</td>
                <td className="py-2.5 px-4 font-mono text-blue-700 dark:text-blue-400">window, self</td>
                <td className="py-2.5 px-4 font-mono text-emerald-700 dark:text-brand-lime">global</td>
                <td className="py-2.5 px-4 font-mono font-bold text-emerald-800 dark:text-brand-lime">globalThis (ES2020)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-[var(--text-main)]">Direct Disk Access</td>
                <td className="py-2.5 px-4 text-rose-600 dark:text-rose-400 font-semibold">❌ Blocked (Sandboxed)</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">✅ Full Access (node:fs)</td>
                <td className="py-2.5 px-4 text-zinc-500">Not supported in client</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-[var(--text-main)]">HTML DOM Tree</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">✅ Native (document)</td>
                <td className="py-2.5 px-4 text-rose-600 dark:text-rose-400 font-semibold">❌ None (Headless)</td>
                <td className="py-2.5 px-4 text-zinc-500">Requires jsdom on server</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-[var(--text-main)]">HTTP Server</td>
                <td className="py-2.5 px-4 text-rose-600 dark:text-rose-400 font-semibold">❌ Cannot bind ports</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">✅ Native (node:http)</td>
                <td className="py-2.5 px-4 text-zinc-500">Server environment only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-[var(--text-main)]">Timers (setTimeout)</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">✅ Injected by Window</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">✅ Injected by Libuv</td>
                <td className="py-2.5 px-4 font-mono text-emerald-800 dark:text-brand-lime">Supported everywhere</td>
              </tr>
            </tbody>
          </table>
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
                Test your understanding on runtime boundaries (one by one):
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
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {quizList.map((q, idx) => {
            const isTabActive = activeQuizIndex === idx;
            const tabAnswer = quizAnswers[q.id];
            const isTabAnswered = tabAnswer !== undefined;
            const isTabCorrect = isTabAnswered && q.options[tabAnswer]?.correct;

            return (
              <button
                key={q.id || idx}
                type="button"
                onClick={() => setActiveQuizIndex(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-left transition-all ${
                  isTabActive
                    ? 'border-emerald-600 dark:border-brand-lime bg-emerald-50/70 dark:bg-emerald-950/30 text-[var(--text-main)] shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                  isTabActive
                    ? 'bg-emerald-600 text-white dark:bg-brand-lime dark:text-slate-950'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold max-w-[80px] sm:max-w-[120px] truncate text-[var(--text-main)]">
                  {q.category}
                </span>

                {isTabAnswered && (
                  isTabCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
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

          <div className="rounded-xl bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 p-4 font-mono text-xs sm:text-sm text-zinc-900 dark:text-slate-100 overflow-x-auto shadow-inner">
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
                  {isCurrentCorrect ? (currentQ.explanationCorrect || currentQ.options?.find(o => o.correct)?.why || 'Correct!') : (currentQ.explanationIncorrect || currentQ.options?.[currentAnswer]?.why || 'Conceptual Clarification')}
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
              {quizList.map((_, dotIdx) => (
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
                  <><strong>Perfect Score! 3 / 3 correct.</strong> You understand the runtime boundaries between Browser Web APIs and Node.js.</>
                ) : (
                  <><strong>Quiz Completed ({correctQuizCount}/{totalQuizQuestions} correct).</strong> Review the questions above to master globalThis and sandboxing.</>
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

      {/* Footer Prev / Next Links */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/jsviz/topic/what-is-javascript-history-evolution-ecmascript"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-mono text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous: Concept 01</span>
        </Link>

        <Link
          href="/jsviz/topic/javascript-engine-architecture-execution"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-brand-lime dark:text-slate-950 font-mono text-xs font-bold transition-all shadow-xs"
        >
          <span>Next: Concept 03 (Engine Architecture)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

export default RuntimeEnvironmentsLesson;
