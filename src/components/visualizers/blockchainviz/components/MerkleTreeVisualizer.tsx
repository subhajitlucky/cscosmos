'use client';

import React, { useState } from 'react';
import { ArrowDown, CheckCircle2, GitFork, RefreshCw, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export function MerkleTreeVisualizer() {
  const [selectedTx, setSelectedTx] = useState<number>(0);
  const [proofVerified, setProofVerified] = useState<boolean>(true);

  const txs = [
    { id: 0, label: 'Tx 0: Alice -> Bob 5 ETH', hash: '0x8f2a' },
    { id: 1, label: 'Tx 1: Charlie -> Dave 2 ETH', hash: '0x3c1b' },
    { id: 2, label: 'Tx 2: Eve -> Frank 10 ETH', hash: '0x9d4e' },
    { id: 3, label: 'Tx 3: Grace -> Heidi 1 ETH', hash: '0x1a7f' },
  ];

  const h01 = '0x5e9b';
  const h23 = '0x7c4d';
  const root = '0x2a1f8c9b';

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Cryptographic Data Structures
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Binary Merkle Tree &amp; O(log N) Inclusion Proofs
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Proof Complexity: O(log₂ N)
        </span>
      </div>

      {/* Merkle Tree Hierarchy Diagram */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-6 font-mono text-xs shadow-inner text-center">
        {/* Tier 1: Merkle Root */}
        <div className="inline-block p-4 rounded-2xl border border-amber-500 bg-amber-500/20 text-amber-300 shadow-md">
          <div className="text-[10px] text-amber-400 font-bold uppercase">Merkle Root (Header)</div>
          <div className="text-sm font-extrabold">{root}</div>
        </div>

        {/* Tier 2: Intermediate Hashes */}
        <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
          <div className={`p-3 rounded-2xl border ${
            selectedTx === 0 || selectedTx === 1
              ? 'border-sky-500 bg-sky-500/20 text-sky-200'
              : selectedTx === 2 || selectedTx === 3
              ? 'border-purple-500 bg-purple-500/20 text-purple-200 ring-2 ring-purple-400'
              : 'border-slate-800 bg-slate-900 text-slate-400'
          }`}>
            <div className="text-[10px]">Hash(H0 + H1)</div>
            <div className="font-bold">{h01}</div>
          </div>

          <div className={`p-3 rounded-2xl border ${
            selectedTx === 2 || selectedTx === 3
              ? 'border-sky-500 bg-sky-500/20 text-sky-200'
              : selectedTx === 0 || selectedTx === 1
              ? 'border-purple-500 bg-purple-500/20 text-purple-200 ring-2 ring-purple-400'
              : 'border-slate-800 bg-slate-900 text-slate-400'
          }`}>
            <div className="text-[10px]">Hash(H2 + H3)</div>
            <div className="font-bold">{h23}</div>
          </div>
        </div>

        {/* Tier 3: Leaf Hashes (4 Transactions) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {txs.map((tx) => (
            <button
              key={tx.id}
              onClick={() => setSelectedTx(tx.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedTx === tx.id
                  ? 'border-amber-500 bg-amber-500/20 text-amber-200 shadow-md scale-105 font-bold'
                  : selectedTx === (tx.id ^ 1)
                  ? 'border-purple-500 bg-purple-500/20 text-purple-200 ring-2 ring-purple-400'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-amber-500'
              }`}
            >
              <div className="text-[10px] opacity-70">Leaf #{tx.id}</div>
              <div className="font-bold text-xs truncate">{tx.label}</div>
              <div className="text-[10px] pt-1 text-slate-400">Hash: {tx.hash}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Proof Explanation */}
      <div className="p-5 rounded-3xl bg-card border border-border space-y-2 font-mono text-xs shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> SPV Light Client Proof Path for Leaf #{selectedTx}:
        </div>
        <p className="text-foreground leading-relaxed">
          To prove <strong>{txs[selectedTx].label}</strong> is included in the block, a light client only needs:
          <br />
          1. <strong>Sibling Leaf Hash</strong> (Purple): <code>{txs[selectedTx ^ 1].hash}</code>
          <br />
          2. <strong>Sibling Subtree Hash</strong> (Purple): <code>{selectedTx < 2 ? h23 : h01}</code>
          <br />
          3. Total data transferred: <strong>Only 64 bytes</strong> instead of the entire block!
        </p>
      </div>
    </div>
  );
}
