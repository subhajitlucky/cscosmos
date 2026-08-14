'use client';

import React, { useState } from 'react';
import { ArrowDown, CheckCircle2, GitFork, Layers, RefreshCw, ShieldCheck, Sparkles, Zap } from 'lucide-react';

interface MptNode {
  id: string;
  type: 'Root' | 'Extension' | 'Branch' | 'Leaf';
  nibbles: string;
  value?: string;
  color: string;
  desc: string;
}

export function PatriciaTrieVisualizer() {
  const [selectedKey, setSelectedKey] = useState<string>('0xa711355');

  const nodes: MptNode[] = [
    {
      id: 'root',
      type: 'Root',
      nibbles: '0xa7',
      color: 'border-amber-500 bg-amber-500/20 text-amber-300',
      desc: 'Root Hash pointer stored directly in the 32-byte Ethereum Block Header (stateRoot).'
    },
    {
      id: 'ext',
      type: 'Extension',
      nibbles: 'shared prefix [1, 1]',
      color: 'border-sky-500 bg-sky-500/20 text-sky-300',
      desc: 'Extension Node: Compresses shared contiguous path nibbles to prevent deep unary branch trees.'
    },
    {
      id: 'branch',
      type: 'Branch',
      nibbles: '16-Way Hex Array [0..F] + Value',
      color: 'border-purple-500 bg-purple-500/20 text-purple-300',
      desc: 'Branch Node: 17-item list containing 16 child pointers (nibbles 0-f) and 1 optional value.'
    },
    {
      id: 'leaf',
      type: 'Leaf',
      nibbles: 'key end [3, 5, 5]',
      value: 'Account State: { nonce: 4, balance: 14.5 ETH, storageRoot: 0x5a... }',
      color: 'border-emerald-500 bg-emerald-500/20 text-emerald-300',
      desc: 'Leaf Node: Contains remaining key path and RLP-encoded account state or storage value.'
    }
  ];

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Ethereum State Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Modified Merkle Patricia Trie (MPT) State Engine
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">
          Key Path: {selectedKey}
        </span>
      </div>

      {/* Trie Nodes Stepper */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Path Traversal: Root ➔ Extension ➔ Branch (Nibble 3) ➔ Leaf Node</span>
          <span className="text-emerald-400 font-bold">RLP Encoded</span>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {nodes.map((n, idx) => (
            <div key={n.id} className="space-y-2">
              <div className={`p-4 rounded-2xl border ${n.color} space-y-1`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold uppercase">{idx + 1}. {n.type} Node</span>
                  <span className="text-slate-300 font-mono">{n.nibbles}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{n.desc}</p>
                {n.value && (
                  <div className="p-2 mt-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 text-[11px] font-bold">
                    Value: {n.value}
                  </div>
                )}
              </div>

              {idx < nodes.length - 1 && (
                <div className="flex justify-center text-slate-600">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
