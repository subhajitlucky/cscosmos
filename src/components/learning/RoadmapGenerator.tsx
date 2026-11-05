"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Server,
  Globe,
  Cpu,
  Brain,
  Workflow,
  ShieldCheck,
  Database,
  Terminal,
  Smartphone,
  ArrowRight,
  CalendarRange,
  Clock3,
  Sparkles,
  Zap,
  BookOpen,
} from "lucide-react";
import {
  ROLE_ROADMAPS,
  type RoleRoadmap,
  type StageLevel,
  getEnrichedStages,
} from "@/data/role-roadmaps";

const ROLE_ICONS: Record<RoleRoadmap["icon"], React.ComponentType<{ className?: string }>> = {
  Layers,
  Server,
  Globe,
  Cpu,
  Brain,
  Workflow,
  ShieldCheck,
  Database,
  Terminal,
  Smartphone,
};

const STAGE_BADGE_STYLES: Record<StageLevel, { border: string; bg: string; text: string; dot: string }> = {
  Basic: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Intermediate: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    text: "text-sky-500 dark:text-sky-400",
    dot: "bg-sky-500",
  },
  Advanced: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-500 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Expert: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-500 dark:text-purple-400",
    dot: "bg-purple-500",
  },
};

const SPRINT_WEEKS = [4, 8, 12, 16];
const SPRINT_HOURS = [5, 10, 15, 20];

