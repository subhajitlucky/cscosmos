'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Search, SlidersHorizontal } from 'lucide-react';
import { cCategories, cChapters, type CCategory } from '../data/curriculum';
import { useCProgress } from '../lib/progress';
import { useCBasePath } from '../components/CShell';

export function Learn() {
  const basePath = useCBasePath();
  const { progress } = useCProgress();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CCategory | 'All'>('All');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return cChapters.filter((chapter) => {
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
  const percent = Math.round((completed / cChapters.length) * 100);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-5 border-b pb-6 md:flex-row md:items-end md:justify-between" style={{ borderColor: 'var(--c-border)' }}>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--c-border)', color: 'var(--c-primary)', backgroundColor: 'var(--c-primary-soft)' }}>
            <BookOpen className="h-3.5 w-3.5" />
            C Programming curriculum
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">The C curriculum</h1>
          <p className="max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            Thirty-five lessons, from the character set to dynamic memory. Each lesson carries the core
            concepts, worked examples, common traps, and a quick check.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
            <span>Curriculum progress</span>
            <span className="font-bold" style={{ color: 'var(--c-primary)' }}>
              {completed} / {cChapters.length} · {percent}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: 'var(--c-primary)' }} />
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--c-muted)' }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chapters, concepts, keywords..."
            className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--c-primary)]"
            style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)', color: 'var(--c-text)' }}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--c-muted)' }} />
          {cCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className="whitespace-nowrap rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-semibold transition-colors"
              style={{
                borderColor: category === item ? 'var(--c-primary)' : 'var(--c-border)',
                backgroundColor: category === item ? 'var(--c-primary-soft)' : 'var(--c-surface)',
                color: category === item ? 'var(--c-primary)' : 'var(--c-muted)',
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
              style={{
                borderColor: isDone ? 'var(--c-ok)' : 'var(--c-border)',
                backgroundColor: 'var(--c-surface)',
              }}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold" style={{ color: 'var(--c-primary)' }}>
                  CHAPTER {String(chapter.number).padStart(2, '0')}
                </span>
              </div>

              <h2 className="flex-1 text-base font-bold leading-snug group-hover:text-[var(--c-primary)]">
                {chapter.title}
              </h2>

              <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--c-border)' }}>
                <span className="font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
                  ~{chapter.estimatedMinutes} min · {chapter.difficulty}
                </span>
                {isDone ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold" style={{ color: 'var(--c-ok)' }}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> done
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold" style={{ color: 'var(--c-primary)' }}>
                    open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center" style={{ borderColor: 'var(--c-border)' }}>
          <p className="font-mono text-sm font-bold">NO_CHAPTERS_MATCHED</p>
          <p className="mt-2 text-xs" style={{ color: 'var(--c-muted)' }}>
            Try a different keyword or clear the category filter.
          </p>
        </div>
      )}
    </div>
  );
}
