'use client';

import React from 'react';
import { StreamsBackpressureLab } from '../components/StreamsBackpressureLab';

export default function StreamsLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Node.js Streams &amp; Backpressure Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive simulation of readable streaming, buffer saturation at highWaterMark, and drain event emission.
        </p>
      </div>

      <StreamsBackpressureLab />
    </div>
  );
}
