'use client';

import React, { useState } from 'react';
import { RefreshCw, ShieldCheck, Trash2, Zap } from 'lucide-react';

interface TupleVersion {
  id: number;
  name: string;
  xmin: number;
  xmax: number;
  status: 'active' | 'dead' | 'visible';
}

export function AcidMvccVisualizer() {
  const [tuples, setTuples] = useState<TupleVersion[]>([
    { id: 1, name: 'Alice', xmin: 100, xmax: 0, status: 'active' },
  ]);
  const [txCounter, setTxCounter] = useState<number>(101);
  const [log, setLog] = useState<string>('Click "Execute UPDATE (TX 101)" to see how PostgreSQL creates new tuple versions without in-place overwrites.');

  const handleUpdate = () => {
    const currentTx = txCounter;
    setTuples((prev) => {
      const updatedOld = prev.map((t) =>
        t.status === 'active' ? { ...t, xmax: currentTx, status: 'dead' as const } : t
      );
      const newTuple: TupleVersion = {
        id: 1,
        name: `Alice_v${currentTx}`,
        xmin: currentTx,
        xmax: 0,
        status: 'active'
      };
      return [...updatedOld, newTuple];
    });

    setLog(`✍️ UPDATE EXECUTED (TX ${currentTx}): Old tuple marked dead (xmax=${currentTx}). New tuple inserted (xmin=${currentTx}, xmax=0). Concurrent readers on older snapshots still see old version!`);
    setTxCounter((prev) => prev + 1);
  };

  const handleVacuum = () => {
    setTuples((prev) => prev.filter((t) => t.status === 'active'));
    setLog('🧹 VACUUM COMPLETED: Dead tuples reclaimed from disk page. Physical fragmentation cleaned up!');
  };

  const handleReset = () => {
    setTuples([{ id: 1, name: 'Alice', xmin: 100, xmax: 0, status: 'active' }]);
    setTxCounter(101);
    setLog('State reset to initial single active tuple.');
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-muted-foreground">
              PostgreSQL / InnoDB Storage Internals
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              MVCC Tuple Versioning &amp; AutoVacuum Simulator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          Readers Never Block Writers • Writers Never Block Readers
        </span>
      </div>

      {/* Tuples on Disk Table */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-muted-foreground font-semibold uppercase tracking-wider block text-[11px]">
          Physical Disk Block Page Tuples:
        </span>
        <div className="space-y-2">
          {tuples.map((t, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                t.status === 'active'
                  ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-xs'
                  : 'border-border/60 bg-muted/20 text-muted-foreground line-through opacity-70'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-foreground">Tuple Version #{idx + 1}</span>
                <span className="text-foreground font-mono font-medium">name: &quot;{t.name}&quot;</span>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="p-1 px-2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  t_xmin: {t.xmin} (Created)
                </span>
                <span className="p-1 px-2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  t_xmax: {t.xmax === 0 ? '0 (Alive)' : `${t.xmax} (Deleted)`}
                </span>
                <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] border ${
                  t.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                }`}>
                  {t.status === 'active' ? 'ACTIVE' : 'DEAD TUPLE'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Output */}
      <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs border border-border/80 space-y-1.5 shadow-inner">
        <span className="text-zinc-200 font-bold block">MVCC Engine Log:</span>
        <p className="text-zinc-300 leading-relaxed">{log}</p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleUpdate}
          className="px-4 py-2 rounded-lg bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Execute UPDATE (TX {txCounter})</span>
        </button>

        <button
          onClick={handleVacuum}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Run VACUUM (Reclaim Space)</span>
        </button>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-lg border border-border hover:bg-muted/40 text-foreground text-xs font-medium transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
