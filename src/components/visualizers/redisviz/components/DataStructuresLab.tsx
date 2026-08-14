'use client';

import React, { useState } from 'react';
import { ArrowRight, Database, Hash, Layers, ListFilter, Sparkles, Terminal, Trophy } from 'lucide-react';

type DS = 'sds' | 'hash' | 'quicklist' | 'skiplist' | 'intset';

export function DataStructuresLab() {
  const [selectedDS, setSelectedDS] = useState<DS>('skiplist');

  return (
    <div className="rounded-3xl border border-red-500/30 bg-red-500/5 dark:bg-red-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-red-600 dark:text-red-400">
              Redis Internal Memory Encodings
            </div>
            <h3 className="text-xl font-bold text-foreground">
              In-Memory Data Structures Deep Dive
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 font-mono text-xs font-bold">
          Zero Disk Latency • RAM Encodings
        </span>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'sds' as const, name: '1. SDS (Strings)' },
          { id: 'hash' as const, name: '2. Hashes (ZipList/Dict)' },
          { id: 'quicklist' as const, name: '3. QuickList (Lists)' },
          { id: 'skiplist' as const, name: '4. SkipList (ZSET)' },
          { id: 'intset' as const, name: '5. IntSet (Sets)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedDS(item.id)}
            className={`px-3.5 py-2 rounded-2xl font-mono text-xs font-bold transition-all ${
              selectedDS === item.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-card border border-border text-foreground hover:border-red-500'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Interactive Visualizer Canvas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Memory Layout Diagram */}
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-5 font-mono text-xs shadow-inner space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2 mb-3">
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-red-400" /> C Memory Layout</span>
              <span className="text-red-400 font-bold uppercase">{selectedDS}</span>
            </div>

            {selectedDS === 'sds' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-blue-400 font-bold">struct sdshdr32 &#123;</div>
                  <div className="pl-4 text-emerald-400">uint32_t len = 5;      <span className="text-slate-500">// O(1) strlen</span></div>
                  <div className="pl-4 text-purple-400">uint32_t alloc = 10;   <span className="text-slate-500">// Pre-allocated capacity</span></div>
                  <div className="pl-4 text-amber-400">char buf[] = &quot;Hello\\0&quot;; <span className="text-slate-500">// Binary Safe byte buffer</span></div>
                  <div className="text-blue-400 font-bold">&#125;;</div>
                </div>
              </div>
            )}

            {selectedDS === 'skiplist' && (
              <div className="space-y-2">
                <div className="text-slate-400 text-[11px]">Multi-Level SkipList Index (O(log N) Search):</div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div className="text-purple-400 flex items-center gap-2">
                    <span className="w-12 text-slate-500">Level 2:</span>
                    <span>[Head] ───────────────────────► [Score: 2400] ──► NULL</span>
                  </div>
                  <div className="text-cyan-400 flex items-center gap-2">
                    <span className="w-12 text-slate-500">Level 1:</span>
                    <span>[Head] ────────► [Score: 1850] ──► [Score: 2400] ──► NULL</span>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-2">
                    <span className="w-12 text-slate-500">Level 0:</span>
                    <span>[Head] ──► [1500] ──► [1850] ──► [2400] ──► NULL</span>
                  </div>
                </div>
              </div>
            )}

            {selectedDS === 'quicklist' && (
              <div className="space-y-2">
                <div className="text-slate-400 text-[11px]">QuickList (Doubly-Linked Listpacks):</div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">Listpack #1 [item1, item2, item3]</div>
                    <span>⇄</span>
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">Listpack #2 [item4, item5]</div>
                  </div>
                </div>
              </div>
            )}

            {selectedDS === 'hash' && (
              <div className="space-y-2">
                <div className="text-slate-400 text-[11px]">Dict + Dual Hash Tables (Rehashing):</div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                  <div className="text-amber-400">ht[0]: Active table (Buckets: 1024, Entries: 850)</div>
                  <div className="text-purple-400">ht[1]: Expansion table (Buckets: 2048, Migrating entries...)</div>
                  <div className="text-slate-500 text-[10px] pt-1">rehashidx: 342 (Incremental step per read/write query)</div>
                </div>
              </div>
            )}

            {selectedDS === 'intset' && (
              <div className="space-y-2">
                <div className="text-slate-400 text-[11px]">IntSet (Contiguous Binary Packed Array):</div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                  <div className="text-blue-400">encoding: INTSET_ENC_INT16 (2 bytes per int)</div>
                  <div className="text-emerald-400">contents: [-340, 12, 45, 992, 1042]</div>
                  <div className="text-slate-500 text-[10px] pt-1">Binary search lookup in O(log N), 0 pointer memory overhead</div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>RAM Overhead: Ultra-optimized</span>
            <span className="text-emerald-400 font-bold">Sub-millisecond</span>
          </div>
        </div>

        {/* Right: Technical Explanation & Characteristics */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Architectural Highlights:
            </span>
            <h4 className="text-xl font-bold text-foreground">
              {selectedDS === 'sds' && 'Simple Dynamic Strings (SDS)'}
              {selectedDS === 'skiplist' && 'SkipList (ZSET Multi-Level Search)'}
              {selectedDS === 'quicklist' && 'QuickList (Doubly-Linked Listpacks)'}
              {selectedDS === 'hash' && 'ZipList & Dict Hash Tables'}
              {selectedDS === 'intset' && 'IntSet (Integer Array Set)'}
            </h4>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {selectedDS === 'sds' && 'SDS avoids C string buffer overflows by tracking length explicitly in the header, enabling O(1) STRLEN lookups and binary safe arbitrary payloads.'}
              {selectedDS === 'skiplist' && 'SkipLists use probabilistic layer heights to offer O(log N) searches and range ranking with significantly lower memory and rebalancing cost than Red-Black trees.'}
              {selectedDS === 'quicklist' && 'Combines the fast O(1) head/tail insertions of linked lists with the cache locality and low pointer overhead of contiguous Listpacks.'}
              {selectedDS === 'hash' && 'Hashes dynamically transition from memory-dense Listpacks to full Hash Tables as field counts grow, using incremental rehashing to eliminate latency spikes.'}
              {selectedDS === 'intset' && 'When a Set only contains integers, Redis stores them in a tightly packed sorted binary buffer, automatically upgrading from int16 to int32 to int64 only when large values appear.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs space-y-1 font-mono">
            <div className="text-foreground font-bold">Time Complexity:</div>
            <div className="text-emerald-600 dark:text-emerald-400">
              {selectedDS === 'sds' && 'STRLEN: O(1) • APPEND: O(1) amortized • GET: O(1)'}
              {selectedDS === 'skiplist' && 'ZADD: O(log N) • ZRANGE: O(log N + M) • ZSCORE: O(1)'}
              {selectedDS === 'quicklist' && 'LPUSH/RPOP: O(1) • LINDEX: O(N)'}
              {selectedDS === 'hash' && 'HGET/HSET: O(1) • HGETALL: O(N)'}
              {selectedDS === 'intset' && 'SISMEMBER: O(log N) • SADD: O(N)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
