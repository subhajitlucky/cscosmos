'use client';

import React from 'react';
import { GitMerge } from 'lucide-react';
import { SqlJoinsVisualizer } from '../components/SqlJoinsVisualizer';

export default function JoinsLab() {
  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground font-mono text-xs font-medium">
          <GitMerge className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Execution Engine Laboratory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          SQL Physical Joins Engine
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          Interactive evaluation of Nested Loop Join, Hash Join (Build &amp; Probe phases), and Merge Join lockstep traversal.
        </p>
      </div>

      <SqlJoinsVisualizer />
    </div>
  );
}
