import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/learning/ProgressDashboard";

export const metadata: Metadata = {
  title: "Progress - CSCosmos",
  description: "Your local CSCosmos learning progress, streaks, and completed topics.",
};

export default function ProgressPage() {
  return (
    <div className="py-12">
      <div className="page-container max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-primary/70">My Learning</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Progress</h1>
          <p className="max-w-2xl text-muted-foreground">
            Completed topics, domain coverage, and streaks. Everything is stored in your browser
            until optional accounts ship.
          </p>
        </div>

        <ProgressDashboard />
      </div>
    </div>
  );
}
