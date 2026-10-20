"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import {
  REVIEW_DECK,
  getReviewSnapshot,
  gradeCard,
  parseReviewState,
  saveReviewState,
  subscribeReview,
  type ReviewGrade,
} from "@/lib/review";

const GRADES: Array<{ grade: ReviewGrade; label: string; hint: string }> = [
  { grade: "again", label: "Again", hint: "1" },
  { grade: "hard", label: "Hard", hint: "2" },
  { grade: "good", label: "Good", hint: "3" },
  { grade: "easy", label: "Easy", hint: "4" },
];

export function ReviewClient() {
  const raw = useSyncExternalStore(subscribeReview, getReviewSnapshot, () => "");
  const states = useMemo(() => parseReviewState(raw), [raw]);
  const [revealedFor, setRevealedFor] = useState<string | null>(null);

  const due = useMemo(() => {
    const now = Date.now();
    return REVIEW_DECK.filter((card) => {
      const state = states[card.id];
      return !state || state.due <= now;
    });
  }, [states]);

  const card = due[0];
  const learned = Object.keys(states).length;
  const revealed = Boolean(card && revealedFor === card.id);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!card) return;
      if (event.key === " " && !revealed) {
        event.preventDefault();
        setRevealedFor(card.id);
      }
      if (!revealed) return;
      const grade = GRADES.find((item) => item.hint === event.key);
      if (grade) {
        event.preventDefault();
        setRevealedFor(null);
        saveReviewState(states, card.id, gradeCard(states[card.id], grade.grade));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [card, revealed, states]);

  if (!card) {
    return (
      <div className="glass-card rounded-2xl border p-10 text-center">
        <Check className="mx-auto h-8 w-8 text-emerald-500" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">All caught up</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          You reviewed every card that is due. Come back later, or start a fresh session
          to revisit material.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/interview"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-foreground px-4 text-xs font-semibold text-background"
          >
            Browse interview bank
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => {
              try {
                window.localStorage.removeItem("cscosmos:review:v1");
                window.dispatchEvent(new Event("cscosmos:review-updated"));
              } catch {
                // Ignore storage failures.
              }
            }}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-4 text-xs font-semibold text-foreground hover:bg-secondary/40"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset review history
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="font-mono uppercase tracking-wider">
          {due.length} due · {learned} in rotation
        </span>
        <Link href={card.href} className="inline-flex items-center gap-1 hover:text-foreground">
          Open full question
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <article className="glass-card rounded-2xl border p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {card.meta}
        </p>
        <h2 className="mt-4 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          {card.front}
        </h2>

        {revealed ? (
          <div className="mt-5 border-t border-border pt-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{card.back}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRevealedFor(card.id)}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/40"
          >
            Show answer
            <span className="font-mono text-[10px] text-muted-foreground">space</span>
          </button>
        )}
      </article>

      {revealed && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {GRADES.map((item) => (
            <button
              key={item.grade}
              type="button"
              onClick={() => {
                setRevealedFor(null);
                saveReviewState(states, card.id, gradeCard(states[card.id], item.grade));
              }}
              className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-secondary/40 ${
                item.grade === "again"
                  ? "border-red-500/30 text-red-500"
                  : item.grade === "easy"
                    ? "border-emerald-500/30 text-emerald-500"
                    : "border-border text-foreground"
              }`}
            >
              {item.label}
              <span className="font-mono text-[10px] opacity-60">{item.hint}</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-[10px] leading-relaxed text-muted-foreground">
        Review history is stored in this browser. Cards use a simplified SM-2 schedule.
      </p>
    </div>
  );
}
