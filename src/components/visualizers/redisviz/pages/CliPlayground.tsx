'use client';

import React from 'react';
import { RedisCliPlayground } from '../components/RedisCliPlayground';

export default function CliPlayground() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Interactive Redis CLI Playground
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Execute live in-memory Redis commands directly in your browser with real-time RESP feedback and state tracking.
        </p>
      </div>

      <RedisCliPlayground />
    </div>
  );
}
