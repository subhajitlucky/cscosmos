'use client';

import React, { useState } from 'react';
import { GitCommit, Play, RotateCcw, Zap, CheckCircle2, ShieldCheck, Users, CornerDownRight } from 'lucide-react';

interface RgaNode {
  id: string;
  client: 'alice' | 'bob' | 'charlie';
  clock: number;
  char: string;
  deleted: boolean;
}

export function CrdtLab() {
  const [nodes, setNodes] = useState<RgaNode[]>([
    { id: 'a1', client: 'alice', clock: 1, char: 'H', deleted: false },
    { id: 'a2', client: 'alice', clock: 2, char: 'E', deleted: false },
    { id: 'a3', client: 'alice', clock: 3, char: 'L', deleted: false },
    { id: 'b1', client: 'bob', clock: 1, char: 'L', deleted: false },
    { id: 'b2', client: 'bob', clock: 2, char: 'O', deleted: false },
  ]);
  const [aliceInput, setAliceInput] = useState('!');
  const [bobInput, setBobInput] = useState(' ');
  const [charlieInput, setCharlieInput] = useState('✨');
  const [clockA, setClockA] = useState(4);
  const [clockB, setClockB] = useState(3);
  const [clockC, setClockC] = useState(1);

  const insertChar = (client: 'alice' | 'bob' | 'charlie', char: string) => {
    if (!char) return;
    let clock = 1;
    if (client === 'alice') {
      clock = clockA;
      setClockA(c => c + 1);
    } else if (client === 'bob') {
      clock = clockB;
      setClockB(c => c + 1);
    } else {
      clock = clockC;
      setClockC(c => c + 1);
    }

    const newNode: RgaNode = {
      id: `${client[0]}${clock}`,
      client,
      clock,
      char: char[0],
      deleted: false,
    };

    setNodes(prev => [...prev, newNode]);
  };

  const toggleDelete = (id: string) => {
    setNodes(prev =>
      prev.map(n => (n.id === id ? { ...n, deleted: !n.deleted } : n))
    );
  };

  const resetDoc = () => {
    setNodes([
      { id: 'a1', client: 'alice', clock: 1, char: 'H', deleted: false },
      { id: 'a2', client: 'alice', clock: 2, char: 'E', deleted: false },
      { id: 'a3', client: 'alice', clock: 3, char: 'L', deleted: false },
      { id: 'b1', client: 'bob', clock: 1, char: 'L', deleted: false },
      { id: 'b2', client: 'bob', clock: 2, char: 'O', deleted: false },
    ]);
    setClockA(4);
    setClockB(3);
    setClockC(1);
  };

  const renderedText = nodes.filter(n => !n.deleted).map(n => n.char).join('');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--sync-primary)]/30 bg-[var(--sync-primary)]/10 text-[var(--sync-primary)] text-xs font-mono">
          <GitCommit className="w-3.5 h-3.5" /> Replicated Growable Array (RGA) Simulator
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--sync-text)]">
          Sequence CRDT <span className="text-[var(--sync-primary)] sync-glow">&amp; Character Tree</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--sync-muted)] max-w-2xl leading-relaxed">
          Inspect how sequence CRDTs (like Yjs and Automerge) represent text as an immutable linked chain of character nodes with unique <code>(clientID, clock)</code> tuples.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left Peer Actions */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--sync-border)] bg-[var(--sync-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--sync-border-subtle)] pb-4">
            <span className="text-[var(--sync-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Concurrent Peer Editors
            </span>
            <button
              onClick={resetDoc}
              className="text-[10px] text-[var(--sync-muted)] hover:text-[var(--sync-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            {/* Alice (Peer A) */}
            <div className="p-4 rounded-xl bg-[var(--sync-bg)] border border-cyan-500/30 space-y-2">
              <div className="flex justify-between text-[11px] text-cyan-400 font-bold">
                <span>Peer Alice (clock: {clockA})</span>
                <span className="text-[10px] opacity-80">Local-First</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={1}
                  value={aliceInput}
                  onChange={(e) => setAliceInput(e.target.value)}
                  className="w-12 p-2 text-center rounded bg-[var(--sync-surface-2)] border border-[var(--sync-border-subtle)] text-white font-bold"
                />
                <button
                  onClick={() => insertChar('alice', aliceInput)}
                  className="flex-grow py-2 rounded bg-cyan-500 text-black font-bold text-[10px] hover:bg-cyan-400 transition-all"
                >
                  Insert &quot;{aliceInput}&quot; (alice:{clockA})
                </button>
              </div>
            </div>

            {/* Bob (Peer B) */}
            <div className="p-4 rounded-xl bg-[var(--sync-bg)] border border-indigo-500/30 space-y-2">
              <div className="flex justify-between text-[11px] text-indigo-400 font-bold">
                <span>Peer Bob (clock: {clockB})</span>
                <span className="text-[10px] opacity-80">Local-First</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={1}
                  value={bobInput}
                  onChange={(e) => setBobInput(e.target.value)}
                  className="w-12 p-2 text-center rounded bg-[var(--sync-surface-2)] border border-[var(--sync-border-subtle)] text-white font-bold"
                />
                <button
                  onClick={() => insertChar('bob', bobInput)}
                  className="flex-grow py-2 rounded bg-indigo-500 text-white font-bold text-[10px] hover:bg-indigo-400 transition-all"
                >
                  Insert &quot;{bobInput}&quot; (bob:{clockB})
                </button>
              </div>
            </div>

            {/* Charlie (Peer C) */}
            <div className="p-4 rounded-xl bg-[var(--sync-bg)] border border-purple-500/30 space-y-2">
              <div className="flex justify-between text-[11px] text-purple-400 font-bold">
                <span>Peer Charlie (clock: {clockC})</span>
                <span className="text-[10px] opacity-80">Local-First</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={1}
                  value={charlieInput}
                  onChange={(e) => setCharlieInput(e.target.value)}
                  className="w-12 p-2 text-center rounded bg-[var(--sync-surface-2)] border border-[var(--sync-border-subtle)] text-white font-bold"
                />
                <button
                  onClick={() => insertChar('charlie', charlieInput)}
                  className="flex-grow py-2 rounded bg-purple-500 text-white font-bold text-[10px] hover:bg-purple-400 transition-all"
                >
                  Insert &quot;{charlieInput}&quot; (charlie:{clockC})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sequence Tree & Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Rendered Text Box */}
          <div className="p-6 rounded-2xl border border-emerald-500/40 bg-[var(--sync-surface)] space-y-2 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Replicated Document View
              </span>
              <span className="text-[var(--sync-muted)]">{nodes.length} nodes ({nodes.filter(n => n.deleted).length} tombstones)</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--sync-bg)] text-2xl font-bold text-white border border-[var(--sync-border-subtle)] tracking-wider">
              {renderedText || <span className="text-slate-600">(empty document)</span>}
            </div>
          </div>

          {/* RGA Node Chain Visualizer */}
          <div className="p-6 rounded-2xl border border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--sync-border-subtle)] pb-3">
              <span className="text-[var(--sync-primary)] uppercase tracking-wider font-bold">
                Immutable RGA Character Node Chain
              </span>
              <span className="text-[10px] text-[var(--sync-muted)]">Click node to toggle delete tombstone</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {nodes.map((n, idx) => (
                <button
                  key={n.id}
                  onClick={() => toggleDelete(n.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    n.deleted
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 line-through opacity-50'
                      : n.client === 'alice'
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:scale-105'
                      : n.client === 'bob'
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:scale-105'
                      : 'border-purple-500/40 bg-purple-500/10 text-purple-300 hover:scale-105'
                  }`}
                >
                  <div className="text-lg font-bold">{n.char === ' ' ? '␣' : n.char}</div>
                  <div className="text-[8px] opacity-75 mt-0.5">{n.id}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
