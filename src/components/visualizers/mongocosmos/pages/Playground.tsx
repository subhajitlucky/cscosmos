'use client';

import React from 'react';
import { MongoPlayground } from '../components/MongoPlayground';
import { Terminal, Database } from 'lucide-react';

export default function Playground() {
  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>In-Memory Client Relational &amp; Document Engine</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Interactive MQL &amp; Aggregation Playground
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Test queries and pipeline transformations against mock collections (<code className="text-foreground font-mono">users</code>, <code className="text-foreground font-mono">orders</code>, <code className="text-foreground font-mono">products</code>, <code className="text-foreground font-mono">customers</code>, <code className="text-foreground font-mono">servers</code>) with instantaneous EXPLAIN query plans.
        </p>
      </div>

      <MongoPlayground />
    </div>
  );
}
