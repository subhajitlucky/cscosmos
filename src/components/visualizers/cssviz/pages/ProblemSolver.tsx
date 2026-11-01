'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Lightbulb,
  Check,
  Code2,
  Eye,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Editor from '@monaco-editor/react';
import { cssProblems, type CssProblem } from '../data/problems';
import { cn } from '../utils/cn';

interface ProblemSolverProps {
  problemId: string | number;
}

export default function ProblemSolver({ problemId }: ProblemSolverProps) {
  const router = useRouter();
  const idNumber = Number(problemId);
  const problem: CssProblem | undefined = cssProblems.find((p) => p.id === idNumber);

  const [code, setCode] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ [testId: string]: boolean }>({});
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (problem) {
      setCode(problem.initialCode || '');
      setShowHint(false);
      setShowSolution(false);
      setHasEvaluated(false);
      setIsSuccess(false);

      // Initial test check
      const initialResults: { [testId: string]: boolean } = {};
      problem.testCases.forEach((t) => {
        initialResults[t.id] = t.check(problem.initialCode || '');
      });
      setTestResults(initialResults);
    }
  }, [problem]);

  if (!problem) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Challenge Not Found</h2>
        <p className="text-muted-text text-sm">
          The requested CSS challenge does not exist (ID: {problemId}).
        </p>
        <Link
          href="/fullstack/css-cosmos/problems"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-4 py-2 text-xs font-bold transition-all shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Problem Arena</span>
        </Link>
      </div>
    );
  }

  const runEvaluation = () => {
    setHasEvaluated(true);
    const results: { [testId: string]: boolean } = {};
    let allPassed = true;

    problem.testCases.forEach((t) => {
      const passed = t.check(code);
      results[t.id] = passed;
      if (!passed) allPassed = false;
    });

    setTestResults(results);
    setIsSuccess(allPassed);

    if (allPassed) {
      try {
        const stored = localStorage.getItem('cscosmos_solved_css_problems');
        const solvedList: number[] = stored ? JSON.parse(stored) : [];
        if (!solvedList.includes(problem.id)) {
          solvedList.push(problem.id);
          localStorage.setItem('cscosmos_solved_css_problems', JSON.stringify(solvedList));
        }
      } catch {
        // Ignore storage error
      }

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const resetCode = () => {
    setCode(problem.initialCode);
    setHasEvaluated(false);
    setIsSuccess(false);
  };

  const prevProblem = cssProblems.find((p) => p.id === problem.id - 1);
  const nextProblem = cssProblems.find((p) => p.id === problem.id + 1);

  // Synthesized HTML preview document
  const previewHtml = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      min-height: 100vh;
    }
    ${code}
  </style>
</head>
<body>
  ${problem.targetHtml}
</body>
</html>`;
  }, [code, problem.targetHtml]);

  return (
    <div className="max-w-7xl mx-auto space-y-4 py-3">
      {/* Navigation Topbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/fullstack/css-cosmos/problems"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Challenges</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
              #{String(problem.id).padStart(2, '0')}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {problem.title}
            </h1>
            <span
              className={cn(
                'text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase',
                problem.difficulty === 'Easy' && 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800/50',
                problem.difficulty === 'Medium' && 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/50 dark:border-amber-800/50',
                problem.difficulty === 'Hard' && 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/50 dark:border-rose-800/50'
              )}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {prevProblem && (
            <Link
              href={`/fullstack/css-cosmos/problems/${prevProblem.id}`}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Previous Problem"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Prev</span>
            </Link>
          )}

          {nextProblem && (
            <Link
              href={`/fullstack/css-cosmos/problems/${nextProblem.id}`}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Next Problem"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}

          <button
            onClick={resetCode}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Reset code to initial state"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={runEvaluation}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold px-4 py-1.5 text-xs transition-all shadow-xs"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run Tests</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Editor/Details, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (6 cols): Problem Description, Tests, Code Editor */}
        <div className="lg:col-span-6 space-y-4">
          {/* Problem Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                Category: {problem.category}
              </span>
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                {problem.description}
              </p>
            </div>

            {/* Target HTML snippet notice */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                Target HTML in preview:
              </span>
              <pre className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto">
                {problem.targetHtml}
              </pre>
            </div>

            {/* Test Criteria List */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                Verification Criteria:
              </span>
              <div className="space-y-1.5">
                {problem.testCases.map((tc) => {
                  const passed = testResults[tc.id];
                  return (
                    <div
                      key={tc.id}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg text-xs font-mono border transition-colors',
                        hasEvaluated
                          ? passed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                          : 'bg-slate-100/60 dark:bg-slate-900/60 border-border text-muted-text'
                      )}
                    >
                      {hasEvaluated ? (
                        passed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                        )
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-muted-text/50 shrink-0" />
                      )}
                      <span>{tc.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success Banner */}
            {hasEvaluated && isSuccess && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Check className="h-4 w-4" />
                  <span>Challenge Complete! All criteria passed.</span>
                </div>
                {nextProblem && (
                  <Link
                    href={`/fullstack/css-cosmos/problems/${nextProblem.id}`}
                    className="inline-flex items-center gap-1 rounded bg-emerald-600 text-white px-2.5 py-1 font-bold hover:bg-emerald-500 transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="rounded-xl border border-border bg-[#1e1e1e] overflow-hidden shadow-sm">
            <div className="h-9 bg-[#18181b] border-b border-zinc-800 flex items-center justify-between px-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-bold text-zinc-200">styles.css</span>
              </div>
              <span className="text-[11px] text-zinc-500">Live Evaluation</span>
            </div>

            <div className="h-[280px] sm:h-[320px]">
              <Editor
                height="100%"
                defaultLanguage="css"
                language="css"
                value={code}
                onChange={(val) => setCode(val || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 12 },
                  tabSize: 2,
                }}
              />
            </div>
          </div>

          {/* Hint & Solution Collapsibles */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1.5 text-muted-text hover:text-slate-900 dark:hover:text-white font-mono"
              >
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
              </button>

              <span className="text-border">|</span>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-mono"
              >
                <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>{showSolution ? 'Hide Solution' : 'Reveal Solution'}</span>
              </button>
            </div>

            {showHint && (
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                <span className="font-bold block font-mono uppercase tracking-wider text-[10px]">
                  Hint:
                </span>
                <p>{problem.hint}</p>
              </div>
            )}

            {showSolution && (
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs space-y-1">
                <span className="font-bold block font-mono uppercase tracking-wider text-[10px] text-amber-600 dark:text-amber-400">
                  Working Solution:
                </span>
                <pre className="font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200 p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  {problem.solution}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (6 cols): Live Preview Sandbox */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
            <div className="h-9 bg-slate-100 dark:bg-slate-900 border-b border-border flex items-center justify-between px-4 text-xs">
              <div className="flex items-center gap-2 text-muted-text font-mono font-medium">
                <Eye className="h-3.5 w-3.5" />
                <span className="text-slate-800 dark:text-slate-200 font-bold">Live Browser Output</span>
              </div>
              <span className="text-[10px] font-mono text-muted-text bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                Sandboxed Preview
              </span>
            </div>

            <div className="h-[460px] sm:h-[520px] bg-white">
              <iframe
                title="CSS Preview"
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
