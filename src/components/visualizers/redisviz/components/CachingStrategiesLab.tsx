'use client';

'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Database, RefreshCw, Server, Smartphone, Sparkles, Zap } from 'lucide-react';

type Pattern = 'cache-aside' | 'write-through' | 'write-behind';

export function CachingStrategiesLab() {
  const [pattern, setPattern] = useState<Pattern>('cache-aside');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [simLog, setSimLog] = useState<string>('Click "Simulate Request Flow" to step through network hops.');

  const runSimulation = () => {
    setActiveStep(1);
    setSimLog('1. Client issues query to Application Server.');

    setTimeout(() => {
      setActiveStep(2);
      if (pattern === 'cache-aside') {
        setSimLog('2. App checks Redis. Cache Miss! (0.4ms)');
      } else if (pattern === 'write-through') {
        setSimLog('2. App writes synchronously to Cache.');
      } else {
        setSimLog('2. App writes to Cache & confirms instant 200 OK to client.');
      }
    }, 800);

    setTimeout(() => {
      setActiveStep(3);
      if (pattern === 'cache-aside') {
        setSimLog('3. App queries SQL Database, saves record back into Redis with TTL, and returns.');
      } else if (pattern === 'write-through') {
        setSimLog('3. Cache synchronously persists update to Database before returning 200 OK.');
      } else {
        setSimLog('3. Asynchronous background queue flushes batch writes to DB without blocking client.');
      }
    }, 1800);
  };

  return (
    <div className="rounded-3xl border border-red-500/30 bg-red-500/5 dark:bg-red-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-red-600 dark:text-red-400">
              Distributed System Patterns
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Enterprise Caching Architectures (Cache-Aside, Write-Through, Write-Behind)
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 font-mono text-xs font-bold">
          High Throughput • Zero Stale Reads
        </span>
      </div>

      {/* Pattern Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'cache-aside' as const, name: '1. Cache-Aside (Lazy)', sub: 'Read miss -> Query DB -> Populate Cache' },
          { id: 'write-through' as const, name: '2. Write-Through', sub: 'Synchronous write to Cache AND Database' },
          { id: 'write-behind' as const, name: '3. Write-Behind (Async)', sub: 'Write to Cache -> Async Queue flushes to DB' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setPattern(item.id);
              setActiveStep(0);
              setSimLog('Pattern selected. Click Simulate to trace.');
            }}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              pattern === item.id
                ? 'bg-red-600 text-white shadow-md border-red-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-red-500'
            }`}
          >
            <div className="font-bold">{item.name}</div>
            <div className={`text-[10px] ${pattern === item.id ? 'text-red-100' : 'text-muted-foreground'}`}>
              {item.sub}
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Topology Graph */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {/* Node 1: Client / App */}
          <div className={`p-4 rounded-2xl border transition-all ${
            activeStep === 1 ? 'border-red-500 bg-red-500/20 scale-105 shadow-md shadow-red-500/20' : 'border-slate-800 bg-slate-900'
          }`}>
            <Smartphone className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="font-bold text-xs">App Server / Client</div>
            <span className="text-[10px] text-slate-400">Node / Go API</span>
          </div>

          {/* Node 2: Redis Cache */}
          <div className={`p-4 rounded-2xl border transition-all ${
            activeStep === 2 ? 'border-red-500 bg-red-500/20 scale-105 shadow-md shadow-red-500/20' : 'border-slate-800 bg-slate-900'
          }`}>
            <Zap className="w-6 h-6 mx-auto mb-2 text-red-500 animate-pulse" />
            <div className="font-bold text-xs text-red-400">Redis In-Memory</div>
            <span className="text-[10px] text-slate-400">&lt; 1ms RAM Layer</span>
          </div>

          {/* Node 3: Primary SQL DB */}
          <div className={`p-4 rounded-2xl border transition-all ${
            activeStep === 3 ? 'border-red-500 bg-red-500/20 scale-105 shadow-md shadow-red-500/20' : 'border-slate-800 bg-slate-900'
          }`}>
            <Database className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <div className="font-bold text-xs">PostgreSQL / MySQL</div>
            <span className="text-[10px] text-slate-400">Disk Persistence</span>
          </div>
        </div>

        {/* Live Step Log */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center justify-between">
          <div>
            <span className="text-red-400 font-bold">Network Trace:</span> <span>{simLog}</span>
          </div>
          <button
            onClick={runSimulation}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-md shrink-0 ml-3"
          >
            Simulate Request Flow
          </button>
        </div>
      </div>
    </div>
  );
}
