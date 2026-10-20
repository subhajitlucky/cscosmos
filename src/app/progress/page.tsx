import type { Metadata } from "next";
import Link from "next/link";
import { ProgressDashboard } from "@/components/learning/ProgressDashboard";
import { SyncLearning } from "@/components/learning/SyncLearning";
import LeaderboardOptIn from "@/components/learning/LeaderboardOptIn";
import CertificatePanel from "@/components/learning/CertificatePanel";
import { getSessionUser } from "@/lib/auth-server";
import { getPool, isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Progress - CSCosmos",
  description: "Your CSCosmos learning progress, streaks, and completed topics.",
};

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const user = await getSessionUser();
  let leaderboardOptIn = false;
  let completed = 0;
  let certificates: Array<{ id: string; title: string; issued_at: string }> = [];

  if (user && isDatabaseConfigured()) {
    const [userResult, learningResult, certificateResult] = await Promise.all([
      getPool().query<{ leaderboard_opt_in: boolean }>(
        "SELECT leaderboard_opt_in FROM cscosmos_users WHERE id = $1",
        [user.id]
      ),
      getPool().query<{ completed: string[] }>(
        "SELECT completed FROM cscosmos_learning WHERE user_id = $1",
        [user.id]
      ),
      getPool().query<{ id: string; title: string; issued_at: string }>(
        `SELECT id, title, issued_at FROM cscosmos_certificates
         WHERE user_id = $1 ORDER BY issued_at DESC`,
        [user.id]
      ),
    ]);
    leaderboardOptIn = userResult.rows[0]?.leaderboard_opt_in ?? false;
    completed = learningResult.rows[0]?.completed?.length ?? 0;
    certificates = certificateResult.rows;
  }

  return (
    <div className="py-12">
      <div className="page-container max-w-5xl space-y-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-primary/70">My Learning</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Progress</h1>
          <p className="max-w-2xl text-muted-foreground">
            Completed topics, domain coverage, and streaks. Local-first by default; sign in
            to sync across devices.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-4">
          {user ? (
            <>
              <p className="text-sm text-muted-foreground">
                Signed in as <span className="font-medium text-foreground">{user.email}</span>
              </p>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-lg border border-border px-3.5 text-xs font-semibold text-foreground hover:bg-secondary/40"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Sign in to sync progress, bookmarks, and notes.
              </p>
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-lg bg-foreground px-3.5 text-xs font-semibold text-background"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <SyncLearning loggedIn={Boolean(user)} />

        {user && <LeaderboardOptIn initialOptIn={leaderboardOptIn} />}

        {user && <CertificatePanel completed={completed} certificates={certificates} />}

        <ProgressDashboard />
      </div>
    </div>
  );
}
