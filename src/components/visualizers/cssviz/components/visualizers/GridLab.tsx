'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import VisualizerPanel from './VisualizerPanel';
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl';
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl';
import SwitchControl from '@/components/visualizers/cssviz/components/controls/SwitchControl';
import ToggleGroup from '@/components/visualizers/cssviz/components/controls/ToggleGroup';
import { cn } from '../../utils/cn';
import { LayoutGrid, Sparkles, Plus, Minus } from 'lucide-react';

type GridPreset = 'auto-fit' | 'auto-fill' | 'equal-3' | 'sidebar' | 'holy-grail' | 'weighted';
type GridAlign = 'stretch' | 'start' | 'center' | 'end';
type AutoFlow = 'row' | 'column' | 'row dense';

interface GridItemConfig {
  id: number;
  label: string;
  colSpan: number;
  rowSpan: number;
  justifySelf: string;
  alignSelf: string;
}

const initialGridItems: GridItemConfig[] = [
  { id: 1, label: 'Item 1', colSpan: 2, rowSpan: 1, justifySelf: 'stretch', alignSelf: 'stretch' },
  { id: 2, label: 'Item 2', colSpan: 1, rowSpan: 1, justifySelf: 'stretch', alignSelf: 'stretch' },
  { id: 3, label: 'Item 3', colSpan: 1, rowSpan: 2, justifySelf: 'stretch', alignSelf: 'stretch' },
  { id: 4, label: 'Item 4', colSpan: 1, rowSpan: 1, justifySelf: 'stretch', alignSelf: 'stretch' },
  { id: 5, label: 'Item 5', colSpan: 1, rowSpan: 1, justifySelf: 'stretch', alignSelf: 'stretch' },
  { id: 6, label: 'Item 6', colSpan: 2, rowSpan: 1, justifySelf: 'stretch', alignSelf: 'stretch' },
];

