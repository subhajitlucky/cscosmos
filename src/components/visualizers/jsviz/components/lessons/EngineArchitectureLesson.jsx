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
  Cpu, 
  Flame, 
  Binary, 
  FileCode2, 
  Check, 
  Copy, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'The AST',
    badgeClass: 'text-emerald-700 dark:text-brand-lime bg-emerald-500/10 border-emerald-500/20',
    title: 'What does a JavaScript engine construct after tokenizing source code?',
    code: `// Source code ──▶ Tokens ──▶ ???`,
    options: [
      { 
        letter: 'A',
        label: 'An Abstract Syntax Tree (AST) representing the grammatical structure of the code.', 
        correct: true, 
        why: 'The parser verifies that your code conforms to JavaScript grammar and generates a hierarchical tree structure called an AST (Abstract Syntax Tree), which the interpreter reads.' 
      },
      { 
        letter: 'B',
        label: 'An executable .exe binary file saved permanently to the hard disk.', 
        correct: false, 
        why: 'JavaScript does not compile to standalone disk executables. The engine compiles and executes code in-memory within the process.' 
      }
    ],
    explanationCorrect: 'Correct! The Abstract Syntax Tree (AST) is the foundational data structure used by interpreters (like V8 Ignition) and linters/transpilers (like Babel and ESLint) to analyze code grammar.',
    explanationIncorrect: 'Incorrect. The engine constructs an Abstract Syntax Tree (AST) in memory to represent the syntactic structure before generating bytecode.'
  },
  {
    id: 'q2',
    category: 'JIT Compilation',
    badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'What does JIT stand for and how does it make JavaScript fast?',
    code: `// Hot functions are compiled to native machine instructions:`,
    options: [
      { 
        letter: 'A',
        label: 'Just-In-Time compilation: compiles frequently executed bytecode into native CPU instructions during execution.', 
        correct: true, 
        why: 'Instead of choosing between slow pure interpretation or slow ahead-of-time (AOT) compilation, modern engines start executing bytecode immediately and compile "hot" functions to raw machine code on the fly.' 
      },
      { 
        letter: 'B',
        label: 'Java Interface Translation: translates JavaScript into Java bytecode for the JVM.', 
        correct: false, 
        why: 'JavaScript engines run natively on your CPU (x86_64, ARM64) and have no connection to Java or the JVM.' 
      }
    ],
    explanationCorrect: 'Correct! Modern engines combine an interpreter (for zero startup delay) with an optimizing JIT compiler (TurboFan in V8) that turns hot code into raw machine code.',
    explanationIncorrect: 'Incorrect. JIT stands for Just-In-Time compilation, compiling hot bytecode into native CPU instructions while the program runs.'
  },
  {
    id: 'q3',
    category: 'De-optimization Bailout',
    badgeClass: 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'Why would an engine de-optimize (bail out) compiled machine code back to bytecode?',
    code: `function add(a, b) { return a + b; }\nadd(1, 2);       // Hot with numbers!\nadd("x", "y");   // ⚠️ Surprise type change!`,
    options: [
      { 
        letter: 'A',
        label: 'Because speculative type assumptions changed, making the optimized machine code invalid.', 
        correct: true, 
        why: 'The JIT compiler optimizes code based on the assumption that variable types will stay consistent. If you suddenly pass a string into a function optimized for integers, the machine instructions cannot handle it and the engine bails out.' 
      },
      { 
        letter: 'B',
        label: 'Because the engine automatically resets all compiled functions every 60 seconds.', 
        correct: false, 
        why: 'Optimized code stays in CPU memory indefinitely as long as type feedback assumptions hold true.' 
      }
    ],
    explanationCorrect: 'Correct! This is called a De-optimization Bailout. Keeping your data types consistent ("monomorphic code") helps the JIT compiler keep your code in high-speed machine mode.',
    explanationIncorrect: 'Incorrect. De-optimization occurs when speculative type feedback is violated (for instance, passing strings to a function previously optimized for numbers).'
  }
];

