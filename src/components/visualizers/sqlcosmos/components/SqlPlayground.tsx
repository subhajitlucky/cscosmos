'use client';

import React, { useEffect, useState } from 'react';
import { Play, Table, Terminal } from 'lucide-react';
import { evaluateSql, SUPPORTED_SQL_SCOPE } from '../lib/sqlSubsetEvaluator';
import type { SqlRow } from '../lib/sqlSubsetEvaluator';

const DEFAULT_QUERY = `SELECT u.name, u.role, o.product, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;`;

const PRESETS: { label: string; sql: string }[] = [
  { label: 'Filter Developers', sql: `SELECT * FROM users WHERE role = 'developer';` },
  { label: 'Inner Join Orders', sql: `SELECT u.name, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id;` },
  { label: 'All Orders', sql: `SELECT * FROM orders;` },
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

export function SqlPlayground() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState<string>(DEFAULT_QUERY);
  const [result, setResult] = useState<RunResult>(() => runQuery(DEFAULT_QUERY));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRunQuery = () => {
    setResult(runQuery(query));
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-muted-foreground">
              In-Browser SQL Subset Evaluator
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Interactive SQL Query Scratchpad
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          Tables: users, orders • Client-Side In-Memory Engine
        </span>
      </div>

      {/* Query Editor Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>SQL Query Input:</span>
          <span>Press &ldquo;Run Query&rdquo; to evaluate</span>
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={5}
          className="w-full p-4 rounded-xl bg-zinc-950 text-emerald-400 dark:bg-black font-mono text-xs border border-border/80 focus:border-foreground/50 outline-none shadow-inner leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-muted-foreground self-center">Presets:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setQuery(preset.sql);
                }}
                className="px-2.5 py-1 rounded-md bg-muted/30 hover:bg-muted/70 border border-border text-foreground font-mono text-[11px] transition"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunQuery}
            className="px-5 py-2 rounded-lg bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Query</span>
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
  );
}
