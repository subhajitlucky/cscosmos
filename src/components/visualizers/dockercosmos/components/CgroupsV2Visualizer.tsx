'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Cpu, HardDrive, Play, RefreshCw, Skull, Sparkles, Zap } from 'lucide-react';

export function CgroupsV2Visualizer() {
  const [memoryMb, setMemoryMb] = useState<number>(256);
  const [memoryLimit] = useState<number>(512); // 512 MB
  const [cpuThrottled, setCpuThrottled] = useState<boolean>(false);
  const [status, setStatus] = useState<'healthy' | 'oom-killed'>('healthy');
  const [log, setLog] = useState<string>('Container running smoothly within cgroups v2 limits (memory.max: 512MB, cpu.max: 0.5 CPU).');

  const handleLeakMemory = () => {
    const nextMem = memoryMb + 180;
    if (nextMem >= memoryLimit) {
      setMemoryMb(memoryLimit);
      setStatus('oom-killed');
      setLog('💀 OOM KILLER INVOKED: Container memory consumption exceeded 512MB limit! Linux Kernel immediately sent SIGKILL (Signal 9). Container terminated with Exit Code 137.');
    } else {
      setMemoryMb(nextMem);
      setLog(`Allocated heap buffers. Current memory: ${nextMem}MB / ${memoryLimit}MB`);
    }
  };

  const handleToggleCpuThrottle = () => {
    setCpuThrottled((prev) => !prev);
    setLog(
      !cpuThrottled
        ? '⚠️ CPU CFS THROTTLING: Process requested 100ms CPU in a 100ms period, but cpu.max quota is 50ms (0.5 CPU). Kernel paused execution for 50ms!'
        : 'CPU usage back within 50ms CFS quota.'
    );
  };

  const handleReset = () => {
    setMemoryMb(256);
    setStatus('healthy');
    setCpuThrottled(false);
    setLog('Container state reset to 256MB healthy baseline.');
  };

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              Linux Resource Enforcement
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Control Groups (cgroups v2) &amp; The OOM Killer
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          status === 'oom-killed'
            ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        }`}>
          {status === 'oom-killed' ? 'EXIT CODE 137 (OOMKILLED)' : 'CONTAINER RUNNING'}
        </span>
      </div>

      {/* Resource Meters Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Memory cgroup */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-bold text-sm text-foreground flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-500" /> memory.max (Hard Limit)
            </span>
            <span className="text-xs font-mono text-muted-foreground">{memoryMb} MB / {memoryLimit} MB</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-3.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  status === 'oom-killed' ? 'bg-rose-500' : 'bg-sky-500'
                }`}
                style={{ width: `${(memoryMb / memoryLimit) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground font-mono">
            {status === 'oom-killed' ? '🚨 Memory boundary breached. OOM killer invoked!' : 'Safe headroom available'}
          </div>
        </div>

        {/* CPU cgroup */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-bold text-sm text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" /> cpu.max (CFS Quota: 0.5 CPU)
            </span>
            <span className={`text-xs font-mono font-bold ${cpuThrottled ? 'text-amber-500' : 'text-emerald-500'}`}>
              {cpuThrottled ? 'THROTTLED (50ms wait)' : '100% RESPONSIVE'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Linux Completely Fair Scheduler limits execution time to 50,000µs per 100,000µs period.
          </p>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1">
        <span className="text-sky-400 font-bold">cgroups Engine Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleLeakMemory}
          disabled={status === 'oom-killed'}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Skull className="w-4 h-4" />
          <span>Allocate +180MB (Trigger OOM Killer)</span>
        </button>

        <button
          onClick={handleToggleCpuThrottle}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-4 h-4" />
          <span>{cpuThrottled ? 'Release CPU Burst' : 'Simulate CPU Throttling'}</span>
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Container</span>
        </button>
      </div>
    </div>
  );
}
