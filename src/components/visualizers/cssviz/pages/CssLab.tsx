'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import {
  FlaskConical,
  RotateCcw,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Code2,
  Eye,
  Sparkles,
  Layout,
  Sun,
  Moon,
  Sliders,
  Move,
  Box,
  Layers,
  Activity,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { cn } from '../utils/cn';
import { useTheme } from '@/components/visualizers/cssviz/theme/ThemeProvider';

interface Preset {
  id: string;
  name: string;
  category: string;
  description: string;
  css: string;
  html: string;
}

const PRESETS: Preset[] = [
  {
    id: 'flexbox',
    name: '1. Flexbox Alignment Studio',
    category: 'Layout',
    description: 'Experiment with justify-content, align-items, flex-direction, and gap.',
    html: `<div class="flex-container">
  <div class="card card-1">
    <h3>Header 1</h3>
    <p>Main content area with flexible expansion.</p>
  </div>
  <div class="card card-2">
    <h3>Header 2</h3>
    <p>Secondary column aligned along cross axis.</p>
  </div>
  <div class="card card-3">
    <h3>Header 3</h3>
    <p>Tertiary element demonstrating spacing.</p>
  </div>
</div>`,
    css: `.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px;
}

.card {
  flex: 1 1 200px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card h3 {
  margin-top: 0;
  color: #0f172a;
}

.card p {
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
}`,
  },
  {
    id: 'grid',
    name: '2. Modern Bento Grid',
    category: 'Layout',
    description: '2D grid tracks combining repeat, auto-fit, and minmax for fluid responsive masonry.',
    html: `<div class="bento-grid">
  <div class="tile tile-feature">
    <h2>Featured Article</h2>
    <p>Spans two columns and two rows in modern bento fashion.</p>
  </div>
  <div class="tile">Stat 1: 99.9% Uptime</div>
  <div class="tile">Stat 2: 2.4k Stars</div>
  <div class="tile tile-wide">Wide Banner: Full-width responsive integration</div>
</div>`,
    css: `.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: stretch;
  padding: 24px;
}

.tile {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  padding: 24px;
  font-weight: 500;
  color: #1e293b;
}

.tile-feature {
  grid-column: span 2;
  grid-row: span 2;
  background: #e0e7ff;
  border-color: #a5b4fc;
}

.tile-wide {
  grid-column: 1 / -1;
  background: #fef3c7;
  border-color: #fde68a;
}`,
  },
  {
    id: 'box-model',
    name: '3. Box-Sizing & Outline Offsets',
    category: 'Layout',
    description: 'Compare content-box vs border-box math, border radius, and non-reflowing outline-offset.',
    html: `<div class="box-arena">
  <div class="demo-box content-box-mode">
    <h3>content-box</h3>
    <p>Rendered size = Declared width + padding + border (280px total!)</p>
  </div>
  <div class="demo-box border-box-mode">
    <h3>border-box</h3>
    <p>Rendered size = Strictly 200px (padding & border absorbed inside!)</p>
  </div>
</div>`,
    css: `.box-arena {
  display: flex;
  gap: 32px;
  padding: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.demo-box {
  width: 200px;
  height: 140px;
  padding: 24px;
  border: 8px solid #3b82f6;
  border-radius: 16px;
  outline: 3px dashed #10b981;
  outline-offset: 6px;
  background: #f8fafc;
  color: #0f172a;
}

.demo-box h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.demo-box p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.content-box-mode {
  box-sizing: content-box;
}

.border-box-mode {
  box-sizing: border-box;
}`,
  },
  {
    id: 'translate-transforms',
    name: '4. GPU Translate, Scale & Rotate',
    category: 'Transforms',
    description: 'Hardware-accelerated 2D/3D transformations that move on the compositor without layout reflow.',
    html: `<div class="transform-stage">
  <div class="card card-ghost">
    <span>Ghost Slot (Normal Flow)</span>
  </div>
  <div class="card card-active">
    <h3>GPU Transformed</h3>
    <p>Hover or adjust sliders to test 2D translate, rotate, and scale elevation!</p>
    <div class="badge">translate3d(0, -16px, 0)</div>
  </div>
</div>`,
    css: `.transform-stage {
  padding: 60px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.card {
  width: 260px;
  height: 160px;
  border-radius: 16px;
  padding: 24px;
}

.card-ghost {
  border: 2px dashed #94a3b8;
  background: rgba(148, 163, 184, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 12px;
  font-family: monospace;
}

.card-active {
  position: absolute;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
  transform: translate3d(0px, -16px, 0px) scale(1.05) rotate(-1.5deg);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  cursor: pointer;
  will-change: transform;
}

.card-active h3 {
  margin: 0 0 8px 0;
}

.card-active p {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.badge {
  display: inline-block;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 11px;
}`,
  },
  {
    id: 'keyframe-bounce',
    name: '5. Kinetic Squash & Stretch Animation',
    category: 'Motion',
    description: 'Realistic gravity bounce keyframes engineered with cubic-bezier elastic overshoot and impact deformation.',
    html: `<div class="bounce-stage">
  <div class="rubber-orb"></div>
  <div class="shadow-disc"></div>
  <div class="floor-line"></div>
</div>`,
    css: `.bounce-stage {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 40px;
  position: relative;
}

.rubber-orb {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%);
  box-shadow: 0 8px 20px rgba(244, 63, 94, 0.5);
  animation: gravity-bounce 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  transform-origin: center bottom;
  will-change: transform;
}

.shadow-disc {
  width: 70px;
  height: 12px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  margin-top: 8px;
  animation: shadow-scale 1.3s ease-in-out infinite;
  filter: blur(2px);
}

.floor-line {
  width: 240px;
  height: 2px;
  background: #cbd5e1;
  margin-top: -6px;
}

@keyframes gravity-bounce {
  0% {
    transform: translateY(-110px) scale(1, 1);
  }
  45% {
    transform: translateY(0px) scale(1.25, 0.75);
  }
  60% {
    transform: translateY(-40px) scale(0.9, 1.15);
  }
  80% {
    transform: translateY(0px) scale(1.05, 0.95);
  }
  100% {
    transform: translateY(-110px) scale(1, 1);
  }
}

@keyframes shadow-scale {
  0%, 100% {
    transform: scale(0.5);
    opacity: 0.2;
  }
  45% {
    transform: scale(1.3);
    opacity: 0.6;
  }
}`,
  },
  {
    id: '3d-flip',
    name: '6. 3D Perspective Card Flip',
    category: 'Motion & 3D',
    description: 'Interactive card flip using perspective, preserve-3d, and backface-visibility.',
    html: `<div class="scene">
  <div class="flip-card">
    <div class="card-face card-front">
      <h2>3D Front Plane</h2>
      <p>Drag the rotateY slider to turn!</p>
    </div>
    <div class="card-face card-back">
      <h2>Secret Revealed</h2>
      <p>Rotated in Z-space</p>
    </div>
  </div>
</div>`,
    css: `.scene {
  perspective: 1000px;
  padding: 40px;
  display: flex;
  justify-content: center;
}

.flip-card {
  width: 260px;
  height: 180px;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateY(0deg);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-front {
  background: #3b82f6;
  color: white;
}

.card-back {
  background: #0f172a;
  color: #38bdf8;
  transform: rotateY(180deg);
}`,
  },
  {
    id: 'glassmorphism',
    name: '7. Glassmorphism & Backdrop Blur',
    category: 'Visuals',
    description: 'Modern translucent frosted glass using backdrop-filter and layered shadows.',
    html: `<div class="glass-scene">
  <div class="color-blob blob-1"></div>
  <div class="color-blob blob-2"></div>
  <div class="glass-card">
    <h2>Frosted Glass</h2>
    <p>Translucent card with real-time backdrop blur filtering.</p>
    <button class="glass-btn">Explore</button>
  </div>
</div>`,
    css: `.glass-scene {
  position: relative;
  min-height: 320px;
  background: #0f172a;
  padding: 40px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-blob {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  filter: blur(40px);
}

.blob-1 {
  background: #ec4899;
  top: 40px;
  left: 20%;
}

.blob-2 {
  background: #3b82f6;
  bottom: 40px;
  right: 20%;
}

.glass-card {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 32px;
  max-width: 320px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.glass-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 12px;
}`,
  },
  {
    id: 'container-queries',
    name: '8. Container Queries (@container)',
    category: 'Responsive',
    description: 'Component adapts directly to parent container width, independent of viewport.',
    html: `<div class="resizable-wrapper">
  <div class="card-container">
    <div class="product-card">
      <div class="product-badge">NEW</div>
      <div class="product-info">
        <h3>Autonomous Widget</h3>
        <p>Switches between stacked and horizontal layout based on container size.</p>
      </div>
    </div>
  </div>
</div>`,
    css: `.resizable-wrapper {
  resize: horizontal;
  overflow: auto;
  border: 2px dashed #94a3b8;
  padding: 16px;
  max-width: 450px;
  margin: 0 auto;
}

.card-container {
  container-type: inline-size;
}

.product-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 16px;
}

.product-badge {
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  align-self: flex-start;
}

/* Switches to row when container exceeds 400px! */
@container (min-width: 400px) {
  .product-card {
    flex-direction: row;
    align-items: center;
  }
}`,
  },
  {
    id: 'clamp-fluid',
    name: '9. Fluid clamp() Scaling',
    category: 'Typography',
    description: 'Fluid scaling formula that smoothly scales font and spacing between limits.',
    html: `<div class="fluid-stage">
  <h1 class="fluid-headline">Fluid Headline</h1>
  <p class="fluid-body">Resize using the stage width slider to observe text dynamically scaling without any abrupt media query jumps.</p>
</div>`,
    css: `.fluid-stage {
  padding: clamp(16px, 5vw, 64px);
  background: #f8fafc;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.fluid-headline {
  /* Scales between 24px and 56px based on 5vw */
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16px;
}

.fluid-body {
  font-size: clamp(0.875rem, 1.5vw + 0.5rem, 1.25rem);
  color: #475569;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}`,
  },
];

