'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  Database,
  FileCode,
  GitMerge,
  HelpCircle,
  Layers,
  Search,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { SQL_TOPICS } from '../data/topics';

export default function Home() {
  const coreLabs = [
    {
      title: 'B+ Tree Index Lab',
      category: 'Storage engine',
      description: 'Step through 8 KB disk pages, internal branch routing keys, leaf pointers, and heap tuple lookups.',
      href: '/sqlcosmos/index-lab',
      icon: Layers,
    },
    {
      title: 'Cost-Based Optimizer Lab',
      category: 'Query planner',
      description: 'Evaluate EXPLAIN ANALYZE execution plans: Seq Scan vs Index Scan vs Index-Only Scan vs Bitmap Scan.',
      href: '/sqlcosmos/explain-lab',
      icon: Search,
    },
    {
      title: 'Physical Joins Engine',
      category: 'Execution engine',
      description: 'Visualize Nested Loop, in-memory Hash Join (Build & Probe phases), and Merge Join lockstep traversal.',
      href: '/sqlcosmos/joins-lab',
      icon: GitMerge,
    },
    {
      title: 'Interactive SQL Playground',
      category: 'In-memory sandbox',
      description: 'Execute queries against in-memory relational tables with instant AST evaluation and syntax feedback.',
      href: '/sqlcosmos/playground',
      icon: Terminal,
    },
  ];

  const curriculumPillars = [
    {
      number: '01',
      title: 'Relational foundations & schema design',
      description: 'DDL constraints, primary & foreign keys, declarative query algebra, and schema normalization from 1NF to BCNF.',
      icon: Database,
    },
    {
      number: '02',
      title: 'Physical storage & page layout',
      description: '8 KB slotted disk pages, tuple headers, heap tables, write-ahead logging (WAL), and checkpoint recovery.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'B+ Tree indexing & selectivity',
      description: 'Balanced multi-way search trees, composite indexes, the leftmost prefix rule, and covering index scans.',
      icon: Search,
    },
    {
      number: '04',
      title: 'Cost-based query optimizer (CBO)',
      description: 'Dynamic programming plan enumerators, selectivity formulas, sequential vs random I/O costs, and join ordering.',
      icon: Cpu,
    },
    {
      number: '05',
      title: 'Transactions, ACID & MVCC',
      description: 'Isolation levels, concurrency anomalies (dirty reads, phantom reads, write skew), snapshot isolation, and vacuuming.',
      icon: ShieldCheck,
    },
    {
      number: '06',
      title: 'Analytics & production scaling',
      description: 'Window partition frames, recursive common table expressions (CTEs), table partitioning, and read replicas.',
      icon: FileCode,
    },
  ];

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <section className="space-y-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <Database className="w-3.5 h-3.5 text-foreground" />
          <span>Relational engine architecture &amp; visualizers</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Master the SQL &amp; Database Engine
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          Interactive visualizers for B+ Tree disk page traversal, composite index selectivity, cost-based EXPLAIN plans, physical join algorithms, MVCC tuple versions, and ACID transaction anomalies.
        </p>

        {/* Hero Actions (One Primary, One Secondary) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/sqlcosmos/concepts"
            className="px-5 py-2.5 rounded-lg bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore {SQL_TOPICS.length} Concepts</span>
          </Link>

          <Link
            href="/sqlcosmos/playground"
            className="px-5 py-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground font-semibold text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            <span>SQL Playground</span>
          </Link>
        </div>

        {/* Engine Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/60">
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-foreground">{SQL_TOPICS.length}</div>
            <div className="text-xs text-muted-foreground font-medium">Engine lessons</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-foreground">4</div>
            <div className="text-xs text-muted-foreground font-medium">Interactive labs</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">O(log N)</div>
            <div className="text-xs text-muted-foreground font-medium">B+ Tree stepper</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-foreground">18</div>
            <div className="text-xs text-muted-foreground font-medium">Staff flashcards</div>
          </div>
        </div>
      </section>

      {/* Interactive Labs Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/70 pb-4">
          <div>
            <div className="text-xs font-mono text-muted-foreground">Interactive workbenches</div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-1">
              Explore Dedicated Database Labs
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            Hands-on simulation studios dedicated to single architectural components of the relational engine.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {coreLabs.map((lab) => {
            const Icon = lab.icon;
            return (
              <Link
                key={lab.title}
                href={lab.href}
                className="p-5 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground border border-border/70 px-2 py-0.5 rounded-md bg-muted/30">
                      {lab.category}
                    </span>
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:underline">
                    {lab.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lab.description}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:gap-2 transition-all pt-1">
                  <span>Open lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Curriculum Architecture: 6 Pillars */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/70 pb-4">
          <div>
            <div className="text-xs font-mono text-muted-foreground">Comprehensive curriculum</div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-1">
              Six Relational Database Pillars
            </h2>
          </div>
          <Link
            href="/sqlcosmos/concepts"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <span>View all {SQL_TOPICS.length} concepts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {curriculumPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="p-5 rounded-xl border border-border bg-card flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      {pillar.number}
                    </span>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/sqlcosmos/concepts"
          className="p-6 rounded-xl bg-card border border-border hover:border-foreground/40 shadow-xs transition-colors space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/50 text-foreground flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            {SQL_TOPICS.length} Core Concepts
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Relational algebra, physical page layout, B+ Tree split mechanics, Cost-Based Optimizer selectivity, and WAL ARIES recovery.
          </p>
        </Link>

        <Link
          href="/sqlcosmos/problems"
          className="p-6 rounded-xl bg-card border border-border hover:border-foreground/40 shadow-xs transition-colors space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/50 text-foreground flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            Practice Problems &amp; Challenges
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Solve structured query challenges with automated in-memory AST execution, timing measurements, and unit test verification.
          </p>
        </Link>

        <Link
          href="/sqlcosmos/flashcards"
          className="p-6 rounded-xl bg-card border border-border hover:border-foreground/40 shadow-xs transition-colors space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/50 text-foreground flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            Senior Engineering Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            18 high-yield database interview questions on Write Skew, Serializable Snapshot Isolation, and deadlocks.
          </p>
        </Link>
      </section>
    </div>
  );
}
