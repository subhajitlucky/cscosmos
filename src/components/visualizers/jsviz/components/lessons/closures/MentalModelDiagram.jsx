'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Layers, 
  GitFork, 
  Database, 
  Box, 
  RotateCw, 
  Sparkles, 
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useTheme } from '@/context/useTheme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SPEC_PILLARS = [
  {
    id: 'lexical-scope',
    number: '01',
    title: 'Lexical Scope',
    short: 'Author-Time Scope',
    icon: GitFork,
    badge: 'Spatial Placement',
    summary: 'Where a function is written in your source code determines what variables it has access to—not where or when it is invoked.',
    detail: 'JavaScript uses lexical (static) scoping. The engine resolves variable names by inspecting nested function declarations at compile/parse time. The physical position of the function inside the source text permanently anchors its scope resolution path.',
    code: `const globalCity = "Tokyo";

function country() {
  const localCity = "Kyoto";
  
  function district() {
    // Looks up: district -> country -> global
    return \`\${localCity} in Japan (\${globalCity})\`;
  }
  return district;
}`
  },
  {
    id: 'env-records',
    number: '02',
    title: 'Environment Records',
    short: 'Specification Record',
    icon: Database,
    badge: 'Spec: Environment Record',
    summary: 'A formal specification mechanism in ECMA-262 that records identifier-to-binding associations for a specific lexical scope.',
    detail: 'According to the ECMAScript specification (ECMA-262), every Lexical Environment consists of an Environment Record plus a reference to the outer environment. Environment Records define operations like HasBinding, GetBindingValue, and SetMutableBinding. How engines optimize these bindings (stack, registers, or context objects) is an engine implementation choice.',
    code: `// Conceptual specification structure:
LexicalEnvironment {
  EnvironmentRecord: {
    userName: "Alice",
    loginCount: 42
  },
  OuterEnv: GlobalEnvironment
}`
  },
  {
    id: 'outer-reference',
    number: '03',
    title: 'Outer Reference',
    short: 'Scope Link Chain',
    icon: Layers,
    badge: 'Spec: [[OuterEnv]]',
    summary: 'Every environment record maintains an explicit pointer to its parent enclosing lexical environment.',
    detail: 'When the engine encounters an identifier (like "count"), it first checks the innermost Environment Record. If not found, it follows the [[OuterEnv]] link upward, step-by-step, until reaching the Global Environment. If still unresolved, it throws a ReferenceError.',
    code: `Inner Scope [[OuterEnv]]
      ↓
Outer Scope [[OuterEnv]]
      ↓
Global Scope [[OuterEnv]] -> null`
  },
  {
    id: 'function-creation',
    number: '04',
    title: 'Function Creation',
    short: 'The [[Environment]] Slot',
    icon: Box,
    badge: 'Spec: [[Environment]] Slot',
    summary: 'Every function object is instantiated with an internal [[Environment]] slot referencing the Lexical Environment where it was evaluated.',
    detail: 'The double brackets [[...]] denote an internal specification slot, NOT an accessible JavaScript property. You cannot access fn.[[Environment]] in source code. This internal link ensures the function retains access to its enclosing lexical scope.',
    code: `function outer() {
  let secret = 99;
  
  // Spec internal slot: inner.[[Environment]] = outerLexicalEnv
  function inner() { return secret; }
  
  return inner;
}`
  },
  {
    id: 'returning-functions',
    number: '05',
    title: 'First-Class Functions',
    short: 'Passing Environments',
    icon: ArrowRight,
    badge: 'First-Class Citizen',
    summary: 'Because JavaScript functions are first-class objects, returning an inner function allows its lexical scope access to escape its parent execution context.',
    detail: 'A function object carries its internal [[Environment]] slot wherever it is passed. Returning a function from an outer scope creates a live pathway to the outer environment even after the outer execution context has popped from the call stack.',
    code: `function factory() {
  let counter = 0;
  return () => ++counter;
}

// factory() finished and popped from stack,
// yet returned function retains its [[Environment]] link!
const getNext = factory();`
  },
  {
    id: 'persistent-access',
    number: '06',
    title: 'Persistent Access',
    short: 'Live Binding Access',
    icon: RotateCw,
    badge: 'Live Bindings',
    summary: 'Closures retain access to live identifier bindings that persist as long as reachable from garbage collection roots.',
    detail: 'Closures do NOT capture static snapshots or freeze copies. If the enclosed variable changes in the future, all functions referencing that environment immediately read and write the exact same updated value.',
    code: `function createStore() {
  let value = 100;
  return {
    get: () => value,
    set: (v) => { value = v; }
  };
}
const store = createStore();
store.set(500);
console.log(store.get()); // 500 (Live binding!)`
  }
];

