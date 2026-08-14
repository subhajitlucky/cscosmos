'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Database, Plus, RefreshCw, RotateCcw, ShieldAlert, ShieldCheck, Sparkles, XCircle } from 'lucide-react';

export function PaginationDriftVisualizer() {
  const [items, setItems] = useState<string[]>(['Post #101', 'Post #102', 'Post #103', 'Post #104', 'Post #105', 'Post #106']);
  const [page, setPage] = useState<number>(1);
  const [hasInserted, setHasInserted] = useState<boolean>(false);
  const [log, setLog] = useState<string>('Client is on Page 1 viewing items [Post #101, #102, #103].');

  const handleInsertUrgentPost = () => {
    setItems((prev) => ['🚨 URGENT Post #999', ...prev]);
    setHasInserted(true);
    setLog('⚡ NEW ITEM INSERTED AT TOP: "URGENT Post #999" was created while client was reading Page 1. Click "Next Page" to test pagination drift!');
  };

  const handleNextPage = () => {
    setPage(2);
    if (hasInserted) {
      setLog('🚨 DRIFT DETECTED IN OFFSET PAGINATION: Offset shifted by 1, so "Post #103" was returned AGAIN on Page 2! Keyset cursor pagination completely avoids this.');
    } else {
      setLog('Loaded Page 2.');
    }
  };

  const handleReset = () => {
    setItems(['Post #101', 'Post #102', 'Post #103', 'Post #104', 'Post #105', 'Post #106']);
    setPage(1);
    setHasInserted(false);
    setLog('Reset pagination dataset.');
  };

  return (
    <div className="rounded-3xl border border-pink-500/30 bg-pink-500/5 dark:bg-pink-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-md">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400">
              Database Index Seeks &amp; Data Integrity
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Keyset Cursor vs Offset/Limit Pagination Drift
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300 font-mono text-xs font-bold">
          Viewing Page {page}
        </span>
      </div>

      {/* Side by Side Comparison */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Offset Pagination */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-rose-400 font-bold">1. Offset Pagination (LIMIT 3 OFFSET {page === 1 ? 0 : 3}):</span>
            <span className="text-slate-500">O(N) DB Scan</span>
          </div>

          <div className="space-y-1.5 min-h-[110px]">
            {(page === 1 ? items.slice(0, 3) : items.slice(3, 6)).map((item, idx) => {
              const isDuplicate = page === 2 && item === 'Post #103';
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    isDuplicate
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{item}</span>
                  {isDuplicate && <span className="text-[10px] text-rose-400 font-bold">⚠️ DUPLICATE READ!</span>}
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-rose-400/80">
            {page === 2 && hasInserted && '❌ Post #103 appeared on Page 1 AND Page 2!'}
          </div>
        </div>

        {/* Keyset Cursor Pagination */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-emerald-400 font-bold">2. Keyset Cursor (WHERE id &gt; cursor LIMIT 3):</span>
            <span className="text-emerald-400 font-bold">O(1) B+ Tree Seek</span>
          </div>

          <div className="space-y-1.5 min-h-[110px]">
            {(page === 1 ? ['Post #101', 'Post #102', 'Post #103'] : ['Post #104', 'Post #105', 'Post #106']).map((item, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 flex items-center justify-between">
                <span>{item}</span>
                <span className="text-[10px] text-slate-500">ID &gt; cursor</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-emerald-400">
            ✅ Zero duplicates! Cursor bookmark seeks strictly after Post #103.
          </div>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-pink-400 font-bold">Pagination Trace:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Feed</span>
        </button>

        <div className="flex items-center gap-2">
          {!hasInserted && (
            <button
              onClick={handleInsertUrgentPost}
              className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert New Post at Top</span>
            </button>
          )}

          {page === 1 && (
            <button
              onClick={handleNextPage}
              className="px-6 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
            >
              <span>Next Page (Page 2)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
