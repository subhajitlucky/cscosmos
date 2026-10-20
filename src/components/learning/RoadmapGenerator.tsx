"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarRange, Clock3, Sparkles } from "lucide-react";
import { topics } from "@/data/topics";
import type { DomainKey } from "@/data/domains";
import type { TopicDifficulty } from "@/data/topic-meta";

type Goal = "interviews" | "contests" | "foundations" | "ai";
type Level = TopicDifficulty;

const GOALS: Array<{ value: Goal; label: string; description: string; domains: DomainKey[] }> = [
  {
    value: "interviews",
    label: "Interview prep",
    description: "DSA, backend fundamentals, and core CS",
    domains: ["dsa", "fullstack", "corecs"],
  },
  {
    value: "contests",
    label: "Competitive programming",
    description: "DSA depth and advanced problem solving",
    domains: ["dsa", "advanced"],
  },
  {
    value: "foundations",
    label: "CS foundations",
    description: "How systems, browsers, and networks work",
    domains: ["fullstack", "corecs", "devops"],
  },
  {
    value: "ai",
    label: "AI engineering",
    description: "Math, ML internals, and systems for AI",
    domains: ["ai", "corecs", "dsa"],
  },
];

const LEVELS: Array<{ value: Level; label: string }> = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const WEEKS = [4, 8, 12];
const HOURS = [5, 10, 15, 20];

const DIFFICULTY_ORDER: Record<Level, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

export function RoadmapGenerator() {
  const [goal, setGoal] = useState<Goal>("interviews");
  const [level, setLevel] = useState<Level>("beginner");
  const [weeks, setWeeks] = useState(8);
  const [weeklyHours, setWeeklyHours] = useState(10);

  const plan = useMemo(() => {
    const goalConfig = GOALS.find((item) => item.value === goal)!;
    const candidates = topics
      .filter(
        (topic) =>
          topic.status === "active" &&
          (goalConfig.domains.includes(topic.domain) ||
            topic.aliases?.some((alias) => goalConfig.domains.includes(alias)))
      )
      .sort((a, b) => {
        const byDifficulty =
          Math.abs(DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[level]) -
          Math.abs(DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[level]);
        if (byDifficulty !== 0) return byDifficulty;
        return a.estimatedMinutes - b.estimatedMinutes;
      });

    const capacity = weeklyHours * 60;
    const weeksPlan: Array<{ week: number; topics: typeof candidates; minutes: number }> = [];
    let cursor = 0;

    for (let week = 1; week <= weeks; week += 1) {
      const bucket: typeof candidates = [];
      let minutes = 0;

      while (cursor < candidates.length) {
        const topic = candidates[cursor];
        if (minutes + topic.estimatedMinutes > capacity && bucket.length > 0) break;
        bucket.push(topic);
        minutes += topic.estimatedMinutes;
        cursor += 1;
      }

      weeksPlan.push({ week, topics: bucket, minutes });
      if (cursor >= candidates.length) break;
    }

    return {
      weeks: weeksPlan,
      totalTopics: weeksPlan.reduce((sum, week) => sum + week.topics.length, 0),
      totalMinutes: weeksPlan.reduce((sum, week) => sum + week.minutes, 0),
    };
  }, [goal, level, weeks, weeklyHours]);

  return (
    <div className="space-y-6">
      <div className="glass-card space-y-5 rounded-2xl border p-5 sm:p-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            Goal
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {GOALS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setGoal(item.value)}
                aria-pressed={goal === item.value}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  goal === item.value
                    ? "border-foreground/40 bg-secondary/50"
                    : "border-border hover:border-foreground/25"
                }`}
              >
                <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {item.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Current level
            </p>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as Level)}
              className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none"
            >
              {LEVELS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Plan length
            </p>
            <select
              value={weeks}
              onChange={(event) => setWeeks(Number(event.target.value))}
              className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none"
            >
              {WEEKS.map((item) => (
                <option key={item} value={item}>
                  {item} weeks
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Weekly hours
            </p>
            <select
              value={weeklyHours}
              onChange={(event) => setWeeklyHours(Number(event.target.value))}
              className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none"
            >
              {HOURS.map((item) => (
                <option key={item} value={item}>
                  {item} hours
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card/60 px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {plan.totalTopics} topics
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {Math.round(plan.totalMinutes / 60)} planned hours
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarRange className="h-3.5 w-3.5" aria-hidden="true" />
          {plan.weeks.length} weeks
        </span>
      </div>

      <div className="space-y-3">
        {plan.weeks.map((week) => (
          <section key={week.week} className="glass-card rounded-2xl border p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-foreground">Week {week.week}</h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {Math.round(week.minutes / 60)}h · {week.topics.length} topics
              </span>
            </div>

            {week.topics.length > 0 ? (
              <div className="mt-3 divide-y divide-border/60">
                {week.topics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={topic.url || "/topics"}
                    className="group flex items-center justify-between gap-3 py-2.5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-foreground group-hover:text-primary">
                        {topic.name}
                      </span>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                        {topic.domain} · {topic.difficulty} · {topic.estimatedMinutes} min
                      </span>
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                Buffer week. Review notes, redo a lab, or catch up.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
