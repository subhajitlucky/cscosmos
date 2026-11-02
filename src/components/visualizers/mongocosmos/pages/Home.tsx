'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Database,
  HelpCircle,
  Terminal,
  Cpu,
  Layers,
  Server,
  Network,
  FileCode2,
  ArrowRight
} from 'lucide-react';
import { MONGO_TOPICS } from '../data/topics';
import { MONGO_FLASHCARDS } from '../data/flashcards';

export default function Home() {
  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <section className="space-y-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Document engine architecture &amp; visualizers</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Master MongoDB &amp; Document Engine Architecture
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          Interactive visualizers for BSON binary serialization, WiredTiger cache page eviction, checkpoint snapshots, multi-stage aggregation pipelines, Raft-based replica elections, and horizontal cluster sharding.
        </p>

        {/* Hero Actions (One Primary, One Secondary) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/mongocosmos/concepts"
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore {MONGO_TOPICS.length} Concepts</span>
          </Link>

          <Link
            href="/mongocosmos/playground"
            className="px-5 py-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground font-semibold text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            <span>MQL Playground</span>
          </Link>
        </div>

        {/* Engine Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/60">
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-foreground">
              {MONGO_TOPICS.length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Engine lessons</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-foreground">4</div>
            <div className="text-xs text-muted-foreground font-medium">Interactive labs</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">16 MB</div>
            <div className="text-xs text-muted-foreground font-medium">Max BSON limit</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-foreground">
              {MONGO_FLASHCARDS.length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Staff flashcards</div>
          </div>
        </div>
      </section>

      {/* Primary Navigation Cards */}
      <section className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/mongocosmos/concepts"
          className="p-6 rounded-xl bg-card border border-border hover:border-foreground/40 shadow-xs transition-colors space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/50 text-foreground flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            {MONGO_TOPICS.length} Core Concepts
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            From BSON data types, WiredTiger cache internals, and covered index scans to multi-stage pipelines and distributed Raft consensus.
          </p>
        </Link>

        <Link
          href="/mongocosmos/problems"
          className="p-6 rounded-xl bg-card border border-border hover:border-foreground/40 shadow-xs transition-colors space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/50 text-foreground flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            50 Practice Problems
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Solve real-world MQL queries and pipeline aggregations evaluated directly against in-memory BSON collections with unit checks.
          </p>
        </Link>

        <Link
          href="/mongocosmos/flashcards"
          className="p-6 rounded-xl bg-card border border-border hover:border-foreground/40 shadow-xs transition-colors space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/50 text-foreground flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            {MONGO_FLASHCARDS.length} Senior Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            High-yield questions on WiredTiger hazard pointers, write skew, readConcern majority, ESR indexing rules, and chunk migrations.
          </p>
        </Link>
      </section>

      {/* Interactive Labs Grid */}
      <section className="space-y-4 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Interactive Engine Simulators</h2>
            <p className="text-xs text-muted-foreground">Directly manipulate document engine internals in sandbox labs</p>
          </div>
          <Link
            href="/mongocosmos/cheatsheet"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View Cheatsheet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/mongocosmos/wiredtiger-lab"
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground group-hover:underline">WiredTiger Cache Lab</h4>
            <p className="text-xs text-muted-foreground">Dirty page ratio, LRU eviction server, and 60-second checkpoint flushes.</p>
          </Link>

          <Link
            href="/mongocosmos/agg-lab"
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground group-hover:underline">Aggregation Pipeline</h4>
            <p className="text-xs text-muted-foreground">Step through multi-stage transforms ($match, $group, $unwind) and RAM limits.</p>
          </Link>

          <Link
            href="/mongocosmos/replica-lab"
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground group-hover:underline">Replica Consensus Lab</h4>
            <p className="text-xs text-muted-foreground">Raft heartbeats, election quorum, and writeConcern: majority replication.</p>
          </Link>

          <Link
            href="/mongocosmos/sharding-lab"
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Network className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground group-hover:underline">Sharding Cluster Lab</h4>
            <p className="text-xs text-muted-foreground">mongos targeted routing, scatter-gather queries, and chunk migration.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
