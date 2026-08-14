'use client';

import React from 'react';
import { TscPipelineVisualizer } from '../components/TscPipelineVisualizer';

export default function CompilerPipeline() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          TSC Compiler Architecture &amp; Pipeline
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Step through the 5 stages of the TypeScript compiler from Scanner tokens and AST parsing to Type Checker diagnostics.
        </p>
      </div>

      <TscPipelineVisualizer />
    </div>
  );
}
