import type { Difficulty, Frequency, InterviewRound, QuestionType } from './types';

export const DIFFICULTY_META: Record<Difficulty, { label: string; className: string }> = {
  beginner: { label: 'Beginner', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' },
  intermediate: { label: 'Intermediate', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  advanced: { label: 'Advanced', className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' },
};

export const FREQUENCY_META: Record<Frequency, { label: string; className: string }> = {
  'very-often': { label: 'Asked very often', className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30' },
  sometimes: { label: 'Asked sometimes', className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30' },
  rare: { label: 'Rare', className: 'bg-slate-500/10 text-slate-500 dark:text-slate-500 border-slate-500/30' },
};

export const ROUND_META: Record<InterviewRound, { label: string }> = {
  'phone-screen': { label: 'Phone screen' },
  coding: { label: 'Coding round' },
  'system-design': { label: 'System design' },
  concept: { label: 'Concept round' },
};

export const TYPE_META: Record<QuestionType, { label: string }> = {
  concept: { label: 'Concept' },
  debugging: { label: 'Debugging' },
  design: { label: 'Design' },
  coding: { label: 'Coding' },
};
