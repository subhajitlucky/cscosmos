'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--mq-primary)]/10 border border-[var(--mq-primary)]/30 flex items-center justify-center text-[var(--mq-primary)]">
            <Radio className="w-4 h-4 text-[var(--mq-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--mq-text)]">
              MQ::STREAM
            </span>
            <p className="text-[11px] text-[var(--mq-muted)] font-mono">
              Distributed Commit Logs &amp; Message Broker Internals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--mq-muted)] font-mono">
          <Link href="/mqviz/learn" className="hover:text-[var(--mq-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/mqviz/stream-lab" className="hover:text-[var(--mq-primary)] transition-colors">
            Stream Lab
          </Link>
          <Link href="/mqviz/retries" className="hover:text-[var(--mq-primary)] transition-colors">
            Retry &amp; DLQ
          </Link>
          <Link href="/mqviz/about" className="hover:text-[var(--mq-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--mq-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--mq-primary)]" />
        </div>
      </div>
    </footer>
  );
}
