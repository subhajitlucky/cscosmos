'use client';

import React from 'react';
import { RateLimiterVisualizer } from '../components/RateLimiterVisualizer';

export default function RateLimitLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Distributed Rate Limiter Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Token Bucket, Leaky Bucket, and Sliding Window Counter rate limiting algorithms.
        </p>
      </div>

      <RateLimiterVisualizer />
    </div>
  );
}
