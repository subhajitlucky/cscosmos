'use client';

import React, { useState } from 'react';
import { Cpu, HardDrive, Play, RefreshCw, Server, Sparkles, Zap } from 'lucide-react';

interface Task {
  id: number;
  type: 'crypto' | 'fs' | 'zlib' | 'dns';
  name: string;
  status: 'queued' | 'running' | 'completed';
  threadId?: number;
}

export function ThreadPoolVisualizer() {
  const [threadCount, setThreadCount] = useState<number>(4);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, type: 'crypto', name: 'crypto.pbkdf2(#1)', status: 'completed', threadId: 1 },
    { id: 2, type: 'crypto', name: 'crypto.pbkdf2(#2)', status: 'completed', threadId: 2 },
    { id: 3, type: 'fs', name: 'fs.readFile("big.csv")', status: 'running', threadId: 3 },
    { id: 4, type: 'zlib', name: 'zlib.gzip(payload)', status: 'running', threadId: 4 },
  ]);
  const [log, setLog] = useState<string>('Click "Dispatch 4 Heavy Crypto Tasks" to simulate thread saturation.');

  const dispatchTasks = () => {
    setLog('🚀 DISPATCHED: 4 PBKDF2 hashing jobs offloaded to Libuv Thread Pool. Main thread remains free!');
    setTasks([
      { id: 10, type: 'crypto', name: 'crypto.pbkdf2(#A)', status: 'running', threadId: 1 },
      { id: 11, type: 'crypto', name: 'crypto.pbkdf2(#B)', status: 'running', threadId: 2 },
      { id: 12, type: 'crypto', name: 'crypto.pbkdf2(#C)', status: 'running', threadId: 3 },
      { id: 13, type: 'crypto', name: 'crypto.pbkdf2(#D)', status: 'running', threadId: 4 },
    ]);

    setTimeout(() => {
      setTasks((prev) => prev.map((t) => ({ ...t, status: 'completed' })));
      setLog('✅ COMPLETED: All 4 threads finished in parallel (102ms total elapsed time).');
    }, 1500);
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Libuv Thread Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              UV_THREADPOOL_SIZE &amp; Asynchronous Worker Offloading
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          UV_THREADPOOL_SIZE = {threadCount}
        </span>
      </div>

      {/* Main Thread vs Thread Pool Diagram */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: V8 Main Thread */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-foreground flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-500" /> V8 Main Thread (Single JS Stack)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                100% Non-Blocking
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Executes all your JavaScript code. When asynchronous fs, crypto, or zlib functions are called, V8 offloads the synchronous blocking C syscall to Libuv and immediately returns.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-1">
            <div className="text-emerald-400 font-bold">Main Thread Status: FREE ⚡</div>
            <div className="text-[11px] text-slate-400">Accepting incoming HTTP sockets on epoll...</div>
          </div>
        </div>

        {/* Right: Worker Threads in Pool */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" /> Libuv Thread Pool (C/C++ Workers)
            </span>
            <span className="text-xs font-mono text-muted-foreground">{threadCount} Threads</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            {Array.from({ length: threadCount }).map((_, i) => {
              const threadId = i + 1;
              const activeTask = tasks.find((t) => t.threadId === threadId && t.status === 'running');
              return (
                <div
                  key={threadId}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    activeTask
                      ? 'border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-md scale-105'
                      : 'border-border bg-muted/40 text-muted-foreground'
                  }`}
                >
                  <div className="font-bold text-[11px]">Thread #{threadId}</div>
                  <div className="text-[10px] pt-1 truncate">
                    {activeTask ? '⚡ RUNNING' : '💤 IDLE'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Controls & Log */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-3">
        <div>
          <span className="text-emerald-400 font-bold">Thread Pool Log:</span> {log}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={dispatchTasks}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Dispatch 4 Heavy Crypto Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
}
