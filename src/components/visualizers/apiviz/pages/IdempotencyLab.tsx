'use client';

import React from 'react';
import { IdempotencyKeyVisualizer } from '../components/IdempotencyKeyVisualizer';

export default function IdempotencyLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Idempotency Keys &amp; Safe Payment Retries Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of at-most-once execution, Redis distributed locking, and safe timeout replay.
        </p>
      </div>

      <IdempotencyKeyVisualizer />
    </div>
  );
}
