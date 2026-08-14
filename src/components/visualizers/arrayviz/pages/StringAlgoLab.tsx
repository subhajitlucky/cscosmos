'use client';

import React from 'react';
import { KmpPatternVisualizer } from '../components/KmpPatternVisualizer';
import { RabinKarpRollingHashVisualizer } from '../components/RabinKarpRollingHashVisualizer';

export default function StringAlgoLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Linear String Pattern Matching Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of KMP Longest Prefix Suffix (LPS) fallback arrays and Rabin-Karp polynomial rolling hashes.
        </p>
      </div>

      <KmpPatternVisualizer />
      <RabinKarpRollingHashVisualizer />
    </div>
  );
}
