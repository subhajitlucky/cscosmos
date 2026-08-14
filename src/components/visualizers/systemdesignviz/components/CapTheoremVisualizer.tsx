'use client';

import React, { useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, Database, Network, ShieldCheck, Sparkles, XCircle } from 'lucide-react';

type CapMode = 'CP' | 'AP';

export function CapTheoremVisualizer() {
  const [mode, setMode] = useState<CapMode>('CP');
  const [partitionActive, setPartitionActive] = useState<boolean>(true);

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Distributed Systems Tradeoffs
            </div>
            <h3 className="text-xl font-bold text-foreground">
              CAP Theorem &amp; Network Partition Explorer
            </h3>
          </div>
        </div>

        <button
          onClick={() => setPartitionActive((prev) => !prev)}
          className={`px-3 py-1 rounded-full font-mono text-xs font-bold border transition ${
            partitionActive
              ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40'
              : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
          }`}
        >
          {partitionActive ? '🚨 NETWORK PARTITION ACTIVE' : '✅ HEALTHY NETWORK (NO PARTITION)'}
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <button
          onClick={() => setMode('CP')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'CP'
              ? 'bg-indigo-600 text-white font-bold shadow-md border-indigo-500'
              : 'bg-card border-border text-foreground hover:border-indigo-500'
          }`}
        >
          <div className="font-bold">1. CP (Consistency + Partition Tolerance)</div>
          <div className={`text-[10px] ${mode === 'CP' ? 'text-indigo-100' : 'text-muted-foreground'}`}>
            MongoDB, HBase, ZooKeeper, Spanner
          </div>
        </button>

        <button
          onClick={() => setMode('AP')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'AP'
              ? 'bg-indigo-600 text-white font-bold shadow-md border-indigo-500'
              : 'bg-card border-border text-foreground hover:border-indigo-500'
          }`}
        >
          <div className="font-bold">2. AP (Availability + Partition Tolerance)</div>
          <div className={`text-[10px] ${mode === 'AP' ? 'text-indigo-100' : 'text-muted-foreground'}`}>
            Amazon DynamoDB, Apache Cassandra, CouchDB
          </div>
        </button>
      </div>

      {/* Partition Architecture Simulation */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Node 1 (US Data Center) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold block">Node 1 (US Data Center):</span>
            <div className="p-2.5 rounded-xl bg-slate-950 text-slate-300">Balance: $100</div>
            <div className="text-[11px] text-emerald-300 font-bold">Status: Accepting Writes</div>
          </div>

          {/* Node 2 (EU Data Center) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-sky-400 font-bold block">Node 2 (EU Data Center):</span>
            <div className="p-2.5 rounded-xl bg-slate-950 text-slate-300">Balance: $100</div>
            <div className="text-[11px] font-bold">
              {partitionActive && mode === 'CP' ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Fails Writes (Preserves Strict Consistency)
                </span>
              ) : partitionActive && mode === 'AP' ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Accepts Writes (Eventual Consistency Drift)
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synced in Real-Time
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