export default function CssLab() {
  const { theme } = useTheme();
  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  const [activePreset, setActivePreset] = useState<string>('flexbox');
  const [activeTab, setActiveTab] = useState<'css' | 'html'>('css');
  const [cssCode, setCssCode] = useState<string>(PRESETS[0].css);
  const [htmlCode, setHtmlCode] = useState<string>(PRESETS[0].html);
  const [viewportWidth, setViewportWidth] = useState<'100%' | '768px' | '375px'>('100%');
  const [previewBg, setPreviewBg] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState<boolean>(false);

  // ==========================================
  // TINKER SLIDERS & BUTTONS STATE
  // ==========================================

  // 1. Flexbox state
  const [flexDir, setFlexDir] = useState<'row' | 'column' | 'row-reverse'>('row');
  const [flexJustify, setFlexJustify] = useState<'space-between' | 'center' | 'flex-start' | 'space-evenly' | 'flex-end'>('space-between');
  const [flexAlign, setFlexAlign] = useState<'stretch' | 'center' | 'flex-start' | 'flex-end'>('stretch');
  const [flexGap, setFlexGap] = useState<number>(16);
  const [flexPadding, setFlexPadding] = useState<number>(24);

  // 2. Grid state
  const [gridTemplate, setGridTemplate] = useState<string>('repeat(3, 1fr)');
  const [gridGap, setGridGap] = useState<number>(16);
  const [gridAlign, setGridAlign] = useState<string>('stretch');

  // 3. Box Model state
  const [boxSizing, setBoxSizing] = useState<'border-box' | 'content-box'>('border-box');
  const [boxPadding, setBoxPadding] = useState<number>(24);
  const [boxBorder, setBoxBorder] = useState<number>(8);
  const [boxOutlineOffset, setBoxOutlineOffset] = useState<number>(6);
  const [boxRadius, setBoxRadius] = useState<number>(16);

  // 4. Transforms & Translate state
  const [transX, setTransX] = useState<number>(0);
  const [transY, setTransY] = useState<number>(-16);
  const [transScale, setTransScale] = useState<number>(1.05);
  const [transRotate, setTransRotate] = useState<number>(-1.5);

  // 5. Keyframe Bounce state
  const [animDuration, setAnimDuration] = useState<number>(1.3);
  const [bounceApex, setBounceApex] = useState<number>(-110);
  const [timingFunc, setTimingFunc] = useState<string>('cubic-bezier(0.34, 1.56, 0.64, 1)');

  // 6. 3D Card Flip state
  const [flipAngle, setFlipAngle] = useState<number>(0);
  const [perspectiveVal, setPerspectiveVal] = useState<number>(1000);
  const [flipSpeed, setFlipSpeed] = useState<number>(0.6);

  // 7. Glassmorphism state
  const [glassBlur, setGlassBlur] = useState<number>(12);
  const [glassOpacity, setGlassOpacity] = useState<number>(0.1);
  const [glassRadius, setGlassRadius] = useState<number>(20);

  // 8. Container Queries state
  const [containerWidth, setContainerWidth] = useState<number>(450);

  // 9. Fluid clamp() state
  const [fluidStageWidth, setFluidStageWidth] = useState<number>(600);

  // Load a preset and reset its tinker controls to initial defaults
  const loadPreset = (preset: Preset) => {
    setActivePreset(preset.id);
    setCssCode(preset.css);
    setHtmlCode(preset.html);

    if (preset.id === 'flexbox') {
      setFlexDir('row');
      setFlexJustify('space-between');
      setFlexAlign('stretch');
      setFlexGap(16);
      setFlexPadding(24);
    } else if (preset.id === 'grid') {
      setGridTemplate('repeat(3, 1fr)');
      setGridGap(16);
      setGridAlign('stretch');
    } else if (preset.id === 'box-model') {
      setBoxSizing('border-box');
      setBoxPadding(24);
      setBoxBorder(8);
      setBoxOutlineOffset(6);
      setBoxRadius(16);
    } else if (preset.id === 'translate-transforms') {
      setTransX(0);
      setTransY(-16);
      setTransScale(1.05);
      setTransRotate(-1.5);
    } else if (preset.id === 'keyframe-bounce') {
      setAnimDuration(1.3);
      setBounceApex(-110);
      setTimingFunc('cubic-bezier(0.34, 1.56, 0.64, 1)');
    } else if (preset.id === '3d-flip') {
      setFlipAngle(0);
      setPerspectiveVal(1000);
      setFlipSpeed(0.6);
    } else if (preset.id === 'glassmorphism') {
      setGlassBlur(12);
      setGlassOpacity(0.1);
      setGlassRadius(20);
    } else if (preset.id === 'container-queries') {
      setContainerWidth(450);
    } else if (preset.id === 'clamp-fluid') {
      setFluidStageWidth(600);
    }
  };

  // Re-generate CSS whenever tinker controls change
  const applyTinkerToCss = (presetId: string, overrides: Record<string, any>) => {
    if (presetId === 'flexbox') {
      const dir = overrides.flexDir ?? flexDir;
      const just = overrides.flexJustify ?? flexJustify;
      const algn = overrides.flexAlign ?? flexAlign;
      const gap = overrides.flexGap ?? flexGap;
      const pad = overrides.flexPadding ?? flexPadding;

      setCssCode(`.flex-container {
  display: flex;
  flex-direction: ${dir};
  justify-content: ${just};
  align-items: ${algn};
  flex-wrap: wrap;
  gap: ${gap}px;
  padding: ${pad}px;
}

.card {
  flex: 1 1 200px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card h3 {
  margin-top: 0;
  color: #0f172a;
}

.card p {
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
}`);
    } else if (presetId === 'grid') {
      const tmpl = overrides.gridTemplate ?? gridTemplate;
      const gap = overrides.gridGap ?? gridGap;
      const algn = overrides.gridAlign ?? gridAlign;

      setCssCode(`.bento-grid {
  display: grid;
  grid-template-columns: ${tmpl};
  gap: ${gap}px;
  align-items: ${algn};
  padding: 24px;
}

.tile {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  padding: 24px;
  font-weight: 500;
  color: #1e293b;
}

.tile-feature {
  grid-column: span 2;
  grid-row: span 2;
  background: #e0e7ff;
  border-color: #a5b4fc;
}

.tile-wide {
  grid-column: 1 / -1;
  background: #fef3c7;
  border-color: #fde68a;
}`);
    } else if (presetId === 'box-model') {
      const sizing = overrides.boxSizing ?? boxSizing;
      const pad = overrides.boxPadding ?? boxPadding;
      const bdr = overrides.boxBorder ?? boxBorder;
      const off = overrides.boxOutlineOffset ?? boxOutlineOffset;
      const rad = overrides.boxRadius ?? boxRadius;

      setCssCode(`.box-arena {
  display: flex;
  gap: 32px;
  padding: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.demo-box {
  width: 200px;
  height: 140px;
  padding: ${pad}px;
  border: ${bdr}px solid #3b82f6;
  border-radius: ${rad}px;
  outline: 3px dashed #10b981;
  outline-offset: ${off}px;
  background: #f8fafc;
  color: #0f172a;
}

.demo-box h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.demo-box p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.content-box-mode {
  box-sizing: ${sizing === 'content-box' ? 'content-box' : 'border-box'};
}

.border-box-mode {
  box-sizing: ${sizing};
}`);
    } else if (presetId === 'translate-transforms') {
      const x = overrides.transX ?? transX;
      const y = overrides.transY ?? transY;
      const sc = overrides.transScale ?? transScale;
      const rot = overrides.transRotate ?? transRotate;

      setCssCode(`.transform-stage {
  padding: 60px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.card {
  width: 260px;
  height: 160px;
  border-radius: 16px;
  padding: 24px;
}

.card-ghost {
  border: 2px dashed #94a3b8;
  background: rgba(148, 163, 184, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 12px;
  font-family: monospace;
}

.card-active {
  position: absolute;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
  transform: translate3d(${x}px, ${y}px, 0px) scale(${sc}) rotate(${rot}deg);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  cursor: pointer;
  will-change: transform;
}

.card-active h3 {
  margin: 0 0 8px 0;
}

.card-active p {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.badge {
  display: inline-block;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 11px;
}`);
    } else if (presetId === 'keyframe-bounce') {
      const dur = overrides.animDuration ?? animDuration;
      const apx = overrides.bounceApex ?? bounceApex;
      const tf = overrides.timingFunc ?? timingFunc;

      setCssCode(`.bounce-stage {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 40px;
  position: relative;
}

.rubber-orb {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%);
  box-shadow: 0 8px 20px rgba(244, 63, 94, 0.5);
  animation: gravity-bounce ${dur}s ${tf} infinite;
  transform-origin: center bottom;
  will-change: transform;
}

.shadow-disc {
  width: 70px;
  height: 12px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  margin-top: 8px;
  animation: shadow-scale ${dur}s ease-in-out infinite;
  filter: blur(2px);
}

.floor-line {
  width: 240px;
  height: 2px;
  background: #cbd5e1;
  margin-top: -6px;
}

@keyframes gravity-bounce {
  0% {
    transform: translateY(${apx}px) scale(1, 1);
  }
  45% {
    transform: translateY(0px) scale(1.25, 0.75);
  }
  60% {
    transform: translateY(${Math.round(apx * 0.35)}px) scale(0.9, 1.15);
  }
  80% {
    transform: translateY(0px) scale(1.05, 0.95);
  }
  100% {
    transform: translateY(${apx}px) scale(1, 1);
  }
}

@keyframes shadow-scale {
  0%, 100% {
    transform: scale(0.5);
    opacity: 0.2;
  }
  45% {
    transform: scale(1.3);
    opacity: 0.6;
  }
}`);
    } else if (presetId === '3d-flip') {
      const ang = overrides.flipAngle ?? flipAngle;
      const pers = overrides.perspectiveVal ?? perspectiveVal;
      const spd = overrides.flipSpeed ?? flipSpeed;

      setCssCode(`.scene {
  perspective: ${pers}px;
  padding: 40px;
  display: flex;
  justify-content: center;
}

.flip-card {
  width: 260px;
  height: 180px;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateY(${ang}deg);
  transition: transform ${spd}s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-front {
  background: #3b82f6;
  color: white;
}

.card-back {
  background: #0f172a;
  color: #38bdf8;
  transform: rotateY(180deg);
}`);
    } else if (presetId === 'glassmorphism') {
      const blr = overrides.glassBlur ?? glassBlur;
      const opc = overrides.glassOpacity ?? glassOpacity;
      const rad = overrides.glassRadius ?? glassRadius;

      setCssCode(`.glass-scene {
  position: relative;
  min-height: 320px;
  background: #0f172a;
  padding: 40px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-blob {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  filter: blur(40px);
}

.blob-1 {
  background: #ec4899;
  top: 40px;
  left: 20%;
}

.blob-2 {
  background: #3b82f6;
  bottom: 40px;
  right: 20%;
}

.glass-card {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, ${opc});
  backdrop-filter: blur(${blr}px);
  -webkit-backdrop-filter: blur(${blr}px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${rad}px;
  padding: 32px;
  max-width: 320px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.glass-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 12px;
}`);
    } else if (presetId === 'container-queries') {
      const w = overrides.containerWidth ?? containerWidth;

      setCssCode(`.resizable-wrapper {
  resize: horizontal;
  overflow: auto;
  border: 2px dashed #94a3b8;
  padding: 16px;
  max-width: ${w}px;
  margin: 0 auto;
}

.card-container {
  container-type: inline-size;
}

.product-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 16px;
}

.product-badge {
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  align-self: flex-start;
}

/* Switches to row when container exceeds 400px! */
@container (min-width: 400px) {
  .product-card {
    flex-direction: row;
    align-items: center;
  }
}`);
    } else if (presetId === 'clamp-fluid') {
      const sw = overrides.fluidStageWidth ?? fluidStageWidth;

      setCssCode(`.fluid-stage {
  padding: clamp(16px, 5vw, 64px);
  background: #f8fafc;
  text-align: center;
  max-width: ${sw}px;
  margin: 0 auto;
}

.fluid-headline {
  /* Scales between 24px and 56px based on 5vw */
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16px;
}

.fluid-body {
  font-size: clamp(0.875rem, 1.5vw + 0.5rem, 1.25rem);
  color: #475569;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}`);
    }
  };

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const currentPreset = PRESETS.find((p) => p.id === activePreset) || PRESETS[0];

  const fullPreviewDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: ${previewBg === 'dark' ? '#09090b' : '#ffffff'};
      color: ${previewBg === 'dark' ? '#f4f4f5' : '#0f172a'};
      min-height: 100vh;
    }
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
</body>
</html>`;
  }, [cssCode, htmlCode, previewBg]);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-4 py-2">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
              <FlaskConical className="h-4 w-4" />
              <span>CSS Tinker Lab · Live Playground</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Interactive CSS Sandbox
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tinker with modern CSS properties in real-time. Drag range bars, click buttons, or edit code directly!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadPreset(currentPreset)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
              title="Reset code to default preset"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>

            <button
              onClick={copyCss}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy CSS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Selector Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            Interactive Presets:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors shrink-0 text-left flex items-center gap-2',
                  activePreset === p.id
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* QUICK TINKER RANGE BARS & BUTTONS CONTROLS */}
        {/* ======================================================== */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Live Property Tinker Bar:</span>
              <span className="text-primary font-semibold">{currentPreset.name}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              ⚡ Moving sliders or clicking buttons regenerates CSS &amp; live preview instantly
            </span>
          </div>

          {/* PRESET 1: FLEXBOX CONTROLS */}
          {activePreset === 'flexbox' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* flex-direction */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    flex-direction
                  </label>
                  <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-0.5 text-xs">
                    {(['row', 'column', 'row-reverse'] as const).map((dir) => (
                      <button
                        key={dir}
                        onClick={() => {
                          setFlexDir(dir);
                          applyTinkerToCss('flexbox', { flexDir: dir });
                        }}
                        className={cn(
                          'flex-1 py-1 rounded text-center transition-all font-mono',
                          flexDir === dir
                            ? 'bg-white dark:bg-slate-800 text-primary font-bold shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        )}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                </div>

                {/* justify-content */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    justify-content (Main Axis)
                  </label>
                  <select
                    value={flexJustify}
                    onChange={(e) => {
                      const v = e.target.value as any;
                      setFlexJustify(v);
                      applyTinkerToCss('flexbox', { flexJustify: v });
                    }}
                    className="w-full text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="space-between">space-between</option>
                    <option value="center">center</option>
                    <option value="flex-start">flex-start</option>
                    <option value="flex-end">flex-end</option>
                    <option value="space-evenly">space-evenly</option>
                  </select>
                </div>

                {/* align-items */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    align-items (Cross Axis)
                  </label>
                  <select
                    value={flexAlign}
                    onChange={(e) => {
                      const v = e.target.value as any;
                      setFlexAlign(v);
                      applyTinkerToCss('flexbox', { flexAlign: v });
                    }}
                    className="w-full text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="stretch">stretch</option>
                    <option value="center">center</option>
                    <option value="flex-start">flex-start</option>
                    <option value="flex-end">flex-end</option>
                  </select>
                </div>
              </div>

              {/* Sliders: gap & padding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">gap</span>
                    <span className="font-mono text-primary font-bold">{flexGap}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={48}
                    value={flexGap}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFlexGap(v);
                      applyTinkerToCss('flexbox', { flexGap: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">padding</span>
                    <span className="font-mono text-primary font-bold">{flexPadding}px</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={48}
                    value={flexPadding}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFlexPadding(v);
                      applyTinkerToCss('flexbox', { flexPadding: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRESET 2: GRID CONTROLS */}
          {activePreset === 'grid' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    grid-template-columns
                  </label>
                  <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-0.5 text-xs">
                    {[
                      { label: '3 Columns (1fr)', val: 'repeat(3, 1fr)' },
                      { label: 'auto-fit (Responsive)', val: 'repeat(auto-fit, minmax(180px, 1fr))' },
                      { label: 'Sidebar + Main', val: '200px 1fr' },
                    ].map((g) => (
                      <button
                        key={g.val}
                        onClick={() => {
                          setGridTemplate(g.val);
                          applyTinkerToCss('grid', { gridTemplate: g.val });
                        }}
                        className={cn(
                          'flex-1 py-1 rounded text-center transition-all font-mono truncate px-2',
                          gridTemplate === g.val
                            ? 'bg-white dark:bg-slate-800 text-primary font-bold shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    align-items
                  </label>
                  <select
                    value={gridAlign}
                    onChange={(e) => {
                      const v = e.target.value;
                      setGridAlign(v);
                      applyTinkerToCss('grid', { gridAlign: v });
                    }}
                    className="w-full text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="stretch">stretch</option>
                    <option value="center">center</option>
                    <option value="start">start</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">grid gap</span>
                  <span className="font-mono text-primary font-bold">{gridGap}px</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={40}
                  value={gridGap}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setGridGap(v);
                    applyTinkerToCss('grid', { gridGap: v });
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* PRESET 3: BOX MODEL CONTROLS */}
          {activePreset === 'box-model' && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    box-sizing Mode
                  </label>
                  <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-0.5 text-xs max-w-xs">
                    {(['border-box', 'content-box'] as const).map((bs) => (
                      <button
                        key={bs}
                        onClick={() => {
                          setBoxSizing(bs);
                          applyTinkerToCss('box-model', { boxSizing: bs });
                        }}
                        className={cn(
                          'flex-1 py-1 rounded text-center transition-all font-mono',
                          boxSizing === bs
                            ? 'bg-white dark:bg-slate-800 text-primary font-bold shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        )}
                      >
                        {bs}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 max-w-sm">
                  💡 <strong>border-box</strong> retains fixed width (200px) when padding/border grow.
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">padding</span>
                    <span className="font-mono text-primary font-bold">{boxPadding}px</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={48}
                    value={boxPadding}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setBoxPadding(v);
                      applyTinkerToCss('box-model', { boxPadding: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">border</span>
                    <span className="font-mono text-primary font-bold">{boxBorder}px</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={16}
                    value={boxBorder}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setBoxBorder(v);
                      applyTinkerToCss('box-model', { boxBorder: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">outline-offset</span>
                    <span className="font-mono text-emerald-600 font-bold">{boxOutlineOffset}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={16}
                    value={boxOutlineOffset}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setBoxOutlineOffset(v);
                      applyTinkerToCss('box-model', { boxOutlineOffset: v });
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">border-radius</span>
                    <span className="font-mono text-primary font-bold">{boxRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={32}
                    value={boxRadius}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setBoxRadius(v);
                      applyTinkerToCss('box-model', { boxRadius: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRESET 4: TRANSFORMS & TRANSLATE CONTROLS */}
          {activePreset === 'translate-transforms' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">translateX</span>
                    <span className="font-mono text-primary font-bold">{transX}px</span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    value={transX}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setTransX(v);
                      applyTinkerToCss('translate-transforms', { transX: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">translateY</span>
                    <span className="font-mono text-primary font-bold">{transY}px</span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    value={transY}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setTransY(v);
                      applyTinkerToCss('translate-transforms', { transY: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">scale</span>
                    <span className="font-mono text-primary font-bold">{transScale}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.7}
                    max={1.4}
                    step={0.05}
                    value={transScale}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setTransScale(v);
                      applyTinkerToCss('translate-transforms', { transScale: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">rotate</span>
                    <span className="font-mono text-primary font-bold">{transRotate}°</span>
                  </div>
                  <input
                    type="range"
                    min={-45}
                    max={45}
                    value={transRotate}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setTransRotate(v);
                      applyTinkerToCss('translate-transforms', { transRotate: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRESET 5: KINETIC SQUASH & STRETCH ANIMATION */}
          {activePreset === 'keyframe-bounce' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">animation-duration</span>
                    <span className="font-mono text-primary font-bold">{animDuration}s</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={3.0}
                    step={0.1}
                    value={animDuration}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setAnimDuration(v);
                      applyTinkerToCss('keyframe-bounce', { animDuration: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">bounce height (apex)</span>
                    <span className="font-mono text-primary font-bold">{bounceApex}px</span>
                  </div>
                  <input
                    type="range"
                    min={-160}
                    max={-50}
                    value={bounceApex}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setBounceApex(v);
                      applyTinkerToCss('keyframe-bounce', { bounceApex: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    timing-function
                  </label>
                  <select
                    value={timingFunc}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTimingFunc(v);
                      applyTinkerToCss('keyframe-bounce', { timingFunc: v });
                    }}
                    className="w-full text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="cubic-bezier(0.34, 1.56, 0.64, 1)">cubic-bezier (Elastic Bounce)</option>
                    <option value="ease-in-out">ease-in-out</option>
                    <option value="linear">linear</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PRESET 6: 3D CARD FLIP */}
          {activePreset === '3d-flip' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">rotateY (Flip Angle)</span>
                    <span className="font-mono text-primary font-bold">{flipAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={180}
                    value={flipAngle}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFlipAngle(v);
                      applyTinkerToCss('3d-flip', { flipAngle: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0° (Front)</span>
                    <span>180° (Back)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">perspective</span>
                    <span className="font-mono text-primary font-bold">{perspectiveVal}px</span>
                  </div>
                  <input
                    type="range"
                    min={400}
                    max={1600}
                    step={50}
                    value={perspectiveVal}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPerspectiveVal(v);
                      applyTinkerToCss('3d-flip', { perspectiveVal: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">transition duration</span>
                    <span className="font-mono text-primary font-bold">{flipSpeed}s</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={1.5}
                    step={0.1}
                    value={flipSpeed}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFlipSpeed(v);
                      applyTinkerToCss('3d-flip', { flipSpeed: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRESET 7: GLASSMORPHISM */}
          {activePreset === 'glassmorphism' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">backdrop-filter: blur</span>
                    <span className="font-mono text-primary font-bold">{glassBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={glassBlur}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setGlassBlur(v);
                      applyTinkerToCss('glassmorphism', { glassBlur: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">background opacity</span>
                    <span className="font-mono text-primary font-bold">{glassOpacity}</span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={0.5}
                    step={0.05}
                    value={glassOpacity}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setGlassOpacity(v);
                      applyTinkerToCss('glassmorphism', { glassOpacity: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">border-radius</span>
                    <span className="font-mono text-primary font-bold">{glassRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={36}
                    value={glassRadius}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setGlassRadius(v);
                      applyTinkerToCss('glassmorphism', { glassRadius: v });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRESET 8: CONTAINER QUERIES */}
          {activePreset === 'container-queries' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs items-center">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Parent Container Width (triggers @container at 400px):
                </span>
                <span className="font-mono text-primary font-bold">{containerWidth}px</span>
              </div>
              <input
                type="range"
                min={280}
                max={600}
                value={containerWidth}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setContainerWidth(v);
                  applyTinkerToCss('container-queries', { containerWidth: v });
                }}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>&lt; 400px: Stacked Column Mode</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {containerWidth >= 400 ? '✅ Horizontal Row Mode (@container Triggered!)' : '⏳ Stacked Mode'}
                </span>
                <span>&gt; 400px: Row Mode</span>
              </div>
            </div>
          )}

          {/* PRESET 9: FLUID CLAMP */}
          {activePreset === 'clamp-fluid' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs items-center">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Simulated Stage Width (observe fluid clamp() scaling without media queries):
                </span>
                <span className="font-mono text-primary font-bold">{fluidStageWidth}px</span>
              </div>
              <input
                type="range"
                min={320}
                max={1000}
                value={fluidStageWidth}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setFluidStageWidth(v);
                  applyTinkerToCss('clamp-fluid', { fluidStageWidth: v });
                }}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Narrow (1.5rem minimum)</span>
                <span className="text-primary font-semibold">Scaling smoothly via clamp()</span>
                <span>Wide (3.5rem maximum)</span>
              </div>
            </div>
          )}
        </div>

        {/* Workspace: Left Editor, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column (6 cols): Editor */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] overflow-hidden shadow-sm flex flex-col">
            {/* Editor Toolbar with Tabs */}
            <div className="h-10 bg-slate-100 dark:bg-[#18181b] border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-3 text-xs font-mono">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('css')}
                  className={cn(
                    'px-3 py-1 rounded-md transition-colors flex items-center gap-1.5',
                    activeTab === 'css'
                      ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 font-bold border border-slate-200 dark:border-transparent shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                  )}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>styles.css</span>
                </button>

                <button
                  onClick={() => setActiveTab('html')}
                  className={cn(
                    'px-3 py-1 rounded-md transition-colors flex items-center gap-1.5',
                    activeTab === 'html'
                      ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-bold border border-slate-200 dark:border-transparent shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                  )}
                >
                  <Layout className="h-3.5 w-3.5" />
                  <span>index.html</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 dark:text-zinc-500">Live Hot-Reload</span>
            </div>

            {/* Monaco Editor */}
            <div className="h-[480px] sm:h-[540px]">
              {activeTab === 'css' ? (
                <Editor
                  height="100%"
                  language="css"
                  value={cssCode}
                  onChange={(val) => setCssCode(val || '')}
                  theme={monacoTheme}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    padding: { top: 12 },
                  }}
                />
              ) : (
                <Editor
                  height="100%"
                  language="html"
                  value={htmlCode}
                  onChange={(val) => setHtmlCode(val || '')}
                  theme={monacoTheme}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    padding: { top: 12 },
                  }}
                />
              )}
            </div>
          </div>

          {/* Right Column (6 cols): Preview Frame with Viewport Switcher */}
          <div className="lg:col-span-6 space-y-2 flex flex-col">
            {/* Viewport Control Bar */}
            <div className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-3 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  Viewport:
                </span>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setViewportWidth('100%')}
                    className={cn(
                      'px-2 py-1 rounded text-xs flex items-center gap-1 font-mono transition-colors',
                      viewportWidth === '100%'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                    title="Desktop 100%"
                  >
                    <Monitor className="h-3 w-3" />
                    <span>Full</span>
                  </button>

                  <button
                    onClick={() => setViewportWidth('768px')}
                    className={cn(
                      'px-2 py-1 rounded text-xs flex items-center gap-1 font-mono transition-colors',
                      viewportWidth === '768px'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                    title="Tablet 768px"
                  >
                    <Tablet className="h-3 w-3" />
                    <span>768px</span>
                  </button>

                  <button
                    onClick={() => setViewportWidth('375px')}
                    className={cn(
                      'px-2 py-1 rounded text-xs flex items-center gap-1 font-mono transition-colors',
                      viewportWidth === '375px'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                    title="Mobile 375px"
                  >
                    <Smartphone className="h-3 w-3" />
                    <span>375px</span>
                  </button>
                </div>
              </div>

              {/* Theme toggle for preview body */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewBg(previewBg === 'light' ? 'dark' : 'light')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-mono"
                  title="Toggle preview background"
                >
                  {previewBg === 'light' ? (
                    <>
                      <Moon className="h-3 w-3" />
                      <span>Dark Stage</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-3 w-3" />
                      <span>Light Stage</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 overflow-x-auto min-h-[500px] flex justify-center">
              <div
                style={{ width: viewportWidth }}
                className="h-[480px] sm:h-[500px] bg-white rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300"
              >
                <iframe
                  title="CSS Tinker Sandbox"
                  srcDoc={fullPreviewDoc}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
