import Link from "next/link"
import { Github, Heart, Server, Database, Globe2, Sparkles } from "lucide-react"
import { siteConfig } from "@/config/site"

export const metadata = {
  title: "Support - CSCosmos",
  description:
    "CSCosmos is free forever. Donations only cover hosting and infrastructure; they never unlock features.",
}

const COSTS = [
  {
    icon: Server,
    label: "Hosting",
    amount: "₹0/mo",
    note: "Vercel free tier while traffic is low",
  },
  {
    icon: Globe2,
    label: "Domain",
    amount: "~₹85/mo",
    note: "₹1,000/year, the only near-certain cost",
  },
  {
    icon: Database,
    label: "Database",
    amount: "₹0/mo",
    note: "Free tier; only needed once accounts ship",
  },
  {
    icon: Sparkles,
    label: "AI tutor",
    amount: "₹0/mo",
    note: "Bring-your-own key; CSCosmos never pays inference",
  },
]

const SUPPORT_LINKS = [
  {
    label: "GitHub Sponsors",
    href: process.env.NEXT_PUBLIC_GITHUB_SPONSORS ?? "https://github.com/sponsors/subhajitlucky",
    note: "One-time or monthly",
  },
  {
    label: "UPI",
    href: process.env.NEXT_PUBLIC_SUPPORT_UPI ?? "",
    note: "Add NEXT_PUBLIC_SUPPORT_UPI to enable",
  },
]

export default function SupportPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="page-container max-w-4xl space-y-16">
        <section className="space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary/40">
            <Heart className="h-7 w-7 fill-red-500 text-red-500" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground lg:text-6xl">
            Keep the universe free.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            CSCosmos has no paywall, no locked lessons, and no ads. Donations cover
            hosting and infrastructure only — they never unlock features.
          </p>
        </section>

        <section className="glass-card rounded-2xl border border-border p-8 md:p-10">
          <h2 className="text-2xl font-bold text-foreground">The pledge</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>Every topic, visualizer, and interview walkthrough stays free.</li>
            <li>Donations never gate a feature, a lesson, or a download.</li>
            <li>No selling learner data, no sponsored rankings, no fake urgency.</li>
            <li>If donations exceed costs, the surplus funds new free modules.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">What it actually costs</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Current run rate is close to zero because we use free tiers and a
              static-first architecture. The domain is the first real bill.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {COSTS.map((cost) => (
              <div
                key={cost.label}
                className="glass-card rounded-xl border border-border p-5"
              >
                <div className="flex items-center gap-3">
                  <cost.icon className="h-4 w-4 text-foreground" aria-hidden="true" />
                  <span className="text-sm font-semibold text-foreground">
                    {cost.label}
                  </span>
                  <span className="ml-auto font-mono text-sm text-foreground">
                    {cost.amount}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{cost.note}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Estimated current total: <strong className="text-foreground">₹0–85/month</strong>.
            We will publish the actual amount here when the domain renews.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">How to support</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SUPPORT_LINKS.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card flex items-center justify-between rounded-xl border border-border p-5 transition-colors hover:border-foreground/30"
                >
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {link.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {link.note}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-muted-foreground">
                    →
                  </span>
                </a>
              ) : (
                <div
                  key={link.label}
                  className="glass-card rounded-xl border border-dashed border-border p-5 opacity-70"
                >
                  <span className="block text-sm font-semibold text-foreground">
                    {link.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {link.note}
                  </span>
                </div>
              )
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Prefer another method? Open an issue on{" "}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <section className="glass-card rounded-2xl border border-border p-8 md:p-10">
          <h2 className="text-2xl font-bold text-foreground">Where the money goes</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>1. Domain renewal.</li>
            <li>2. Email for account and reminder features.</li>
            <li>3. Database free-tier overages, only if we outgrow it.</li>
            <li>4. New free modules and accessibility work.</li>
          </ol>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/topics"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Back to learning
          </Link>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/40"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            Contribute instead
          </a>
        </div>
      </div>
    </div>
  )
}
