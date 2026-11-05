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
  Code2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ShieldCheck, 
  Terminal, 
  FileCode2 
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'The Fundamental Rule',
    badgeClass: 'text-emerald-700 dark:text-brand-lime bg-emerald-500/10 border-emerald-500/20',
    title: 'What is the defining characteristic of a JavaScript Expression?',
    code: `// An expression always reduces down to something:\nconst result = 10 + 20;`,
    options: [
      { 
        letter: 'A',
        label: 'An expression always evaluates to a single value.', 
        correct: true, 
        why: 'Whether it is a literal (42), an arithmetic operation (2 + 3), a function call (Math.max(1, 2)), or a ternary expression (a ? b : c), an expression always produces a value that can be assigned or passed.' 
      },
      { 
        letter: 'B',
        label: 'An expression is any line of code that ends with a semicolon.', 
        correct: false, 
        why: 'Statements end with semicolons too. Ending with a semicolon does not make something an expression.' 
      }
    ],
    explanationCorrect: 'Correct! The golden rule of JavaScript grammar: Expressions produce values; Statements perform actions. Wherever JavaScript expects a value, you can put an expression.',
    explanationIncorrect: 'Incorrect. An expression is defined by its ability to evaluate to a value (e.g. 5, "hello", true, or an object).'
  },
  {
    id: 'q2',
    category: 'Grammar Legality',
    badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Why is `const answer = if (isLoggedIn) { "Hi" } else { "Bye" };` a SyntaxError?',
    code: `// ❌ SyntaxError: Unexpected token 'if'\nconst answer = if (isLoggedIn) { "Hi" } else { "Bye" };`,
    options: [
      { 
        letter: 'A',
        label: 'if...else is a statement (an action), not an expression, so it cannot produce an assignable value.', 
        correct: true, 
        why: 'The assignment operator (=) expects an expression on its right side. Because if...else is a statement, it cannot be assigned. The expression equivalent is the ternary operator: isLoggedIn ? "Hi" : "Bye".' 
      },
      { 
        letter: 'B',
        label: 'JavaScript requires the const keyword to be placed inside the curly braces of if statements.', 
        correct: false, 
        why: 'You can declare variables inside if blocks, but that is not why this code fails. The code fails because if statements cannot produce assignable values.' 
      }
    ],
    explanationCorrect: 'Correct! Statements control the flow of execution, while expressions produce data. To assign conditionally in one line, use the ternary expression: `const answer = isLoggedIn ? "Hi" : "Bye";`.',
    explanationIncorrect: 'Incorrect. `if` is a statement (a control-flow action). You cannot place a statement on the right-hand side of a variable assignment.'
  },
  {
    id: 'q3',
    category: 'The ASI Return Trap',
    badgeClass: 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'What does this function return in JavaScript?',
    code: `function getUser() {\n  return\n  {\n    name: "Alice"\n  };\n}\nconsole.log(getUser());`,
    options: [
      { 
        letter: 'A',
        label: 'undefined', 
        correct: true, 
        why: 'Because of Automatic Semicolon Insertion (ASI), JavaScript sees a line break immediately after the return keyword and automatically inserts a semicolon: return;! The object below is treated as an unreachable labeled block.' 
      },
      { 
        letter: 'B',
        label: '{ name: "Alice" }', 
        correct: false, 
        why: 'While you intended to return the object, placing the opening brace { on a new line causes ASI to terminate the return statement immediately with undefined.' 
      }
    ],
    explanationCorrect: 'Correct! This is JavaScript\'s most famous syntax trap. Never place a line break between `return` and its value. Always place the opening `{` on the same line: `return { name: "Alice" };`.',
    explanationIncorrect: 'Incorrect. It returns `undefined`. Automatic Semicolon Insertion (ASI) turns line 2 into `return;`, causing the function to exit immediately.'
  }
];

