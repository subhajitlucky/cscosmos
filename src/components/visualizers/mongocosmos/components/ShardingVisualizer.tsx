'use client';

import React, { useState } from 'react';
import {
  Network,
  Database,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Chunk {
  id: string;
  range: string;
  docCount: number;
}

export function ShardingVisualizer() {
  const [shard1Chunks, setShard1Chunks] = useState<Chunk[]>([
    { id: 'chunk-1', range: '[MinKey .. 1000)', docCount: 450 },
    { id: 'chunk-2', range: '[1000 .. 2000)', docCount: 820 },
    { id: 'chunk-3', range: '[2000 .. 3000)', docCount: 610 },
  ]);

  const [shard2Chunks, setShard2Chunks] = useState<Chunk[]>([
    { id: 'chunk-4', range: '[3000 .. MaxKey)', docCount: 390 },
  ]);

  const [activeQuery, setActiveQuery] = useState<'targeted' | 'scatter'>('targeted');
  const [logMessage, setLogMessage] = useState('Cluster balanced across 2 shards. Shard key: { user_id: 1 }.');

  const handleTestTargeted = () => {
    setActiveQuery('targeted');
    setLogMessage('TARGETED ROUTING: Query "db.users.find({ user_id: 1450 })" matched range [1000..2000). mongos routed directly to Shard 1 without touching Shard 2.');
  };

  const handleTestScatter = () => {
    setActiveQuery('scatter');
    setLogMessage('SCATTER-GATHER: Query "db.users.find({ status: "active" })" omitted the shard key. mongos broadcasted to ALL shards and merged streams.');
  };

  const handleBalance = () => {
    if (shard1Chunks.length <= 1) {
      setLogMessage('BALANCER: Shards are already within threshold balance difference.');
      return;
    }
    const chunkToMove = shard1Chunks[shard1Chunks.length - 1];
    setShard1Chunks((prev) => prev.slice(0, prev.length - 1));
    setShard2Chunks((prev) => [...prev, chunkToMove]);
    setLogMessage(`BALANCER MIGRATION: Migrated ${chunkToMove.id} (${chunkToMove.range}) from Shard 1 to Shard 2. Config server metadata updated.`);
  };

  const handleReset = () => {
    setShard1Chunks([
      { id: 'chunk-1', range: '[MinKey .. 1000)', docCount: 450 },
      { id: 'chunk-2', range: '[1000 .. 2000)', docCount: 820 },
      { id: 'chunk-3', range: '[2000 .. 3000)', docCount: 610 },
    ]);
    setShard2Chunks([
      { id: 'chunk-4', range: '[3000 .. MaxKey)', docCount: 390 },
    ]);
    setActiveQuery('targeted');
    setLogMessage('Sharding cluster reset to initial distribution.');
  };

  const totalChunks = shard1Chunks.length + shard2Chunks.length;

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6 text-card-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              <Network className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Horizontal Sharding, mongos Router &amp; Chunk Balancer
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Observe mongos single-shard routing vs scatter-gather queries and automatic chunk migration across replica sets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTestTargeted}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs shadow-xs transition-colors ${
              activeQuery === 'targeted'
                ? 'bg-emerald-600 text-white font-bold'
                : 'border border-border bg-card hover:bg-muted/40 text-foreground'
            }`}
          >
            Targeted Query (With Key)
          </button>
          <button
            type="button"
            onClick={handleTestScatter}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs shadow-xs transition-colors ${
              activeQuery === 'scatter'
                ? 'bg-amber-600 text-white font-bold'
                : 'border border-border bg-card hover:bg-muted/40 text-foreground'
            }`}
          >
            Scatter-Gather Query (No Key)
          </button>
          <button
            type="button"
            onClick={handleBalance}
            className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground font-medium text-xs shadow-xs transition-colors"
          >
            Run Balancer
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border hover:bg-muted/40 text-muted-foreground transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Architecture Top Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-blue-500" />
            mongos Query Router
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Stateless routing daemon. Caches routing table from Config DB. Clients connect directly to mongos on port 27017.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-500" />
            Config Replica Set (CSRS)
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Stores cluster catalog, database mappings, and chunk range boundaries in config.chunks with two-phase commit lock.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            Chunk Balancer
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Background round-robin process. Triggers migration when chunk difference between shards exceeds the migration threshold.
          </p>
        </div>
      </div>

      {/* Shard Data Nodes */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Shard 1 */}
        <div
          className={`p-4 rounded-xl border transition-all space-y-3 ${
            activeQuery === 'targeted'
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-border bg-card'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Shard 01 (Replica Set: rs-shard-01)
            </span>
            <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono font-bold text-foreground">
              {shard1Chunks.length} Chunks
            </span>
          </div>

          <div className="space-y-2">
            {shard1Chunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-2.5 rounded-lg border border-border bg-card text-xs flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-foreground">{chunk.id}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Range: {chunk.range}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">{chunk.docCount} docs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shard 2 */}
        <div
          className={`p-4 rounded-xl border transition-all space-y-3 ${
            activeQuery === 'scatter'
              ? 'border-amber-500 bg-amber-500/5'
              : 'border-border bg-card'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Shard 02 (Replica Set: rs-shard-02)
            </span>
            <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono font-bold text-foreground">
              {shard2Chunks.length} Chunks
            </span>
          </div>

          <div className="space-y-2">
            {shard2Chunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-2.5 rounded-lg border border-border bg-card text-xs flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-foreground">{chunk.id}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Range: {chunk.range}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">{chunk.docCount} docs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cluster Router Log */}
      <div className="p-3.5 rounded-lg border border-border bg-muted/20 font-mono text-xs flex items-center gap-2">
        <span className="text-muted-foreground font-bold shrink-0">MONGOS_LOG:</span>
        <span className="text-foreground">{logMessage}</span>
      </div>
    </div>
  );
}
