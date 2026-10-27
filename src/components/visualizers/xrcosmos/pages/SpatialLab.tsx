'use client';

import React, { useState } from 'react';
import { Box, RotateCcw, Activity, Sliders, Eye, Sparkles, Move3d, Layers } from 'lucide-react';

/**
 * Mesh primitives for the "3D Geometric Mesh" selector.
 *
 * LIMITATION: this viewport is a DOM mock-up of a WebGL canvas, so these are not
 * real indexed triangle meshes (that would need three.js/WebGL). Each option is a
 * dependency-free CSS approximation built from clip-path, borders and 3D CSS
 * transforms — but the three are genuinely different geometry (six-face cube,
 * tilted torus ring, faceted pyramid) and they inherit the viewport perspective
 * and the 6-DoF transform, so the selector now changes what is rendered.
 */
function CubeMesh() {
  const half = 48; // 96px cube: every face sits 48px along its own normal
  const faces = [
    `translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  return (
    <div className="relative w-24 h-24" style={{ transformStyle: 'preserve-3d' }}>
      {faces.map((transform, i) => (
        <div
          key={i}
          className="absolute inset-0 border-2 border-cyan-300 bg-cyan-600 shadow-[0_0_50px_rgba(6,182,212,0.45)]"
          style={{
            transform,
            // 3x3 face grid so each cube face reads as a subdivided mesh face
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.22) 1px, transparent 1px)',
            backgroundSize: '33.34% 33.34%',
          }}
        />
      ))}
    </div>
  );
}

function TorusMesh() {
  return (
    <div
      className="relative w-28 h-28"
      // self-tilt kept modest: it stacks with the RotX slider, and a steeper tilt
      // would present the ring edge-on (a flat sliver) at the default RotX = 20°.
      style={{ transform: 'rotateX(38deg)', transformStyle: 'preserve-3d' }}
    >
      {/* halo */}
      <div
        className="absolute -inset-3 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.35), transparent 70%)' }}
      />
      {/* tube body: thick ring, lit rim on top and shaded rim underneath */}
      <div
        className="absolute inset-0 rounded-full border-[18px] border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.45)]"
        style={{ borderTopColor: '#67e8f9', borderBottomColor: '#0e7490' }}
      />
      {/* outer + inner wireframe rings outlining the tube */}
      <div className="absolute inset-[9px] rounded-full border-2 border-cyan-200/70" />
      <div className="absolute inset-[27px] rounded-full border border-cyan-300/40" />
    </div>
  );
}

function PyramidMesh() {
  const silhouette = 'polygon(50% 0%, 100% 100%, 0% 100%)';

  return (
    <div className="relative w-28 h-28" style={{ transformStyle: 'preserve-3d' }}>
      {/* halo */}
      <div
        className="absolute -inset-3"
        style={{ background: 'radial-gradient(circle at 50% 65%, rgba(6,182,212,0.35), transparent 70%)' }}
      />
      {/* two shaded faces meeting at the apex => faceted pyramid */}
      <div className="absolute inset-0 bg-cyan-700" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 50% 100%)' }} />
      <div className="absolute inset-0 bg-cyan-500" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 50% 100%)' }} />
      {/* silhouette edge */}
      <div className="absolute inset-0 border-2 border-cyan-300/80" style={{ clipPath: silhouette }} />
      {/* horizontal triangle-stack banding, clipped to the silhouette */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: silhouette,
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0 15px, rgba(103,232,249,0.35) 15px 17px)',
        }}
      />
    </div>
  );
}

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

  // Rotation convention — matches the CSS transform applied to the mesh below:
  //   transform: translate3d(...) rotateX(θx) rotateY(θy) rotateZ(θz) scale3d(s, s, s)
  // CSS post-multiplies transform functions left-to-right and treats points as
  // column vectors, so the matrix actually applied is
  //   M = T · Rx(θx) · Ry(θy) · Rz(θz) · S(s)
  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;
  const radZ = (rotZ * Math.PI) / 180;
  const cX = Math.cos(radX);
  const sX = Math.sin(radX);
  const cY = Math.cos(radY);
  const sY = Math.sin(radY);
  const cZ = Math.cos(radZ);
  const sZ = Math.sin(radZ);
  const s = scale;

  // R = Rx·Ry·Rz (row-major 3x3)
  const r = [
    [cY * cZ, -cY * sZ, sY],
    [cX * sZ + sX * sY * cZ, cX * cZ - sX * sY * sZ, -sX * cY],
    [sX * sZ - cX * sY * cZ, sX * cZ + cX * sY * sZ, cX * cY],
  ];

  // M = T · R · S: the upper-left 3x3 block is R with every entry scaled by s
  // (uniform scale), and the 4th column is the translation in meters.
  const m = r.map((row) => row.map((v) => s * v));
  const fmt = (n: number) => (Math.abs(n) < 0.005 ? '0.00' : n.toFixed(2));

  // Matrix cell tones. The four transform terms are colour-coded (T is red /
  // green / blue per axis, R is the brand violet), and each tinted cell is its
  // own surface: `bg-red-500/10` over the `bg-[var(--xr-bg)]` matrix board is
  // #f7e8ea in light mode, so a `text-*-400` label there is 2.2-2.4:1 - well
  // under AA. Light mode takes the lightest shade of the same hue that clears
  // 4.5:1 on that tint (red-600 is 4.06:1, so red-700), and `dark:` restores the
  // original bright 400 so dark mode is untouched.
  const cellTone: Record<string, string> = {
    rot: 'bg-[var(--xr-surface-2)] text-[var(--xr-primary-text)] font-bold',
    tx: 'bg-red-500/10 text-red-700 dark:text-red-400 font-bold',
    ty: 'bg-green-500/10 text-green-800 dark:text-green-400 font-bold',
    tz: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold',
    zero: 'bg-[var(--xr-surface-2)] text-[var(--xr-muted)]',
    w: 'bg-[var(--xr-surface-2)] text-[var(--xr-text)] font-bold',
  };

  // The 9px symbolic term sits INSIDE the cell, so it inherited the cell colour
  // at `opacity-75`: 75% of --xr-primary-text over --xr-surface-2 is #9969f0 =
  // 3.40:1 (light), and the same reduction put the tinted cells at 1.9:1. The
  // term labels therefore carry their own colour at full opacity, one shade
  // deeper than the value where the tint demands it - and never --xr-muted on
  // --xr-surface-2, which is 4.34:1 even at full opacity.
  const cellSubTone: Record<string, string> = {
    rot: 'text-[var(--xr-primary-text)]',
    tx: 'text-red-700 dark:text-red-400',
    ty: 'text-green-800 dark:text-green-400',
    tz: 'text-blue-700 dark:text-blue-400',
    zero: 'text-[var(--xr-text)]',
    w: 'text-[var(--xr-text)]',
  };

  const matrixCells: { value: string; term: string; tone: string }[] = [
    { value: fmt(m[0][0]), term: 's·cY·cZ', tone: 'rot' },
    { value: fmt(m[0][1]), term: '−s·cY·sZ', tone: 'rot' },
    { value: fmt(m[0][2]), term: 's·sY', tone: 'rot' },
    { value: fmt(posX), term: 'Tx (m)', tone: 'tx' },

    { value: fmt(m[1][0]), term: 's·(cX·sZ + sX·sY·cZ)', tone: 'rot' },
    { value: fmt(m[1][1]), term: 's·(cX·cZ − sX·sY·sZ)', tone: 'rot' },
    { value: fmt(m[1][2]), term: '−s·sX·cY', tone: 'rot' },
    { value: fmt(posY), term: 'Ty (m)', tone: 'ty' },

    { value: fmt(m[2][0]), term: 's·(sX·sZ − cX·sY·cZ)', tone: 'rot' },
    { value: fmt(m[2][1]), term: 's·(sX·cZ + cX·sY·sZ)', tone: 'rot' },
    { value: fmt(m[2][2]), term: 's·cX·cY', tone: 'rot' },
    { value: fmt(posZ), term: 'Tz (m)', tone: 'tz' },

    { value: '0.00', term: '0', tone: 'zero' },
    { value: '0.00', term: '0', tone: 'zero' },
    { value: '0.00', term: '0', tone: 'zero' },
    { value: '1.00', term: 'W', tone: 'w' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--xr-primary-30)] bg-[var(--xr-primary-10)] text-[var(--xr-primary-text)] text-xs font-mono">
          <Box className="w-3.5 h-3.5" /> 3D Spatial Computing Laboratory
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--xr-text)]">
          Volumetric <span className="text-[var(--xr-primary-text)] xr-glow">3D Spatial Lab</span>
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
            <span className="text-[var(--xr-primary-text)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" /> 6-DoF Transform Controls
            </span>
            <button
              onClick={resetAll}
              className="text-[10px] text-[var(--xr-muted)] hover:text-[var(--xr-primary-text)] flex items-center gap-1"
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
                        ? 'bg-[var(--xr-primary-solid)] text-[var(--xr-on-accent)] font-bold'
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
                    <span className="text-red-600 dark:text-red-400">X (Lateral)</span>
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
                    <span className="text-green-700 dark:text-green-400">Y (Height)</span>
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
                    <span className="text-blue-600 dark:text-blue-400">Z (Depth)</span>
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
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span>Pitch (RotX)</span>
                    <span className="text-[var(--xr-primary-text)]">{rotX}°</span>
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
                    <span className="text-[var(--xr-primary-text)]">{rotY}°</span>
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
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span>Roll (RotZ)</span>
                    <span className="text-[var(--xr-primary-text)]">{rotZ}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotZ}
                    onChange={(e) => setRotZ(Number(e.target.value))}
                    className="w-full accent-[var(--xr-primary)] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Uniform Scale Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--xr-border-subtle)]">
              <div className="flex justify-between text-[10px]">
                <span className="text-[var(--xr-muted)]">Uniform Scale (S = diag(s, s, s))</span>
                <span className="font-bold text-[var(--xr-primary-text)]">{scale.toFixed(2)}&times;</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-[var(--xr-primary)] cursor-pointer"
              />
            </div>

            {/* IPD Convergence Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--xr-border-subtle)]">
              <div className="flex justify-between text-[10px]">
                <span className="text-[var(--xr-teal-text)]">Inter-Pupillary Distance (IPD)</span>
                <span className="font-bold text-[var(--xr-teal-text)]">{ipdMm} mm</span>
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
              <span className="text-[11px] text-[var(--xr-primary-text)] font-bold flex items-center gap-2">
                <Move3d className="w-3.5 h-3.5" /> WebGL 3D Spatial Frustum
              </span>
              <span className="text-[10px] text-[var(--xr-muted)]">
                FOVEATED: ON
              </span>
            </div>

            {/* `perspective` is a real CSS property but not a Tailwind v3 utility:
                `perspective-[700px]` emits no CSS at all, which flattened this
                viewport and made the Z-depth slider do nothing. Applied inline. */}
            <div
              className="h-72 bg-[var(--xr-bg)] relative flex items-center justify-center overflow-hidden"
              style={{ perspective: '700px' }}
            >
              <div className="absolute inset-0 xr-grid-bg opacity-40 pointer-events-none" />

              {/* 3D Rendered Shape — geometry swaps with the mesh selector */}
              <div
                className="relative flex flex-col items-center transition-all duration-75"
                style={{
                  // scale3d (not the 2D `scale()`, which leaves m33 = 1) so the
                  // applied matrix really is T · Rx · Ry · Rz · S with S = diag(s,s,s).
                  transform: `translate3d(${posX * 40}px, ${-posY * 40}px, ${(posZ + 1.8) * 60}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale3d(${scale}, ${scale}, ${scale})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {shape === 'cube' && <CubeMesh />}
                {shape === 'torus' && <TorusMesh />}
                {shape === 'pyramid' && <PyramidMesh />}
                <span className="mt-2 font-display font-extrabold text-sm tracking-wider text-[var(--xr-text)]">
                  XR::{shape.toUpperCase()}
                </span>
                <span className="text-[9px] font-mono text-[var(--xr-muted)]">Z={posZ.toFixed(2)}m</span>
              </div>
            </div>
          </div>

          {/* 4x4 Model Transformation Matrix */}
          <div className="rounded-2xl border border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[var(--xr-primary-text)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> 4&times;4 Model Transform Matrix (M = T &times; Rx &times; Ry &times; Rz &times; S)
              </span>
              <span className="text-[10px] text-[var(--xr-muted)]">AFFINE MATRIX</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[var(--xr-muted)]">
              <span>
                T = translation <span className="text-[var(--xr-primary-text)]">({posX.toFixed(2)}, {posY.toFixed(2)}, {posZ.toFixed(2)})</span>
              </span>
              <span>
                R = Rx({rotX}°) · Ry({rotY}°) · Rz({rotZ}°)
              </span>
              <span>
                S = diag(s, s, s), s = <span className="text-[var(--xr-primary-text)]">{scale.toFixed(2)}</span>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--xr-bg)] border border-[var(--xr-border-subtle)] grid grid-cols-4 gap-2 text-center text-xs">
              {matrixCells.map((cell, i) => (
                <div key={i} className={`p-2 rounded leading-tight ${cellTone[cell.tone]}`}>
                  <div>{cell.value}</div>
                  <div className={`text-[9px] font-normal mt-0.5 ${cellSubTone[cell.tone]}`}>{cell.term}</div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[var(--xr-muted)] leading-relaxed">
              Column-vector convention (p&prime; = M · p). CSS post-multiplies the transform list left to right, so the
              rendered order is scale &rarr; RotZ &rarr; RotY &rarr; RotX &rarr; translation — exactly the
              M = T &times; Rx &times; Ry &times; Rz &times; S matrix above (S = diag(s, s, s) via scale3d). The viewport
              then draws that model matrix through a mock projection: 40&nbsp;px per metre laterally, 60&nbsp;px per metre
              in depth with the camera 1.8&nbsp;m back, i.e. translateZ = (Tz + 1.8) &times; 60&nbsp;px. Roll (RotZ) and uniform
              Scale are driven by the Roll and Scale sliders above and reach the mesh through the same
              rotateZ(&theta;z) and scale3d(s, s, s) transform functions this matrix models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
