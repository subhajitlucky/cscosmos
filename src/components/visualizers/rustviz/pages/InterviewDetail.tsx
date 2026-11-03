'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  Layers, 
  Cpu, 
  Terminal,
  AlertCircle
} from 'lucide-react';
import { 
  rustInterviewQuestions, 
  InterviewDifficulty 
} from '../data/interview';

export function InterviewDetail({ slug }: { slug: string }) {
  const questionIndex = rustInterviewQuestions.findIndex((q) => q.slug === slug);
  const question = rustInterviewQuestions[questionIndex];

  if (!question) {
    notFound();
  }

  const prevQuestion = questionIndex > 0 ? rustInterviewQuestions[questionIndex - 1] : null;
  const nextQuestion =
    questionIndex < rustInterviewQuestions.length - 1
      ? rustInterviewQuestions[questionIndex + 1]
      : null;

  const difficultyColors: Record<InterviewDifficulty, string> = {
    Junior: 'bg-[var(--rust-emerald-light)] text-[var(--rust-emerald)] border-[var(--rust-emerald-border)]',
    'Mid-Level': 'bg-[var(--rust-cyan-light)] text-[var(--rust-cyan)] border-[var(--rust-cyan-border)]',
    Senior: 'bg-[var(--rust-amber-light)] text-[var(--rust-amber)] border-[var(--rust-amber-border)]',
    Staff: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  const frequencyBadges = {
    Essential: 'bg-red-500/10 text-red-500 border border-red-500/20',
    High: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    Common: 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Stepper & Navigation */}
      <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-4">
        <Link
          href="/rustviz/interview"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Interview Questions
        </Link>

        <div className="flex items-center gap-2">
          {prevQuestion && (
            <Link
              href={`/rustviz/interview/${prevQuestion.slug}`}
              className="px-3 py-1.5 rounded-lg border border-[var(--rust-border)] text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] transition-colors"
            >
              ← Q#{String(prevQuestion.number).padStart(3, '0')}
            </Link>
          )}
          {nextQuestion && (
            <Link
              href={`/rustviz/interview/${nextQuestion.slug}`}
              className="px-3 py-1.5 rounded-lg border border-[var(--rust-border)] text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] transition-colors"
            >
              Q#{String(nextQuestion.number).padStart(3, '0')} →
            </Link>
          )}
        </div>
      </div>

      {/* Main Question Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-[var(--rust-primary)] bg-[var(--rust-primary-light)] px-2.5 py-0.5 rounded-md border border-[var(--rust-primary-border)]">
            Question #{String(question.number).padStart(3, '0')}
          </span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${frequencyBadges[question.frequency]}`}>
            {question.frequency} Frequency
          </span>
          <span className="text-xs font-mono text-[var(--rust-muted)] px-2.5 py-0.5 rounded-full bg-[var(--rust-surface-2)] border border-[var(--rust-border)]">
            {question.category}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--rust-text)] leading-tight">
          {question.title}
        </h1>

        <p className="text-sm text-[var(--rust-muted)] leading-relaxed">
          {question.summary}
        </p>
      </div>

      {/* Roadmap Notification Banner */}
      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Interview Answer Blueprint • Template Mode</span>
        </div>
        <p className="leading-relaxed">
          This question is currently cataloged in the 100-question curriculum roadmap. Below is the structured explanation blueprint and ultra-simple answer framework that will be fully elaborated once we finalize the core 100 concepts.
        </p>
      </div>

      {/* Structured Blueprint Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Why Interviewers Ask This */}
        <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
          <div className="flex items-center gap-2 text-[var(--rust-primary)]">
            <Lightbulb className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              1. What The Interviewer Is Evaluating
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--rust-text)] leading-relaxed">
            Interviewers use this question to assess whether you truly understand Rust&apos;s underlying memory and ownership invariants, or if you are simply memorizing syntax. Specifically, they test your ability to connect compile-time rules to actual machine hardware execution (stack pointer movement, heap allocations, and zero-overhead guarantees).
          </p>
        </div>

        {/* Section 2: Step-by-Step Ultra Simplest Breakdown */}
        <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-4">
          <div className="flex items-center gap-2 text-[var(--rust-primary)]">
            <Layers className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              2. Step-by-Step Clear Breakdown
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[var(--rust-primary)] uppercase">
                Step 1: The Core Law
              </span>
              <h4 className="text-xs font-bold text-[var(--rust-text)]">Mental Invariant</h4>
              <p className="text-[11px] text-[var(--rust-muted)] leading-relaxed">
                Single owner, affine type transfers, or strict aliasing exclusivity (&amp;T vs &amp;mut T).
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[var(--rust-primary)] uppercase">
                Step 2: Hardware Level
              </span>
              <h4 className="text-xs font-bold text-[var(--rust-text)]">Machine Execution</h4>
              <p className="text-[11px] text-[var(--rust-muted)] leading-relaxed">
                Zero garbage collection stop-the-world pauses, predictable cache locality, and deterministic drop destructors.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[var(--rust-primary)] uppercase">
                Step 3: Industry Contrast
              </span>
              <h4 className="text-xs font-bold text-[var(--rust-text)]">Why Others Fail</h4>
              <p className="text-[11px] text-[var(--rust-muted)] leading-relaxed">
                Prevents C/C++ memory corruption (UAF, double-free) without paying the throughput tax of Java/Go runtimes.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Rapid 30-Second Elevator Pitch */}
        <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
          <div className="flex items-center gap-2 text-[var(--rust-emerald)]">
            <CheckCircle2 className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--rust-text)]">
              3. Rapid 30-Second Interview Answer (Elevator Pitch)
            </h2>
          </div>
          <div className="p-4 rounded-xl bg-[var(--rust-surface-2)] border-l-4 border-[var(--rust-primary)] text-xs sm:text-sm text-[var(--rust-text)] italic leading-relaxed">
            &ldquo;In Rust, this is governed entirely at compile time. The compiler proves safety through affine move semantics and ownership rules, guaranteeing zero runtime garbage collector overhead while mathematically preventing data races, double-frees, and use-after-free bugs.&rdquo;
          </div>
        </div>

      </div>

      {/* Bottom Stepper */}
      <div className="pt-6 border-t border-[var(--rust-border)] flex items-center justify-between">
        {prevQuestion ? (
          <Link
            href={`/rustviz/interview/${prevQuestion.slug}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--rust-primary)] hover:underline"
          >
            ← Previous: {prevQuestion.title}
          </Link>
        ) : <div />}

        {nextQuestion && (
          <Link
            href={`/rustviz/interview/${nextQuestion.slug}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--rust-primary)] hover:underline"
          >
            Next: {nextQuestion.title} →
          </Link>
        )}
      </div>

    </div>
  );
}
