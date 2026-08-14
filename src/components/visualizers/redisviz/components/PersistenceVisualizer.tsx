'use client';

import React, { useState } from 'react';
import { Database, FileText, HardDrive, Play, RefreshCw, Sparkles, Zap } from 'lucide-react';

export function PersistenceVisualizer() {
  const [mode, setMode] = useState<'rdb' | 'aof'>('rdb');
  const [isPersisting, setIsPersisting] = useState(false);
  const [log, setLog] = useState<string>('Select mode and click "Trigger Background Save".');

  const triggerSave = () => {
    setIsPersisting(true);
    if (mode === 'rdb') {
      setLog('📸 FORKING: Linux fork() spawned background child process (PID: 28412)...');
      setTimeout(() => {
        setLog('💾 SNAPSHOT: Child process wrote compressed binary dump.rdb (Copy-on-Write). Done in 4ms!');
        setIsPersisting(false);
      }, 1200);
    } else {
      setLog('✍️ APPENDING: Command logged into AOF buffer. Flushing to appendonly.aof via fsync()...');
      setTimeout(() => {
        setLog('🛡️ DURABILITY: Disk fsync completed (appendfsync everysec). State guaranteed durable!');
        setIsPersisting(false);
      }, 1200);
    }
  };

  return (
    <div className="rounded-3xl border border-red-500/30 bg-red-500/5 dark:bg-red-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-red-600 dark:text-red-400">
              Redis Data Durability
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Persistence Engine (RDB Snapshots vs AOF Logs)
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 font-mono text-xs font-bold">
          RDB: Point-in-Time • AOF: Write Stream
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => {
            setMode('rdb');
            setLog('RDB Mode selected: Snapshotting via fork() & Copy-on-Write.');
          }}
          className={`p-4 rounded-2xl border text-left font-mono text-xs transition-all ${
            mode === 'rdb'
              ? 'bg-red-600 text-white shadow-md border-red-500 font-bold'
              : 'bg-card border-border text-foreground hover:border-red-500'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5"><HardDrive className="w-4 h-4" /> 1. RDB (Redis Database Snapshot)</div>
          <div className={`text-[11px] pt-1 ${mode === 'rdb' ? 'text-red-100' : 'text-muted-foreground'}`}>
            Compact binary dump (dump.rdb) created via background child process fork().
          </div>
        </button>

        <button
          onClick={() => {
            setMode('aof');
            setLog('AOF Mode selected: Append-only log with configurable fsync policies.');
          }}
          className={`p-4 rounded-2xl border text-left font-mono text-xs transition-all ${
            mode === 'aof'
              ? 'bg-red-600 text-white shadow-md border-red-500 font-bold'
              : 'bg-card border-border text-foreground hover:border-red-500'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5"><FileText className="w-4 h-4" /> 2. AOF (Append Only File)</div>
          <div className={`text-[11px] pt-1 ${mode === 'aof' ? 'text-red-100' : 'text-muted-foreground'}`}>
            Logs every write command to disk for near zero (1s) data loss tolerance.
          </div>
        </button>
      </div>

      {/* Persistence Architecture Visual Box */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner space-y-2">
          <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-1.5">
            {mode === 'rdb' ? 'RDB Snapshot File (Binary Protocol):' : 'AOF Log File (RESP Protocol):'}
          </div>
          <pre className="text-red-300 overflow-x-auto whitespace-pre-wrap leading-relaxed py-2">
{mode === 'rdb'
  ? `REDIS0011\\xfa\\tredis-ver\\x057.2.4\\xfa\\nredis-bits\\xc0@\\xfe\\x00\\xfb\\x02\\x00\\x00\\x08user:100\\x05Alice\\x00\\x07counter\\xc0*\\xff\\x87\\xda\\x12\\x9c...`
  : `*3\\r\\n$3\\r\\nSET\\r\\n$8\\r\\nuser:100\\r\\n$5\\r\\nAlice\\r\\n
*2\\r\\n$4\\r\\nINCR\\r\\n$7\\r\\ncounter\\r\\n`}
          </pre>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Durability Characteristics:
            </span>
            <h4 className="text-base font-bold text-foreground">
              {mode === 'rdb' ? 'RDB: High Speed & Disaster Recovery' : 'AOF: Maximum Data Safety'}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {mode === 'rdb'
                ? 'RDB creates a compact single-file backup without degrading parent process request latency. Best for disaster recovery and fast server reboots.'
                : 'AOF tracks individual mutations. With appendfsync everysec, at most 1 second of data is lost if power cuts abruptly.'}
            </p>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">{log}</span>
            <button
              onClick={triggerSave}
              disabled={isPersisting}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-md shrink-0 ml-2"
            >
              {isPersisting ? 'Saving...' : 'Trigger Background Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
