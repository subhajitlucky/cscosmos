import type { Metadata } from "next";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { getPool, isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Leaderboard - CSCosmos",
  description:
    "Opt-in CSCosmos learning leaderboard ranked by completed topics.",
};

export const dynamic = "force-dynamic";

interface LeaderRow {
  email: string;
  completed: number;
  bookmarks: number;
  updated_at: string;
}

export default async function LeaderboardPage() {
  let rows: LeaderRow[] = [];

  if (isDatabaseConfigured()) {
    const result = await getPool().query<LeaderRow>(
      `SELECT u.email,
              cardinality(l.completed) AS completed,
              cardinality(l.bookmarks) AS bookmarks,
              l.updated_at
       FROM cscosmos_users u
       JOIN cscosmos_learning l ON l.user_id = u.id
       WHERE u.leaderboard_opt_in = TRUE
       ORDER BY cardinality(l.completed) DESC, l.updated_at ASC
       LIMIT 25`
    );
    rows = result.rows;
  }

  const masked = (email: string) => {
    const [name, domain] = email.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  };

  return (
    <div className="py-16 md:py-24">
      <div className="page-container max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
            Leaderboard
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
            Finished topics, not noise.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Opt-in only. Ranked by completed topics. Emails are masked; no streaks,
            followers, or vanity metrics.
          </p>
        </header>

        {rows.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-3 rounded-2xl border p-10 text-center">
            <Trophy className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">No one has joined yet.</p>
            <p className="max-w-md text-xs text-muted-foreground">
              Sign in, sync your progress, and opt in from the progress page.
            </p>
            <Link
              href="/progress"
              className="inline-flex h-10 items-center rounded-lg bg-foreground px-4 text-xs font-semibold text-background"
            >
              Open progress
            </Link>
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-2xl border">
            <div className="grid grid-cols-[40px_1fr_100px_100px] gap-2 border-b border-border px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-[50px_1fr_120px_120px] sm:px-5">
              <span>#</span>
              <span>Learner</span>
              <span className="text-right">Completed</span>
              <span className="text-right">Bookmarks</span>
            </div>
            <div className="divide-y divide-border/60">
              {rows.map((row, index) => (
                <div
                  key={row.email}
                  className="grid grid-cols-[40px_1fr_100px_100px] items-center gap-2 px-4 py-3 text-[13px] sm:grid-cols-[50px_1fr_120px_120px] sm:px-5"
                >
                  <span className="font-mono text-[11px] text-muted-foreground">{index + 1}</span>
                  <span className="truncate">{masked(row.email)}</span>
                  <span className="text-right font-mono text-[11px] tabular-nums">
                    {row.completed}
                  </span>
                  <span className="text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                    {row.bookmarks}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
