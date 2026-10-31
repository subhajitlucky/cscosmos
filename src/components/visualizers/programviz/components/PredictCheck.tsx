'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Lightbulb,
  XCircle,
  HelpCircle,
  Cpu,
  Database,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PredictCheckKind =
  | 'predict'
  | 'identify-incorrect'
  | 'trace-memory'
  | 'predict-register'
  | 'why-operation';

export interface PredictCheckProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  kind?: PredictCheckKind;
  optionExplanations?: string[];
}

export function PredictCheck({
  question,
  options,
  correctIndex,
  explanation,
  kind = 'predict',
  optionExplanations,
}: PredictCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === correctIndex;

  const getKindConfig = () => {
    switch (kind) {
      case 'identify-incorrect':
        return {
          title: 'Spot the Misconception — Identify the Incorrect Statement',
          icon: AlertTriangle,
          badgeColor: 'text-rose-600 dark:text-rose-400',
        };
      case 'trace-memory':
        return {
          title: 'Active Learning — Trace Memory State',
          icon: Database,
          badgeColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'predict-register':
        return {
          title: 'Active Learning — Predict Register Values',
          icon: Cpu,
          badgeColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'why-operation':
        return {
          title: 'Conceptual Why — Explain the Mechanism',
          icon: HelpCircle,
          badgeColor: 'text-amber-600 dark:text-amber-400',
        };
      case 'predict':
      default:
        return {
          title: 'Quick Check — Predict Before You Scroll On',
          icon: Lightbulb,
          badgeColor: 'text-amber-600 dark:text-amber-400',
        };
    }
  };

  const config = getKindConfig();
  const Icon = config.icon;

  const activeFeedback =
    selected !== null
      ? isCorrect
        ? explanation
        : (optionExplanations && optionExplanations[selected]) || explanation
      : null;

  return (
    <section
      aria-label="Active learning check"
      className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 space-y-4 my-8"
    >
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-2", config.badgeColor)}>
          <Icon className="w-4 h-4 shrink-0" />
          <span className="text-xs font-extrabold uppercase tracking-wider">
            {config.title}
          </span>
        </div>

        {selected !== null && (
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset choice</span>
          </button>
        )}
      </div>

      <p className="font-semibold text-foreground text-sm sm:text-base leading-snug">
        {question}
      </p>

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
                'text-left rounded-xl border px-4 py-3 text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                showCorrect && 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-bold shadow-sm',
                isPicked && !showCorrect && 'border-red-500 bg-red-500/15 text-red-800 dark:text-red-200 font-bold',
                !isPicked && !showCorrect && 'border-border bg-card text-foreground hover:border-amber-400 hover:bg-muted/40',
              )}
            >
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs opacity-60 mt-0.5">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'flex items-start gap-3 rounded-xl border p-4 text-xs sm:text-sm leading-relaxed',
            isCorrect
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100'
              : 'border-red-500/40 bg-red-500/10 text-red-950 dark:text-red-100',
          )}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          )}
          <div className="space-y-1">
            <span className="font-bold block">
              {isCorrect ? 'Correct! ' : 'Common Misconception Identified: '}
            </span>
            <p>{activeFeedback}</p>
          </div>
        </div>
      )}
    </section>
  );
}
