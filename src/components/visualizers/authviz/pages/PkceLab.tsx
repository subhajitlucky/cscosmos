'use client';

import React from 'react';
import { OAuthPkceVisualizer } from '../components/OAuthPkceVisualizer';

export default function PkceLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          OAuth 2.0 PKCE Flow Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Code Verifier generation, SHA-256 Code Challenge, and authorization code token exchange.
        </p>
      </div>

      <OAuthPkceVisualizer />
    </div>
  );
}
