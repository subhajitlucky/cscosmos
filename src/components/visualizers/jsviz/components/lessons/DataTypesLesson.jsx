'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Cpu, 
  Lightbulb, 
  AlertTriangle,
  Code2,
  Table,
  Terminal,
  Zap,
  Layers,
  ArrowRight,
  Database,
  Sparkles,
  Play,
  Clock
} from 'lucide-react';
import CodeEditor from '../CodeEditor';
import VisualizerCanvas from '../VisualizerCanvas';

export function DataTypesLesson({ topic, content }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Interactive Memory Simulator state
  const [memoryState, setMemoryState] = useState('primitive_initial');

  // Interactive Quiz state (5 diagnostic challenges)
  const [quizAnswers, setQuizAnswers] = useState({});

  // Live Sandbox state
  const [liveCode, setLiveCode] = useState(`// Try your own code in the live memory engine:
let score = 100;
let user = { name: "Alice", role: "admin" };
let partner = user;

partner.name = "Bob";
console.log(user.name); // "Bob"`);
  const [isRunning, setIsRunning] = useState(false);

  const handleCopy = (code, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuizSelect = (questionIndex, optionIndex) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleRunCode = (newCode) => {
    setLiveCode(newCode);
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 200);
  };

  const phases = [
    { id: 'phase-1', number: '1', title: 'Intuition' },
    { id: 'phase-2', number: '2', title: 'Mistake & Fix' },
    { id: 'phase-3', number: '3', title: '3 Rules' },
    { id: 'phase-4', number: '4', title: 'Comparison Table' },
    { id: 'phase-5', number: '5', title: 'In Memory' },
    { id: 'phase-6', number: '6', title: 'Real Scenarios' },
    { id: 'phase-7', number: '7', title: 'Practice Drill' },
    { id: 'phase-8', number: '8', title: 'Summary' },
    { id: 'phase-9', number: '9', title: 'Live Lab' },
  ];

  const scrollToPhase = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Lesson Header Banner */}
      <div className="space-y-3 pb-2 border-b border-[var(--border-main)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-brand-lime font-mono text-xs font-bold border border-emerald-500/20">
            Concept #001
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--bg-surface)] text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-[var(--border-main)]">
            Core Engine Architecture
          </span>
          <span className="text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-main)]">
            <Clock className="h-3.5 w-3.5" />
            10 min read
          </span>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-[var(--bg-surface)] text-zinc-700 dark:text-zinc-300 border border-[var(--border-main)]">
            Foundational Systems
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-main)] tracking-tight">
          JavaScript Data Types &amp; Memory Layout
        </h1>

        <p className="text-base text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed">
          Master the V8 engine&apos;s memory architecture from first principles. Understand the Call Stack vs. Memory Heap, why primitives are immutable, how reference pointers cause silent mutations, and how to write defensive high-performance JavaScript.
        </p>
      </div>

      {/* Clean, Minimal Sticky Navigation Bar */}
      <nav aria-label="Lesson phases" className="sticky top-20 z-20 py-2.5 px-3 bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-main)] rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 px-1">
          Sections:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => scrollToPhase(phase.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span className="text-emerald-700 dark:text-brand-lime font-bold">{phase.number}.</span>
              <span>{phase.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* =========================================================================
          PHASE 1: FIRST-PRINCIPLES INTUITION
         ========================================================================= */}
      <section id="phase-1" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-brand-lime border border-emerald-500/20 text-xs font-semibold">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)] tracking-tight">
            First-Principles Intuition: The Call Stack vs The Memory Heap
          </h2>
        </div>

        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Every value in JavaScript belongs to one of two fundamental memory categories: fixed-size <strong className="text-[var(--text-main)]">Primitives</strong> stored directly inside CPU execution frames, or dynamic <strong className="text-[var(--text-main)]">Objects</strong> allocated in the memory heap.
        </p>

        {/* 2-Card Visual Architecture Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: The Call Stack (Primitives) */}
          <div className="p-6 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-brand-lime font-mono">
                The 7 Primitives (Pass-by-Value)
              </span>
              <Cpu className="w-4 h-4 text-emerald-700 dark:text-brand-lime" />
            </div>
            
            <h3 className="text-base font-semibold text-[var(--text-main)]">
              The Call Stack: Fixed-Size, Discrete Storage
            </h3>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
              Numbers, strings, booleans, symbols, BigInts, null, and undefined have fixed byte widths. They are stored directly inside the execution context stack frame. When you copy a primitive, JavaScript performs a bitwise copy of the raw value.
            </p>

            <div className="pt-2 border-t border-[var(--border-main)] text-xs text-emerald-800 dark:text-brand-lime font-medium">
              Invariant: Modifying a copied variable never touches the original.
            </div>
          </div>

          {/* Card 2: The Memory Heap (Objects) */}
          <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 font-mono">
                Objects &amp; Arrays (Pass-by-Reference)
              </span>
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>

            <h3 className="text-base font-semibold text-[var(--text-main)]">
              The Memory Heap: Dynamic, Shared Pointers
            </h3>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
              Objects, arrays, and functions can grow to any size. They are allocated in the heap memory pool. Variables on the stack do not hold the object; they hold a 64-bit memory address pointer referencing that heap allocation.
            </p>

            <div className="pt-2 border-t border-blue-500/30 text-xs text-blue-800 dark:text-blue-400 font-medium">
              Invariant: Copying duplicates only the pointer; both variables point to the same object.
            </div>
          </div>

        </div>

        {/* Why this matters callout */}
        <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] flex items-start gap-3.5">
          <Lightbulb className="w-5 h-5 text-emerald-700 dark:text-brand-lime shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
            <span className="font-semibold text-[var(--text-main)]">Why does the V8 engine split memory this way?</span>
            <p>
              The CPU Call Stack operates as a high-speed Last-In-First-Out (LIFO) structure requiring contiguous, predictable byte offsets ($O(1)$ push and pop). If variable-sized dictionaries or unbounded arrays lived on the stack, they would fragment memory and cause frequent stack overflows. Storing dynamic structures in the heap keeps the execution stack blisteringly fast while enabling garbage-collected object sharing.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 2: THE MISTAKE & THE FIX
         ========================================================================= */}
      <section id="phase-2" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-brand-lime border border-emerald-500/20 text-xs font-semibold">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)] tracking-tight">
            Step-by-Step: The Classic Mutation Mistake &amp; The Fix
          </h2>
        </div>

        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          The single most common bug in modern JavaScript applications is unintended state mutation through shared reference pointers. Let’s observe the bug and the production-grade fix:
        </p>

        {/* Side-by-Side: Broken Code vs Fixed Code */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Step 2A: The Broken Code */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Step 2A: The Accidental Shared Mutation Bug</span>
              </span>
              <button
                onClick={() => handleCopy(`const originalConfig = { retries: 3, cache: true };\nconst workerConfig = originalConfig; // Pointer copied, NOT object!\n\nworkerConfig.retries = 0;\n\nconsole.log(originalConfig.retries); // 0 (Corrupted original!)`, 'code-fail')}
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-[var(--text-main)] flex items-center gap-1 px-2 py-0.5 rounded border border-[var(--border-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {copiedIndex === 'code-fail' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 'code-fail' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm overflow-x-auto shadow-sm">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">const</span> originalConfig = &#123; retries: <span className="text-amber-300">3</span>, cache: <span className="text-pink-400">true</span> &#125;;{'\n'}
                  <span className="text-pink-400">const</span> workerConfig = originalConfig; <span className="text-slate-400 italic">// Both share pointer 0x4F12</span>{'\n\n'}
                  <span className="text-rose-400 font-semibold">workerConfig.retries = 0;</span> <span className="text-slate-400 italic">// Mutates shared heap memory!</span>{'\n\n'}
                  <span className="text-sky-300">console.log</span>(originalConfig.retries); <span className="text-rose-400 italic">// 0 (Corrupted!)</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Step 2B: The Working Fix */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Step 2B: The Production Fix (Defensive Cloning)</span>
              </span>
              <button
                onClick={() => handleCopy(`const originalConfig = { retries: 3, cache: true };\n// Shallow clone using spread or deep clone using structuredClone:\nconst workerConfig = { ...originalConfig };\n\nworkerConfig.retries = 0;\n\nconsole.log(originalConfig.retries); // 3 (Safe!)`, 'code-fix')}
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-[var(--text-main)] flex items-center gap-1 px-2 py-0.5 rounded border border-[var(--border-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {copiedIndex === 'code-fix' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 'code-fix' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm overflow-x-auto shadow-sm">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">const</span> originalConfig = &#123; retries: <span className="text-amber-300">3</span>, cache: <span className="text-pink-400">true</span> &#125;;{'\n'}
                  <span className="text-emerald-300 font-semibold">const</span> workerConfig = &#123; ...originalConfig &#125;; <span className="text-slate-400 italic">// Brand-new heap allocation!</span>{'\n\n'}
                  workerConfig.retries = <span className="text-amber-300">0</span>; <span className="text-slate-400 italic">// Modifies workerConfig only</span>{'\n\n'}
                  <span className="text-sky-300">console.log</span>(originalConfig.retries); <span className="text-emerald-400 italic">// 3 (Protected!)</span>
                </code>
              </pre>
            </div>
          </div>

        </div>

        {/* Diagnostic Terminal */}
        <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-emerald-800 dark:text-brand-lime font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Memory Equality Diagnostics (V8 Pointer Inspection)</span>
            </span>
            <span className="text-zinc-600 dark:text-zinc-400 font-mono">Terminal</span>
          </div>

          <div className="p-4 rounded-lg bg-black border border-slate-800 font-mono text-xs sm:text-sm leading-relaxed space-y-1 text-slate-100 shadow-inner">
            <div className="text-slate-400">&gt; originalConfig === workerConfig (Before Clone)</div>
            <div className="text-emerald-400 font-bold">&lt; true // Both variables share pointer address 0x4F12</div>
            <div className="text-slate-500">---</div>
            <div className="text-slate-400">&gt; originalConfig === workerConfig (After &#123; ...originalConfig &#125;)</div>
            <div className="text-cyan-300 font-bold">&lt; false // workerConfig points to new heap address 0x4F38</div>
          </div>

          <div className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-brand-lime shrink-0 mt-0.5" />
            <span>
              <strong className="text-[var(--text-main)]">The Golden Rule of State:</strong> In React, Vue, Redux, and Node microservices, never mutate objects directly. Always create a shallow copy (`&#123; ...obj &#125;`) or deep copy (`structuredClone(obj)`) to preserve state predictability.
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 3: THE 3 CORE RULES
         ========================================================================= */}
      <section id="phase-3" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-brand-lime border border-emerald-500/20 text-xs font-semibold">
            03
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)] tracking-tight">
            The Three Invariants: Immutability, Function Passing, and Equality
          </h2>
        </div>

        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Three non-negotiable rules govern how JavaScript engines execute variable operations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Rule 1: Primitives are Immutable */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-brand-lime font-mono uppercase">
                Rule 1 • Primitive Immutability
              </span>

              <h3 className="text-base font-semibold text-[var(--text-main)]">
                Primitives cannot be altered in-place
              </h3>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                You cannot edit a character in a string or change bits of a number. Bracket index assignment silently fails in non-strict mode. To modify a primitive, you must replace the binding with a newly allocated value.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">let</span> str = <span className="text-emerald-300">&quot;cat&quot;</span>;{'\n'}
                  str[<span className="text-amber-300">0</span>] = <span className="text-emerald-300">&quot;b&quot;</span>; <span className="text-rose-400 italic">// Fails silently!</span>{'\n'}
                  <span className="text-sky-300">console.log</span>(str); <span className="text-slate-400 italic">// Still &quot;cat&quot;</span>{'\n\n'}
                  str = <span className="text-emerald-300">&quot;b&quot;</span> + str.<span className="text-sky-300">slice</span>(<span className="text-amber-300">1</span>); <span className="text-emerald-400 italic">// &quot;bat&quot;</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Rule 2: Function Parameters */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono uppercase">
                Rule 2 • Function Arguments
              </span>

              <h3 className="text-base font-semibold text-[var(--text-main)]">
                Passed by value, but objects pass pointers
              </h3>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                JavaScript is strictly pass-by-value. However, when passing an object, the value being passed is the 64-bit pointer! Modifying properties inside the function mutates the caller’s object in the heap.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">function</span> <span className="text-sky-300">reset</span>(data) &#123;{'\n'}
                  {'  '}data.count = <span className="text-amber-300">0</span>; <span className="text-rose-400 italic">// Mutates caller!</span>{'\n'}
                  &#125;{'\n\n'}
                  <span className="text-pink-400">const</span> state = &#123; count: <span className="text-amber-300">99</span> &#125;;{'\n'}
                  <span className="text-sky-300">reset</span>(state); <span className="text-slate-400 italic">// state.count is now 0</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Rule 3: Strict Equality */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono uppercase">
                Rule 3 • Identity vs Content
              </span>

              <h3 className="text-base font-semibold text-[var(--text-main)]">
                === compares address, not properties
              </h3>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                Two primitive numbers with the same value are strictly equal (<code className="font-mono text-[var(--text-main)]">42 === 42</code>). But two separate object literals never equal each other, because each creates a distinct heap allocation address!
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-amber-300">42</span> === <span className="text-amber-300">42</span>; <span className="text-emerald-400 italic">// true (Values match)</span>{'\n'}
                  &#123; a: <span className="text-amber-300">1</span> &#125; === &#123; a: <span className="text-amber-300">1</span> &#125;; <span className="text-rose-400 italic">// false! (0x4F12 !== 0x4F80)</span>{'\n\n'}
                  <span className="text-pink-400">const</span> ref1 = &#123; a: <span className="text-amber-300">1</span> &#125;;{'\n'}
                  <span className="text-pink-400">const</span> ref2 = ref1;{'\n'}
                  ref1 === ref2; <span className="text-emerald-400 italic">// true (Same pointer)</span>
                </code>
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PHASE 4: COMPARISON CHEAT SHEET TABLE
         ========================================================================= */}
      <section id="phase-4" className="space-y-5 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-brand-lime border border-emerald-500/20 text-xs font-semibold">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)] tracking-tight">
            Comparison Matrix: Primitives vs. Objects in V8 Memory
          </h2>
        </div>

        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          A definitive side-by-side engineering reference of how JavaScript manages memory allocations across all dimensions:
        </p>

        <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-main)] bg-zinc-100 dark:bg-zinc-900 text-[var(--text-main)] font-semibold">
                  <th className="p-3.5 sm:px-5">Dimension</th>
                  <th className="p-3.5 sm:px-5 text-emerald-800 dark:text-brand-lime font-bold">The 7 Primitives (Value Types)</th>
                  <th className="p-3.5 sm:px-5 text-blue-700 dark:text-blue-400 font-bold">Objects &amp; References (Heap Types)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)] text-zinc-700 dark:text-zinc-300 font-mono text-xs sm:text-sm">
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5 sm:px-5 font-bold text-[var(--text-main)] font-sans">Types Included</td>
                  <td className="p-3.5 sm:px-5">Number, String, Boolean, Undefined, Null, BigInt, Symbol</td>
                  <td className="p-3.5 sm:px-5">Object literals, Arrays, Functions, Maps, Sets, Dates</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5 sm:px-5 font-bold text-[var(--text-main)] font-sans">Memory Allocation</td>
                  <td className="p-3.5 sm:px-5 text-emerald-700 dark:text-brand-lime font-bold">Call Stack Frame (Fixed width)</td>
                  <td className="p-3.5 sm:px-5 text-blue-700 dark:text-blue-400 font-bold">Memory Heap (Dynamically allocated)</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5 sm:px-5 font-bold text-[var(--text-main)] font-sans">Variable Storage</td>
                  <td className="p-3.5 sm:px-5">Stores direct raw binary value (e.g. 42)</td>
                  <td className="p-3.5 sm:px-5">Stores 64-bit Memory Address pointer (e.g. 0x4F12)</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5 sm:px-5 font-bold text-[var(--text-main)] font-sans">Copying (b = a)</td>
                  <td className="p-3.5 sm:px-5 text-emerald-700 dark:text-brand-lime font-bold">Independent bitwise duplicate</td>
                  <td className="p-3.5 sm:px-5 text-amber-700 dark:text-amber-400 font-bold">Pointer copy; both access identical heap record</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5 sm:px-5 font-bold text-[var(--text-main)] font-sans">In-Place Mutation</td>
                  <td className="p-3.5 sm:px-5 text-rose-600 dark:text-rose-400 font-bold">Immutable (Read-only bytes in memory)</td>
                  <td className="p-3.5 sm:px-5 text-emerald-700 dark:text-emerald-400 font-bold">Mutable (Properties added/removed in-place)</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5 sm:px-5 font-bold text-[var(--text-main)] font-sans">Strict Equality (===)</td>
                  <td className="p-3.5 sm:px-5">Compares raw bit-level value</td>
                  <td className="p-3.5 sm:px-5">Compares 64-bit memory pointer address</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5 sm:px-5 font-bold text-[var(--text-main)] font-sans">V8 Engine Optimization</td>
                  <td className="p-3.5 sm:px-5">31-bit Smi (Small Integer) without heap boxing</td>
                  <td className="p-3.5 sm:px-5">Hidden Classes (Shapes) &amp; Inline Caching</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5 sm:px-5 font-bold text-[var(--text-main)] font-sans">Garbage Collection</td>
                  <td className="p-3.5 sm:px-5">Instantaneous $O(1)$ on stack frame return</td>
                  <td className="p-3.5 sm:px-5">Generational Mark-Sweep &amp; Scavenger Nursery</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 5: INSIDE COMPUTER RAM & V8 HARDWARE
         ========================================================================= */}
      <section id="phase-5" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-brand-lime border border-emerald-500/20 text-xs font-semibold">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)] tracking-tight">
            Inside RAM: What the V8 Engine Actually Does in Hardware
          </h2>
        </div>

        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          How do the CPU and computer memory store variables? Click the interactive tabs below to watch stack slots and heap allocations transform in real time:
        </p>

        {/* Interactive Memory State Box */}
        <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-6">
          
          {/* State Switcher Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[var(--border-main)] pb-4">
            {[
              { id: 'primitive_initial', label: '1. let a = 10 (Stack Allocation)' },
              { id: 'primitive_copy', label: '2. let b = a; b = 20 (Independent Copy)' },
              { id: 'object_initial', label: '3. let user1 = { name: "Alice" } (Heap Allocation)' },
              { id: 'object_shared', label: '4. let user2 = user1; user2.name = "Bob" (Shared Mutation)' },
              { id: 'object_cloned', label: '5. let user3 = { ...user1 } (Independent Clone)' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setMemoryState(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  memoryState === st.id
                    ? 'bg-emerald-700 dark:bg-brand-lime text-white dark:text-black font-bold shadow-xs'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 hover:text-[var(--text-main)]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Visual Memory Representation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* The Stack & Heap Visual */}
            <div className="p-5 rounded-xl border border-[var(--border-main)] bg-zinc-50 dark:bg-zinc-950/60 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 border-b border-[var(--border-main)] pb-2 font-sans text-xs">
                <span className="font-semibold">Call Stack Frame [0x7FFF0040]</span>
                <span className="text-emerald-700 dark:text-brand-lime font-mono font-bold">RAM Architecture</span>
              </div>

              {memoryState === 'primitive_initial' && (
                <div className="space-y-2">
                  <div className="p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 space-y-1">
                    <div className="flex justify-between font-bold text-emerald-800 dark:text-brand-lime font-sans">
                      <span>Stack Slot: a</span>
                      <span>Primitive (Smi)</span>
                    </div>
                    <div className="text-lg text-[var(--text-main)] font-bold">Value: 10</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Binary: 31-bit Smi (tagged with trailing 0)</div>
                  </div>
                  <div className="p-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-center font-sans text-xs">
                    Memory Heap: 0 allocations (Primitives live only on Stack)
                  </div>
                </div>
              )}

              {memoryState === 'primitive_copy' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 space-y-1">
                    <div className="flex justify-between font-bold text-emerald-800 dark:text-brand-lime font-sans">
                      <span>Stack Slot: a</span>
                      <span>Untouched</span>
                    </div>
                    <div className="text-lg text-[var(--text-main)] font-bold">Value: 10</div>
                  </div>
                  <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 space-y-1">
                    <div className="flex justify-between font-bold text-emerald-800 dark:text-brand-lime font-sans">
                      <span>Stack Slot: b</span>
                      <span>Independent Copy</span>
                    </div>
                    <div className="text-lg text-[var(--text-main)] font-bold">Value: 20</div>
                  </div>
                  <div className="p-2 text-xs text-emerald-800 dark:text-brand-lime font-sans font-medium">
                    Modifying b altered only b&apos;s stack word. Variable a remains 10.
                  </div>
                </div>
              )}

              {memoryState === 'object_initial' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 space-y-1">
                    <div className="flex justify-between font-bold text-blue-800 dark:text-blue-300 font-sans">
                      <span>Stack Slot: user1</span>
                      <span>Pointer Register</span>
                    </div>
                    <div className="text-base text-zinc-900 dark:text-zinc-100 font-bold font-mono">Pointer: 0x4F12</div>
                  </div>
                  <div className="p-3.5 rounded-lg border border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 space-y-1">
                    <div className="flex justify-between font-bold text-blue-800 dark:text-blue-300 font-sans">
                      <span>Heap Block [0x4F12]</span>
                      <span>Object Allocation</span>
                    </div>
                    <div className="text-sm text-blue-950 dark:text-blue-200 font-bold font-mono">&#123; name: &quot;Alice&quot; &#125;</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">Managed by V8 Scavenge Nursery GC</div>
                  </div>
                </div>
              )}

              {memoryState === 'object_shared' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg border border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 space-y-1">
                      <div className="font-bold text-blue-800 dark:text-blue-300 font-sans text-xs">Slot: user1</div>
                      <div className="text-sm text-zinc-900 dark:text-zinc-100 font-bold font-mono">0x4F12</div>
                    </div>
                    <div className="p-3 rounded-lg border border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 space-y-1">
                      <div className="font-bold text-blue-800 dark:text-blue-300 font-sans text-xs">Slot: user2</div>
                      <div className="text-sm text-zinc-900 dark:text-zinc-100 font-bold font-mono">0x4F12</div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg border border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 space-y-1">
                    <div className="flex justify-between font-bold text-amber-800 dark:text-amber-300 font-sans">
                      <span>Shared Heap Record [0x4F12]</span>
                      <span>Mutated In-Place</span>
                    </div>
                    <div className="text-sm text-amber-950 dark:text-amber-200 font-bold font-mono">&#123; name: &quot;Bob&quot; &#125;</div>
                    <div className="text-xs text-amber-800/90 dark:text-amber-300/80 font-sans">Both user1 and user2 point here!</div>
                  </div>
                </div>
              )}

              {memoryState === 'object_cloned' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg border border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 space-y-1">
                      <div className="font-bold text-blue-800 dark:text-blue-300 font-sans text-xs">Slot: user1</div>
                      <div className="text-sm text-zinc-900 dark:text-zinc-100 font-bold font-mono">0x4F12</div>
                    </div>
                    <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 space-y-1">
                      <div className="font-bold text-emerald-800 dark:text-brand-lime font-sans text-xs">Slot: user3</div>
                      <div className="text-sm text-zinc-900 dark:text-zinc-100 font-bold font-mono">0x4F80</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg border border-blue-500/30 bg-blue-50 dark:bg-blue-950/30 text-xs font-mono">
                      <span className="text-blue-800 dark:text-blue-400 block font-sans font-bold">Heap 0x4F12</span>
                      <span className="text-zinc-900 dark:text-slate-200">&#123; name: &quot;Bob&quot; &#125;</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-mono">
                      <span className="text-emerald-800 dark:text-brand-lime block font-sans font-bold">Heap 0x4F80 (Clone)</span>
                      <span className="text-zinc-900 dark:text-slate-200">&#123; name: &quot;Bob&quot; &#125;</span>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-800 dark:text-brand-lime font-sans font-medium">
                    Independent memory addresses. Modifying user3 never touches user1!
                  </div>
                </div>
              )}
            </div>

            {/* Explanation of Engine Mechanics */}
            <div className="flex flex-col justify-between space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)]">
                  <Cpu className="w-4 h-4 text-emerald-700 dark:text-brand-lime" />
                  <span>V8 Engine &amp; Hardware Internals</span>
                </div>
                
                {memoryState === 'primitive_initial' && (
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      Small Integers (-2^30 to 2^30 - 1) are stored as <strong className="text-[var(--text-main)]">V8 Smi</strong> values directly inside 64-bit CPU registers with a trailing tag bit. Zero heap allocation overhead, zero garbage collection impact.
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                      V8 Memory: 32-bit integer shifted by 1 bit + trailing tag bit 0
                    </div>
                  </div>
                )}

                {memoryState === 'primitive_copy' && (
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      When <code className="font-mono text-[var(--text-main)] font-semibold">let b = a</code> executes, the CPU executes a single register move instruction. Variable <code className="font-mono text-[var(--text-main)] font-semibold">b</code> receives its own independent 32-bit stack slot.
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                      x86_64: mov qword ptr [rbp - 16], rax ; Instantaneous stack copy
                    </div>
                  </div>
                )}

                {memoryState === 'object_initial' && (
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      Object literals trigger an allocation in V8&apos;s <strong className="text-[var(--text-main)]">Scavenge Nursery (New Space)</strong>. The stack slot only holds the 64-bit pointer address <code className="font-mono text-[var(--text-main)] font-semibold">0x4F12</code> referencing the internal hidden class (Map) and property storage.
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                      V8 Allocator: HeapObject allocation in New Space nursery
                    </div>
                  </div>
                )}

                {memoryState === 'object_shared' && (
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      Assigning <code className="font-mono text-[var(--text-main)] font-semibold">user2 = user1</code> only duplicated the 64-bit pointer. When <code className="font-mono text-[var(--text-main)] font-semibold">user2.name = &quot;Bob&quot;</code> runs, the engine dereferences pointer <code className="font-mono text-[var(--text-main)] font-semibold">0x4F12</code> and overwrites the property in heap memory.
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                      Memory Trace: [0x4F12 + offset] written in-place
                    </div>
                  </div>
                )}

                {memoryState === 'object_cloned' && (
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      Object spread (<code className="font-mono text-[var(--text-main)] font-semibold">&#123; ...user1 &#125;</code>) allocates a brand-new heap block at <code className="font-mono text-[var(--text-main)] font-semibold">0x4F80</code> and copies the keys. Both objects have distinct memory addresses, completely isolating subsequent mutations.
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                      Heap Allocation: 0x4F80 !== 0x4F12 (Independent GC lifecycles)
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 border border-[var(--border-main)]">
                Performance Verdict: <strong className="text-[var(--text-main)]">Primitives are zero-cost stack values.</strong> Objects introduce 64-bit pointer indirection and garbage collection tracking.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 6: REAL-WORLD INDUSTRY SCENARIOS
         ========================================================================= */}
      <section id="phase-6" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-brand-lime border border-emerald-500/20 text-xs font-semibold">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)] tracking-tight">
            Real-World Industry Scenarios: When Does Memory Architecture Matter?
          </h2>
        </div>

        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          In real-world software engineering, memory model mastery prevents critical performance and state synchronization bugs:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Scenario 1: React State Immutability */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-brand-lime font-mono">Scenario A • React / Redux</span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold">Shallow Equality</span>
            </div>

            <h3 className="text-base font-semibold text-[var(--text-main)]">
              Why in-place object mutation breaks React re-renders
            </h3>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              React compares previous and next state using shallow reference equality (<code className="font-mono text-[var(--text-main)] font-semibold">prevProps === nextProps</code>). If you mutate an object in-place, the memory pointer doesn&apos;t change, and React skips re-rendering!
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-slate-400">// ❌ Bug: React skips UI update</span>{'\n'}
                  user.name = <span className="text-emerald-300">&quot;Bob&quot;</span>;{'\n'}
                  <span className="text-sky-300">setUser</span>(user); <span className="text-rose-400 italic">// user === user (Skipped!)</span>{'\n\n'}
                  <span className="text-slate-400">// ✅ Solution: Provide a new heap reference</span>{'\n'}
                  <span className="text-sky-300">setUser</span>(&#123; ...user, name: <span className="text-emerald-300">&quot;Bob&quot;</span> &#125;);
                </code>
              </pre>
            </div>
          </div>

          {/* Scenario 2: Deep vs Shallow Cloning */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">Scenario B • Deep Structures</span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold">structuredClone()</span>
            </div>

            <h3 className="text-base font-semibold text-[var(--text-main)]">
              The nested object spread trap
            </h3>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              The spread operator only clones top-level keys. Nested objects like <code className="font-mono text-[var(--text-main)] font-semibold">config.database</code> still share heap pointers. Use native ES2022 <code className="font-mono text-[var(--text-main)] font-semibold">structuredClone()</code> for complete isolation:
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">const</span> cfg = &#123; db: &#123; port: <span className="text-amber-300">5432</span> &#125; &#125;;{'\n'}
                  <span className="text-pink-400">const</span> copy = &#123; ...cfg &#125;;{'\n'}
                  copy.db.port = <span className="text-amber-300">3306</span>; <span className="text-rose-400 italic">// Mutates cfg.db.port too!</span>{'\n\n'}
                  <span className="text-pink-400">const</span> safe = <span className="text-sky-300">structuredClone</span>(cfg); <span className="text-emerald-400 italic">// Deep isolation</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Scenario 3: Floating Point Comparison */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">Scenario C • IEEE-754 Math</span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold">Number.EPSILON</span>
            </div>

            <h3 className="text-base font-semibold text-[var(--text-main)]">
              Floating-point rounding discrepancies (0.1 + 0.2)
            </h3>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              In IEEE-754 double precision binary floats, base-10 fractions like 0.1 cannot be represented precisely. Comparing sums with strict equality fails. Use <code className="font-mono text-[var(--text-main)] font-semibold">Number.EPSILON</code> or integer cents:
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-amber-300">0.1</span> + <span className="text-amber-300">0.2</span> === <span className="text-amber-300">0.3</span>; <span className="text-rose-400 italic">// false! (0.30000000000000004)</span>{'\n\n'}
                  <span className="text-slate-400">// ✅ Solution: Epsilon tolerance comparison</span>{'\n'}
                  <span className="text-sky-300">Math</span>.<span className="text-sky-300">abs</span>((<span className="text-amber-300">0.1</span> + <span className="text-amber-300">0.2</span>) - <span className="text-amber-300">0.3</span>) &lt; <span className="text-sky-300">Number</span>.<span className="text-amber-300">EPSILON</span>; <span className="text-emerald-400 italic">// true</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Scenario 4: Type Inspection Quirk */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400 font-mono">Scenario D • Type Detection</span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold">Array.isArray()</span>
            </div>

            <h3 className="text-base font-semibold text-[var(--text-main)]">
              Why typeof null === &apos;object&apos; (The 1995 Bug)
            </h3>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              In 1995, JS stored type tags in pointer bits: `000` meant object. The null pointer was 0x00, so `typeof null` returns `&quot;object&quot;`. Never use `typeof` alone to validate objects:
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">typeof</span> <span className="text-pink-400">null</span>; <span className="text-rose-400 italic">// &quot;object&quot; (Legacy 1995 bug!)</span>{'\n'}
                  <span className="text-pink-400">typeof</span> []; <span className="text-amber-300 italic">// &quot;object&quot; (Arrays are objects)</span>{'\n\n'}
                  <span className="text-slate-400">// ✅ Safe Enterprise Type Checks:</span>{'\n'}
                  val === <span className="text-pink-400">null</span>; <span className="text-emerald-400 italic">// true</span>{'\n'}
                  <span className="text-sky-300">Array</span>.<span className="text-sky-300">isArray</span>(val); <span className="text-emerald-400 italic">// true</span>
                </code>
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PHASE 7: PRACTICE DRILL
         ========================================================================= */}
      <section id="phase-7" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-brand-lime border border-emerald-500/20 text-xs font-semibold">
            07
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)] tracking-tight">
            Practice Drill: Will It Mutate? (5 Diagnostic Challenges)
          </h2>
        </div>

        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Test what you learned on these 5 interactive scenarios. Click an option to inspect whether the engine mutates memory:
        </p>

        {/* 5 Interactive Quiz Questions */}
        <div className="space-y-4">
          
          {/* Question 1 */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
              Question 1 of 5 • Primitive Value Independence
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-pink-400">let</span> a = <span className="text-amber-300">50</span>;{'\n'}
                <span className="text-pink-400">let</span> b = a;{'\n'}
                b += <span className="text-amber-300">10</span>;{'\n'}
                <span className="text-sky-300">console.log</span>(a);
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) 50', correct: true },
                { label: 'B) 60', correct: false },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[1] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(1, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                          : 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold'
                        : 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[1] !== undefined && (
              <div className={`p-3 rounded-lg text-xs sm:text-sm leading-relaxed border font-medium ${
                quizAnswers[1] === 0 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-500/30' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-500/30'
              }`}>
                {quizAnswers[1] === 0 ? (
                  <span>Correct! Numbers are primitive values stored directly in stack frames and copied by value. Modifying `b` does not alter `a`.</span>
                ) : (
                  <span>Incorrect. Numbers are primitives, so `b` received an independent stack copy of 50.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
              Question 2 of 5 • Shared Reference Pointer
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-pink-400">const</span> u1 = &#123; name: <span className="text-emerald-300">&quot;Alice&quot;</span> &#125;;{'\n'}
                <span className="text-pink-400">const</span> u2 = u1;{'\n'}
                u2.name = <span className="text-emerald-300">&quot;Bob&quot;</span>;{'\n'}
                <span className="text-sky-300">console.log</span>(u1.name);
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) "Alice"', correct: false },
                { label: 'B) "Bob"', correct: true },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[2] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(2, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                          : 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold'
                        : 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[2] !== undefined && (
              <div className={`p-3 rounded-lg text-xs sm:text-sm leading-relaxed border font-medium ${
                quizAnswers[2] === 1 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-500/30' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-500/30'
              }`}>
                {quizAnswers[2] === 1 ? (
                  <span>Correct! Objects are stored by reference. Both `u1` and `u2` share pointer 0x4F12. Mutating through `u2` mutates the single shared heap record.</span>
                ) : (
                  <span>Incorrect. Assigning objects copies the memory pointer, not the heap contents! Both variables point to the same object.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 3 */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
              Question 3 of 5 • Function Parameter Mutation
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-pink-400">function</span> <span className="text-sky-300">mutate</span>(val, obj) &#123;{'\n'}
                {'  '}val = <span className="text-amber-300">100</span>;{'\n'}
                {'  '}obj.val = <span className="text-amber-300">100</span>;{'\n'}
                &#125;{'\n'}
                <span className="text-pink-400">let</span> n = <span className="text-amber-300">10</span>; <span className="text-pink-400">let</span> o = &#123; val: <span className="text-amber-300">10</span> &#125;;{'\n'}
                <span className="text-sky-300">mutate</span>(n, o);{'\n'}
                <span className="text-sky-300">console.log</span>(n, o.val);
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) 10 100', correct: true },
                { label: 'B) 100 100', correct: false },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[3] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(3, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                          : 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold'
                        : 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[3] !== undefined && (
              <div className={`p-3 rounded-lg text-xs sm:text-sm leading-relaxed border font-medium ${
                quizAnswers[3] === 0 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-500/30' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-500/30'
              }`}>
                {quizAnswers[3] === 0 ? (
                  <span>Correct! `n` is passed by value (reassigning `val` does nothing to `n`). But `o` passes its heap pointer address, so `obj.val = 100` mutates the caller&apos;s object.</span>
                ) : (
                  <span>Incorrect. Primitive values are copied by value into function arguments. The function cannot mutate `n`.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 4 */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
              Question 4 of 5 • Strict Equality Comparison
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-sky-300">console.log</span>(&#123; id: <span className="text-amber-300">1</span> &#125; === &#123; id: <span className="text-amber-300">1</span> &#125;);
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) true (They have the same properties)', correct: false },
                { label: 'B) false (They are different heap allocations)', correct: true },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[4] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(4, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                          : 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold'
                        : 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[4] !== undefined && (
              <div className={`p-3 rounded-lg text-xs sm:text-sm leading-relaxed border font-medium ${
                quizAnswers[4] === 1 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-500/30' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-500/30'
              }`}>
                {quizAnswers[4] === 1 ? (
                  <span>Correct! `===` on objects compares memory addresses, not properties. Each object literal allocates a separate heap block (0x4F12 !== 0x4F90).</span>
                ) : (
                  <span>Incorrect. JavaScript does not compare object contents by default. It checks if both variables hold the exact same pointer address.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 5 */}
          <div className="p-5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
              Question 5 of 5 • Shallow Spread with Nested Objects
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-pink-400">const</span> a = &#123; user: &#123; name: <span className="text-emerald-300">&quot;Sam&quot;</span> &#125; &#125;;{'\n'}
                <span className="text-pink-400">const</span> b = &#123; ...a &#125;;{'\n'}
                b.user.name = <span className="text-emerald-300">&quot;Alex&quot;</span>;{'\n'}
                <span className="text-sky-300">console.log</span>(a.user.name);
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) "Sam" (Protected by spread operator)', correct: false },
                { label: 'B) "Alex" (Nested objects still share pointers)', correct: true },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[5] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(5, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                          : 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold'
                        : 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[5] !== undefined && (
              <div className={`p-3 rounded-lg text-xs sm:text-sm leading-relaxed border font-medium ${
                quizAnswers[5] === 1 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-500/30' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-500/30'
              }`}>
                {quizAnswers[5] === 1 ? (
                  <span>Correct! Spread &#123; ...a &#125; only clones top-level keys. The nested `user` object is still a shared pointer. To clone deeply, use `structuredClone(a)`.</span>
                ) : (
                  <span>Incorrect. Spread &#123; ...a &#125; is a shallow clone! Nested references are copied by pointer address.</span>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          PHASE 8: KEY ARCHITECTURAL TAKEAWAYS
         ========================================================================= */}
      <section id="phase-8" className="space-y-4 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-brand-lime border border-emerald-500/20 text-xs font-semibold">
            08
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)] tracking-tight">
            Key Architectural Takeaways
          </h2>
        </div>

        <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-brand-lime flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4" />
            <span>Core Systems Takeaways</span>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-brand-lime shrink-0 mt-0.5" />
              <span><strong className="text-[var(--text-main)] font-semibold">Primitives are stack-allocated values:</strong> Numbers, strings, booleans, and symbols reside directly in contiguous stack frames with $O(1)$ deallocation upon function return.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-brand-lime shrink-0 mt-0.5" />
              <span><strong className="text-[var(--text-main)] font-semibold">Objects are heap-allocated pointers:</strong> Variables hold 64-bit reference addresses pointing to dynamic heap records. Copying an object duplicates only the pointer.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-brand-lime shrink-0 mt-0.5" />
              <span><strong className="text-[var(--text-main)] font-semibold">Defensive immutability:</strong> Always clone objects using &#123; ...obj &#125; for shallow structures or `structuredClone(obj)` for nested data to prevent accidental state corruption.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-brand-lime shrink-0 mt-0.5" />
              <span><strong className="text-[var(--text-main)] font-semibold">Engine optimizations:</strong> V8 optimizes small integers as 31-bit Smi values and interns strings in a global symbol table to bypass heap allocation overhead whenever possible.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* =========================================================================
          PHASE 9: LIVE INTERACTIVE CODE SANDBOX & VISUALIZER
         ========================================================================= */}
      <section id="phase-9" className="space-y-4 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-brand-lime border border-emerald-500/20 text-xs font-semibold">
            09
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-main)] tracking-tight">
            Live Interactive Memory Studio
          </h2>
        </div>

        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Write custom JavaScript in the editor below. The live engine parses variable declarations, allocates stack slots, and maps heap references in real-time:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <div className="flex flex-col border border-[var(--border-main)] rounded-xl overflow-hidden shadow-xs h-[480px]" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="px-3.5 py-2 border-b flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 border-[var(--border-main)]">
              <span className="text-xs font-mono font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Code2 size={13} className="text-emerald-700 dark:text-brand-lime" />
                Live JavaScript Editor
              </span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Type code &amp; click Run</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor initialCode={liveCode} onRun={handleRunCode} />
            </div>
          </div>

          <div className="flex flex-col border border-[var(--border-main)] rounded-xl overflow-hidden shadow-xs h-[480px]" style={{ backgroundColor: 'var(--bg-main)' }}>
            <div className="px-3.5 py-2 border-b flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 border-[var(--border-main)]">
              <span className="text-xs font-mono font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Database size={13} className="text-blue-600 dark:text-blue-400" />
                Real-Time Memory Inspector (Stack &amp; Heap)
              </span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Live V8 Simulation</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <VisualizerCanvas topicId="data-types" code={liveCode} isRunning={isRunning} onCodeChange={handleRunCode} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default DataTypesLesson;
