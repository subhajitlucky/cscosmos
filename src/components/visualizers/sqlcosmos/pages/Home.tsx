'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Database,
  Filter,
  GitMerge,
  HelpCircle,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  Table,
  Terminal,
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
    tag: 'Storage',
    icon: Layers,
  },
  {
    id: 'prefix',
    title: 'Composite Prefix Rule',
    shortLabel: 'Prefix Rule',
    tag: 'Indexes',
    icon: Filter,
  },
  {
    id: 'explain',
    title: 'EXPLAIN Plan Cost Model',
    shortLabel: 'EXPLAIN Cost',
    tag: 'Optimizer',
    icon: Search,
  },
  {
    id: 'joins',
    title: 'Physical Joins Engine',
    shortLabel: 'Joins Engine',
    tag: 'Execution',
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
    tag: 'Storage',
    icon: ShieldCheck,
  },
  {
    id: 'window',
    title: 'Window Function Frames',
    shortLabel: 'Window Frames',
    tag: 'Analytics',
    icon: Table,
  },
  {
    id: 'schema',
    title: 'Schema & ER Diagram',
    shortLabel: 'ER Diagram',
    tag: 'Schema',
    icon: Database,
  },
  {
    id: 'playground',
    title: 'In-Browser SQL Sandbox',
    shortLabel: 'SQL Terminal',
    tag: 'AST Runner',
    icon: Terminal,
  },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<StudioTool>('btree');
  const [viewMode, setViewMode] = useState<'workbench' | 'expanded'>('workbench');

  return (
    <div className="space-y-14 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="space-y-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <Database className="w-3.5 h-3.5" />
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
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-foreground">8</div>
            <div className="text-xs text-muted-foreground font-medium">Live simulators</div>
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
      </div>

      {/* Interactive Studio Workbench */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <div className="text-xs font-mono text-muted-foreground">
              Interactive engine studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Database Laboratory Workbench
            </h2>
          </div>

          {/* View mode toggle */}
          <div className="inline-flex p-1 rounded-lg border border-border bg-muted/30 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('workbench')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'workbench'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Workbench View
            </button>
            <button
              onClick={() => setViewMode('expanded')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
                  className={`p-3 rounded-lg border text-left transition-colors flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-foreground text-background border-foreground shadow-xs font-semibold'
                      : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span
                      className={`text-[10px] font-mono ${
                        isSelected ? 'text-background/80' : 'text-muted-foreground'
                      }`}
                    >
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
          <div className="transition-opacity duration-150">
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
            Practice Problems &amp; Playground
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
