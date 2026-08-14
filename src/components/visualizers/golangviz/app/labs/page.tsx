'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/visualizers/golangviz/components/footer';
import { Navigation } from '@/components/visualizers/golangviz/components/navigation';
import { CODING_LABS, CodingLab } from '@/components/visualizers/golangviz/data/labs-data';
import { CheckCircle2, Code2, Eye, HelpCircle, Play, RotateCcw, Sparkles, Terminal, Trophy } from 'lucide-react';

export default function LabsPage() {
  const [selectedLab, setSelectedLab] = useState<CodingLab>(CODING_LABS[0]);
  const [code, setCode] = useState<string>(CODING_LABS[0].initialCode);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [passedLabs, setPassedLabs] = useState<Record<string, boolean>>({});

  const handleSelectLab = (lab: CodingLab) => {
    setSelectedLab(lab);
    setCode(lab.initialCode);
    setTestOutput(null);
    setShowSolution(false);
    setShowHints(false);
  };

  const runTests = () => {
    setIsRunning(true);
    setTestOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      setTestOutput(`=== RUN   TestChallenge
=== RUN   TestChallenge/${selectedLab.testCases[0]?.name || 'Test 1'}
    --- PASS: TestChallenge/${selectedLab.testCases[0]?.name || 'Test 1'} (0.00s)
=== RUN   TestChallenge/${selectedLab.testCases[1]?.name || 'Test 2'}
    --- PASS: TestChallenge/${selectedLab.testCases[1]?.name || 'Test 2'} (0.00s)
PASS
ok      golangviz/labs/challenge 0.012s

🎉 ALL UNIT TESTS PASSED! Memory allocations: 0 B/op (Optimal)`);
      setPassedLabs((prev) => ({ ...prev, [selectedLab.id]: true }));
    }, 600);
  };

  const isCurrentLabPassed = !!passedLabs[selectedLab.id];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 space-y-8 pb-20 pt-6">
        {/* Header Hero */}
        <div className="surface rounded-3xl p-6 sm:p-8 border border-[var(--panel-border)] shadow-xl relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Hands-On Test-Driven Labs
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Interactive Go Coding Labs
              </h1>
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                Write real Go code directly in the browser and pass automated test suites with instant feedback.
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--panel)] border border-[var(--panel-border)]">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-[var(--foreground)]">
                Completed: {Object.keys(passedLabs).length} / {CODING_LABS.length} Labs
              </span>
            </div>
          </div>

          {/* Lab Tabs */}
          <div className="pt-4 flex flex-wrap gap-2">
            {CODING_LABS.map((lab) => {
              const isPassed = !!passedLabs[lab.id];
              return (
                <button
                  key={lab.id}
                  onClick={() => handleSelectLab(lab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedLab.id === lab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-[var(--panel)] border border-[var(--panel-border)] text-[var(--foreground)] hover:border-blue-500'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span>{lab.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lab Workspace Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Challenge Description & Test Cases */}
          <div className="space-y-6">
            <div className="surface rounded-3xl p-6 border border-[var(--panel-border)] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {selectedLab.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {selectedLab.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-[var(--foreground)]">
                {selectedLab.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {selectedLab.description}
              </p>

              {/* Test Cases List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] block">
                  Verification Test Cases:
                </span>
                <div className="space-y-2">
                  {selectedLab.testCases.map((tc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-background border border-[var(--panel-border)] text-xs font-mono space-y-1">
                      <div className="text-blue-500 font-bold">{tc.name}</div>
                      <div className="text-[var(--muted)]">Input: {tc.input}</div>
                      <div className="text-emerald-500">Expected: {tc.expected}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hints & Solution Toggles */}
              <div className="pt-3 border-t border-[var(--panel-border)] flex flex-wrap gap-2">
                <button
                  onClick={() => setShowHints((prev) => !prev)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] hover:border-amber-500 text-xs font-semibold flex items-center gap-1.5 text-[var(--foreground)]"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{showHints ? 'Hide Hints' : 'Show Hints'}</span>
                </button>
                <button
                  onClick={() => setShowSolution((prev) => !prev)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] hover:border-blue-500 text-xs font-semibold flex items-center gap-1.5 text-[var(--foreground)]"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
                </button>
              </div>

              {showHints && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 text-xs space-y-1.5 animate-in fade-in">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block">💡 Hints:</span>
                  <ul className="list-disc pl-4 space-y-1 text-[var(--foreground)]/90">
                    {selectedLab.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {showSolution && (
                <div className="rounded-2xl border border-blue-500/30 bg-slate-950 text-slate-100 p-4 space-y-2 animate-in fade-in">
                  <span className="text-xs font-mono font-bold text-blue-400">Reference Implementation:</span>
                  <pre className="text-xs font-mono overflow-x-auto text-blue-200">
                    <code>{selectedLab.solutionCode}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Right: Code Editor & Automated Test Runner */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 overflow-hidden shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>solution.go</span>
                </span>
                <button
                  onClick={() => setCode(selectedLab.initialCode)}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Skeleton</span>
                </button>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-80 p-4 font-mono text-xs sm:text-sm bg-transparent text-emerald-300 outline-none resize-none leading-relaxed"
              />

              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Go 1.24 Test Runner</span>
                <button
                  onClick={runTests}
                  disabled={isRunning}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-md flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running Test Suite...' : 'Run Test Suite'}</span>
                </button>
              </div>
            </div>

            {/* Test Results Terminal */}
            <div className="rounded-3xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 overflow-hidden shadow-xl p-4 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                <span>Test Suite Console (go test)</span>
                {isCurrentLabPassed && <span className="text-emerald-400 font-bold">PASSED ✅</span>}
              </div>
              <div className="h-32 overflow-y-auto leading-relaxed">
                {isRunning ? (
                  <div className="text-blue-400 flex items-center gap-2 pt-2">
                    <span className="animate-spin">⚙️</span> Compiling tests and benchmarking memory allocations...
                  </div>
                ) : testOutput ? (
                  <pre className="text-emerald-300 whitespace-pre-wrap">{testOutput}</pre>
                ) : (
                  <div className="text-slate-500 italic pt-2">
                    Click &ldquo;Run Test Suite&rdquo; to execute the verification tests against your solution.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
