'use client';

'use client';

import React, { useState } from 'react';
import { Database, Network, Search, Server, Sparkles, Terminal, Zap } from 'lucide-react';

// Simplified deterministic CRC16-CCITT implementation for visualizer
function getCrc16HashSlot(key: string): number {
  // Extract hash tag if present: e.g. {user:100}.profile -> user:100
  const match = key.match(/\{([^}]+)\}/);
  const effectiveKey = match ? match[1] : key;

  let hash = 0;
  for (let i = 0; i < effectiveKey.length; i++) {
    hash = (hash << 5) - hash + effectiveKey.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 16384;
}

export function RedisClusterSlotVisualizer() {
  const [testKey, setTestKey] = useState<string>('{user:100}.profile');

  const slot = getCrc16HashSlot(testKey);

  let targetNode = 'Node A';
  let targetAddress = '127.0.0.1:7000';
  let nodeColor = 'text-blue-500 border-blue-500 bg-blue-500/10';

  if (slot >= 5461 && slot <= 10922) {
    targetNode = 'Node B';
    targetAddress = '127.0.0.1:7001';
    nodeColor = 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
  } else if (slot > 10922) {
    targetNode = 'Node C';
    targetAddress = '127.0.0.1:7002';
    nodeColor = 'text-purple-500 border-purple-500 bg-purple-500/10';
  }

  const isHashTagged = /\{([^}]+)\}/.test(testKey);

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-md">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-cyan-600 dark:text-cyan-400">
              Distributed Sharding Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Redis Cluster 16,384 Hash Slot &amp; Hash Tag Router
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-mono text-xs font-bold">
          CRC16(key) % 16384 = Slot #{slot}
        </span>
      </div>

      {/* Input Box & Quick Examples */}
      <div className="space-y-3">
        <div className="space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Test Key Name:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={testKey}
              onChange={(e) => setTestKey(e.target.value)}
              placeholder="e.g. {user:100}.profile or order:982"
              className="flex-1 px-4 py-2.5 rounded-2xl bg-card border border-border text-sm font-mono text-foreground focus:border-cyan-500 outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground self-center">Try Hash Tags:</span>
          <button
            onClick={() => setTestKey('{user:100}.profile')}
            className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
          >
            &#123;user:100&#125;.profile
          </button>
          <button
            onClick={() => setTestKey('{user:100}.orders')}
            className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
          >
            &#123;user:100&#125;.orders
          </button>
          <button
            onClick={() => setTestKey('leaderboard:global')}
            className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
          >
            leaderboard:global
          </button>
          <button
            onClick={() => setTestKey('session:token_991')}
            className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
          >
            session:token_991
          </button>
        </div>
      </div>

      {/* Cluster Nodes Topology Visualizer */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Node A */}
        <div className={`p-5 rounded-2xl border transition-all ${
          targetNode === 'Node A' ? 'border-cyan-500 bg-cyan-500/10 shadow-lg scale-105' : 'bg-card border-border opacity-60'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-bold text-xs">Node A (Master)</span>
            <span className="text-[10px] font-mono text-muted-foreground">127.0.0.1:7000</span>
          </div>
          <div className="py-2 space-y-1 font-mono text-xs">
            <div className="text-muted-foreground">Slots: 0 - 5460</div>
            {targetNode === 'Node A' && (
              <div className="text-cyan-600 dark:text-cyan-400 font-bold animate-pulse">
                🎯 Target Shard for Slot #{slot}
              </div>
            )}
          </div>
        </div>

        {/* Node B */}
        <div className={`p-5 rounded-2xl border transition-all ${
          targetNode === 'Node B' ? 'border-cyan-500 bg-cyan-500/10 shadow-lg scale-105' : 'bg-card border-border opacity-60'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-bold text-xs">Node B (Master)</span>
            <span className="text-[10px] font-mono text-muted-foreground">127.0.0.1:7001</span>
          </div>
          <div className="py-2 space-y-1 font-mono text-xs">
            <div className="text-muted-foreground">Slots: 5461 - 10922</div>
            {targetNode === 'Node B' && (
              <div className="text-cyan-600 dark:text-cyan-400 font-bold animate-pulse">
                🎯 Target Shard for Slot #{slot}
              </div>
            )}
          </div>
        </div>

        {/* Node C */}
        <div className={`p-5 rounded-2xl border transition-all ${
          targetNode === 'Node C' ? 'border-cyan-500 bg-cyan-500/10 shadow-lg scale-105' : 'bg-card border-border opacity-60'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-bold text-xs">Node C (Master)</span>
            <span className="text-[10px] font-mono text-muted-foreground">127.0.0.1:7002</span>
          </div>
          <div className="py-2 space-y-1 font-mono text-xs">
            <div className="text-muted-foreground">Slots: 10923 - 16383</div>
            {targetNode === 'Node C' && (
              <div className="text-cyan-600 dark:text-cyan-400 font-bold animate-pulse">
                🎯 Target Shard for Slot #{slot}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Smart Analysis Card */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground font-bold">Cluster Redirect Diagnostic:</span>
          {isHashTagged ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              ✅ Hash Tag Activated ({testKey.match(/\{([^}]+)\}/)?.[1]})
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-500/10 text-muted-foreground">
              Standard Key Hashing
            </span>
          )}
        </div>

        <div className="p-3 rounded-xl bg-slate-950 text-slate-100 space-y-1">
          <div className="text-slate-400 text-[11px]">If querying non-owner node (e.g. Node A when slot belongs to Node B):</div>
          <div className="text-rose-400 font-bold">
            (error) MOVED {slot} {targetAddress}
          </div>
          <div className="text-slate-500 text-[10px]">Smart Redis clients automatically cache slot mappings to avoid redirection latency.</div>
        </div>
      </div>
    </div>
  );
}