export function SyntaxExpressionsLesson({ topic }) {
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

  const comparisons = [
    {
      id: 'ternary',
      title: '1. If Statement vs. Ternary Expression',
      badge: 'Control Flow',
      desc: 'An if block cannot be assigned to a variable; a ternary expression produces a value directly.',
      statementCode: `// ❌ Statement: Cannot be assigned to a variable
let greeting;
if (hour < 12) {
  greeting = "Good Morning";
} else {
  greeting = "Hello";
}`,
      expressionCode: `// ✅ Expression: Directly produces a value!
const greeting = hour < 12 ? "Good Morning" : "Hello";

// Can even be embedded directly inside template literals:
console.log(\`User says: \${hour < 12 ? "Morning" : "Hello"}\`);`
    },
    {
      id: 'functions',
      title: '2. Function Declaration vs. Expression',
      badge: 'Functions',
      desc: 'Function declarations are statements hoisted to the top; function expressions produce a function value.',
      statementCode: `// Statement: Function Declaration
// Hoisted: can be called before it is written in source!
greet("Alice"); // Works!

function greet(name) {
  return "Hello " + name;
}`,
      expressionCode: `// Expression: Function assigned to a variable
// Not hoisted: cannot be called before this line!
const greet = function(name) {
  return "Hello " + name;
};

// Arrow functions are always expressions:
const add = (a, b) => a + b;`
    },
    {
      id: 'asi',
      title: '3. Automatic Semicolon Insertion (ASI)',
      badge: 'ASI Traps',
      desc: 'JavaScript inserts semicolons at line breaks, which can silently change the meaning of your code.',
      statementCode: `// ⚠️ The ASI Trap:
function makeUser() {
  return            // JS inserts ';' here!
  {
    name: "Dev"
  };
}
console.log(makeUser()); // undefined!`,
      expressionCode: `// ✅ The Clean Solution:
// Keep the opening brace on the same line as return:
function makeUser() {
  return {
    name: "Dev"
  };
}
console.log(makeUser()); // { name: "Dev" }`
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
          <span className="font-bold text-[var(--text-main)]">Concept 04 of 100</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-main)]">
          JavaScript Syntax, Statements &amp; Expressions
        </h1>

        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          The single biggest point of syntax confusion for beginners is the difference between an <strong className="text-[var(--text-main)] font-semibold">Expression</strong> (which creates a value) and a <strong className="text-[var(--text-main)] font-semibold">Statement</strong> (which performs an action). Mastering this distinction unlocks how JavaScript actually evaluates code.
        </p>
      </header>

      {/* =========================================================================
          2. THE CORE IDEA: STATEMENTS VS EXPRESSIONS
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Golden Rule of JavaScript Grammar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Expressions Card */}
          <div className="p-5 sm:p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> The Value Makers
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                Expressions
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Any piece of code that <strong className="text-[var(--text-main)]">evaluates to a single value</strong>. Like an English noun phrase or math formula.
              </p>
              <div className="pt-2 border-t border-emerald-500/20 space-y-1 text-xs font-mono text-zinc-800 dark:text-zinc-200">
                <div>&bull; <code className="text-emerald-700 dark:text-brand-lime">5 + 5</code> &rarr; evaluates to <span className="font-bold">10</span></div>
                <div>&bull; <code className="text-emerald-700 dark:text-brand-lime">&quot;cat&quot;.toUpperCase()</code> &rarr; <span className="font-bold">&quot;CAT&quot;</span></div>
                <div>&bull; <code className="text-emerald-700 dark:text-brand-lime">isMember ? 0.9 : 1.0</code> &rarr; discount rate</div>
                <div>&bull; <code className="text-emerald-700 dark:text-brand-lime">Math.random() &gt; 0.5</code> &rarr; <span className="font-bold">true / false</span></div>
              </div>
            </div>
            <div className="pt-2 text-xs font-mono text-emerald-900 dark:text-emerald-300 font-semibold">
              // Can be passed into function arguments or assigned with =
            </div>
          </div>

          {/* Statements Card */}
          <div className="p-5 sm:p-6 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> The Action Takers
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                Statements
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                A complete instruction that <strong className="text-[var(--text-main)]">performs an action</strong>. Like a full English sentence ending in a period.
              </p>
              <div className="pt-2 border-t border-blue-500/20 space-y-1 text-xs font-mono text-zinc-800 dark:text-zinc-200">
                <div>&bull; <code className="text-blue-700 dark:text-blue-400">let score = 100;</code> &rarr; Variable declaration</div>
                <div>&bull; <code className="text-blue-700 dark:text-blue-400">if (score &gt; 50) &#123; win(); &#125;</code> &rarr; Control flow</div>
                <div>&bull; <code className="text-blue-700 dark:text-blue-400">for (let i = 0; i &lt; 5; i++) &#123;&#125;</code> &rarr; Loop iteration</div>
                <div>&bull; <code className="text-blue-700 dark:text-blue-400">return true;</code> &rarr; Function exit</div>
              </div>
            </div>
            <div className="pt-2 text-xs font-mono text-blue-900 dark:text-blue-300 font-semibold">
              // Cannot be passed as an argument or assigned to a variable
            </div>
          </div>

        </div>

        {/* ASCII Architecture Comparison */}
        <div className="rounded-xl bg-slate-950 selection:bg-[#264f78] selection:text-white border border-slate-800 p-4 sm:p-5 overflow-x-auto text-center shadow-xs">
          <div className="text-xs font-mono text-slate-400 mb-2 font-bold uppercase tracking-wider text-left">
            How The Parser Categorizes Code:
          </div>
          <pre className="font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed inline-block text-left select-none">
{`┌────────────────────────────────────────────────────────┐
│                   JAVASCRIPT GRAMMAR                   │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 ┌───────────────────────┐       ┌───────────────────────┐
 │      EXPRESSIONS      │       │      STATEMENTS       │
 │  (Produces a Value)   │       │  (Performs an Action) │
 ├───────────────────────┤       ├───────────────────────┤
 │ • 2 + 2               │       │ • let x = 10;         │
 │ • user.name           │       │ • if (user) { ... }   │
 │ • isActive ? 1 : 0    │       │ • for (let i of arr)  │
 │ • [1, 2, 3]           │       │ • throw new Error();  │
 │                       │       │ • return value;       │
 │ Can sit on right side │       │ Controls flow, scopes,│
 │ of assignment (=)     │       │ or engine state       │
 └───────────────────────┘       └───────────────────────┘`}
          </pre>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE GRAMMAR COMPARATOR
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Side-by-Side: Common Grammar Patterns
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Choose a scenario below to explore how statements and expressions differ in everyday JavaScript:
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {comparisons.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-2 rounded-xl border text-xs font-mono font-medium transition-all ${
                activeTab === idx
                  ? 'border-emerald-600 dark:border-brand-lime bg-emerald-50 dark:bg-emerald-950/30 text-[var(--text-main)] font-bold shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Comparison Viewer */}
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-4">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
            {comparisons[activeTab].desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Statement Box */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Statement Approach (Action)
              </span>
              <div className="rounded-xl border border-slate-800 bg-slate-950 selection:bg-[#264f78] selection:text-white p-4 font-mono text-xs text-slate-100 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre leading-relaxed">
                  <code>{comparisons[activeTab].statementCode}</code>
                </pre>
              </div>
            </div>

            {/* Expression Box */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-brand-lime flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Expression Approach (Value)
              </span>
              <div className="rounded-xl border border-slate-800 bg-slate-950 selection:bg-[#264f78] selection:text-white p-4 font-mono text-xs text-slate-100 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre leading-relaxed">
                  <code>{comparisons[activeTab].expressionCode}</code>
                </pre>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE CLASSIC ASI TRAP & THE FIX
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Classic Trap: Automatic Semicolon Insertion (ASI)
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          JavaScript features Automatic Semicolon Insertion (ASI). If you break a line after <code className="font-mono text-rose-600 dark:text-rose-400 font-bold">return</code>, <code className="font-mono font-bold">break</code>, <code className="font-mono font-bold">continue</code>, or <code className="font-mono font-bold">throw</code>, the engine inserts a semicolon automatically:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> The Bug (Silent undefined)
            </span>
            <div className="rounded-lg border border-slate-800 bg-slate-950 selection:bg-[#264f78] selection:text-white p-3 font-mono text-xs sm:text-sm text-slate-100">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-pink-400">function</span> <span className="text-sky-300">getProfile</span>() &#123;{'\n'}
                  &nbsp;&nbsp;<span className="text-pink-400">return</span> <span className="text-rose-400 italic">// ⚠️ ASI inserts &apos;;&apos; here!</span>{'\n'}
                  &nbsp;&nbsp;&#123;{'\n'}
                  &nbsp;&nbsp;&nbsp;&nbsp;role: <span className="text-emerald-300">&quot;admin&quot;</span>{'\n'}
                  &nbsp;&nbsp;&#125;;{'\n'}
                  &#125;{'\n\n'}
                  <span className="text-sky-300">console.log</span>(getProfile()); <span className="text-rose-400 font-bold">// undefined</span>
                </code>
              </pre>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              The function exits on line 2 with <code className="font-mono">undefined</code>. The object below is never evaluated.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> The Fix (Keep Opening Brace on Line)
            </span>
            <div className="rounded-lg border border-slate-800 bg-slate-950 selection:bg-[#264f78] selection:text-white p-3 font-mono text-xs sm:text-sm text-slate-100">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-pink-400">function</span> <span className="text-sky-300">getProfile</span>() &#123;{'\n'}
                  &nbsp;&nbsp;<span className="text-pink-400">return</span> &#123; <span className="text-emerald-400 italic">// ✅ &apos;&#123;&apos; on same line prevents ASI!</span>{'\n'}
                  &nbsp;&nbsp;&nbsp;&nbsp;role: <span className="text-emerald-300">&quot;admin&quot;</span>{'\n'}
                  &nbsp;&nbsp;&#125;;{'\n'}
                  &#125;{'\n\n'}
                  <span className="text-sky-300">console.log</span>(getProfile()); <span className="text-emerald-400 font-bold">// &#123; role: &quot;admin&quot; &#125;</span>
                </code>
              </pre>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              Always place the opening brace <code className="font-mono text-emerald-800 dark:text-brand-lime">&#123;</code> or parentheses <code className="font-mono">(</code> on the same line as <code className="font-mono">return</code>.
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
                Test your understanding on statements vs expressions (one by one):
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

          <div className="rounded-xl bg-slate-950 selection:bg-[#264f78] selection:text-white border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto shadow-inner">
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
                  <><strong>Perfect Score! 3 / 3 correct.</strong> You master JavaScript expressions vs statements and how to avoid the ASI trap.</>
                ) : (
                  <><strong>Quiz Completed ({correctQuizCount}/{totalQuizQuestions} correct).</strong> Review the questions above to solidify the difference between values and actions.</>
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
          href="/jsviz/topic/javascript-engine-architecture-execution"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-mono text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous: Concept 03</span>
        </Link>

        <Link
          href="/jsviz/topic/primitive-vs-non-primitive-data-types"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-brand-lime dark:text-slate-950 font-mono text-xs font-bold transition-all shadow-xs"
        >
          <span>Jump to: Concept 08 (Data Types Reference)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

export default SyntaxExpressionsLesson;
