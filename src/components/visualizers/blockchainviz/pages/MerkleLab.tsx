'use client';

import React from 'react';
import { MerkleTreeVisualizer } from '../components/MerkleTreeVisualizer';
import { UtxoVsAccountVisualizer } from '../components/UtxoVsAccountVisualizer';

export default function MerkleLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Merkle Tree &amp; State Models Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Binary Merkle Trees, O(log N) SPV inclusion proofs, and Bitcoin UTXO vs Ethereum Account states.
        </p>
      </div>

      <MerkleTreeVisualizer />
      <UtxoVsAccountVisualizer />
    </div>
  );
}
