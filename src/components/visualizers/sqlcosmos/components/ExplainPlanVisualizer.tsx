'use client';

import React, { useState } from 'react';
import { Search, Terminal } from 'lucide-react';

type ScanType = 'seq-scan' | 'index-scan' | 'index-only-scan' | 'bitmap-scan';

export function ExplainPlanVisualizer() {
  const [scanType, setScanType] = useState<ScanType>('index-scan');

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-muted-foreground">
              Cost-based query optimizer (CBO)
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              EXPLAIN (ANALYZE, BUFFERS) Plan Walkthrough
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Example plans for a sample <code>orders</code> table (100,000 rows) — simulated execution metrics.
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          Illustrative example plan
        </span>
      </div>

      {/* Plan Type Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { id: 'seq-scan' as const, name: '1. Seq Scan (Table Scan)', sub: 'Reads all disk pages sequentially', speed: 'Slowest (42ms)' },
          { id: 'index-scan' as const, name: '2. Index Scan (B-Tree + Heap)', sub: 'Index point lookup + table heap fetch', speed: 'Fast (0.08ms)' },
          { id: 'index-only-scan' as const, name: '3. Index Only Scan', sub: 'Satisfied entirely inside index leaves', speed: 'Ultra-Fast (0.03ms)' },
          { id: 'bitmap-scan' as const, name: '4. Bitmap Index Scan', sub: 'Combines multiple index filters via bitmap', speed: 'Batch IO (0.4ms)' },
        ].map((item) => {
          const isSelected = scanType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScanType(item.id)}
              className={`p-3.5 rounded-lg border text-left font-mono text-xs transition-colors ${
                isSelected
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                  : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
              }`}
            >
              <div className="font-bold">{item.name}</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-background/80' : 'text-muted-foreground'}`}>
                {item.sub}
              </div>
              <div className={`text-[10px] pt-1.5 font-bold tabular-nums ${isSelected ? 'text-background' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {item.speed}
              </div>
            </button>
          );
        })}
      </div>

      {/* Execution Plan Output Box */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/80 bg-zinc-950 text-zinc-100 dark:bg-black p-5 font-mono text-xs shadow-inner space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px] border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-zinc-400" /> psql explain output (example)
            </span>
            <span className="text-emerald-400 font-bold">Sample table: 100,000 rows</span>
          </div>

          <pre className="text-zinc-200 overflow-x-auto whitespace-pre-wrap leading-relaxed py-2">
{scanType === 'seq-scan' && `Seq Scan on orders (cost=0.00..1845.00 rows=2 width=32)
  Filter: (user_id = 942)
  Rows Removed by Filter: 99998
  Buffers: shared read=845
Planning Time: 0.085 ms
Execution Time: 42.140 ms`}

{scanType === 'index-scan' && `Index Scan using idx_orders_user_id on orders (cost=0.42..8.45 rows=2 width=32)
  Index Cond: (user_id = 942)
  Buffers: shared hit=3 (B-Tree) read=1 (Heap)
Planning Time: 0.110 ms
Execution Time: 0.082 ms`}

{scanType === 'index-only-scan' && `Index Only Scan using idx_orders_covering on orders (cost=0.42..4.12 rows=2 width=16)
  Index Cond: (user_id = 942)
  Heap Fetches: 0 (Table Heap Skipped entirely!)
  Buffers: shared hit=2 (RAM Cache)
Planning Time: 0.092 ms
Execution Time: 0.031 ms`}

{scanType === 'bitmap-scan' && `Bitmap Heap Scan on orders (cost=8.45..42.10 rows=40 width=32)
  Recheck Cond: ((status = 'pending') AND (total > 500))
  -> BitmapAnd (cost=8.45..8.45 rows=40 width=0)
      -> Bitmap Index Scan on idx_orders_status
      -> Bitmap Index Scan on idx_orders_total
Planning Time: 0.145 ms
Execution Time: 0.412 ms`}
          </pre>

          <p className="text-[10px] text-zinc-500 border-t border-zinc-800 pt-2 leading-relaxed">
            Timings are illustrative — showing where cost sits in each plan pattern.
          </p>
        </div>

        {/* Diagnostics & Cost Breakdown */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-xs font-mono text-muted-foreground">
              Optimizer decision analysis:
            </span>
            <h4 className="text-lg font-bold text-foreground">
              {scanType === 'seq-scan' && 'Full Sequential Disk Scan'}
              {scanType === 'index-scan' && 'B-Tree Index Scan + Table Heap Fetch'}
              {scanType === 'index-only-scan' && 'Covering Index (Zero Heap Fetch)'}
              {scanType === 'bitmap-scan' && 'Bitmap Multi-Index Combination'}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {scanType === 'seq-scan' && 'The query reads all 845 disk pages one by one. Missing index forces the engine to examine all 100,000 rows in memory.'}
              {scanType === 'index-scan' && 'Traverses the 3-level B-Tree index in 0.05ms, then fetches the exact 2 matching rows from the heap data page.'}
              {scanType === 'index-only-scan' && 'The covering index includes all requested columns in its leaf payload, achieving 0 Heap Fetches and 1,300x speedup over Seq Scan.'}
              {scanType === 'bitmap-scan' && 'Creates in-memory bitmaps from two independent indexes and performs bitwise AND to batch physical page reads in sorted disk order.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 text-zinc-300 dark:bg-black border border-border/80 font-mono text-xs space-y-1">
            <div className="text-zinc-100 font-bold">CBO Cost Formula:</div>
            <div className="text-zinc-400">Cost = (pages * seq_page_cost) + (tuples * cpu_tuple_cost)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