export function RoadmapGenerator() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("fullstack");
  const [levelFilter, setLevelFilter] = useState<StageLevel | "all">("all");
  const [onlyInteractive, setOnlyInteractive] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"stages" | "sprint">("stages");

  // Pacing options for sprint view
  const [sprintWeeks, setSprintWeeks] = useState(8);
  const [sprintWeeklyHours, setSprintWeeklyHours] = useState(10);

  const selectedRole = useMemo(() => {
    return ROLE_ROADMAPS.find((r) => r.id === selectedRoleId) || ROLE_ROADMAPS[0];
  }, [selectedRoleId]);

  const enrichedStages = useMemo(() => {
    return getEnrichedStages(selectedRole);
  }, [selectedRole]);

  // Aggregate stats
  const allRoleTopics = useMemo(() => {
    return enrichedStages.flatMap((s) => s.topics);
  }, [enrichedStages]);

  const totalRoleTopics = allRoleTopics.length;
  const totalActiveEngines = allRoleTopics.filter((t) => t.status === "active").length;
  const totalHours = Math.round(allRoleTopics.reduce((acc, t) => acc + t.estimatedMinutes, 0) / 60);

  // Filtered stages for Stages view
  const displayedStages = useMemo(() => {
    return enrichedStages
      .filter((stage) => levelFilter === "all" || stage.level === levelFilter)
      .map((stage) => ({
        ...stage,
        topics: stage.topics.filter((topic) => !onlyInteractive || topic.status === "active"),
      }))
      .filter((stage) => stage.topics.length > 0);
  }, [enrichedStages, levelFilter, onlyInteractive]);

  // Week-by-week calendar plan for Sprint view
  const sprintPlan = useMemo(() => {
    const candidateTopics = allRoleTopics.filter((topic) => !onlyInteractive || topic.status === "active");
    const capacityMinutes = sprintWeeklyHours * 60;
    const weeksList: Array<{ week: number; topics: typeof candidateTopics; minutes: number }> = [];
    let cursor = 0;

    for (let week = 1; week <= sprintWeeks; week += 1) {
      const bucket: typeof candidateTopics = [];
      let minutes = 0;

      while (cursor < candidateTopics.length) {
        const topic = candidateTopics[cursor];
        if (minutes + topic.estimatedMinutes > capacityMinutes && bucket.length > 0) break;
        bucket.push(topic);
        minutes += topic.estimatedMinutes;
        cursor += 1;
      }

      weeksList.push({ week, topics: bucket, minutes });
      if (cursor >= candidateTopics.length) break;
    }

    return {
      weeks: weeksList,
      totalAssignedTopics: weeksList.reduce((sum, w) => sum + w.topics.length, 0),
      totalPlannedMinutes: weeksList.reduce((sum, w) => sum + w.minutes, 0),
    };
  }, [allRoleTopics, onlyInteractive, sprintWeeks, sprintWeeklyHours]);

  const CurrentRoleIcon = ROLE_ICONS[selectedRole.icon] || Layers;

  return (
    <div className="space-y-8">
      {/* 1. Top 10 Career Track Selector Grid */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            Top 10 Industry Engineering Roles
          </p>
          <span className="text-xs text-muted-foreground font-mono">
            {ROLE_ROADMAPS.length} Core Career Paths
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-5 xl:grid-cols-10">
          {ROLE_ROADMAPS.map((role) => {
            const Icon = ROLE_ICONS[role.icon];
            const isSelected = selectedRoleId === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRoleId(role.id);
                  setLevelFilter("all");
                }}
                className={`group flex flex-col items-start justify-between rounded-xl border p-2.5 text-left transition-all duration-150 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40 dark:bg-primary/15"
                    : "border-border/80 bg-card hover:border-foreground/30 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                      isSelected
                        ? "border-primary/40 bg-primary/20 text-primary"
                        : "border-border/60 bg-muted/60 text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-2 w-full">
                  <span
                    className={`block text-xs font-bold tracking-tight truncate ${
                      isSelected ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"
                    }`}
                  >
                    {role.shortTitle}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground font-mono">
                    {role.stages.reduce((acc, s) => acc + s.slugs.length, 0)} topics
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Active Role Hero Card */}
      <section className="glass-card rounded-2xl border border-border/80 p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-mono font-medium text-primary">
                <CurrentRoleIcon className="h-3.5 w-3.5" />
                Track: {selectedRole.shortTitle}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Curated Step-by-Step Pathway
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {selectedRole.title}
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {selectedRole.tagline}
              </p>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed">
              {selectedRole.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mr-1">
                Target Roles:
              </span>
              {selectedRole.targetRoles.map((job) => (
                <span
                  key={job}
                  className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {job}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Badge Panel */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 lg:w-72 shrink-0">
            <div className="rounded-xl border border-border/70 bg-card/60 p-3">
              <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                Curriculum
              </span>
              <span className="mt-1 block text-xl font-black text-foreground">
                {totalRoleTopics}
              </span>
              <span className="text-[10px] text-muted-foreground">curated topics</span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
              <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Zap className="h-3 w-3" />
                Interactive
              </span>
              <span className="mt-1 block text-xl font-black text-emerald-600 dark:text-emerald-400">
                {totalActiveEngines}
              </span>
              <span className="text-[10px] text-muted-foreground">live visualizers</span>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-3">
              <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <Clock3 className="h-3 w-3" />
                Study Time
              </span>
              <span className="mt-1 block text-xl font-black text-foreground">
                ~{totalHours}h
              </span>
              <span className="text-[10px] text-muted-foreground">total duration</span>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-3">
              <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <Layers className="h-3 w-3" />
                Milestones
              </span>
              <span className="mt-1 block text-xl font-black text-foreground">
                4 Stages
              </span>
              <span className="text-[10px] text-muted-foreground">Basic → Expert</span>
            </div>
          </div>
        </div>

        {/* 3. Controls & View Toggles */}
        <div className="border-t border-border/60 pt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setViewMode("stages")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "stages"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Progressive Stages (Basic to Expert)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("sprint")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "sprint"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarRange className="h-3.5 w-3.5" />
              Weekly Sprints Planner
            </button>
          </div>

          {/* Interactive Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={onlyInteractive}
              onChange={(e) => setOnlyInteractive(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
            />
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Only show live visualizer engines
            </span>
          </label>
        </div>

        {/* Secondary filters depending on view mode */}
        {viewMode === "stages" ? (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mr-1">
              Filter by Level:
            </span>
            {(["all", "Basic", "Intermediate", "Advanced", "Expert"] as const).map((lvl) => {
              const active = levelFilter === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-foreground/40 bg-foreground text-background font-semibold"
                      : "border-border/80 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {lvl === "all" ? "All Levels" : lvl}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 pt-1 border-t border-border/40">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Plan Duration
              </label>
              <select
                value={sprintWeeks}
                onChange={(e) => setSprintWeeks(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                {SPRINT_WEEKS.map((w) => (
                  <option key={w} value={w}>
                    {w} Weeks Plan
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Weekly Study Time
              </label>
              <select
                value={sprintWeeklyHours}
                onChange={(e) => setSprintWeeklyHours(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                {SPRINT_HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h} Hours / Week
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      {/* 4. Main Roadmap Content */}
      {viewMode === "stages" ? (
        /* Stages View: Basic to Expert */
        <div className="space-y-8">
          {displayedStages.map((stage) => {
            const badge = STAGE_BADGE_STYLES[stage.level];
            return (
              <section
                key={stage.stageIndex}
                className="glass-card rounded-2xl border border-border/80 overflow-hidden shadow-sm"
              >
                {/* Stage Header */}
                <div className="border-b border-border/60 bg-muted/20 p-4 sm:p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${badge.border} ${badge.bg} ${badge.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          Stage {stage.stageIndex} · {stage.level}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {stage.topics.length} topics
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground sm:text-xl">
                        {stage.name}
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-3xl">
                        {stage.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                      <span className="text-xs font-mono text-muted-foreground">
                        ~{Math.round(stage.totalMinutes / 60)}h study time
                      </span>
                    </div>
                  </div>
                </div>

                {/* Topics Grid */}
                <div className="p-4 sm:p-6">
                  <div className="grid gap-3.5 md:grid-cols-2">
                    {stage.topics.map((topic) => {
                      const isActive = topic.status === "active";
                      return (
                        <div
                          key={topic.slug}
                          className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/70 p-4 transition-all duration-150 hover:border-foreground/30 hover:shadow-md"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-bold text-muted-foreground/80">
                                #{String(topic.stepNumber).padStart(2, "0")}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                  {topic.domain}
                                </span>
                                {isActive ? (
                                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Interactive
                                  </span>
                                ) : (
                                  <span className="rounded-md border border-border bg-muted/20 px-2 py-0.5 text-[10px] text-muted-foreground">
                                    Guide
                                  </span>
                                )}
                              </div>
                            </div>

                            <Link
                              href={topic.canonicalPath}
                              className="block text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2"
                            >
                              {topic.name}
                            </Link>

                            {topic.prerequisites && topic.prerequisites.length > 0 && (
                              <p className="text-[11px] text-muted-foreground/90 font-mono">
                                <span className="text-muted-foreground/60">Prereq: </span>
                                {topic.prerequisites.slice(0, 2).join(", ")}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                            <span className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                              <Clock3 className="h-3 w-3" />
                              {topic.estimatedMinutes} min
                            </span>

                            <Link
                              href={topic.canonicalPath}
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                                isActive
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                  : "bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {isActive ? "Launch Engine" : "Read Guide"}
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Sprint View: Week by Week Schedule */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card/60 px-4 py-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {sprintPlan.totalAssignedTopics} topics scheduled
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {Math.round(sprintPlan.totalPlannedMinutes / 60)} hours across {sprintPlan.weeks.length} weeks
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarRange className="h-3.5 w-3.5" aria-hidden="true" />
              {sprintWeeklyHours}h weekly goal
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sprintPlan.weeks.map((week) => (
              <section key={week.week} className="glass-card rounded-2xl border border-border/80 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <h3 className="text-sm font-bold text-foreground">Week {week.week}</h3>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {Math.round(week.minutes / 60)}h · {week.topics.length} topics
                  </span>
                </div>

                {week.topics.length > 0 ? (
                  <div className="divide-y divide-border/60">
                    {week.topics.map((topic) => (
                      <Link
                        key={topic.slug}
                        href={topic.canonicalPath}
                        className="group flex items-center justify-between gap-3 py-2 text-left"
                      >
                        <div className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-foreground group-hover:text-primary">
                            {topic.name}
                          </span>
                          <span className="block text-[10px] text-muted-foreground font-mono">
                            {topic.domain} · {topic.difficulty} · {topic.estimatedMinutes} min
                          </span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-2">
                    Catch-up & buffer week. Revisit visualizers, take notes, or review code.
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
