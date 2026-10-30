'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Play, Table, Terminal, Trophy, Sparkles, BookOpen } from 'lucide-react';
import { evaluateSql, SUPPORTED_SQL_SCOPE } from '../lib/sqlSubsetEvaluator';
import type { SqlRow } from '../lib/sqlSubsetEvaluator';
import { SchemaErVisualizer } from './SchemaErVisualizer';

const DEFAULT_QUERY = `SELECT u.name, u.role, o.product, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;`;

const PRESETS: { label: string; sql: string }[] = [
  { label: 'Filter Developers', sql: `SELECT * FROM users WHERE role = 'developer';` },
  { label: 'Inner Join Orders', sql: `SELECT u.name, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id;` },
  { label: 'All Orders', sql: `SELECT * FROM orders;` },
];

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate';
  prompt: string;
  hint: string;
  initialSql: string;
  validate: (rows: SqlRow[], columns: string[]) => boolean;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: '1. Filter Developers',
    difficulty: 'Beginner',
    prompt: 'Write a query to select all users who have the role of "developer".',
    hint: "Use WHERE role = 'developer'",
    initialSql: "SELECT * FROM users WHERE role = 'developer';",
    validate: (rows) => rows.length === 2 && rows.every((r) => r.role === 'developer'),
  },
  {
    id: 'ch-2',
    title: '2. High-Value Orders',
    difficulty: 'Beginner',
    prompt: 'Query all orders where the total price is strictly greater than 200.',
    hint: 'Use WHERE total > 200 on the orders table',
    initialSql: 'SELECT * FROM orders WHERE total > 200;',
    validate: (rows) => rows.length === 2 && rows.every((r) => Number(r.total) > 200),
  },
  {
    id: 'ch-3',
    title: '3. US Customers',
    difficulty: 'Beginner',
    prompt: 'Select the name, email, and country of users located in the country "US".',
    hint: "SELECT name, email, country FROM users WHERE country = 'US';",
    initialSql: "SELECT name, email, country FROM users WHERE country = 'US';",
    validate: (rows, cols) =>
      rows.length === 2 &&
      rows.every((r) => r.country === 'US') &&
      cols.includes('name') &&
      cols.includes('country'),
  },
  {
    id: 'ch-4',
    title: '4. Relational Inner Join',
    difficulty: 'Intermediate',
    prompt: "Join users and orders on user_id to display user name, order product, and order total for orders over $100.",
    hint: 'SELECT u.name, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;',
    initialSql:
      'SELECT u.name, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;',
    validate: (rows, cols) =>
      rows.length === 3 &&
      cols.includes('name') &&
      cols.includes('product') &&
      rows.every((r) => Number(r.total) > 100),
  },
  {
    id: 'ch-5',
    title: '5. Budget Purchases',
    difficulty: 'Beginner',
    prompt: 'Query all orders with total price less than or equal to $150.',
    hint: 'SELECT product, total FROM orders WHERE total <= 150;',
    initialSql: 'SELECT product, total FROM orders WHERE total <= 150;',
    validate: (rows) =>
      rows.length === 2 && rows.every((r) => Number(r.total) <= 150),
  },
  {
    id: 'ch-6',
    title: '6. Designer Lookup',
    difficulty: 'Intermediate',
    prompt: 'Select the name and email for users with role = "designer".',
    hint: "SELECT name, email FROM users WHERE role = 'designer';",
    initialSql: "SELECT name, email FROM users WHERE role = 'designer';",
    validate: (rows, cols) =>
      rows.length === 1 &&
      rows[0].name === 'Diana' &&
      cols.includes('name') &&
      cols.includes('email'),
  },
];

interface RunResult {
  columns: string[];
  rows: SqlRow[];
  execTime: number;
  note?: string;
}

/** Parses and evaluates `sql` against the in-memory tables, timing the real evaluation. */
function runQuery(sql: string): RunResult {
  const startedAt = performance.now();
  const evaluated = evaluateSql(sql);
  return {
    columns: evaluated.columns,
    rows: evaluated.rows,
    execTime: performance.now() - startedAt,
    note: evaluated.note,
  };
}

export interface SqlPlaygroundProps {
  defaultTab?: 'scratchpad' | 'challenges' | 'schema';
}

