'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, HardDrive, RefreshCw, RotateCcw, ShieldCheck, Skull, Sparkles, Zap } from 'lucide-react';

export function WalCrashRecoveryVisualizer() {
  const [step, setStep] = useState<number>(0);
  const [walEntries, setWalEntries] = useState<string[]>(['TX#101: init balance=100']);
  const [ramValue, setRamValue] = useState<number>(100);
  const [diskValue, setDiskValue] = useState<number>(100);
  const [crashed, setCrashed] = useState<boolean>(false);
  const [log, setLog] = useState<string>('Database running normally. Ready to execute transaction.');

  const handleNextStep = () => {
    if (step === 0) {
      setStep(1);
      setWalEntries((prev) => [...prev, 'TX#102: balance 100 ➔ 500 (fsync)']);
      setLog('1. WAL APPEND: Transaction written to append-only Write-Ahead Log on NVMe disk with fsync(). Disk persistence guaranteed.');
    } else if (step === 1) {
      setStep(2);
      setRamValue(500);
      setLog('2. MEMTABLE MUTATE: In-memory RAM buffer updated to 500. Not yet flushed to database data pages.');
    } else if (step === 2) {
      setStep(3);
      setCrashed(true);
      setRamValue(0);
      setLog('3. 💥 POWER FAILURE / CRASH: Server lost power! All volatile RAM contents wiped to 0.');
    } else if (step === 3) {
      setStep(4);
      setCrashed(false);
      setRamValue(500);
      setDiskValue(500);
      setLog('4. 🛡️ WAL CRASH RECOVERY: Database rebooted. Replayed TX#102 from Write-Ahead Log disk file, fully restoring balance to 500 without data loss! ✅');
    }
  };

  const handleReset = () => {
    setStep(0);
    setWalEntries(['TX#101: init balance=100']);
    setRamValue(100);
    setDiskValue(100);
    setCrashed(false);
    setLog('Reset database to initial clean state.');
  };

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Database Storage Engine &amp; Durability
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Write-Ahead Log (WAL) &amp; Crash Recovery Stepper
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          crashed ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        }`}>
          {crashed ? '💥 CRASHED / RAM WIPED' : 'ACID DURABILITY PROTECTED'}
        </span>
      </div>

      {/* Side by Side Storage Comparison */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Volatile RAM MemTable */}
        <div className={`p-5 rounded-3xl border space-y-2 transition-all ${
          crashed
            ? 'border-rose-800 bg-rose-950/30 text-rose-300'
            : 'border-slate-800 bg-slate-950 text-slate-300'
        }`}>
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-amber-400 font-bold">Volatile In-Memory Buffer (RAM):</span>
            <span className="text-slate-500">{crashed ? 'WIPED (0)' : 'Live'}</span>
          </div>
          <div className="text-2xl font-extrabold text-white py-2">
            Balance: ${ramValue}
          </div>
          <p className="text-[10px] text-slate-400">Volatile memory subject to power failure loss.</p>
        </div>

        {/* Persistent Disk WAL Log */}
        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-950 text-slate-300 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-indigo-400 font-bold">Persistent Write-Ahead Log (NVMe):</span>
            <span className="text-emerald-400 font-bold">fsync() committed</span>
          </div>
          <div className="space-y-1 py-1">
            {walEntries.map((e, idx) => (
              <div key={idx} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-emerald-300 font-bold">
                {e}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-indigo-400 font-bold">Execution Trace:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          onClick={handleNextStep}
          disabled={step >= 4}
          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Execute Next Step ({step + 1}/4)</span>
        </button>
      </div>
    </div>
  );
}
