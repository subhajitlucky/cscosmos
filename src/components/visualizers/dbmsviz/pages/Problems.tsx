'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ListChecks, Search, Target } from 'lucide-react';
import { dbmsProblems, type DBMSProblemDifficulty } from '../data/problems';
import { getDBMSChapter } from '../data/curriculum';
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

  const solved = progress.solvedProblems.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between" style={{ borderColor: 'var(--db-border)' }}>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--db-border)', color: 'var(--db-accent)', backgroundColor: 'var(--db-accent-soft)' }}>
            <Target className="h-3.5 w-3.5" />
            Practice arena
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Think in relations</h1>
          <p className="max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--db-muted)' }}>
            Modeling, algebra, normalization, transactions, and distribution. Read the question, commit
            to an answer, then check the explanation.
          </p>
        </div>
        <div className="rounded-xl border p-3 text-center" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--db-muted)' }}>solved</div>
          <div className="font-mono text-2xl font-black" style={{ color: 'var(--db-primary)' }}>{solved} / {dbmsProblems.length}</div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--db-muted)' }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search drills or lessons..."
            className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[var(--db-primary)]"
            style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)', color: 'var(--db-text)' }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {DIFFICULTIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDifficulty(item)}
              className="rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-bold"
              style={{
                borderColor: difficulty === item ? 'var(--db-primary)' : 'var(--db-border)',
                backgroundColor: difficulty === item ? 'var(--db-primary-soft)' : 'var(--db-surface)',
                color: difficulty === item ? 'var(--db-primary)' : 'var(--db-muted)',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--db-border)' }}>
        <div className="grid grid-cols-[48px_1fr_100px] gap-2 border-b px-4 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] sm:grid-cols-[48px_1fr_180px_100px]" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)', color: 'var(--db-muted)' }}>
          <span>#</span>
          <span>Drill</span>
          <span className="hidden sm:block">Lesson</span>
          <span className="text-right">Level</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--db-border)' }}>
          {filtered.map((problem) => {
            const chapter = getDBMSChapter(problem.chapterId);
            const isSolved = progress.solvedProblems.includes(problem.id);
            return (
              <Link
                key={problem.id}
                href={`${basePath}/problems/${problem.id}`}
                className="grid grid-cols-[48px_1fr_100px] items-center gap-2 px-4 py-3 hover:bg-[var(--db-surface-2)] sm:grid-cols-[48px_1fr_180px_100px]"
                style={{ backgroundColor: 'var(--db-surface)' }}
              >
                <span className="font-mono text-[11px] font-bold" style={{ color: isSolved ? 'var(--db-ok)' : 'var(--db-primary)' }}>
                  {isSolved ? <CheckCircle2 className="h-4 w-4" /> : String(problem.number).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{problem.title}</span>
                  <span className="block truncate text-[10px]" style={{ color: 'var(--db-muted)' }}>{problem.type === 'scenario' ? 'Scenario reasoning' : 'Concept check'}</span>
                </span>
                <span className="hidden truncate font-mono text-[10px] sm:block" style={{ color: 'var(--db-muted)' }}>{chapter?.title ?? problem.chapterId}</span>
                <span className="flex items-center justify-end gap-2">
                  <span className="rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold" style={{ borderColor: problem.difficulty === 'Easy' ? 'var(--db-ok)' : problem.difficulty === 'Medium' ? 'var(--db-accent)' : 'var(--db-danger)', color: problem.difficulty === 'Easy' ? 'var(--db-ok)' : problem.difficulty === 'Medium' ? 'var(--db-accent)' : 'var(--db-danger)' }}>
                    {problem.difficulty}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--db-muted)' }} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: 'var(--db-border)' }}>
          <ListChecks className="mx-auto mb-2 h-5 w-5" style={{ color: 'var(--db-muted)' }} />
          <p className="font-mono text-xs font-bold">NO_DRILLS_MATCHED</p>
        </div>
      )}
    </div>
  );
}
