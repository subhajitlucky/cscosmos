'use client';

import React from 'react';
import { SqlJoinsVisualizer } from '../components/SqlJoinsVisualizer';

export default function JoinsLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          SQL Physical Joins Engine
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Nested Loop Join, Hash Join (Build &amp; Probe phases), and Merge Join lockstep traversal.
        </p>
      </div>

      <SqlJoinsVisualizer />
    </div>
  );
}
