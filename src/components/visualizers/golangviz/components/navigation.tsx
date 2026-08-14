"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useGoProgress } from "../lib/useGoProgress";
import { ArrowLeft, BookOpen, CheckCircle2, Cpu, Play } from "lucide-react";

const links = [
  { href: "/golangviz", label: "Home" },
  { href: "/golangviz/path", label: "70 Concepts" },
  { href: "/golangviz/labs", label: "Coding Labs" },
  { href: "/golangviz/flashcards", label: "Flashcards" },
  { href: "/golangviz/pitfalls", label: "Pitfalls" },
  { href: "/golangviz/playground", label: "Playground" },
  { href: "/golangviz/cheatsheet", label: "Cheat Sheet" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { completedCount, totalConcepts, percentage, nextUncompletedConcept } = useGoProgress();
  const filteredLinks = useMemo(() => links.map((link) => ({ ...link })), []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--panel-border)] bg-[color-mix(in srgb, var(--background) 90%, transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand and Hub Backlink */}
        <div className="flex items-center gap-3">
          <Link
            href="/topics"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 bg-background border border-[var(--panel-border)] px-3 py-1.5 rounded-full transition-all hover:border-[var(--accent)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>CSCosmos</span>
          </Link>
          <Link href="/golangviz" className="flex items-center gap-2 text-base font-semibold tracking-tight text-[var(--foreground)] group">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold text-lg text-[var(--foreground)]">Golang<span className="text-blue-500">Viz</span></span>
          </Link>
        </div>

        {/* Progress Tracker Pill in Navigation */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--panel)] border border-[var(--panel-border)] text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-[var(--foreground)]">Progress:</span>
          <span className="font-mono text-[var(--muted)]">{completedCount}/{totalConcepts} ({percentage}%)</span>
          <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ml-1">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {nextUncompletedConcept && (
            <Link
              href={`/golangviz/concepts/${nextUncompletedConcept.slug}`}
              className="ml-2 font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Resume</span>
              <Play className="w-2.5 h-2.5 fill-current" />
            </Link>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-3 text-sm text-[var(--foreground)] md:flex">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 font-medium text-[var(--foreground)] opacity-80 transition hover:opacity-100 hover:text-[var(--foreground)] hover:bg-[var(--panel)] hover:border hover:border-[var(--panel-border)]"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <a
            href="https://github.com/subhajitlucky/golangviz"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-[var(--panel-border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]"
          >
            GitHub
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden rounded-md border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--panel-border)] bg-[color-mix(in srgb, var(--background) 95%, transparent)] px-4 pb-4 pt-2 text-sm text-[var(--foreground)] md:hidden">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--panel)] border border-[var(--panel-border)] text-xs mb-1">
              <span className="font-semibold">Your Progress:</span>
              <span className="font-mono text-emerald-500 font-bold">{completedCount}/{totalConcepts} ({percentage}%)</span>
            </div>

            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 transition hover:bg-[var(--panel)]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <ThemeToggle />
              <a
                href="https://github.com/subhajitlucky/golangviz"
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-md border border-[var(--panel-border)] px-3 py-2 text-center font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                onClick={() => setOpen(false)}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
