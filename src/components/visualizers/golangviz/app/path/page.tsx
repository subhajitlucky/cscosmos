import { Footer } from "@/components/visualizers/golangviz/components/footer";
import { Navigation } from "@/components/visualizers/golangviz/components/navigation";
import { Section } from "@/components/visualizers/golangviz/components/section";
import { levels } from "@/components/visualizers/golangviz/lib/curriculum";
import Link from "next/link";

export default function LearningPathPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navigation />
      <main className="space-y-6 pb-16">
        <Section
          id="path"
          kicker="Concepts"
          title="Step-by-step concept map for Go"
          description="Follow these steps; read the linked chapters, then use the visualizers and quizzes for each stage."
        >
          <div className="space-y-4">
            {levels.map((level) => (
              <div
                key={level.id}
                className="surface rounded-2xl p-5 shadow-md shadow-blue-500/10"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{level.badge}</h3>
                  <span className="text-xs uppercase tracking-wide text-[var(--muted)]">
                    {level.blurb}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {level.concepts.map((concept, cIdx) => (
                    <div
                      key={`${level.id}-${concept.title}-${cIdx}`}
                      className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4"
                    >
                      {concept.href ? (
                        <Link
                          href={concept.href}
                          className="font-semibold text-[var(--foreground)] underline decoration-blue-400/50 underline-offset-4 hover:text-[var(--accent)]"
                        >
                          {concept.title}
                        </Link>
                      ) : (
                        <div className="font-semibold text-[var(--foreground)]">
                          {concept.title}
                        </div>
                      )}
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                        {concept.bullets.map((b, bIdx) => (
                          <li key={`${level.id}-${concept.title}-${bIdx}`}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

