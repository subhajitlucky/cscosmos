'use client';

import React from 'react';
import Link from 'next/link';
import { Glasses, Layers, Move3d, Sparkles, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--xr-primary)]/30 bg-[var(--xr-primary)]/10 text-[var(--xr-primary)] text-xs font-mono">
          <Glasses className="w-3.5 h-3.5" /> XR::COSMOS Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--xr-text)]">
          The Architecture of <span className="text-[var(--xr-primary)] xr-glow">Volumetric Reality</span>
        </h1>

        <p className="text-base md:text-lg text-[var(--xr-muted)] max-w-3xl leading-relaxed">
          Spatial computing liberates computing from the confines of flat rectangular screens, embedding interactive digital entities directly into physical 3D space with continuous optical tracking and stereoscopic depth.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--xr-primary)] font-bold">01 / 6-DOF SLAM</span>
          <h3 className="font-display font-bold text-xl text-[var(--xr-text)]">Spatial Tracking</h3>
          <p className="text-xs text-[var(--xr-muted)] leading-relaxed">
            Sensor fusion merges high-frequency IMUs with optical inside-out SLAM cameras to track physical head and hand coordinates in sub-millimeter precision.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--xr-teal)] font-bold">02 / STEREOSCOPIC FOVEATION</span>
          <h3 className="font-display font-bold text-xl text-[var(--xr-text)]">Dual-Eye Shaders</h3>
          <p className="text-xs text-[var(--xr-muted)] leading-relaxed">
            Multi-view dual projection matrices and peripheral foveated rendering deliver smooth 90–120Hz stereoscopic parallax while cutting GPU fillrate in half.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--xr-rose)] font-bold">03 / BIOLOGICAL INPUT</span>
          <h3 className="font-display font-bold text-xl text-[var(--xr-text)]">Natural Gestures</h3>
          <p className="text-xs text-[var(--xr-muted)] leading-relaxed">
            25-joint anatomical hand tracking, index finger raycasts, and HRTF binaural 3D acoustics create seamless human-computer synchronization without plastic controllers.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--xr-border)] bg-[var(--xr-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--xr-text)]">
            Ready to master Spatial Computing &amp; WebXR?
          </h3>
          <p className="text-xs text-[var(--xr-muted)]">
            Explore the complete 6-module curriculum map.
          </p>
        </div>

        <Link
          href="/xrcosmos/learn"
          className="px-6 py-3 rounded-lg bg-[var(--xr-primary)] text-white font-semibold text-xs hover:bg-[var(--xr-primary-hover)] transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
