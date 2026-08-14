'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Cpu, HardDrive, Layers, RefreshCw, Sparkles, Terminal, Zap } from 'lucide-react';

export function MultiStageCacheVisualizer() {
  const [buildType, setBuildType] = useState<'single-stage' | 'multi-stage'>('multi-stage');
  const [modifiedFile, setModifiedFile] = useState<'none' | 'package.json' | 'source_code'>('source_code');

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              BuildKit &amp; Image Optimization
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Multi-Stage Dockerfile &amp; Layer Cache Optimizer
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          buildType === 'multi-stage'
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          Final Image Size: {buildType === 'multi-stage' ? '48 MB (Distroless)' : '1.2 GB (Heavy Node + DevTools)'}
        </span>
      </div>

      {/* Switcher Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="space-y-2">
          <span className="text-muted-foreground font-bold">1. Select Build Architecture:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setBuildType('single-stage')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                buildType === 'single-stage'
                  ? 'bg-sky-600 text-white font-bold shadow-md border-sky-500'
                  : 'bg-card border-border text-foreground hover:border-sky-500'
              }`}
            >
              Single-Stage Build (1.2GB)
            </button>
            <button
              onClick={() => setBuildType('multi-stage')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                buildType === 'multi-stage'
                  ? 'bg-sky-600 text-white font-bold shadow-md border-sky-500'
                  : 'bg-card border-border text-foreground hover:border-sky-500'
              }`}
            >
              Multi-Stage Build (48MB)
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-muted-foreground font-bold">2. Trigger Source Code Edit:</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'none' as const, label: 'No Change (Cached)' },
              { id: 'source_code' as const, label: 'Edit src/app.ts' },
              { id: 'package.json' as const, label: 'Edit package.json' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setModifiedFile(item.id)}
                className={`p-2.5 rounded-xl border text-center text-[11px] transition-all ${
                  modifiedFile === item.id
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'bg-card border-border text-foreground hover:border-sky-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layer Caching Inspector Box */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>BuildKit Layer Execution Trace:</span>
          <span className="text-sky-400 font-bold">
            {modifiedFile === 'source_code' ? '⚡ 90% Cache Reused (1.2s Build)' : modifiedFile === 'package.json' ? '⚠️ Dependencies Rebuilt (45s Build)' : '⚡ 100% Fully Cached (0.3s Build)'}
          </span>
        </div>

        <div className="space-y-2 py-1">
          {/* Layer 1 */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
            <span>[1/4] FROM node:22-alpine AS builder</span>
            <span className="text-emerald-400 font-bold">CACHED</span>
          </div>

          {/* Layer 2 */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            modifiedFile === 'package.json'
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
              : 'border-slate-800 bg-slate-900 text-slate-300'
          }`}>
            <span>[2/4] COPY package*.json ./ &amp;&amp; RUN npm ci</span>
            <span className={modifiedFile === 'package.json' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {modifiedFile === 'package.json' ? 'CACHE BUSTED ⚙️ RUNNING' : 'CACHED'}
            </span>
          </div>

          {/* Layer 3 */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            modifiedFile !== 'none'
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
              : 'border-slate-800 bg-slate-900 text-slate-300'
          }`}>
            <span>[3/4] COPY src/ ./src &amp;&amp; RUN npm run build</span>
            <span className={modifiedFile !== 'none' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {modifiedFile !== 'none' ? 'CACHE BUSTED ⚙️ RECOMPILED' : 'CACHED'}
            </span>
          </div>

          {/* Layer 4 */}
          {buildType === 'multi-stage' ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between text-emerald-200 font-bold">
              <span>[4/4] FROM gcr.io/distroless/nodejs22-debian12 &amp;&amp; COPY --from=builder /app/dist</span>
              <span className="text-emerald-400">MINIMAL PRODUCTION RUNTIME (48MB)</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-between text-rose-200 font-bold">
              <span>[4/4] Retaining heavy npm, typescript, build-essential tools in final image</span>
              <span className="text-rose-400">BLOATED IMAGE (1.2GB)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
