'use client';

import React from 'react';
import { Terminal } from 'lucide-react';
import { SqlPlayground } from '../components/SqlPlayground';

export default function Playground() {
  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground font-mono text-xs font-medium">
          <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Interactive Query Sandbox</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Interactive SQL Playground
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          Write SQL against the in-memory users and orders tables and see exactly which rows this small
          evaluator returns — no database server is involved.
        </p>
      </div>

      <SqlPlayground />
    </div>
  );
}
