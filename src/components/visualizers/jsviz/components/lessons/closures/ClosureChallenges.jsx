'use client';

import React, { useState } from 'react';
import { 
  Award, 
  HelpCircle, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Lightbulb, 
  ChevronRight, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CHALLENGES = [
  {
    id: 'ch-1',
    level: 'Level 1 · Beginner',
    difficultyBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border-emerald-500/20',
    title: 'Multiple Invocations & Shadowing',
    question: 'What will be logged to the console when this script runs?',
    code: `function init(x) {
  return function(y) {
    return function(z) {
      return x + y + z;
    };
  };
}

const addFive = init(5);
const addFiveAndTen = addFive(10);

console.log(addFiveAndTen(2));
console.log(addFive(20)(3));`,
    options: [
      { text: '17 and 28', correct: true },
      { text: 'NaN and NaN', correct: false },
      { text: '17 and TypeError: addFive(...) is not a function', correct: false },
      { text: 'undefined and 28', correct: false }
    ],
    hint: 'Each nested function call returns the next function in the chain, maintaining access to all outer parameters (x and y) via their [[Environment]] links.',
    explanation: 'addFive holds x = 5. addFiveAndTen holds x = 5 and y = 10. Calling addFiveAndTen(2) evaluates 5 + 10 + 2 = 17. Then calling addFive(20) returns a fresh function where x = 5 and y = 20; calling that with (3) evaluates 5 + 20 + 3 = 28.'
  },
  {
    id: 'ch-2',
    level: 'Level 2 · Intermediate',
    difficultyBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    title: 'Object Methods Sharing Closed State',
    question: 'What will be printed by the two console.log calls?',
    code: `function createAccount() {
  let balance = 100;
  
  function adjust(amount) {
    balance += amount;
  }

  return {
    deposit: (val) => adjust(val),
    withdraw: (val) => adjust(-val),
    get: () => balance
  };
}

const acc1 = createAccount();
const acc2 = createAccount();

acc1.deposit(50);
acc2.withdraw(20);

console.log(acc1.get());
console.log(acc2.get());`,
    options: [
      { text: '150 and 80', correct: true },
      { text: '130 and 130', correct: false },
      { text: 'undefined and undefined', correct: false },
      { text: '100 and 100', correct: false }
    ],
    hint: 'Every invocation of createAccount() creates a brand new, isolated Lexical Environment Record on the heap.',
    explanation: 'Calling createAccount() twice allocates two distinct Lexical Environment records on the heap. acc1 modifies its own balance (100 + 50 = 150), while acc2 modifies its separate balance (100 - 20 = 80). The instances are completely decoupled.'
  },
  {
    id: 'ch-3',
    level: 'Level 3 · Advanced',
    difficultyBadge: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    title: 'The Loop Trap with Mixed Scoping',
    question: 'What exact numbers will be output in sequence by this mixed loop?',
    code: `const fns = [];

for (var i = 0; i < 3; i++) {
  let j = i * 2;
  fns.push(() => [i, j]);
}

const results = fns.map(fn => fn());
console.log(JSON.stringify(results));`,
    options: [
      { text: '[[3,0],[3,2],[3,4]]', correct: true },
      { text: '[[0,0],[1,2],[2,4]]', correct: false },
      { text: '[[3,4],[3,4],[3,4]]', correct: false },
      { text: '[[2,0],[2,2],[2,4]]', correct: false }
    ],
    hint: 'Notice "i" is declared with var (function/global scope) while "j" is declared with let (block-scoped inside each loop body)!',
    explanation: '"i" is declared with var, so all callbacks share the single global "i" binding which ends at 3. But "j" is declared with let inside the loop body, so each iteration creates a new block environment binding for "j" (0, 2, 4). When evaluated, i is always 3, while j is 0, 2, and 4 respectively!'
  }
];

export default function ClosureChallenges() {
  const [selectedChallenge, setSelectedChallenge] = useState(CHALLENGES[0]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [consoleResult, setConsoleResult] = useState(null);

  const currentAnswer = userAnswers[selectedChallenge.id];

  const handleSelectOption = (idx) => {
    setUserAnswers({
      ...userAnswers,
      [selectedChallenge.id]: idx
    });
  };

  const runCodeEmpirically = () => {
    const logs = [];
    const origLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    };

    try {
      const runner = new Function('console', `
        "use strict";
        try {
          ${selectedChallenge.code}
        } catch(e) {
          console.log("Error: " + e.message);
        }
      `);
      runner(console);
      setConsoleResult(logs);
    } catch (err) {
      setConsoleResult([err.message]);
    } finally {
      console.log = origLog;
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden shadow-sm">
      
      {/* Top Header */}
      <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
              <Award size={18} />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                Staff Engineer Interview Scenarios
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Technical Interview Challenges
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            3 Tiers · Output Prediction
          </span>
        </div>
      </div>

      {/* Difficulty Switcher Tabs */}
      <div className="px-5 pt-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center gap-2 overflow-x-auto">
        {CHALLENGES.map((ch) => {
          const isSelected = selectedChallenge.id === ch.id;
          const isSolved = userAnswers[ch.id] !== undefined && ch.options[userAnswers[ch.id]]?.correct;
          return (
            <button
              key={ch.id}
              onClick={() => {
                setSelectedChallenge(ch);
                setShowHint(false);
                setShowExplanation(false);
                setConsoleResult(null);
              }}
              className={`pb-3 px-3 text-xs font-mono font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                isSelected
                  ? 'border-purple-500 text-purple-700 dark:text-purple-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span>{ch.level}</span>
              {isSolved && <CheckCircle2 size={13} className="text-emerald-500" />}
            </button>
          );
        })}
      </div>

      {/* Challenge Workspace */}
      <div className="p-5 sm:p-6 space-y-5">
        
        {/* Title & Prompt */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${selectedChallenge.difficultyBadge}`}>
              {selectedChallenge.level}
            </span>
            <span className="text-xs font-mono text-zinc-400">Challenge {selectedChallenge.id}</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {selectedChallenge.title}
          </h4>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
            {selectedChallenge.question}
          </p>
        </div>

        {/* Code Block with Sandbox Run Trigger */}
        <div className="rounded-xl border border-zinc-800 bg-[#0c1017] overflow-hidden">
          <div className="p-2.5 px-4 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>interview_code.js</span>
            <button
              onClick={runCodeEmpirically}
              className="p-1 px-2.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition-all flex items-center gap-1.5 text-[11px] font-bold"
            >
              <Play size={11} />
              <span>Verify in Engine</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-200 leading-relaxed overflow-x-auto bg-[#090d16]">
            <code>{selectedChallenge.code}</code>
          </pre>

          {/* Sandbox Output if user ran it */}
          {consoleResult && (
            <div className="border-t border-zinc-800 p-3 bg-zinc-950 font-mono text-xs text-purple-300">
              <span className="text-zinc-500 text-[10px] block mb-1">Engine Actual Output:</span>
              {consoleResult.map((line, i) => (
                <div key={i} className="text-emerald-400">&gt; {line}</div>
              ))}
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Select Expected Output:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedChallenge.options.map((opt, idx) => {
              const isSelected = currentAnswer === idx;
              const hasAnswered = currentAnswer !== undefined;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 shadow-sm'
                        : 'border-red-500/60 bg-red-500/10 text-red-950 dark:text-red-200 shadow-sm'
                      : hasAnswered && opt.correct
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span className="font-mono">{opt.text}</span>
                  {isSelected && (
                    opt.correct 
                      ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      : <XCircle size={16} className="text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls: Hint & Explanation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="p-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb size={13} className="text-amber-500" />
              <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="p-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle size={13} className="text-purple-500" />
              <span>{showExplanation ? 'Hide Breakdown' : 'Show Detailed Breakdown'}</span>
            </button>
          </div>

          {currentAnswer !== undefined && (
            <div className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
              selectedChallenge.options[currentAnswer]?.correct ? 'text-emerald-600 dark:text-brand-lime' : 'text-red-600 dark:text-red-400'
            }`}>
              {selectedChallenge.options[currentAnswer]?.correct ? (
                <>
                  <CheckCircle2 size={14} /> Correct Answer!
                </>
              ) : (
                <>
                  <XCircle size={14} /> Incorrect — Try again or inspect explanation.
                </>
              )}
            </div>
          )}
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 text-xs font-sans text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Lightbulb size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed"><strong>Interview Hint:</strong> {selectedChallenge.hint}</p>
          </div>
        )}

        {/* Explanation Box */}
        {showExplanation && (
          <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/20 text-xs font-sans text-zinc-700 dark:text-zinc-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold font-mono text-purple-700 dark:text-purple-400 uppercase text-[11px]">
              <Sparkles size={13} />
              Technical Execution Walkthrough
            </div>
            <p className="leading-relaxed">
              {selectedChallenge.explanation}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