export function SqlPlayground({ defaultTab = 'scratchpad' }: SqlPlaygroundProps = {}) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'scratchpad' | 'challenges' | 'schema'>(defaultTab);
  const initialSql = defaultTab === 'challenges' ? CHALLENGES[0].initialSql : DEFAULT_QUERY;
  const [query, setQuery] = useState<string>(initialSql);
  const [result, setResult] = useState<RunResult>(() => runQuery(initialSql));
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(CHALLENGES[0].id);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeChallenge =
    CHALLENGES.find((c) => c.id === selectedChallengeId) || CHALLENGES[0];

  const handleRunQuery = () => {
    const res = runQuery(query);
    setResult(res);

    // If currently on a challenge, evaluate correctness
    if (activeTab === 'challenges' && !res.note) {
      if (activeChallenge.validate(res.rows, res.columns)) {
        setCompletedChallenges((prev) => new Set(prev).add(activeChallenge.id));
      }
    }
  };

  const handleSelectChallenge = (ch: Challenge) => {
    setSelectedChallengeId(ch.id);
    setQuery(ch.initialSql);
    setShowHint(false);
    setResult(runQuery(ch.initialSql));
  };

  return (
    <div className="space-y-6">
      {/* Playground Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scratchpad')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border flex items-center gap-1.5 ${
              activeTab === 'scratchpad'
                ? 'bg-foreground text-background border-foreground shadow-xs'
                : 'bg-card border-border text-foreground hover:bg-muted/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>SQL Scratchpad</span>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border flex items-center gap-1.5 ${
              activeTab === 'challenges'
                ? 'bg-foreground text-background border-foreground shadow-xs'
                : 'bg-card border-border text-foreground hover:bg-muted/40'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Guided Challenges</span>
            {completedChallenges.size > 0 && (
              <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {completedChallenges.size}/{CHALLENGES.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-foreground text-background border-foreground shadow-xs'
                : 'bg-card border-border text-foreground hover:bg-muted/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Schema &amp; Tables</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-muted-foreground">
          In-Memory AST Sandbox • Client Evaluated
        </span>
      </div>

      {/* Mode 1 & 2: Scratchpad & Challenges */}
      {activeTab !== 'schema' ? (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          {activeTab === 'challenges' && (
            <div className="space-y-4 border-b border-border pb-6">
              <div className="flex flex-wrap gap-2">
                {CHALLENGES.map((ch) => {
                  const isSelected = selectedChallengeId === ch.id;
                  const isDone = completedChallenges.has(ch.id);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleSelectChallenge(ch)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                          : 'bg-card border-border text-foreground hover:bg-muted/40'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                      <span>{ch.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Challenge Card Banner */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-border bg-muted/40 text-muted-foreground">
                      {activeChallenge.difficulty}
                    </span>
                    <span className="font-bold text-sm text-foreground">{activeChallenge.title}</span>
                  </div>
                  {completedChallenges.has(activeChallenge.id) && (
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Challenge Solved
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {activeChallenge.prompt}
                </p>

                <div className="pt-1 flex items-center gap-3 text-xs">
                  <button
                    onClick={() => setShowHint((prev) => !prev)}
                    className="text-muted-foreground hover:text-foreground underline font-mono text-[11px]"
                  >
                    {showHint ? 'Hide hint' : 'Show hint'}
                  </button>
                  {showHint && (
                    <span className="text-zinc-400 font-mono text-[11px]">
                      {activeChallenge.hint}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Query Editor Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>SQL Query Input:</span>
              <span>Press &ldquo;Run Query&rdquo; to evaluate</span>
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full p-4 rounded-xl bg-zinc-950 text-emerald-400 dark:bg-black font-mono text-xs border border-border/80 focus:border-foreground/50 outline-none shadow-inner leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              {activeTab === 'scratchpad' ? (
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-muted-foreground self-center">Presets:</span>
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setQuery(preset.sql)}
                      className="px-2.5 py-1 rounded-md bg-muted/30 hover:bg-muted/70 border border-border text-foreground font-mono text-[11px] transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setQuery(activeChallenge.initialSql)}
                  className="px-2.5 py-1 rounded-md bg-muted/30 hover:bg-muted/70 border border-border text-foreground font-mono text-[11px] transition"
                >
                  Reset Solution Code
                </button>
              )}

              <button
                onClick={handleRunQuery}
                className="px-5 py-2 rounded-lg bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{activeTab === 'challenges' ? 'Evaluate Challenge' : 'Run Query'}</span>
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
              Scope: {SUPPORTED_SQL_SCOPE} In-memory AST evaluation engine.
            </p>
          </div>

          {/* Relational Table Output Box */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">Query Result Set:</span>
                {result.note ? (
                  <span className="text-amber-600 dark:text-amber-400 font-mono">not evaluated</span>
                ) : (
                  <span className="text-muted-foreground font-mono">({result.rows.length} rows returned)</span>
                )}
              </div>
              {!result.note && mounted && (
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Evaluated in {result.execTime.toFixed(3)} ms
                </span>
              )}
            </div>

            {result.note ? (
              <p className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs leading-relaxed">
                {result.note}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      {result.columns.map((col) => (
                        <th key={col} className="p-2.5 capitalize">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                        {result.columns.map((col) => (
                          <td key={col} className="p-2.5 text-foreground">{String(row[col])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Schema & Tables Explorer */
        <SchemaErVisualizer />
      )}
    </div>
  );
}
