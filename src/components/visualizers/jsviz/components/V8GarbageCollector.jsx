'use client';

import React, { useState } from 'react';
import { CheckCircle2, Cpu, Play, RotateCcw, Sparkles, Trash2, Zap } from 'lucide-react';

const INITIAL_HEAP = [
  { id: '1', name: 'Global Window (Root)', isRoot: true, color: 'white', pointsTo: ['2', '3'], generation: 'old' },
  { id: '2', name: 'DOM Event Handler', isRoot: false, color: 'white', pointsTo: ['4'], generation: 'young' },
  { id: '3', name: 'User Profile State', isRoot: false, color: 'white', pointsTo: [], generation: 'young' },
  { id: '4', name: 'Active API Cache', isRoot: false, color: 'white', pointsTo: [], generation: 'old' },
  { id: '5', name: 'Orphaned Temp Closure (Unreachable)', isRoot: false, color: 'white', pointsTo: ['6'], generation: 'young' },
  { id: '6', name: 'Orphaned JSON Buffer (Unreachable)', isRoot: false, color: 'white', pointsTo: [], generation: 'young' },
];

export function V8GarbageCollector() {
  const [heap, setHeap] = useState(INITIAL_HEAP);
  const [stage, setStage] = useState('idle');
  const [log, setLog] = useState('Click "Run Tri-Color Mark & Sweep" to trace memory references.');

  const runTriColorGC = () => {
    setStage('marking');
    setLog('🔍 PHASE 1 (Marking): Root objects turned GREY. Scanning active pointers...');

    setTimeout(() => {
      // Roots and reachable children turn BLACK
      setHeap((prev) =>
        prev.map((obj) => {
          if (['1', '2', '3', '4'].includes(obj.id)) {
            return { ...obj, color: 'black' };
          }
          return { ...obj, color: 'white' }; // unreachable remain white
        })
      );
      setLog('⚫ PHASE 2 (Retained): Reachable objects marked BLACK. Unreachable objects remain WHITE.');
    }, 700);

    setTimeout(() => {
      // Sweep white objects
      setStage('swept');
      setHeap((prev) => prev.filter((obj) => obj.color === 'black'));
      setLog('🧹 PHASE 3 (Sweep): Reclaimed 2 unreachable objects from RAM! Memory compacted.');
    }, 1800);
  };

  const reset = () => {
    setHeap(INITIAL_HEAP);
    setStage('idle');
    setLog('Click "Run Tri-Color Mark & Sweep" to trace memory references.');
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              V8 Engine Memory Management
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Tri-Color Mark &amp; Sweep Garbage Collector
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400 inline-block" /> White (Dead)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Grey (Visiting)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Black (Alive)</span>
        </div>
      </div>

      {/* Heap Memory Visualizer Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {heap.map((obj) => (
          <div
            key={obj.id}
            className={`p-4 rounded-2xl border transition-all shadow-sm space-y-2 ${
              obj.color === 'black'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                : 'bg-card border-border text-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                obj.isRoot ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-slate-500/10 text-muted-foreground'
              }`}>
                {obj.isRoot ? 'GC Root' : `${obj.generation} Gen`}
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${
                obj.color === 'black' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`} />
            </div>

            <div className="font-mono text-xs font-bold">{obj.name}</div>
            <div className="text-[11px] text-muted-foreground font-mono">
              {obj.pointsTo && obj.pointsTo.length > 0
                ? `Points to: [Node #${obj.pointsTo.join(', #')}]`
                : 'No outgoing pointers'}
            </div>
          </div>
        ))}
      </div>

      {/* GC Trace Log */}
      <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
        <span className="text-emerald-400 font-bold">GC Runtime Trace:</span> {log}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 pt-2 border-t border-emerald-500/20">
        <button
          onClick={runTriColorGC}
          disabled={stage === 'swept'}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run Tri-Color Mark &amp; Sweep</span>
        </button>

        <button
          onClick={reset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Heap</span>
        </button>
      </div>
    </div>
  );
}
