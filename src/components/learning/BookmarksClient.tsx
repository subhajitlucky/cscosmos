"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookmarkX } from "lucide-react";
import { topics } from "@/data/topics";
import { TopicCard } from "@/components/TopicCard";
import {
  LEARNING_EVENT,
  readLearningState,
  toggleBookmark,
  writeLearningState,
} from "@/lib/local-learning";

export function BookmarksClient() {
  const [mounted, setMounted] = useState(false);
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSlugs(readLearningState().bookmarks);
    sync();
    setMounted(true);
    window.addEventListener(LEARNING_EVENT, sync);
    return () => window.removeEventListener(LEARNING_EVENT, sync);
  }, []);

  const savedTopics = topics.filter((topic) => slugs.includes(topic.slug));

  if (!mounted) {
    return (
      <div className="glass-card rounded-2xl p-8 text-sm text-muted-foreground">
        Loading bookmarks…
      </div>
    );
  }

  if (savedTopics.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center">
        <p className="text-lg font-semibold text-foreground">No bookmarks yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Open any topic and press <strong>Bookmark</strong> to save it here.
        </p>
        <Link
          href="/topics"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Browse topics
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {savedTopics.length} saved {savedTopics.length === 1 ? "topic" : "topics"} · stored on this device
        </p>
        <button
          type="button"
          onClick={() => {
            const state = readLearningState();
            writeLearningState({ ...state, bookmarks: [] });
          }}
          className="text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Clear bookmarks
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savedTopics.map((topic) => (
          <div key={topic.catalogId} className="space-y-2">
            <TopicCard topic={topic} />
            <button
              type="button"
              onClick={() => toggleBookmark(topic.slug)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <BookmarkX className="h-3.5 w-3.5" aria-hidden="true" />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
