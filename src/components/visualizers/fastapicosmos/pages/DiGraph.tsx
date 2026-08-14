'use client';

import React, { useState } from 'react';
import { GitFork, Play, RotateCcw, Zap, CheckCircle2, ShieldCheck, Database, Key, UserCheck, Lock } from 'lucide-react';

interface DependencyNode {
  id: string;
  name: string;
  type: 'generator' | 'function';
  dependsOn: string[];
  output: string;
  teardown?: string;
  color: string;
}

const NODES: DependencyNode[] = [
  { id: 'db', name: 'get_db_session()', type: 'generator', dependsOn: [], output: 'AsyncSession (Pool Conn)', teardown: 'await session.close()', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  { id: 'token', name: 'oauth2_scheme()', type: 'function', dependsOn: [], output: 'Bearer eyJhbGciOi...', color: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
  { id: 'user', name: 'get_current_user()', type: 'function', dependsOn: ['db', 'token'], output: 'User(id=42, role="admin")', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
  { id: 'admin', name: 'require_admin_role()', type: 'function', dependsOn: ['user'], output: 'Authorized: True', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  { id: 'endpoint', name: 'POST /api/v1/admin/users', type: 'function', dependsOn: ['db', 'admin'], output: 'HTTP 200 OK Response', color: 'border-teal-500/40 bg-teal-500/10 text-teal-300' },
];

export function DiGraph() {
  const [activeNodeIdx, setActiveNodeIdx] = useState<number | null>(null);
  const [isTeardown, setIsTeardown] = useState<boolean>(false);
  const [memoizedCache, setMemoizedCache] = useState<{ [id: string]: boolean }>({});
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Dependency Injection DAG Engine ready.',
    '[READY] Click "Resolve Dependency Tree" to step through hierarchical resolution.'
  ]);

  const runResolution = () => {
    setActiveNodeIdx(0);
    setIsTeardown(false);
    setMemoizedCache({});
    setLogs(['[DAG] Topological sort order: [get_db, oauth2_scheme, get_current_user, require_admin, endpoint]']);

    const executionOrder = [0, 1, 2, 3, 4];
    let step = 0;

    const interval = setInterval(() => {
      if (step < executionOrder.length) {
        const nodeIdx = executionOrder[step];
        const node = NODES[nodeIdx];
        setActiveNodeIdx(nodeIdx);
        setMemoizedCache(prev => ({ ...prev, [node.id]: true }));
        setLogs(prev => [`[RESOLVE] ${node.name} -> injected ${node.output}`, ...prev.slice(0, 5)]);
        step++;
      } else if (step === executionOrder.length) {
        // Teardown phase
        setIsTeardown(true);
        setActiveNodeIdx(0);
        setLogs(prev => ['[TEARDOWN] Executing post-yield cleanup: get_db_session() -> await session.close()', ...prev.slice(0, 5)]);
        step++;
      } else {
        clearInterval(interval);
        setLogs(prev => ['[COMPLETE] All dependencies resolved and cleaned up successfully.', ...prev.slice(0, 5)]);
      }
    }, 500);
  };

  const resetAll = () => {
    setActiveNodeIdx(null);
    setIsTeardown(false);
    setMemoizedCache({});
    setLogs(['[RESET] DAG state cleared.']);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--fastapi-teal)]/30 bg-[var(--fastapi-teal)]/10 text-[var(--fastapi-teal)] text-xs font-mono">
          <GitFork className="w-3.5 h-3.5" /> Directed Acyclic Graph (DAG) Resolver
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--fastapi-text)]">
          Dependency Injection <span className="text-[var(--fastapi-teal)] fastapi-glow">&amp; Yield Teardown</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--fastapi-muted)] max-w-2xl leading-relaxed">
          Trace how FastAPI computes topological sort dependency trees, memoizes sub-dependency calls with <code>use_cache=True</code>, and guarantees context teardowns.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left DAG Tree Visualizer */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--fastapi-border)] bg-[var(--fastapi-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--fastapi-border-subtle)] pb-4">
            <span className="text-[var(--fastapi-teal)] uppercase tracking-wider font-bold flex items-center gap-2">
              <GitFork className="w-3.5 h-3.5" /> Dependency Resolution Graph
            </span>
            <button
              onClick={resetAll}
              className="text-[10px] text-[var(--fastapi-muted)] hover:text-[var(--fastapi-teal)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Hierarchical Node Flow */}
          <div className="space-y-3">
            {NODES.map((node, idx) => {
              const isCurrent = activeNodeIdx === idx;
              const isResolved = memoizedCache[node.id];
              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-xl border transition-all ${node.color} ${
                    isCurrent
                      ? 'ring-2 ring-[var(--fastapi-teal)] shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.01]'
                      : isResolved
                      ? 'opacity-90'
                      : 'opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-bold">
                        {node.type.toUpperCase()}
                      </span>
                      <span className="font-bold text-sm text-[var(--fastapi-text)]">{node.name}</span>
                    </div>

                    <span className="text-[10px]">
                      {isCurrent
                        ? isTeardown
                          ? '🧹 TEARDOWN CLEANUP'
                          : '⚡ EXECUTING'
                        : isResolved
                        ? '✓ MEMOIZED IN CACHE'
                        : 'PENDING'}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span>Injected: <code className="text-white">{node.output}</code></span>
                    {node.teardown && (
                      <span className="text-amber-300">Teardown: {node.teardown}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={runResolution}
            className="w-full py-3 rounded-lg bg-[var(--fastapi-primary)] text-white font-bold hover:bg-[var(--fastapi-primary-hover)] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Resolve Dependency Tree
          </button>
        </div>

        {/* Right Memoization Cache & Execution Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Memoization Cache Box */}
          <div className="p-6 rounded-2xl border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--fastapi-border-subtle)] pb-3">
              <span className="text-[var(--fastapi-teal)] uppercase tracking-wider font-bold">
                Dependency Cache (use_cache=True)
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">O(1) REUSE</span>
            </div>

            <div className="space-y-2 text-[11px]">
              {Object.keys(memoizedCache).map((nodeId) => (
                <div key={nodeId} className="p-2 rounded bg-[var(--fastapi-bg)] border border-[var(--fastapi-border-subtle)] flex items-center justify-between">
                  <span className="text-[var(--fastapi-muted)]">{nodeId}()</span>
                  <span className="text-emerald-400 font-bold">Cached (1 lookup)</span>
                </div>
              ))}
              {Object.keys(memoizedCache).length === 0 && (
                <span className="text-xs text-[var(--fastapi-muted)]">Cache empty — ready for request.</span>
              )}
            </div>
          </div>

          {/* Log Stream */}
          <div className="p-4 rounded-xl bg-[var(--fastapi-bg)] border border-[var(--fastapi-border-subtle)] space-y-1.5 text-[11px] max-h-48 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="text-[var(--fastapi-muted)] leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
