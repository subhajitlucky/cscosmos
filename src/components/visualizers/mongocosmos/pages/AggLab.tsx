'use client';

import React from 'react';
import { AggPipelineVisualizer } from '../components/AggPipelineVisualizer';
import { Layers, Cpu } from 'lucide-react';

export default function AggLab() {
  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Interactive Pipeline Stream Sandbox</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Aggregation Pipeline Multi-Stage Lab
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Step through multi-stage document transformations. Observe index pushdowns into initial <code className="text-foreground font-mono">$match</code> stages, accumulator partitioning in <code className="text-foreground font-mono">$group</code>, array flattening in <code className="text-foreground font-mono">$unwind</code>, and 100MB memory boundary safeguards.
        </p>
      </div>

      <AggPipelineVisualizer />
    </div>
  );
}
