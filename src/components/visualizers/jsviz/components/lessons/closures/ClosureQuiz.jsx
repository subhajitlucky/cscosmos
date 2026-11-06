'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  Award,
  ChevronRight,
  ChevronLeft,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '@/context/useTheme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'Core Definition',
    badgeClass: 'text-emerald-700 dark:text-brand-lime bg-emerald-500/10 border-emerald-500/20',
    title: 'What precisely is a Closure according to the ECMAScript specification?',
    code: `// A function bundled with something special...`,
    options: [
      {
        letter: 'A',
        label: 'The combination of a function bundled together with references to its surrounding Lexical Environment.',
        correct: true,
        why: 'Correct! A closure is formed whenever an inner function retains access to variables declared in its enclosing author-time lexical scope via its internal [[Environment]] reference.'
      },
      {
        letter: 'B',
        label: 'A frozen snapshot copy of all global variables taken when an application compiles.',
        correct: false,
        why: 'Closures do not copy values, nor do they freeze snapshots. They retain live references to specific enclosing lexical scope records.'
      },
      {
        letter: 'C',
        label: 'A syntax trick only available when using arrow functions in modern ES2020+.',
        correct: false,
        why: 'Closures have existed since JavaScript 1.0 (1995) across all function forms, long before arrow functions were introduced.'
      },
      {
        letter: 'D',
        label: 'A background web worker thread that executes JavaScript asynchronously.',
        correct: false,
        why: 'Closures are synchronous lexical scoping constructs, completely distinct from Web Workers and concurrency models.'
      }
    ]
  },
  {
    id: 'q2',
    category: 'Call Stack Mechanics',
    badgeClass: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'What happens to the outer function’s Call Stack frame when it finishes executing and returns an inner function?',
    code: `function outer() {\n  let x = 10;\n  return () => x;\n}\nconst fn = outer(); // What happened to outer on the Call Stack?`,
    options: [
      {
        letter: 'A',
        label: 'It remains paused indefinitely on top of the Call Stack until fn() is called.',
        correct: false,
        why: 'The Call Stack strictly follows Last-In First-Out (LIFO). Pausing an outer frame on the stack would freeze the single JavaScript thread and prevent any further execution!'
      },
      {
        letter: 'B',
        label: 'It is completely popped and destroyed from the Call Stack; its Lexical Environment survives on the Heap.',
        correct: true,
        why: 'Correct! Execution context is popped and discarded immediately upon return. However, the Lexical Environment is preserved on the Heap because fn maintains a reachable reference to it.'
      },
      {
        letter: 'C',
        label: 'It gets cloned into localStorage so the browser can reload it later.',
        correct: false,
        why: 'Browser storage APIs like localStorage are completely unrelated to JavaScript runtime execution contexts.'
      },
      {
        letter: 'D',
        label: 'It is converted into a Promise microtask queued in the Event Loop.',
        correct: false,
        why: 'Function returns are synchronous operations; no microtask is created merely by returning a function.'
      }
    ]
  },
  {
    id: 'q3',
    category: 'Binding Semantics',
    badgeClass: 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'Do closures capture copies of variables, or live references to bindings?',
    code: `let count = 1;\nfunction read() { console.log(count); }\ncount = 5;\nread(); // What is logged?`,
    options: [
      {
        letter: 'A',
        label: 'They capture copies of values at function declaration time.',
        correct: false,
        why: 'If closures captured static copies, mutating count to 5 would not affect read(), which is contrary to how JavaScript works.'
      },
      {
        letter: 'B',
        label: 'They maintain live references to the actual variable bindings in the Environment Record.',
        correct: true,
        why: 'Correct! JavaScript closures hold live bindings. Any future mutations to the variable are immediately reflected across all functions referencing that environment.'
      },
      {
        letter: 'C',
        label: 'They capture primitives by copy, but objects by reference.',
        correct: false,
        why: 'This is a common misconception! Closures bind to the IDENTIFIER in the Environment Record, regardless of whether its value is a primitive or an object.'
      },
      {
        letter: 'D',
        label: 'They freeze the entire environment so variables can never be changed.',
        correct: false,
        why: 'Enclosed variables can be freely updated by any function sharing that lexical scope (e.g. counter incrementers).'
      }
    ]
  },
  {
    id: 'q4',
    category: 'Spec Internals',
    badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Which internal ECMAScript slot links a function object to its enclosing lexical environment?',
    code: `// Spec internal slot:\nfunction inner() {}\n// inner.[[???]] = outerEnv;`,
    options: [
      {
        letter: 'A',
        label: '[[Prototype]]',
        correct: false,
        why: '[[Prototype]] governs inheritance and method delegation, not lexical scope lookup.'
      },
      {
        letter: 'B',
        label: '[[Environment]]',
        correct: true,
        why: 'Correct! ECMA-262 specifies that every function object has an internal [[Environment]] slot referencing the Lexical Environment in which it was evaluated.'
      },
      {
        letter: 'C',
        label: '[[ScopeChain]]',
        correct: false,
        why: '[[ScopeChain]] was informal terminology in older drafts (ES3); modern ECMA-262 uses the formal [[Environment]] slot.'
      },
      {
        letter: 'D',
        label: '[[OuterLink]]',
        correct: false,
        why: 'The outer link on an Environment Record is [[OuterEnv]], but on the function object itself it is [[Environment]].'
      }
    ]
  },
  {
    id: 'q5',
    category: 'Multiple Invocations',
    badgeClass: 'text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    title: 'If createCounter() is invoked twice, do the two returned counters share the same count variable?',
    code: `const c1 = createCounter();\nconst c2 = createCounter();\nc1(); // 1\nc2(); // ?`,
    options: [
      {
        letter: 'A',
        label: 'Yes, all closures originating from the same function declaration share one global count.',
        correct: false,
        why: 'Each call to createCounter() spawns a distinct Lexical Environment in memory.'
      },
      {
        letter: 'B',
        label: 'No, every call to createCounter() creates a completely new, independent Lexical Environment Record.',
        correct: true,
        why: 'Correct! Function invocations instantiate brand-new execution environments. c1 and c2 hold references to two distinct memory allocations on the heap.'
      },
      {
        letter: 'C',
        label: 'Yes, unless they are assigned to variables with different names.',
        correct: false,
        why: 'Variable naming in outer scopes has zero bearing on environment allocation.'
      },
      {
        letter: 'D',
        label: 'It depends on whether strict mode ("use strict") is enabled.',
        correct: false,
        why: 'Strict mode does not change the independent allocation of lexical environments.'
      }
    ]
  },
  {
    id: 'q6',
    category: 'Garbage Collection',
    badgeClass: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    title: 'Why does the JavaScript Garbage Collector not collect variables retained by an active closure?',
    code: `// When does memory get freed?`,
    options: [
      {
        letter: 'A',
        label: 'Because the Garbage Collector cannot inspect variables inside functions.',
        correct: false,
        why: 'The GC can inspect all allocated heap objects.'
      },
      {
        letter: 'B',
        label: 'Because a reachability path exists from a GC Root (such as the Global Object) through the function reference.',
        correct: true,
        why: 'Correct! Modern JS engines use Mark-and-Sweep garbage collection. As long as a reference chain exists from a root to the closure, its enclosed environment is reachable and cannot be purged.'
      },
      {
        letter: 'C',
        label: 'Because closures are permanently saved to disk.',
        correct: false,
        why: 'Closures reside exclusively in volatile RAM heap memory.'
      },
      {
        letter: 'D',
        label: 'Because closures run in WebAssembly sandbox memory.',
        correct: false,
        why: 'Closures are native JavaScript constructs, unrelated to Wasm.'
      }
    ]
  },
  {
    id: 'q7',
    category: 'Data Encapsulation',
    badgeClass: 'text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    title: 'How do closures achieve genuine private state in JavaScript objects?',
    code: `function createWallet() {\n  let balance = 100;\n  return { getBalance: () => balance };\n}`,
    options: [
      {
        letter: 'A',
        label: 'By encrypting the object properties using AES-256 in memory.',
        correct: false,
        why: 'No cryptographic encryption occurs; it is purely a scope accessibility boundary.'
      },
      {
        letter: 'B',
        label: 'By keeping the variable in the outer lexical scope so it is never attached as an object property.',
        correct: true,
        why: 'Correct! balance is an identifier in createWallet\'s Lexical Environment, not a property on the returned object. External code cannot access it via wallet.balance or Object.keys(wallet).'
      },
      {
        letter: 'C',
        label: 'By renaming the property with an underscore prefix.',
        correct: false,
        why: 'Underscore prefixes (_balance) are merely naming conventions and remain fully public and readable.'
      },
      {
        letter: 'D',
        label: 'By running the function inside an isolated iframe sandbox.',
        correct: false,
        why: 'Closures do not require iframes; they are fundamental language features.'
      }
    ]
  },
  {
    id: 'q8',
    category: 'Arrow Functions',
    badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'How do Arrow Functions interact with closures compared to traditional function declarations?',
    code: `const obj = {\n  factor: 2,\n  makeMultiplier() {\n    return (x) => x * this.factor;\n  }\n};`,
    options: [
      {
        letter: 'A',
        label: 'Arrow functions cannot form closures because they lack a prototype.',
        correct: false,
        why: 'Arrow functions form closures just like regular functions; their lack of a prototype is unrelated to lexical environment capture.'
      },
      {
        letter: 'B',
        label: 'Arrow functions form closures over both lexical variables AND lexical "this" context.',
        correct: true,
        why: 'Correct! Arrow functions do not define their own "this", "arguments", or "super" bindings; they lexically capture them from their enclosing environment via closure.'
      },
      {
        letter: 'C',
        label: 'Arrow functions only capture const variables, not let variables.',
        correct: false,
        why: 'Arrow functions capture any lexical identifier regardless of whether declared with const, let, var, or function.'
      },
      {
        letter: 'D',
        label: 'Arrow functions clone the entire execution stack.',
        correct: false,
        why: 'No stack cloning occurs.'
      }
    ]
  },
  {
    id: 'q9',
    category: 'Currying & Functional',
    badgeClass: 'text-emerald-700 dark:text-brand-lime bg-emerald-500/10 border-emerald-500/20',
    title: 'Why are closures the foundational building block of Functional Currying?',
    code: `const multiply = a => b => a * b;\nconst double = multiply(2);\ndouble(5); // 10`,
    options: [
      {
        letter: 'A',
        label: 'They allow the first function to store parameter "a" in memory until the second function receives "b".',
        correct: true,
        why: 'Correct! Currying relies entirely on the inner function closing over preceding arguments (like "a") until all arguments have been received and the computation can execute.'
      },
      {
        letter: 'B',
        label: 'They convert synchronous functions into asynchronous Promises.',
        correct: false,
        why: 'Currying has nothing to do with asynchronous microtasks.'
      },
      {
        letter: 'C',
        label: 'They optimize JavaScript mathematical calculations into SIMD vector registers.',
        correct: false,
        why: 'Currying is a syntactic abstraction pattern, not a hardware vectorization technique.'
      },
      {
        letter: 'D',
        label: 'They allow functions to mutate the global Window object.',
        correct: false,
        why: 'Currying emphasizes pure functions without global side effects.'
      }
    ]
  },
  {
    id: 'q10',
    category: 'The Classic Loop Pitfall',
    badgeClass: 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20',
    title: 'Why did "for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0)" print "3, 3, 3"?',
    code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
    options: [
      {
        letter: 'A',
        label: 'Because setTimeout only accepts numbers greater than 3.',
        correct: false,
        why: 'setTimeout takes delay in milliseconds; the delay value does not dictate the logged value.'
      },
      {
        letter: 'B',
        label: 'Because "var" is function-scoped; all 3 callbacks shared the exact same single "i" binding which reached 3 before the callbacks executed.',
        correct: true,
        why: 'Correct! Because "var" is function-scoped, only ONE binding of "i" existed in memory. By the time the event loop flushed the timers, the synchronous loop had already concluded and set "i" to 3.'
      },
      {
        letter: 'C',
        label: 'Because JavaScript event loop reverses the execution order of timers.',
        correct: false,
        why: 'Timers with equal delay run in FIFO insertion order.'
      },
      {
        letter: 'D',
        label: 'Because console.log caches its previous argument.',
        correct: false,
        why: 'console.log evaluates whatever argument is passed to it dynamically.'
      }
    ]
  }
];

