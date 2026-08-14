'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Play, RefreshCw, Sparkles, Trash2, Zap } from 'lucide-react';

interface Listener {
  id: number;
  name: string;
  type: 'closure' | 'named';
  memoryKb: number;
}

export function EventEmitterVisualizer() {
  const [listeners, setListeners] = useState<Listener[]>([
    { id: 1, name: 'logRequest()', type: 'named', memoryKb: 4 },
    { id: 2, name: 'authGuard()', type: 'named', memoryKb: 4 },
  ]);
  const [maxLimit] = useState<number>(10);
  const [counter, setCounter] = useState<number>(3);
  const [log, setLog] = useState<string>('EventEmitter initialized with 2 listeners. Max warning threshold: 10.');

  const handleAddAnonymous = () => {
    const newId = counter;
    const newListener: Listener = {
      id: newId,
      name: `req.on('close', () => ctx_${newId})`,
      type: 'closure',
      memoryKb: 12 // Captures closure scope
    };

    const nextList = [...listeners, newListener];
    setListeners(nextList);
    setCounter((prev) => prev + 1);

    if (nextList.length > maxLimit) {
      setLog(`🚨 MaxListenersExceededWarning: Possible EventEmitter memory leak detected! ${nextList.length} listeners added. Closure scopes are retaining RAM!`);
    } else {
      setLog(`Added anonymous listener #${newId}. Total active listeners: ${nextList.length}/${maxLimit}`);
    }
  };

  const handleCleanup = () => {
    setListeners((prev) => prev.filter((l) => l.type === 'named'));
    setLog('🧹 CLEANUP EXECUTED: All dangling closure listeners removed with emitter.off() & AbortSignal. Memory reclaimed!');
  };

  const totalMemory = listeners.reduce((acc, l) => acc + l.memoryKb, 0);
  const isLeaking = listeners.length > maxLimit;

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Core Runtime Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              EventEmitter Listener Lifecycle &amp; Memory Leak Simulator
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          isLeaking ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        }`}>
          {listeners.length} / {maxLimit} Listeners ({totalMemory} KB RAM)
        </span>
      </div>

      {/* Warning banner if leaking */}
      {isLeaking && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-800 dark:text-rose-200 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <strong>(node:1024) MaxListenersExceededWarning:</strong> Possible EventEmitter memory leak detected. 11 &quot;request&quot; listeners added. Use emitter.setMaxListeners() to increase limit or remove listeners on connection close.
          </div>
        </div>
      )}

      {/* Active Listeners Table */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs border-b border-border pb-2">
          <span className="font-bold text-foreground">Registered Event Handlers:</span>
          <span className="text-muted-foreground font-mono">Event: &quot;request&quot;</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 font-mono text-xs">
          {listeners.map((l) => (
            <div
              key={l.id}
              className={`p-3 rounded-2xl border flex items-center justify-between ${
                l.type === 'closure'
                  ? 'border-amber-500/40 bg-amber-500/10 text-foreground'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-foreground'
              }`}
            >
              <div className="truncate">
                <span className="font-bold">{l.name}</span>
                <span className="text-[10px] text-muted-foreground ml-2">({l.memoryKb}KB)</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                l.type === 'closure' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              }`}>
                {l.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1">
        <span className="text-emerald-400 font-bold">EventEmitter Engine Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleAddAnonymous}
          className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Simulate Leaky HTTP Request Listener</span>
        </button>

        <button
          onClick={handleCleanup}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Unsubscribe Dangling Listeners (emitter.off)</span>
        </button>
      </div>
    </div>
  );
}
