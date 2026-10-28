"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Bot,
  CheckCircle2,
  Circle,
  LineChart,
} from "lucide-react";
import { domains } from "@/data/domains";
import { cn } from "@/lib/utils";
import {
  LEARNING_EVENT,
  markVisited,
  readLearningState,
  toggleBookmark,
  toggleCompleted,
} from "@/lib/local-learning";

interface TopicActionBarProps {
  slug: string;
  name: string;
  domain: string;
  showBreadcrumb?: boolean;
  className?: string;
}

const actionClass =
  "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function TopicActionBar({
  slug,
  name,
  domain,
  showBreadcrumb = true,
  className,
}: TopicActionBarProps) {
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

  const domainName = domains.find((item) => item.domainKey === domain)?.name ?? domain;

  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-2 border-b border-border/70 pb-3 lg:mb-6 lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between",
        className,
      )}
    >
      {showBreadcrumb && (
      <nav
        aria-label={`Breadcrumb for ${name}`}
        className="flex min-w-0 flex-1 flex-nowrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
      >
        <Link
          href="/"
          className="whitespace-nowrap transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          CSCosmos
        </Link>
        <span className="text-border" aria-hidden="true">/</span>
        <Link
          href={`/${domain}`}
          className="truncate whitespace-nowrap transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {domainName}
        </Link>
      </nav>
      )}

      <div
        className={cn(
          "flex flex-wrap items-center gap-0.5 lg:flex-nowrap lg:shrink-0",
          !showBreadcrumb && "w-full justify-end",
        )}
      >
        <button
          type="button"
          onClick={() => {
            const next = toggleCompleted(slug);
            setCompleted(next.completed.includes(slug));
          }}
          aria-pressed={completed}
          aria-label={completed ? 'Topic completed' : 'Mark topic complete'}
          title={completed ? 'Topic completed' : 'Mark topic complete'}
          className={actionClass}
        >
          {completed ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          ) : (
            <Circle className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{mounted && completed ? "Completed" : "Mark complete"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const next = toggleBookmark(slug);
            setBookmarked(next.bookmarks.includes(slug));
          }}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark topic'}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark topic'}
          className={actionClass}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{mounted && bookmarked ? "Bookmarked" : "Bookmark"}</span>
        </button>

        <span className="mx-1 hidden h-4 w-px bg-border/70 sm:block" aria-hidden="true" />

        <Link
          href={`/tutor?topic=${encodeURIComponent(slug)}`}
          aria-label="Open AI tutor"
          title="Open AI tutor"
          className={actionClass}
        >
          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Tutor</span>
        </Link>

        <Link href="/progress" aria-label="View progress" title="View progress" className={actionClass}>
          <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Progress</span>
        </Link>
      </div>
    </div>
  );
}
