'use client';

import React from 'react';
import { DataLoaderVisualizer } from '../components/DataLoaderVisualizer';

export default function DataLoaderLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          The N+1 Problem &amp; DataLoader Batching Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of nested resolver query explosions vs DataLoader microtask tick batching.
        </p>
      </div>

      <DataLoaderVisualizer />
    </div>
  );
}
