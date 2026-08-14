'use client';

import React, { useState } from 'react';
import { CheckCircle2, Database, Play, RefreshCw, ShieldCheck, Sparkles, Trash2, Zap } from 'lucide-react';

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
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              PostgreSQL / InnoDB Storage Internals
            </div>
            <h3 className="text-xl font-bold text-foreground">
              MVCC Tuple Versioning &amp; AutoVacuum Simulator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Readers Never Block Writers • Writers Never Block Readers
        </span>
      </div>

      {/* Tuples on Disk Table */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-muted-foreground font-bold uppercase tracking-wider block">
          Physical Disk Block Page Tuples:
        </span>
        <div className="space-y-2">
          {tuples.map((t, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                t.status === 'active'
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                  : 'border-rose-500/30 bg-rose-500/5 text-muted-foreground line-through opacity-70'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-foreground">Tuple Version #{idx + 1}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">name: &quot;{t.name}&quot;</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <span className="p-1 px-2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  t_xmin: {t.xmin} (Created)
                </span>
                <span className="p-1 px-2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  t_xmax: {t.xmax === 0 ? '0 (Alive)' : `${t.xmax} (Deleted)`}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  t.status === 'active' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-600'
                }`}>
                  {t.status === 'active' ? 'ACTIVE' : 'DEAD TUPLE'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Output */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-2">
        <span className="text-indigo-400 font-bold">MVCC Engine Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleUpdate}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Execute UPDATE (TX {txCounter})</span>
        </button>

        <button
          onClick={handleVacuum}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Run VACUUM (Reclaim Space)</span>
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
