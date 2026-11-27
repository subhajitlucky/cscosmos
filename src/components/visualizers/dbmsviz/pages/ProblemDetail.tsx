'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Lightbulb, RotateCcw, X } from 'lucide-react';
import { getAdjacentDBMSProblems, getDBMSProblem } from '../data/problems';
import { getDBMSChapter } from '../data/curriculum';
import { useDBMSProgress } from '../lib/progress';
import { useDBMSBasePath } from '../components/DBMSShell';

export function ProblemDetail({ problemId }: { problemId: string }) {
  const basePath = useDBMSBasePath();
  const problem = getDBMSProblem(problemId);
  const { previous, next } = getAdjacentDBMSProblems(problemId);
  const { progress, markProblemSolved } = useDBMSProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  if (!problem) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="db-kicker" style={{ color: 'var(--db-danger)' }}>Drill not found</p>
        <Link href={`${basePath}/problems`} className="db-link text-sm font-semibold">
          Back to the drill book
        </Link>
      </div>
    );
  }

  const chapter = getDBMSChapter(problem.chapterId);
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
    <div className="dbmsviz-frame mx-auto w-full max-w-[1240px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 sm:px-8" style={{ borderColor: 'var(--db-border)' }}>
        <div className="flex items-center gap-3">
          <Link href={`${basePath}/problems`} className="db-label inline-flex items-center gap-1.5 text-[9px]" style={{ color: 'var(--db-muted)' }}>
            <ArrowLeft className="h-3 w-3" /> Drill book
          </Link>
          <span className="db-mono text-[9px]" style={{ color: 'var(--db-border-strong)' }}>/</span>
          <span className="db-mono text-[9px]" style={{ color: 'var(--db-primary)' }}>
            DRILL {String(problem.number).padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {previous && (
            <Link href={`${basePath}/problems/${previous.id}`} className="db-mono border px-2 py-1 text-[9px]" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }}>
              ← {String(previous.number).padStart(2, '0')}
            </Link>
          )}
          {next && (
            <Link href={`${basePath}/problems/${next.id}`} className="db-mono border px-2 py-1 text-[9px]" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }}>
              {String(next.number).padStart(2, '0')} →
            </Link>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
        <main className="min-w-0 px-5 py-8 sm:px-8 sm:py-12 lg:pr-10">
          <header className="border-b pb-7" style={{ borderColor: 'var(--db-border)' }}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="db-kicker" style={{ color: 'var(--db-primary)' }}>
                {problem.difficulty}
              </span>
              <span className="db-mono text-[9px]" style={{ color: 'var(--db-border-strong)' }}>/</span>
              <span className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
                {problem.type === 'scenario' ? 'Scenario reasoning' : 'Concept check'}
              </span>
              {solved && (
                <span className="db-label inline-flex items-center gap-1 text-[8px]" style={{ color: 'var(--db-ok)' }}>
                  <Check className="h-3 w-3" /> solved
                </span>
              )}
            </div>
            <h1 className="db-display mt-4 text-[clamp(2.5rem,6vw,4.6rem)]">{problem.title}</h1>
            <p className="mt-4 max-w-[760px] text-[15px] leading-[1.85]" style={{ color: 'var(--db-muted)' }}>
              {problem.prompt}
            </p>
          </header>

          {problem.context && (
            <section className="border-b py-6" style={{ borderColor: 'var(--db-border)' }}>
              <p className="db-kicker" style={{ color: 'var(--db-muted)' }}>Context</p>
              <pre className="mt-3 overflow-x-auto border-l-2 py-1 pl-4 font-mono text-[12px] leading-[1.8]" style={{ borderColor: 'var(--db-primary)', backgroundColor: 'var(--db-surface)' }}>
                {problem.context}
              </pre>
            </section>
          )}

          <section className="py-7">
            <div className="flex items-end justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--db-border)' }}>
              <div>
                <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>Commit to an answer</p>
                <h2 className="db-display-tight mt-1 text-3xl">Choose one.</h2>
              </div>
              {answered && (
                <button type="button" onClick={reset} className="db-label inline-flex items-center gap-1.5 text-[9px]" style={{ color: 'var(--db-muted)' }}>
                  <RotateCcw className="h-3 w-3" /> retry
                </button>
              )}
            </div>

            <div className="mt-4 border" style={{ borderColor: 'var(--db-border)' }}>
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
                    className="flex w-full items-start gap-3 border-b px-4 py-4 text-left text-sm last:border-b-0 disabled:cursor-default"
                    style={{
                      borderColor: 'var(--db-border)',
                      backgroundColor: isCorrect ? 'var(--db-ok-soft)' : isWrong ? 'var(--db-danger-soft)' : isSelected ? 'var(--db-primary-soft)' : 'transparent',
                      color: isCorrect ? 'var(--db-ok)' : isWrong ? 'var(--db-danger)' : 'var(--db-text)',
                    }}
                  >
                    <span className="db-mono mt-0.5 text-[10px] font-bold">{String.fromCharCode(65 + index)}</span>
                    <span className="font-medium">{option}</span>
                    {isCorrect && <CheckCircle2 className="ml-auto mt-0.5 h-4 w-4 shrink-0" />}
                    {isWrong && <X className="ml-auto mt-0.5 h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-4 border-l-2 py-2 pl-4" style={{ borderColor: correct ? 'var(--db-ok)' : 'var(--db-danger)' }}>
                <p className="db-kicker text-[8px]" style={{ color: correct ? 'var(--db-ok)' : 'var(--db-danger)' }}>
                  {correct ? 'Correct' : 'Not quite'}
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--db-muted)' }}>
                  {problem.explanation}
                </p>
              </div>
            )}

            <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--db-border)' }}>
              <button type="button" onClick={() => setShowHint((value) => !value)} className="db-label inline-flex items-center gap-2 text-[9px]" style={{ color: 'var(--db-accent)' }}>
                <Lightbulb className="h-3.5 w-3.5" /> {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              {showHint && (
                <p className="mt-3 border-l-2 py-1 pl-4 text-[12px] leading-relaxed" style={{ borderColor: 'var(--db-accent)', color: 'var(--db-muted)' }}>
                  {problem.hint}
                </p>
              )}
            </div>
          </section>
        </main>

        <aside className="border-t px-5 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-6" style={{ borderColor: 'var(--db-border)' }}>
          <div className="lg:sticky lg:top-24">
            <p className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>How to attack it</p>
            <ol className="mt-3 space-y-3">
              {[
                'Identify the model, dependency, or anomaly.',
                'Write the relation or schedule explicitly.',
                'Apply the rule before looking at the options.',
                'Commit to an answer, then read the explanation.',
              ].map((step, index) => (
                <li key={step} className="grid grid-cols-[20px_1fr] gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>
                  <span className="db-mono text-[9px]" style={{ color: 'var(--db-primary)' }}>{String(index + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>

            {chapter && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--db-border)' }}>
                <p className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Related chapter</p>
                <Link href={`${basePath}/learn/${chapter.id}`} className="mt-2 block text-sm font-semibold hover:text-[var(--db-primary)]">
                  {chapter.title}
                </Link>
                <p className="db-mono mt-1 text-[9px]" style={{ color: 'var(--db-muted)' }}>
                  CH {String(chapter.number).padStart(2, '0')} · {chapter.category}
                </p>
              </div>
            )}

            <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--db-border)' }}>
              <Link href={`${basePath}/lab`} className="flex items-center justify-between text-[11px] font-semibold">
                Open the workbench
                <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--db-primary)' }} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
