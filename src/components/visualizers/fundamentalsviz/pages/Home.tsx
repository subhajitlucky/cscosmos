'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Clock3 } from 'lucide-react';
import { itChapters } from '../data/curriculum';
import { IT_PROBLEM_COUNT } from '../data/mcq/counts';
import { useITProgress } from '../lib/progress';
import { useITBasePath } from '../components/ITShell';

export function Home() {
  const basePath = useITBasePath();
  const { progress } = useITProgress();
  const completed = progress.completedChapters.length;
  const percent = Math.round((completed / itChapters.length) * 100);
  const next = itChapters.find((chapter) => !progress.completedChapters.includes(chapter.id)) ?? itChapters[0];
  const totalMinutes = itChapters.reduce((total, chapter) => total + chapter.estimatedMinutes, 0);

  return (
    <div className="it-frame mx-auto w-full max-w-[1180px]">
      <header className="border-b px-5 py-8 sm:px-8 sm:py-10" style={{ borderColor: 'var(--it-border)' }}>
        <div className="grid gap-6 md:grid-cols-[1fr_240px] md:items-end">
          <div>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>All modules / Core CS</p>
            <h1 className="it-heading mt-3 text-[clamp(2.4rem,5vw,3.8rem)]">IT Fundamentals</h1>
            <p className="it-prose mt-3 max-w-[720px]">
              Computer blocks, memory and storage, number systems, Boolean algebra, microprocessors,
              software and MS Office.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="it-label flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--it-muted)' }}>
                <Clock3 className="h-3.5 w-3.5" /> {itChapters.length} topics · {totalMinutes} min
              </span>
              <span className="it-label text-[11px]" style={{ color: 'var(--it-muted)' }}>
                {IT_PROBLEM_COUNT} practice questions
              </span>
            </div>
          </div>

          <div className="border-l pl-5" style={{ borderColor: 'var(--it-border)' }}>
            <div className="flex items-baseline justify-between">
              <span className="it-label text-[11px]" style={{ color: 'var(--it-muted)' }}>Completed</span>
              <span className="it-mono text-[11px]" style={{ color: 'var(--it-primary)' }}>{percent}%</span>
            </div>
            <div className="it-num mt-1 text-4xl">
              {completed}
              <span className="text-xl" style={{ color: 'var(--it-muted)' }}> / {itChapters.length}</span>
            </div>
            <div className="it-progress-track mt-3">
              <div className="it-progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </header>

      <section className="border-b px-5 py-5 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link href={`${basePath}/learn/${next.id}`} className="it-btn it-btn-solid">
              {completed > 0 ? 'Continue studying' : 'Start studying'} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href={`${basePath}/problems`} className="it-btn">
              Practise module
            </Link>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--it-muted)' }}>
            Each topic is an 8-minute read with worked examples.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between border-b px-5 py-4 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
          <h2 className="it-section-title">Study notes</h2>
          <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>{completed} / {itChapters.length} completed</span>
        </div>

        <div>
          {itChapters.map((chapter) => {
            const isDone = progress.completedChapters.includes(chapter.id);
            return (
              <Link
                key={chapter.id}
                href={`${basePath}/learn/${chapter.id}`}
                className="it-topic-row grid gap-3 border-b px-5 py-5 sm:grid-cols-[42px_minmax(0,1fr)_120px] sm:gap-5 sm:px-8"
                style={{ borderColor: 'var(--it-border)' }}
              >
                <span className="it-num text-2xl" style={{ color: isDone ? 'var(--it-ok)' : 'var(--it-primary)' }}>
                  {String(chapter.number).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="it-heading text-[1.05rem] leading-snug sm:text-[1.15rem]">{chapter.title}</span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1" style={{ color: 'var(--it-ok)' }}>
                        <Check className="h-3.5 w-3.5" />
                        <span className="it-label text-[10px]">Completed</span>
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[12px] italic" style={{ color: 'var(--it-muted)' }}>{chapter.subtitle}</span>
                  <span className="mt-2 block max-w-[720px] text-[14px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{chapter.summary}</span>
                </span>
                <span className="flex items-start justify-between gap-2 sm:flex-col sm:items-end">
                  <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>{chapter.estimatedMinutes} min read</span>
                  <span className="it-label inline-flex items-center gap-1 text-[10px]" style={{ color: 'var(--it-primary)' }}>
                    {isDone ? 'Re-read' : 'Read'} <ArrowRight className="h-3 w-3" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-0 border-b md:grid-cols-2" style={{ borderColor: 'var(--it-border)' }}>
        <div className="border-b px-5 py-6 sm:px-8 md:border-b-0 md:border-r" style={{ borderColor: 'var(--it-border)' }}>
          <h2 className="it-section-title">Practice</h2>
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
            {IT_PROBLEM_COUNT} questions across the seven topics, with an explanation for every answer.
          </p>
          <Link href={`${basePath}/problems`} className="it-link mt-3 inline-flex items-center gap-1 text-[13px]">
            Open the question bank <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="px-5 py-6 sm:px-8">
          <h2 className="it-section-title">Tools</h2>
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
            A block diagram, a number-system converter, and a logic-gate bench.
          </p>
          <Link href={`${basePath}/lab`} className="it-link mt-3 inline-flex items-center gap-1 text-[13px]">
            Open the tools <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
