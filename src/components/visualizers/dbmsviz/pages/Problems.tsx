'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react';
import { dbmsProblems, type DBMSProblemDifficulty } from '../data/problems';
import { dbmsCategories, dbmsChapters, getDBMSChapter, type DBMSCategory } from '../data/curriculum';
import { useDBMSProgress } from '../lib/progress';
import { useDBMSBasePath } from '../components/DBMSShell';

const DIFFICULTIES: (DBMSProblemDifficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];
const PAGE_SIZE = 24;

export function Problems() {
  const basePath = useDBMSBasePath();
  const { progress } = useDBMSProgress();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<DBMSProblemDifficulty | 'All'>('All');
  const [chapterId, setChapterId] = useState<string>('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('chapter');
    if (requested && dbmsChapters.some((chapter) => chapter.id === requested)) {
      setChapterId(requested);
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [chapterId, query, difficulty]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return dbmsProblems.filter((problem) => {
      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
      const matchesChapter = chapterId === 'All' || problem.chapterId === chapterId;
      const chapter = getDBMSChapter(problem.chapterId);
      const matchesTerm =
        term.length === 0 ||
        problem.title.toLowerCase().includes(term) ||
        problem.prompt.toLowerCase().includes(term) ||
        (chapter?.title.toLowerCase().includes(term) ?? false);
      return matchesDifficulty && matchesChapter && matchesTerm;
    });
  }, [chapterId, difficulty, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const grouped = useMemo(() => {
    return dbmsCategories
      .filter((item): item is DBMSCategory => item !== 'All')
      .map((category) => {
        const chapters = new Set(
          dbmsProblems
            .filter((problem) => getDBMSChapter(problem.chapterId)?.category === category)
            .map((problem) => problem.chapterId),
        );
        const categoryProblems = filtered.filter((problem) => chapters.has(problem.chapterId));
        return {
          category,
          total: categoryProblems.length,
          problems: paged.filter((problem) => chapters.has(problem.chapterId)),
        };
      })
      .filter((group) => group.problems.length > 0);
  }, [filtered, paged]);

  const pageNumbers = useMemo(() => {
    if (pageCount <= 9) return Array.from({ length: pageCount }, (_, index) => index + 1);
    const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
    return Array.from(pages)
      .filter((value) => value >= 1 && value <= pageCount)
      .sort((a, b) => a - b);
  }, [currentPage, pageCount]);

  const solved = progress.solvedProblems.length;

  const goToPage = (next: number) => {
    setPage(Math.max(1, Math.min(pageCount, next)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dbmsviz-frame mx-auto w-full max-w-[1240px]">
      <header className="border-b px-5 py-10 sm:px-8 sm:py-14" style={{ borderColor: 'var(--db-border)' }}>
        <div className="grid gap-8 md:grid-cols-[1fr_260px] md:items-end">
          <div>
            <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>Volume 01 · The drill book</p>
            <h1 className="db-display mt-4 text-[clamp(3.6rem,8vw,7rem)]">Think in relations.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-[1.85] sm:text-base" style={{ color: 'var(--db-muted)' }}>
              One thousand questions across thirty-two chapters. Read the question, commit to an answer
              before you look at the options, then check the explanation against the rule.
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
        <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,260px)_1fr] lg:items-end">
          <label className="block">
            <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Find a drill</span>
            <span className="mt-2 flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--db-muted)' }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Title, prompt, or keyword"
                className="db-input"
                aria-label="Search drills"
              />
            </span>
          </label>

          <label className="block">
            <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Chapter</span>
            <select
              value={chapterId}
              onChange={(event) => setChapterId(event.target.value)}
              className="db-select mt-2"
              aria-label="Filter by chapter"
            >
              <option value="All">All 32 chapters</option>
              {dbmsChapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {String(chapter.number).padStart(2, '0')} · {chapter.title}
                </option>
              ))}
            </select>
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
                {group.problems.length} of {group.total} drill{group.total === 1 ? '' : 's'}
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

      {filtered.length > 0 && (
        <nav className="flex flex-col gap-4 border-t px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8" style={{ borderColor: 'var(--db-border)' }} aria-label="Drill pages">
          <div className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
            Showing {String((currentPage - 1) * PAGE_SIZE + 1).padStart(4, '0')}–
            {String(Math.min(currentPage * PAGE_SIZE, filtered.length)).padStart(4, '0')} of{' '}
            {String(filtered.length).padStart(4, '0')}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center border disabled:opacity-30"
              style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }}
              aria-label="Previous page"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>

            {pageNumbers.map((pageNumber, index) => {
              const previous = pageNumbers[index - 1];
              const gap = previous !== undefined && pageNumber - previous > 1;
              return (
                <React.Fragment key={pageNumber}>
                  {gap && <span className="db-mono px-1 text-[9px]" style={{ color: 'var(--db-muted)' }}>…</span>}
                  <button
                    type="button"
                    onClick={() => goToPage(pageNumber)}
                    className="h-9 min-w-9 border px-2 font-mono text-[9px] font-bold"
                    style={{
                      borderColor: pageNumber === currentPage ? 'var(--db-primary)' : 'var(--db-border)',
                      backgroundColor: pageNumber === currentPage ? 'var(--db-primary-soft)' : 'transparent',
                      color: pageNumber === currentPage ? 'var(--db-primary)' : 'var(--db-muted)',
                    }}
                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                  >
                    {String(pageNumber).padStart(2, '0')}
                  </button>
                </React.Fragment>
              );
            })}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="flex h-9 w-9 items-center justify-center border disabled:opacity-30"
              style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }}
              aria-label="Next page"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
