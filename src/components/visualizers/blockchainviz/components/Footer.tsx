'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-10 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-foreground">BlockchainCosmos by CSCosmos</span>
          <span>• Web3, Cryptography, Merkle Trees &amp; EVM Visualizer</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/blockchainviz/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/blockchainviz/mining-lab" className="hover:text-foreground transition-colors">
            Mining Lab
          </Link>
          <Link href="/blockchainviz/merkle-lab" className="hover:text-foreground transition-colors">
            Merkle Trees
          </Link>
          <Link href="/blockchainviz/evm-lab" className="hover:text-foreground transition-colors">
            EVM Stack
          </Link>
          <Link href="/blockchainviz/playground" className="hover:text-foreground transition-colors">
            Web3 Sandbox
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}
