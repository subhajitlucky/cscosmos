'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BrainCircuit,
  Binary,
  Layers,
  Network,
  Search,
  ShieldAlert,
} from 'lucide-react';
import {
  DIFFICULTIES,
  DIFFICULTY_META,
  FREQUENCIES,
  FREQUENCY_META,
  QUESTION_TYPES,
  ROUNDS,
  ROUND_META,
  TYPE_META,
} from '@/data/interview';
import type {
  Difficulty,
  Frequency,
  InterviewCategory,
  InterviewQuestion,
  InterviewRound,
  QuestionType,
} from '@/data/interview';
import { cn } from '@/lib/utils';
import { QuestionCard } from './QuestionCard';

const ICONS = { Layers, ShieldAlert, Binary, Network, BrainCircuit } as const;

type DifficultyFilter = Difficulty | 'all';
type FrequencyFilter = Frequency | 'all';
type RoundFilter = InterviewRound | 'all';
type TypeFilter = QuestionType | 'all';

interface ChipOption<T extends string> {
  value: T;
  label: string;
}

const DIFFICULTY_OPTIONS: readonly ChipOption<DifficultyFilter>[] = [
  { value: 'all', label: 'All' },
  ...DIFFICULTIES.map((d): ChipOption<DifficultyFilter> => ({
    value: d,
    label: DIFFICULTY_META[d].label,
  })),
];

const FREQUENCY_OPTIONS: readonly ChipOption<FrequencyFilter>[] = [
  { value: 'all', label: 'All' },
  ...FREQUENCIES.map((f): ChipOption<FrequencyFilter> => ({
    value: f,
    label: FREQUENCY_META[f].label,
  })),
];

const ROUND_OPTIONS: readonly ChipOption<RoundFilter>[] = [
  { value: 'all', label: 'All' },
  ...ROUNDS.map((r): ChipOption<RoundFilter> => ({ value: r, label: ROUND_META[r].label })),
];

const TYPE_OPTIONS: readonly ChipOption<TypeFilter>[] = [
  { value: 'all', label: 'All' },
  ...QUESTION_TYPES.map((t): ChipOption<TypeFilter> => ({ value: t, label: TYPE_META[t].label })),
];

const FREQUENCY_ORDER: Record<Frequency, number> = {
  'very-often': 0,
  sometimes: 1,
  rare: 2,
};

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors focus-ring',
              active
                ? 'border-primary bg-primary/10 font-medium text-primary'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface CategoryBrowserProps {
  category: InterviewCategory;
  questions: InterviewQuestion[];
}

export function CategoryBrowser({ category, questions }: CategoryBrowserProps) {
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [frequency, setFrequency] = useState<FrequencyFilter>('all');
  const [round, setRound] = useState<RoundFilter>('all');
  const [type, setType] = useState<TypeFilter>('all');
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  const Icon = ICONS[category.icon];

  const topics = useMemo(() => {
    const unique = [...new Set(questions.map((q) => q.topic))];
    return unique.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }, [questions]);

  const topicOptions: readonly ChipOption<string>[] = useMemo(
    () => [{ value: 'all', label: 'All' }, ...topics.map((t) => ({ value: t, label: t }))],
    [topics],
  );

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const t = params.get('topic');
    const d = params.get('difficulty');
    const f = params.get('frequency');
    const r = params.get('round');
    const ty = params.get('type');
    if (q) setSearch(q);
    if (t && topics.includes(t)) setTopic(t);
    if (d && DIFFICULTIES.includes(d as Difficulty)) setDifficulty(d as Difficulty);
    if (f && FREQUENCIES.includes(f as Frequency)) setFrequency(f as Frequency);
    if (r && ROUNDS.includes(r as InterviewRound)) setRound(r as InterviewRound);
    if (ty && QUESTION_TYPES.includes(ty as QuestionType)) setType(ty as QuestionType);
    setHydrated(true);
  }, [topics]);

  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search);
    if (topic !== 'all') params.set('topic', topic);
    if (difficulty !== 'all') params.set('difficulty', difficulty);
    if (frequency !== 'all') params.set('frequency', frequency);
    if (round !== 'all') params.set('round', round);
    if (type !== 'all') params.set('type', type);
    const query = params.toString();
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
  }, [hydrated, search, topic, difficulty, frequency, round, type]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = questions.filter((question) => {
      if (query) {
        const haystack = `${question.title} ${question.topic} ${question.tags.join(' ')}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (topic !== 'all' && question.topic !== topic) return false;
      if (difficulty !== 'all' && question.difficulty !== difficulty) return false;
      if (frequency !== 'all' && question.frequency !== frequency) return false;
      if (round !== 'all' && question.round !== round) return false;
      if (type !== 'all' && question.type !== type) return false;
      return true;
    });
    return matches.sort((a, b) => {
      const byFrequency = FREQUENCY_ORDER[a.frequency] - FREQUENCY_ORDER[b.frequency];
      if (byFrequency !== 0) return byFrequency;
      return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
    });
  }, [questions, search, topic, difficulty, frequency, round, type]);

  const clearFilters = () => {
    setSearch('');
    setTopic('all');
    setDifficulty('all');
    setFrequency('all');
    setRound('all');
    setType('all');
  };

  return (
    <main className="page-container py-12">
      <div className="mb-8">
        <Link
          href="/interview"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All categories
        </Link>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <Icon className={cn('h-8 w-8 shrink-0', category.accent)} aria-hidden="true" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{category.title}</h1>
            <p className="mt-1 text-muted-foreground">{category.description}</p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {filtered.length} of {questions.length} questions
            </p>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md">
        <div className="space-y-3">
          <div className="relative">
            <label htmlFor="interview-question-search" className="sr-only">
              Search questions
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="interview-question-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions, topics, tags..."
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus-ring"
            />
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-5">
            <FilterRow label="Topic" options={topicOptions} value={topic} onChange={setTopic} />
            <FilterRow
              label="Difficulty"
              options={DIFFICULTY_OPTIONS}
              value={difficulty}
              onChange={setDifficulty}
            />
            <FilterRow
              label="Frequency"
              options={FREQUENCY_OPTIONS}
              value={frequency}
              onChange={setFrequency}
            />
            <FilterRow label="Round" options={ROUND_OPTIONS} value={round} onChange={setRound} />
            <FilterRow label="Type" options={TYPE_OPTIONS} value={type} onChange={setType} />
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((question) => (
            <QuestionCard key={question.slug} question={question} />
          ))}
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center gap-4 p-10 text-center">
          <p className="text-muted-foreground">No questions match your filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
