'use client';

import React from 'react';
import { ProtocolComparisonVisualizer } from '../components/ProtocolComparisonVisualizer';

export default function ProtocolsLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          API Protocols Matrix: REST vs GraphQL vs gRPC vs tRPC
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of wire payload formats, transport protocols, and developer experience tradeoffs.
        </p>
      </div>

      <ProtocolComparisonVisualizer />
    </div>
  );
}
