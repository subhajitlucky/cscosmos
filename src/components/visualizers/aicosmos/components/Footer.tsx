'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--ai-primary)]/10 border border-[var(--ai-primary)]/30 flex items-center justify-center text-[var(--ai-primary)]">
            <Sparkles className="w-4 h-4 text-[var(--ai-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--ai-text)]">
              AI::COSMOS
            </span>
            <p className="text-[11px] text-[var(--ai-muted)] font-mono">
              RAG &bull; Autonomous Agents &bull; Vector Databases &bull; Evaluation &bull; Guardrails
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--ai-muted)] font-mono">
          <Link href="/aicosmos/learn" className="hover:text-[var(--ai-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/aicosmos/rag-lab" className="hover:text-[var(--ai-primary)] transition-colors">
            RAG Lab
          </Link>
          <Link href="/aicosmos/agent-lab" className="hover:text-[var(--ai-primary)] transition-colors">
            Agent Lab
          </Link>
          <Link href="/aicosmos/about" className="hover:text-[var(--ai-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ai-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--ai-primary)]" />
        </div>
      </div>
    </footer>
  );
}
