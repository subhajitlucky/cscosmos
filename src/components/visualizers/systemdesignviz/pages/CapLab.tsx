'use client';

import React from 'react';
import { CapTheoremVisualizer } from '../components/CapTheoremVisualizer';

export default function CapLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          CAP Theorem &amp; PACELC Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Consistency (CP) vs Availability (AP) during network partitions.
        </p>
      </div>

      <CapTheoremVisualizer />
    </div>
  );
}
