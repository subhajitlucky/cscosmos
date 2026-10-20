import type { Metadata } from "next";
import Link from "next/link";
import { Braces, ExternalLink, Globe2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Developers - CSCosmos",
  description:
    "Free read-only JSON APIs for CSCosmos topics, domains, and interview questions.",
};

const ENDPOINTS = [
  {
    path: "/api/topics",
    description: "Full topic catalog with domain, status, description, and absolute URL.",
    sample: `{
  "count": 245,
  "generatedAt": "2026-10-20T...",
  "topics": [
    {
      "id": 1,
      "name": "How Programs Execute",
      "domain": "fullstack",
      "slug": "program-cosmos",
      "status": "active",
      "url": "https://cscosmos.vercel.app/fullstack/program-cosmos"
    }
  ]
}`,
  },
  {
    path: "/api/domains",
    description: "Domain metadata with total and active topic counts.",
    sample: `{
  "count": 8,
  "domains": [
    {
      "key": "dsa",
      "name": "Data Structures & Algorithms",
      "totalTopics": 41,
      "activeTopics": 12
    }
  ]
}`,
  },
  {
    path: "/api/interview",
    description: "Interview categories with difficulty, frequency, companies, and tags.",
    sample: `{
  "count": 24,
  "categories": [
    {
      "key": "dsa",
      "title": "DSA",
      "questions": [
        {
          "slug": "two-sum-brute-force-to-hashmap",
          "difficulty": "beginner",
          "companies": ["Amazon", "Microsoft", "Google"]
        }
      ]
    }
  ]
}`,
  },
];

export default function DevelopersPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="page-container max-w-5xl space-y-12">
        <header className="space-y-4">
          <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <Braces className="h-3.5 w-3.5" aria-hidden="true" />
            Developers
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground lg:text-6xl">
            Free, read-only APIs.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Use the CSCosmos catalog in your own tools, agents, or study dashboards. No keys,
            no paywall, CORS enabled, and responses cached for an hour.
          </p>
        </header>

        <section className="glass-card space-y-4 rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-foreground" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-foreground">Base URL</h2>
          </div>
          <code className="block rounded-lg border border-border bg-secondary/30 px-4 py-3 font-mono text-sm text-foreground">
            {siteConfig.url}/api
          </code>
          <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/30 px-4 py-3 font-mono text-xs text-muted-foreground">
{`curl ${siteConfig.url}/api/topics
curl ${siteConfig.url}/api/domains
curl ${siteConfig.url}/api/interview`}
          </pre>
        </section>

        <section className="space-y-3">
          {ENDPOINTS.map((endpoint) => (
            <article key={endpoint.path} className="glass-card rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <code className="font-mono text-sm font-semibold text-foreground">
                  GET {endpoint.path}
                </code>
                <a
                  href={`${siteConfig.url}${endpoint.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Open
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{endpoint.description}</p>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-secondary/30 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {endpoint.sample}
              </pre>
            </article>
          ))}
        </section>

        <section className="glass-card space-y-3 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-foreground">Rules</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>Read-only. There are no write endpoints.</li>
            <li>No authentication. Please cache responses and identify your client with a User-Agent.</li>
            <li>Content is original; do not republish it as your own catalog.</li>
            <li>Endpoints may evolve. Breaking changes will be announced on GitHub.</li>
          </ul>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline"
          >
            Source and issues
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/topics"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Browse topics
          </Link>
          <Link
            href="/support"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/40"
          >
            Support the project
          </Link>
        </div>
      </div>
    </div>
  );
}
