'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Database,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import { SQL_TOPICS } from '../data/topics';

export default function Home() {
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
