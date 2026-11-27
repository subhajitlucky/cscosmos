'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Lightbulb, RotateCcw, X } from 'lucide-react';
import { getAdjacentITProblems, getITProblem } from '../data/problems';
import { getITChapter } from '../data/curriculum';
import { useITProgress } from '../lib/progress';
import { useITBasePath } from '../components/ITShell';

export function ProblemDetail({ problemId }: { problemId: string }) {
  const basePath = useITBasePath();
  const problem = getITProblem(problemId);
  const { previous, next } = getAdjacentITProblems(problemId);
  const { progress, markProblemSolved } = useITProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  if (!problem) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="it-kicker" style={{ color: 'var(--it-danger)' }}>Question not found</p>
        <Link href={`${basePath}/problems`} className="it-link text-sm font-semibold">Back to the question bank</Link>
      </div>
    );
  }

  const chapter = getITChapter(problem.chapterId);
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
    <div className="it-frame mx-auto w-full max-w-[1240px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
        <div className="flex items-center gap-3">
          <Link href={`${basePath}/problems`} className="it-label inline-flex items-center gap-1.5 text-[9px]" style={{ color: 'var(--it-muted)' }}>
            <ArrowLeft className="h-3 w-3" /> Question bank
          </Link>
          <span className="it-mono text-[9px]" style={{ color: 'var(--it-border-strong)' }}>/</span>
          <span className="it-mono text-[9px]" style={{ color: 'var(--it-primary)' }}>Q {String(problem.number).padStart(3, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
          {previous && <Link href={`${basePath}/problems/${previous.id}`} className="it-mono border px-2 py-1 text-[9px]" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }}>← {String(previous.number).padStart(3, '0')}</Link>}
          {next && <Link href={`${basePath}/problems/${next.id}`} className="it-mono border px-2 py-1 text-[9px]" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }}>{String(next.number).padStart(3, '0')} →</Link>}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
        <main className="min-w-0 px-5 py-8 sm:px-8 sm:py-12 lg:pr-10">
          <header className="border-b pb-7" style={{ borderColor: 'var(--it-border)' }}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="it-kicker" style={{ color: 'var(--it-primary)' }}>{problem.difficulty}</span>
              <span className="it-mono text-[9px]" style={{ color: 'var(--it-border-strong)' }}>/</span>
              <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{problem.type === 'scenario' ? 'Scenario reasoning' : 'Concept check'}</span>
              {solved && <span className="it-label inline-flex items-center gap-1 text-[8px]" style={{ color: 'var(--it-ok)' }}><Check className="h-3 w-3" /> solved</span>}
            </div>
            <h1 className="it-display-sm mt-4 text-[clamp(2.2rem,5vw,4rem)]">{problem.title}</h1>
            <p className="mt-4 max-w-[760px] text-[15px] leading-[1.85]" style={{ color: 'var(--it-muted)' }}>{problem.prompt}</p>
          </header>

          {problem.context && (
            <section className="border-b py-6" style={{ borderColor: 'var(--it-border)' }}>
              <p className="it-kicker" style={{ color: 'var(--it-muted)' }}>Context</p>
              <pre className="mt-3 overflow-x-auto border-l-2 py-1 pl-4 font-mono text-[12px] leading-[1.8]" style={{ borderColor: 'var(--it-primary)', backgroundColor: 'var(--it-surface)' }}>{problem.context}</pre>
            </section>
          )}

          <section className="py-7">
            <div className="flex items-end justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--it-border)' }}>
              <div>
                <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Commit to an answer</p>
                <h2 className="it-display-sm mt-1 text-3xl">Choose one.</h2>
              </div>
              {answered && (
                <button type="button" onClick={reset} className="it-label inline-flex items-center gap-1.5 text-[9px]" style={{ color: 'var(--it-muted)' }}>
                  <RotateCcw className="h-3 w-3" /> retry
                </button>
              )}
            </div>

            <div className="mt-4 border" style={{ borderColor: 'var(--it-border)' }}>
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
                      borderColor: 'var(--it-border)',
                      backgroundColor: isCorrect ? 'var(--it-ok-soft)' : isWrong ? 'var(--it-danger-soft)' : isSelected ? 'var(--it-primary-soft)' : 'transparent',
                      color: isCorrect ? 'var(--it-ok)' : isWrong ? 'var(--it-danger)' : 'var(--it-text)',
                    }}
                  >
                    <span className="it-mono mt-0.5 text-[10px] font-bold">{String.fromCharCode(65 + index)}</span>
                    <span className="font-medium">{option}</span>
                    {isCorrect && <CheckCircle2 className="ml-auto mt-0.5 h-4 w-4 shrink-0" />}
                    {isWrong && <X className="ml-auto mt-0.5 h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-4 border-l-2 py-2 pl-4" style={{ borderColor: correct ? 'var(--it-ok)' : 'var(--it-danger)' }}>
                <p className="it-kicker text-[8px]" style={{ color: correct ? 'var(--it-ok)' : 'var(--it-danger)' }}>{correct ? 'Correct' : 'Not quite'}</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--it-muted)' }}>{problem.explanation}</p>
              </div>
            )}

            <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--it-border)' }}>
              <button type="button" onClick={() => setShowHint((value) => !value)} className="it-label inline-flex items-center gap-2 text-[9px]" style={{ color: 'var(--it-accent)' }}>
                <Lightbulb className="h-3.5 w-3.5" /> {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              {showHint && <p className="mt-3 border-l-2 py-1 pl-4 text-[12px] leading-relaxed" style={{ borderColor: 'var(--it-accent)', color: 'var(--it-muted)' }}>{problem.hint}</p>}
            </div>
          </section>
        </main>

        <aside className="border-t px-5 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-6" style={{ borderColor: 'var(--it-border)' }}>
          <div className="lg:sticky lg:top-24">
            <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>How to attack it</p>
            <ol className="mt-3 space-y-3">
              {[
                'Identify which layer the question is about.',
                'Name the input, process, and output.',
                'Eliminate answers that confuse a cause with a symptom.',
                'Commit, then read the explanation against the rule.',
              ].map((step, index) => (
                <li key={step} className="grid grid-cols-[20px_1fr] gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
                  <span className="it-mono text-[9px]" style={{ color: 'var(--it-primary)' }}>{String(index + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>

            {chapter && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--it-border)' }}>
                <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Related chapter</p>
                <Link href={`${basePath}/learn/${chapter.id}`} className="mt-2 block text-sm font-semibold hover:text-[var(--it-primary)]">{chapter.title}</Link>
                <p className="it-mono mt-1 text-[9px]" style={{ color: 'var(--it-muted)' }}>CH {String(chapter.number).padStart(2, '0')} · {chapter.track}</p>
              </div>
            )}

            <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--it-border)' }}>
              <Link href={`${basePath}/lab`} className="flex items-center justify-between text-[11px] font-semibold">Open the instruments <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--it-primary)' }} /></Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
