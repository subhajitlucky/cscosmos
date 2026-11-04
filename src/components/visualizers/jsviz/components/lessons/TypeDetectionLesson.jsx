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
  Play, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  HelpCircle, 
  Info,
  ShieldCheck,
  Search
} from 'lucide-react';
import CodeEditor from '../CodeEditor';
import VisualizerCanvas from '../VisualizerCanvas';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'Historical Quirk',
    badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'What does typeof null return in JavaScript?',
    code: `console.log(typeof null);`,
    options: [
      { 
        letter: 'A',
        label: '"null"', 
        correct: false, 
        why: 'While logical, JavaScript never returns "null" from typeof. It returns "object" due to a 1995 legacy bug.' 
      },
      { 
        letter: 'B',
        label: '"object"', 
        correct: true, 
        why: 'In the original 1995 JavaScript engine, objects had a type tag of 000. null was the NULL pointer (0x00), so it shared the 000 tag!' 
      }
    ],
    explanationCorrect: 'Correct! Even though null is one of the 7 primitives, typeof null returning "object" is JavaScript\'s most famous historical bug that could never be fixed without breaking older websites.',
    explanationIncorrect: 'Incorrect. You would naturally expect "null", but typeof null returns "object" due to a 1995 engine implementation quirk.'
  },
  {
    id: 'q2',
    category: 'Arrays',
    badgeClass: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'What does typeof [1, 2, 3] return?',
    code: `const list = [1, 2, 3];\nconsole.log(typeof list);`,
    options: [
      { 
        letter: 'A',
        label: '"array"', 
        correct: false, 
        why: 'JavaScript does not have an "array" string return value for typeof. Arrays are specialized objects!' 
      },
      { 
        letter: 'B',
        label: '"object"', 
        correct: true, 
        why: 'Arrays in JavaScript inherit from Object.prototype, so typeof returns "object". To check for arrays, always use Array.isArray(list).' 
      }
    ],
    explanationCorrect: 'Correct! In JavaScript, Arrays are Object reference types under the hood. To reliably check for an array, use Array.isArray(list).',
    explanationIncorrect: 'Incorrect. typeof never returns "array". It returns "object". Use the modern helper Array.isArray([1, 2, 3]) instead.'
  },
  {
    id: 'q3',
    category: 'NaN Oddity',
    badgeClass: 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'What does typeof NaN return?',
    code: `const result = 0 / 0; // Not a Number\nconsole.log(typeof result);`,
    options: [
      { 
        letter: 'A',
        label: '"number"', 
        correct: true, 
        why: 'In the IEEE-754 floating-point specification used by JavaScript, NaN is defined as a numeric value representing an undefined calculation.' 
      },
      { 
        letter: 'B',
        label: '"undefined"', 
        correct: false, 
        why: 'NaN is not undefined. It is a numeric value representing a calculation that could not yield a valid number.' 
      }
    ],
    explanationCorrect: 'Correct! "NaN" stands for Not-a-Number, but its official data type in JavaScript is actually "number". To test for NaN, use Number.isNaN(val).',
    explanationIncorrect: 'Incorrect. Despite its name (Not-a-Number), NaN is a numeric value conforming to IEEE-754. Its type is "number".'
  }
];

