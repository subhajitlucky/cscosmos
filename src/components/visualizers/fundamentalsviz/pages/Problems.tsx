'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react';
import { itProblems, type ITProblemDifficulty } from '../data/problems';
import { getITChapter, itChapters, itTracks, type ITTrack } from '../data/curriculum';
import { useITProgress } from '../lib/progress';
import { useITBasePath } from '../components/ITShell';

const DIFFICULTIES: (ITProblemDifficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];
const PAGE_SIZE = 20;

export function Problems() {
  const basePath = useITBasePath();
  const { progress } = useITProgress();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<ITProblemDifficulty | 'All'>('All');
  const [chapterId, setChapterId] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('chapter');
    if (requested && itChapters.some((chapter) => chapter.id === requested)) {
      setChapterId(requested);
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [chapterId, query, difficulty]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return itProblems.filter((problem) => {
      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
      const matchesChapter = chapterId === 'All' || problem.chapterId === chapterId;
      const chapter = getITChapter(problem.chapterId);
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
    return itTracks
      .map((track: ITTrack) => {
        const chapterIds = new Set(itChapters.filter((chapter) => chapter.track === track).map((chapter) => chapter.id));
        const trackProblems = filtered.filter((problem) => chapterIds.has(problem.chapterId));
        return {
          track,
          total: trackProblems.length,
          problems: paged.filter((problem) => chapterIds.has(problem.chapterId)),
        };
      })
      .filter((group) => group.problems.length > 0);
  }, [filtered, paged]);

  const pageNumbers = useMemo(() => {
    if (pageCount <= 9) return Array.from({ length: pageCount }, (_, index) => index + 1);
    const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
    return Array.from(pages).filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);
  }, [currentPage, pageCount]);

  const solved = progress.solvedProblems.length;

  const goToPage = (next: number) => {
    setPage(Math.max(1, Math.min(pageCount, next)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="it-frame mx-auto w-full max-w-[1240px]">
      <header className="border-b px-5 py-10 sm:px-8 sm:py-14" style={{ borderColor: 'var(--it-border)' }}>
        <div className="grid gap-8 md:grid-cols-[1fr_250px] md:items-end">
          <div>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Volume 01 · The question bank</p>
            <h1 className="it-display mt-4 text-[clamp(3.2rem,8vw,6.6rem)]">Test the system.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-[1.85] sm:text-base" style={{ color: 'var(--it-muted)' }}>
              Five hundred questions across the six tracks. Every answer comes with the reasoning, so a
              miss becomes a correction instead of a guess.
            </p>
          </div>

          <div className="border-l pl-5" style={{ borderColor: 'var(--it-border)' }}>
            <div className="flex items-baseline justify-between">
              <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Solved</span>
              <span className="it-mono text-[10px]" style={{ color: 'var(--it-primary)' }}>{Math.round((solved / itProblems.length) * 100)}%</span>
            </div>
            <div className="it-num mt-2 text-5xl">
              {String(solved).padStart(2, '0')}
              <span className="text-2xl" style={{ color: 'var(--it-muted)' }}> / {itProblems.length}</span>
            </div>
            <div className="it-progress-track mt-4">
              <div className="it-progress-fill" style={{ width: `${(solved / itProblems.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <section className="border-b px-5 py-5 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,260px)_1fr] lg:items-end">
          <label className="block">
            <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Find a question</span>
            <span className="mt-2 flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--it-muted)' }} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, prompt, or keyword" className="it-input" aria-label="Search questions" />
            </span>
          </label>

          <label className="block">
            <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Chapter</span>
            <select value={chapterId} onChange={(event) => setChapterId(event.target.value)} className="it-select mt-2" aria-label="Filter by chapter">
              <option value="All">All 24 chapters</option>
              {itChapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>{String(chapter.number).padStart(2, '0')} · {chapter.title}</option>
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
                  style={{ borderColor: active ? 'var(--it-primary)' : 'transparent', color: active ? 'var(--it-text)' : 'var(--it-muted)' }}
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
          <section key={group.track} className="border-b" style={{ borderColor: 'var(--it-border)' }}>
            <div className="flex items-baseline justify-between gap-3 px-5 py-4 sm:px-8" style={{ backgroundColor: 'var(--it-surface)' }}>
              <h2 className="it-display-sm text-xl sm:text-2xl">{group.track}</h2>
              <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{group.problems.length} of {group.total} questions</span>
            </div>
            <div>
              {group.problems.map((problem) => {
                const chapter = getITChapter(problem.chapterId);
                const isSolved = progress.solvedProblems.includes(problem.id);
                return (
                  <Link
                    key={problem.id}
                    href={`${basePath}/problems/${problem.id}`}
                    className="it-index-row grid grid-cols-[42px_minmax(0,1fr)_90px] items-center gap-3 border-t px-5 py-4 sm:grid-cols-[54px_minmax(0,1fr)_150px_90px_70px] sm:gap-4 sm:px-8"
                    style={{ borderColor: 'var(--it-border)' }}
                  >
                    <span className="it-num text-xl" style={{ color: isSolved ? 'var(--it-ok)' : 'var(--it-primary)' }}>{String(problem.number).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{problem.title}</span>
                      <span className="it-mono mt-0.5 block truncate text-[9px]" style={{ color: 'var(--it-muted)' }}>{problem.type === 'scenario' ? 'Scenario reasoning' : 'Concept check'}</span>
                    </span>
                    <span className="it-mono hidden truncate text-[9px] sm:block" style={{ color: 'var(--it-muted)' }}>{chapter?.title ?? problem.chapterId}</span>
                    <span className="it-mono text-right text-[9px]" style={{ color: problem.difficulty === 'Easy' ? 'var(--it-ok)' : problem.difficulty === 'Medium' ? 'var(--it-warn)' : 'var(--it-danger)' }}>{problem.difficulty}</span>
                    <span className="hidden justify-end sm:flex">
                      {isSolved ? <Check className="h-4 w-4" style={{ color: 'var(--it-ok)' }} /> : <ArrowRight className="h-4 w-4" style={{ color: 'var(--it-border-strong)' }} />}
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
          <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>No match</p>
          <p className="it-display-sm mt-3 text-3xl">Try another term.</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--it-muted)' }}>Search covers question titles, prompts, and chapter names.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <nav className="flex flex-col gap-4 border-t px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8" style={{ borderColor: 'var(--it-border)' }} aria-label="Question pages">
          <div className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>
            Showing {String((currentPage - 1) * PAGE_SIZE + 1).padStart(3, '0')}–
            {String(Math.min(currentPage * PAGE_SIZE, filtered.length)).padStart(3, '0')} of{' '}
            {String(filtered.length).padStart(3, '0')}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="flex h-9 w-9 items-center justify-center border disabled:opacity-30" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }} aria-label="Previous page">
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            {pageNumbers.map((pageNumber, index) => {
              const previousPage = pageNumbers[index - 1];
              const gap = previousPage !== undefined && pageNumber - previousPage > 1;
              return (
                <React.Fragment key={pageNumber}>
                  {gap && <span className="it-mono px-1 text-[9px]" style={{ color: 'var(--it-muted)' }}>…</span>}
                  <button
                    type="button"
                    onClick={() => goToPage(pageNumber)}
                    className="h-9 min-w-9 border px-2 font-mono text-[9px] font-bold"
                    style={{
                      borderColor: pageNumber === currentPage ? 'var(--it-primary)' : 'var(--it-border)',
                      backgroundColor: pageNumber === currentPage ? 'var(--it-primary-soft)' : 'transparent',
                      color: pageNumber === currentPage ? 'var(--it-primary)' : 'var(--it-muted)',
                    }}
                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                  >
                    {String(pageNumber).padStart(2, '0')}
                  </button>
                </React.Fragment>
              );
            })}
            <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount} className="flex h-9 w-9 items-center justify-center border disabled:opacity-30" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }} aria-label="Next page">
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
