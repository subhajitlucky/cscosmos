'use client';

import React, { useState } from 'react';
import { Network, RefreshCw, Server, ShieldAlert, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react';

interface NodePeer {
  id: string;
  name: string;
  chainHeight: number;
  latestBlock: string;
  isHonest: boolean;
}

export function P2pConsensusSimulator() {
  const [nodes, setNodes] = useState<NodePeer[]>([
    { id: 'node-1', name: 'Node #1 (Frankfurt)', chainHeight: 104, latestBlock: '0x8f2a...', isHonest: true },
    { id: 'node-2', name: 'Node #2 (Singapore)', chainHeight: 104, latestBlock: '0x8f2a...', isHonest: true },
    { id: 'node-3', name: 'Node #3 (Virginia)', chainHeight: 104, latestBlock: '0x8f2a...', isHonest: true },
    { id: 'node-4', name: 'Node #4 (Tokyo)', chainHeight: 104, latestBlock: '0x8f2a...', isHonest: true },
  ]);

  const [hasFork, setHasFork] = useState<boolean>(false);

  const handleBroadcastBlock = () => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        chainHeight: n.chainHeight + 1,
        latestBlock: `0x${Math.abs(Math.random() * 1000000 | 0).toString(16).padStart(4, '0')}...`,
      }))
    );
    setHasFork(false);
  };

  const handleSimulateFork = () => {
    setHasFork(true);
    setNodes((prev) => [
      { ...prev[0], chainHeight: prev[0].chainHeight + 2, latestBlock: '0x3e8a... (Honest Chain)' },
      { ...prev[1], chainHeight: prev[1].chainHeight + 2, latestBlock: '0x3e8a... (Honest Chain)' },
      { ...prev[2], chainHeight: prev[2].chainHeight + 1, latestBlock: '0x99bb... (Orphaned Block)' },
      { ...prev[3], chainHeight: prev[3].chainHeight + 2, latestBlock: '0x3e8a... (Honest Chain)' },
    ]);
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Distributed Network Protocol
            </div>
            <h3 className="text-xl font-bold text-foreground">
              P2P Gossip Network &amp; Longest Chain Consensus
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Gossip Protocol Active
        </span>
      </div>

      {/* Nodes Mesh Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {nodes.map((node) => (
          <div key={node.id} className="p-4 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <span className="font-bold text-foreground truncate">{node.name.split(' ')[0]}</span>
              <span className="text-[10px] text-emerald-500 font-bold">ONLINE</span>
            </div>
            <div className="text-[11px] text-muted-foreground space-y-0.5">
              <div>Height: <strong className="text-foreground">{node.chainHeight}</strong></div>
              <div className="truncate">Tip: <code className="text-amber-600 dark:text-amber-400">{node.latestBlock}</code></div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-muted-foreground font-mono">
          Nakamoto Consensus: Nodes automatically converge to the <strong>Longest Valid Chain with most cumulative PoW</strong>.
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateFork}
            className="px-4 py-2.5 rounded-2xl bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Temporary Chain Fork</span>
          </button>

          <button
            onClick={handleBroadcastBlock}
            className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Broadcast Mined Block via Gossip</span>
          </button>
        </div>
      </div>
    </div>
  );
}
