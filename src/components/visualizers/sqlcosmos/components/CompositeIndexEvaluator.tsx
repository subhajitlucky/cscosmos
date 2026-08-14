'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Filter, Layers, Search, Sparkles, XCircle } from 'lucide-react';

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
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Query Optimization Rules
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Composite Index &amp; Leftmost Prefix Rule Evaluator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Index: ON users(country, status, created_at)
        </span>
      </div>

      {/* Query Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPreset(p)}
            className={`p-4 rounded-2xl border text-left font-mono text-xs transition-all flex flex-col justify-between ${
              selectedPreset.id === p.id
                ? 'bg-indigo-600 text-white shadow-md border-indigo-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-indigo-500'
            }`}
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{p.plan}</span>
              <div className="text-[11px] truncate">{p.sql}</div>
            </div>
            <div className={`text-[10px] pt-2 font-bold ${
              selectedPreset.id === p.id ? 'text-indigo-100' : p.efficiency.includes('100%') ? 'text-emerald-500' : p.efficiency.includes('33%') ? 'text-amber-500' : 'text-rose-500'
            }`}>
              Efficiency: {p.efficiency}
            </div>
          </button>
        ))}
      </div>

      {/* Index Utilization Visualizer */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-6 font-mono text-xs">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Active SQL Query:</span>
          <span className="text-indigo-400 font-bold">{selectedPreset.plan}</span>
        </div>

        <div className="text-indigo-300 text-xs py-1">
          {selectedPreset.sql}
        </div>

        {/* 3-Column Indicator Meter */}
        <div className="space-y-2">
          <span className="text-[11px] text-slate-400">Composite Index Column Utilization:</span>
          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Col 1: Country */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              selectedPreset.matchedColumns.includes('country')
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                : 'border-slate-800 bg-slate-900 text-slate-500'
            }`}>
              <div className="text-xs">Col 1: country</div>
              <div className="text-[10px] pt-1">
                {selectedPreset.matchedColumns.includes('country') ? '✅ B-Tree Active' : '❌ Skipped'}
              </div>
            </div>

            {/* Col 2: Status */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              selectedPreset.matchedColumns.includes('status')
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                : 'border-slate-800 bg-slate-900 text-slate-500'
            }`}>
              <div className="text-xs">Col 2: status</div>
              <div className="text-[10px] pt-1">
                {selectedPreset.matchedColumns.includes('status') ? '✅ B-Tree Active' : '❌ Skipped'}
              </div>
            </div>

            {/* Col 3: Created_at */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              selectedPreset.matchedColumns.includes('created_at')
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                : 'border-slate-800 bg-slate-900 text-slate-500'
            }`}>
              <div className="text-xs">Col 3: created_at</div>
              <div className="text-[10px] pt-1">
                {selectedPreset.matchedColumns.includes('created_at') ? '✅ B-Tree Active' : '❌ Skipped'}
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-indigo-400 font-bold">Execution Verdict:</span>
          <p className="text-slate-300 text-xs leading-relaxed">{selectedPreset.description}</p>
        </div>
      </div>
    </div>
  );
}
