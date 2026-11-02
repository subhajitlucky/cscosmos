'use client';

import React from 'react';
import { WiredTigerVisualizer } from '../components/WiredTigerVisualizer';
import { Cpu, HardDrive } from 'lucide-react';

export default function WiredTigerLab() {
  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <Cpu className="w-3.5 h-3.5 text-blue-500" />
          <span>Interactive Storage Engine Sandbox</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          WiredTiger Cache &amp; Checkpoint Engine Lab
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Observe how the WiredTiger storage engine manages dirty memory pages, triggers LRU eviction servers when hitting the 80% watermark, appends to the Write-Ahead Log (WAL), and writes consistent disk snapshots every 60 seconds.
        </p>
      </div>

      <WiredTigerVisualizer />
    </div>
  );
}
