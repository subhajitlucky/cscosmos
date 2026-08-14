'use client';

import React from 'react';
import { DataStructuresLab } from '../components/DataStructuresLab';

export default function DataStructures() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Redis In-Memory Data Structures Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive deep-dive into Simple Dynamic Strings (SDS), SkipLists, QuickLists, ZipLists, and IntSets.
        </p>
      </div>

      <DataStructuresLab />
    </div>
  );
}
