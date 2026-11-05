import { Button } from "@/components/ui/button";
import Link from "next/link";
import { topics } from "@/data/topics";
import { ROLE_ROADMAPS } from "@/data/role-roadmaps";
import {
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  Route,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  ExternalLink,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "About - CSCosmos",
  description:
    "The survival guide for the AI age. We teach architecture, deep internals, and foundational computing principles.",
};

export default function AboutPage() {
  const totalTopics = topics.length;
  const activeEngines = topics.filter((t) => t.status === "active").length;
  const totalRoles = ROLE_ROADMAPS.length;

  return (
    <div className="py-12 md:py-20">
      <div className="page-container space-y-20">
        {/* 1. Hero Hook */}
        <section className="space-y-6 text-center max-w-4xl mx-auto">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono font-medium text-primary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            The Architectural Survival Guide
          </p>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            The Survival Guide <br /> for the AI Age.
          </h1>

          <p className="text-xl md:text-2xl text-foreground font-semibold leading-snug">
            We don&apos;t teach syntax. We teach Architecture. <br />
            We don&apos;t teach how to use tools. We teach how to build them.
          </p>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            In an era where AI generates boilerplate code in milliseconds, knowing the syntax of a language is no longer a moat.
            The true competitive advantage belongs to engineers who understand memory layouts, OS kernels, networking protocols, and distributed consensus from first principles.
          </p>
        </section>

        {/* 2. Platform Scale Numbers */}
        <section className="glass-card rounded-2xl border border-border/80 p-6 md:p-10 shadow-xs">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                {totalTopics}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Curated Topics
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                {activeEngines}+
              </p>
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Interactive Engines
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                8
              </p>
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Core Domains
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-primary">
                {totalRoles}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Career Roadmaps
              </p>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                100%
              </p>
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Free & Open Source
              </p>
            </div>
          </div>
        </section>

        {/* 3. The Core Pillars */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Why CSCosmos Exists
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Built to replace passive video tutorials with active mental models.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border border-border/80 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-500">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Deep Internals</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In a world of AI code generation, the shallow coder is obsolete. The systems architect is king. 
                  We dive into memory allocators, two-level page tables, compiler AST passes, and kernel process lifecycles.
                </p>
              </div>
              <div className="pt-2 text-xs font-mono text-muted-foreground">
                First principles · No magic
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border border-border/80 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Interactive by Nature</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No 10-hour static video lectures or endless walls of text. 
                  Our visualizer engines let you step through assembly instructions, simulate cache misses, observe packet lifecycles, and test concurrency limits in real time.
                </p>
              </div>
              <div className="pt-2 text-xs font-mono text-muted-foreground">
                70+ absorbed engines · Real execution
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border border-border/80 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Future-Proof Foundations</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  From <strong>Real-Time Robotics Kernels</strong> and <strong>RISC-V Silicon</strong> to <strong>Quantum Computing</strong> and <strong>TLA+ Formal Verification</strong>.
                  We teach the computer science principles that will define the next 20 years, not just the next 20 weeks.
                </p>
              </div>
              <div className="pt-2 text-xs font-mono text-muted-foreground">
                Long-term durable knowledge
              </div>
            </div>
          </div>
        </section>

        {/* 4. Philosophy & Comparison */}
        <section className="glass-card rounded-2xl border border-border/80 p-6 sm:p-10 shadow-xs">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-primary">
                Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                &ldquo;{siteConfig.slogan}&rdquo;
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you understand how high-level abstractions compile down into memory addresses, CPU cycles, and network frames, you never get stuck.
                You can debug any production crash, design resilient distributed systems, and master new technologies in days rather than months.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link href="/roadmap">
                  <Button variant="default" className="gap-2">
                    <Route className="h-4 w-4" />
                    Explore Top 10 Roadmaps
                  </Button>
                </Link>
                <Link href="/topics">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Cpu className="h-4 w-4 text-primary" />
                  Zero Black Boxes
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every engine deconstructs hidden machinery into transparent visual simulations.
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Zap className="h-4 w-4 text-emerald-500" />
                  Zero Dependencies
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Everything executes client-side directly in your browser. No Docker, no toolchains required.
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Route className="h-4 w-4 text-indigo-500" />
                  Job-Ready Stages
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Top 10 industry career tracks arranged from Basic to Expert with prerequisite tracking.
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Terminal className="h-4 w-4 text-amber-500" />
                  Free & Open
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  MIT licensed, community-driven, and publicly verifiable without paywalls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CTAs */}
        <section className="text-center space-y-6 pt-4 pb-8">
          <h2 className="text-2xl font-black text-foreground sm:text-3xl">
            Ready to explore the digital universe?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/topics">
              <Button size="lg" className="h-12 px-7 text-sm font-bold gap-2">
                Explore All {totalTopics} Topics
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/roadmap">
              <Button variant="outline" size="lg" className="h-12 px-7 text-sm font-bold gap-2">
                <Route className="h-4 w-4" />
                View Career Roadmaps
              </Button>
            </Link>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost" size="lg" className="h-12 px-6 text-sm font-semibold gap-2 text-muted-foreground hover:text-foreground">
                <Code2 className="h-4 w-4" />
                GitHub
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
