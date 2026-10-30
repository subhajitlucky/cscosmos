'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { ExplainPlanVisualizer } from '../components/ExplainPlanVisualizer';

export default function ExplainLab() {
  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Cost-based optimizer laboratory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          EXPLAIN ANALYZE Cost Optimizer Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          Interactive evaluation of Seq Scan, Index Scan, Index-Only Scan, and Bitmap Index Scan execution plans.
        </p>
      </div>

      <ExplainPlanVisualizer />
    </div>
  );
}
