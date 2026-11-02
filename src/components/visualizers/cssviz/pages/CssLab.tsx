'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { cn } from '../utils/cn';

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
  outline-offset: 6px; /* Non-reflowing visual halo outside border */
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
    <p>Hover to activate dynamic 3D translate and scale elevation!</p>
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
  /* GPU Compositor Transition */
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  cursor: pointer;
  will-change: transform;
}

.card-active:hover {
  /* Translate lifts up 16px and scales 1.05x with subtle 2deg rotation */
  transform: translate3d(0, -16px, 0) scale(1.05) rotate(-1.5deg);
  box-shadow: 0 25px 35px -5px rgba(99, 102, 241, 0.6);
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
    transform: translateY(0px) scale(1.25, 0.75); /* Squash on impact */
  }
  60% {
    transform: translateY(-40px) scale(0.9, 1.15); /* Stretch ascending */
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
      <h2>Hover to Flip</h2>
      <p>Front side of 3D plane</p>
    </div>
    <div class="card-face card-back">
      <h2>Secret Revealed</h2>
      <p>Rotated 180 degrees in Z-space</p>
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
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.scene:hover .flip-card {
  transform: rotateY(180deg);
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
  max-width: 100%;
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
  <p class="fluid-body">Resize the preview window to observe text dynamically scaling without any abrupt media query jumps.</p>
</div>`,
    css: `.fluid-stage {
  padding: clamp(16px, 5vw, 64px);
  background: #f8fafc;
  text-align: center;
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
  const [activePreset, setActivePreset] = useState<string>('flexbox');
  const [activeTab, setActiveTab] = useState<'css' | 'html'>('css');
  const [cssCode, setCssCode] = useState<string>(PRESETS[0].css);
  const [htmlCode, setHtmlCode] = useState<string>(PRESETS[0].html);
  const [viewportWidth, setViewportWidth] = useState<'100%' | '768px' | '375px'>('100%');
  const [previewBg, setPreviewBg] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState<boolean>(false);

  const loadPreset = (preset: Preset) => {
    setActivePreset(preset.id);
    setCssCode(preset.css);
    setHtmlCode(preset.html);
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
              Tinker with modern CSS properties in real-time. Switch presets, tweak values, and test across device viewports.
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

        {/* Workspace: Left Editor, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column (6 cols): Editor */}
          <div className="lg:col-span-6 rounded-xl border border-border bg-[#1e1e1e] overflow-hidden shadow-sm flex flex-col">
            {/* Editor Toolbar with Tabs */}
            <div className="h-10 bg-[#18181b] border-b border-zinc-800 flex items-center justify-between px-3 text-xs font-mono">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('css')}
                  className={cn(
                    'px-3 py-1 rounded-md transition-colors flex items-center gap-1.5',
                    activeTab === 'css'
                      ? 'bg-zinc-800 text-amber-400 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
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
                      ? 'bg-zinc-800 text-blue-400 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  )}
                >
                  <Layout className="h-3.5 w-3.5" />
                  <span>index.html</span>
                </button>
              </div>

              <span className="text-[11px] text-zinc-500">Live Hot-Reload</span>
            </div>

            {/* Monaco Editor */}
            <div className="h-[480px] sm:h-[540px]">
              {activeTab === 'css' ? (
                <Editor
                  height="100%"
                  language="css"
                  value={cssCode}
                  onChange={(val) => setCssCode(val || '')}
                  theme="vs-dark"
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
                  theme="vs-dark"
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
                        ? 'bg-surface text-slate-900 dark:text-white font-bold shadow-xs'
                        : 'text-muted-text hover:text-slate-900 dark:hover:text-white'
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
                        ? 'bg-surface text-slate-900 dark:text-white font-bold shadow-xs'
                        : 'text-muted-text hover:text-slate-900 dark:hover:text-white'
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface text-muted-text hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-mono"
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
