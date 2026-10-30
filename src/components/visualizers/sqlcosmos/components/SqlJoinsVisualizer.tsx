'use client';

import React, { useState } from 'react';
import { GitMerge } from 'lucide-react';

type JoinAlgorithm = 'nested-loop' | 'hash-join' | 'merge-join';

export function SqlJoinsVisualizer() {
  const [algo, setAlgo] = useState<JoinAlgorithm>('hash-join');

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <GitMerge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-muted-foreground">
              Execution engine strategies
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              SQL Physical Joins Engine (Nested Loop, Hash, Merge)
            </h3>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          Physical join operators
        </span>
      </div>

      {/* Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'nested-loop' as const, name: '1. Nested Loop Join', sub: 'Outer loop scans table A, inner queries index on table B', complexity: 'O(N * log M)' },
          { id: 'hash-join' as const, name: '2. Hash Join', sub: 'Build in-memory hash table on A, probe with B', complexity: 'O(N + M)' },
          { id: 'merge-join' as const, name: '3. Merge Join', sub: 'Steps through two pre-sorted inputs in lockstep', complexity: 'O(N + M)' },
        ].map((item) => {
          const isSelected = algo === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAlgo(item.id)}
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
              <div className={`text-[10px] pt-1.5 font-bold ${isSelected ? 'text-background' : 'text-emerald-600 dark:text-emerald-400'}`}>
                Complexity: {item.complexity}
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual Animation Box */}
      <div className="p-6 rounded-2xl bg-zinc-950 text-zinc-100 dark:bg-black border border-border/80 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-zinc-400 text-[11px] border-b border-zinc-800 pb-2 flex items-center justify-between">
          <span>Query: SELECT * FROM users u JOIN orders o ON u.id = o.user_id;</span>
          <span className="text-zinc-200 font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 uppercase">
            {algo}
          </span>
        </div>

        {algo === 'hash-join' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <span className="text-emerald-400 font-bold block">Phase 1: Build Phase (work_mem)</span>
              <div className="text-[11px] text-zinc-300">
                Hash Table created on smaller table (users):
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 mt-2 space-y-1">
                  <div>• Bucket #42: [id: 1 ➔ Alice]</div>
                  <div>• Bucket #88: [id: 2 ➔ Bob]</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <span className="text-zinc-100 font-bold block">Phase 2: Probe Phase</span>
              <div className="text-[11px] text-zinc-300">
                Streaming orders table and probing hash table:
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 mt-2 space-y-1">
                  <div className="text-emerald-400">✅ Match: order #101 (user_id: 1) ➔ Alice</div>
                  <div className="text-emerald-400">✅ Match: order #102 (user_id: 1) ➔ Alice</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {algo === 'nested-loop' && (
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <span className="text-zinc-100 font-bold block">Nested Loop Traversal:</span>
            <div className="text-[11px] text-zinc-300 space-y-1">
              <div>FOR each row in users (Outer Table, 4 rows):</div>
              <div className="pl-4 text-emerald-400">➔ Traverses B-Tree Index idx_orders_user_id (Inner Table) in O(log M)</div>
              <div className="pl-4 text-zinc-400">➔ Matches instantly fetched without scanning entire orders table!</div>
            </div>
          </div>
        )}

        {algo === 'merge-join' && (
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <span className="text-emerald-400 font-bold block">Merge Join Two-Pointer Walk:</span>
            <div className="text-[11px] text-zinc-300 space-y-1">
              <div>Pointer 1 (users.id: [1, 2, 3, 4]) ➔ Walking sorted stream</div>
              <div>Pointer 2 (orders.user_id: [1, 1, 2, 3]) ➔ Walking sorted stream</div>
              <div className="text-emerald-400 pt-1">Both streams advance in single synchronized linear pass O(N + M)!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
