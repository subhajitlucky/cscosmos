import type { Metadata } from "next";
import { TimerReset } from "lucide-react";
import { MockInterview } from "@/components/learning/MockInterview";

export const metadata: Metadata = {
  title: "Mock Interview - CSCosmos",
  description:
    "Run a timed, self-scored mock interview from the CSCosmos question bank. No account required.",
};

export default function MockInterviewPage() {
  return (
    <div className="py-12">
      <div className="page-container max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <TimerReset className="h-3.5 w-3.5" aria-hidden="true" />
            Mock interview
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
            Practice the pressure.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Pick a category and a timer. Answer out loud or in writing, then reveal the
            mental model and score yourself honestly.
          </p>
        </header>

        <MockInterview />
      </div>
    </div>
  );
}
