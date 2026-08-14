'use client';

import React from 'react';
import { ExplainPlanVisualizer } from '../components/ExplainPlanVisualizer';

export default function ExplainLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          EXPLAIN ANALYZE Cost Optimizer Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Seq Scan, Index Scan, Index-Only Scan, and Bitmap Index Scan execution plans.
        </p>
      </div>

      <ExplainPlanVisualizer />
    </div>
  );
}
