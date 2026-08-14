'use client';

import React from 'react';
import { ContiguousMemoryVisualizer } from '../components/ContiguousMemoryVisualizer';
import { DynamicArrayResizingVisualizer } from '../components/DynamicArrayResizingVisualizer';

export default function MemoryLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Physical RAM &amp; Memory Allocation Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of contiguous address arithmetic (Base + offset) and geometric dynamic capacity doubling ($2 \to 4 \to 8 \to 16$).
        </p>
      </div>

      <ContiguousMemoryVisualizer />
      <DynamicArrayResizingVisualizer />
    </div>
  );
}
