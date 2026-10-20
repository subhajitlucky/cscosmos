import type { Metadata } from "next";
import { BrainCircuit } from "lucide-react";
import { ReviewClient } from "@/components/learning/ReviewClient";

export const metadata: Metadata = {
  title: "Review - CSCosmos",
  description:
    "Spaced-repetition review for CSCosmos interview questions, stored locally in your browser.",
};

export default function ReviewPage() {
  return (
    <div className="py-12">
      <div className="page-container max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
            Review
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
            Recall, don&apos;t reread.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            A local spaced-repetition queue built from the interview bank. Grade each card
            honestly; the next review date adjusts automatically.
          </p>
        </header>

        <ReviewClient />
      </div>
    </div>
  );
}
