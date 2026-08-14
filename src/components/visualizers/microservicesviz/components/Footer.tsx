'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--ms-primary)]/10 border border-[var(--ms-primary)]/30 flex items-center justify-center text-[var(--ms-primary)]">
            <Network className="w-4 h-4 text-[var(--ms-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--ms-text)]">
              MICROSERVICES::VIZ
            </span>
            <p className="text-[11px] text-[var(--ms-muted)] font-mono">
              Resilient Distributed Systems &bull; Sagas &bull; Circuit Breakers &bull; OpenTelemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--ms-muted)] font-mono">
          <Link href="/microservicesviz/learn" className="hover:text-[var(--ms-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/microservicesviz/circuit-lab" className="hover:text-[var(--ms-primary)] transition-colors">
            Circuit Breaker Lab
          </Link>
          <Link href="/microservicesviz/saga-lab" className="hover:text-[var(--ms-primary)] transition-colors">
            Saga Pattern Lab
          </Link>
          <Link href="/microservicesviz/about" className="hover:text-[var(--ms-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ms-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--ms-primary)]" />
        </div>
      </div>
    </footer>
  );
}
