'use client';

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Database } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-10 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-red-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
            <Database className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-foreground">RedisViz by CSCosmos</span>
          <span>• In-Memory Architecture &amp; Caching Engine Visualizer</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/redisviz/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/redisviz/structures" className="hover:text-foreground transition-colors">
            Data Structures
          </Link>
          <Link href="/redisviz/caching-lab" className="hover:text-foreground transition-colors">
            Caching Lab
          </Link>
          <Link href="/redisviz/playground" className="hover:text-foreground transition-colors">
            CLI Playground
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}
