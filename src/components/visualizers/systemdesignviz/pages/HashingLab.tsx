'use client';

import React from 'react';
import { ConsistentHashingVisualizer } from '../components/ConsistentHashingVisualizer';

export default function HashingLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Consistent Hashing &amp; Virtual Nodes Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of the Dynamo hash ring, minimal K/N key remapping, and virtual node distribution.
        </p>
      </div>

      <ConsistentHashingVisualizer />
    </div>
  );
}
