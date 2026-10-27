'use client';

import React from 'react';
import { NodePlayground } from '../components/NodePlayground';

export default function Playground() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Interactive Node.js Event Loop Walkthrough
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Step through recorded event loop traces and see how microtasks, timers, and stream backpressure are ordered — nothing is executed in the browser.
        </p>
      </div>

      <NodePlayground />
    </div>
  );
}
