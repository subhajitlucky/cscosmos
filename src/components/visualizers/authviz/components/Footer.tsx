'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-10 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-foreground">AuthCosmos by CSCosmos</span>
          <span className="hidden md:inline">• OAuth 2.0 PKCE, JWT RS256, OIDC, RBAC &amp; Password Cryptography</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/authviz/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/authviz/lab" className="hover:text-foreground transition-colors">
            Simulation Lab
          </Link>
          <Link href="/authviz/problems" className="hover:text-foreground transition-colors">
            Practice Problems
          </Link>
          <Link href="/authviz/flashcards" className="hover:text-foreground transition-colors">
            Flashcards
          </Link>
          <Link href="/authviz/cheatsheet" className="hover:text-foreground transition-colors">
            Cheat Sheet
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}
