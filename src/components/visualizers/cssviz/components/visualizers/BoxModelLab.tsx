'use client';

import { useMemo, useState } from 'react';
import VisualizerPanel from './VisualizerPanel';
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl';
import SwitchControl from '@/components/visualizers/cssviz/components/controls/SwitchControl';
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl';
import ToggleGroup from '@/components/visualizers/cssviz/components/controls/ToggleGroup';
import { cn } from '../../utils/cn';
import { Box, Layers, Maximize2, Minimize2, SplitSquareVertical } from 'lucide-react';

const BoxModelLab = () => {
  const [activeTab, setActiveTab] = useState<'sizing' | 'collapsing'>('sizing');

  // Box Sizing state
  const [boxWidth, setBoxWidth] = useState(200);
  const [boxHeight, setBoxHeight] = useState(100);
  const [padding, setPadding] = useState(20);
  const [border, setBorder] = useState(4);
  const [borderStyle, setBorderStyle] = useState<'solid' | 'dashed' | 'dotted' | 'double'>('solid');
  const [margin, setMargin] = useState(24);
  const [radius, setRadius] = useState(16);
  const [borderBox, setBorderBox] = useState(true);
  const [showOutline, setShowOutline] = useState(false);
  const [outlineOffset, setOutlineOffset] = useState(6);

  // Margin Collapsing state
  const [marginA, setMarginA] = useState(30);
  const [marginB, setMarginB] = useState(20);
  const [enableBFC, setEnableBFC] = useState(false);

  // Computed math
  const contentWidth = borderBox ? Math.max(20, boxWidth - (padding * 2) - (border * 2)) : boxWidth;
  const contentHeight = borderBox ? Math.max(20, boxHeight - (padding * 2) - (border * 2)) : boxHeight;
  const renderedWidth = borderBox ? boxWidth : boxWidth + (padding * 2) + (border * 2);
  const renderedHeight = borderBox ? boxHeight : boxHeight + (padding * 2) + (border * 2);
  const totalOccupiedWidth = renderedWidth + (margin * 2);
  const totalOccupiedHeight = renderedHeight + (margin * 2);

  const collapsedGap = enableBFC ? marginA + marginB : Math.max(marginA, marginB);

  const cssOutput = useMemo(() => {
    if (activeTab === 'collapsing') {
      return `/* Margin Collapsing Experiment */
.container {
  ${enableBFC ? 'display: flow-root; /* Creates BFC: prevents collapse! */' : '/* Normal block flow: margins collapse */'}
}
.box-a {
  margin-bottom: ${marginA}px;
}
.box-b {
  margin-top: ${marginB}px;
}
/* Effective physical gap between boxes: ${collapsedGap}px ${!enableBFC ? '(Math.max of margins)' : '(Sum of margins)'} */`;
    }

    let out = `.box {
  box-sizing: ${borderBox ? 'border-box' : 'content-box'};
  width: ${boxWidth}px;
  height: ${boxHeight}px;
  padding: ${padding}px;
  border: ${border}px ${borderStyle} #3b82f6;
  border-radius: ${radius}px;
  margin: ${margin}px;`;

    if (showOutline) {
      out += `\n  outline: 3px solid #10b981;\n  outline-offset: ${outlineOffset}px;`;
    }
    out += `\n}`;
    return out;
  }, [activeTab, border, borderBox, borderStyle, boxHeight, boxWidth, collapsedGap, enableBFC, margin, marginA, marginB, outlineOffset, padding, radius, showOutline]);

  const reset = () => {
    setBoxWidth(200);
    setBoxHeight(100);
    setPadding(20);
    setBorder(4);
    setBorderStyle('solid');
    setMargin(24);
    setRadius(16);
    setBorderBox(true);
    setShowOutline(false);
    setMarginA(30);
    setMarginB(20);
    setEnableBFC(false);
  };

  return (
    <VisualizerPanel
      title="Advanced Box Model Studio"
      description="Inspect box-sizing math (content-box vs border-box), test outline-offset, and experiment with vertical margin collapsing."
      cssOutput={cssOutput.trim()}
      onReset={reset}
      controls={
        <div className="space-y-6">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('sizing')}
              className={cn(
                'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all',
                activeTab === 'sizing'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              Box-Sizing Math
            </button>
            <button
              onClick={() => setActiveTab('collapsing')}
              className={cn(
                'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all',
                activeTab === 'collapsing'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              Margin Collapsing
            </button>
          </div>

          {activeTab === 'sizing' ? (
            <div className="space-y-4">
              <SwitchControl label="box-sizing: border-box" checked={borderBox} onChange={setBorderBox} />

              <div className="grid grid-cols-2 gap-3">
                <SliderControl label="Declared Width" value={boxWidth} min={120} max={280} onChange={setBoxWidth} suffix="px" />
                <SliderControl label="Declared Height" value={boxHeight} min={60} max={180} onChange={setBoxHeight} suffix="px" />
              </div>

              <SliderControl label="Padding (All 4 Sides)" value={padding} min={0} max={40} onChange={setPadding} suffix="px" />
              
              <div className="grid grid-cols-2 gap-3">
                <SliderControl label="Border Width" value={border} min={0} max={16} onChange={setBorder} suffix="px" />
                <SliderControl label="Border Radius" value={radius} min={0} max={30} onChange={setRadius} suffix="px" />
              </div>

              <SelectControl
                label="Border Style"
                value={borderStyle}
                onChange={(v) => setBorderStyle(v as any)}
                options={[
                  { label: 'solid', value: 'solid' },
                  { label: 'dashed', value: 'dashed' },
                  { label: 'dotted', value: 'dotted' },
                  { label: 'double', value: 'double' },
                ]}
              />

              <SliderControl label="Margin" value={margin} min={0} max={40} onChange={setMargin} suffix="px" />

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <SwitchControl label="Enable Outline (Zero Layout Impact)" checked={showOutline} onChange={setShowOutline} />
                {showOutline && (
                  <SliderControl label="outline-offset" value={outlineOffset} min={0} max={16} onChange={setOutlineOffset} suffix="px" />
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Vertical margins on adjacent sibling block boxes collapse into a single margin equal to the largest one.
              </p>

              <SliderControl label="Box A: margin-bottom" value={marginA} min={0} max={60} onChange={setMarginA} suffix="px" />
              <SliderControl label="Box B: margin-top" value={marginB} min={0} max={60} onChange={setMarginB} suffix="px" />

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <SwitchControl
                  label="display: flow-root (Prevent Collapse)"
                  checked={enableBFC}
                  onChange={setEnableBFC}
                />
              </div>
            </div>
          )}
        </div>
      }
      preview={
        <div className="flex flex-col gap-4 min-h-[360px] flex-1">
          {activeTab === 'sizing' ? (
            <div className="space-y-4">
              {/* Box Model Layers Visualizer */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-6 flex flex-col items-center justify-center overflow-auto min-h-[280px]">
                {/* Margin Box */}
                <div
                  className="rounded-2xl bg-amber-500/15 border border-dashed border-amber-500/40 p-2 flex flex-col items-center justify-center transition-all"
                  style={{ margin: `${margin}px` }}
                >
                  <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold mb-1">
                    margin: {margin}px
                  </div>

                  {/* Border + Padding + Content Area */}
                  <div
                    className="flex flex-col items-center justify-center text-center transition-all bg-blue-500/20 text-slate-900 dark:text-white"
                    style={{
                      boxSizing: borderBox ? 'border-box' : 'content-box',
                      width: `${boxWidth}px`,
                      height: `${boxHeight}px`,
                      padding: `${padding}px`,
                      border: `${border}px ${borderStyle} #3b82f6`,
                      borderRadius: `${radius}px`,
                      outline: showOutline ? '3px solid #10b981' : 'none',
                      outlineOffset: `${outlineOffset}px`,
                    }}
                  >
                    <div className="w-full h-full rounded bg-emerald-500/30 border border-emerald-500/50 flex flex-col items-center justify-center p-1 text-xs font-mono">
                      <span className="font-bold">Content</span>
                      <span className="text-[10px] opacity-80">
                        {contentWidth} × {contentHeight}px
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Math Tally Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500">Declared (CSS)</div>
                  <div className="font-bold text-slate-900 dark:text-white">{boxWidth} × {boxHeight}px</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500">Content Area</div>
                  <div className="font-bold text-emerald-500">{contentWidth} × {contentHeight}px</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500">Rendered (Width)</div>
                  <div className="font-bold text-blue-500">{renderedWidth}px</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500">Total + Margin</div>
                  <div className="font-bold text-amber-500">{totalOccupiedWidth}px</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-6 flex flex-col items-center justify-center min-h-[320px]">
                <div className="w-64 space-y-0">
                  {/* Sibling Box A */}
                  <div
                    className="p-4 rounded-xl bg-blue-600 text-white font-bold text-xs flex justify-between items-center shadow-md transition-all"
                    style={{ marginBottom: `${marginA}px` }}
                  >
                    <span>Sibling Box A</span>
                    <span className="font-mono text-[10px] bg-black/20 px-1.5 py-0.5 rounded">
                      mb: {marginA}px
                    </span>
                  </div>

                  {/* Visual Measured Gap Ruler */}
                  <div className="relative py-1 flex items-center justify-center">
                    <div className="w-full border-t border-dashed border-amber-500/80" />
                    <span className="absolute bg-amber-500 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      Actual Gap: {collapsedGap}px {enableBFC ? '(Sum)' : '(Collapsed)'}
                    </span>
                  </div>

                  {/* Sibling Box B */}
                  <div
                    className="p-4 rounded-xl bg-indigo-600 text-white font-bold text-xs flex justify-between items-center shadow-md transition-all"
                    style={{ marginTop: `${marginB}px` }}
                  >
                    <span>Sibling Box B</span>
                    <span className="font-mono text-[10px] bg-black/20 px-1.5 py-0.5 rounded">
                      mt: {marginB}px
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
                Notice: Box A margin ({marginA}px) and Box B margin ({marginB}px){' '}
                {enableBFC
                  ? `add up to ${marginA + marginB}px because display: flow-root formed a new BFC!`
                  : `collapse into Math.max(${marginA}, ${marginB}) = ${collapsedGap}px!`}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};

export default BoxModelLab;
