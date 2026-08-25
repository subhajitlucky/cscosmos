'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Glasses, Box, Layers, Hand, ArrowUpRight, CheckCircle2, RotateCcw, Sliders, Sparkles, Eye, Maximize2 } from 'lucide-react';
import { xrTopics } from '../data/topics';

export function Home() {
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [posZ, setPosZ] = useState(-1.5);
  const [rotY, setRotY] = useState(25);
  const [rotX, setRotX] = useState(15);
  const [stereoMode, setStereoMode] = useState<'mono' | 'stereo'>('mono');

  const resetPose = () => {
    setPosX(0);
    setPosY(0);
    setPosZ(-1.5);
    setRotY(25);
    setRotX(15);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="xr-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--xr-primary)]/30 bg-[var(--xr-primary)]/10 text-[var(--xr-primary)] text-xs font-mono">
              <Glasses className="w-3.5 h-3.5 animate-pulse text-[var(--xr-primary)]" />
              Spatial Computing &amp; WebXR Engine
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--xr-text)]">
              Infinite Canvas.<br />
              <span className="text-[var(--xr-primary)] xr-glow">6-DoF Freedom.</span> Volumetric Reality.
            </h1>

            <p className="text-base md:text-lg text-[var(--xr-muted)] max-w-xl leading-relaxed">
              Deconstruct spatial computing architectures. Explore 6-Degrees-of-Freedom tracking, stereoscopic dual-eye rendering, 25-joint hand skeletons, and HRTF 3D binaural audio.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/xrcosmos/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--xr-primary)] text-white font-semibold text-sm hover:bg-[var(--xr-primary-hover)] transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/xrcosmos/spatial-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--xr-border)] bg-[var(--xr-surface)] text-[var(--xr-text)] font-mono text-sm hover:border-[var(--xr-primary)] hover:text-[var(--xr-primary)] transition-all"
              >
                <Box className="w-4 h-4 text-[var(--xr-primary)]" />
                3D Spatial Lab
              </Link>

              <Link
                href="/xrcosmos/hand-tracker"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--xr-border-subtle)] bg-[var(--xr-surface-2)] text-[var(--xr-muted)] font-mono text-sm hover:text-[var(--xr-text)] transition-all"
              >
                <Hand className="w-4 h-4 text-[var(--xr-teal)]" />
                Hand Tracking
              </Link>
            </div>
          </div>

          {/* Right Live 3D Spatial Canvas Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--xr-border)] bg-[var(--xr-surface)] shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--xr-border-subtle)] bg-[var(--xr-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-[var(--xr-muted)] ml-2">WebXR::SpatialViewport</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStereoMode(m => m === 'mono' ? 'stereo' : 'mono')}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                      stereoMode === 'stereo'
                        ? 'bg-[var(--xr-teal)] text-black border-[var(--xr-teal)] font-bold'
                        : 'bg-[var(--xr-bg)] text-[var(--xr-muted)] border-[var(--xr-border-subtle)]'
                    }`}
                  >
                    <Eye className="w-3 h-3" /> {stereoMode === 'stereo' ? 'Stereo (IPD)' : 'Mono'}
                  </button>
                  <button
                    onClick={resetPose}
                    className="text-[10px] font-mono text-[var(--xr-muted)] hover:text-[var(--xr-primary)]"
                    title="Reset Pose"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-6 font-mono text-xs space-y-6">
                {/* 3D Spatial Viewport */}
                <div className="relative rounded-xl bg-[var(--xr-bg)] border border-[var(--xr-border-subtle)] h-48 overflow-hidden flex items-center justify-center perspective-[600px]">
                  <div className="absolute inset-0 xr-grid-bg opacity-30 pointer-events-none" />

                  {/* Rendered 3D Mesh Prism */}
                  <div className={`flex items-center justify-center gap-6 w-full ${stereoMode === 'stereo' ? 'px-4' : ''}`}>
                    {/* Left Eye View */}
                    <div
                      className="w-24 h-24 rounded-2xl bg-cyan-600 border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.35)] flex flex-col items-center justify-center text-white transition-all"
                      style={{
                        transform: `translate3d(${posX * 30 - (stereoMode === 'stereo' ? 10 : 0)}px, ${-posY * 30}px, ${(posZ + 1.5) * 50}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                      }}
                    >
                      <span className="font-display font-bold text-xs">XR::PRISM</span>
                      <span className="text-[9px] font-mono opacity-80">{stereoMode === 'stereo' ? 'L-Eye' : '6-DoF'}</span>
                    </div>

                    {/* Right Eye View (Stereo Mode Only) */}
                    {stereoMode === 'stereo' && (
                      <div
                        className="w-24 h-24 rounded-2xl bg-cyan-600 border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.35)] flex flex-col items-center justify-center text-white transition-all"
                        style={{
                          transform: `translate3d(${posX * 30 + 10}px, ${-posY * 30}px, ${(posZ + 1.5) * 50}px) rotateX(${rotX}deg) rotateY(${rotY + 4}deg)`,
                        }}
                      >
                        <span className="font-display font-bold text-xs">XR::PRISM</span>
                        <span className="text-[9px] font-mono opacity-80">R-Eye (IPD)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 6-DoF Telemetry Sliders */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-[var(--xr-muted)]">
                    <span>6-DoF Spatial Pose Matrix</span>
                    <span className="text-[var(--xr-primary)] font-bold">
                      X:{posX.toFixed(1)} Y:{posY.toFixed(1)} Z:{posZ.toFixed(1)}m | RotY:{rotY}°
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--xr-muted)]">Yaw Rotation (RotY: {rotY}°)</label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={rotY}
                        onChange={(e) => setRotY(Number(e.target.value))}
                        className="w-full accent-[var(--xr-primary)] cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--xr-muted)]">Depth Distance (Z: {posZ}m)</label>
                      <input
                        type="range"
                        min="-3"
                        max="0"
                        step="0.1"
                        value={posZ}
                        onChange={(e) => setPosZ(Number(e.target.value))}
                        className="w-full accent-[var(--xr-teal)] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Flat 2D Screen vs Stereoscopic WebXR */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--xr-primary)] uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Spatial Paradigm Shift
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--xr-text)]">
            Flat 2D Screens vs Volumetric WebXR
          </h2>
          <p className="text-sm text-[var(--xr-muted)]">
            How spatial computing replaces pixel boxes with physical room-scale 3D coordinate geometry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flat 2D Card */}
          <div className="p-8 rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--xr-text)]">Flat 2D DOM / Canvas</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                2D Pixels
              </span>
            </div>
            <p className="text-xs text-[var(--xr-muted)] leading-relaxed">
              Bound to flat rectangular monitor screens. Interactions rely on 2D mouse cursor clicks and finger taps on glass with zero physical depth.
            </p>
            <div className="p-4 rounded-lg bg-[var(--xr-bg)] font-mono text-[11px] text-[var(--xr-muted)] space-y-2 border border-[var(--xr-border-subtle)]">
              <div>• Screen coordinates defined in 2D pixels [X, Y]</div>
              <div>• Single monoscopic camera viewport at 60Hz</div>
              <div>• Standard stereo speakers with flat panning</div>
              <div>• Bounded inside physical rectangular monitor bezels</div>
            </div>
          </div>

          {/* WebXR Volumetric Card */}
          <div className="p-8 rounded-2xl border-2 border-[var(--xr-primary)]/40 bg-[var(--xr-surface)] space-y-6 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--xr-text)]">WebXR Volumetric 6-DoF</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--xr-primary)]/10 text-[var(--xr-primary)] border border-[var(--xr-primary)]/30 font-bold">
                6-DoF Room Scale
              </span>
            </div>
            <p className="text-xs text-[var(--xr-muted)] leading-relaxed">
              Objects exist in physical meters in your room. Dual-eye rendering generates genuine optical depth parallax with optical hand-tracking pinch gestures.
            </p>
            <div className="p-4 rounded-lg bg-[var(--xr-bg)] font-mono text-[11px] text-[var(--xr-muted)] space-y-2 border border-[var(--xr-primary)]/20">
              <div className="text-[var(--xr-primary)]">• Metric 3D Cartesian coordinates [X, Y, Z, Quaternions]</div>
              <div className="text-[var(--xr-teal)]">• Dual stereoscopic viewports at ultra-smooth 90–120Hz</div>
              <div className="text-[var(--xr-rose)]">• HRTF binaural 3D spatial acoustics</div>
              <div className="text-[var(--xr-text)]">• 25-joint anatomical optical hand tracking and raycasts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--xr-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--xr-primary)] uppercase tracking-wider">
              Architecture Tracks
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--xr-text)] mt-1">
              Spatial Computing Modules
            </h2>
          </div>
          <Link
            href="/xrcosmos/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--xr-primary)] hover:underline"
          >
            View all 6 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {xrTopics.slice(0, 6).map((topic) => (
            <Link
              key={topic.id}
              href={`/xrcosmos/learn/${topic.id}`}
              className="xr-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--xr-primary)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--xr-muted)] group-hover:text-[var(--xr-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--xr-text)] group-hover:text-[var(--xr-primary)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--xr-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--xr-border-subtle)] text-[var(--xr-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--xr-muted)]">
                  {topic.group}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
