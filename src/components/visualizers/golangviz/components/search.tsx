"use client";

import { useMemo, useState } from "react";

import { chapters } from "@/components/visualizers/golangviz/lib/curriculum";

type Topic = {
  title: string;
  category: string;
  tags: string[];
  summary: string;
  href: string;
};

const topics: Topic[] = [
  ...chapters.map((c) => ({
    title: `${c.title} (chapter)`,
    category: c.category,
    tags: ["mdx", "lesson"],
    summary: c.summary,
    href: `/curriculum/${c.slug}`,
  })),
  {
    title: "Channels & Select (visual debugger)",
    category: "Concurrency",
    tags: ["send", "receive", "blocking"],
    summary: "Buffered vs unbuffered, blocking, and select fairness.",
    href: "/#visualizers",
  },
  {
    title: "Scheduler (G/M/P) timeline",
    category: "Concurrency",
    tags: ["goroutines", "work stealing"],
    summary: "Run queues, Ps, Ms, timers, and syscalls.",
    href: "/#visualizers",
  },
  {
    title: "Slices growth lab",
    category: "Memory",
    tags: ["cap", "append", "sharing"],
    summary: "Growth, reallocation, and aliasing pitfalls.",
    href: "/#visualizers",
  },
  {
    title: "GC lifecycle",
    category: "Runtime",
    tags: ["mark", "sweep", "assists"],
    summary: "Tri-color mark, assists, pacing, and safepoints.",
    href: "/content#curriculum",
  },
];

export function KnowledgeSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.summary.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="surface rounded-2xl p-5 shadow-lg shadow-blue-500/10 text-[var(--foreground)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-700 dark:text-blue-200">
            Search
          </p>
          <h3 className="text-lg font-semibold">
            Search topics, labs, and chapters
          </h3>
          <p className="text-sm text-[var(--muted)]">
            Client-side filter now; hook to a static index or edge search later.
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. channels, escape, GC..."
          className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--foreground)] shadow-inner focus:border-blue-400 focus:outline-none md:w-80"
        />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {results.map((topic) => (
          <a
            key={topic.title}
            href={topic.href}
            className="surface-ghost rounded-xl p-4 text-sm text-[var(--foreground)] transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-white">{topic.title}</span>
              <span className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase text-[var(--muted)]">
                {topic.category}
              </span>
            </div>
            <p className="mt-1 text-[var(--muted)]">{topic.summary}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-blue-800 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
        {results.length === 0 ? (
          <div className="surface-ghost rounded-xl p-4 text-sm text-[var(--muted)]">
            No results. Try a different keyword (e.g., “gc”, “pointers”).
          </div>
        ) : null}
      </div>
    </div>
  );
}

