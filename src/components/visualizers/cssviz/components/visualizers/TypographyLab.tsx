'use client';

import { useMemo, useState } from 'react';
import VisualizerPanel from './VisualizerPanel';
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl';
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl';
import SwitchControl from '@/components/visualizers/cssviz/components/controls/SwitchControl';
import { Type, AlignLeft, Grid, Sparkles, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
type TextWrapMode = 'wrap' | 'balance' | 'pretty' | 'nowrap';

export default function TypographyLab() {
  const [fontSize, setFontSize] = useState<number>(26);
  const [lineHeight, setLineHeight] = useState<number>(1.55);
  const [letterSpacing, setLetterSpacing] = useState<number>(0.02);
  const [fontWeight, setFontWeight] = useState<number>(600);
  const [fontFamily, setFontFamily] = useState<string>('system-ui, -apple-system, sans-serif');
  const [textTransform, setTextTransform] = useState<TextTransform>('none');
  const [textWrap, setTextWrap] = useState<TextWrapMode>('balance');
  const [showBaselineGrid, setShowBaselineGrid] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>(
    'Modern CSS typography gives designers precise mathematical control over vertical rhythm, optical kerning, and variable font interpolation axes.'
  );

  const remValue = (fontSize / 16).toFixed(3);

  const cssOutput = useMemo(() => {
    return `/* Typographic Rhythm & Readability System */
.typeset-headline {
  font-family: ${fontFamily};
  font-size: ${fontSize}px; /* ${remValue}rem */
  line-height: ${lineHeight};
  letter-spacing: ${letterSpacing}em;
  font-weight: ${fontWeight};
  font-variation-settings: "wght" ${fontWeight};
  text-transform: ${textTransform};
  text-wrap: ${textWrap}; /* Modern CSS: avoids orphan words on last line */
  hyphens: auto;
}

/* Vertical Rhythm:
   Computed line box height = ${Math.round(fontSize * lineHeight)}px
*/`;
  }, [fontFamily, fontSize, fontWeight, letterSpacing, lineHeight, remValue, textTransform, textWrap]);

  const tasks = [
    'Toggle "text-wrap: balance" to watch CSS automatically equalize line lengths and eliminate lonely orphan words.',
    'Switch on "Show Baseline Grid" to observe how line-height aligns text with the vertical rhythm grid.',
    'Adjust letter-spacing when text-transform is uppercase: loose tracking improves all-caps readability dramatically.',
    'Test different font weights (100-900) to see variable font interpolation in real-time.',
  ];

  return (
    <VisualizerPanel
      title="Typography & Typographic Rhythm Lab"
      description="Fine-tune font metrics, line-height vertical rhythm, letter-spacing tracking, and modern text-wrap balancing."
      cssOutput={cssOutput}
      tasks={tasks}
      badge="Typesetting & Rhythm"
      onReset={() => {
        setFontSize(26);
        setLineHeight(1.55);
        setLetterSpacing(0.02);
        setFontWeight(600);
        setFontFamily('system-ui, -apple-system, sans-serif');
        setTextTransform('none');
        setTextWrap('balance');
        setShowBaselineGrid(false);
      }}
      controls={
        <div className="space-y-4">
          <SliderControl
            label="Font Size (font-size)"
            value={fontSize}
            min={14}
            max={56}
            step={1}
            onChange={setFontSize}
            suffix="px"
          />

          <SliderControl
            label="Line Height (line-height)"
            value={lineHeight}
            min={0.9}
            max={2.4}
            step={0.05}
            onChange={setLineHeight}
          />

          <SliderControl
            label="Letter Spacing (tracking)"
            value={letterSpacing}
            min={-0.08}
            max={0.3}
            step={0.01}
            onChange={setLetterSpacing}
            suffix="em"
          />

          <SliderControl
            label="Font Weight (font-weight / wght axis)"
            value={fontWeight}
            min={100}
            max={900}
            step={50}
            onChange={setFontWeight}
          />

          <SelectControl
            label="Font Family"
            value={fontFamily}
            onChange={setFontFamily}
            options={[
              { label: 'Modern Sans (system-ui, Inter)', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
              { label: 'Editorial Serif (Georgia, Garamond)', value: 'Georgia, Cambria, "Times New Roman", Times, serif' },
              { label: 'Code Monospace (JetBrains, Consolas)', value: '"JetBrains Mono", "Courier New", Courier, monospace' },
            ]}
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Text Transform
              </label>
              <select
                value={textTransform}
                onChange={(e) => setTextTransform(e.target.value as TextTransform)}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
              >
                <option value="none">none (Natural)</option>
                <option value="uppercase">uppercase (ALL CAPS)</option>
                <option value="lowercase">lowercase</option>
                <option value="capitalize">capitalize (Title Case)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                text-wrap (Modern)
              </label>
              <select
                value={textWrap}
                onChange={(e) => setTextWrap(e.target.value as TextWrapMode)}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
              >
                <option value="balance">balance (Equal lines)</option>
                <option value="pretty">pretty (No widows)</option>
                <option value="wrap">wrap (Default)</option>
                <option value="nowrap">nowrap (1-line)</option>
              </select>
            </div>
          </div>

          <SwitchControl
            label="Show Baseline Rhythm Grid (8px)"
            checked={showBaselineGrid}
            onChange={setShowBaselineGrid}
          />
        </div>
      }
      preview={
        <div className="space-y-4">
          {/* Status Row */}
          <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {fontSize}px ({remValue}rem) · line-box: {Math.round(fontSize * lineHeight)}px · wght: {fontWeight}
            </span>
            <span className="font-mono text-[11px] text-primary">text-wrap: {textWrap}</span>
          </div>

          {/* Interactive Typeset Stage */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 min-h-[260px] overflow-hidden shadow-xs">
            {/* Optional 8px Baseline Grid Background */}
            {showBaselineGrid && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
                  backgroundSize: '100% 8px',
                }}
              />
            )}

            <div className="relative z-10 space-y-4 max-w-2xl">
              <h2
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight,
                  letterSpacing: `${letterSpacing}em`,
                  fontWeight,
                  fontVariationSettings: `"wght" ${fontWeight}`,
                  textTransform,
                  textWrap,
                }}
                className="text-slate-900 dark:text-white transition-all"
              >
                {customText}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                <span>Computed: {fontSize}px / {(fontSize * lineHeight).toFixed(1)}px line box</span>
                <span>{letterSpacing >= 0 ? `+${letterSpacing}em` : `${letterSpacing}em`} tracking</span>
              </p>
            </div>
          </div>

          {/* Custom Editable Text Bar */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Type custom text to test typesetting:
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 shadow-xs focus:outline-hidden focus:border-primary"
              placeholder="Enter custom sentence..."
            />
          </div>
        </div>
      }
    />
  );
}
