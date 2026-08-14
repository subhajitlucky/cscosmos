'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutGrid } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-10 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-foreground">ArrayCosmos by CSCosmos</span>
          <span>• RAM Hardware Layout, Cache Locality &amp; String Algorithms</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/arrayviz/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/arrayviz/memory-lab" className="hover:text-foreground transition-colors">
            RAM Memory
          </Link>
          <Link href="/arrayviz/cache-lab" className="hover:text-foreground transition-colors">
            Cache Locality
          </Link>
          <Link href="/arrayviz/sliding-window-lab" className="hover:text-foreground transition-colors">
            Sliding Window
          </Link>
          <Link href="/arrayviz/string-algo-lab" className="hover:text-foreground transition-colors">
            KMP Strings
          </Link>
          <Link href="/arrayviz/playground" className="hover:text-foreground transition-colors">
            DSA Sandbox
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}
