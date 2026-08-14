'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Network, RefreshCw, RotateCcw, Server, ShieldCheck, Skull, Sparkles, Zap } from 'lucide-react';

interface PodPhase {
  name: string;
  sub: string;
  status: 'Pending' | 'Init' | 'Startup' | 'Ready' | 'Running' | 'CrashLoop';
  color: string;
  description: string;
}

const PHASES: PodPhase[] = [
  {
    name: '1. Pending & Scheduling',
    sub: 'kube-scheduler binds Pod to Node',
    status: 'Pending',
    color: 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300',
    description: 'The Pod is accepted by kube-apiserver. kube-scheduler inspects CPU/Memory requests and assigns the Pod to worker-node-02.'
  },
  {
    name: '2. Init Containers',
    sub: 'Sequential Pre-flight Tasks',
    status: 'Init',
    color: 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300',
    description: 'Init containers run to completion one-by-one (e.g. database schema migrations, vault secret fetching) before main app starts.'
  },
  {
    name: '3. Startup Probe Execution',
    sub: 'Granting Warmup Time',
    status: 'Startup',
    color: 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    description: 'Startup probe disables Liveness and Readiness checks until the container has finished its heavy initial warmup.'
  },
  {
    name: '4. Readiness Probe Passed',
    sub: 'Added to Service Endpoints',
    status: 'Ready',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    description: 'Readiness probe returns HTTP 200. kube-proxy immediately adds the Pod IP to the Service endpoint pool to start receiving user traffic.'
  },
  {
    name: '5. Running & Healthy',
    sub: 'Active Production Service',
    status: 'Running',
    color: 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold',
    description: 'Pod is actively processing incoming HTTP requests with recurring Liveness probes ensuring process health.'
  }
];

export function K8sPodLifecycleVisualizer() {
  const [phaseIdx, setPhaseIdx] = useState<number>(0);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);

  const currentPhase = PHASES[phaseIdx];

  const handleNext = () => {
    if (phaseIdx < PHASES.length - 1) {
      setPhaseIdx((prev) => prev + 1);
    }
  };

  const handleCrash = () => {
    setIsCrashed(true);
  };

  const handleReset = () => {
    setPhaseIdx(0);
    setIsCrashed(false);
  };

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              Kubernetes Orchestration Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Pod Lifecycle Stepper &amp; CrashLoopBackOff Analyzer
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          isCrashed ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        }`}>
          {isCrashed ? '🚨 STATUS: CrashLoopBackOff' : `STATUS: ${currentPhase.status}`}
        </span>
      </div>

      {/* Crash Warning */}
      {isCrashed && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-800 dark:text-rose-200">
          <Skull className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <strong>CrashLoopBackOff Detected:</strong> Container exited with code 1. Kubelet is applying exponential restart backoff delay (10s, 20s, 40s... up to 5min). Traffic was removed from Service endpoints!
          </div>
        </div>
      )}

      {/* Phases Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {PHASES.map((p, idx) => (
          <button
            key={p.name}
            onClick={() => {
              setPhaseIdx(idx);
              setIsCrashed(false);
            }}
            className={`p-3 rounded-2xl border text-left font-mono text-xs transition-all ${
              !isCrashed && phaseIdx === idx
                ? `${p.color} font-bold shadow-md scale-105 border-2`
                : 'bg-card border-border text-foreground hover:border-sky-500'
            }`}
          >
            <div className="text-[10px] opacity-70">Step {idx + 1}</div>
            <div className="text-xs font-extrabold truncate">{p.status}</div>
          </button>
        ))}
      </div>

      {/* Active Phase Card */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm font-mono text-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Lifecycle Stage Analysis:
          </span>
          <h4 className="text-lg font-bold text-foreground">{!isCrashed ? currentPhase.name : 'CrashLoopBackOff State'}</h4>
          <p className="text-muted-foreground">{!isCrashed ? currentPhase.sub : 'Process failed repeatedly on startup'}</p>
        </div>

        <p className="text-xs sm:text-sm text-foreground leading-relaxed">
          {!isCrashed ? currentPhase.description : 'To resolve CrashLoopBackOff, inspect logs with kubectl logs -p to see why the process crashed before restart.'}
        </p>
      </div>

      {/* Stepper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Lifecycle</span>
          </button>

          <button
            onClick={handleCrash}
            className="px-4 py-2.5 rounded-2xl bg-rose-600/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Skull className="w-3.5 h-3.5" />
            <span>Simulate App Crash</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={phaseIdx >= PHASES.length - 1 || isCrashed}
          className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <span>Next Lifecycle Step</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
