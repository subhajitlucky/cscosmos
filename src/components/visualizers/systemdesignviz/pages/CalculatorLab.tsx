'use client';

import React from 'react';
import { CapacityCalculator } from '../components/CapacityCalculator';

export default function CalculatorLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Back-of-the-Envelope Scale &amp; Capacity Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive estimation engine for QPS, daily/yearly storage volume, and 80/20 RAM cache sizing.
        </p>
      </div>

      <CapacityCalculator />
    </div>
  );
}
