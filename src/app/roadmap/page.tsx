import type { Metadata } from "next";
import { Route } from "lucide-react";
import { RoadmapGenerator } from "@/components/learning/RoadmapGenerator";

export const metadata: Metadata = {
  title: "Roadmap - CSCosmos",
  description:
    "Generate a free, personalized computer science study plan from the CSCosmos topic catalog.",
};

export default function RoadmapPage() {
  return (
    <div className="py-12">
      <div className="page-container max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <Route className="h-3.5 w-3.5" aria-hidden="true" />
            Roadmap
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
            A plan, not a playlist.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Pick a goal, a level, and the time you can actually commit. The generator orders
            live modules into a week-by-week plan. Regenerate any time.
          </p>
        </header>

        <RoadmapGenerator />
      </div>
    </div>
  );
}
