'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Database,
  Filter,
  GitMerge,
  HardDrive,
  HelpCircle,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  Table,
  Terminal,
  Zap,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { BTreeIndexVisualizer } from '../components/BTreeIndexVisualizer';
import { CompositeIndexEvaluator } from '../components/CompositeIndexEvaluator';
import { ExplainPlanVisualizer } from '../components/ExplainPlanVisualizer';
import { SqlJoinsVisualizer } from '../components/SqlJoinsVisualizer';
import { TransactionAnomalyStepper } from '../components/TransactionAnomalyStepper';
import { AcidMvccVisualizer } from '../components/AcidMvccVisualizer';
import { WindowFunctionVisualizer } from '../components/WindowFunctionVisualizer';
import { SqlPlayground } from '../components/SqlPlayground';
import { SchemaErVisualizer } from '../components/SchemaErVisualizer';
import { SQL_TOPICS } from '../data/topics';

type StudioTool =
  | 'btree'
  | 'prefix'
  | 'explain'
  | 'joins'
  | 'anomalies'
  | 'mvcc'
  | 'window'
  | 'schema'
  | 'playground';

const STUDIO_TOOLS: {
  id: StudioTool;
  title: string;
  shortLabel: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'btree',
    title: 'B+ Tree Index Traversal',
    shortLabel: 'B+ Tree',
    tag: 'Storage Engine',
    icon: Layers,
  },
  {
    id: 'prefix',
    title: 'Composite Prefix Rule',
    shortLabel: 'Prefix Rule',
    tag: 'Index Selectivity',
    icon: Filter,
  },
  {
    id: 'explain',
    title: 'EXPLAIN Plan Cost Model',
    shortLabel: 'EXPLAIN Cost',
    tag: 'Cost Optimizer',
    icon: Search,
  },
  {
    id: 'joins',
    title: 'Physical Joins Engine',
    shortLabel: 'Joins Engine',
    tag: 'Query Execution',
    icon: GitMerge,
  },
  {
    id: 'anomalies',
    title: 'ACID Concurrency Anomalies',
    shortLabel: 'ACID Anomalies',
    tag: 'Transactions',
    icon: ShieldAlert,
  },
  {
    id: 'mvcc',
    title: 'MVCC & Dead Tuples',
    shortLabel: 'MVCC / Vacuum',
    tag: 'Storage Engine',
    icon: ShieldCheck,
  },
  {
    id: 'window',
    title: 'Window Function Frames',
    shortLabel: 'Window Frames',
    tag: 'Analytical SQL',
    icon: Table,
  },
  {
    id: 'schema',
    title: 'Schema & ER Diagram',
    shortLabel: 'ER Diagram',
    tag: 'Relational Model',
    icon: Database,
  },
  {
    id: 'playground',
    title: 'In-Browser SQL Scratchpad',
    shortLabel: 'SQL Terminal',
    tag: 'Interactive AST',
    icon: Terminal,
  },
];

const CURRICULUM_TIERS = [
  {
    tier: 'Tier 1',
    category: 'foundations',
    name: 'Foundations & Relational Model',
    summary: 'Relational calculus, physical data types, logical execution order, and 3VL NULL semantics.',
  },
  {
    tier: 'Tier 2',
    category: 'query-execution',
    name: 'Query Processing & Execution',
    summary: 'Correlated subqueries, analytical window frames, recursive CTEs, and Cost-Based Optimizer mechanics.',
  },
  {
    tier: 'Tier 3',
    category: 'indexing',
    name: 'Indexing & Storage Internals',
    summary: 'B+ Tree disk page structures, leftmost prefix selectivity, covering indexes, and GiST/GIN specialized indexes.',
  },
  {
    tier: 'Tier 4',
    category: 'transactions',
    name: 'Concurrency, ACID & Recovery',
    summary: 'Isolation level anomalies, Two-Phase Locking, deadlocks, MVCC tuple versioning, and WAL ARIES crash recovery.',
  },
  {
    tier: 'Tier 5',
    category: 'architecture',
    name: 'Distributed & Production Architecture',
    summary: 'Horizontal sharding, consistent hashing, primary-replica replication, connection pools, and table partitioning.',
  },
] as const;

