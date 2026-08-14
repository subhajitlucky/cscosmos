'use client';

import React from 'react';
import { CachingStrategiesLab } from '../components/CachingStrategiesLab';

export default function CachingLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Enterprise Caching Architecture Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive network topologies for Cache-Aside (Lazy Loading), Write-Through, and Write-Behind caching flows.
        </p>
      </div>

      <CachingStrategiesLab />
    </div>
  );
}
