'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ArrowRight, ArrowDown, Sparkles, Check, Move } from 'lucide-react';
import VisualizerPanel from './VisualizerPanel';
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl';
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl';
import ToggleGroup from '@/components/visualizers/cssviz/components/controls/ToggleGroup';
import SwitchControl from '@/components/visualizers/cssviz/components/controls/SwitchControl';
import { cn } from '../../utils/cn';

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type JustifyContent = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
type AlignItems = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
type AlignContent = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
type AlignSelf = 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';

interface ItemConfig {
  id: number;
  label: string;
  grow: number;
  shrink: number;
  basis: string;
  alignSelf: AlignSelf;
  order: number;
}

const defaultItems: ItemConfig[] = [
  { id: 1, label: 'Item 1', grow: 0, shrink: 1, basis: 'auto', alignSelf: 'auto', order: 0 },
  { id: 2, label: 'Item 2', grow: 0, shrink: 1, basis: 'auto', alignSelf: 'auto', order: 0 },
  { id: 3, label: 'Item 3', grow: 0, shrink: 1, basis: 'auto', alignSelf: 'auto', order: 0 },
  { id: 4, label: 'Item 4', grow: 0, shrink: 1, basis: 'auto', alignSelf: 'auto', order: 0 },
  { id: 5, label: 'Item 5', grow: 0, shrink: 1, basis: 'auto', alignSelf: 'auto', order: 0 },
];

