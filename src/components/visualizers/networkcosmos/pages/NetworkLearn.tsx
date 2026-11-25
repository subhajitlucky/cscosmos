'use client';

// Syllabus directory: searchable, filterable index of every concept in the
// curriculum. Progress markers are read from the shared local learning store.

import Link from 'next/link';
import { useEffect, useId, useMemo, useState } from 'react';
import { CONCEPTS, PHASES, type Concept } from '../data/concepts';
import { LEARNING_EVENT, readLearningState } from '@/lib/local-learning';

export interface NetworkLearnProps {
  basePath?: string;
}

type Difficulty = Concept['difficulty'];

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

const CONTROL_CLASS =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:outline-sky-400';

export function NetworkLearn({
  basePath = '/corecs/computer-networks-internals-tcpip',
}: NetworkLearnProps) {
  const searchId = useId();
  const phaseId = useId();
  const difficultyId = useId();
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState('all');
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all');
  const [completed, setCompleted] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    const sync = (): void => setCompleted(new Set(readLearningState().completed));
    sync();
    window.addEventListener(LEARNING_EVENT, sync);
    return () => window.removeEventListener(LEARNING_EVENT, sync);
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CONCEPTS.filter((concept) => {
      if (phase !== 'all' && concept.phase !== phase) return false;
      if (difficulty !== 'all' && concept.difficulty !== difficulty) return false;
      if (!needle) return true;
      const phaseTitle = PHASES.find((item) => item.id === concept.phase)?.title ?? '';
      return [concept.title, concept.slug, concept.phase, phaseTitle, concept.why]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [query, phase, difficulty]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-800 hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:hover:text-sky-200 dark:focus-visible:outline-sky-400"
        >
          <span aria-hidden="true">←</span> Back to the packet journey
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Network syllabus
        </h1>
        <p className="max-w-3xl leading-relaxed text-slate-700 dark:text-slate-200">
          Fifty concepts in seven phases. Filter by phase or difficulty, then open any concept for
          its wire-level explanation and interactive widget. Check marks come from the local
          learning store on this device.
        </p>
      </header>

      <section aria-label="Filter concepts" className="rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor={searchId} className="block text-sm font-bold text-slate-800 dark:text-slate-100">
              Search concepts
            </label>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Title, slug, keyword or phase"
              className={`${CONTROL_CLASS} w-full placeholder:text-slate-500 dark:placeholder:text-slate-400`}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor={phaseId} className="block text-sm font-bold text-slate-800 dark:text-slate-100">
              Phase
            </label>
            <select
              id={phaseId}
              value={phase}
              onChange={(event) => setPhase(event.target.value)}
              className={`${CONTROL_CLASS} w-full`}
            >
              <option value="all">All phases</option>
              {PHASES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={difficultyId} className="block text-sm font-bold text-slate-800 dark:text-slate-100">
              Difficulty
            </label>
            <select
              id={difficultyId}
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as 'all' | Difficulty)}
              className={`${CONTROL_CLASS} w-full`}
            >
              <option value="all">All difficulties</option>
              {DIFFICULTIES.map((item) => (
                <option key={item} value={item}>
                  {item[0].toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300" role="status">
          Showing {filtered.length} of {CONCEPTS.length} concepts
        </p>
      </section>

      <section aria-labelledby="syllabus-heading" className="space-y-3">
        <h2 id="syllabus-heading" className="text-xl font-bold text-slate-900 dark:text-white">
          All concepts
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <caption className="sr-only">Concepts in the networks curriculum with phase, difficulty and progress</caption>
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50 text-xs uppercase tracking-wide text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                <th scope="col" className="px-3 py-2.5 font-bold">#</th>
                <th scope="col" className="px-3 py-2.5 font-bold">Concept</th>
                <th scope="col" className="px-3 py-2.5 font-bold">Phase</th>
                <th scope="col" className="px-3 py-2.5 font-bold">Difficulty</th>
                <th scope="col" className="px-3 py-2.5 font-bold">Progress</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((concept) => {
                const phaseTitle = PHASES.find((item) => item.id === concept.phase)?.title ?? concept.phase;
                const isComplete = completed.has(concept.slug);
                return (
                  <tr
                    key={concept.slug}
                    className="border-b border-slate-200 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-3 py-3 font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                      {String(concept.number).padStart(2, '0')}
                    </td>
                    <th scope="row" className="px-3 py-3 font-semibold text-slate-900 dark:text-slate-50">
                      <Link
                        href={`${basePath}/learn/${concept.slug}`}
                        className="text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:decoration-sky-700 dark:hover:text-sky-200 dark:focus-visible:outline-sky-400"
                      >
                        {concept.title}
                      </Link>
                    </th>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{phaseTitle}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                        {concept.difficulty}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          <span aria-hidden="true">✓</span> Completed
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Not started
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="border-t border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
              No concepts match those filters. Try a different search term or reset the phase and
              difficulty filters.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