const GridLab = () => {
  const [preset, setPreset] = useState<GridPreset>('equal-3');
  const [gap, setGap] = useState(16);
  const [justifyItems, setJustifyItems] = useState<GridAlign>('stretch');
  const [alignItems, setAlignItems] = useState<GridAlign>('stretch');
  const [autoFlow, setAutoFlow] = useState<AutoFlow>('row');
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  // Items state
  const [items, setItems] = useState<GridItemConfig[]>(initialGridItems);
  const [selectedItemId, setSelectedItemId] = useState<number>(1);

  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];

  const updateSelectedItem = (updates: Partial<GridItemConfig>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, ...updates } : item))
    );
  };

  let templateColumns = 'repeat(3, 1fr)';
  if (preset === 'auto-fit') templateColumns = 'repeat(auto-fit, minmax(130px, 1fr))';
  else if (preset === 'auto-fill') templateColumns = 'repeat(auto-fill, minmax(130px, 1fr))';
  else if (preset === 'sidebar') templateColumns = '200px 1fr';
  else if (preset === 'holy-grail') templateColumns = '160px 1fr 160px';
  else if (preset === 'weighted') templateColumns = '1fr 2fr 1fr';

  const cssOutput = useMemo(() => {
    let out = `.grid-container {
  display: grid;
  grid-template-columns: ${templateColumns};
  gap: ${gap}px;
  justify-items: ${justifyItems};
  align-items: ${alignItems};
  grid-auto-flow: ${autoFlow};
}`;

    if (selectedItem && (selectedItem.colSpan > 1 || selectedItem.rowSpan > 1 || selectedItem.justifySelf !== 'stretch' || selectedItem.alignSelf !== 'stretch')) {
      out += `\n\n/* Selected Child (${selectedItem.label}) */
.item-${selectedItem.id} {`;
      if (selectedItem.colSpan > 1) out += `\n  grid-column: span ${selectedItem.colSpan};`;
      if (selectedItem.rowSpan > 1) out += `\n  grid-row: span ${selectedItem.rowSpan};`;
      if (selectedItem.justifySelf !== 'stretch') out += `\n  justify-self: ${selectedItem.justifySelf};`;
      if (selectedItem.alignSelf !== 'stretch') out += `\n  align-self: ${selectedItem.alignSelf};`;
      out += `\n}`;
    }
    return out;
  }, [alignItems, autoFlow, gap, justifyItems, selectedItem, templateColumns]);

  const reset = () => {
    setPreset('equal-3');
    setGap(16);
    setJustifyItems('stretch');
    setAlignItems('stretch');
    setAutoFlow('row');
    setItems(initialGridItems);
    setSelectedItemId(1);
  };

  return (
    <VisualizerPanel
      title="Advanced CSS Grid Studio"
      description="Experiment with 2D fractional tracks, auto-fit/auto-fill, dense packing, item column/row spanning, and line number coordinates."
      cssOutput={cssOutput.trim()}
      onReset={reset}
      controls={
        <div className="space-y-6">
          {/* Preset Tracks */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Track Template Presets
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'equal-3', label: '3 Columns (1fr)' },
                  { id: 'auto-fit', label: 'auto-fit (Responsive)' },
                  { id: 'auto-fill', label: 'auto-fill (Keep Slots)' },
                  { id: 'sidebar', label: 'Sidebar + Main' },
                  { id: 'holy-grail', label: 'Holy Grail (3-Col)' },
                  { id: 'weighted', label: '1fr 2fr 1fr' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={cn(
                    'py-1.5 px-2 text-xs font-bold rounded-lg border text-left transition-all',
                    preset === p.id
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2D Alignment Controls */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              2D Alignment &amp; Flow
            </span>

            <div className="grid grid-cols-2 gap-3">
              <SelectControl
                label="justify-items (X-Axis)"
                value={justifyItems}
                onChange={(v) => setJustifyItems(v as GridAlign)}
                options={[
                  { label: 'stretch', value: 'stretch' },
                  { label: 'start', value: 'start' },
                  { label: 'center', value: 'center' },
                  { label: 'end', value: 'end' },
                ]}
              />

              <SelectControl
                label="align-items (Y-Axis)"
                value={alignItems}
                onChange={(v) => setAlignItems(v as GridAlign)}
                options={[
                  { label: 'stretch', value: 'stretch' },
                  { label: 'start', value: 'start' },
                  { label: 'center', value: 'center' },
                  { label: 'end', value: 'end' },
                ]}
              />
            </div>

            <ToggleGroup
              label="grid-auto-flow"
              value={autoFlow}
              options={['row', 'column', 'row dense']}
              onChange={(v) => setAutoFlow(v as AutoFlow)}
            />

            <SliderControl label="Gap" value={gap} min={0} max={36} step={2} onChange={setGap} suffix="px" />

            <SwitchControl label="Show Grid Lines & Coordinates" checked={showLineNumbers} onChange={setShowLineNumbers} />
          </div>

          {/* Item Level Spanning */}
          {selectedItem && (
            <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {selectedItem.label} Spanning
                </span>
                <span className="text-[10px] font-mono bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">
                  Click card to select
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>grid-column span</span>
                    <span className="font-mono text-purple-500">{selectedItem.colSpan}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    value={selectedItem.colSpan}
                    onChange={(e) => updateSelectedItem({ colSpan: Number(e.target.value) })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>grid-row span</span>
                    <span className="font-mono text-purple-500">{selectedItem.rowSpan}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    value={selectedItem.rowSpan}
                    onChange={(e) => updateSelectedItem({ rowSpan: Number(e.target.value) })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      }
      preview={
        <div className="flex flex-col gap-3 min-h-[360px] flex-1">
          {showLineNumbers && (
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between px-2">
              <span>Grid Columns: {templateColumns}</span>
              <span className="text-amber-500 font-bold">Auto-flow: {autoFlow}</span>
            </div>
          )}

          {/* Grid Stage */}
          <div
            className="flex-1 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 min-h-[320px] transition-all"
            style={{
              display: 'grid',
              gridTemplateColumns: templateColumns,
              gap: `${gap}px`,
              justifyItems,
              alignItems,
              gridAutoFlow: autoFlow,
            }}
          >
            {items.map((item) => {
              const isSelected = item.id === selectedItem?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={cn(
                    'p-4 rounded-xl cursor-pointer select-none transition-all flex flex-col justify-between shadow-md min-h-[90px]',
                    isSelected
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white ring-4 ring-purple-400/50 scale-[1.02] z-10'
                      : 'bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 text-slate-950 hover:brightness-105'
                  )}
                  style={{
                    gridColumn: `span ${item.colSpan}`,
                    gridRow: `span ${item.rowSpan}`,
                    justifySelf: item.justifySelf,
                    alignSelf: item.alignSelf,
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{item.label}</span>
                    {isSelected && <Sparkles className="h-3.5 w-3.5 text-white" />}
                  </div>

                  <div className="text-[10px] font-mono opacity-85 mt-2 space-y-0.5">
                    {item.colSpan > 1 && <div>col: span {item.colSpan}</div>}
                    {item.rowSpan > 1 && <div>row: span {item.rowSpan}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any block to adjust its <code className="font-mono text-purple-500">grid-column</code> and <code className="font-mono text-purple-500">grid-row</code> spanning.
          </p>
        </div>
      }
    />
  );
};

export default GridLab;
