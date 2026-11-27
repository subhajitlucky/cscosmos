'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Search } from 'lucide-react';
import { dbmsCategories, dbmsChapters, type DBMSCategory } from '../data/curriculum';
import { useDBMSProgress } from '../lib/progress';
import { useDBMSBasePath } from '../components/DBMSShell';

export function Learn() {
  const basePath = useDBMSBasePath();
  const { progress } = useDBMSProgress();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<DBMSCategory | 'All'>('All');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return dbmsChapters.filter((chapter) => {
      const matchesCategory = category === 'All' || chapter.category === category;
      const matchesTerm =
        term.length === 0 ||
        chapter.title.toLowerCase().includes(term) ||
        chapter.summary.toLowerCase().includes(term) ||
        chapter.concepts.some((concept) => concept.toLowerCase().includes(term));
      return matchesCategory && matchesTerm;
    });
  }, [category, query]);

  const grouped = useMemo(() => {
    return dbmsCategories
      .filter((item): item is DBMSCategory => item !== 'All')
      .map((item) => ({
        category: item,
        chapters: filtered.filter((chapter) => chapter.category === item),
      }))
      .filter((group) => group.chapters.length > 0);
  }, [filtered]);

  const completed = progress.completedChapters.length;
  const percent = Math.round((completed / dbmsChapters.length) * 100);
  const nextLesson =
    dbmsChapters.find((chapter) => !progress.completedChapters.includes(chapter.id)) ??
    dbmsChapters[0];
  const hasStarted = completed > 0;
  const totalMinutes = dbmsChapters.reduce((total, chapter) => total + chapter.estimatedMinutes, 0);

  return (
    <div className="dbmsviz-frame mx-auto w-full max-w-[1240px]">
      <header className="border-b px-5 py-10 sm:px-8 sm:py-14" style={{ borderColor: 'var(--db-border)' }}>
        <div className="grid gap-8 md:grid-cols-[1fr_260px] md:items-end">
          <div>
            <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>
              Volume 01 · Table of contents
            </p>
            <h1 className="db-display mt-4 text-[clamp(4rem,9vw,7.5rem)]">Contents.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-[1.85] sm:text-base" style={{ color: 'var(--db-muted)' }}>
              Thirty-two chapters in eight tracks. Each chapter states one idea, shows the table or
              schedule that makes it concrete, and ends with a drill you can actually answer.
            </p>
          </div>

          <div className="border-l pl-5" style={{ borderColor: 'var(--db-border)' }}>
            <div className="flex items-baseline justify-between">
              <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Completed</span>
              <span className="db-mono text-[10px]" style={{ color: 'var(--db-primary)' }}>{percent}%</span>
            </div>
            <div className="db-num mt-2 text-5xl">
              {String(completed).padStart(2, '0')}
              <span className="text-2xl" style={{ color: 'var(--db-muted)' }}> / 32</span>
            </div>
            <div className="db-progress-track mt-4">
              <div className="db-progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <p className="db-mono mt-3 text-[9px]" style={{ color: 'var(--db-muted)' }}>
              {Math.round(totalMinutes / 60)}h of guided reading
            </p>
          </div>
        </div>
      </header>

      <section className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <Link
          href={`${basePath}/learn/${nextLesson.id}`}
          className="group grid gap-4 px-5 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-8"
          style={{ backgroundColor: 'var(--db-primary-soft)' }}
        >
          <span className="db-kicker text-[9px]" style={{ color: 'var(--db-primary)' }}>
            {hasStarted ? 'Continue' : 'Start here'}
          </span>
          <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="db-mono text-[10px]" style={{ color: 'var(--db-muted)' }}>
              CH {String(nextLesson.number).padStart(2, '0')}
            </span>
            <span className="text-base font-semibold">{nextLesson.title}</span>
            <span className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
              {nextLesson.estimatedMinutes} min · {nextLesson.difficulty}
            </span>
          </span>
          <span className="db-label inline-flex items-center gap-2 text-[9px]" style={{ color: 'var(--db-primary)' }}>
            {hasStarted ? 'Resume' : 'Begin'} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      <section className="border-b px-5 py-5 sm:px-8" style={{ borderColor: 'var(--db-border)' }}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-end">
          <label className="block">
            <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Find a chapter</span>
            <span className="mt-2 flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--db-muted)' }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Title, concept, or keyword"
                className="db-input"
                aria-label="Search chapters"
              />
            </span>
          </label>

          <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1 lg:justify-end" aria-label="Filter by track">
            {dbmsCategories.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className="whitespace-nowrap border-b-2 px-2.5 py-2 text-[11px] font-semibold"
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
        {grouped.map((group, groupIndex) => (
          <section key={group.category} className="border-b" style={{ borderColor: 'var(--db-border)' }}>
            <div className="grid gap-3 px-5 py-5 sm:grid-cols-[64px_1fr_auto] sm:items-baseline sm:px-8" style={{ backgroundColor: 'var(--db-surface)' }}>
              <span className="db-kicker" style={{ color: 'var(--db-primary)' }}>
                {String(groupIndex + 1).padStart(2, '0')}
              </span>
              <h2 className="db-display-tight text-2xl sm:text-3xl">{group.category}</h2>
              <span className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
                {group.chapters.length} chapter{group.chapters.length === 1 ? '' : 's'}
              </span>
            </div>

            <div>
              {group.chapters.map((chapter) => {
                const isDone = progress.completedChapters.includes(chapter.id);
                return (
                  <Link
                    key={chapter.id}
                    href={`${basePath}/learn/${chapter.id}`}
                    className="db-index-row grid grid-cols-[44px_1fr_auto] gap-4 border-t px-5 py-5 sm:grid-cols-[64px_minmax(0,1fr)_150px_auto] sm:gap-5 sm:px-8"
                    style={{ borderColor: 'var(--db-border)' }}
                  >
                    <span className="db-num pt-0.5 text-2xl" style={{ color: isDone ? 'var(--db-ok)' : 'var(--db-primary)' }}>
                      {String(chapter.number).padStart(2, '0')}
                    </span>

                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="db-display-tight text-xl sm:text-2xl">{chapter.title}</span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1" style={{ color: 'var(--db-ok)' }}>
                            <Check className="h-3.5 w-3.5" />
                            <span className="db-kicker text-[8px]">Read</span>
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block max-w-[680px] text-[12px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>
                        {chapter.summary}
                      </span>
                      <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {chapter.concepts.slice(0, 3).map((concept) => (
                          <span key={concept} className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
                            {concept}
                          </span>
                        ))}
                      </span>
                    </span>

                    <span className="db-mono hidden text-[9px] leading-relaxed sm:block" style={{ color: 'var(--db-muted)' }}>
                      {chapter.estimatedMinutes} min
                      <br />
                      {chapter.difficulty}
                    </span>

                    <span className="flex items-start justify-end pt-1">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--db-muted)' }} />
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
          <p className="db-display-tight mt-3 text-3xl">Try a broader term.</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--db-muted)' }}>
            Search covers chapter titles, summaries, and concept names.
          </p>
        </div>
      )}
    </div>
  );
}
