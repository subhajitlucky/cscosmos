'use client';

import React from 'react';
import Link from 'next/link';
import { Glasses, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--xr-primary)]/10 border border-[var(--xr-primary)]/30 flex items-center justify-center text-[var(--xr-primary)]">
            <Glasses className="w-4 h-4 text-[var(--xr-primary)]" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--xr-text)]">
              XR::COSMOS
            </span>
            <p className="text-[11px] text-[var(--xr-muted)] font-mono">
              Spatial Computing, WebXR &amp; Volumetric 3D Systems
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--xr-muted)] font-mono">
          <Link href="/xrcosmos/learn" className="hover:text-[var(--xr-primary)] transition-colors">
            Concept Map
          </Link>
          <Link href="/xrcosmos/spatial-lab" className="hover:text-[var(--xr-primary)] transition-colors">
            Spatial 3D Lab
          </Link>
          <Link href="/xrcosmos/hand-tracker" className="hover:text-[var(--xr-primary)] transition-colors">
            Hand Tracking
          </Link>
          <Link href="/xrcosmos/about" className="hover:text-[var(--xr-primary)] transition-colors">
            Architecture
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--xr-muted)]">
          <span>Part of CSCosmos</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--xr-primary)]" />
        </div>
      </div>
    </footer>
  );
}
