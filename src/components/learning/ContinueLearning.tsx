"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, History } from "lucide-react";
import { topics } from "@/data/topics";
import { readLearningState, LEARNING_EVENT } from "@/lib/local-learning";

export function ContinueLearning() {
  const [slug, setSlug] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => {
      const state = readLearningState();
      const recent = Object.entries(state.visited).sort(([, a], [, b]) => b - a)[0];
      setSlug(recent?.[0] ?? null);
      setTimestamp(recent?.[1] ?? null);
    };
    sync();
    window.addEventListener(LEARNING_EVENT, sync);
    return () => window.removeEventListener(LEARNING_EVENT, sync);
  }, []);

  const topic = slug ? topics.find((item) => item.slug === slug) : undefined;
  if (!topic) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/40">
          <History className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            Continue learning
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{topic.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {topic.domain} · {timestamp ? new Date(timestamp).toLocaleDateString() : "recently viewed"}
          </p>
        </div>
      </div>
      <Link
        href={topic.url || `/topics`}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3.5 text-xs font-semibold text-foreground transition-colors hover:border-foreground/30 hover:bg-secondary/40"
      >
        Resume topic
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
