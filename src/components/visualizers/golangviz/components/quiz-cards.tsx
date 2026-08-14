"use client";

import { useState } from "react";

export type Quiz = {
  id: string | number;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
};

interface QuizCardsProps {
  quizzes: Quiz[];
  title?: string;
  description?: string;
}

export function QuizCards({ 
  quizzes, 
  title = "Quick checks for understanding",
  description = "Multiple-choice with inline explanations—expand to see why."
}: QuizCardsProps) {
  return (
    <div className="surface rounded-2xl p-5 shadow-lg shadow-amber-500/10">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200">
          Quizzes
        </p>
        <h3 className="text-lg font-semibold text-[var(--foreground)] dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-[var(--muted)]">
          {description}
        </p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === quiz.answer;
  return (
    <div className="flex flex-col rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-sm text-[var(--foreground)]">
      <div className="font-semibold text-[var(--foreground)] dark:text-white">
        {quiz.question}
      </div>
      <div className="mt-2 space-y-2">
        {quiz.choices.map((choice, idx) => (
          <button
            key={choice}
            onClick={() => setSelected(idx)}
            className={`w-full rounded-lg border px-3 py-2 text-left transition ${
              selected === idx
                ? idx === quiz.answer
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-100"
                  : "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-100"
                : "border-[var(--panel-border)] text-[var(--foreground)] hover:border-[var(--accent)] dark:border-white/10 dark:hover:border-white/30"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
      {selected !== null ? (
        <div
          className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
            isCorrect
              ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-100"
              : "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-100"
          }`}
        >
          {quiz.explanation}
        </div>
      ) : null}
    </div>
  );
}