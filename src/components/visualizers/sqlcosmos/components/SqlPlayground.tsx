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
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              In-Browser SQL Subset Evaluator
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Interactive SQL Query Scratchpad
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Tables: users, orders • Evaluated locally in your browser
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
          className="w-full p-4 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-xs border border-border focus:border-indigo-500 outline-none shadow-inner leading-relaxed"
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
                className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunQuery}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Query</span>
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
          Scope: {SUPPORTED_SQL_SCOPE} An in-memory evaluator, not a database — anything outside that
          subset is refused instead of guessed.
        </p>
      </div>

      {/* Relational Table Output Box */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between text-xs border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-foreground">Query Result Set:</span>
            {result.note ? (
              <span className="text-amber-600 dark:text-amber-400 font-mono">not evaluated</span>
            ) : (
              <span className="text-muted-foreground font-mono">({result.rows.length} rows returned)</span>
            )}
          </div>
          {!result.note && mounted && (
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Evaluated in {result.execTime.toFixed(3)} ms
            </span>
          )}
        </div>

        {result.note ? (
          <p className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs leading-relaxed">
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
