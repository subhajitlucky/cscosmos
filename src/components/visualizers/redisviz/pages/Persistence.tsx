'use client';

import React from 'react';
import { PersistenceVisualizer } from '../components/PersistenceVisualizer';

export default function Persistence() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Redis Persistence &amp; Durability (RDB vs AOF)
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive comparison between point-in-time binary snapshots (dump.rdb) and append-only command logging (appendonly.aof).
        </p>
      </div>

      <PersistenceVisualizer />
    </div>
  );
}