export function TypeDetectionLesson({ topic, content }) {
  const [copiedId, setCopiedId] = useState(null);

  // Quick Quiz Answers state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const presets = [
    {
      id: 'typeof-primitives',
      title: '1. typeof Operator',
      badge: 'Primitives',
      description: 'typeof inspects primitive values reliably, returning string type names like "number", "string", and "boolean".',
      code: `// 1. Testing Primitive Types with typeof
let userAge = 25;
let userName = "CS Cosmos";
let isEnrolled = true;
let unassigned;

console.log("typeof userAge:", typeof userAge);       // "number"
console.log("typeof userName:", typeof userName);     // "string"
console.log("typeof isEnrolled:", typeof isEnrolled); // "boolean"
console.log("typeof unassigned:", typeof unassigned); // "undefined"`
    },
    {
      id: 'array-detection',
      title: '2. Array Detection',
      badge: 'Array.isArray',
      description: 'Since typeof returns "object" for arrays, Array.isArray() is the dedicated method to identify true arrays.',
      code: `// 2. Arrays: The typeof Pitfall vs Array.isArray()
let items = ["apple", "banana", "cherry"];
let config = { theme: "dark" };

// The pitfall:
console.log("typeof items:", typeof items);   // "object" (Not specific!)
console.log("typeof config:", typeof config); // "object" (Identical!)

// The solution:
console.log("Array.isArray(items):", Array.isArray(items));   // true
console.log("Array.isArray(config):", Array.isArray(config)); // false`
    },
    {
      id: 'safe-object-check',
      title: '3. Safe Object Check',
      badge: 'Defensive JS',
      description: 'Check for null before inspecting an object to prevent runtime TypeErrors from the famous typeof null === "object" quirk.',
      code: `// 3. Defensive Object Validation
function isValidObject(val) {
  // Guard against null and arrays!
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

let profile = { id: 101, username: "dev" };
let emptySlot = null;
let tagList = ["react", "nextjs"];

console.log("profile is object?", isValidObject(profile));   // true
console.log("emptySlot is object?", isValidObject(emptySlot)); // false (Safe!)
console.log("tagList is object?", isValidObject(tagList));     // false (Safe!)`
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

  const handleQuizReset = () => {
    setQuizAnswers({});
    setActiveQuizIndex(0);
  };

  const totalQuizQuestions = QUIZ_QUESTIONS.length;
  const answeredQuizCount = Object.keys(quizAnswers).length;
  const correctQuizCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] !== undefined && q.options[quizAnswers[q.id]]?.correct
  ).length;

  const currentQ = QUIZ_QUESTIONS[activeQuizIndex] || QUIZ_QUESTIONS[0];
  const currentAnswer = quizAnswers[currentQ.id];
  const isCurrentAnswered = currentAnswer !== undefined;
  const isCurrentCorrect = isCurrentAnswered && currentQ.options[currentAnswer]?.correct;

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
          <span>Concept 02 of 100</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-main)]">
          Type Detection &amp; typeof Operator
        </h1>

        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          How do you find out what kind of data a variable holds? In JavaScript, the built-in <code className="font-mono font-bold text-[var(--text-main)]">typeof</code> operator is your first tool—but it has famous historical quirks. Learning which tool to use for each data type ensures your code runs safely without crashing.
        </p>
      </header>

      {/* =========================================================================
          2. THE CORE IDEA: THE 3 WAYS TO CHECK TYPES
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Core Idea: The 3 Detection Tools
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Because JavaScript evolved over decades, no single operator works perfectly for everything. We use 3 main tools:
        </p>

        {/* 3 Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Tool 1: typeof */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime">
                  Tool 1 &bull; Built-in Operator
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-900 dark:text-brand-lime">
                  Fastest
                </span>
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)]">
                typeof Operator
              </h3>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                The fastest way to test primitives (numbers, strings, booleans, undefined) and functions. Always returns a lowercase string.
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-500/20 text-xs font-mono text-zinc-800 dark:text-zinc-200">
              <span className="text-emerald-700 dark:text-emerald-400">typeof 42</span> &rarr; <span className="font-bold">&quot;number&quot;</span>
            </div>
          </div>

          {/* Tool 2: Array.isArray */}
          <div className="p-5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-blue-800 dark:text-blue-400">
                  Tool 2 &bull; Array Specialist
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-900 dark:text-blue-300">
                  Reliable
                </span>
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)]">
                Array.isArray()
              </h3>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Since <code className="font-mono">typeof []</code> returns <code className="font-mono">&quot;object&quot;</code>, JavaScript added this method to accurately distinguish arrays from plain objects.
              </p>
            </div>

            <div className="pt-2 border-t border-blue-500/20 text-xs font-mono text-zinc-800 dark:text-zinc-200">
              <span className="text-blue-700 dark:text-blue-400">Array.isArray([])</span> &rarr; <span className="font-bold">true</span>
            </div>
          </div>

          {/* Tool 3: Object.prototype.toString */}
          <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-purple-700 dark:text-purple-400">
                  Tool 3 &bull; Universal Tag
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-900 dark:text-purple-300">
                  100% Accurate
                </span>
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)]">
                Object.prototype.toString
              </h3>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                The ultimate engine-level detector. Queries the internal <code className="font-mono">[[Class]]</code> tag of any value without failing on null, Dates, or RegExps.
              </p>
            </div>

            <div className="pt-2 border-t border-purple-500/20 text-xs font-mono text-zinc-800 dark:text-zinc-200">
              <span className="text-purple-700 dark:text-purple-400">toString.call(null)</span> &rarr; <span className="font-bold">&quot;[object Null]&quot;</span>
            </div>
          </div>

        </div>

        {/* Clear ASCII Architecture Decision Tree */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 sm:p-5 overflow-x-auto text-center shadow-xs">
          <div className="text-xs font-mono text-slate-400 mb-2 font-bold uppercase tracking-wider text-left">
            Type Detection Decision Tree:
          </div>
          <pre className="font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed inline-block text-left select-none">
{`┌────────────────────────────────────────────────────────┐
│             WHAT VALUE ARE YOU TRYING TO TEST?         │
└───────────────────────────┬────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  IS IT PRIMITIVE │ │  IS IT AN ARRAY? │ │ IS IT AN OBJECT  │
│  OR A FUNCTION?  │ │                  │ │   OR NULL?       │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ Use: typeof x    │ │ Use:             │ │ Step 1:          │
│                  │ │ Array.isArray(x) │ │ Check x === null │
│ Returns:         │ │                  │ │ Step 2:          │
│ "number"         │ │ Returns:         │ │ typeof x ===     │
│ "string"         │ │ true or false    │ │   "object"       │
│ "boolean"        │ │                  │ │                  │
│ "undefined"      │ │ (Never rely on   │ │ (Guards against  │
│ "function"       │ │  typeof for [])  │ │  typeof null!)   │
└──────────────────┘ └──────────────────┘ └──────────────────┘`}
          </pre>
        </div>
      </section>

      {/* =========================================================================
          3. REAL EXAMPLES: THE GOOD VS THE QUIRKS
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            How They Work: Normal Cases vs Famous Quirks
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Compare how JavaScript behaves with standard primitives versus its surprising historical quirks:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Example 1: The Good (Primitives & Functions) */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime">
                Example 1 &bull; Primitives Work Perfectly
              </span>
              <button
                type="button"
                onClick={() => handleCopy(`console.log(typeof 42);             // "number"\nconsole.log(typeof "hello");        // "string"\nconsole.log(typeof true);           // "boolean"\nconsole.log(typeof undefined);      // "undefined"\nconsole.log(typeof Symbol());       // "symbol"\nconsole.log(typeof 10n);            // "bigint"\nconsole.log(typeof (() => {}));     // "function"`, 'code-good')}
                className="text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)] flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700"
              >
                {copiedId === 'code-good' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'code-good' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-sky-300">typeof</span> <span className="text-amber-300">42</span>; <span className="text-emerald-400 font-bold">// &quot;number&quot;</span>{'\n'}
                  <span className="text-sky-300">typeof</span> <span className="text-emerald-300">&quot;hello&quot;</span>; <span className="text-emerald-400 font-bold">// &quot;string&quot;</span>{'\n'}
                  <span className="text-sky-300">typeof</span> <span className="text-blue-400">true</span>; <span className="text-emerald-400 font-bold">// &quot;boolean&quot;</span>{'\n'}
                  <span className="text-sky-300">typeof</span> <span className="text-slate-400">undefined</span>; <span className="text-emerald-400 font-bold">// &quot;undefined&quot;</span>{'\n'}
                  <span className="text-sky-300">typeof</span> <span className="text-purple-400">10n</span>; <span className="text-emerald-400 font-bold">// &quot;bigint&quot;</span>{'\n'}
                  <span className="text-sky-300">typeof</span> (() =&gt; &#123;&#125;); <span className="text-emerald-400 font-bold">// &quot;function&quot;</span>
                </code>
              </pre>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <strong className="text-[var(--text-main)]">Takeaway:</strong> For native primitives and callable functions, <code className="font-mono text-emerald-800 dark:text-brand-lime">typeof</code> is completely reliable and fast.
            </p>
          </div>

          {/* Example 2: The Quirks (null, [], and NaN) */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-amber-700 dark:text-amber-400">
                Example 2 &bull; The 3 Historical Quirks
              </span>
              <button
                type="button"
                onClick={() => handleCopy(`console.log(typeof null);          // "object" ⚠️\nconsole.log(typeof []);            // "object" ⚠️\nconsole.log(typeof NaN);           // "number" ⚠️`, 'code-quirks')}
                className="text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)] flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700"
              >
                {copiedId === 'code-quirks' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'code-quirks' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-sky-300">typeof</span> <span className="text-slate-400">null</span>; <span className="text-rose-400 font-bold">// &quot;object&quot; ⚠️ (1995 Bug)</span>{'\n'}
                  <span className="text-sky-300">typeof</span> [1, 2]; <span className="text-rose-400 font-bold">// &quot;object&quot; ⚠️ (Arrays are objects)</span>{'\n'}
                  <span className="text-sky-300">typeof</span> <span className="text-amber-300">NaN</span>; <span className="text-rose-400 font-bold">// &quot;number&quot; ⚠️ (Numeric IEEE state)</span>{'\n\n'}
                  <span className="text-slate-400 italic">// The proper detections:</span>{'\n'}
                  val === <span className="text-slate-400">null</span>; <span className="text-emerald-400 font-bold">// Check null directly</span>{'\n'}
                  Array.<span className="text-sky-300">isArray</span>([1, 2]); <span className="text-emerald-400 font-bold">// true</span>
                </code>
              </pre>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <strong className="text-[var(--text-main)]">Takeaway:</strong> Never check for <code className="font-mono text-amber-700 dark:text-amber-400">null</code> or <code className="font-mono text-amber-700 dark:text-amber-400">[]</code> with <code className="font-mono">typeof</code> alone. Use direct equality and <code className="font-mono">Array.isArray()</code>.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. THE COMMON MISTAKE & THE FIX
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Classic Mistake: The `null` Object Crash &amp; The Fix
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Because <code className="font-mono text-rose-600 dark:text-rose-400">typeof null === &quot;object&quot;</code>, checking if a variable is an object without guarding against <code className="font-mono">null</code> causes runtime crashes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Mistake Card */}
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> The Mistake (Crashes on null)
            </span>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs sm:text-sm text-slate-100">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-pink-400">function</span> <span className="text-sky-300">printUser</span>(user) &#123;{'\n'}
                  &nbsp;&nbsp;<span className="text-pink-400">if</span> (<span className="text-sky-300">typeof</span> user === <span className="text-emerald-300">&quot;object&quot;</span>) &#123;{'\n'}
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400 italic">// If user is null, this throws TypeError!</span>{'\n'}
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-300">console.log</span>(user.name);{'\n'}
                  &nbsp;&nbsp;&#125;{'\n'}
                  &#125;{'\n\n'}
                  printUser(<span className="text-slate-400">null</span>); <span className="text-rose-400 font-bold">// 💥 Uncaught TypeError!</span>
                </code>
              </pre>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              When <code className="font-mono">user</code> is <code className="font-mono">null</code>, the condition passes, but accessing <code className="font-mono">null.name</code> crashes your app.
            </p>
          </div>

          {/* Fix Card */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> The Fix (Guard against null &amp; arrays)
            </span>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs sm:text-sm text-slate-100">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-pink-400">function</span> <span className="text-sky-300">printUser</span>(user) &#123;{'\n'}
                  &nbsp;&nbsp;<span className="text-slate-400 italic">// Check user !== null FIRST!</span>{'\n'}
                  &nbsp;&nbsp;<span className="text-pink-400">if</span> (user !== <span className="text-slate-400">null</span> &amp;&amp; <span className="text-sky-300">typeof</span> user === <span className="text-emerald-300">&quot;object&quot;</span>) &#123;{'\n'}
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-300">console.log</span>(user.name); <span className="text-emerald-400 font-bold">// 100% Safe</span>{'\n'}
                  &nbsp;&nbsp;&#125;{'\n'}
                  &#125;{'\n\n'}
                  printUser(<span className="text-slate-400">null</span>); <span className="text-emerald-400 font-bold">// Clean &amp; Safe: does not crash</span>
                </code>
              </pre>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              Always add <code className="font-mono text-emerald-800 dark:text-brand-lime">user !== null</code> before checking <code className="font-mono">typeof user === &quot;object&quot;</code>.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. COMPLETE TYPE DETECTION CHEAT SHEET
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Complete Type Detection Cheat Sheet
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Keep this quick reference handy to know what <code className="font-mono">typeof</code> returns for every JavaScript value:
        </p>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[var(--text-main)] font-semibold">
              <tr>
                <th className="py-2.5 px-4 font-mono">Expression</th>
                <th className="py-2.5 px-4 font-mono">typeof Result</th>
                <th className="py-2.5 px-4 font-mono">Recommended Way to Check</th>
                <th className="py-2.5 px-4">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-200">
              <tr>
                <td className="py-2.5 px-4 text-amber-700 dark:text-amber-400">typeof 42</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">&quot;number&quot;</td>
                <td className="py-2.5 px-4 text-emerald-800 dark:text-brand-lime">typeof x === &quot;number&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Standard primitive number</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-emerald-700 dark:text-emerald-400">typeof &quot;hello&quot;</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">&quot;string&quot;</td>
                <td className="py-2.5 px-4 text-emerald-800 dark:text-brand-lime">typeof x === &quot;string&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Text string primitive</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-blue-700 dark:text-blue-400">typeof true</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">&quot;boolean&quot;</td>
                <td className="py-2.5 px-4 text-emerald-800 dark:text-brand-lime">typeof x === &quot;boolean&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Boolean truth value</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-zinc-600 dark:text-zinc-400">typeof undefined</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">&quot;undefined&quot;</td>
                <td className="py-2.5 px-4 text-emerald-800 dark:text-brand-lime">x === undefined</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Variable without an assigned value</td>
              </tr>
              <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                <td className="py-2.5 px-4 text-rose-600 dark:text-rose-400 font-bold">typeof null</td>
                <td className="py-2.5 px-4 font-bold text-amber-700 dark:text-amber-400">&quot;object&quot; ⚠️</td>
                <td className="py-2.5 px-4 text-emerald-800 dark:text-brand-lime font-bold">x === null</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Famous 1995 engine bug; null is primitive</td>
              </tr>
              <tr className="bg-blue-50/50 dark:bg-blue-950/20">
                <td className="py-2.5 px-4 text-blue-700 dark:text-blue-400 font-bold">typeof [1, 2]</td>
                <td className="py-2.5 px-4 font-bold text-amber-700 dark:text-amber-400">&quot;object&quot; ⚠️</td>
                <td className="py-2.5 px-4 text-emerald-800 dark:text-brand-lime font-bold">Array.isArray(x)</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Arrays inherit from Object; use Array.isArray</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-blue-700 dark:text-blue-400">typeof &#123;&#125;</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">&quot;object&quot;</td>
                <td className="py-2.5 px-4 text-emerald-800 dark:text-brand-lime">x !== null &amp;&amp; typeof x === &quot;object&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Plain JavaScript object</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-purple-700 dark:text-purple-400">typeof (() =&gt; &#123;&#125;)</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">&quot;function&quot;</td>
                <td className="py-2.5 px-4 text-emerald-800 dark:text-brand-lime">typeof x === &quot;function&quot;</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">Functions get special first-class typeof</td>
              </tr>
              <tr className="bg-rose-50/50 dark:bg-rose-950/20">
                <td className="py-2.5 px-4 text-amber-700 dark:text-amber-400 font-bold">typeof NaN</td>
                <td className="py-2.5 px-4 font-bold text-amber-700 dark:text-amber-400">&quot;number&quot; ⚠️</td>
                <td className="py-2.5 px-4 text-emerald-800 dark:text-brand-lime font-bold">Number.isNaN(x)</td>
                <td className="py-2.5 px-4 font-sans text-zinc-700 dark:text-zinc-300">IEEE-754 numerical state; test with Number.isNaN</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          6. QUICK 3-QUESTION PRACTICE CHECK (ONE-BY-ONE FOCUSED WITH FLEXIBILITY)
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

        {/* Question Selector Tabs (Flexibility to jump directly to any question) */}
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
          {/* Top Question Status & Category */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${currentQ.badgeClass}`}>
                Question {activeQuizIndex + 1} of {totalQuizQuestions} &bull; {currentQ.category}
              </span>
            </div>

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

          {/* Question Prompt */}
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] leading-snug">
            {currentQ.title}
          </h3>

          {/* Code Snippet Box */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto shadow-inner">
            <pre className="whitespace-pre">
              <code>{currentQ.code}</code>
            </pre>
          </div>

          {/* Options */}
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
                        <span className="font-mono text-sm font-semibold">
                          {opt.letter}) {opt.label}
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

          {/* Explanation Banner (Revealed when answered) */}
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
                  <Info className="w-4 h-4 text-rose-600 dark:text-rose-400" />
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

          {/* Bottom Stepper & Flexibility Navigation */}
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

            {/* Clickable Step Indicator Dots */}
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

        {/* Completion Milestone Banner when all 3 questions answered */}
        {answeredQuizCount === totalQuizQuestions && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-brand-lime shrink-0" />
              <p className="text-xs sm:text-sm font-medium">
                {correctQuizCount === totalQuizQuestions ? (
                  <><strong>Perfect Score! 3 / 3 correct.</strong> You understand JavaScript type detection and how to avoid the classic typeof pitfalls.</>
                ) : (
                  <><strong>Quiz Completed ({correctQuizCount}/{totalQuizQuestions} correct).</strong> Review any question above to master typeof null and Array.isArray.</>
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

      {/* =========================================================================
          7. LIVE INTERACTIVE MEMORY STUDIO
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
                Live Type Detection Studio
              </h2>
            </div>

            {/* Segmented Preset Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              {presets.map((preset, idx) => {
                const isActive = activePresetIndex === idx;
                return (
                  <button
                    key={preset.id}
                    type="button"
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
            <VisualizerCanvas topicId="typeof-detection" code={liveCode} isRunning={isRunning} onCodeChange={handleRunCode} />
          </div>

        </div>
      </section>

    </div>
  );
}

export default TypeDetectionLesson;
