'use client';

import React from 'react';
import { BTreeIndexVisualizer } from '../components/BTreeIndexVisualizer';

export default function IndexLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          B+ Tree Database Indexing Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive deep-dive into Root, Branch, Leaf page structures, and Heap tuple pointers.
        </p>
      </div>

      <BTreeIndexVisualizer />
    </div>
  );
}
