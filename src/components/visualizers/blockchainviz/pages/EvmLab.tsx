'use client';

import React from 'react';
import { EvmStackVisualizer } from '../components/EvmStackVisualizer';

export default function EvmLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          EVM Opcode Stack &amp; Gas Meter Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive step-by-step evaluation of the 256-bit EVM stack machine, volatile memory offsets, and persistent SSTORE storage slots.
        </p>
      </div>

      <EvmStackVisualizer />
    </div>
  );
}
