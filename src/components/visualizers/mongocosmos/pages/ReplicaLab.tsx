'use client';

import React from 'react';
import { ReplicaConsensusVisualizer } from '../components/ReplicaConsensusVisualizer';
import { Server, Radio } from 'lucide-react';

export default function ReplicaLab() {
  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <Server className="w-3.5 h-3.5 text-amber-500" />
          <span>High Availability &amp; Distributed Consensus</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Replica Set Raft Consensus &amp; Failover Lab
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Simulate a 3-node MongoDB replica set. Test heartbeat health checks every 2 seconds, partition the PRIMARY node to trigger Raft elections with majority quorum (2 of 3 votes), and compare writeConcern <code className="text-foreground font-mono">w: 1</code> vs <code className="text-foreground font-mono">w: "majority"</code> replication guarantees.
        </p>
      </div>

      <ReplicaConsensusVisualizer />
    </div>
  );
}
