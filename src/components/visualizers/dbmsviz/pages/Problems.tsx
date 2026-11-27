'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Search } from 'lucide-react';
import { dbmsProblems, type DBMSProblemDifficulty } from '../data/problems';
import { dbmsCategories, getDBMSChapter, type DBMSCategory } from '../data/curriculum';
import { useDBMSProgress } from '../lib/progress';
import { useDBMSBasePath } from '../components/DBMSShell';

const DIFFICULTIES: (DBMSProblemDifficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];

export function Problems() {
  const basePath = useDBMSBasePath();
  const { progress } = useDBMSProgress();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<DBMSProblemDifficulty | 'All'>('All');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return dbmsProblems.filter((problem) => {
      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
      const chapter = getDBMSChapter(problem.chapterId);
      const matchesTerm =
        term.length === 0 ||
        problem.title.toLowerCase().includes(term) ||
        problem.prompt.toLowerCase().includes(term) ||
        (chapter?.title.toLowerCase().includes(term) ?? false);
      return matchesDifficulty && matchesTerm;
    });
  }, [difficulty, query]);

  const grouped = useMemo(() => {
    return dbmsCategories
      .filter((item): item is DBMSCategory => item !== 'All')
      .map((category) => {
        const chapters = new Set(
          dbmsProblems
            .filter((problem) => getDBMSChapter(problem.chapterId)?.category === category)
            .map((problem) => problem.chapterId),
        );
        return {
          category,
          problems: filtered.filter((problem) => chapters.has(problem.chapterId)),
        };
      })
      .filter((group) => group.problems.length > 0);
  }, [filtered]);

  const solved = progress.solvedProblems.length;

  return (
    <div className="dbmsviz-frame mx-auto w-full max-w-[1240px]">
      <header className="border-b px-5 py-10 sm:px-8 sm:py-14" style={{ borderColor: 'var(--db-border)' }}>
        <div className="grid gap-8 md:grid-cols-[1fr_260px] md:items-end">
          <div>
            <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>Volume 01 · The drill book</p>
            <h1 className="db-display mt-4 text-[clamp(3.6rem,8vw,7rem)]">Think in relations.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-[1.85] sm:text-base" style={{ color: 'var(--db-muted)' }}>
              Thirty-two drills, one per chapter. Read the question, commit to an answer before you look
              at the options, then check the explanation against the rule.
            </p>
          </div>

          <div className="border-l pl-5" style={{ borderColor: 'var(--db-border)' }}>
            <div className="flex items-baseline justify-between">
              <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Solved</span>
              <span className="db-mono text-[10px]" style={{ color: 'var(--db-primary)' }}>
                {Math.round((solved / dbmsProblems.length) * 100)}%
              </span>
            </div>
            <div className="db-num mt-2 text-5xl">
              {String(solved).padStart(2, '0')}
              <span className="text-2xl" style={{ color: 'var(--db-muted)' }}> / {dbmsProblems.length}</span>
            </div>
            <div className="db-progress-track mt-4">
              <div className="db-progress-fill" style={{ width: `${(solved / dbmsProblems.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <section className="border-b px-5 py-5 sm:px-8" style={{ borderColor: 'var(--db-border)' }}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-end">
          <label className="block">
            <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Find a drill</span>
            <span className="mt-2 flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--db-muted)' }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Drill, chapter, or keyword"
                className="db-input"
                aria-label="Search drills"
              />
            </span>
          </label>

          <div className="flex items-center gap-1 lg:justify-end" aria-label="Filter by difficulty">
            {DIFFICULTIES.map((item) => {
              const active = difficulty === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDifficulty(item)}
                  className="border-b-2 px-3 py-2 text-[11px] font-semibold"
                  style={{
                    borderColor: active ? 'var(--db-primary)' : 'transparent',
                    color: active ? 'var(--db-text)' : 'var(--db-muted)',
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div>
        {grouped.map((group) => (
          <section key={group.category} className="border-b" style={{ borderColor: 'var(--db-border)' }}>
            <div className="flex items-baseline justify-between gap-3 px-5 py-4 sm:px-8" style={{ backgroundColor: 'var(--db-surface)' }}>
              <h2 className="db-display-tight text-xl sm:text-2xl">{group.category}</h2>
              <span className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
                {group.problems.length} drill{group.problems.length === 1 ? '' : 's'}
              </span>
            </div>

            <div>
              {group.problems.map((problem) => {
                const chapter = getDBMSChapter(problem.chapterId);
                const isSolved = progress.solvedProblems.includes(problem.id);
                return (
                  <Link
                    key={problem.id}
                    href={`${basePath}/problems/${problem.id}`}
                    className="db-index-row grid grid-cols-[42px_minmax(0,1fr)_90px] items-center gap-3 border-t px-5 py-4 sm:grid-cols-[54px_minmax(0,1fr)_160px_90px_70px] sm:gap-4 sm:px-8"
                    style={{ borderColor: 'var(--db-border)' }}
                  >
                    <span className="db-num text-xl" style={{ color: isSolved ? 'var(--db-ok)' : 'var(--db-primary)' }}>
                      {String(problem.number).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{problem.title}</span>
                      <span className="db-mono mt-0.5 block truncate text-[9px]" style={{ color: 'var(--db-muted)' }}>
                        {problem.type === 'scenario' ? 'Scenario reasoning' : 'Concept check'}
                      </span>
                    </span>
                    <span className="db-mono hidden truncate text-[9px] sm:block" style={{ color: 'var(--db-muted)' }}>
                      {chapter?.title ?? problem.chapterId}
                    </span>
                    <span className="db-mono text-right text-[9px]" style={{ color: problem.difficulty === 'Easy' ? 'var(--db-ok)' : problem.difficulty === 'Medium' ? 'var(--db-accent)' : 'var(--db-danger)' }}>
                      {problem.difficulty}
                    </span>
                    <span className="hidden justify-end sm:flex">
                      {isSolved ? <Check className="h-4 w-4" style={{ color: 'var(--db-ok)' }} /> : <ArrowRight className="h-4 w-4" style={{ color: 'var(--db-border-strong)' }} />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-5 py-16 text-center sm:px-8">
          <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>No match</p>
          <p className="db-display-tight mt-3 text-3xl">Try another rule.</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--db-muted)' }}>
            Search covers drill titles, prompts, and chapter names.
          </p>
        </div>
      )}
    </div>
  );
}
