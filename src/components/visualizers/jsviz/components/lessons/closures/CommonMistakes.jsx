'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';

const MISTAKES = [
  {
    id: 'live-bindings',
    myth: 'Myth: Closures freeze or copy variable values at the moment the inner function is defined.',
    reality: 'Reality: Closures hold live, mutable references to the actual Environment Record bindings.',
    explanation: 'When a closure accesses a variable, it is reading directly from the surviving Environment Record on the heap. If the variable is updated at any point in time, the closure sees the newest updated value.',
    badCode: `// Misconception expectation: "value remains 10"
function makeGreeter() {
  let message = "Hello";
  function greet() {
    console.log(message);
  }
  message = "Goodbye"; // Mutation after declaration!
  return greet;
}

const say = makeGreeter();
say(); // Prints "Goodbye", NOT "Hello"!`,
    takeaway: 'Never assume a closure captures a static value snapshot. It binds to the identifier itself.'
  },
  {
    id: 'callstack-myth',
    myth: 'Myth: The outer function\'s call-stack frame must remain paused on the stack for the closure to work.',
    reality: 'Reality: The call stack frame is destroyed and popped immediately when the outer function returns.',
    explanation: 'Beginners frequently confuse the Call Stack with the Memory Heap. The stack frame exists strictly for execution and is discarded upon return. The Lexical Environment Record is stored separately on the heap, kept alive solely by garbage collector reachability.',
    badCode: `function parent() {
  const secret = 42;
  return () => secret;
}

const child = parent();
// At this exact line:
// Call Stack contains ONLY Global Execution Context!
// parent() is long gone from the stack.
child(); // 42 is retrieved directly from Heap memory.`,
    takeaway: 'Stack frames are ephemeral and LIFO. Closures survive because Lexical Environments live on the Heap.'
  },
  {
    id: 'memory-leak-myth',
    myth: 'Myth: Using closures causes memory leaks and should be avoided in high-performance code.',
    reality: 'Reality: Closures only leak memory if you hold references you no longer intend to use.',
    explanation: 'Retaining variables in memory is the explicit intended feature of closures, not a leak. A memory leak only occurs if a closure is unintentionally held in a global variable, forgotten setInterval, or unremoved DOM event listener long after it is needed.',
    badCode: `// True memory leak risk:
const cache = [];

function attachData() {
  const hugeArray = new Uint8Array(10_000_000); // 10MB
  // If pushed to an array that never empties:
  cache.push(() => hugeArray[0]);
}

// Fix: Nullify or remove callbacks when finished:
// cache.length = 0;`,
    takeaway: 'Clean up long-lived event listeners and nullify references to allow the Garbage Collector to reclaim heap records.'
  },
  {
    id: 'engine-optimizations',
    myth: 'Myth: The engine keeps every single variable in the outer function alive indefinitely.',
    reality: 'Reality: Modern JIT engines (V8, JavaScriptCore) perform dead-variable elimination.',
    explanation: 'If an outer function declares 100 variables, but the returned closure only mentions 1 of them, modern engines analyze the AST and garbage-collect the remaining 99 unreferenced variables to preserve memory.',
    badCode: `function example() {
  const massiveData = new Array(1000000); // ❌ NOT retained!
  const targetId = 42;                     // ✅ Retained!

  return function() {
    return targetId; // Engine detects massiveData is never used!
  };
}`,
    takeaway: 'Modern engines optimize closure environments so only referenced bindings stay in heap storage.'
  },
  {
    id: 'loop-var-trap',
    myth: 'Myth: A "for (var i = 0...)" loop creates a separate closure for each iteration.',
    reality: 'Reality: "var" is function-scoped; all iteration callbacks share the exact same single "i" binding.',
    explanation: 'Before ES2015, all loop iterations shared a single variable slot. When the asynchronous callbacks finally ran on the Event Loop, the loop had already terminated and "i" had incremented to its terminal value.',
    badCode: `// ❌ Broken with 'var':
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); 
}
// Outputs: 3, 3, 3

// ✅ Fixed with 'let' (Block-scoped per-iteration binding):
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Outputs: 0, 1, 2`,
    takeaway: 'Always use "let" in loops. ES6 specifies that let in a for-loop header creates a fresh Lexical Environment for each iteration.'
  }
];

export default function CommonMistakes() {
  const [activeTab, setActiveTab] = useState(0);
  const current = MISTAKES[activeTab];

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden shadow-sm">
      
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Critical Pitfalls & Engine Nuances
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Common Closure Misconceptions vs Reality
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            5 Traps Demystified
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center gap-2 overflow-x-auto">
        {MISTAKES.map((item, idx) => {
          const isSelected = activeTab === idx;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`pb-3 px-3 text-xs font-mono font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'border-amber-500 text-amber-700 dark:text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span>0{idx + 1}.</span>
              <span className="capitalize">{item.id.replace('-', ' ')}</span>
            </button>
          );
        })}
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 space-y-5">
        
        {/* Myth vs Reality Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Myth */}
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-950/20">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-mono text-xs font-bold uppercase mb-2">
              <XCircle size={15} />
              The Misconception
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
              {current.myth}
            </p>
          </div>

          {/* Reality */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-brand-lime font-mono text-xs font-bold uppercase mb-2">
              <CheckCircle2 size={15} />
              The Engine Truth
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
              {current.reality}
            </p>
          </div>

        </div>

        {/* Detailed Explanation */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
            {current.explanation}
          </p>
        </div>

        {/* Code Snippet */}
        <div className="rounded-xl border border-zinc-800 bg-[#0c1017] p-4 font-mono text-xs overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[10px] text-zinc-500">
            <span>JavaScript Behavioral Test</span>
            <span className="text-amber-400">ECMA-262 Semantics</span>
          </div>
          <pre className="text-zinc-300 leading-relaxed font-mono whitespace-pre text-[11.5px]">
            {current.badCode}
          </pre>
        </div>

        {/* Golden Takeaway */}
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-mono flex items-center gap-2">
          <Sparkles size={14} className="shrink-0 text-amber-500" />
          <span><strong>Architectural Rule:</strong> {current.takeaway}</span>
        </div>

      </div>

    </div>
  );
}
