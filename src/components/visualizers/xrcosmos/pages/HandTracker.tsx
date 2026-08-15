'use client';

import React, { useState } from 'react';
import { Hand, Activity, Zap, CheckCircle2, Target, Sliders, ShieldCheck } from 'lucide-react';

const JOINTS = [
  { name: 'wrist', x: 150, y: 250, type: 'root' },
  { name: 'thumb-metacarpal', x: 120, y: 200, type: 'knuckle' },
  { name: 'thumb-tip', x: 90, y: 140, type: 'tip' },
  { name: 'index-knuckle', x: 140, y: 160, type: 'knuckle' },
  { name: 'index-finger-tip', x: 130, y: 90, type: 'tip' },
  { name: 'middle-finger-tip', x: 160, y: 80, type: 'tip' },
  { name: 'ring-finger-tip', x: 185, y: 95, type: 'tip' },
  { name: 'pinky-finger-tip', x: 205, y: 120, type: 'tip' },
];

export function HandTracker() {
  const [pinchDistanceMm, setPinchDistanceMm] = useState(35);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [hapticCount, setHapticCount] = useState(0);

  const isPinching = pinchDistanceMm < 20;

  const triggerTarget = (idx: number) => {
    if (!isPinching) return;
    setSelectedTarget(idx);
    setHapticCount(c => c + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--xr-teal)]/30 bg-[var(--xr-teal)]/10 text-[var(--xr-teal)] text-xs font-mono">
          <Hand className="w-3.5 h-3.5" /> WebXR Hand Input &amp; Joint Skeleton
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--xr-text)]">
          Spatial Hand Tracking <span className="text-[var(--xr-teal)] xr-glow">&amp; Pinch Raycast</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--xr-muted)] max-w-2xl leading-relaxed">
          Explore optical 25-joint anatomical hand tracking. Calculate Euclidean fingertip distances and fire spatial raycasts into interactive 3D UI panels with sub-10ms latency.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Skeleton Canvas */}
        <div className="lg:col-span-6 rounded-2xl border border-[var(--xr-border)] bg-[var(--xr-surface)] p-6 space-y-6 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--xr-border-subtle)] pb-4">
            <span className="text-[var(--xr-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Hand className="w-3.5 h-3.5" /> 25-Joint Anatomical Skeleton
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${isPinching ? 'bg-[var(--xr-teal)]/20 text-[var(--xr-teal)] border-[var(--xr-teal)]/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
              {isPinching ? 'PINCH ACTIVE (< 20mm)' : 'OPEN PALM'}
            </span>
          </div>

          {/* SVG Hand Skeleton Visualization */}
          <div className="relative h-64 bg-[var(--xr-bg)] rounded-xl border border-[var(--xr-border-subtle)] flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 300 280" className="w-full h-full">
              {/* Skeleton Connection Bones */}
              <line x1="150" y1="250" x2="120" y2="200" stroke="#8b5cf6" strokeWidth="3" opacity="0.6" />
              <line x1="120" y1="200" x2={isPinching ? '120' : '90'} y2={isPinching ? '105' : '140'} stroke="#8b5cf6" strokeWidth="3" opacity="0.8" />
              <line x1="150" y1="250" x2="140" y2="160" stroke="#14b8a6" strokeWidth="3" opacity="0.6" />
              <line x1="140" y1="160" x2="130" y2="90" stroke="#14b8a6" strokeWidth="3" opacity="0.8" />
              <line x1="150" y1="250" x2="160" y2="80" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" />
              <line x1="150" y1="250" x2="185" y2="95" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" />
              <line x1="150" y1="250" x2="205" y2="120" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" />

              {/* Dynamic Pinch Ray Indicator */}
              {isPinching && (
                <line x1="125" y1="95" x2="280" y2="40" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              )}

              {/* Joint Nodes */}
              {JOINTS.map((j, idx) => {
                const isThumbTip = j.name === 'thumb-tip';
                const curX = isThumbTip && isPinching ? 120 : j.x;
                const curY = isThumbTip && isPinching ? 105 : j.y;
                const isTip = j.type === 'tip';

                return (
                  <circle
                    key={idx}
                    cx={curX}
                    cy={curY}
                    r={isTip ? 6 : 4}
                    fill={isTip ? '#14b8a6' : '#8b5cf6'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          {/* Pinch Distance Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--xr-muted)]">Thumb-Index Distance (&Delta;d)</span>
              <span className={`font-bold ${isPinching ? 'text-[var(--xr-teal)]' : 'text-[var(--xr-primary)]'}`}>
                {pinchDistanceMm} mm
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="60"
              value={pinchDistanceMm}
              onChange={(e) => setPinchDistanceMm(Number(e.target.value))}
              className="w-full accent-[var(--xr-teal)] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[var(--xr-muted)]">
              <span>8mm (Full Pinch)</span>
              <span className="text-[var(--xr-teal)] font-bold">20mm Threshold</span>
              <span>60mm (Open Hand)</span>
            </div>
          </div>
        </div>

        {/* Right Spatial Raycast Target Panel */}
        <div className="lg:col-span-6 space-y-6 font-mono text-xs">
          <div className="rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--xr-border-subtle)] pb-4">
              <span className="text-[var(--xr-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> Spatial Raycast Targets
              </span>
              <span className="text-[10px] text-[var(--xr-muted)]">
                Haptic Pulses: {hapticCount}
              </span>
            </div>

            <p className="text-xs text-[var(--xr-muted)] leading-relaxed">
              {isPinching
                ? 'Pinch active! Click any spatial button below to trigger raycast selection.'
                : 'Pinch your thumb and index finger (slider < 20mm) to enable spatial raycasting.'}
            </p>

            {/* Interactive Spatial UI Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Teleport to Room Center', icon: '📍' },
                { label: 'Toggle Volumetric Wireframe', icon: '🧊' },
                { label: 'Enable Passthrough Video', icon: '👁️' },
                { label: 'Mute 3D Spatial Audio', icon: '🔊' },
              ].map((btn, idx) => {
                const isSelected = selectedTarget === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => triggerTarget(idx)}
                    disabled={!isPinching}
                    className={`p-4 rounded-xl border text-left space-y-1.5 transition-all ${
                      isSelected
                        ? 'border-[var(--xr-teal)] bg-[var(--xr-teal)]/20 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)]'
                        : isPinching
                        ? 'border-[var(--xr-border)] bg-[var(--xr-surface-2)] text-[var(--xr-text)] hover:border-[var(--xr-teal)] hover:bg-[var(--xr-teal)]/10 cursor-pointer'
                        : 'border-[var(--xr-border-subtle)] bg-[var(--xr-bg)] text-[var(--xr-muted)] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-base">{btn.icon}</div>
                    <div className="font-bold text-xs">{btn.label}</div>
                    <div className="text-[9px] text-[var(--xr-muted)]">
                      {isSelected ? '✓ Triggered via Pinch' : 'Raycast target'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Telemetry Metric Box */}
          <div className="p-4 rounded-xl bg-[var(--xr-bg)] border border-[var(--xr-border-subtle)] flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-[var(--xr-muted)] text-[10px]">Gesture Pipeline Latency</span>
              <div className="font-bold text-[var(--xr-emerald)]">6.4 ms (Zero Jitter)</div>
            </div>
            <div className="space-y-0.5 text-right">
              <span className="text-[var(--xr-muted)] text-[10px]">Smoothing Filter</span>
              <div className="font-bold text-[var(--xr-primary)]">1-Euro Adaptive Filter</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
