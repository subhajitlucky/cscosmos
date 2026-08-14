'use client';

import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Cpu, HardDrive, RefreshCw, RotateCcw, Sparkles, Trash2, Zap } from 'lucide-react';

interface HeapObject {
  id: number;
  name: string;
  sizeKb: number;
  age: number; // 0, 1, 2 (promoted)
  generation: 'Young' | 'Old';
  status: 'alive' | 'garbage';
}

export function V8MemoryVisualizer() {
  const [objects, setObjects] = useState<HeapObject[]>([
    { id: 1, name: 'req_ctx_1', sizeKb: 16, age: 0, generation: 'Young', status: 'alive' },
    { id: 2, name: 'temp_buffer_2', sizeKb: 32, age: 0, generation: 'Young', status: 'garbage' },
    { id: 3, name: 'global_cache', sizeKb: 128, age: 2, generation: 'Old', status: 'alive' },
  ]);
  const [counter, setCounter] = useState<number>(4);
  const [log, setLog] = useState<string>('Allocate objects or run Minor Scavenger GC to see Cheney semi-space copy and Old Gen promotion.');

  const handleAllocate = () => {
    const isGarbage = Math.random() > 0.4;
    const newObj: HeapObject = {
      id: counter,
      name: isGarbage ? `temp_var_${counter}` : `session_${counter}`,
      sizeKb: Math.floor(Math.random() * 32) + 16,
      age: 0,
      generation: 'Young',
      status: isGarbage ? 'garbage' : 'alive'
    };
    setObjects((prev) => [...prev, newObj]);
    setCounter((prev) => prev + 1);
    setLog(`Allocated ${newObj.name} (${newObj.sizeKb}KB) into Young Gen (Eden Space).`);
  };

  const handleMinorGC = () => {
    setObjects((prev) =>
      prev
        .filter((o) => o.status === 'alive' || o.generation === 'Old')
        .map((o) => {
          if (o.generation === 'Young') {
            const nextAge = o.age + 1;
            if (nextAge >= 2) {
              return { ...o, age: nextAge, generation: 'Old' as const };
            }
            return { ...o, age: nextAge };
          }
          return o;
        })
    );
    setLog('🧹 MINOR GC (Scavenger): Young Generation garbage swept in 1.2ms! Surviving objects aged & promoted to Old Gen.');
  };

  const handleMajorGC = () => {
    setObjects((prev) => prev.filter((o) => o.status === 'alive'));
    setLog('⚡ MAJOR GC (Mark-Sweep-Compact): Old Generation sweep executed. Full heap compacted!');
  };

  const handleReset = () => {
    setObjects([
      { id: 1, name: 'req_ctx_1', sizeKb: 16, age: 0, generation: 'Young', status: 'alive' },
      { id: 2, name: 'temp_buffer_2', sizeKb: 32, age: 0, generation: 'Young', status: 'garbage' },
      { id: 3, name: 'global_cache', sizeKb: 128, age: 2, generation: 'Old', status: 'alive' },
    ]);
    setCounter(4);
    setLog('Heap reset to initial state.');
  };

  const youngObjects = objects.filter((o) => o.generation === 'Young');
  const oldObjects = objects.filter((o) => o.generation === 'Old');

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              V8 Engine Memory Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              V8 Generational Garbage Collector (Scavenger vs Mark-Sweep)
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Generational Hypothesis: Most objects die young
        </span>
      </div>

      {/* Heap Memory Spaces Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Young Generation (Eden + Semi-Spaces) */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-sm text-foreground">Young Generation (1MB - 64MB)</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">Cheney Semi-Spaces</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {youngObjects.length === 0 ? (
              <div className="text-muted-foreground text-center py-6">Young Gen is empty. Allocate objects!</div>
            ) : (
              youngObjects.map((obj) => (
                <div
                  key={obj.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    obj.status === 'alive'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-foreground'
                      : 'border-rose-500/30 bg-rose-500/5 text-muted-foreground line-through opacity-75'
                  }`}
                >
                  <div>
                    <span className="font-bold">{obj.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">({obj.sizeKb}KB)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-muted">Age: {obj.age}/2</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                      obj.status === 'alive' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-600'
                    }`}>
                      {obj.status === 'alive' ? 'ALIVE' : 'DEAD'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Old Generation (Mark-Sweep-Compact) */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="font-extrabold text-sm text-foreground">Old Generation (Up to 1.4GB)</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">Mark-Sweep-Compact</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {oldObjects.length === 0 ? (
              <div className="text-muted-foreground text-center py-6">No promoted long-lived objects yet.</div>
            ) : (
              oldObjects.map((obj) => (
                <div
                  key={obj.id}
                  className="p-3 rounded-2xl border border-purple-500/40 bg-purple-500/10 text-foreground flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-purple-700 dark:text-purple-300">{obj.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">({obj.sizeKb}KB)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold uppercase text-[10px]">
                    ⭐ PROMOTED
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Log Output */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1">
        <span className="text-emerald-400 font-bold">V8 Memory Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleAllocate}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Allocate Object in Young Gen</span>
        </button>

        <button
          onClick={handleMinorGC}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Run Minor Scavenger GC (&lt; 2ms)</span>
        </button>

        <button
          onClick={handleMajorGC}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run Major Mark-Sweep GC</span>
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
