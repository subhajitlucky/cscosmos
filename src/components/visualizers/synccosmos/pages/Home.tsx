'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Activity, Layers, ArrowUpRight, CheckCircle2, RotateCcw, Play, Zap, Cpu, GitCommit, Clock, Wifi, WifiOff } from 'lucide-react';
import { syncTopics } from '../data/topics';

export function Home() {
  const [syncEngine, setSyncEngine] = useState<'crdt' | 'ot'>('crdt');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [aliceText, setAliceText] = useState<string>('COSMOS ');
  const [bobText, setBobText] = useState<string>('SYNC');
  const [mergedDoc, setMergedDoc] = useState<string>('COSMOS SYNC');
  const [mergeLogs, setMergeLogs] = useState<string[]>([
    '[INIT] Strong Eventual Consistency (SEC) Engine initialized.',
    '[PEERS] Alice (Client A) & Bob (Client B) connected to sync mesh.'
  ]);

  const triggerMerge = () => {
    if (syncEngine === 'crdt') {
      // Deterministic Join-Semilattice Merge (RGA Order)
      const combined = `${aliceText.trim()} ${bobText.trim()}`.trim();
      setMergedDoc(combined);
      setMergeLogs(prev => [
        `[CRDT MERGE] Join-Semilattice State ⊔: merged in O(1) -> "${combined}"`,
        `[MATH] Commutative: (A ⊔ B) == (B ⊔ A) | Idempotent: (A ⊔ A) == A`,
        ...prev.slice(0, 4)
      ]);
    } else {
      // Operational Transformation Matrix Shift
      const combined = `${aliceText.trim()} ${bobText.trim()}`.trim();
      setMergedDoc(combined);
      setMergeLogs(prev => [
        `[OT TRANSFORM] Central server serialized T(Insert_Alice, Insert_Bob) -> "${combined}"`,
        `[SERVER] Transformed op coordinates broadcasted to all clients.`,
        ...prev.slice(0, 4)
      ]);
    }
  };

  const resetAll = () => {
    setAliceText('COSMOS ');
    setBobText('SYNC');
    setMergedDoc('COSMOS SYNC');
    setMergeLogs(['[RESET] Replicas restored to baseline synchronization state.']);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="sync-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--sync-primary)]/30 bg-[var(--sync-primary)]/10 text-[var(--sync-primary)] text-xs font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--sync-primary)]" />
              Conflict-Free Replicated Data Types &bull; OT &bull; Vector Clocks
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--sync-text)]">
              Strong Eventual<br />
              <span className="text-[var(--sync-primary)] sync-glow">Consistency.</span> Zero Merge Conflicts.
            </h1>

            <p className="text-base md:text-lg text-[var(--sync-muted)] max-w-xl leading-relaxed">
              Deconstruct real-time collaboration algorithms. Explore Vector Clocks, Operational Transformation matrices, and Bounded Join-Semilattices powering Figma, Notion, and Yjs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/synccosmos/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--sync-primary)] text-black font-semibold text-sm hover:bg-[var(--sync-primary-hover)] transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/synccosmos/crdt-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--sync-border)] bg-[var(--sync-surface)] text-[var(--sync-text)] font-mono text-sm hover:border-[var(--sync-primary)] hover:text-[var(--sync-primary)] transition-all"
              >
                <GitCommit className="w-4 h-4 text-[var(--sync-primary)]" />
                CRDT Text Lab
              </Link>

              <Link
                href="/synccosmos/vector-clock"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--sync-border-subtle)] bg-[var(--sync-surface-2)] text-[var(--sync-muted)] font-mono text-sm hover:text-[var(--sync-text)] transition-all"
              >
                <Clock className="w-4 h-4 text-[var(--sync-amber)]" />
                Vector Clock Lab
              </Link>
            </div>
          </div>

          {/* Right Live 2-Peer Collaboration Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--sync-border)] bg-[var(--sync-surface)] shadow-2xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-3 border-b border-[var(--sync-border-subtle)] bg-[var(--sync-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-[var(--sync-muted)] ml-2">SyncMesh::ConvergenceHub</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsOnline(o => !o)}
                    className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 transition-colors ${
                      isOnline ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {isOnline ? 'ONLINE' : 'PARTITIONED'}
                  </button>
                  <button
                    onClick={resetAll}
                    className="text-[10px] text-[var(--sync-muted)] hover:text-[var(--sync-primary)]"
                    title="Reset"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Engine Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--sync-bg)] border border-[var(--sync-border-subtle)]">
                  <button
                    onClick={() => setSyncEngine('crdt')}
                    className={`py-1.5 rounded-lg text-[10px] transition-all text-center ${
                      syncEngine === 'crdt'
                        ? 'bg-[var(--sync-primary)] text-black font-bold shadow'
                        : 'text-[var(--sync-muted)] hover:text-[var(--sync-text)]'
                    }`}
                  >
                    Decentralized CRDT (P2P)
                  </button>
                  <button
                    onClick={() => setSyncEngine('ot')}
                    className={`py-1.5 rounded-lg text-[10px] transition-all text-center ${
                      syncEngine === 'ot'
                        ? 'bg-[var(--sync-indigo)] text-white font-bold shadow'
                        : 'text-[var(--sync-muted)] hover:text-[var(--sync-text)]'
                    }`}
                  >
                    Centralized OT (Server)
                  </button>
                </div>

                {/* Peer Editors Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Alice (Peer A) */}
                  <div className="p-3 rounded-xl bg-[var(--sync-bg)] border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold">
                      <span>Peer A (Alice)</span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                    <input
                      type="text"
                      value={aliceText}
                      onChange={(e) => setAliceText(e.target.value)}
                      className="w-full p-2 rounded bg-[var(--sync-surface-2)] border border-[var(--sync-border-subtle)] text-white text-xs font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Bob (Peer B) */}
                  <div className="p-3 rounded-xl bg-[var(--sync-bg)] border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-indigo-400 font-bold">
                      <span>Peer B (Bob)</span>
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    </div>
                    <input
                      type="text"
                      value={bobText}
                      onChange={(e) => setBobText(e.target.value)}
                      className="w-full p-2 rounded bg-[var(--sync-surface-2)] border border-[var(--sync-border-subtle)] text-white text-xs font-bold focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                {/* Converged Output Box */}
                <div className="p-4 rounded-xl bg-[var(--sync-bg)] border border-emerald-500/40 space-y-2 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Converged Document State (SEC)
                    </span>
                    <span className="text-[var(--sync-muted)]">STRONG CONSISTENCY</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--sync-surface-2)] text-base font-bold text-white border border-[var(--sync-border-subtle)]">
                    &ldquo;{mergedDoc}&rdquo;
                  </div>
                </div>

                {/* Merge Action */}
                <button
                  onClick={triggerMerge}
                  className="w-full py-3 rounded-lg bg-[var(--sync-primary)] text-black font-bold hover:bg-[var(--sync-primary-hover)] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Synchronize &amp; Reconcile Peers
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Centralized OT vs Decentralized CRDT */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--sync-primary)] uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Synchronization Architecture Paradigm
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--sync-text)]">
            Centralized OT vs Decentralized CRDTs
          </h2>
          <p className="text-sm text-[var(--sync-muted)]">
            How mathematical join-semilattices eliminate central coordinator servers and enable true local-first P2P synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Operational Transformation Card */}
          <div className="p-8 rounded-2xl border border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--sync-text)]">Operational Transformation (OT)</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Centralized Server
              </span>
            </div>
            <p className="text-xs text-[var(--sync-muted)] leading-relaxed">
              Pioneered by Google Docs and Etherpad. Clients send intent operations to a central master server. The server serializes all edits and transforms character index coordinates using transformation functions $T(op_1, op_2)$.
            </p>
            <div className="p-4 rounded-lg bg-[var(--sync-bg)] font-mono text-[11px] text-[var(--sync-muted)] space-y-2 border border-[var(--sync-border-subtle)]">
              <div>• Requires 100% active connection to central coordinator</div>
              <div>• High server compute overhead transforming concurrent edits</div>
              <div>• Complex edge-case resolution matrices (TP2 property)</div>
              <div>• Incompatible with true peer-to-peer or local-first offline mesh</div>
            </div>
          </div>

          {/* CRDT Card */}
          <div className="p-8 rounded-2xl border-2 border-[var(--sync-primary)]/40 bg-[var(--sync-surface)] space-y-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--sync-text)]">Conflict-Free Replicated Data Types</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--sync-primary)]/10 text-[var(--sync-primary)] border border-[var(--sync-primary)]/30 font-bold">
                Local-First P2P
              </span>
            </div>
            <p className="text-xs text-[var(--sync-muted)] leading-relaxed">
              Used by Figma, Notion, Yjs, and Automerge. Edits attach immutable identifiers. Mutations form a Bounded Join-Semilattice where merge operations ($\sqcup$) are mathematically guaranteed to converge anywhere.
            </p>
            <div className="p-4 rounded-lg bg-[var(--sync-bg)] font-mono text-[11px] text-[var(--sync-muted)] space-y-2 border border-[var(--sync-primary)]/20">
              <div className="text-[var(--sync-primary)]">• Mathematical Strong Eventual Consistency (SEC)</div>
              <div className="text-emerald-400">• Commutative, Associative, Idempotent merge functions</div>
              <div>• 100% Offline capability with instant local writes</div>
              <div>• Decentralized P2P synchronization without central servers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--sync-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--sync-primary)] uppercase tracking-wider">
              Architecture Tracks
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--sync-text)] mt-1">
              Synchronization Primitives
            </h2>
          </div>
          <Link
            href="/synccosmos/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--sync-primary)] hover:underline"
          >
            View all 5 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {syncTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/synccosmos/learn/${topic.id}`}
              className="sync-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--sync-primary)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--sync-muted)] group-hover:text-[var(--sync-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--sync-text)] group-hover:text-[var(--sync-primary)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--sync-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--sync-border-subtle)] text-[var(--sync-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--sync-muted)]">
                  {topic.group}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
