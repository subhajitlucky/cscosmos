"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Play, RotateCcw, Target } from "lucide-react";
import {
  categories,
  interviewQuestions,
  type Difficulty,
  type InterviewCategoryKey,
  type InterviewQuestion,
} from "@/data/interview";

type Phase = "setup" | "active" | "done";
type CategoryFilter = "all" | InterviewCategoryKey;
type DifficultyFilter = "all" | Difficulty;

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MockInterview() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [count, setCount] = useState(3);
  const [minutes, setMinutes] = useState(15);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const pool = useMemo(() => {
    return interviewQuestions.filter((question) => {
      if (category !== "all" && question.category !== category) return false;
      if (difficulty !== "all" && question.difficulty !== difficulty) return false;
      return true;
    });
  }, [category, difficulty]);

  useEffect(() => {
    if (phase !== "active") return;
    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const start = () => {
    setQuestions(shuffle(pool).slice(0, Math.min(count, pool.length)));
    setIndex(0);
    setRevealed(false);
    setTimeLeft(minutes * 60);
    setScores([]);
    setPhase("active");
  };

  const current = questions[index];

  const score = (value: number) => {
    const next = [...scores, value];
    setScores(next);
    if (index + 1 >= questions.length) {
      setPhase("done");
      return;
    }
    setIndex(index + 1);
    setRevealed(false);
    setTimeLeft(minutes * 60);
  };

  const reset = () => {
    setPhase("setup");
    setQuestions([]);
    setScores([]);
    setIndex(0);
    setRevealed(false);
  };

  if (phase === "setup") {
    return (
      <div className="space-y-5">
        <div className="glass-card space-y-5 rounded-2xl border p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Category
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory("all")}
                aria-pressed={category === "all"}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === "all"
                    ? "border-foreground/40 bg-secondary/60 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {categories.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategory(item.key)}
                  aria-pressed={category === item.key}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    category === item.key
                      ? "border-foreground/40 bg-secondary/60 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.shortTitle}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Difficulty
              </p>
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as DifficultyFilter)}
                className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none"
              >
                <option value="all">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Questions
              </p>
              <select
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none"
              >
                {[3, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} questions
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Time per question
              </p>
              <select
                value={minutes}
                onChange={(event) => setMinutes(Number(event.target.value))}
                className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none"
              >
                {[10, 15, 20, 30].map((value) => (
                  <option key={value} value={value}>
                    {value} minutes
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={start}
              disabled={pool.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              Start mock interview
            </button>
            <span className="text-xs text-muted-foreground">
              {pool.length} questions available
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Info icon={Clock3} title="Timed" body="A visible countdown keeps the pressure honest." />
          <Info icon={Target} title="Self-scored" body="Reveal the model answer after you finish." />
          <Info icon={ArrowRight} title="Review" body="Open the full walkthrough after each round." />
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const average = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 0;
    return (
      <div className="glass-card space-y-5 rounded-2xl border p-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            Session complete
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Average score: {average.toFixed(1)} / 5
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {questions.length} questions · {scores.length} scored
          </p>
        </div>

        <div className="divide-y divide-border/60">
          {questions.map((question, questionIndex) => (
            <div key={question.slug} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{question.title}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {question.category} · {question.difficulty}
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {scores[questionIndex] ?? "—"}/5
              </span>
              <Link
                href={`/interview/${question.category}/${question.slug}`}
                className="shrink-0 text-xs font-semibold text-primary hover:underline"
              >
                Review
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            New session
          </button>
          <Link
            href="/interview"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-xs font-semibold text-foreground hover:bg-secondary/40"
          >
            Interview bank
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Question {index + 1} / {questions.length}
        </span>
        <span
          className={`font-mono text-sm tabular-nums ${
            timeLeft <= 60 ? "text-red-500" : "text-foreground"
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="glass-card rounded-2xl border p-6 sm:p-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
          {current.category} · {current.difficulty} · {current.frequency}
        </p>
        <h2 className="mt-3 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          {current.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{current.oneLiner}</p>

        {revealed ? (
          <div className="mt-5 space-y-4 border-t border-border pt-5">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Mental model
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {current.mentalModel}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Score yourself
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => score(value)}
                    className="h-9 w-9 rounded-md border border-border text-xs font-semibold text-foreground transition-colors hover:bg-secondary/50"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/40"
          >
            Reveal model answer
          </button>
        )}
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Clock3;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
