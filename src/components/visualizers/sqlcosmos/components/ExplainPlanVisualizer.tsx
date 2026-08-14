'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock, Cpu, HardDrive, Search, Sparkles, Terminal, Zap } from 'lucide-react';

type ScanType = 'seq-scan' | 'index-scan' | 'index-only-scan' | 'bitmap-scan';

export function ExplainPlanVisualizer() {
  const [scanType, setScanType] = useState<ScanType>('index-scan');

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              PostgreSQL Cost-Based Optimizer (CBO)
            </div>
            <h3 className="text-xl font-bold text-foreground">
              EXPLAIN (ANALYZE, BUFFERS) Plan Inspector
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Cost Estimation &amp; Execution Latency
        </span>
      </div>

      {/* Plan Type Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { id: 'seq-scan' as const, name: '1. Seq Scan (Table Scan)', sub: 'Reads all disk pages sequentially', speed: 'Slowest (42ms)' },
          { id: 'index-scan' as const, name: '2. Index Scan (B-Tree + Heap)', sub: 'Index point lookup + table heap fetch', speed: 'Fast (0.08ms)' },
          { id: 'index-only-scan' as const, name: '3. Index Only Scan', sub: 'Satisfied entirely inside index leaves', speed: 'Ultra-Fast (0.03ms)' },
          { id: 'bitmap-scan' as const, name: '4. Bitmap Index Scan', sub: 'Combines multiple index filters via bitmap', speed: 'Batch IO (0.4ms)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setScanType(item.id)}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              scanType === item.id
                ? 'bg-indigo-600 text-white shadow-md border-indigo-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-indigo-500'
            }`}
          >
            <div className="font-bold">{item.name}</div>
            <div className={`text-[10px] ${scanType === item.id ? 'text-indigo-100' : 'text-muted-foreground'}`}>
              {item.sub}
            </div>
            <div className={`text-[10px] pt-1 font-bold ${scanType === item.id ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ⚡ {item.speed}
            </div>
          </button>
        ))}
      </div>

      {/* Execution Plan Output Box */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-5 font-mono text-xs shadow-inner space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-indigo-400" /> psql explain output</span>
            <span className="text-emerald-400 font-bold">100,000 Rows Table</span>
          </div>

          <pre className="text-indigo-300 overflow-x-auto whitespace-pre-wrap leading-relaxed py-2">
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
        </div>

        {/* Diagnostics & Cost Breakdown */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Optimizer Decision Analysis:
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

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border font-mono text-xs space-y-1">
            <div className="text-foreground font-bold">CBO Cost Formula:</div>
            <div className="text-slate-500">Cost = (pages * seq_page_cost) + (tuples * cpu_tuple_cost)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
