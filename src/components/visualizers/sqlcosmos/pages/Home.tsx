'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Database, GitMerge, HardDrive, HelpCircle, Layers, Play, Search, ShieldCheck, Sparkles, Terminal, Trophy, Zap } from 'lucide-react';
import { BTreeIndexVisualizer } from '../components/BTreeIndexVisualizer';
import { ExplainPlanVisualizer } from '../components/ExplainPlanVisualizer';
import { SqlJoinsVisualizer } from '../components/SqlJoinsVisualizer';
import { AcidMvccVisualizer } from '../components/AcidMvccVisualizer';
import { SqlPlayground } from '../components/SqlPlayground';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Complete Relational Database Architecture Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master the <span className="text-indigo-600 dark:text-indigo-400">SQL &amp; Database</span> Engine.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive engines for B+ Tree index traversal, EXPLAIN ANALYZE cost optimization, physical joins (Nested Loop, Hash, Merge), MVCC tuple versioning, and live SQL execution.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/sqlcosmos/concepts"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore 20 Concepts
          </Link>
          <Link
            href="/sqlcosmos/playground"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> SQL Playground
          </Link>
        </div>
      </div>

      {/* Feature 1: B+ Tree Index Visualizer */}
      <BTreeIndexVisualizer />

      {/* Feature 2: EXPLAIN ANALYZE Cost Plan Inspector */}
      <ExplainPlanVisualizer />

      {/* Feature 3: Joins Engine */}
      <SqlJoinsVisualizer />

      {/* Feature 4: MVCC & Tuple Versioning Simulator */}
      <AcidMvccVisualizer />

      {/* Feature 5: In-Browser SQL Playground */}
      <SqlPlayground />

      {/* Quick Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/sqlcosmos/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-indigo-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
            20 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Relational algebra, B+ Tree leaf pages, Leftmost Prefix Rule, Window functions, and WAL crash recovery.
          </p>
        </Link>

        <Link
          href="/sqlcosmos/explain-lab"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-indigo-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
            EXPLAIN Plan Optimizer
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dissect Seq Scan vs Index Scan vs Index-Only Scan with real buffer cache metrics.
          </p>
        </Link>

        <Link
          href="/sqlcosmos/flashcards"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-indigo-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
            Senior Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tough database interview questions on Write Skew, MVCC dead tuples, and composite indexes.
          </p>
        </Link>
      </div>
    </div>
  );
}
