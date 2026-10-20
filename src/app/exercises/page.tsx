import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { ExerciseRunner } from "@/components/learning/ExerciseRunner";

export const metadata: Metadata = {
  title: "Exercises - CSCosmos",
  description:
    "Auto-graded computer science exercises with instant explanations, spanning DSA, systems, security, AI, and DevOps.",
};

export default function ExercisesPage() {
  return (
    <div className="py-12">
      <div className="page-container max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Exercises
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
            Check what stuck.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Short, auto-graded questions with explanations. Filter by domain and level,
            answer, and see the reasoning immediately.
          </p>
        </header>

        <ExerciseRunner />
      </div>
    </div>
  );
}
