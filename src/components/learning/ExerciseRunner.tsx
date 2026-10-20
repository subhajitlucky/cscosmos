"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { domains, type DomainKey } from "@/data/domains";
import { exercises, type ExerciseDifficulty } from "@/data/exercises";

type Phase = "setup" | "active" | "done";
type DomainFilter = "all" | DomainKey;
type DifficultyFilter = "all" | ExerciseDifficulty;

export function ExerciseRunner() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [domain, setDomain] = useState<DomainFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const pool = useMemo(
    () =>
      exercises.filter((exercise) => {
        if (domain !== "all" && exercise.domain !== domain) return false;
        if (difficulty !== "all" && exercise.difficulty !== difficulty) return false;
        return true;
      }),
    [domain, difficulty]
  );

  const start = () => {
    setIndex(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setPhase("active");
  };

  const submit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === pool[index].answer) setScore((value) => value + 1);
  };

  const next = () => {
    if (index + 1 >= pool.length) {
      setPhase("done");
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setSubmitted(false);
  };

  if (phase === "setup") {
    return (
      <div className="space-y-5">
        <div className="glass-card space-y-5 rounded-2xl border p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Domain
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDomain("all")}
                aria-pressed={domain === "all"}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  domain === "all"
                    ? "border-foreground/40 bg-secondary/60 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {domains.map((item) => (
                <button
                  key={item.domainKey}
                  type="button"
                  onClick={() => setDomain(item.domainKey)}
                  aria-pressed={domain === item.domainKey}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    domain === item.domainKey
                      ? "border-foreground/40 bg-secondary/60 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="exercise-difficulty" className="eyebrow">
                Difficulty
              </label>
              <select
                id="exercise-difficulty"
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
            <div className="flex items-end">
              <p className="text-xs text-muted-foreground">
                {pool.length} question{pool.length === 1 ? "" : "s"} available
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={start}
              disabled={pool.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Start exercises
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="text-xs text-muted-foreground">
              Instant feedback. No account needed.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const percent = pool.length === 0 ? 0 : Math.round((score / pool.length) * 100);
    return (
      <div className="glass-card space-y-5 rounded-2xl border p-6">
        <div>
          <p className="eyebrow">Session complete</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            {score} / {pool.length} correct
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{percent}% this round</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPhase("setup")}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            New set
          </button>
          <Link
            href="/review"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-xs font-semibold text-foreground hover:bg-secondary/40"
          >
            Review interview cards
          </Link>
        </div>
      </div>
    );
  }

  const exercise = pool[index];
  const correct = submitted && selected === exercise.answer;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Question {index + 1} / {pool.length}
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Score {score}
        </span>
      </div>

      <div className="glass-card rounded-2xl border p-6 sm:p-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
          {exercise.domain} · {exercise.difficulty}
        </p>
        <h2 className="mt-3 text-lg font-semibold leading-snug text-foreground">
          {exercise.prompt}
        </h2>

        {exercise.code && (
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-secondary/30 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
            {exercise.code}
          </pre>
        )}

        <div className="mt-5 space-y-2">
          {exercise.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const isAnswer = submitted && optionIndex === exercise.answer;
            const isWrong = submitted && isSelected && optionIndex !== exercise.answer;

            return (
              <button
                key={option}
                type="button"
                disabled={submitted}
                onClick={() => setSelected(optionIndex)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                  isAnswer
                    ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                    : isWrong
                      ? "border-red-500/40 bg-red-500/10 text-foreground"
                      : isSelected
                        ? "border-foreground/40 bg-secondary/40 text-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current font-mono text-[10px]">
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              correct
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-red-500/30 bg-red-500/10"
            }`}
          >
            <p className="flex items-center gap-2 font-semibold text-foreground">
              {correct ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
              )}
              {correct ? "Correct" : "Not quite"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {exercise.explanation}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {!submitted ? (
            <button
              type="button"
              onClick={submit}
              disabled={selected === null}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background disabled:opacity-40"
            >
              Check answer
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background"
            >
              {index + 1 >= pool.length ? "See results" : "Next question"}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
          {exercise.topicSlug && (
            <Link
              href={`/${exercise.domain}/${exercise.topicSlug}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-xs font-semibold text-foreground hover:bg-secondary/40"
            >
              Open topic
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
