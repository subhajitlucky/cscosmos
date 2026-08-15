'use client';

import React, { useState } from 'react';
import { Box, RotateCcw, Activity, Sliders, Eye, Sparkles, Move3d, Layers } from 'lucide-react';

export function SpatialLab() {
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [posZ, setPosZ] = useState(-1.8);
  const [rotX, setRotX] = useState(20);
  const [rotY, setRotY] = useState(35);
  const [rotZ, setRotZ] = useState(0);
  const [scale, setScale] = useState(1);
  const [shape, setShape] = useState<'cube' | 'torus' | 'pyramid'>('cube');
  const [ipdMm, setIpdMm] = useState(63);

  const resetAll = () => {
    setPosX(0);
    setPosY(0);
    setPosZ(-1.8);
    setRotX(20);
    setRotY(35);
    setRotZ(0);
    setScale(1);
    setIpdMm(63);
  };

  // Convert to radians for trigonometric matrix representation
  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;
  const cX = Math.cos(radX).toFixed(2);
  const sX = Math.sin(radX).toFixed(2);
  const cY = Math.cos(radY).toFixed(2);
  const sY = Math.sin(radY).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--xr-primary)]/30 bg-[var(--xr-primary)]/10 text-[var(--xr-primary)] text-xs font-mono">
          <Box className="w-3.5 h-3.5" /> 3D Spatial Computing Laboratory
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--xr-text)]">
          Volumetric <span className="text-[var(--xr-primary)] xr-glow">3D Spatial Lab</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--xr-muted)] max-w-2xl leading-relaxed">
          Manipulate 3D geometry in virtual room space. Inspect real-time 4&times;4 Model-View-Projection (MVP) transformation matrices and IPD stereoscopic eye convergence.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6-DoF Transform Sliders */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--xr-border)] bg-[var(--xr-surface)] p-6 space-y-6 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--xr-border-subtle)] pb-4">
            <span className="text-[var(--xr-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" /> 6-DoF Transform Controls
            </span>
            <button
              onClick={resetAll}
              className="text-[10px] text-[var(--xr-muted)] hover:text-[var(--xr-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            {/* Shape Selector */}
            <div className="space-y-1.5">
              <label className="text-[var(--xr-muted)]">3D Geometric Mesh</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['cube', 'Cube Prism'],
                  ['torus', 'Volumetric Torus'],
                  ['pyramid', 'Pyramid Mesh']
                ].map(([sId, label]) => (
                  <button
                    key={sId}
                    onClick={() => setShape(sId as 'cube' | 'torus' | 'pyramid')}
                    className={`py-1.5 rounded text-[10px] transition-all ${
                      shape === sId
                        ? 'bg-[var(--xr-primary)] text-white font-bold'
                        : 'border border-[var(--xr-border-subtle)] bg-[var(--xr-bg)] text-[var(--xr-muted)] hover:text-[var(--xr-text)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Sliders */}
            <div className="space-y-3 pt-2 border-t border-[var(--xr-border-subtle)]">
              <span className="text-[10px] text-[var(--xr-muted)] uppercase tracking-wider">Translation (Meters)</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-red-400">X (Lateral)</span>
                    <span>{posX.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.1"
                    value={posX}
                    onChange={(e) => setPosX(Number(e.target.value))}
                    className="w-full accent-red-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-green-400">Y (Height)</span>
                    <span>{posY.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={posY}
                    onChange={(e) => setPosY(Number(e.target.value))}
                    className="w-full accent-green-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-blue-400">Z (Depth)</span>
                    <span>{posZ.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="-0.5"
                    step="0.1"
                    value={posZ}
                    onChange={(e) => setPosZ(Number(e.target.value))}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Rotation Sliders */}
            <div className="space-y-3 pt-2 border-t border-[var(--xr-border-subtle)]">
              <span className="text-[10px] text-[var(--xr-muted)] uppercase tracking-wider">Quaternion Orientation (Degrees)</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span>Pitch (RotX)</span>
                    <span className="text-[var(--xr-primary)]">{rotX}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotX}
                    onChange={(e) => setRotX(Number(e.target.value))}
                    className="w-full accent-[var(--xr-primary)] cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span>Yaw (RotY)</span>
                    <span className="text-[var(--xr-primary)]">{rotY}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotY}
                    onChange={(e) => setRotY(Number(e.target.value))}
                    className="w-full accent-[var(--xr-primary)] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* IPD Convergence Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--xr-border-subtle)]">
              <div className="flex justify-between text-[10px]">
                <span className="text-[var(--xr-teal)]">Inter-Pupillary Distance (IPD)</span>
                <span className="font-bold text-[var(--xr-teal)]">{ipdMm} mm</span>
              </div>
              <input
                type="range"
                min="58"
                max="72"
                value={ipdMm}
                onChange={(e) => setIpdMm(Number(e.target.value))}
                className="w-full accent-[var(--xr-teal)] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right 3D Viewport & 4x4 Matrix Inspector */}
        <div className="lg:col-span-7 space-y-6 font-mono text-xs">
          {/* 3D Canvas Stage */}
          <div className="rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-[var(--xr-border-subtle)] bg-[var(--xr-surface-2)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--xr-primary)] font-bold flex items-center gap-2">
                <Move3d className="w-3.5 h-3.5" /> WebGL 3D Spatial Frustum
              </span>
              <span className="text-[10px] text-[var(--xr-muted)]">
                FOVEATED: ON
              </span>
            </div>

            <div className="h-72 bg-[var(--xr-bg)] relative flex items-center justify-center perspective-[700px] overflow-hidden">
              <div className="absolute inset-0 xr-grid-bg opacity-40 pointer-events-none" />

              {/* 3D Rendered Shape */}
              <div
                className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-teal-400 border-2 border-violet-300 shadow-[0_0_50px_rgba(139,92,246,0.5)] flex flex-col items-center justify-center text-white transition-all duration-75"
                style={{
                  transform: `translate3d(${posX * 40}px, ${-posY * 40}px, ${(posZ + 1.8) * 60}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
                }}
              >
                <span className="font-display font-extrabold text-sm tracking-wider">XR::{shape.toUpperCase()}</span>
                <span className="text-[9px] font-mono opacity-80 mt-1">Z={posZ.toFixed(2)}m</span>
              </div>
            </div>
          </div>

          {/* 4x4 Model Transformation Matrix */}
          <div className="rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[var(--xr-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> 4&times;4 Model Transform Matrix (M = T &times; R &times; S)
              </span>
              <span className="text-[10px] text-[var(--xr-muted)]">AFFINE MATRIX</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--xr-bg)] border border-[var(--xr-border-subtle)] grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-primary)] font-bold">{cY}</div>
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-muted)]">0.00</div>
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-primary)] font-bold">{sY}</div>
              <div className="p-2 rounded bg-red-500/10 text-red-400 font-bold">{posX.toFixed(2)} (Tx)</div>

              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-muted)]">0.00</div>
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-primary)] font-bold">{cX}</div>
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-primary)] font-bold">{sX}</div>
              <div className="p-2 rounded bg-green-500/10 text-green-400 font-bold">{posY.toFixed(2)} (Ty)</div>

              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-primary)] font-bold">-{sY}</div>
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-primary)] font-bold">-{sX}</div>
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-primary)] font-bold">{cY}</div>
              <div className="p-2 rounded bg-blue-500/10 text-blue-400 font-bold">{posZ.toFixed(2)} (Tz)</div>

              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-muted)]">0.00</div>
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-muted)]">0.00</div>
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-muted)]">0.00</div>
              <div className="p-2 rounded bg-[var(--xr-surface-2)] text-[var(--xr-text)] font-bold">1.00 (W)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
