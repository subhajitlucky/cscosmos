'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Database } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-10 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-foreground text-background font-mono font-bold text-[10px] flex items-center justify-center">
            <Database className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-foreground">SQLCosmos by CSCosmos</span>
          <span>• Relational SQL, Query Plans, B+ Tree Indexing &amp; Storage Engine</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/sqlcosmos/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/sqlcosmos/playground" className="hover:text-foreground transition-colors">
            Playground
          </Link>
          <Link href="/sqlcosmos/problems" className="hover:text-foreground transition-colors">
            Problems
          </Link>
          <Link href="/sqlcosmos/flashcards" className="hover:text-foreground transition-colors">
            Interview Questions
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}