export default function MentalModelDiagram() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted 
    ? (resolvedTheme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')))
    : resolvedTheme === 'dark';

  const syntaxTheme = isDark ? vscDarkPlus : vs;

  const [activePillar, setActivePillar] = useState(SPEC_PILLARS[0]);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20">
              <Brain size={20} />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
                Architectural Metaphor
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Think of a Closure as a Function with Memory
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            ECMA-262 Specification Model
          </span>
        </div>
      </div>

      {/* Visual Metaphor Diagram */}
      <div className="p-5 sm:p-6 bg-gradient-to-b from-zinc-50/40 via-transparent to-transparent dark:from-zinc-950/40 border-b border-zinc-200 dark:border-zinc-800/60">
        <div className="max-w-4xl mx-auto">
          {/* Conceptual Tree Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            
            {/* Box 1: Outer Scope */}
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                    Step 1 · Creation Scope
                  </span>
                  <span className="text-xs font-mono text-zinc-400">Outer</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  outer() Function
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                  Declares and stores variables in its local Environment Record.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-mono text-xs border border-blue-500/20 dark:border-zinc-800 shadow-xs">
                <span className="text-zinc-500">// Environment Record:</span><br />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">let name</span> = <span className="text-amber-600 dark:text-amber-300">&quot;JavaScript&quot;</span>;
              </div>
            </div>

            {/* Box 2: The Binding / Bridge */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 flex flex-col justify-between relative">
              <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-emerald-500">
                <ArrowRight size={18} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-brand-lime border border-emerald-500/30">
                    Step 2 · [[Environment]] Link
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-brand-lime">The Closure</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  The Backpack Connection
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                  The inner function is created with an internal slot pointing directly to outer&apos;s environment.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-mono text-xs border border-emerald-500/20 dark:border-zinc-800 shadow-xs">
                <span className="text-zinc-500">// Spec Internal Slot (Not a JS property):</span><br />
                <span className="text-purple-600 dark:text-purple-400 font-bold">inner.[[Environment]]</span><br />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">↳ points to outerEnv</span>
              </div>
            </div>

            {/* Box 3: Execution Anywhere */}
            <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10 flex flex-col justify-between relative">
              <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-purple-500">
                <ArrowRight size={18} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
                    Step 3 · Execution Later
                  </span>
                  <span className="text-xs font-mono text-zinc-400">Any Scope</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  myFunc() Invocation
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                  Even after outer() completes and pops from the call stack, the backpack stays reachable!
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-mono text-xs border border-purple-500/20 dark:border-zinc-800 shadow-xs">
                <span className="text-zinc-500">// Resolves via pointer:</span><br />
                <span className="text-blue-600 dark:text-blue-400">console</span>.<span className="text-amber-600 dark:text-yellow-300">log</span>(name);<br />
                <span className="text-zinc-500">// Outputs: &quot;JavaScript&quot;</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 6 Specification Pillars Navigator */}
      <div className="p-5 sm:p-6">
        <div className="mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
            ECMA-262 Specification Architecture
          </span>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            The 6 Pillars of JavaScript Lexical Scoping
          </h4>
        </div>

        {/* Pillar Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
          {SPEC_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activePillar.id === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-sm text-emerald-950 dark:text-brand-lime'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold opacity-60">
                    {pillar.number}
                  </span>
                  <Icon size={14} className={isSelected ? 'text-emerald-700 dark:text-brand-lime' : 'opacity-40'} />
                </div>
                <div className="text-xs font-bold leading-tight line-clamp-1">
                  {pillar.short}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Detailed Breakdown */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/40 p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left description */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20">
                  {activePillar.badge}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Pillar {activePillar.number} of 06
                </span>
              </div>

              <h5 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {activePillar.title}
              </h5>

              <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/15 leading-relaxed">
                {activePillar.summary}
              </p>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {activePillar.detail}
              </p>
            </div>

            {/* Right code demonstration */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] overflow-hidden shadow-xs">
                <div className="flex items-center justify-between p-2.5 px-3 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900 text-[10px] text-zinc-600 dark:text-zinc-400">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Engine Spec Representation</span>
                  <span className="text-emerald-600 dark:text-brand-lime font-bold">JavaScript</span>
                </div>
                <div className={`p-3 overflow-x-auto text-xs ${
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
                      fontSize: '11.5px',
                      lineHeight: '1.6'
                    }}
                    codeTagProps={{
                      style: {
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {activePillar.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
