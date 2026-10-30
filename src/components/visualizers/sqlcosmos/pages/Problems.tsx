'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import { SqlPlayground } from '../components/SqlPlayground';

export default function Problems() {
  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground font-mono text-xs font-medium">
          <Trophy className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Interactive Query Challenges</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          SQL Practice Problems
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          Solve structured SQL challenges against in-memory relational tables. Every query runs through an AST parser with instant unit validation — no external database required.
        </p>
      </div>

      <SqlPlayground defaultTab="challenges" />
    </div>
  );
}
