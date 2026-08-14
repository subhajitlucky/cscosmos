'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, GitBranch, GitFork, Layers, Network, RefreshCw, RotateCcw, Server, Sparkles, Zap } from 'lucide-react';

export function ApolloFederationVisualizer() {
  const [step, setStep] = useState<number>(0);
  const [log, setLog] = useState<string>('Apollo Federation Supergraph Gateway ready to route federated query.');

  const steps = [
    { title: '1. Supergraph Query Ingestion', desc: 'Client sends single federated query: query { user(id: "u_1") { name, reviews { rating, comment } } }' },
    { title: '2. Subgraph 1: Users Service', desc: 'Gateway queries Users Subgraph for user(id: "u_1") { id, name }. Resolves: { id: "u_1", name: "Alice" }' },
    { title: '3. Subgraph 2: Reviews Service (_entities)', desc: 'Gateway invokes Reviews Subgraph _entities(representations: [{ __typename: "User", id: "u_1" }]) using @key(fields: "id").' },
    { title: '4. Supergraph Entity Merging', desc: 'Gateway stitches subgraphs together into a single unified JSON response and returns to client in 1 network hop!' },
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setLog(steps[step].desc);
      setStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setLog('Reset Apollo Federation query plan.');
  };

  return (
    <div className="rounded-3xl border border-pink-500/30 bg-pink-500/5 dark:bg-pink-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-md">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400">
              Distributed GraphQL Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Apollo Federation v2 &amp; Subgraph Query Planner
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300 font-mono text-xs font-bold">
          Step {Math.min(step, 4)} of 4
        </span>
      </div>

      {/* Supergraph Architecture Flow */}
      <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
        {/* Gateway Router */}
        <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
          step >= 1 ? 'border-pink-500 bg-pink-500/10 text-foreground shadow-md' : 'border-slate-800 bg-slate-950 text-slate-500'
        }`}>
          <div className="font-extrabold text-pink-400">1. Apollo Router (Gateway)</div>
          <p className="text-[10px] text-muted-foreground">Composes Supergraph Schema &amp; generates Query Plan</p>
        </div>

        {/* Subgraph 1 */}
        <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
          step >= 2 ? 'border-emerald-500 bg-emerald-500/10 text-foreground shadow-md' : 'border-slate-800 bg-slate-950 text-slate-500'
        }`}>
          <div className="font-extrabold text-emerald-400">2. Users Subgraph</div>
          <p className="text-[10px] text-muted-foreground">Owns User entity: id, name, email</p>
        </div>

        {/* Subgraph 2 */}
        <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
          step >= 3 ? 'border-sky-500 bg-sky-500/10 text-foreground shadow-md' : 'border-slate-800 bg-slate-950 text-slate-500'
        }`}>
          <div className="font-extrabold text-sky-400">3. Reviews Subgraph</div>
          <p className="text-[10px] text-muted-foreground">Extends User with @key(fields: "id") reviews</p>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-pink-400 font-bold">Query Plan Execution Log:</span>
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
          onClick={handleNext}
          disabled={step >= 4}
          className="px-6 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Step Query Plan ({step}/4)</span>
        </button>
      </div>
    </div>
  );
}