const FlexboxLab = () => {
  // Container properties
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('row');
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('space-between');
  const [alignItems, setAlignItems] = useState<AlignItems>('center');
  const [alignContent, setAlignContent] = useState<AlignContent>('stretch');
  const [flexWrap, setFlexWrap] = useState<FlexWrap>('wrap');
  const [gap, setGap] = useState(16);
  const [showAxes, setShowAxes] = useState(true);

  // Items state
  const [items, setItems] = useState<ItemConfig[]>(defaultItems);
  const [selectedItemId, setSelectedItemId] = useState<number>(2);

  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];

  const updateSelectedItem = (updates: Partial<ItemConfig>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, ...updates } : item))
    );
  };

  const addItem = () => {
    if (items.length >= 8) return;
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([
      ...items,
      { id: newId, label: `Item ${newId}`, grow: 0, shrink: 1, basis: 'auto', alignSelf: 'auto', order: 0 },
    ]);
  };

  const removeItem = () => {
    if (items.length <= 2) return;
    setItems(items.slice(0, -1));
    if (selectedItemId === items[items.length - 1].id) {
      setSelectedItemId(items[items.length - 2].id);
    }
  };

  const isRow = flexDirection.includes('row');

  const cssOutput = useMemo(() => {
    let out = `.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  align-content: ${alignContent};
  gap: ${gap}px;
}`;

    if (selectedItem && (selectedItem.grow !== 0 || selectedItem.shrink !== 1 || selectedItem.basis !== 'auto' || selectedItem.alignSelf !== 'auto' || selectedItem.order !== 0)) {
      out += `\n\n/* Selected Child (${selectedItem.label}) */
.item-${selectedItem.id} {
  flex-grow: ${selectedItem.grow};
  flex-shrink: ${selectedItem.shrink};
  flex-basis: ${selectedItem.basis};
  align-self: ${selectedItem.alignSelf};
  order: ${selectedItem.order};
}`;
    }
    return out;
  }, [alignContent, alignItems, flexDirection, flexWrap, gap, justifyContent, selectedItem]);

  const reset = () => {
    setFlexDirection('row');
    setJustifyContent('space-between');
    setAlignItems('center');
    setAlignContent('stretch');
    setFlexWrap('wrap');
    setGap(16);
    setItems(defaultItems);
    setSelectedItemId(2);
  };

  return (
    <VisualizerPanel
      title="Advanced Flexbox Studio"
      description="Experiment with container axes, multi-line wrapping, and click any item to customize flex-grow, flex-shrink, flex-basis, align-self, and order."
      cssOutput={cssOutput.trim()}
      onReset={reset}
      controls={
        <div className="space-y-6">
          {/* Item Count & Selection Bar */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Items Count ({items.length})</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={removeItem}
                  disabled={items.length <= 2}
                  className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40"
                  title="Remove Item"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={addItem}
                  disabled={items.length >= 8}
                  className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40"
                  title="Add Item"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => setSelectedItemId(it.id)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all',
                    selectedItemId === it.id
                      ? 'border-amber-500 bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  )}
                >
                  #{it.id}
                </button>
              ))}
            </div>
          </div>

          {/* Container Controls */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Container Properties
            </span>

            <ToggleGroup
              label="flex-direction"
              value={flexDirection}
              options={['row', 'row-reverse', 'column', 'column-reverse']}
              onChange={(value) => setFlexDirection(value as FlexDirection)}
            />

            <SelectControl
              label="justify-content (Main Axis)"
              value={justifyContent}
              onChange={(v) => setJustifyContent(v as JustifyContent)}
              options={[
                { label: 'flex-start', value: 'flex-start' },
                { label: 'center', value: 'center' },
                { label: 'flex-end', value: 'flex-end' },
                { label: 'space-between', value: 'space-between' },
                { label: 'space-around', value: 'space-around' },
                { label: 'space-evenly', value: 'space-evenly' },
              ]}
            />

            <SelectControl
              label="align-items (Cross Axis)"
              value={alignItems}
              onChange={(v) => setAlignItems(v as AlignItems)}
              options={[
                { label: 'stretch', value: 'stretch' },
                { label: 'flex-start', value: 'flex-start' },
                { label: 'center', value: 'center' },
                { label: 'flex-end', value: 'flex-end' },
                { label: 'baseline', value: 'baseline' },
              ]}
            />

            <ToggleGroup
              label="flex-wrap"
              value={flexWrap}
              options={['nowrap', 'wrap', 'wrap-reverse']}
              onChange={(value) => setFlexWrap(value as FlexWrap)}
            />

            {flexWrap !== 'nowrap' && (
              <SelectControl
                label="align-content (Wrapped Lines)"
                value={alignContent}
                onChange={(v) => setAlignContent(v as AlignContent)}
                options={[
                  { label: 'stretch', value: 'stretch' },
                  { label: 'flex-start', value: 'flex-start' },
                  { label: 'center', value: 'center' },
                  { label: 'flex-end', value: 'flex-end' },
                  { label: 'space-between', value: 'space-between' },
                  { label: 'space-around', value: 'space-around' },
                  { label: 'space-evenly', value: 'space-evenly' },
                ]}
              />
            )}

            <SliderControl label="gap" value={gap} min={0} max={48} step={2} onChange={setGap} suffix="px" />

            <SwitchControl label="Show Axis Guides" checked={showAxes} onChange={setShowAxes} />
          </div>

          {/* Selected Item Controls */}
          {selectedItem && (
            <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {selectedItem.label} Properties
                </span>
                <span className="text-[10px] font-mono bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">
                  Click item to select
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>flex-grow</span>
                  <span className="font-mono text-purple-500">{selectedItem.grow}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={selectedItem.grow}
                  onChange={(e) => updateSelectedItem({ grow: Number(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>flex-shrink</span>
                  <span className="font-mono text-purple-500">{selectedItem.shrink}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={selectedItem.shrink}
                  onChange={(e) => updateSelectedItem({ shrink: Number(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <SelectControl
                label="align-self"
                value={selectedItem.alignSelf}
                onChange={(v) => updateSelectedItem({ alignSelf: v as AlignSelf })}
                options={[
                  { label: 'auto', value: 'auto' },
                  { label: 'flex-start', value: 'flex-start' },
                  { label: 'center', value: 'center' },
                  { label: 'flex-end', value: 'flex-end' },
                  { label: 'stretch', value: 'stretch' },
                  { label: 'baseline', value: 'baseline' },
                ]}
              />

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>order</span>
                  <span className="font-mono text-purple-500">{selectedItem.order}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="3"
                  value={selectedItem.order}
                  onChange={(e) => updateSelectedItem({ order: Number(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      }
      preview={
        <div className="flex flex-col gap-3 min-h-[360px] flex-1">
          {/* Axis indicators */}
          {showAxes && (
            <div className="flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <ArrowRight className={cn('h-3.5 w-3.5', !isRow && 'rotate-90')} />
                Main Axis: {flexDirection} (justify-content)
              </span>
              <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                <ArrowDown className={cn('h-3.5 w-3.5', !isRow && '-rotate-90')} />
                Cross Axis (align-items)
              </span>
            </div>
          )}

          {/* The Flexbox Stage */}
          <div
            className="flex-1 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 min-h-[300px] flex overflow-auto transition-all"
            style={{
              flexDirection,
              justifyContent,
              alignItems,
              alignContent,
              flexWrap,
              gap: `${gap}px`,
            }}
          >
            {items.map((item) => {
              const isSelected = item.id === selectedItem?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={cn(
                    'p-4 rounded-xl cursor-pointer select-none transition-all flex flex-col justify-between shadow-md',
                    isSelected
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white ring-4 ring-purple-400/50 scale-105 z-10'
                      : 'bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 text-slate-950 hover:brightness-105'
                  )}
                  style={{
                    flexGrow: item.grow,
                    flexShrink: item.shrink,
                    flexBasis: item.basis,
                    alignSelf: item.alignSelf,
                    order: item.order,
                    minWidth: isRow ? '90px' : 'auto',
                    minHeight: !isRow ? '60px' : 'auto',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold gap-2">
                    <span>{item.label}</span>
                    {isSelected && <Sparkles className="h-3.5 w-3.5 text-white" />}
                  </div>

                  <div className="text-[10px] font-mono opacity-85 mt-2 space-y-0.5">
                    {item.grow > 0 && <div>grow: {item.grow}</div>}
                    {item.order !== 0 && <div>order: {item.order}</div>}
                    {item.alignSelf !== 'auto' && <div>self: {item.alignSelf}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any block to adjust individual <code className="font-mono text-purple-500">flex-grow</code>,{' '}
            <code className="font-mono text-purple-500">align-self</code>, or <code className="font-mono text-purple-500">order</code>.
          </p>
        </div>
      }
    />
  );
};

export default FlexboxLab;
