"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { domains, domainPath } from "@/data/domains";
import { topics } from "@/data/topics";
import {
  LEARNING_EVENT,
  getCurrentStreak,
  getLongestStreak,
  readLearningState,
  type LearningState,
} from "@/lib/local-learning";

const EMPTY: LearningState = { bookmarks: [], completed: [], visited: {} };

export function ProgressDashboard() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<LearningState>(EMPTY);

  useEffect(() => {
    const sync = () => setState(readLearningState());
    sync();
    setMounted(true);
    window.addEventListener(LEARNING_EVENT, sync);
    return () => window.removeEventListener(LEARNING_EVENT, sync);
  }, []);

  const activeTopics = useMemo(() => topics.filter((topic) => topic.status === "active"), []);
  const completedCount = useMemo(
    () => activeTopics.filter((topic) => state.completed.includes(topic.slug)).length,
    [activeTopics, state.completed]
  );
  const visitedCount = useMemo(
    () => activeTopics.filter((topic) => Boolean(state.visited[topic.slug])).length,
    [activeTopics, state.visited]
  );
  const percent = activeTopics.length === 0 ? 0 : Math.round((completedCount / activeTopics.length) * 100);
  const currentStreak = getCurrentStreak(state.visited);
  const longestStreak = getLongestStreak(state.visited);

  const recent = useMemo(() => {
    return Object.entries(state.visited)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([slug, timestamp]) => ({
        topic: topics.find((topic) => topic.slug === slug),
        timestamp,
      }))
      .filter((item) => item.topic);
  }, [state.visited]);

  if (!mounted) {
    return <div className="glass-card rounded-2xl p-8 text-sm text-muted-foreground">Loading progress…</div>;
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Completed" value={`${completedCount}/${activeTopics.length}`} note="live modules" />
        <Stat label="Visited" value={String(visitedCount)} note="unique topics" />
        <Stat label="Current streak" value={`${currentStreak}d`} note="keep it alive" icon={<Flame className="h-4 w-4 text-orange-500" />} />
        <Stat label="Longest streak" value={`${longestStreak}d`} note="personal best" icon={<Trophy className="h-4 w-4 text-amber-500" />} />
      </div>

      <section className="glass-card rounded-2xl border border-border p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Overall progress</h2>
            <p className="text-sm text-muted-foreground">
              {percent}% of live topics marked complete
            </p>
          </div>
          <div className="text-3xl font-black text-foreground">{percent}%</div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">By domain</h2>
        <div className="space-y-3">
          {domains.map((domain) => {
            const domainTopics = activeTopics.filter((topic) => topic.domain === domain.domainKey);
            const done = domainTopics.filter((topic) => state.completed.includes(topic.slug)).length;
            const domainPercent = domainTopics.length === 0 ? 0 : Math.round((done / domainTopics.length) * 100);

            return (
              <div key={domain.domainKey} className="glass-card rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${domain.color}`} aria-hidden="true" />
                    <Link href={domainPath(domain.domainKey)} className="text-sm font-semibold text-foreground hover:underline">
                      {domain.name}
                    </Link>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {done}/{domainTopics.length} · {domainPercent}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-foreground/70" style={{ width: `${domainPercent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">Recent activity</h2>
          <div className="flex gap-3 text-sm font-semibold">
            <Link href="/bookmarks" className="text-muted-foreground hover:text-foreground">
              Bookmarks
            </Link>
            <Link href="/topics" className="text-muted-foreground hover:text-foreground">
              Browse topics
            </Link>
          </div>
        </div>

        {recent.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-sm text-muted-foreground">
            No activity yet. Open a topic and it will appear here.
          </div>
        ) : (
          <ul className="glass-card divide-y divide-border rounded-2xl border border-border">
            {recent.map(({ topic, timestamp }) => (
              <li key={topic!.slug} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <div>
                  <Link href={topic!.canonicalPath} className="text-sm font-semibold text-foreground hover:underline">
                    {topic!.name}
                  </Link>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{topic!.domain}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{note}</div>
    </div>
  );
}
