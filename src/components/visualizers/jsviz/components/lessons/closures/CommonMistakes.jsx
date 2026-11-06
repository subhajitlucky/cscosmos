'use client';

import React, { useState, useEffect } from 'react';
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
import { useTheme } from '@/context/useTheme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    reality: 'Reality: The execution context is popped from the Call Stack immediately upon return; reachability preserves the environment.',
    explanation: 'Beginners frequently confuse Call Stack frames with Lexical Environments. Execution contexts exist strictly on the Call Stack for evaluating code and are popped immediately upon return. The Lexical Environment is a specification-level mechanism that persists as long as an active reference chain keeps it reachable from a GC Root. In engines like V8, escaped variables are stored in managed Context allocations.',
    badCode: `function parent() {
  const secret = 42;
  return () => secret;
}

const child = parent();
// At this exact line:
// Call Stack contains ONLY the Global Execution Context!
// parent() execution context was popped upon return.
child(); // 42 is resolved via the surviving reachable Lexical Environment.`,
    takeaway: 'Execution contexts on the Call Stack are ephemeral and LIFO. Closures survive because Lexical Environments remain reachable through reference chains.'
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
    myth: 'Myth: Modern engines always eliminate all unused variables from closure memory automatically.',
    reality: 'Reality: Dead-variable elimination is an implementation-dependent engine optimization, not an ECMAScript specification guarantee.',
    explanation: 'Engines like V8 and JavaScriptCore analyze scopes to allocate only referenced variables into closure Context objects when possible. However, this is an engine-level heuristic. If another sibling closure in the same scope references a variable, or if eval() or debugger is present, engines may retain the entire lexical environment in memory. Never rely on JIT dead-variable elimination for critical memory or security guarantees; explicitly clean up or nullify large references when finished.',
    badCode: `function example() {
  const massiveData = new Array(1_000_000); // 1M elements
  const targetId = 42;

  // Sibling closure: If any closure in this scope touches massiveData,
  // or if scope analysis cannot prove complete isolation,
  // the entire shared context may remain in memory!
  function debugLogger() {
    console.log(massiveData.length);
  }

  return function() {
    return targetId;
  };
}`,
    takeaway: 'Variable pruning is an engine optimization, not a language guarantee. If guaranteed memory reclamation is required, set large variables to null or isolate them in distinct helper scopes.'
  },
  {
    id: 'loop-var-trap',
    myth: 'Myth: A "for (var i = 0...)" loop creates a separate closure for each iteration.',
    reality: 'Reality: "var" shares a single mutable binding across all iterations, whereas "let" creates a per-iteration lexical binding.',
    explanation: 'With "var", the declaration is hoisted to the enclosing function or global scope, so every iteration mutates the exact same variable. Closures created inside the loop capture this single shared binding. In contrast, ECMAScript specifies that a "let" declaration in a for-loop header creates a fresh Lexical Environment and identifier binding for every iteration step, initialized with the prior step\'s value.',
    badCode: `// With 'var' (Single shared binding across loop):
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); 
}
// Outputs: 3, 3, 3 (all callbacks read the single terminal 'i')

// With 'let' (Per-iteration lexical binding):
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Outputs: 0, 1, 2 (each callback holds a closure over its iteration's binding)`,
    takeaway: 'Understand the semantic difference: "var" shares a single mutable binding for the entire loop, while "let" in for-loop headers specifies a distinct per-iteration lexical binding. Choose based on whether your callbacks need a shared state or individual iteration values.'
  }
];

export default function CommonMistakes() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted 
    ? (resolvedTheme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')))
    : resolvedTheme === 'dark';

  const syntaxTheme = isDark ? vscDarkPlus : vs;

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
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] overflow-hidden shadow-xs">
          <div className="p-2.5 px-4 bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">JavaScript Behavioral Test</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">ECMA-262 Semantics</span>
          </div>
          <div className={`p-4 overflow-x-auto text-xs sm:text-sm ${
            isDark 
              ? 'bg-[#090d16] selection:bg-[#264f78] selection:text-white' 
              : 'bg-zinc-50/70 selection:bg-blue-100 selection:text-blue-900'
          }`}>
            <SyntaxHighlighter
              language="javascript"
              style={syntaxTheme}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                border: 'none',
                fontSize: '12px',
                lineHeight: '1.65'
              }}
              codeTagProps={{
                style: {
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {current.badCode}
            </SyntaxHighlighter>
          </div>
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
