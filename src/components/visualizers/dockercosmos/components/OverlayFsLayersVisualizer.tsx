'use client';

import React, { useState } from 'react';
import { ArrowDown, CheckCircle2, HardDrive, Layers, Play, RefreshCw, Sparkles, Terminal, Zap } from 'lucide-react';

export function OverlayFsLayersVisualizer() {
  const [appModified, setAppModified] = useState<boolean>(false);
  const [log, setLog] = useState<string>('OverlayFS mounted. All 3 image layers in lowerdir are read-only and immutable.');

  const handleModifyFile = () => {
    setAppModified(true);
    setLog('✍️ COPY-ON-WRITE (CoW) TRIGGERED: Container modified /app/app.js. Kernel copied the 4KB file from lowerdir into upperdir before writing. Base image layer remains 100% untouched!');
  };

  const handleReset = () => {
    setAppModified(false);
    setLog('Container layer reset to clean state.');
  };

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              Storage Driver Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              OverlayFS Union Filesystem &amp; Copy-on-Write (CoW)
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold">
          lowerdir + upperdir = merged
        </span>
      </div>

      {/* Stacked Layers Diagram */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        {/* Tier 1: Container Read-Write Layer (upperdir) */}
        <div className={`p-4 rounded-2xl border transition-all ${
          appModified
            ? 'border-amber-500 bg-amber-500/20 shadow-md scale-[1.01]'
            : 'border-slate-800 bg-slate-900/80'
        }`}>
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800">
            <span className="text-amber-400 font-bold">Container Read-Write Layer (upperdir)</span>
            <span className="text-slate-400">Ephemeral (Deleted with container)</span>
          </div>
          <div className="pt-2 text-slate-300">
            {appModified ? (
              <span className="text-amber-300 font-bold">✨ /app/app.js (Modified CoW copy: &quot;v2.1 updated&quot;) • /tmp/run.log</span>
            ) : (
              <span className="text-slate-500">Empty (No files written yet)</span>
            )}
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 2: Layer 3 (COPY app.js) */}
        <div className="p-3.5 rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-200">
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-sky-500/20">
            <span className="font-bold text-sky-400">Image Layer #3 (lowerdir) [sha256:4f8e...]</span>
            <span className="text-emerald-400">Read-Only Immutable</span>
          </div>
          <div className="pt-1.5 text-slate-300">
            <code>COPY . /app</code> ➔ /app/app.js (Original code)
          </div>
        </div>

        {/* Tier 3: Layer 2 (RUN apk add nodejs) */}
        <div className="p-3.5 rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-200">
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-sky-500/20">
            <span className="font-bold text-sky-400">Image Layer #2 (lowerdir) [sha256:91bc...]</span>
            <span className="text-emerald-400">Read-Only Immutable</span>
          </div>
          <div className="pt-1.5 text-slate-300">
            <code>RUN apk add nodejs</code> ➔ /usr/bin/node (Node runtime binaries)
          </div>
        </div>

        {/* Tier 4: Base Image (FROM alpine:latest) */}
        <div className="p-3.5 rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-200">
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-sky-500/20">
            <span className="font-bold text-sky-400">Base Image Layer #1 (lowerdir) [sha256:3a11...]</span>
            <span className="text-emerald-400">Read-Only Immutable</span>
          </div>
          <div className="pt-1.5 text-slate-300">
            <code>FROM alpine:latest</code> ➔ /bin/sh, /etc/os-release, /lib/ld-musl.so
          </div>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1">
        <span className="text-sky-400 font-bold">Storage Engine Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleModifyFile}
          disabled={appModified}
          className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Simulate Editing /app/app.js (Trigger CoW)</span>
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Container Layer</span>
        </button>
      </div>
    </div>
  );
}
