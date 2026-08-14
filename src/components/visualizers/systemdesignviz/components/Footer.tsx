'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Server } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-10 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
            <Server className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-foreground">SystemDesignCosmos by CSCosmos</span>
          <span>• Distributed Systems, Raft, Consistent Hashing &amp; High Scale</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/systemdesignviz/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/systemdesignviz/hashing-lab" className="hover:text-foreground transition-colors">
            Consistent Hashing
          </Link>
          <Link href="/systemdesignviz/raft-lab" className="hover:text-foreground transition-colors">
            Raft Consensus
          </Link>
          <Link href="/systemdesignviz/rate-limit-lab" className="hover:text-foreground transition-colors">
            Rate Limiting
          </Link>
          <Link href="/systemdesignviz/sharding-lab" className="hover:text-foreground transition-colors">
            Sharding &amp; CAP
          </Link>
          <Link href="/systemdesignviz/calculator-lab" className="hover:text-foreground transition-colors">
            Capacity Calc
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}
