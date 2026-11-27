'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Search, SlidersHorizontal } from 'lucide-react';
import { osCategories, osChapters, type OSCategory } from '../data/curriculum';
import { useOSProgress } from '../lib/progress';
import { useOSBasePath } from '../components/OSShell';

export function Learn() {
  const basePath = useOSBasePath();
  const { progress } = useOSProgress();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<OSCategory | 'All'>('All');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return osChapters.filter((chapter) => {
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
  const percent = Math.round((completed / osChapters.length) * 100);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-5 border-b pb-6 md:flex-row md:items-end md:justify-between" style={{ borderColor: 'var(--os-border)' }}>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--os-border)', color: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)' }}>
            <BookOpen className="h-3.5 w-3.5" />
            Operating Systems curriculum
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">The kernel curriculum</h1>
          <p className="max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--os-muted)' }}>
            Twelve lessons from the resource manager to the file system. Each lesson carries the core
            concepts, worked examples, common traps, and a quick check.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
            <span>Curriculum progress</span>
            <span className="font-bold" style={{ color: 'var(--os-primary)' }}>
              {completed} / {osChapters.length} · {percent}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: 'var(--os-primary)' }} />
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--os-muted)' }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons, concepts, keywords..."
            className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--os-primary)]"
            style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)', color: 'var(--os-text)' }}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--os-muted)' }} />
          {osCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className="whitespace-nowrap rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-semibold transition-colors"
              style={{
                borderColor: category === item ? 'var(--os-primary)' : 'var(--os-border)',
                backgroundColor: category === item ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                color: category === item ? 'var(--os-primary)' : 'var(--os-muted)',
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
                borderColor: isDone ? 'var(--os-ok)' : 'var(--os-border)',
                backgroundColor: 'var(--os-surface)',
              }}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold" style={{ color: 'var(--os-primary)' }}>
                  LESSON {String(chapter.number).padStart(2, '0')}
                </span>
              </div>

              <h2 className="flex-1 text-base font-bold leading-snug group-hover:text-[var(--os-primary)]">
                {chapter.title}
              </h2>

              <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--os-border)' }}>
                <span className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                  ~{chapter.estimatedMinutes} min · {chapter.difficulty}
                </span>
                {isDone ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold" style={{ color: 'var(--os-ok)' }}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> done
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold" style={{ color: 'var(--os-primary)' }}>
                    open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center" style={{ borderColor: 'var(--os-border)' }}>
          <p className="font-mono text-sm font-bold">NO_LESSONS_MATCHED</p>
          <p className="mt-2 text-xs" style={{ color: 'var(--os-muted)' }}>
            Try a different keyword or clear the category filter.
          </p>
        </div>
      )}
    </div>
  );
}
