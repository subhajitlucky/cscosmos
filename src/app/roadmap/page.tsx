import type { Metadata } from "next";
import { Route } from "lucide-react";
import { RoadmapGenerator } from "@/components/learning/RoadmapGenerator";

export const metadata: Metadata = {
  title: "Engineering Roadmaps - CSCosmos",
  description:
    "Curated career roadmaps from Basic to Expert across Frontend, Backend, Fullstack, Real-Time Kernel, AI Systems, DevOps, Cybersecurity, and Core CS.",
};

export default function RoadmapPage() {
  return (
    <div className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="space-y-3">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <Route className="h-3.5 w-3.5" aria-hidden="true" />
            Engineering Career Roadmaps
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
            From Zero to Expert. Step by step.
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pick a specialized career track — from Frontend and Backend to Real-Time Kernel and AI Systems.
            Follow structured stages from foundational prerequisites to production mastery with interactive visualizers.
          </p>
        </header>

        <RoadmapGenerator />
      </div>
    </div>
  );
}
