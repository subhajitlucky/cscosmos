'use client';

import React, { useState } from 'react';
import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PredictCheckProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function PredictCheck({ question, options, correctIndex, explanation }: PredictCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === correctIndex;

  return (
    <section
      aria-label="Quick check"
      className="rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 p-6 space-y-4 my-8"
    >
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Lightbulb className="w-4 h-4" />
        <span className="text-xs font-extrabold uppercase tracking-wider">
          Quick Check — Predict Before You Scroll On
        </span>
      </div>
      <p className="font-semibold text-foreground">{question}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option, i) => {
          const isPicked = selected === i;
          const showCorrect = selected !== null && i === correctIndex;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={isPicked}
              className={cn(
                'text-left rounded-xl border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                showCorrect && 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                isPicked && !showCorrect && 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300',
                !isPicked && !showCorrect && 'border-border bg-card text-foreground hover:border-blue-400',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'flex items-start gap-3 rounded-xl border p-4 text-sm',
            isCorrect
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
              : 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200',
          )}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0" />
          )}
          <p>
            <span className="font-bold">{isCorrect ? 'Exactly! ' : 'Not quite. '}</span>
            {explanation}
          </p>
        </div>
      )}
    </section>
  );
}
