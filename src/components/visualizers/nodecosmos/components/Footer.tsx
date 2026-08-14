'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Server } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-10 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
            <Server className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-foreground">NodeCosmos by CSCosmos</span>
          <span>• Libuv 6-Phase Event Loop, Thread Pool &amp; Streams Visualizer</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/nodecosmos/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/nodecosmos/event-loop" className="hover:text-foreground transition-colors">
            Event Loop Lab
          </Link>
          <Link href="/nodecosmos/streams-lab" className="hover:text-foreground transition-colors">
            Streams Lab
          </Link>
          <Link href="/nodecosmos/thread-pool" className="hover:text-foreground transition-colors">
            Thread Pool
          </Link>
          <Link href="/nodecosmos/playground" className="hover:text-foreground transition-colors">
            Playground
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}
