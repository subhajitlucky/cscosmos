'use client';

import React from 'react';
import { DatabaseShardingVisualizer } from '../components/DatabaseShardingVisualizer';
import { CachePatternsVisualizer } from '../components/CachePatternsVisualizer';

export default function ShardingLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Database Sharding &amp; Caching Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of horizontal range-key sharding and Cache-Aside vs Write-Through strategies.
        </p>
      </div>

      <DatabaseShardingVisualizer />
      <CachePatternsVisualizer />
    </div>
  );
}
