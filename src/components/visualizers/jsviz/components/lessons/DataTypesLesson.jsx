'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Layers, 
  AlertTriangle,
  Code2,
  Database,
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Info
} from 'lucide-react';
import CodeEditor from '../CodeEditor';
import VisualizerCanvas from '../VisualizerCanvas';

export function DataTypesLesson({ topic, content }) {
  const [copiedId, setCopiedId] = useState(null);

  // Quick Quiz Answers state
  const [quizAnswers, setQuizAnswers] = useState({});

  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const presets = [
    {
      id: 'primitives',
      title: '1. Primitives',
      badge: 'By Value',
      description: 'Primitives create independent copies on the stack: changing scoreB never affects scoreA.',
      code: `// 1. Primitives: Copied by Value into Stack Slots
let scoreA = 100;
let scoreB = scoreA; // Independent stack copy

scoreB = 250; // Only scoreB is modified

console.log("scoreA:", scoreA); // 100 (Untouched!)
console.log("scoreB:", scoreB); // 250`
    },
    {
      id: 'objects',
      title: '2. Objects',
      badge: 'By Reference',
      description: 'Objects share memory pointers: modifying userB.name mutates userA as well!',
      code: `// 2. Objects: Copied by Reference (Shared Pointer)
let userA = { name: "Alice", role: "admin" };
let userB = userA; // userB points to the SAME object!

userB.name = "Bob"; // Mutates shared heap object!

console.log("userA:", userA.name); // "Bob" (Mutated!)
console.log("userB:", userB.name); // "Bob"`
    },
    {
      id: 'cloning',
      title: '3. Safe Cloning',
      badge: '{ ...spread }',
      description: 'Object spread creates a brand-new object in the heap, protecting userA from mutations.',
      code: `// 3. Defensive Cloning with Object Spread {...}
let userA = { name: "Alice", role: "admin" };
let userB = { ...userA }; // Brand-new independent heap allocation!

userB.name = "Bob"; // Modifies userB only!

console.log("userA:", userA.name); // "Alice" (Protected!)
console.log("userB:", userB.name); // "Bob"`
    }
  ];

  // Interactive Live Studio State
  const [liveCode, setLiveCode] = useState(presets[0].code);
  const [isRunning, setIsRunning] = useState(false);

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

  const handleRunCode = (newCode) => {
    setLiveCode(newCode);
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 200);
  };

  return (
    <div className="space-y-10 w-full">

      {/* =========================================================================
          1. LESSON HEADER
         ========================================================================= */}
      <header className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-brand-lime font-bold border border-emerald-500/20">
            Module 01: Types &amp; Values
          </span>
          <span>&bull;</span>
          <span>Concept 01 of 100</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-main)]">
          Data Types &amp; Values
        </h1>

        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Everything in JavaScript is either a <strong className="text-[var(--text-main)] font-semibold">Primitive</strong> (a simple value like a number or word) or an <strong className="text-[var(--text-main)] font-semibold">Object</strong> (a collection of data). Understanding how they are copied is the foundation of all JavaScript code.
        </p>
      </header>

      {/* =========================================================================
          2. THE CORE IDEA: THE TWO DATA FAMILIES
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Core Idea: The Two Data Families
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          JavaScript organizes all values into two distinct categories:
        </p>

        {/* 2-Column Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Family 1: Primitives */}
          <div className="p-5 sm:p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime">
                Family 1 &bull; Copied by Value
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-900 dark:text-brand-lime">
                7 Types
              </span>
            </div>

            <h3 className="text-lg font-bold text-[var(--text-main)]">
              The 7 Primitives
            </h3>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Primitives are single, simple pieces of data. When you copy a primitive, JavaScript makes a completely independent duplicate.
            </p>

            <div className="pt-2 border-t border-emerald-500/20 space-y-1.5 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200">
              <div>&bull; <strong className="text-[var(--text-main)]">string</strong> &rarr; <span className="text-emerald-700 dark:text-emerald-400">&quot;hello&quot;</span></div>
              <div>&bull; <strong className="text-[var(--text-main)]">number</strong> &rarr; <span className="text-amber-700 dark:text-amber-400">42, 3.14</span></div>
              <div>&bull; <strong className="text-[var(--text-main)]">boolean</strong> &rarr; <span className="text-blue-700 dark:text-blue-400">true, false</span></div>
              <div>&bull; <strong className="text-[var(--text-main)]">undefined</strong> &rarr; <span className="text-zinc-500">undefined</span></div>
              <div>&bull; <strong className="text-[var(--text-main)]">null</strong> &rarr; <span className="text-zinc-500">null</span></div>
              <div>&bull; <strong className="text-[var(--text-main)]">bigint</strong> &rarr; <span className="text-purple-700 dark:text-purple-400">9007199254740991n</span></div>
              <div>&bull; <strong className="text-[var(--text-main)]">symbol</strong> &rarr; <span className="text-pink-700 dark:text-pink-400">Symbol(&quot;id&quot;)</span></div>
            </div>
          </div>

          {/* Family 2: Reference Types */}
          <div className="p-5 sm:p-6 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-blue-800 dark:text-blue-400">
                Family 2 &bull; Copied by Reference
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-900 dark:text-blue-300">
                1 Type
              </span>
            </div>

            <h3 className="text-lg font-bold text-[var(--text-main)]">
              Objects (Reference Types)
            </h3>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Objects hold collections of data or logic. When you assign an object to another variable, you only copy a pointer; both variables share the same object.
            </p>

            <div className="pt-2 border-t border-blue-500/20 space-y-1.5 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200">
              <div>&bull; <strong className="text-[var(--text-main)]">Object</strong> &rarr; <span className="text-blue-700 dark:text-blue-400">&#123; name: &quot;Alice&quot; &#125;</span></div>
              <div>&bull; <strong className="text-[var(--text-main)]">Array</strong> &rarr; <span className="text-blue-700 dark:text-blue-400">[1, 2, 3]</span></div>
              <div>&bull; <strong className="text-[var(--text-main)]">Function</strong> &rarr; <span className="text-blue-700 dark:text-blue-400">() =&gt; &#123; ... &#125;</span></div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 font-sans pt-2">
                (In JavaScript, Arrays and Functions are specialized kinds of Objects!)
              </div>
            </div>
          </div>

        </div>

        {/* Clear ASCII Architecture Diagram */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 sm:p-5 overflow-x-auto text-center shadow-xs">
          <div className="text-xs font-mono text-slate-400 mb-2 font-bold uppercase tracking-wider text-left">
            How Data Is Organized:
          </div>
          <pre className="font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed inline-block text-left select-none">
{`┌────────────────────────────────────────────────────────┐
│                  JAVASCRIPT DATA TYPES                 │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│     7 PRIMITIVES      │       │   1 REFERENCE TYPE    │
│   (Copied by Value)   │       │ (Copied by Reference) │
├───────────────────────┤       ├───────────────────────┤
│ • String    "hello"   │       │ • Object   { a: 1 }   │
│ • Number    42, 3.14  │       │ • Array    [1, 2, 3]  │
│ • Boolean   true      │       │ • Function () => {}   │
│ • Undefined undefined │       │                       │
│ • Null      null      │       │ (Collections of data  │
│ • BigInt    99n       │       │  and properties)      │
│ • Symbol    Symbol()  │       │                       │
└───────────────────────┘       └───────────────────────┘`}
          </pre>
        </div>
      </section>

      {/* =========================================================================
          3. VALUE VS REFERENCE: THE 2 EXAMPLES
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            How They Work: Value vs Reference in 2 Examples
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Here is the essential difference every programmer must remember:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Example 1: Primitives */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime">
                Example 1 &bull; Primitives Make Independent Copies
              </span>
              <button
                onClick={() => handleCopy(`let a = 10;\nlet b = a;\nb = 20;\n\nconsole.log(a); // 10\nconsole.log(b); // 20`, 'code-prim')}
                className="text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)] flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700"
              >
                {copiedId === 'code-prim' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'code-prim' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-pink-400">let</span> a = <span className="text-amber-300">10</span>;{'\n'}
                  <span className="text-pink-400">let</span> b = a; <span className="text-slate-400 italic">// b receives its own copy of 10</span>{'\n\n'}
                  b = <span className="text-amber-300">20</span>; <span className="text-slate-400 italic">// only b is modified</span>{'\n\n'}
                  <span className="text-sky-300">console.log</span>(a); <span className="text-emerald-400 font-bold">// 10 (Safe &amp; unchanged!)</span>{'\n'}
                  <span className="text-sky-300">console.log</span>(b); <span className="text-slate-400 font-bold">// 20</span>
                </code>
              </pre>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <strong className="text-[var(--text-main)]">Takeaway:</strong> Variable <code className="font-mono text-emerald-800 dark:text-brand-lime">b</code> holds an independent copy. Changing <code className="font-mono">b</code> never touches <code className="font-mono">a</code>.
            </p>
          </div>

          {/* Example 2: Objects */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-blue-800 dark:text-blue-400">
                Example 2 &bull; Objects Share the Same Reference
              </span>
              <button
                onClick={() => handleCopy(`let user1 = { name: "Alice" };\nlet user2 = user1;\nuser2.name = "Bob";\n\nconsole.log(user1.name); // "Bob" (Mutated!)\nconsole.log(user2.name); // "Bob"`, 'code-obj')}
                className="text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)] flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700"
              >
                {copiedId === 'code-obj' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'code-obj' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-pink-400">let</span> user1 = &#123; name: <span className="text-emerald-300">&quot;Alice&quot;</span> &#125;;{'\n'}
                  <span className="text-pink-400">let</span> user2 = user1; <span className="text-slate-400 italic">// Both point to the SAME object!</span>{'\n\n'}
                  user2.name = <span className="text-emerald-300">&quot;Bob&quot;</span>; <span className="text-rose-400 italic">// Mutates shared object!</span>{'\n\n'}
                  <span className="text-sky-300">console.log</span>(user1.name); <span className="text-rose-400 font-bold">// &quot;Bob&quot; (Changed!)</span>{'\n'}
                  <span className="text-sky-300">console.log</span>(user2.name); <span className="text-slate-400 font-bold">// &quot;Bob&quot;</span>
                </code>
              </pre>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <strong className="text-[var(--text-main)]">Takeaway:</strong> Variable <code className="font-mono text-blue-800 dark:text-blue-400">user2</code> does not get a copy of the object; it points to the exact same object in memory.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. THE COMMON MISTAKE & THE FIX (CLONING)
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Classic Mistake: Accidental Mutation &amp; The Fix
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          When beginners want to copy an object without modifying the original, they often write <code className="font-mono text-rose-600 dark:text-rose-400">b = a</code> by mistake. Here is how to fix it:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Mistake Card */}
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> The Mistake (Shared Reference)
            </span>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs sm:text-sm text-slate-100">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-pink-400">const</span> original = &#123; role: <span className="text-emerald-300">&quot;admin&quot;</span> &#125;;{'\n'}
                  <span className="text-pink-400">const</span> copy = original; <span className="text-slate-400 italic">// NOT a new object</span>{'\n'}
                  copy.role = <span className="text-emerald-300">&quot;guest&quot;</span>;{'\n\n'}
                  <span className="text-sky-300">console.log</span>(original.role); <span className="text-rose-400 italic">// &quot;guest&quot; (Corrupted!)</span>
                </code>
              </pre>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              Assigning objects copies only the memory pointer, not the contents.
            </p>
          </div>

          {/* Fix Card */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> The Fix (Spread Operator &#123; ... &#125;)
            </span>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs sm:text-sm text-slate-100">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-pink-400">const</span> original = &#123; role: <span className="text-emerald-300">&quot;admin&quot;</span> &#125;;{'\n'}
                  <span className="text-pink-400">const</span> copy = &#123; ...original &#125;; <span className="text-emerald-400 italic">// Brand-new copy!</span>{'\n'}
                  copy.role = <span className="text-emerald-300">&quot;guest&quot;</span>;{'\n\n'}
                  <span className="text-sky-300">console.log</span>(original.role); <span className="text-emerald-400 italic">// &quot;admin&quot; (Safe!)</span>
                </code>
              </pre>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              Use object spread <code className="font-mono text-emerald-800 dark:text-brand-lime">&#123; ...original &#125;</code> to create a fresh, independent object.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. CHECKING TYPES: THE TYPEOF OPERATOR
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Checking Types with <code className="font-mono text-emerald-700 dark:text-brand-lime">typeof</code>
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          JavaScript provides the built-in <code className="font-mono font-bold text-[var(--text-main)]">typeof</code> operator to inspect the data type of any variable:
        </p>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[var(--text-main)] font-semibold">
              <tr>
                <th className="py-2.5 px-4 font-mono">Expression</th>
                <th className="py-2.5 px-4 font-mono">Result</th>
                <th className="py-2.5 px-4">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-200">
              <tr>
                <td className="py-2.5 px-4 text-emerald-700 dark:text-emerald-400">typeof &quot;Alice&quot;</td>
                <td className="py-2.5 px-4 font-bold">&quot;string&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Text surrounded by quotes</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-amber-700 dark:text-amber-400">typeof 42</td>
                <td className="py-2.5 px-4 font-bold">&quot;number&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Numbers and decimals (e.g. 3.14)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-blue-700 dark:text-blue-400">typeof true</td>
                <td className="py-2.5 px-4 font-bold">&quot;boolean&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">true or false truth values</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-zinc-600 dark:text-zinc-400">typeof undefined</td>
                <td className="py-2.5 px-4 font-bold">&quot;undefined&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Declared variable with no value assigned</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-purple-700 dark:text-purple-400">typeof &#123; id: 1 &#125;</td>
                <td className="py-2.5 px-4 font-bold">&quot;object&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Key-value pair object collection</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-purple-700 dark:text-purple-400">typeof [1, 2, 3]</td>
                <td className="py-2.5 px-4 font-bold">&quot;object&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Arrays are objects in JavaScript!</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-rose-600 dark:text-rose-400">typeof null</td>
                <td className="py-2.5 px-4 font-bold text-amber-700 dark:text-amber-400">&quot;object&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">A famous 1995 JS quirk (null is a primitive, but returns object)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          6. QUICK 3-QUESTION PRACTICE CHECK
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Quick Knowledge Check (3 Questions)
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Test your understanding on these 3 simple questions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Question 1 */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime">
                Question 1 &bull; Primitives
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-main)] mt-1">
                What does this code print?
              </p>
              
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 my-2">
                <code>let x = 50;{'\n'}let y = x;{'\n'}y = 100;{'\n'}console.log(x);</code>
              </div>

              <div className="space-y-1.5 pt-1">
                {[
                  { label: "A) 50", correct: true, why: "Numbers are primitives copied by value. Changing y does not change x." },
                  { label: "B) 100", correct: false, why: "x is untouched because y received an independent copy of 50." }
                ].map((opt, idx) => {
                  const isSelected = quizAnswers['q1'] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect('q1', idx)}
                      className={`w-full p-2 rounded-lg text-left text-xs font-mono font-medium border transition-colors ${
                        isSelected
                          ? opt.correct
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                            : 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold'
                          : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {quizAnswers['q1'] !== undefined && (
              <div className={`p-2 rounded text-xs mt-2 border ${
                quizAnswers['q1'] === 0
                  ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
                  : 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300'
              }`}>
                {quizAnswers['q1'] === 0 ? "Correct! Numbers are copied by value." : "Incorrect. Numbers are primitives copied by value."}
              </div>
            )}
          </div>

          {/* Question 2 */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-blue-800 dark:text-blue-400">
                Question 2 &bull; Objects
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-main)] mt-1">
                What does this code print?
              </p>
              
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 my-2">
                <code>const a = &#123; n: 1 &#125;;{'\n'}const b = a;{'\n'}b.n = 5;{'\n'}console.log(a.n);</code>
              </div>

              <div className="space-y-1.5 pt-1">
                {[
                  { label: "A) 1", correct: false, why: "Objects are copied by reference. Both point to the same object." },
                  { label: "B) 5", correct: true, why: "Both a and b point to the exact same object in memory." }
                ].map((opt, idx) => {
                  const isSelected = quizAnswers['q2'] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect('q2', idx)}
                      className={`w-full p-2 rounded-lg text-left text-xs font-mono font-medium border transition-colors ${
                        isSelected
                          ? opt.correct
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                            : 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold'
                          : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {quizAnswers['q2'] !== undefined && (
              <div className={`p-2 rounded text-xs mt-2 border ${
                quizAnswers['q2'] === 1
                  ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
                  : 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300'
              }`}>
                {quizAnswers['q2'] === 1 ? "Correct! Objects share the same memory pointer." : "Incorrect. Object assignment copies the pointer, not the object."}
              </div>
            )}
          </div>

          {/* Question 3 */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-purple-700 dark:text-purple-400">
                Question 3 &bull; Type Types
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-main)] mt-1">
                Which of these is NOT a primitive?
              </p>
              
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 my-2">
                <code>// Which one is a Reference Type?</code>
              </div>

              <div className="space-y-1.5 pt-1">
                {[
                  { label: "A) Array [1, 2, 3]", correct: true, why: "Arrays are objects (reference types)." },
                  { label: "B) Boolean (true)", correct: false, why: "Boolean is one of the 7 primitives." }
                ].map((opt, idx) => {
                  const isSelected = quizAnswers['q3'] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect('q3', idx)}
                      className={`w-full p-2 rounded-lg text-left text-xs font-mono font-medium border transition-colors ${
                        isSelected
                          ? opt.correct
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                            : 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold'
                          : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {quizAnswers['q3'] !== undefined && (
              <div className={`p-2 rounded text-xs mt-2 border ${
                quizAnswers['q3'] === 0
                  ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
                  : 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300'
              }`}>
                {quizAnswers['q3'] === 0 ? "Correct! Arrays and objects are reference types." : "Incorrect. Booleans are primitives; arrays are objects."}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. LIVE INTERACTIVE MEMORY STUDIO
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
                Live Memory Studio
              </h2>
            </div>

            {/* Segmented Preset Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              {presets.map((preset, idx) => {
                const isActive = activePresetIndex === idx;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setActivePresetIndex(idx);
                      handleRunCode(preset.code);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-bold border border-zinc-200 dark:border-zinc-700'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span>{preset.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive 
                        ? 'bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime font-bold'
                        : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                      {preset.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Context Guidance Banner */}
          <div className="px-3.5 py-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            <Info size={14} className="text-emerald-600 dark:text-brand-lime shrink-0" />
            <span>{presets[activePresetIndex].description}</span>
          </div>
        </div>

        {/* Split Screen Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          
          {/* Editor Container */}
          <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs h-[520px]">
            <CodeEditor initialCode={liveCode} onRun={handleRunCode} className="border-0 rounded-none h-full" />
          </div>

          {/* Memory Visualizer Canvas Container */}
          <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs h-[520px] bg-white dark:bg-zinc-950">
            <VisualizerCanvas topicId="data-types" code={liveCode} isRunning={isRunning} onCodeChange={handleRunCode} />
          </div>

        </div>
      </section>

    </div>
  );
}

export default DataTypesLesson;
