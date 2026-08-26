'use client';

import { Link } from '@/components/visualizers/shared/RouterShim';
import { LESSONS } from '../data';

export default function Learn() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="mx-auto max-w-4xl px-5 pt-14 pb-8">
        <Link to="/" className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600 hover:underline dark:text-orange-400">
          &larr; Overview
        </Link>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Course: Threat Modeling</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Five short lessons. Read in order, or jump to whichever question keeps you up at night.
        </p>
      </header>
      <main className="mx-auto max-w-4xl px-5 pb-16">
        <ol className="space-y-3">
          {LESSONS.map((lesson, i) => (
            <li key={lesson.id}>
              <Link
                to={`/learn/${lesson.id}`}
                className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-400"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">Lesson {i + 1}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-500">{lesson.minutes} min</p>
                </div>
                <h2 className="mt-1.5 text-lg font-bold">{lesson.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{lesson.blurb}</p>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}