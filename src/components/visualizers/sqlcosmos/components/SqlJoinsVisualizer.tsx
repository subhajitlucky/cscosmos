'use client';

import React, { useState } from 'react';
import { ArrowRight, GitMerge, Layers, Sparkles, Terminal, Zap } from 'lucide-react';

type JoinAlgorithm = 'nested-loop' | 'hash-join' | 'merge-join';

export function SqlJoinsVisualizer() {
  const [algo, setAlgo] = useState<JoinAlgorithm>('hash-join');

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Query Engine Execution Strategies
            </div>
            <h3 className="text-xl font-bold text-foreground">
              SQL Physical Joins Engine (Nested Loop, Hash, Merge)
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Join Operator Optimization
        </span>
      </div>

      {/* Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'nested-loop' as const, name: '1. Nested Loop Join', sub: 'Outer loop scans table A, inner queries index on table B', complexity: 'O(N * log M)' },
          { id: 'hash-join' as const, name: '2. Hash Join', sub: 'Build in-memory hash table on A, probe with B', complexity: 'O(N + M)' },
          { id: 'merge-join' as const, name: '3. Merge Join', sub: 'Steps through two pre-sorted inputs in lockstep', complexity: 'O(N + M)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setAlgo(item.id)}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              algo === item.id
                ? 'bg-indigo-600 text-white shadow-md border-indigo-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-indigo-500'
            }`}
          >
            <div className="font-bold">{item.name}</div>
            <div className={`text-[10px] ${algo === item.id ? 'text-indigo-100' : 'text-muted-foreground'}`}>
              {item.sub}
            </div>
            <div className={`text-[10px] pt-1 font-bold ${algo === item.id ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
              Complexity: {item.complexity}
            </div>
          </button>
        ))}
      </div>

      {/* Visual Animation Box */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Query: SELECT * FROM users u JOIN orders o ON u.id = o.user_id;</span>
          <span className="text-indigo-400 font-bold uppercase">{algo}</span>
        </div>

        {algo === 'hash-join' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block">Phase 1: Build Phase (work_mem)</span>
              <div className="text-[11px] text-slate-300">
                Hash Table created on smaller table (users):
                <div className="p-2 rounded bg-slate-950 border border-slate-800 mt-1 space-y-1">
                  <div>• Bucket #42: [id: 1 ➔ Alice]</div>
                  <div>• Bucket #88: [id: 2 ➔ Bob]</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold block">Phase 2: Probe Phase</span>
              <div className="text-[11px] text-slate-300">
                Streaming orders table and probing hash table:
                <div className="p-2 rounded bg-slate-950 border border-slate-800 mt-1 space-y-1">
                  <div className="text-emerald-400">✅ Match: order #101 (user_id: 1) ➔ Alice</div>
                  <div className="text-emerald-400">✅ Match: order #102 (user_id: 2) ➔ Bob</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {algo === 'nested-loop' && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-indigo-400 font-bold block">Nested Loop Traversal:</span>
            <div className="text-[11px] text-slate-300 space-y-1">
              <div>FOR each row in users (Outer Table, 100 rows):</div>
              <div className="pl-4 text-emerald-400">➔ Traverses B-Tree Index idx_orders_user_id (Inner Table) in O(log M)</div>
              <div className="pl-4 text-slate-400">➔ Matches instantly fetched without scanning entire orders table!</div>
            </div>
          </div>
        )}

        {algo === 'merge-join' && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold block">Merge Join Two-Pointer Walk:</span>
            <div className="text-[11px] text-slate-300 space-y-1">
              <div>Pointer 1 (users.id: [1, 2, 3, 4]) ➔ Walking sorted stream</div>
              <div>Pointer 2 (orders.user_id: [1, 1, 2, 4]) ➔ Walking sorted stream</div>
              <div className="text-emerald-400 pt-1">Both streams advance in single synchronized linear pass $O(N + M)$!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
