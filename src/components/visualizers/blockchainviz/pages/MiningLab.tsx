'use client';

import React from 'react';
import { BlockMiningSimulator } from '../components/BlockMiningSimulator';
import { P2pConsensusSimulator } from '../components/P2pConsensusSimulator';

export default function MiningLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Block Mining &amp; Consensus Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Proof-of-Work nonce calculation, cryptographic link tampering, and P2P Gossip protocol propagation.
        </p>
      </div>

      <BlockMiningSimulator />
      <P2pConsensusSimulator />
    </div>
  );
}
