'use client';

import React from 'react';
import { ArrayPlayground } from '../components/ArrayPlayground';

export default function Playground() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Array &amp; String DSA Playground
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Execute prefix sum arrays, in-place reversals, and Kadane&apos;s algorithm in an interactive sandbox.
        </p>
      </div>

      <ArrayPlayground />
    </div>
  );
}
