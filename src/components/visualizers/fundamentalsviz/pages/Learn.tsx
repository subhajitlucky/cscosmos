'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Search } from 'lucide-react';
import { itChapters, itTracks, type ITTrack } from '../data/curriculum';
import { useITProgress } from '../lib/progress';
import { useITBasePath } from '../components/ITShell';

export function Learn() {
  const basePath = useITBasePath();
  const { progress } = useITProgress();
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState<ITTrack | 'All'>('All');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return itChapters.filter((chapter) => {
      const matchesTrack = track === 'All' || chapter.track === track;
      const matchesTerm =
        term.length === 0 ||
        chapter.title.toLowerCase().includes(term) ||
        chapter.summary.toLowerCase().includes(term) ||
        chapter.concepts.some((concept) => concept.toLowerCase().includes(term));
      return matchesTrack && matchesTerm;
    });
  }, [query, track]);

  const grouped = useMemo(() => {
    return itTracks
      .map((item) => ({ track: item, chapters: filtered.filter((chapter) => chapter.track === item) }))
      .filter((group) => group.chapters.length > 0);
  }, [filtered]);

  const completed = progress.completedChapters.length;
  const percent = Math.round((completed / itChapters.length) * 100);
  const nextLesson = itChapters.find((chapter) => !progress.completedChapters.includes(chapter.id)) ?? itChapters[0];
  const started = completed > 0;
  const totalMinutes = itChapters.reduce((total, chapter) => total + chapter.estimatedMinutes, 0);

  return (
    <div className="it-frame mx-auto w-full max-w-[1240px]">
      <header className="border-b px-5 py-10 sm:px-8 sm:py-14" style={{ borderColor: 'var(--it-border)' }}>
        <div className="grid gap-8 md:grid-cols-[1fr_250px] md:items-end">
          <div>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Volume 01 · The tracks</p>
            <h1 className="it-display mt-4 text-[clamp(3.4rem,8vw,6.8rem)]">The whole system.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-[1.85] sm:text-base" style={{ color: 'var(--it-muted)' }}>
              Twenty-four chapters in six tracks. Start at the physical machine, move up through data
              and software, then finish with networks, security, and the business systems that use them.
            </p>
          </div>

          <div className="border-l pl-5" style={{ borderColor: 'var(--it-border)' }}>
            <div className="flex items-baseline justify-between">
              <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Completed</span>
              <span className="it-mono text-[10px]" style={{ color: 'var(--it-primary)' }}>{percent}%</span>
            </div>
            <div className="it-num mt-2 text-5xl">
              {String(completed).padStart(2, '0')}
              <span className="text-2xl" style={{ color: 'var(--it-muted)' }}> / 24</span>
            </div>
            <div className="it-progress-track mt-4">
              <div className="it-progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <p className="it-mono mt-3 text-[9px]" style={{ color: 'var(--it-muted)' }}>{Math.round(totalMinutes / 60)}h of guided reading</p>
          </div>
        </div>
      </header>

      <section className="border-b" style={{ borderColor: 'var(--it-border)' }}>
        <Link
          href={`${basePath}/learn/${nextLesson.id}`}
          className="group grid gap-4 px-5 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-8"
          style={{ backgroundColor: 'var(--it-primary-soft)' }}
        >
          <span className="it-kicker text-[9px]" style={{ color: 'var(--it-primary)' }}>{started ? 'Continue' : 'Start here'}</span>
          <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="it-mono text-[10px]" style={{ color: 'var(--it-muted)' }}>CH {String(nextLesson.number).padStart(2, '0')}</span>
            <span className="text-base font-semibold">{nextLesson.title}</span>
            <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{nextLesson.estimatedMinutes} min · {nextLesson.difficulty}</span>
          </span>
          <span className="it-label inline-flex items-center gap-2 text-[9px]" style={{ color: 'var(--it-primary)' }}>
            {started ? 'Resume' : 'Begin'} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      <section className="border-b px-5 py-5 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-end">
          <label className="block">
            <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Find a chapter</span>
            <span className="mt-2 flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--it-muted)' }} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, concept, or keyword" className="it-input" aria-label="Search chapters" />
            </span>
          </label>

          <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1 lg:justify-end" aria-label="Filter by track">
            {(['All', ...itTracks] as (ITTrack | 'All')[]).map((item) => {
              const active = track === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTrack(item)}
                  className="whitespace-nowrap border-b-2 px-2.5 py-2 text-[11px] font-semibold"
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
        {grouped.map((group, groupIndex) => (
          <section key={group.track} className="border-b" style={{ borderColor: 'var(--it-border)' }}>
            <div className="grid gap-3 px-5 py-5 sm:grid-cols-[64px_1fr_auto] sm:items-baseline sm:px-8" style={{ backgroundColor: 'var(--it-surface)' }}>
              <span className="it-kicker" style={{ color: 'var(--it-primary)' }}>{String(groupIndex + 1).padStart(2, '0')}</span>
              <h2 className="it-display-sm text-2xl sm:text-3xl">{group.track}</h2>
              <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{group.chapters.length} chapter{group.chapters.length === 1 ? '' : 's'}</span>
            </div>

            <div>
              {group.chapters.map((chapter) => {
                const isDone = progress.completedChapters.includes(chapter.id);
                return (
                  <Link
                    key={chapter.id}
                    href={`${basePath}/learn/${chapter.id}`}
                    className="it-index-row grid grid-cols-[44px_1fr_auto] gap-4 border-t px-5 py-5 sm:grid-cols-[64px_minmax(0,1fr)_140px_auto] sm:gap-5 sm:px-8"
                    style={{ borderColor: 'var(--it-border)' }}
                  >
                    <span className="it-num pt-0.5 text-2xl" style={{ color: isDone ? 'var(--it-ok)' : 'var(--it-primary)' }}>{String(chapter.number).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-xl font-bold tracking-tight sm:text-2xl">{chapter.title}</span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1" style={{ color: 'var(--it-ok)' }}>
                            <Check className="h-3.5 w-3.5" />
                            <span className="it-kicker text-[8px]">Read</span>
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block max-w-[680px] text-[12px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{chapter.summary}</span>
                      <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {chapter.concepts.slice(0, 3).map((concept) => (
                          <span key={concept} className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{concept}</span>
                        ))}
                      </span>
                    </span>
                    <span className="it-mono hidden text-[9px] leading-relaxed sm:block" style={{ color: 'var(--it-muted)' }}>{chapter.estimatedMinutes} min<br />{chapter.difficulty}</span>
                    <span className="flex items-start justify-end pt-1">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--it-muted)' }} />
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
          <p className="it-display-sm mt-3 text-3xl">Try a broader term.</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--it-muted)' }}>Search covers titles, summaries, and concept names.</p>
        </div>
      )}
    </div>
  );
}
