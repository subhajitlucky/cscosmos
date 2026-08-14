'use client';

import React, { useState } from 'react';
import { Clock, Play, RotateCcw, Zap, Send, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface NodeClock {
  id: string;
  name: string;
  clock: [number, number, number];
  color: string;
}

export function VectorClockLab() {
  const [nodes, setNodes] = useState<NodeClock[]>([
    { id: 'n1', name: 'Node 1 (Alpha)', clock: [0, 0, 0], color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' },
    { id: 'n2', name: 'Node 2 (Beta)', clock: [0, 0, 0], color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' },
    { id: 'n3', name: 'Node 3 (Gamma)', clock: [0, 0, 0], color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
  ]);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] 3-Node Vector Clock Mesh initialized at [0, 0, 0].',
    '[READY] Trigger local events or send network messages between nodes.'
  ]);

  const triggerLocalEvent = (nodeIdx: number) => {
    setNodes(prev =>
      prev.map((n, idx) => {
        if (idx !== nodeIdx) return n;
        const newClock: [number, number, number] = [...n.clock];
        newClock[nodeIdx] += 1;
        return { ...n, clock: newClock };
      })
    );
    setLogs(prev => [
      `[EVENT] ${nodes[nodeIdx].name}: Local event -> Vector updated to [${nodes[nodeIdx].clock.map((v, i) => i === nodeIdx ? v + 1 : v).join(', ')}]`,
      ...prev.slice(0, 5)
    ]);
  };

  const sendMessage = (fromIdx: number, toIdx: number) => {
    // Increment sender clock, then merge into receiver
    const sender = nodes[fromIdx];
    const receiver = nodes[toIdx];

    const updatedSenderClock: [number, number, number] = [...sender.clock];
    updatedSenderClock[fromIdx] += 1;

    const mergedReceiverClock: [number, number, number] = [
      Math.max(receiver.clock[0], updatedSenderClock[0]),
      Math.max(receiver.clock[1], updatedSenderClock[1]),
      Math.max(receiver.clock[2], updatedSenderClock[2]),
    ];
    mergedReceiverClock[toIdx] += 1; // Receiver increments on receipt

    setNodes(prev =>
      prev.map((n, idx) => {
        if (idx === fromIdx) return { ...n, clock: updatedSenderClock };
        if (idx === toIdx) return { ...n, clock: mergedReceiverClock };
        return n;
      })
    );

    setLogs(prev => [
      `[MSG] ${sender.name} -> ${receiver.name}: Merged max(V_sender, V_receiver) -> [${mergedReceiverClock.join(', ')}]`,
      ...prev.slice(0, 5)
    ]);
  };

  const resetClocks = () => {
    setNodes([
      { id: 'n1', name: 'Node 1 (Alpha)', clock: [0, 0, 0], color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' },
      { id: 'n2', name: 'Node 2 (Beta)', clock: [0, 0, 0], color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' },
      { id: 'n3', name: 'Node 3 (Gamma)', clock: [0, 0, 0], color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
    ]);
    setLogs(['[RESET] All vector clocks reset to [0, 0, 0].']);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--sync-amber)]/30 bg-[var(--sync-amber)]/10 text-[var(--sync-amber)] text-xs font-mono">
          <Clock className="w-3.5 h-3.5" /> Vector Clock Causal Order Lab
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--sync-text)]">
          Vector Clocks <span className="text-[var(--sync-primary)] sync-glow">&amp; Happens-Before</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--sync-muted)] max-w-2xl leading-relaxed">
          Simulate causal ordering across 3 distributed nodes. Observe local increments, message vector piggybacking, and element-wise <code>max()</code> merges.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left Nodes Matrix */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--sync-border)] bg-[var(--sync-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--sync-border-subtle)] pb-4">
            <span className="text-[var(--sync-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Distributed Node Vector State
            </span>
            <button
              onClick={resetClocks}
              className="text-[10px] text-[var(--sync-muted)] hover:text-[var(--sync-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            {nodes.map((n, idx) => (
              <div key={n.id} className={`p-4 rounded-xl border space-y-3 ${n.color}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--sync-text)]">{n.name}</span>
                  <div className="p-1.5 rounded bg-black/40 text-base font-bold text-white tracking-widest">
                    [{n.clock.join(', ')}]
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 border-t border-white/10">
                  <button
                    onClick={() => triggerLocalEvent(idx)}
                    className="py-1.5 px-3 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white transition-all"
                  >
                    + Local Event
                  </button>
                  <button
                    onClick={() => sendMessage(idx, (idx + 1) % 3)}
                    className="py-1.5 px-3 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white transition-all flex items-center gap-1"
                  >
                    Send to {nodes[(idx + 1) % 3].name.split(' ')[0]} <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Causal Log & Theorem */}
        <div className="lg:col-span-5 space-y-6">
          {/* Causal Theorem Card */}
          <div className="p-6 rounded-2xl border border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] space-y-3">
            <span className="text-[var(--sync-primary)] uppercase tracking-wider font-bold text-[10px]">
              Causal Happens-Before Definition ($A \to B$)
            </span>
            <p className="text-[11px] text-[var(--sync-muted)] leading-relaxed">
              Event $A$ happened before $B$ ($A \to B$) if and only if:
            </p>
            <div className="p-3 rounded-lg bg-[var(--sync-bg)] border border-[var(--sync-border-subtle)] font-bold text-emerald-400 text-[11px]">
              $\forall k: V_A[k] \le V_B[k]$ and $\exists k: V_A[k] &lt; V_B[k]$
            </div>
            <p className="text-[10px] text-[var(--sync-muted)]">
              If neither $A \to B$ nor $B \to A$, events are <strong>concurrent ($A \parallel B$)</strong>, requiring CRDT join-semilattice resolution.
            </p>
          </div>

          {/* Logs */}
          <div className="p-4 rounded-xl bg-[var(--sync-bg)] border border-[var(--sync-border-subtle)] space-y-1.5 text-[11px] max-h-48 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="text-[var(--sync-muted)] leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
