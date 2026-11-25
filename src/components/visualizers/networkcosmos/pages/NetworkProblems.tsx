'use client';

// Twenty wire-level challenges, one at a time. An answer is graded the moment
// it is chosen, with the reasoning shown immediately rather than at the end.

import Link from 'next/link';
import { useId, useState } from 'react';
import { CHALLENGES } from '../data/scenarios';

export interface NetworkProblemsProps {
  basePath?: string;
}

const CONTROL_CLASS =
  'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 transition-colors motion-reduce:transition-none hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:outline-sky-400';

export function NetworkProblems({
  basePath = '/corecs/computer-networks-internals-tcpip',
}: NetworkProblemsProps) {
  const optionsGroupId = useId();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(() => new Set());

  const challenge = CHALLENGES[index];
  const isCorrect = submitted && selected === challenge.answer;

  const answer = (optionIndex: number): void => {
    if (submitted) return;
    setSelected(optionIndex);
    setSubmitted(true);
    if (optionIndex === challenge.answer) {
      setSolved((current) => new Set(current).add(challenge.slug));
    }
  };

  const goTo = (nextIndex: number): void => {
    setIndex(nextIndex);
    setSelected(null);
    setSubmitted(false);
  };

  const retry = (): void => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-800 hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:hover:text-sky-200 dark:focus-visible:outline-sky-400"
        >
          <span aria-hidden="true">←</span> Back to the packet journey
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Wire-level challenges
        </h1>
        <p className="max-w-3xl leading-relaxed text-slate-700 dark:text-slate-200">
          Twenty questions drawn from subnet math, longest-prefix match, ARP, retransmission, and
          packet captures. Each answer reveals the reasoning straight away — read it, retry the
          question, then move on.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100" role="status">
          Question {index + 1} of {CHALLENGES.length}
        </p>
        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300" role="status">
          Score: {solved.size} / {CHALLENGES.length}
        </p>
      </div>

      <section aria-labelledby="challenge-heading" className="space-y-5 rounded-xl border border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 id="challenge-heading" className="text-xl font-bold leading-snug text-slate-900 dark:text-white">
          {challenge.question}
        </h2>
        <fieldset disabled={submitted} className="space-y-2">
          <legend className="sr-only">Choose one answer</legend>
          {challenge.options.map((option, optionIndex) => {
            const optionId = `${optionsGroupId}-${optionIndex}`;
            const chosen = selected === optionIndex;
            return (
              <div
                key={option}
                className={`rounded-lg border px-3 py-2 ${
                  submitted && optionIndex === challenge.answer
                    ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/60'
                    : submitted && chosen
                      ? 'border-rose-600 bg-rose-50 dark:border-rose-400 dark:bg-rose-950/60'
                      : 'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/60'
                }`}
              >
                <input
                  type="radio"
                  id={optionId}
                  name={optionsGroupId}
                  value={optionIndex}
                  checked={chosen}
                  onChange={() => answer(optionIndex)}
                  className="mr-2 h-4 w-4 accent-sky-600 dark:accent-sky-400"
                />
                <label
                  htmlFor={optionId}
                  className="cursor-pointer text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  {option}
                </label>
              </div>
            );
          })}
        </fieldset>

        {submitted && (
          <div
            role="status"
            className={`space-y-2 rounded-lg border p-4 ${
              isCorrect
                ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/60'
                : 'border-amber-600 bg-amber-50 dark:border-amber-400 dark:bg-amber-950/60'
            }`}
          >
            <p
              className={`font-bold ${
                isCorrect
                  ? 'text-emerald-900 dark:text-emerald-200'
                  : 'text-amber-900 dark:text-amber-100'
              }`}
            >
              {isCorrect ? 'Correct.' : `Not quite — the answer is: ${challenge.options[challenge.answer]}`}
            </p>
            <p className="leading-relaxed text-slate-900 dark:text-slate-100">
              {challenge.explanation}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <button
            type="button"
            className={CONTROL_CLASS}
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          {submitted && (
            <button type="button" className={CONTROL_CLASS} onClick={retry}>
              Retry question
            </button>
          )}
          <button
            type="button"
            className={CONTROL_CLASS}
            onClick={() => goTo(index + 1)}
            disabled={index === CHALLENGES.length - 1}
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <Link
        href={`${basePath}/learn`}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:decoration-sky-700 dark:hover:text-sky-200 dark:focus-visible:outline-sky-400"
      >
        Review the syllabus before another round
      </Link>
    </div>
  );
}
