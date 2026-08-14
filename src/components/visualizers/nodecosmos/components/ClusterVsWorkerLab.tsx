'use client';

import React, { useState } from 'react';
import { Cpu, HardDrive, Layers, Network, Server, Sparkles, Zap } from 'lucide-react';

type Mode = 'cluster' | 'worker-threads';

export function ClusterVsWorkerLab() {
  const [mode, setMode] = useState<Mode>('cluster');

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Multi-Core Scale Architectures
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Node.js Clustering vs Worker Threads
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Multi-Process vs Multi-Thread
        </span>
      </div>

      {/* Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setMode('cluster')}
          className={`p-4 rounded-2xl border text-left font-mono text-xs transition-all ${
            mode === 'cluster'
              ? 'bg-emerald-600 text-white shadow-md border-emerald-500 font-bold'
              : 'bg-card border-border text-foreground hover:border-emerald-500'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5"><Server className="w-4 h-4" /> 1. Cluster Module (Multi-Process)</div>
          <div className={`text-[11px] pt-1 ${mode === 'cluster' ? 'text-emerald-100' : 'text-muted-foreground'}`}>
            Spawns multiple isolated OS processes sharing the same TCP port via IPC round-robin.
          </div>
        </button>

        <button
          onClick={() => setMode('worker-threads')}
          className={`p-4 rounded-2xl border text-left font-mono text-xs transition-all ${
            mode === 'worker-threads'
              ? 'bg-emerald-600 text-white shadow-md border-emerald-500 font-bold'
              : 'bg-card border-border text-foreground hover:border-emerald-500'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5"><Cpu className="w-4 h-4" /> 2. Worker Threads (Multi-Threaded)</div>
          <div className={`text-[11px] pt-1 ${mode === 'worker-threads' ? 'text-emerald-100' : 'text-muted-foreground'}`}>
            Runs multiple V8 isolates in the SAME process, sharing RAM via SharedArrayBuffer.
          </div>
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-5 font-mono text-xs shadow-inner space-y-3">
          <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>Architecture Diagram:</span>
            <span className="text-emerald-400 font-bold uppercase">{mode}</span>
          </div>

          {mode === 'cluster' && (
            <div className="space-y-3 py-2">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-blue-400 font-bold">
                Primary Master Process (PID: 1000) [Port 3000 IPC Router]
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                  Worker #1 (PID: 1001)<br/><span className="text-slate-500 text-[10px]">Isolated 64MB RAM</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                  Worker #2 (PID: 1002)<br/><span className="text-slate-500 text-[10px]">Isolated 64MB RAM</span>
                </div>
              </div>
            </div>
          )}

          {mode === 'worker-threads' && (
            <div className="space-y-3 py-2">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-purple-400 font-bold">
                Single Node Process (PID: 1000) [Shared Memory Space]
              </div>
              <div className="p-2 rounded bg-purple-500/10 border border-purple-500/30 text-center text-purple-300 text-[11px]">
                SharedArrayBuffer (Direct Zero-Copy RAM)
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                  V8 Isolate #1 (Thread A)
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                  V8 Isolate #2 (Thread B)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Characteristics Card */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              When to Use Which:
            </span>
            <h4 className="text-lg font-bold text-foreground">
              {mode === 'cluster' ? 'Clustering: Web Server Throughput' : 'Worker Threads: Heavy CPU Computation'}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {mode === 'cluster'
                ? 'Ideal for web applications (Express, Fastify, NestJS) where each process independently handles non-blocking HTTP requests across all CPU cores.'
                : 'Ideal for CPU-heavy tasks like real-time video transcoding, cryptographic hashing, AI tensor calculations, and large in-memory sorts without process spawn overhead.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border font-mono text-xs">
            <strong>Memory Sharing:</strong> {mode === 'cluster' ? '❌ No (Use Redis for sessions)' : '✅ Yes (SharedArrayBuffer / MessagePort)'}
          </div>
        </div>
      </div>
    </div>
  );
}
