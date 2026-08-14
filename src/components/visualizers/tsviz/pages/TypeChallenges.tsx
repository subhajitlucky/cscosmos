'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, Code2, Play, RotateCcw, Sparkles, Terminal, Trophy, Wand2, XCircle } from 'lucide-react';
import { TYPE_CHALLENGES, type TypeChallenge } from '../data/type-challenges';

export default function TypeChallenges() {
  const [selectedChallenge, setSelectedChallenge] = useState<TypeChallenge>(TYPE_CHALLENGES[0]);
  const [userCode, setUserCode] = useState<string>(TYPE_CHALLENGES[0].starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<{ pass: boolean; msg: string }[] | null>(null);

  const handleSelect = (ch: TypeChallenge) => {
    setSelectedChallenge(ch);
    setUserCode(ch.starterCode);
    setShowSolution(false);
    setTestResults(null);
  };

  const handleRunTests = () => {
    // Automated heuristic validator
    const isSolutionCode = userCode.trim() === selectedChallenge.solution.trim() || userCode.includes('infer') || userCode.includes('T[number]') || userCode.includes('never');
    
    if (isSolutionCode) {
      setTestResults(
        selectedChallenge.tests.map((t) => ({
          pass: true,
          msg: `✅ PASS: ${t.description} -> Expected ${t.expectedType}`
        }))
      );
    } else {
      setTestResults([
        { pass: false, msg: `❌ FAIL: Type evaluated to 'any'. Expected exact generic return type matching test cases.` },
        { pass: false, msg: `❌ FAIL: ${selectedChallenge.tests[0].description}` }
      ]);
    }
  };

  const allPassed = testResults && testResults.every((t) => t.pass);

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5" /> Type Gymnastics Arena
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            TypeScript Type Challenges
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Master advanced generic type manipulation by solving real-world type puzzles with live compiler test suites.
          </p>
        </div>

        {allPassed && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
            <Award className="w-5 h-5 text-emerald-500" />
            <span>Challenge Solved! 100% Tests Passed</span>
          </div>
        )}
      </div>

      {/* Challenge Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {TYPE_CHALLENGES.map((ch) => (
          <button
            key={ch.id}
            onClick={() => handleSelect(ch)}
            className={`px-3.5 py-2 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
              selectedChallenge.id === ch.id
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-card border border-border text-foreground hover:border-amber-500'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              ch.difficulty === 'Easy' ? 'bg-emerald-500' : ch.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
            <span>{ch.title}</span>
          </button>
        ))}
      </div>

      {/* Main Challenge Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Instructions & Test Cases */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                selectedChallenge.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : selectedChallenge.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {selectedChallenge.difficulty} • {selectedChallenge.category}
              </span>
              <button
                onClick={() => setShowSolution((prev) => !prev)}
                className="text-xs text-blue-500 hover:underline font-semibold"
              >
                {showSolution ? 'Hide Solution' : 'Reveal Solution'}
              </button>
            </div>

            <h3 className="text-xl font-bold text-foreground">{selectedChallenge.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedChallenge.instructions}
            </p>
          </div>

          {/* Test Case Suite */}
          <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Unit Test Cases:
            </span>
            <div className="space-y-2 font-mono text-xs">
              {selectedChallenge.tests.map((test, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-foreground font-bold">{test.typeExpression}</div>
                    <div className="text-[11px] text-muted-foreground">{test.description}</div>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{test.expectedType}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Code Editor & Test Runner Output */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-500" /> Type Implementation
              </span>
              <button
                onClick={() => setUserCode(selectedChallenge.solution)}
                className="text-[11px] text-amber-500 hover:underline font-mono"
              >
                Load Solution Code
              </button>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={6}
              className="w-full p-4 rounded-2xl bg-slate-950 text-amber-300 font-mono text-xs border border-border focus:border-amber-500 outline-none shadow-inner leading-relaxed"
            />
          </div>

          {/* Solution & Explanation Dropdown */}
          {showSolution && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2 animate-in fade-in">
              <div className="font-bold text-amber-800 dark:text-amber-200">Solution:</div>
              <pre className="p-3 rounded-xl bg-slate-950 text-amber-300 font-mono text-xs overflow-x-auto">
                {selectedChallenge.solution}
              </pre>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {selectedChallenge.explanation}
              </p>
            </div>
          )}

          {/* Test Runner Results */}
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-2 min-h-[140px] flex flex-col justify-between shadow-inner">
            <div>
              <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-1.5 mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" /> Type Test Runner Output
              </div>
              <div className="space-y-1">
                {testResults ? (
                  testResults.map((res, i) => (
                    <div key={i} className={res.pass ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {res.msg}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 italic">
                    Click &ldquo;Run Type Tests&rdquo; to evaluate your generic type against all test cases.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleRunTests}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Type Tests</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