export default function ClosureQuiz() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted 
    ? (resolvedTheme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')))
    : resolvedTheme === 'dark';

  const syntaxTheme = isDark ? vscDarkPlus : vs;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] !== undefined && q.options[selectedAnswers[q.id]]?.correct
  ).length;

  const handleSelect = (optionIndex) => {
    if (selectedAnswers[currentQ.id] !== undefined) return; // Prevent changing answer

    const updated = {
      ...selectedAnswers,
      [currentQ.id]: optionIndex
    };
    setSelectedAnswers(updated);

    // If correct on last question, fire celebratory confetti
    if (
      Object.keys(updated).length === totalQuestions &&
      currentQ.options[optionIndex]?.correct
    ) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowSummary(false);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden shadow-sm">
      
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
                Mastery Verification
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                10-Point Closure Knowledge Check
              </h3>
            </div>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
            Score: {correctCount} / {answeredCount}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5">
        <div 
          className="bg-emerald-500 dark:bg-brand-lime h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {showSummary ? (
        /* Summary Screen */
        <div className="p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-brand-lime shadow-inner">
            <Award size={32} />
          </div>

          <div>
            <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Assessment Completed!
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              You scored <span className="font-bold text-emerald-600 dark:text-brand-lime">{correctCount}</span> out of <span className="font-bold">{totalQuestions}</span> questions ({Math.round((correctCount / totalQuestions) * 100)}%).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 max-w-md mx-auto text-xs font-sans text-zinc-600 dark:text-zinc-400">
            {correctCount >= 8 ? (
              <span className="text-emerald-700 dark:text-brand-lime font-bold">
                Outstanding! You have mastered JavaScript closures, lexical environments, and memory mechanics at a senior engineering level.
              </span>
            ) : (
              <span>
                Good effort! Review the Interactive Visualizer and Common Mistakes sections above to solidify edge-case intuition.
              </span>
            )}
          </div>

          <button
            onClick={handleRestart}
            className="neo-btn px-6 py-2.5 text-xs font-mono font-bold inline-flex items-center gap-2"
          >
            <RotateCcw size={14} />
            <span>RETAKE KNOWLEDGE CHECK</span>
          </button>
        </div>
      ) : (
        /* Question Content */
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Question metadata */}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${currentQ.badgeClass}`}>
              {currentQ.category}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
            {currentQ.title}
          </h4>

          {/* Mini code snippet */}
          {currentQ.code && (
            <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 overflow-x-auto text-xs ${
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
                {currentQ.code}
              </SyntaxHighlighter>
            </div>
          )}

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              const hasAnswered = selectedAnswers[currentQ.id] !== undefined;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 shadow-sm'
                        : 'border-red-500/60 bg-red-500/10 text-red-950 dark:text-red-100 shadow-sm'
                      : hasAnswered && opt.correct
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500'
                  }`}>
                    {opt.letter}
                  </span>

                  <div className="flex-1 space-y-1">
                    <div className="font-medium leading-relaxed font-sans">
                      {opt.label}
                    </div>

                    {/* Explanatory rationale on click */}
                    {hasAnswered && (isSelected || opt.correct) && (
                      <div className={`text-xs mt-2 pt-2 border-t font-sans leading-relaxed ${
                        opt.correct 
                          ? 'border-emerald-500/20 text-emerald-800 dark:text-brand-lime' 
                          : 'border-red-500/20 text-red-700 dark:text-red-300'
                      }`}>
                        {opt.why}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-100 dark:hover:bg-zinc-700/60 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft size={15} />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
              className="p-2 px-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-brand-lime disabled:opacity-30 disabled:pointer-events-none text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ChevronRight size={15} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
