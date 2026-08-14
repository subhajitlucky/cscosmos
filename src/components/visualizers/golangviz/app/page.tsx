import { FeatureGrid } from "@/components/visualizers/golangviz/components/feature-grid";
import { Footer } from "@/components/visualizers/golangviz/components/footer";
import { Hero } from "@/components/visualizers/golangviz/components/hero";
import { Navigation } from "@/components/visualizers/golangviz/components/navigation";
import { Section } from "@/components/visualizers/golangviz/components/section";

const coreFeatures = [
  {
    title: "Interactive memory maps",
    description:
      "See stack vs heap, pointers, escape analysis hints, and interface fat pointers updated as code executes.",
  },
  {
    title: "Stepper like Python Tutor",
    description:
      "Advance line by line, watch variables mutate, visualize function frames, and highlight goroutine creation.",
  },
  {
    title: "Concurrency visualized",
    description:
      "G/M/P scheduler diagrams, channel queues, mutex state, race-condition explainer overlays.",
  },
  {
    title: "Data structure deep-dives",
    description:
      "Arrays, slices, maps, and structs rendered with alignment, padding, capacity growth, and bucket hashing.",
  },
  {
    title: "Compiler & build pipeline",
    description:
      "Show parse → type-check → SSA → escape analysis → codegen → link steps, plus binary layout overview.",
  },
  {
    title: "Story-first curriculum",
    description:
      "Bite-sized chapters with diagrams, quizzes, cheatsheets, and project-based examples that reinforce concepts.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navigation />
      <main className="space-y-4 pb-20">
        <Hero />

        <Section
          id="features"
          kicker="Why visual-first Go"
          title="Everything you wish Go docs showed — rendered live."
          description="Blend Go by Example, VisualGo, Python Tutor, and Roadmap-style sequencing into one focused, beginner-friendly experience."
        >
          <FeatureGrid features={coreFeatures} />
        </Section>

        <Section
          id="start"
          kicker="Start here"
          title="Open the playground or browse concepts"
          description="Use the playground to see memory, channels, and scheduler visuals. Browse Concepts for the full Go map."
        >
          <div className="flex flex-wrap gap-3">
            <a
              href="/golangviz/playground"
              className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white !text-white shadow-md transition hover:-translate-y-0.5"
              aria-label="Open playground"
            >
              Open playground
            </a>
            <a
              href="/golangviz/path"
              className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
            >
              View concepts
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
