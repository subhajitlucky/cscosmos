'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { getAdjacentOSProblems, getOSProblem } from '../data/problems';
import { getOSChapter } from '../data/curriculum';
import { useOSProgress } from '../lib/progress';
import { useOSBasePath } from '../components/OSShell';

export function ProblemDetail({ problemId }: { problemId: string }) {
  const basePath = useOSBasePath();
  const problem = getOSProblem(problemId);
  const { previous, next } = getAdjacentOSProblems(problemId);
  const { progress, markProblemSolved } = useOSProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  if (!problem) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-mono text-sm font-bold" style={{ color: 'var(--os-danger)' }}>
          PROBLEM_NOT_FOUND
        </p>
        <Link href={`${basePath}/problems`} className="osviz-link text-sm font-semibold">
          Back to the practice arena
        </Link>
      </div>
    );
  }

  const chapter = getOSChapter(problem.chapterId);
  const answered = selected !== null;
  const correct = selected === problem.answer;
  const solved = progress.solvedProblems.includes(problem.id);

  const choose = (index: number) => {
    if (answered) return;
    setSelected(index);
    if (index === problem.answer) markProblemSolved(problem.id);
  };

  const reset = () => {
    setSelected(null);
    setShowHint(false);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--os-border)' }}>
        <div className="flex items-center gap-3">
          <Link
            href={`${basePath}/problems`}
            className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold"
            style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)', backgroundColor: 'var(--os-surface)' }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Arena
          </Link>
          {chapter && (
            <Link href={`${basePath}/learn/${chapter.id}`} className="osviz-link font-mono text-[10px] font-bold uppercase tracking-wider">
              {chapter.title}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {previous && (
            <Link
              href={`${basePath}/problems/${previous.id}`}
              className="rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-bold"
              style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}
            >
              ← {String(previous.number).padStart(2, '0')}
            </Link>
          )}
          {next && (
            <Link
              href={`${basePath}/problems/${next.id}`}
              className="rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-bold"
              style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}
            >
              {String(next.number).padStart(2, '0')} →
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold" style={{ borderColor: 'var(--os-primary)', color: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)' }}>
                DRILL {String(problem.number).padStart(2, '0')}
              </span>
              <span className="rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold" style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}>
                {problem.difficulty}
              </span>
              {solved && (
                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold" style={{ borderColor: 'var(--os-ok)', color: 'var(--os-ok)', backgroundColor: 'var(--os-ok-soft)' }}>
                  <CheckCircle2 className="h-3 w-3" /> solved
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black tracking-tight">{problem.title}</h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--os-muted)' }}>
              {problem.prompt}
            </p>

            {problem.context && (
              <div className="mt-4 rounded-xl border p-3" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
                <div className="mb-1 font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                  scenario
                </div>
                <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed" style={{ color: 'var(--os-text)' }}>
                  {problem.context}
                </pre>
              </div>
            )}
          </div>

          <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--os-border-strong)', backgroundColor: 'var(--os-surface)' }}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold">Choose an answer</h2>
              {answered && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold"
                  style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}
                >
                  <RotateCcw className="h-3 w-3" /> retry
                </button>
              )}
            </div>

            <div className="space-y-2">
              {problem.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrect = answered && index === problem.answer;
                const isWrong = answered && isSelected && !correct;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(index)}
                    disabled={answered}
                    className="flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default"
                    style={{
                      borderColor: isCorrect ? 'var(--os-ok)' : isWrong ? 'var(--os-danger)' : isSelected ? 'var(--os-primary)' : 'var(--os-border)',
                      backgroundColor: isCorrect ? 'var(--os-ok-soft)' : isWrong ? 'var(--os-danger-soft)' : isSelected ? 'var(--os-primary-soft)' : 'var(--os-surface-2)',
                      color: isCorrect ? 'var(--os-ok)' : isWrong ? 'var(--os-danger)' : 'var(--os-text)',
                    }}
                  >
                    <span className="mt-0.5 font-mono text-[10px] font-bold">{String.fromCharCode(65 + index)}</span>
                    <span className="font-medium">{option}</span>
                    {isCorrect && <CheckCircle2 className="ml-auto mt-0.5 h-4 w-4 shrink-0" />}
                    {isWrong && <XCircle className="ml-auto mt-0.5 h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                className="mt-4 rounded-xl border p-3 text-xs leading-relaxed"
                style={{
                  borderColor: correct ? 'var(--os-ok)' : 'var(--os-danger)',
                  backgroundColor: correct ? 'var(--os-ok-soft)' : 'var(--os-danger-soft)',
                  color: correct ? 'var(--os-ok)' : 'var(--os-danger)',
                }}
              >
                <p className="mb-1 font-bold">{correct ? 'Correct.' : 'Not quite.'}</p>
                <p>{problem.explanation}</p>
              </div>
            )}

            <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--os-border)' }}>
              <button
                type="button"
                onClick={() => setShowHint((value) => !value)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: 'var(--os-accent)' }}
              >
                <Lightbulb className="h-3.5 w-3.5" />
                {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              {showHint && (
                <p className="mt-2 rounded-lg border px-3 py-2 text-[11px] leading-relaxed" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
                  {problem.hint}
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <h2 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-muted)' }}>
              How to attack it
            </h2>
            <ol className="space-y-2 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
              <li>1. Identify the policy or structure in the scenario.</li>
              <li>2. Write down the timeline, page table, or chain.</li>
              <li>3. Compute the requested metric or address.</li>
              <li>4. Commit to an answer before reading the explanation.</li>
            </ol>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <h2 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-muted)' }}>
              Related lesson
            </h2>
            {chapter ? (
              <Link href={`${basePath}/learn/${chapter.id}`} className="block rounded-lg border p-2.5 text-xs font-bold hover:border-[var(--os-primary)]" style={{ borderColor: 'var(--os-border)' }}>
                {chapter.title}
                <span className="mt-1 block font-mono text-[9px] font-normal" style={{ color: 'var(--os-muted)' }}>
                  Lesson {String(chapter.number).padStart(2, '0')}
                </span>
              </Link>
            ) : (
              <p className="text-xs" style={{ color: 'var(--os-muted)' }}>
                No lesson linked.
              </p>
            )}
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <h2 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-muted)' }}>
              Need the workbench?
            </h2>
            <Link href={`${basePath}/lab`} className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--os-primary)' }}>
              Open the lab <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
