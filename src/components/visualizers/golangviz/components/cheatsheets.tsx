"use client";

import { useState } from "react";

type Sheet = {
  title: string;
  summary: string;
  link: string;
};

const sheets: Sheet[] = [
  {
    title: "Go Basics",
    summary: "Types, control flow, functions, errors.",
    link: "/notes.pdf",
  },
  {
    title: "Concurrency",
    summary: "Goroutines, channels, select, mutexes, waitgroups.",
    link: "/notes.pdf",
  },
  {
    title: "Runtime & Memory",
    summary: "Stack vs heap, escape analysis, GC lifecycle.",
    link: "/notes.pdf",
  },
  {
    title: "Tooling",
    summary: "Modules, testing, benchmarking, profiling.",
    link: "/notes.pdf",
  },
];

export function CheatSheets() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyLink = (link: string) => {
    navigator.clipboard?.writeText(window.location.origin + link).catch(() => {
      /* ignore clipboard errors */
    });
    setCopied(link);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="surface rounded-2xl p-5 shadow-lg shadow-emerald-500/10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-[var(--foreground)]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">
            Cheat sheets & Downloads
          </p>
          <h3 className="text-lg font-semibold">Grab-and-go refs</h3>
          <p className="text-sm text-[var(--muted)]">
            Printable PDFs for quick review (placeholder PDF included).
          </p>
        </div>
        <a
          href="/notes.pdf"
          download
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow"
        >
          Download sample PDF
        </a>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {sheets.map((sheet) => (
          <div
            key={sheet.title}
            className="flex items-center justify-between rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-sm text-[var(--foreground)]"
          >
            <div>
              <div className="font-semibold">{sheet.title}</div>
              <p className="text-[var(--muted)]">{sheet.summary}</p>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <a
                href={sheet.link}
                download
                className="rounded-full border border-[var(--panel-border)] bg-[var(--background)] px-3 py-2 font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
              >
                Download
              </a>
              <button
                onClick={() => copyLink(sheet.link)}
                className="rounded-full border border-[var(--panel-border)] bg-[var(--background)] px-3 py-2 font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
              >
                {copied === sheet.link ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

