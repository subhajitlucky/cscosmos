'use client';

import React from 'react';
import { EvictionSimulator } from '../components/EvictionSimulator';

export default function EvictionLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Maxmemory Eviction Policies Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive simulation of memory saturation, key eviction heuristics (allkeys-lru, allkeys-lfu, volatile-ttl), and OOM prevention.
        </p>
      </div>

      <EvictionSimulator />
    </div>
  );
}
