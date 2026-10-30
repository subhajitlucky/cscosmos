'use client';

import React, { useState } from 'react';
import { Filter } from 'lucide-react';

interface QueryPreset {
  id: string;
  sql: string;
  matchedColumns: ('country' | 'status' | 'created_at')[];
  efficiency: 'Optimal (100%)' | 'Partial (33%)' | 'No Index (0%)';
  plan: 'Index Scan (3 cols)' | 'Index Scan (1 col only)' | 'Seq Scan (Full Table)';
  description: string;
}

const PRESETS: QueryPreset[] = [
  {
    id: 'full-match',
    sql: `SELECT * FROM users WHERE country = 'US' AND status = 'active' AND created_at > '2026-01-01';`,
    matchedColumns: ['country', 'status', 'created_at'],
    efficiency: 'Optimal (100%)',
    plan: 'Index Scan (3 cols)',
    description: '✅ Perfect match: Filters match index columns in exact leftmost order (country -> status -> created_at).'
  },
  {
    id: 'prefix-two',
    sql: `SELECT * FROM users WHERE country = 'US' AND status = 'active';`,
    matchedColumns: ['country', 'status'],
    efficiency: 'Optimal (100%)',
    plan: 'Index Scan (3 cols)',
    description: '✅ Valid leftmost prefix: First two leading columns (country, status) are used with 100% index selectivity.'
  },
  {
    id: 'gap-middle',
    sql: `SELECT * FROM users WHERE country = 'US' AND created_at > '2026-01-01';`,
    matchedColumns: ['country'],
    efficiency: 'Partial (33%)',
    plan: 'Index Scan (1 col only)',
    description: '⚠️ Middle column gap: The index uses "country", but CANNOT use "created_at" in the B-Tree search because "status" was omitted. created_at is checked as a slow post-filter!'
  },
  {
    id: 'no-prefix',
    sql: `SELECT * FROM users WHERE status = 'active';`,
    matchedColumns: [],
    efficiency: 'No Index (0%)',
    plan: 'Seq Scan (Full Table)',
    description: '❌ Violates Leftmost Prefix Rule: Leading column "country" is absent. The B-Tree is sorted by country, so it CANNOT locate records by status without reading all rows sequentially!'
  }
];

export function CompositeIndexEvaluator() {
  const [selectedPreset, setSelectedPreset] = useState<QueryPreset>(PRESETS[0]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-muted-foreground">
              Query optimization rules
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Composite Index &amp; Leftmost Prefix Rule Evaluator
            </h3>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          Index: ON users(country, status, created_at)
        </span>
      </div>

      {/* Query Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESETS.map((p) => {
          const isSelected = selectedPreset.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPreset(p)}
              className={`p-4 rounded-lg border text-left font-mono text-xs transition-colors flex flex-col justify-between ${
                isSelected
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                  : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] font-mono ${isSelected ? 'text-background/80' : 'text-muted-foreground'}`}>
                  {p.plan}
                </span>
                <div className="text-[11px] truncate font-mono">{p.sql}</div>
              </div>
              <div className={`text-[11px] pt-2 font-bold ${
                isSelected
                  ? 'text-background/90'
                  : p.efficiency.includes('100%')
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : p.efficiency.includes('33%')
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                Efficiency: {p.efficiency}
              </div>
            </button>
          );
        })}
      </div>

      {/* Index Utilization Visualizer */}
      <div className="p-6 rounded-2xl bg-zinc-950 text-zinc-100 dark:bg-black border border-border/80 space-y-5 font-mono text-xs shadow-inner">
        <div className="text-zinc-400 text-[11px] border-b border-zinc-800 pb-2 flex items-center justify-between">
          <span>Active SQL Query:</span>
          <span className="text-zinc-200 font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
            {selectedPreset.plan}
          </span>
        </div>

        <div className="text-emerald-400 text-xs py-1 font-mono">
          {selectedPreset.sql}
        </div>

        {/* 3-Column Indicator Meter */}
        <div className="space-y-2">
          <span className="text-[11px] text-zinc-400">Composite Index Column Utilization:</span>
          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Col 1: Country */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              selectedPreset.matchedColumns.includes('country')
                ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 font-bold'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
            }`}>
              <div className="text-xs">Col 1: country</div>
              <div className="text-[10px] pt-1">
                {selectedPreset.matchedColumns.includes('country') ? '✅ B-Tree Active' : '❌ Skipped'}
              </div>
            </div>

            {/* Col 2: Status */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              selectedPreset.matchedColumns.includes('status')
                ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 font-bold'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
            }`}>
              <div className="text-xs">Col 2: status</div>
              <div className="text-[10px] pt-1">
                {selectedPreset.matchedColumns.includes('status') ? '✅ B-Tree Active' : '❌ Skipped'}
              </div>
            </div>

            {/* Col 3: Created_at */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              selectedPreset.matchedColumns.includes('created_at')
                ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 font-bold'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
            }`}>
              <div className="text-xs">Col 3: created_at</div>
              <div className="text-[10px] pt-1">
                {selectedPreset.matchedColumns.includes('created_at') ? '✅ B-Tree Active' : '❌ Skipped'}
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
          <span className="text-zinc-200 font-bold block">Execution Verdict:</span>
          <p className="text-zinc-300 text-xs leading-relaxed">{selectedPreset.description}</p>
        </div>
      </div>
    </div>
  );
}
