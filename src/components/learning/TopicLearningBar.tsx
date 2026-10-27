"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Bot, CheckCircle2, Circle, LineChart } from "lucide-react";
import {
  LEARNING_EVENT,
  markVisited,
  readLearningState,
  toggleBookmark,
  toggleCompleted,
} from "@/lib/local-learning";

interface TopicLearningBarProps {
  slug: string;
  name: string;
  domain: string;
}

export function TopicLearningBar({ slug, name, domain }: TopicLearningBarProps) {
  const [mounted, setMounted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const state = readLearningState();
    setBookmarked(state.bookmarks.includes(slug));
    setCompleted(state.completed.includes(slug));
    markVisited(slug);
    setMounted(true);

    const sync = () => {
      const next = readLearningState();
      setBookmarked(next.bookmarks.includes(slug));
      setCompleted(next.completed.includes(slug));
    };

    window.addEventListener(LEARNING_EVENT, sync);
    return () => window.removeEventListener(LEARNING_EVENT, sync);
  }, [slug]);

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        <span className="font-mono uppercase tracking-wider text-foreground/70">{domain}</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{name}</span>
        <span className="ml-2 hidden sm:inline">· progress saves on this device</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const next = toggleCompleted(slug);
            setCompleted(next.completed.includes(slug));
          }}
          aria-pressed={completed}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {completed ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
          {mounted && completed ? "Completed" : "Mark complete"}
        </button>

        <button
          type="button"
          onClick={() => {
            const next = toggleBookmark(slug);
            setBookmarked(next.bookmarks.includes(slug));
          }}
          aria-pressed={bookmarked}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          ) : (
            <Bookmark className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
          {mounted && bookmarked ? "Bookmarked" : "Bookmark"}
        </button>

        <Link
          href={`/tutor?topic=${encodeURIComponent(slug)}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Bot className="h-4 w-4" aria-hidden="true" />
          Tutor
        </Link>

        <Link
          href="/progress"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <LineChart className="h-4 w-4" aria-hidden="true" />
          Progress
        </Link>
      </div>
    </div>
  );
}
