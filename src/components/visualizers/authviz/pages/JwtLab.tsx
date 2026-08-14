'use client';

import React from 'react';
import { JwtSignatureVisualizer } from '../components/JwtSignatureVisualizer';

export default function JwtLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          JWT Structure &amp; RS256 Signature Inspector
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Header, Payload Claims, and RS256 vs None-algorithm exploit defenses.
        </p>
      </div>

      <JwtSignatureVisualizer />
    </div>
  );
}
