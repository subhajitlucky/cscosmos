'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Database,
  HardDrive,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  AlertTriangle,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface CachePage {
  id: string;
  type: 'clean' | 'dirty';
  keyRange: string;
  sizeKb: number;
}

export function WiredTigerVisualizer() {
  const [cachePages, setCachePages] = useState<CachePage[]>([
    { id: 'p-1', type: 'clean', keyRange: 'users: [u1..u20]', sizeKb: 32 },
    { id: 'p-2', type: 'dirty', keyRange: 'orders: [o101..o150]', sizeKb: 64 },
    { id: 'p-3', type: 'clean', keyRange: 'products: [p1..p50]', sizeKb: 32 },
    { id: 'p-4', type: 'dirty', keyRange: 'users: [u21..u40]', sizeKb: 32 },
  ]);

  const [journalLsn, setJournalLsn] = useState(1048);
  const [lastCheckpointSec, setLastCheckpointSec] = useState(18);
  const [logMessage, setLogMessage] = useState('Engine initialized. WiredTiger cache allocated (50% RAM minus 1GB).');
  const [crashed, setCrashed] = useState(false);

  const totalPages = cachePages.length;
  const dirtyPages = cachePages.filter((p) => p.type === 'dirty').length;
  const dirtyRatio = totalPages > 0 ? Math.round((dirtyPages / totalPages) * 100) : 0;

  // Insert documents: marks clean pages dirty or creates new dirty pages
  const handleInsert = () => {
    if (crashed) return;
    const newPage: CachePage = {
      id: `p-${Date.now().toString().slice(-4)}`,
      type: 'dirty',
      keyRange: `orders: [o${journalLsn}..o${journalLsn + 10}]`,
      sizeKb: 32
    };
    setCachePages((prev) => [...prev, newPage]);
    setJournalLsn((lsn) => lsn + 10);
    setLastCheckpointSec((s) => s + 2);
    setLogMessage(`Document insert committed to RAM cache and written to in-memory Journal buffer. LSN: ${journalLsn + 10}.`);
  };

  // Run Eviction: sweeps clean pages or flushes dirty pages if threshold exceeded
  const handleEvict = () => {
    if (crashed) return;
    setCachePages((prev) => {
      // Evict first clean page or convert dirty to disk write
      const hasClean = prev.some((p) => p.type === 'clean');
      if (hasClean) {
        return prev.filter((p, idx) => idx !== prev.findIndex((x) => x.type === 'clean'));
      }
      return prev.map((p, idx) => (idx === 0 ? { ...p, type: 'clean' } : p));
    });
    setLogMessage('WiredTiger eviction server thread swept least recently used (LRU) pages to free memory.');
  };

  // Trigger Checkpoint: flushes all dirty pages, creates consistent snapshot on disk
  const handleCheckpoint = () => {
    if (crashed) return;
    setCachePages((prev) => prev.map((p) => ({ ...p, type: 'clean' })));
    setLastCheckpointSec(0);
    setLogMessage('Checkpoint complete: All dirty pages written to disk tables (.wt files). Turtle file root pointer updated.');
  };

  // Crash server: clear RAM, then replay journal
  const handleCrash = () => {
    setCrashed(true);
    setLogMessage('SERVER CRASH! Volatile RAM cache lost. Uncheckpointed dirty pages gone from memory.');
  };

  const handleRecover = () => {
    setCrashed(false);
    setCachePages([
      { id: 'p-1', type: 'clean', keyRange: 'users: [u1..u20]', sizeKb: 32 },
      { id: 'p-3', type: 'clean', keyRange: 'products: [p1..p50]', sizeKb: 32 },
      { id: 'p-rec-1', type: 'clean', keyRange: 'orders: [recovered_from_journal]', sizeKb: 64 },
    ]);
    setLastCheckpointSec(0);
    setLogMessage('Crash recovery succeeded: Replayed Journal WAL records up to latest LSN on top of last valid checkpoint.');
  };

  const handleReset = () => {
    setCrashed(false);
    setCachePages([
      { id: 'p-1', type: 'clean', keyRange: 'users: [u1..u20]', sizeKb: 32 },
      { id: 'p-2', type: 'dirty', keyRange: 'orders: [o101..o150]', sizeKb: 64 },
      { id: 'p-3', type: 'clean', keyRange: 'products: [p1..p50]', sizeKb: 32 },
      { id: 'p-4', type: 'dirty', keyRange: 'users: [u21..u40]', sizeKb: 32 },
    ]);
    setJournalLsn(1048);
    setLastCheckpointSec(18);
    setLogMessage('Simulation state reset to default.');
  };

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6 text-card-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              <Cpu className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              WiredTiger Storage Engine: Cache, Journal &amp; Checkpoints
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Simulate RAM page states, dirty page eviction thresholds, WAL journaling, and 60-second checkpoint disk flushes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!crashed ? (
            <>
              <button
                type="button"
                onClick={handleInsert}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Write Doc</span>
              </button>
              <button
                type="button"
                onClick={handleEvict}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground font-medium text-xs shadow-xs transition-colors"
              >
                Run Eviction
              </button>
              <button
                type="button"
                onClick={handleCheckpoint}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground font-medium text-xs shadow-xs transition-colors"
              >
                Trigger Checkpoint
              </button>
              <button
                type="button"
                onClick={handleCrash}
                className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-500/20 transition-colors"
              >
                Crash Node
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleRecover}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Replay Journal &amp; Recover</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border hover:bg-muted/40 text-muted-foreground transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Dirty Page Ratio</div>
          <div className={`text-lg font-bold font-mono ${dirtyRatio > 50 ? 'text-amber-500' : 'text-foreground'}`}>
            {dirtyRatio}%
          </div>
          <div className="text-[10px] text-muted-foreground">Eviction triggers at 80%</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Journal WAL LSN</div>
          <div className="text-lg font-bold font-mono text-foreground">#{journalLsn}</div>
          <div className="text-[10px] text-muted-foreground">Flushed every 100ms</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Last Checkpoint</div>
          <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {lastCheckpointSec}s ago
          </div>
          <div className="text-[10px] text-muted-foreground">Default period: 60s</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Node State</div>
          <div className={`text-lg font-bold font-mono ${crashed ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {crashed ? 'CRASHED' : 'HEALTHY'}
          </div>
          <div className="text-[10px] text-muted-foreground">WiredTiger Engine</div>
        </div>
      </div>

      {/* Engine Architecture Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* 1. Volatile RAM Cache */}
        <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              1. RAM Cache (Volatile)
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">{cachePages.length} Pages</span>
          </div>

          <div className="space-y-2 min-h-[140px]">
            {crashed ? (
              <div className="h-32 flex flex-col items-center justify-center text-xs text-rose-500 gap-1 border border-dashed border-rose-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>Memory Cleared</span>
              </div>
            ) : cachePages.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                Cache Empty
              </div>
            ) : (
              cachePages.map((page) => (
                <div
                  key={page.id}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                    page.type === 'dirty'
                      ? 'border-amber-500/40 bg-amber-500/10 text-foreground'
                      : 'border-border bg-card text-foreground'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-[11px]">{page.id}</span>
                    <span className="text-[10px] text-muted-foreground">{page.keyRange}</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      page.type === 'dirty'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {page.type.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Write-Ahead Log (Journal) */}
        <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              2. Journal (WAL Ring Buffer)
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">fsync 100ms</span>
          </div>

          <div className="space-y-2 min-h-[140px]">
            <div className="p-2.5 rounded-lg border border-border bg-card space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Active Journal File:</span>
                <span className="font-mono text-foreground font-bold">WiredTigerLog.0000000001</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Current LSN:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">#{journalLsn}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Persistence guarantee:</span>
                <span className="font-mono text-foreground font-bold">Write Concern j:true</span>
              </div>
            </div>

            <div className="p-2 rounded-lg border border-dashed border-border/80 text-[11px] text-muted-foreground">
              Sequential append-only log enables instant crash recovery by replaying changes between last checkpoint and current LSN.
            </div>
          </div>
        </div>

        {/* 3. Disk Data Files */}
        <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
              3. Disk Storage (.wt B-Trees)
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Checkpointed</span>
          </div>

          <div className="space-y-2 min-h-[140px]">
            <div className="p-2.5 rounded-lg border border-border bg-card space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Data Tables:</span>
                <span className="font-mono text-foreground font-bold">collection-*.wt</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Index Tables:</span>
                <span className="font-mono text-foreground font-bold">index-*.wt</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Root Pointer:</span>
                <span className="font-mono text-foreground font-bold">WiredTiger.turtle</span>
              </div>
            </div>

            <div className="p-2 rounded-lg border border-dashed border-border/80 text-[11px] text-muted-foreground">
              Disk files store B-Tree pages with Snappy / zlib compression. Only updated during checkpoint flush or heavy eviction.
            </div>
          </div>
        </div>
      </div>

      {/* Engine Event Log */}
      <div className="p-3.5 rounded-lg border border-border bg-muted/20 font-mono text-xs flex items-center gap-2">
        <span className="text-muted-foreground font-bold shrink-0">ENGINE_LOG:</span>
        <span className="text-foreground">{logMessage}</span>
      </div>
    </div>
  );
}
