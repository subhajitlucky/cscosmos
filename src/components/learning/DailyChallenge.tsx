import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { topics } from "@/data/topics";

function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) {
    result = (result * 31 + value.charCodeAt(i)) >>> 0;
  }
  return result;
}

export function DailyChallenge() {
  const active = topics.filter((topic) => topic.status === "active");
  if (active.length === 0) return null;
  const challenge = active[hash(todayKey()) % active.length];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/40">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            Daily challenge
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{challenge.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{challenge.domain}</p>
        </div>
      </div>
      <Link
        href={challenge.url || "/topics"}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
      >
        Open challenge
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
