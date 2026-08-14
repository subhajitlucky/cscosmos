'use client';

import React from 'react';
import { CacheLocalityVisualizer } from '../components/CacheLocalityVisualizer';

export default function CacheLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          CPU Cache Locality &amp; Performance Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of 64-byte L1/L2 cache line prefetching: Row-Major vs Column-Major matrix iterations.
        </p>
      </div>

      <CacheLocalityVisualizer />
    </div>
  );
}
