'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Crown, GitFork, Heart, RefreshCw, RotateCcw, ShieldCheck, Skull, Sparkles, Zap } from 'lucide-react';

interface RaftNode {
  id: number;
  role: 'Leader' | 'Follower' | 'Candidate' | 'Dead';
  term: number;
  logCount: number;
}

export function RaftConsensusVisualizer() {
  const [term, setTerm] = useState<number>(1);
  const [nodes, setNodes] = useState<RaftNode[]>([
    { id: 1, role: 'Leader', term: 1, logCount: 2 },
    { id: 2, role: 'Follower', term: 1, logCount: 2 },
    { id: 3, role: 'Follower', term: 1, logCount: 2 },
    { id: 4, role: 'Follower', term: 1, logCount: 2 },
    { id: 5, role: 'Follower', term: 1, logCount: 2 },
  ]);
  const [log, setLog] = useState<string>('Raft 5-node cluster running smoothly in Term 1. Node 1 is Leader.');

  const handleProposeLog = () => {
    const leader = nodes.find((n) => n.role === 'Leader');
    if (!leader) {
      setLog('🚨 Cannot write! No elected leader in cluster. State machine frozen.');
      return;
    }

    setNodes((prev) =>
      prev.map((n) =>
        n.role !== 'Dead' ? { ...n, logCount: n.logCount + 1 } : n
      )
    );
    setLog(`⚡ QUORUM REPLICATION: Leader (Node ${leader.id}) proposed "SET key = val". 4/5 nodes acknowledged (Quorum >= 3). Entry COMMITTED to state machine! ✅`);
  };

  const handleKillLeader = () => {
    const leader = nodes.find((n) => n.role === 'Leader');
    if (!leader) return;

    const nextTerm = term + 1;
    setTerm(nextTerm);

    setNodes((prev) => [
      { id: 1, role: 'Dead', term: term, logCount: leader.logCount },
      { id: 2, role: 'Leader', term: nextTerm, logCount: leader.logCount },
      { id: 3, role: 'Follower', term: nextTerm, logCount: leader.logCount },
      { id: 4, role: 'Follower', term: nextTerm, logCount: leader.logCount },
      { id: 5, role: 'Follower', term: nextTerm, logCount: leader.logCount },
    ]);
    setLog(`🚨 LEADER FAILURE: Node 1 died. Node 2 reached election timeout, became Candidate in Term ${nextTerm}, gathered 4 votes (Supermajority > 3), and was elected canonical NEW LEADER! 👑`);
  };

  const handleReset = () => {
    setTerm(1);
    setNodes([
      { id: 1, role: 'Leader', term: 1, logCount: 2 },
      { id: 2, role: 'Follower', term: 1, logCount: 2 },
      { id: 3, role: 'Follower', term: 1, logCount: 2 },
      { id: 4, role: 'Follower', term: 1, logCount: 2 },
      { id: 5, role: 'Follower', term: 1, logCount: 2 },
    ]);
    setLog('Cluster reset to initial state with Node 1 as Leader.');
  };

  const quorumCount = nodes.filter((n) => n.role !== 'Dead').length;
  const hasQuorum = quorumCount >= 3;

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Distributed Consensus Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Raft Leader Election &amp; Quorum Replicated Log
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          hasQuorum ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          {hasQuorum ? `QUORUM HEALTHY (${quorumCount}/5 Nodes Alive)` : 'SPLIT BRAIN / NO QUORUM'}
        </span>
      </div>

      {/* Nodes Grid */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Current Term Epoch: {term}</span>
          <span className="text-indigo-400 font-bold">Quorum Threshold: 3 of 5 Votes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {nodes.map((node) => {
            const isLeader = node.role === 'Leader';
            const isDead = node.role === 'Dead';
            return (
              <div
                key={node.id}
                className={`p-4 rounded-2xl border text-center space-y-1.5 transition-all ${
                  isLeader
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-400 font-bold shadow-lg scale-105'
                    : isDead
                    ? 'border-rose-900 bg-rose-950/40 text-rose-500 opacity-60'
                    : 'border-slate-800 bg-slate-900 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-sm font-extrabold">
                  {isLeader && <Crown className="w-4 h-4 text-amber-400" />}
                  {isDead && <Skull className="w-4 h-4 text-rose-400" />}
                  Node {node.id}
                </div>
                <div className="text-[10px] uppercase font-extrabold">{node.role}</div>
                <div className="text-[10px] text-slate-400">Term: {node.term}</div>
                <div className="text-[10px] text-indigo-400 font-bold">Log Entries: {node.logCount}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-indigo-400 font-bold">Consensus Event Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Cluster</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleKillLeader}
            disabled={nodes[0].role === 'Dead'}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Skull className="w-3.5 h-3.5" />
            <span>Kill Leader (Trigger Election)</span>
          </button>

          <button
            onClick={handleProposeLog}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Propose Log Entry (Replicate)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
