'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles.css';
import { computerOrganizationChapters, type ComputerChapter } from '../data/chapters';

const STORAGE_KEY = 'co:completed-chapters';

export interface ComputerOrganizationLearnProps {
  basePath?: string;
}

// Learning path: chapters grouped by the block-diagram category they belong to,
// with progress kept locally so a reader can resume without an account.
export function ComputerOrganizationLearn({
  basePath = '/corecs/computer-organization',
}: ComputerOrganizationLearnProps) {
  const [completed, setCompleted] = useState<string[]>([]);
  const total = computerOrganizationChapters.length;

  // localStorage is a browser API: read it only after mount (SSG safety).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const validIds = new Set(computerOrganizationChapters.map((chapter) => chapter.id));
          setCompleted([
            ...new Set(
              parsed.filter(
                (id): id is string => typeof id === 'string' && validIds.has(id),
              ),
            ),
          ]);
        }
      }
    } catch {
      /* ignore malformed or unavailable storage */
    }
  }, []);

  const toggle = (chapterId: string) => {
    setCompleted((prev) => {
      const next = prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* storage may be unavailable (private mode, quota); progress still works in memory */
        }
      }
      return next;
    });
  };

  const categories = Array.from(new Set(computerOrganizationChapters.map((c) => c.category)));
  const byCategory = categories.map((category) => ({
    category,
    chapters: computerOrganizationChapters.filter((chapter) => chapter.category === category),
  }));

  return (
    <div className="co-root min-h-screen px-6 py-12">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Learning path</h1>
        <p className="co-muted mt-2">
          {completed.length} / {total} chapters complete
        </p>
        <div
          className="mt-4 rounded-full border border-[var(--co-line)] p-1"
          role="progressbar"
          aria-label="Chapters completed"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={completed.length}
        >
          <div
            className="h-2 rounded-full bg-[var(--co-copper)]"
            style={{ width: `${(completed.length / total) * 100}%` }}
          />
        </div>
        <p className="co-muted mt-3 text-sm">
          Each chapter ends with an interactive. Earlier chapters are prerequisites for later ones.
        </p>

        {byCategory.map(({ category, chapters }) => (
          <section key={category} className="mt-8">
            <h2 className="text-xl font-semibold">{category}</h2>
            <ol className="mt-3 grid gap-3 sm:grid-cols-2">
              {chapters.map((chapter: ComputerChapter) => (
                <li key={chapter.id} className="co-card co-chapter">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`${basePath}/learn/${chapter.id}`} className="font-semibold">
                      <span className="co-num">{chapter.number}.</span> {chapter.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggle(chapter.id)}
                      aria-label={`Mark ${chapter.title} as done`}
                      aria-pressed={completed.includes(chapter.id)}
                      className="co-chip shrink-0"
                    >
                      {completed.includes(chapter.id) ? 'Completed' : 'Mark done'}
                    </button>
                  </div>
                  <p className="co-muted mt-2 text-sm">{chapter.summary}</p>
                  <p className="co-chip mt-3">{chapter.minutes} min · {chapter.interactive.replace(/-/g, ' ')}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </section>
    </div>
  );
}
