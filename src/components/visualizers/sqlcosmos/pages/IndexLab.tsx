'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { BTreeIndexVisualizer } from '../components/BTreeIndexVisualizer';

export default function IndexLab() {
  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground font-mono text-xs font-medium">
          <Layers className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Storage Engine Laboratory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          B+ Tree Database Indexing Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          Interactive deep-dive into Root, Branch, Leaf page structures, key separators, and Heap tuple block pointers.
        </p>
      </div>

      <BTreeIndexVisualizer />
    </div>
  );
}