export default function Home() {
  const [activeTool, setActiveTool] = useState<StudioTool>('btree');
  const [viewMode, setViewMode] = useState<'workbench' | 'expanded'>('workbench');
  const [activeTier, setActiveTier] = useState<string>('foundations');

  const tierTopics = SQL_TOPICS.filter((t) => t.category === activeTier);

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="space-y-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground font-mono text-xs font-medium">
          <Database className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Relational Database Engine Architecture &amp; Query Optimizer Workbench</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Master the SQL &amp; Database Engine.
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          Explore the inner mechanics of database engines under the hood — from B+ Tree leaf page traversal and composite index selectivity to cost-based EXPLAIN plans, physical join algorithms, and MVCC transaction anomalies.
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/sqlcosmos/concepts"
            className="px-5 py-2.5 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs transition shadow-xs flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Curriculum (50 Lessons)</span>
          </Link>

          <Link
            href="/sqlcosmos/playground"
            className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-foreground font-semibold text-xs transition shadow-xs flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            <span>SQL Playground</span>
          </Link>

          <Link
            href="/sqlcosmos/flashcards"
            className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-foreground font-semibold text-xs transition shadow-xs flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Senior Flashcards (18)</span>
          </Link>

          <Link
            href="/sqlcosmos/cheatsheet"
            className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-foreground font-semibold text-xs transition shadow-xs flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Performance Cheat Sheet</span>
          </Link>
        </div>

        {/* Engine Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/60">
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">50</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Engine Lessons</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">8</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Live Simulators</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">O(log N)</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">B+ Tree Stepper</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-card text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">18</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Staff Flashcards</div>
          </div>
        </div>
      </div>

      {/* Interactive Studio Workbench */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-muted-foreground">
              Interactive Engine Studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Database Laboratory Workbench
            </h2>
          </div>

          {/* View mode toggle */}
          <div className="inline-flex p-1 rounded-xl border border-border bg-muted/30 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('workbench')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'workbench'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Workbench View
            </button>
            <button
              onClick={() => setViewMode('expanded')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'expanded'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Expanded Feed
            </button>
          </div>
        </div>

        {/* Workbench Tool Selector Bar */}
        {viewMode === 'workbench' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {STUDIO_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-foreground text-background border-foreground shadow-xs font-semibold'
                      : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className={`text-[9px] uppercase font-mono tracking-wider ${isSelected ? 'text-background/80' : 'text-muted-foreground'}`}>
                      {tool.tag}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold truncate">{tool.shortLabel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Tool Render in Workbench Mode */}
        {viewMode === 'workbench' ? (
          <div className="transition-all duration-200">
            {activeTool === 'btree' && <BTreeIndexVisualizer />}
            {activeTool === 'prefix' && <CompositeIndexEvaluator />}
            {activeTool === 'explain' && <ExplainPlanVisualizer />}
            {activeTool === 'joins' && <SqlJoinsVisualizer />}
            {activeTool === 'anomalies' && <TransactionAnomalyStepper />}
            {activeTool === 'mvcc' && <AcidMvccVisualizer />}
            {activeTool === 'window' && <WindowFunctionVisualizer />}
            {activeTool === 'schema' && <SchemaErVisualizer />}
            {activeTool === 'playground' && <SqlPlayground />}
          </div>
        ) : (
          /* Expanded Mode: All visualizers sequentially */
          <div className="space-y-12">
            <BTreeIndexVisualizer />
            <CompositeIndexEvaluator />
            <ExplainPlanVisualizer />
            <SqlJoinsVisualizer />
            <TransactionAnomalyStepper />
            <AcidMvccVisualizer />
            <WindowFunctionVisualizer />
            <SchemaErVisualizer />
            <SqlPlayground />
          </div>
        )}
      </section>

      {/* Curriculum Roadmap Matrix (5 Tiers) */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div>
            <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-muted-foreground">
              Structured Roadmap
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              The 5-Tier Database Mastery Curriculum
            </h2>
          </div>
          <Link
            href="/sqlcosmos/concepts"
            className="text-xs font-semibold text-foreground hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All 50 Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tier Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {CURRICULUM_TIERS.map((tier) => {
            const isSelected = activeTier === tier.category;
            const count = SQL_TOPICS.filter((t) => t.category === tier.category).length;
            return (
              <button
                key={tier.tier}
                onClick={() => setActiveTier(tier.category)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-foreground text-background border-foreground shadow-xs'
                    : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold">{tier.tier}</span>
                  <span className={`${isSelected ? 'text-background/80' : 'text-muted-foreground'}`}>{count} lessons</span>
                </div>
                <div className="text-xs font-bold leading-snug">{tier.name}</div>
              </button>
            );
          })}
        </div>

        {/* Tier Active Modules Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {tierTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/sqlcosmos/concepts/${topic.id}`}
              className="p-5 rounded-xl bg-card border border-border hover:border-foreground/40 hover:shadow-sm transition flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border border-border bg-muted/30 text-muted-foreground uppercase">
                    {topic.category}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">{topic.difficulty}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:underline leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {topic.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Study Architectural Deep Dive</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Developer Resource Bento Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        <Link
          href="/sqlcosmos/concepts"
          className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/40 hover:shadow-sm transition-all space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            50 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Relational algebra, B+ Tree leaf pages, Leftmost Prefix Rule, Window functions, and WAL crash recovery.
          </p>
        </Link>

        <Link
          href="/sqlcosmos/explain-lab"
          className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/40 hover:shadow-sm transition-all space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            EXPLAIN Plan Optimizer
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dissect Seq Scan vs Index Scan vs Index-Only Scan with real buffer cache metrics and CBO formulas.
          </p>
        </Link>

        <Link
          href="/sqlcosmos/flashcards"
          className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/40 hover:shadow-sm transition-all space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            Senior Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tough database interview questions on Write Skew, MVCC dead tuples, and composite indexes.
          </p>
        </Link>

        <Link
          href="/sqlcosmos/cheatsheet"
          className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/40 hover:shadow-sm transition-all space-y-3 group"
        >
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:underline">
            Performance Cheat Sheet
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Production query recipes for covering indexes, recursive graph CTEs, and zero-downtime refresh.
          </p>
        </Link>
      </section>
    </div>
  );
}
