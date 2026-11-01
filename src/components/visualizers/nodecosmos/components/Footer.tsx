'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Server } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-8 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
            <Server className="w-4 h-4" />
          </div>
          <span className="font-semibold text-foreground text-sm">NodeCosmos</span>
          <span className="text-muted-foreground/80 hidden sm:inline">&bull; 280-Concept Node.js Curriculum &amp; Runtime Labs</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium">
          <Link href="/nodecosmos/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/nodecosmos/lab" className="hover:text-foreground transition-colors">
            Lab
          </Link>
          <Link href="/nodecosmos/problems" className="hover:text-foreground transition-colors">
            Problems
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}