'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Play, Search, SlidersHorizontal } from 'lucide-react';
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

  const completed = progress.completedChapters.length;
  const percent = Math.round((completed / dbmsChapters.length) * 100);
  const nextLesson =
    dbmsChapters.find((chapter) => !progress.completedChapters.includes(chapter.id)) ??
    dbmsChapters[0];
  const hasStarted = completed > 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-5 border-b pb-6 md:flex-row md:items-end md:justify-between" style={{ borderColor: 'var(--db-border)' }}>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--db-border)', color: 'var(--db-primary)', backgroundColor: 'var(--db-primary-soft)' }}>
            <BookOpen className="h-3.5 w-3.5" />
            DBMS curriculum
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">The database curriculum</h1>
          <p className="max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--db-muted)' }}>
            Thirty-two lessons from data models to distributed analytics. Each lesson carries the core
            concepts, worked examples, common traps, and a quick check.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px]" style={{ color: 'var(--db-muted)' }}>
            <span>Curriculum progress</span>
            <span className="font-bold" style={{ color: 'var(--db-primary)' }}>{completed} / {dbmsChapters.length} · {percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: 'var(--db-primary)' }} />
          </div>
        </div>
      </div>

      <Link
        href={`${basePath}/learn/${nextLesson.id}`}
        className="group mb-6 flex flex-col gap-3 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'var(--db-primary)', backgroundColor: 'var(--db-primary-soft)' }}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--db-primary)', color: '#fff' }}>
            <Play className="h-4 w-4" />
          </span>
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--db-primary)' }}>
              {hasStarted ? 'Continue where you left off' : 'Start here'}
            </p>
            <h2 className="mt-0.5 text-base font-bold">Lesson {String(nextLesson.number).padStart(2, '0')} · {nextLesson.title}</h2>
            <p className="mt-0.5 text-[11px]" style={{ color: 'var(--db-muted)' }}>~{nextLesson.estimatedMinutes} min · {nextLesson.difficulty}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--db-primary)' }}>
          {hasStarted ? 'Continue' : 'Begin'} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--db-muted)' }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons, concepts, keywords..."
            className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[var(--db-primary)]"
            style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)', color: 'var(--db-text)' }}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--db-muted)' }} />
          {dbmsCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className="whitespace-nowrap rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-semibold"
              style={{
                borderColor: category === item ? 'var(--db-primary)' : 'var(--db-border)',
                backgroundColor: category === item ? 'var(--db-primary-soft)' : 'var(--db-surface)',
                color: category === item ? 'var(--db-primary)' : 'var(--db-muted)',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((chapter) => {
          const isDone = progress.completedChapters.includes(chapter.id);
          return (
            <Link
              key={chapter.id}
              href={`${basePath}/learn/${chapter.id}`}
              className="group flex flex-col rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: isDone ? 'var(--db-ok)' : 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold" style={{ color: 'var(--db-primary)' }}>LESSON {String(chapter.number).padStart(2, '0')}</span>
              </div>
              <h2 className="flex-1 text-base font-bold leading-snug group-hover:text-[var(--db-primary)]">{chapter.title}</h2>
              <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--db-border)' }}>
                <span className="font-mono text-[10px]" style={{ color: 'var(--db-muted)' }}>~{chapter.estimatedMinutes} min · {chapter.difficulty}</span>
                {isDone ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold" style={{ color: 'var(--db-ok)' }}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> done
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold" style={{ color: 'var(--db-primary)' }}>
                    open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center" style={{ borderColor: 'var(--db-border)' }}>
          <p className="font-mono text-sm font-bold">NO_LESSONS_MATCHED</p>
        </div>
      )}
    </div>
  );
}
