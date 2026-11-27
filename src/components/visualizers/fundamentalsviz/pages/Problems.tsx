'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react';
import { itProblems, type ITProblemDifficulty } from '../data/problems';
import { getITChapter, itChapters } from '../data/curriculum';
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
    if (requested && itChapters.some((chapter) => chapter.id === requested)) setChapterId(requested);
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
    return itChapters
      .map((chapter) => ({
        chapter,
        total: filtered.filter((problem) => problem.chapterId === chapter.id).length,
        problems: paged.filter((problem) => problem.chapterId === chapter.id),
      }))
      .filter((group) => group.problems.length > 0);
  }, [filtered, paged]);

  const pageNumbers = useMemo(() => {
    if (pageCount <= 8) return Array.from({ length: pageCount }, (_, index) => index + 1);
    const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
    return Array.from(pages).filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);
  }, [currentPage, pageCount]);

  const solved = progress.solvedProblems.length;

  const goToPage = (next: number) => {
    setPage(Math.max(1, Math.min(pageCount, next)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="it-frame mx-auto w-full max-w-[1180px]">
      <header className="border-b px-5 py-8 sm:px-8 sm:py-10" style={{ borderColor: 'var(--it-border)' }}>
        <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-end">
          <div>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>IT Fundamentals · Practice</p>
            <h1 className="it-page-title mt-2">Practise the module.</h1>
            <p className="it-prose mt-3 max-w-[720px]">
              {itProblems.length} questions across the seven topics. Read the explanation after every answer; the
              explanation is the part that teaches.
            </p>
          </div>
          <div className="border-l pl-5" style={{ borderColor: 'var(--it-border)' }}>
            <div className="flex items-baseline justify-between">
              <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>Solved</span>
              <span className="it-mono text-[10px]" style={{ color: 'var(--it-primary)' }}>{Math.round((solved / itProblems.length) * 100)}%</span>
            </div>
            <div className="it-num mt-1 text-4xl">{solved}<span className="text-xl" style={{ color: 'var(--it-muted)' }}> / {itProblems.length}</span></div>
            <div className="it-progress-track mt-3"><div className="it-progress-fill" style={{ width: `${(solved / itProblems.length) * 100}%` }} /></div>
          </div>
        </div>
      </header>

      <section className="border-b px-5 py-4 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,300px)_minmax(0,240px)_1fr] lg:items-end">
          <label className="block">
            <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>Find a question</span>
            <span className="mt-2 flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--it-muted)' }} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, prompt, or keyword" className="it-input" aria-label="Search questions" />
            </span>
          </label>

          <label className="block">
            <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>Topic</span>
            <select value={chapterId} onChange={(event) => setChapterId(event.target.value)} className="it-select mt-2" aria-label="Filter by topic">
              <option value="All">All 7 topics</option>
              {itChapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{String(chapter.number).padStart(2, '0')} · {chapter.title}</option>)}
            </select>
          </label>

          <div className="flex items-center gap-1 lg:justify-end" aria-label="Filter by difficulty">
            {DIFFICULTIES.map((item) => {
              const active = difficulty === item;
              return (
                <button key={item} type="button" onClick={() => setDifficulty(item)} className="border-b-2 px-3 py-2 text-[12px] font-semibold" style={{ borderColor: active ? 'var(--it-primary)' : 'transparent', color: active ? 'var(--it-text)' : 'var(--it-muted)' }}>{item}</button>
              );
            })}
          </div>
        </div>
      </section>

      <div>
        {grouped.map((group) => (
          <section key={group.chapter.id} className="border-b" style={{ borderColor: 'var(--it-border)' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 sm:px-8" style={{ backgroundColor: 'var(--it-surface)' }}>
              <h2 className="it-section-title">{String(group.chapter.number).padStart(2, '0')} · {group.chapter.title}</h2>
              <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>{group.problems.length} of {group.total} questions</span>
            </div>
            <div>
              {group.problems.map((problem) => {
                const isSolved = progress.solvedProblems.includes(problem.id);
                return (
                  <Link
                    key={problem.id}
                    href={`${basePath}/problems/${problem.id}`}
                    className="it-topic-row grid grid-cols-[38px_minmax(0,1fr)_80px] items-center gap-3 border-t px-5 py-4 sm:grid-cols-[46px_minmax(0,1fr)_110px_80px] sm:gap-4 sm:px-8"
                    style={{ borderColor: 'var(--it-border)' }}
                  >
                    <span className="it-num text-lg" style={{ color: isSolved ? 'var(--it-ok)' : 'var(--it-primary)' }}>{String(problem.number).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold">{problem.title}</span>
                      <span className="it-label mt-0.5 block truncate text-[10px]" style={{ color: 'var(--it-muted)' }}>{problem.type === 'scenario' ? 'Scenario' : 'Concept check'}</span>
                    </span>
                    <span className="it-label hidden text-[10px] sm:block" style={{ color: 'var(--it-muted)' }}>{problem.difficulty}</span>
                    <span className="flex justify-end">{isSolved ? <Check className="h-4 w-4" style={{ color: 'var(--it-ok)' }} /> : <ArrowRight className="h-4 w-4" style={{ color: 'var(--it-border-strong)' }} />}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-5 py-14 text-center sm:px-8">
          <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>No match</p>
          <p className="it-section-title mt-2">Try another term.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <nav className="flex flex-col gap-3 border-t px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8" style={{ borderColor: 'var(--it-border)' }} aria-label="Question pages">
          <div className="it-mono text-[10px]" style={{ color: 'var(--it-muted)' }}>
            Showing {String((currentPage - 1) * PAGE_SIZE + 1).padStart(3, '0')}–{String(Math.min(currentPage * PAGE_SIZE, filtered.length)).padStart(3, '0')} of {String(filtered.length).padStart(3, '0')}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="flex h-8 w-8 items-center justify-center border disabled:opacity-30" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }} aria-label="Previous page"><ArrowLeft className="h-3.5 w-3.5" /></button>
            {pageNumbers.map((pageNumber, index) => {
              const previousPage = pageNumbers[index - 1];
              const gap = previousPage !== undefined && pageNumber - previousPage > 1;
              return (
                <React.Fragment key={pageNumber}>
                  {gap && <span className="it-mono px-1 text-[10px]" style={{ color: 'var(--it-muted)' }}>…</span>}
                  <button type="button" onClick={() => goToPage(pageNumber)} className="h-8 min-w-8 border px-2 font-mono text-[10px] font-bold" style={{ borderColor: pageNumber === currentPage ? 'var(--it-primary)' : 'var(--it-border)', backgroundColor: pageNumber === currentPage ? 'var(--it-primary-soft)' : 'transparent', color: pageNumber === currentPage ? 'var(--it-primary)' : 'var(--it-muted)' }} aria-current={pageNumber === currentPage ? 'page' : undefined}>{String(pageNumber).padStart(2, '0')}</button>
                </React.Fragment>
              );
            })}
            <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount} className="flex h-8 w-8 items-center justify-center border disabled:opacity-30" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }} aria-label="Next page"><ArrowRight className="h-3.5 w-3.5" /></button>
          </div>
        </nav>
      )}
    </div>
  );
}
