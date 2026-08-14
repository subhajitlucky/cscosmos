'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-10 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-pink-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-foreground">ApiCosmos by CSCosmos</span>
          <span>• REST, GraphQL AST Resolvers, DataLoader &amp; gRPC Architecture</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/apiviz/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/apiviz/graphql-lab" className="hover:text-foreground transition-colors">
            GraphQL Resolvers
          </Link>
          <Link href="/apiviz/dataloader-lab" className="hover:text-foreground transition-colors">
            DataLoader
          </Link>
          <Link href="/apiviz/protocols-lab" className="hover:text-foreground transition-colors">
            Protocols Matrix
          </Link>
          <Link href="/apiviz/idempotency-lab" className="hover:text-foreground transition-colors">
            Idempotency
          </Link>
          <Link href="/apiviz/playground" className="hover:text-foreground transition-colors">
            API Sandbox
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}