export function EngineArchitectureLesson({ topic, content }) {
  const [activeStep, setActiveStep] = useState(0);

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

  const pipelineSteps = [
    {
      step: '01',
      title: 'Raw Source Code',
      stage: 'Input',
      badge: 'Source',
      desc: 'Human-readable UTF-16 text entered into the script tag or file.',
      code: `function multiply(x, y) {\n  return x * y;\n}`
    },
    {
      step: '02',
      title: 'Tokens (Scanner)',
      stage: 'Lexical Analysis',
      badge: 'Lexer',
      desc: 'The Scanner strips whitespace/comments and breaks text into meaningful language tokens.',
      code: `[
  { type: "Keyword", value: "function" },
  { type: "Identifier", value: "multiply" },
  { type: "Punctuator", value: "(" },
  { type: "Identifier", value: "x" },
  { type: "Punctuator", value: "," },
  { type: "Identifier", value: "y" },
  { type: "Punctuator", value: ")" },
  { type: "Punctuator", value: "{" },
  { type: "Keyword", value: "return" },
  { type: "Identifier", value: "x" },
  { type: "Punctuator", value: "*" },
  { type: "Identifier", value: "y" },
  { type: "Punctuator", value: ";" },
  { type: "Punctuator", value: "}" }
]`
    },
    {
      step: '03',
      title: 'Abstract Syntax Tree (AST)',
      stage: 'Grammar Parsing',
      badge: 'Parser',
      desc: 'The Parser verifies syntax grammar and arranges tokens into a nested node tree.',
      code: `{
  "type": "FunctionDeclaration",
  "id": { "type": "Identifier", "name": "multiply" },
  "params": [
    { "type": "Identifier", "name": "x" },
    { "type": "Identifier", "name": "y" }
  ],
  "body": {
    "type": "BlockStatement",
    "body": [
      {
        "type": "ReturnStatement",
        "argument": {
          "type": "BinaryExpression",
          "operator": "*",
          "left": { "type": "Identifier", "name": "x" },
          "right": { "type": "Identifier", "name": "y" }
        }
      }
    ]
  }
}`
    },
    {
      step: '04',
      title: 'Bytecode (V8 Ignition)',
      stage: 'Interpreter Execution',
      badge: 'Interpreter',
      desc: 'The interpreter compiles the AST into compact register bytecode that executes instantly without compile delays.',
      code: `// V8 Ignition Bytecode:
Ldar a0             // Load argument 0 (x) into accumulator
Mul a1, [0]         // Multiply accumulator by argument 1 (y)
Return              // Return value in accumulator`
    },
    {
      step: '05',
      title: 'JIT Machine Code (TurboFan)',
      stage: 'Optimizing Compiler',
      badge: 'Native Assembly',
      desc: 'Once the profiler detects this function is "hot", TurboFan compiles it into raw machine instructions for your CPU.',
      code: `// Native x86-64 Machine Assembly:
mov eax, edi        ; Move parameter 1 into 32-bit register eax
imul eax, esi       ; Multiply by parameter 2 (signed integer multiply)
ret                 ; Return to caller (Instant hardware calculation!)`
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
          <span className="font-bold text-[var(--text-main)]">Concept 03 of 100</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-main)]">
          JavaScript Engine Architecture &amp; Execution
        </h1>

        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          What happens in the millisecond between you saving your JavaScript file and your CPU calculating the result? Modern engines don&apos;t just interpret code line-by-line; they run a multi-stage compilation pipeline that produces machine instructions as fast as compiled C++.
        </p>
      </header>

      {/* =========================================================================
          2. THE ENGINE PIPELINE: 4 KEY STAGES
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The 4-Stage Engine Execution Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-brand-lime">
              Stage 01
            </span>
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Parsing &amp; AST
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Scanner converts characters into tokens. Parser validates grammar and creates an Abstract Syntax Tree.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
              Stage 02
            </span>
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Ignition (Bytecode)
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The interpreter turns AST into compact bytecode. Code starts executing immediately without compilation lag.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
            <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
              Stage 03
            </span>
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Profiler (Type Feedback)
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Monitors which functions run frequently (&quot;hot code&quot;) and logs parameter types to prepare optimization.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
            <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
              Stage 04
            </span>
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              TurboFan (JIT Compiler)
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Compiles hot bytecode directly into native x86/ARM machine code for maximum hardware execution speed.
            </p>
          </div>

        </div>

        {/* ASCII Flowchart */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 overflow-x-auto text-center shadow-xs">
          <div className="text-xs font-mono text-slate-400 mb-2 font-bold uppercase tracking-wider text-left">
            V8 Engine Internal Flowchart:
          </div>
          <pre className="font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed inline-block text-left select-none">
{`┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Source Code │ ──▶ │ Tokens / AST │ ──▶ │ V8 Ignition  │
│  (JS Text)   │     │ (Grammar)    │     │ (Bytecode)   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                                 ▼ Runs immediately!
                                          ┌──────────────┐
                                          │   Profiler   │ (Collects Type Feedback)
                                          └──────┬───────┘
                                                 │
                             Is Code Hot?        │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
               ┌─────────────────┐                               ┌─────────────────┐
               │   V8 TurboFan   │                               │ Continue in     │
               │  (JIT Compiler) │                               │ Bytecode        │
               └────────┬────────┘                               └─────────────────┘
                        │
                        ▼ Machine Code
               ┌─────────────────┐
               │ Native CPU Code │ (Bails out to bytecode if types change!)
               └─────────────────┘`}
          </pre>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE 5-STEP PIPELINE SIMULATOR
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Interactive Engine Transformation Simulator
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          See how a simple JavaScript function <code className="font-mono">multiply(x, y)</code> transforms at every stage inside the engine:
        </p>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {pipelineSteps.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeStep === idx
                  ? 'border-emerald-600 dark:border-brand-lime bg-emerald-50 dark:bg-emerald-950/30 text-[var(--text-main)] font-bold shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <span className="block font-mono text-[11px] text-emerald-700 dark:text-brand-lime">
                Step {s.step}
              </span>
              <span className="block text-xs font-semibold truncate text-[var(--text-main)] mt-0.5">
                {s.title}
              </span>
            </button>
          ))}
        </div>

        {/* Step Viewer Card */}
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime">
                Stage: {pipelineSteps[activeStep].stage}
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)] mt-0.5">
                {pipelineSteps[activeStep].title}
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold border border-zinc-200 dark:border-zinc-700">
              {pipelineSteps[activeStep].badge}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
            {pipelineSteps[activeStep].desc}
          </p>

          <div className="rounded-xl border border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-slate-950 p-4 font-mono text-xs text-zinc-900 dark:text-slate-100 overflow-x-auto shadow-inner max-h-72">
            <pre className="whitespace-pre leading-relaxed">
              <code>{pipelineSteps[activeStep].code}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE FAMOUS REAL-WORLD ENGINES
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Big 3 Modern JavaScript Engines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2 shadow-xs">
            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-brand-lime">
              Google V8
            </span>
            <h3 className="text-base font-bold text-[var(--text-main)]">
              Chrome, Node.js &amp; Deno
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Open-source C++ engine. Uses Ignition for bytecode interpretation and TurboFan for JIT optimization. Powered the 2008 browser speed revolution.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2 shadow-xs">
            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
              JavaScriptCore (Nitro)
            </span>
            <h3 className="text-base font-bold text-[var(--text-main)]">
              Safari, iOS &amp; Bun
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Developed by Apple for WebKit. Uses a 4-tier JIT architecture (LLInt, Baseline, DFG, and FTL JIT) optimized for energy efficiency on mobile chips.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2 shadow-xs">
            <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
              SpiderMonkey
            </span>
            <h3 className="text-base font-bold text-[var(--text-main)]">
              Mozilla Firefox
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The original JavaScript engine created by Brendan Eich in 1995. Completely rewritten in C++ and Rust, featuring the Warp JIT compiler.
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
                Test your understanding on engine execution (one by one):
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
                  <><strong>Perfect Score! 3 / 3 correct.</strong> You understand how V8 turns AST and bytecode into machine code.</>
                ) : (
                  <><strong>Quiz Completed ({correctQuizCount}/{totalQuizQuestions} correct).</strong> Review the questions above to master the JIT pipeline and deopt bailouts.</>
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
          href="/jsviz/topic/javascript-runtime-environments-browser-vs-nodejs"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-mono text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous: Concept 02</span>
        </Link>

        <Link
          href="/jsviz/topic/javascript-syntax-statements-expressions"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-brand-lime dark:text-slate-950 font-mono text-xs font-bold transition-all shadow-xs"
        >
          <span>Next: Concept 04 (Syntax &amp; Expressions)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

export default EngineArchitectureLesson;
