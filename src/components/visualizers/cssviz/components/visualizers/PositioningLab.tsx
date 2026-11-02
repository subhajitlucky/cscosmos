'use client';

import { useMemo, useState } from 'react';
import VisualizerPanel from './VisualizerPanel';
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl';
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl';
import SwitchControl from '@/components/visualizers/cssviz/components/controls/SwitchControl';
import ToggleGroup from '@/components/visualizers/cssviz/components/controls/ToggleGroup';
import { Layers, Move, Compass, Eye, ScrollText, Zap, Maximize } from 'lucide-react';
import { cn } from '../../utils/cn';

type PositionMode = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
type TransformOrigin = 'center center' | 'top left' | 'top right' | 'bottom left' | 'bottom right' | '50% 0%';

export default function PositioningLab() {
  const [activeTab, setActiveTab] = useState<'positioning' | 'transforms'>('positioning');

  // Positioning State
  const [posMode, setPosMode] = useState<PositionMode>('relative');
  const [topOffset, setTopOffset] = useState<number>(24);
  const [leftOffset, setLeftOffset] = useState<number>(32);
  const [zIndex, setZIndex] = useState<number>(2);
  const [parentRelative, setParentRelative] = useState<boolean>(true);
  const [showGhost, setShowGhost] = useState<boolean>(true);

  // Transform / Translate State
  const [translateX, setTranslateX] = useState<number>(40);
  const [translateY, setTranslateY] = useState<number>(-20);
  const [rotateDeg, setRotateDeg] = useState<number>(12);
  const [scaleVal, setScaleVal] = useState<number>(1.05);
  const [skewXVal, setSkewXVal] = useState<number>(0);
  const [skewYVal, setSkewYVal] = useState<number>(0);
  const [origin, setOrigin] = useState<TransformOrigin>('center center');

  // Reset helper
  const handleReset = () => {
    if (activeTab === 'positioning') {
      setPosMode('relative');
      setTopOffset(24);
      setLeftOffset(32);
      setZIndex(2);
      setParentRelative(true);
      setShowGhost(true);
    } else {
      setTranslateX(40);
      setTranslateY(-20);
      setRotateDeg(12);
      setScaleVal(1.05);
      setSkewXVal(0);
      setSkewYVal(0);
      setOrigin('center center');
    }
  };

  const cssOutput = useMemo(() => {
    if (activeTab === 'transforms') {
      return `/* CSS Transform & Translate Experiment */
.transformed-box {
  /* 2D Transform combines translate, rotate, scale, skew */
  transform: translate(${translateX}px, ${translateY}px) rotate(${rotateDeg}deg) scale(${scaleVal}) skew(${skewXVal}deg, ${skewYVal}deg);
  transform-origin: ${origin};

  /* GPU Compositing layer (does not trigger layout reflow!) */
  will-change: transform;
}

/* Notice: The normal document flow remains reserved where the ghost box sits.
   Transforms do NOT push or reflow adjacent sibling elements! */`;
    }

    // Positioning CSS Output
    let code = `/* Container Context */
.stage-container {
  position: ${parentRelative ? 'relative' : 'static'}; /* Containing block */
}

/* Positioned Element */
.target-card {
  position: ${posMode};`;

    if (posMode !== 'static') {
      code += `
  top: ${topOffset}px;
  left: ${leftOffset}px;
  z-index: ${zIndex};`;
    }

    if (posMode === 'absolute') {
      code += `\n  /* Removed from normal document flow: 0 space reserved! */`;
    } else if (posMode === 'relative') {
      code += `\n  /* Remains in normal flow: offset is purely visual! */`;
    } else if (posMode === 'sticky') {
      code += `\n  /* Toggles between relative and fixed based on scroll position */`;
    }

    code += `\n}`;
    return code;
  }, [
    activeTab,
    leftOffset,
    origin,
    parentRelative,
    posMode,
    rotateDeg,
    scaleVal,
    skewXVal,
    skewYVal,
    topOffset,
    translateX,
    translateY,
    zIndex,
  ]);

  const tasks =
    activeTab === 'positioning'
      ? [
          'Switch between static and relative: Notice offsets (top/left) only take effect when not static.',
          'Choose absolute and toggle "Parent has position: relative": Watch the box escape to the outer viewport when parent is static!',
          'Select sticky and scroll inside the preview stage to see it stick once reaching top: 24px.',
          'Adjust z-index to see the card dive underneath or rise above sibling elements.',
        ]
      : [
          'Drag Translate X and Y: Notice the ghost dashed outline remains locked in document flow while the card floats freely on the GPU compositor.',
          'Change transform-origin from center to "top left" and watch rotation pivot around that corner.',
          'Combine translate + rotate + scale to create dynamic 2D motion without triggering CPU browser reflows.',
        ];

  return (
    <VisualizerPanel
      title="Positioning & Transforms Studio"
      description="Master the vital difference between CSS Positioning (normal flow offsets) and CSS Transforms (GPU-accelerated translate, scale, and rotate)."
      cssOutput={cssOutput}
      tasks={tasks}
      badge={activeTab === 'positioning' ? 'CSS Positioning & Flow' : 'CSS Transforms & GPU Translate'}
      onReset={handleReset}
      controls={
        <div className="space-y-4">
          {/* Tab Switcher */}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('positioning')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md font-semibold transition-all',
                activeTab === 'positioning'
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              )}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Position & Offsets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transforms')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md font-semibold transition-all',
                activeTab === 'transforms'
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              )}
            >
              <Move className="w-3.5 h-3.5" />
              <span>Translate & Transforms</span>
            </button>
          </div>

          {activeTab === 'positioning' ? (
            /* TAB 1: POSITIONING CONTROLS */
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  position Property
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['static', 'relative', 'absolute', 'sticky', 'fixed'] as PositionMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPosMode(mode)}
                      className={cn(
                        'py-1.5 px-2 text-center rounded-lg border text-xs font-mono transition-all',
                        posMode === mode
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {posMode !== 'static' && (
                <>
                  <SliderControl
                    label="Top Offset (top)"
                    value={topOffset}
                    min={-40}
                    max={120}
                    step={2}
                    onChange={setTopOffset}
                    suffix="px"
                  />

                  <SliderControl
                    label="Left Offset (left)"
                    value={leftOffset}
                    min={-40}
                    max={140}
                    step={2}
                    onChange={setLeftOffset}
                    suffix="px"
                  />

                  <SliderControl
                    label="Stacking Order (z-index)"
                    value={zIndex}
                    min={-1}
                    max={8}
                    step={1}
                    onChange={setZIndex}
                  />

                  {posMode === 'absolute' && (
                    <SwitchControl
                      label="Parent has position: relative (Containing Block)"
                      checked={parentRelative}
                      onChange={setParentRelative}
                    />
                  )}

                  <SwitchControl
                    label="Show Normal-Flow Ghost Footprint"
                    checked={showGhost}
                    onChange={setShowGhost}
                  />
                </>
              )}

              {/* Behavior Note */}
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-800 dark:text-amber-300">
                {posMode === 'static' && 'Static elements ignore top/left/right/bottom/z-index. They follow strict normal document flow.'}
                {posMode === 'relative' && 'Relative elements keep their footprint in the document layout, but shift visually relative to where they would naturally be.'}
                {posMode === 'absolute' && (parentRelative ? 'Absolute elements are removed from normal flow and positioned relative to the nearest positioned ancestor (the stage).' : '🚨 Parent is static! The element ignores the stage box and positions itself relative to the entire document viewport!')}
                {posMode === 'sticky' && 'Sticky elements act as relative until the scroll container reaches the top offset threshold, then stick like fixed!'}
                {posMode === 'fixed' && 'Fixed elements are pinned directly to the viewport window, unaffected by scrolling.'}
              </div>
            </div>
          ) : (
            /* TAB 2: TRANSFORMS & TRANSLATE CONTROLS */
            <div className="space-y-3.5">
              <SliderControl
                label="Translate X (translateX)"
                value={translateX}
                min={-120}
                max={120}
                step={2}
                onChange={setTranslateX}
                suffix="px"
              />

              <SliderControl
                label="Translate Y (translateY)"
                value={translateY}
                min={-120}
                max={120}
                step={2}
                onChange={setTranslateY}
                suffix="px"
              />

              <SliderControl
                label="Rotate (rotate)"
                value={rotateDeg}
                min={-180}
                max={180}
                step={2}
                onChange={setRotateDeg}
                suffix="°"
              />

              <SliderControl
                label="Scale (scale)"
                value={scaleVal}
                min={0.4}
                max={1.8}
                step={0.05}
                onChange={setScaleVal}
                suffix="x"
              />

              <div className="grid grid-cols-2 gap-2">
                <SliderControl
                  label="Skew X"
                  value={skewXVal}
                  min={-35}
                  max={35}
                  step={1}
                  onChange={setSkewXVal}
                  suffix="°"
                />
                <SliderControl
                  label="Skew Y"
                  value={skewYVal}
                  min={-35}
                  max={35}
                  step={1}
                  onChange={setSkewYVal}
                  suffix="°"
                />
              </div>

              <SelectControl
                label="Transform Origin (Pivot Point)"
                value={origin}
                onChange={(v) => setOrigin(v as TransformOrigin)}
                options={[
                  { label: 'center center (Default centroid)', value: 'center center' },
                  { label: 'top left (Anchor top-left corner)', value: 'top left' },
                  { label: 'top right (Anchor top-right corner)', value: 'top right' },
                  { label: 'bottom left (Anchor bottom-left corner)', value: 'bottom left' },
                  { label: 'bottom right (Anchor bottom-right corner)', value: 'bottom right' },
                  { label: '50% 0% (Top Center)', value: '50% 0%' },
                ]}
              />

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
                ⚡ <strong>Translate vs Top/Left:</strong> <code>transform: translate()</code> is executed by the GPU Compositor thread at 60/120fps with zero layout reflow!
              </div>
            </div>
          )}
        </div>
      }
      preview={
        <div className="space-y-4">
          {activeTab === 'positioning' ? (
            /* TAB 1: POSITIONING PREVIEW STAGE */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  Mode: <strong className="text-primary">{posMode}</strong>
                  {posMode !== 'static' && ` · top: ${topOffset}px, left: ${leftOffset}px, z-index: ${zIndex}`}
                </span>
                <span className="text-[11px] text-slate-500">
                  {posMode === 'sticky' ? '📜 Scroll inside the box below!' : 'Interactive Canvas'}
                </span>
              </div>

              {/* Scrollable Stage to demonstrate sticky and normal flow */}
              <div
                className={cn(
                  'h-[340px] overflow-y-auto rounded-xl border border-slate-300 dark:border-slate-700 p-4 transition-all',
                  parentRelative ? 'relative bg-slate-50 dark:bg-slate-950' : 'static bg-amber-500/5'
                )}
                style={{
                  position: parentRelative ? 'relative' : 'static',
                }}
              >
                {/* Stage watermark */}
                <div className="absolute top-2 right-3 font-mono text-[10px] text-slate-400 pointer-events-none uppercase tracking-wider">
                  Containing Block: {parentRelative ? 'position: relative' : 'position: static'}
                </div>

                {/* Sibling Card 1 (In Flow) */}
                <div className="mb-4 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Sibling Block 1 (Normal Flow)</span>
                  <span className="font-mono text-[10px] text-slate-400">static · z-index: 1</span>
                </div>

                {/* Normal Flow Ghost Indicator */}
                {showGhost && posMode !== 'static' && (
                  <div className="relative border-2 border-dashed border-primary/40 bg-primary/5 rounded-xl p-4 text-xs font-mono text-primary flex items-center justify-between mb-4">
                    <span>👻 Ghost: Space reserved in normal document flow</span>
                    <span className="text-[10px] uppercase">
                      {posMode === 'absolute' || posMode === 'fixed' ? 'Collapsed in reality' : 'Occupied'}
                    </span>
                  </div>
                )}

                {/* Target Positioned Element */}
                <div
                  className={cn(
                    'p-4 rounded-xl shadow-lg text-white font-medium text-xs flex flex-col gap-1 transition-all cursor-move select-none',
                    posMode === 'static' && 'bg-slate-700 dark:bg-slate-800 mb-4',
                    posMode === 'relative' && 'bg-blue-600 dark:bg-blue-500 mb-4',
                    posMode === 'absolute' && 'bg-purple-600 dark:bg-purple-500',
                    posMode === 'sticky' && 'bg-emerald-600 dark:bg-emerald-500 mb-4',
                    posMode === 'fixed' && 'bg-rose-600 dark:bg-rose-500'
                  )}
                  style={{
                    position: posMode,
                    top: posMode !== 'static' ? `${topOffset}px` : undefined,
                    left: posMode !== 'static' ? `${leftOffset}px` : undefined,
                    zIndex: posMode !== 'static' ? zIndex : undefined,
                    width: posMode === 'absolute' || posMode === 'fixed' ? '220px' : 'auto',
                  }}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>Target Box ({posMode})</span>
                    <span className="font-mono text-[10px] bg-black/25 px-1.5 py-0.5 rounded">
                      z: {posMode !== 'static' ? zIndex : 'auto'}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-tight">
                    {posMode === 'static' && 'Locked in standard block flow.'}
                    {posMode === 'relative' && `Shifted (${topOffset}px, ${leftOffset}px) from original slot.`}
                    {posMode === 'absolute' && `Anchored to ${parentRelative ? 'stage container' : 'viewport window'}.`}
                    {posMode === 'sticky' && `Sticks once top reaches ${topOffset}px during scroll!`}
                    {posMode === 'fixed' && 'Locked onto screen coordinates.'}
                  </p>
                </div>

                {/* Sibling Card 2 (In Flow) */}
                <div className="mb-4 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Sibling Block 2 (Normal Flow)</span>
                  <span className="font-mono text-[10px] text-slate-400">static · z-index: 1</span>
                </div>

                {/* Filler blocks to enable scrolling for sticky */}
                <div className="space-y-3 pt-2">
                  {[3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500"
                    >
                      Scroll content filler {i} (Scroll me to see sticky anchor!)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: TRANSFORMS & TRANSLATE STAGE */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  transform: <strong className="text-primary">translate({translateX}px, {translateY}px) rotate({rotateDeg}deg)</strong>
                </span>
                <span className="font-mono text-[11px] text-slate-500">origin: {origin}</span>
              </div>

              {/* Transform Stage */}
              <div className="relative min-h-[340px] flex items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden p-8">
                {/* Coordinate Grid Background */}
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #3b82f6 1px, transparent 1px), radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Natural Document Flow Parent */}
                <div className="relative flex flex-col items-center">
                  {/* Ghost Box (Exact layout reservation in flow) */}
                  <div className="w-56 h-36 rounded-2xl border-2 border-dashed border-slate-400 dark:border-slate-600 bg-slate-200/40 dark:bg-slate-800/40 flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Ghost DOM Slot</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">
                      Space strictly reserved in document layout!
                    </span>
                  </div>

                  {/* Transformed Element Overlay */}
                  <div
                    className="absolute inset-0 w-56 h-36 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white p-4 shadow-2xl flex flex-col justify-between cursor-pointer select-none transition-transform duration-75"
                    style={{
                      transform: `translate(${translateX}px, ${translateY}px) rotate(${rotateDeg}deg) scale(${scaleVal}) skew(${skewXVal}deg, ${skewYVal}deg)`,
                      transformOrigin: origin,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Move className="w-3.5 h-3.5" />
                        <span>GPU Transformed</span>
                      </div>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                        {scaleVal}x
                      </span>
                    </div>

                    <div className="font-mono text-[11px] bg-black/30 p-1.5 rounded space-y-0.5">
                      <div>ΔX: {translateX}px · ΔY: {translateY}px</div>
                      <div>∠: {rotateDeg}°</div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] opacity-80">
                      <span>Origin: {origin}</span>
                      <span>No Reflow</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transform Metrics Card */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Translation</div>
                  <div className="font-bold text-primary mt-0.5">X: {translateX}px, Y: {translateY}px</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Rotation & Scale</div>
                  <div className="font-bold text-indigo-500 mt-0.5">{rotateDeg}° · {scaleVal}x</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Compositor</div>
                  <div className="font-bold text-emerald-500 mt-0.5">60 FPS Hardware Layer</div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
