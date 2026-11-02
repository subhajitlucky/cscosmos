'use client';

import React from 'react';
import { ShardingVisualizer } from '../components/ShardingVisualizer';
import { Network, Database } from 'lucide-react';

export default function ShardingLab() {
  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <Network className="w-4 h-4 text-purple-500" />
          <span>Horizontal Scale-Out &amp; Partitioning Sandbox</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sharded Cluster &amp; mongos Router Lab
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Explore distributed horizontal sharding. Observe how the stateless <code className="text-foreground font-mono">mongos</code> router routes targeted queries using shard key ranges, why queries missing the shard key scatter-gather across all shards, and how the chunk balancer migrates data between shard replica sets.
        </p>
      </div>

      <ShardingVisualizer />
    </div>
  );
}
