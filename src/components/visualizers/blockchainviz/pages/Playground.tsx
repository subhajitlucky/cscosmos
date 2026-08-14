'use client';

import React from 'react';
import { Web3Playground } from '../components/Web3Playground';

export default function Playground() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Web3 &amp; Keccak256 Cryptography Sandbox
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Compute Keccak-256 digests and encode Solidity 4-byte function selectors in an in-browser sandbox.
        </p>
      </div>

      <Web3Playground />
    </div>
  );
}
