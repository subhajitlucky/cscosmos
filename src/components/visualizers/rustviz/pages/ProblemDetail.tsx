'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { rustProblems, ProblemDifficulty } from '../data/problems';

export function ProblemDetail({ slug }: { slug: string }) {
  const problemIndex = rustProblems.findIndex((p) => p.slug === slug);
  const problem = rustProblems[problemIndex];

  const [copied, setCopied] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);

  if (!problem) {
    notFound();
  }

  const prevProblem = problemIndex > 0 ? rustProblems[problemIndex - 1] : null;
  const nextProblem =
    problemIndex < rustProblems.length - 1 ? rustProblems[problemIndex + 1] : null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(problem.starterCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setConsoleOutput(
      `Compiling [${problem.title}] with rustc 1.85 (x86_64-unknown-linux-gnu)...\n` +
      `⚡ Note: Online WebAssembly compiler & test harness is currently under development.\n` +
      `Full live execution engine will be activated once the concept blueprints are approved.`
    );
  };

  const difficultyColors: Record<ProblemDifficulty, string> = {
    Easy: 'bg-[var(--rust-emerald-light)] text-[var(--rust-emerald)] border-[var(--rust-emerald-border)]',
    Medium: 'bg-[var(--rust-amber-light)] text-[var(--rust-amber)] border-[var(--rust-amber-border)]',
    Hard: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Stepper & Navigation */}
      <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-4">
        <Link
          href="/rustviz/problems"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Problems
        </Link>

        <div className="flex items-center gap-2">
          {prevProblem && (
            <Link
              href={`/rustviz/problems/${prevProblem.slug}`}
              className="px-3 py-1.5 rounded-lg border border-[var(--rust-border)] text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] transition-colors"
            >
              ← #{String(prevProblem.number).padStart(3, '0')}
            </Link>
          )}
          {nextProblem && (
            <Link
              href={`/rustviz/problems/${nextProblem.slug}`}
              className="px-3 py-1.5 rounded-lg border border-[var(--rust-border)] text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] transition-colors"
            >
              #{String(nextProblem.number).padStart(3, '0')} →
            </Link>
          )}
        </div>
      </div>

      {/* LeetCode Split Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        
        {/* Left Column: Problem Description & Requirements (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Header Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[var(--rust-primary)] bg-[var(--rust-primary-light)] px-2.5 py-0.5 rounded-md border border-[var(--rust-primary-border)]">
                Problem #{String(problem.number).padStart(3, '0')}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs font-mono text-[var(--rust-muted)] px-2 py-0.5 rounded-full bg-[var(--rust-surface-2)] border border-[var(--rust-border)]">
                {problem.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--rust-text)]">
              {problem.title}
            </h1>

            {/* Problem Statement */}
            <div className="space-y-3 text-sm text-[var(--rust-text)] leading-relaxed">
              <p>{problem.summary}</p>
              
              <div className="p-3.5 rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-muted)]">
                  Objective &amp; Constraints
                </span>
                <ul className="text-xs space-y-1.5 text-[var(--rust-muted)] list-disc pl-4">
                  <li>Zero unhandled unwraps or panic conditions</li>
                  <li>Target execution time: &lt; {problem.timeEstimate}</li>
                  <li>Historical community acceptance: {problem.acceptanceRate}</li>
                  <li>Idiomatic memory layouts matching modern Rust 2021/2024 idioms</li>
                </ul>
              </div>
            </div>

            {/* Sandbox Notice Banner */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Compiler Integration Roadmap</span>
              </div>
              <p className="leading-relaxed">
                This problem is currently in blueprint template mode. Once the concept foundation is finalized, live in-browser WebAssembly compilation and test assertion runners will be enabled here.
              </p>
            </div>
          </div>

          {/* Bottom Metas */}
          <div className="pt-4 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs text-[var(--rust-muted)] font-mono">
            <span>Estimated: {problem.timeEstimate}</span>
            <span>Acceptance: {problem.acceptanceRate}</span>
          </div>
        </div>

        {/* Right Column: Code Editor & Compiler Output (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] flex flex-col justify-between overflow-hidden">
          
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--rust-border)] bg-[var(--rust-surface-2)]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[var(--rust-primary)]" />
              <span className="text-xs font-mono font-bold text-[var(--rust-text)]">
                solution.rs
              </span>
              <span className="text-[10px] font-mono text-[var(--rust-muted)]">
                (Rust 1.85)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] font-mono text-[var(--rust-muted)] hover:text-[var(--rust-text)] px-2 py-1 rounded border border-[var(--rust-border)] bg-[var(--rust-surface)] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[var(--rust-emerald)]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Starter'}</span>
              </button>

              <button
                onClick={handleRunCode}
                className="flex items-center gap-1 text-xs font-bold text-white bg-[var(--rust-primary)] hover:bg-[var(--rust-primary-hover)] px-3 py-1 rounded-lg transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Code</span>
              </button>
            </div>
          </div>

          {/* Editor Code Body */}
          <div className="flex-1 p-4 bg-[var(--rust-surface)] font-mono text-xs overflow-x-auto">
            <pre className="text-[var(--rust-text)] leading-relaxed">
              <code>{problem.starterCode}</code>
            </pre>
          </div>

          {/* Output / Console Window */}
          <div className="border-t border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--rust-muted)]">
              <Terminal className="w-3.5 h-3.5 text-[var(--rust-primary)]" />
              <span>Console Output</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--rust-surface)] border border-[var(--rust-border-subtle)] font-mono text-[11px] text-[var(--rust-muted)] min-h-[72px] whitespace-pre-line">
              {consoleOutput || 'Click "Run Code" to compile starter code with rustc test suite.'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
