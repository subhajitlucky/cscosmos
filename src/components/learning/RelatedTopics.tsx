import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { topics } from "@/data/topics";

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

export function RelatedTopics({ slug, domain }: { slug: string; domain: string }) {
  const current = topics.find((topic) => topic.slug === slug);
  if (!current) return null;

  const bySlug = (value: string) =>
    topics.find((topic) => topic.slug === value && topic.status === "active");

  const prerequisites = current.prerequisites.map(bySlug).filter(Boolean);
  const explicitRelated = current.related.map(bySlug).filter(Boolean);
  const fallback = topics
    .filter(
      (topic) =>
        topic.slug !== slug &&
        topic.domain === current.domain &&
        topic.status === "active"
    )
    .slice(0, 3);
  const related = explicitRelated.length > 0 ? explicitRelated : fallback;

  if (prerequisites.length === 0 && related.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-xs font-semibold text-foreground">Learning graph</h2>
      </div>

      {prerequisites.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            Prerequisites
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {prerequisites.map((topic) => (
              <Link
                key={topic!.slug}
                href={topic!.canonicalPath}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                {topic!.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
          Related topics
        </p>
        <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
          {related.map((topic) => (
            <Link
              key={topic!.slug}
              href={topic!.canonicalPath}
              className="group flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 transition-colors hover:border-foreground/30 hover:bg-secondary/40"
            >
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-foreground">
                  {topic!.name}
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  {DIFFICULTY_LABEL[topic!.difficulty]} · {topic!.estimatedMinutes} min
                </span>
              </span>
              <ArrowRight
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
