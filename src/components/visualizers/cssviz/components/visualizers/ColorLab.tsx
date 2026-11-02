'use client';

import { useMemo, useState } from 'react';
import VisualizerPanel from './VisualizerPanel';
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl';
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl';
import { hsl } from '@/components/visualizers/cssviz/utils/color';
import { Palette, Sparkles, CheckCircle2, XCircle, Sliders, Droplets, SunMedium } from 'lucide-react';
import { cn } from '../../utils/cn';

type GradientType = 'linear' | 'radial' | 'conic';
type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split';
type ColorModel = 'oklch' | 'hsl' | 'rgb' | 'hex';

// Convert HSL to RGB helper
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

// Convert RGB to HEX
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

// Relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(lum1: number, lum2: number): number {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export default function ColorLab() {
  const [activeTab, setActiveTab] = useState<'gradient' | 'harmonies'>('gradient');
  const [hue, setHue] = useState<number>(220);
  const [saturation, setSaturation] = useState<number>(85);
  const [lightness, setLightness] = useState<number>(55);
  const [alpha, setAlpha] = useState<number>(100);

  // Gradient state
  const [secondaryHue, setSecondaryHue] = useState<number>(165);
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState<number>(135);
  const [useOklchInterpolation, setUseOklchInterpolation] = useState<boolean>(true);

  // Harmony state
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('triadic');

  // Compute colors
  const primaryRgb = hslToRgb(hue, saturation, lightness);
  const primaryHex = rgbToHex(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  const primaryHslStr = `hsl(${hue} ${saturation}% ${lightness}%${alpha < 100 ? ` / ${alpha / 100}` : ''})`;
  const oklchLightness = (lightness / 100).toFixed(2);
  const oklchChroma = ((saturation / 100) * 0.25).toFixed(3);
  const primaryOklchStr = `oklch(${oklchLightness} ${oklchChroma} ${hue}${alpha < 100 ? ` / ${alpha / 100}` : ''})`;

  const secondaryRgb = hslToRgb(secondaryHue, saturation, lightness);
  const secondaryHex = rgbToHex(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
  const secondaryHslStr = `hsl(${secondaryHue} ${saturation}% ${lightness}%)`;

  // Luminance & WCAG
  const lum = getLuminance(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  const contrastOnWhite = getContrast(lum, 1.0);
  const contrastOnBlack = getContrast(lum, 0.0);

  // Harmonies palette generator
  const harmonyColors = useMemo(() => {
    let offsets: number[] = [];
    if (harmonyType === 'complementary') offsets = [0, 180];
    else if (harmonyType === 'analogous') offsets = [0, 30, 60, -30];
    else if (harmonyType === 'triadic') offsets = [0, 120, 240];
    else if (harmonyType === 'split') offsets = [0, 150, 210];

    return offsets.map((off) => {
      const h = (hue + off + 360) % 360;
      const rgb = hslToRgb(h, saturation, lightness);
      return {
        h,
        hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
        hsl: `hsl(${h} ${saturation}% ${lightness}%)`,
      };
    });
  }, [harmonyType, hue, lightness, saturation]);

  // Gradient CSS
  const gradientCssString = useMemo(() => {
    const interp = useOklchInterpolation ? 'in oklch ' : '';
    if (gradientType === 'linear') {
      return `linear-gradient(${interp}${angle}deg, ${primaryHslStr}, ${secondaryHslStr})`;
    } else if (gradientType === 'radial') {
      return `radial-gradient(${interp}circle at center, ${primaryHslStr}, ${secondaryHslStr})`;
    } else {
      return `conic-gradient(${interp}from ${angle}deg, ${primaryHslStr}, ${secondaryHslStr}, ${primaryHslStr})`;
    }
  }, [angle, gradientType, primaryHslStr, secondaryHslStr, useOklchInterpolation]);

  const cssOutput = useMemo(() => {
    if (activeTab === 'harmonies') {
      return `/* Modern CSS Color Variables (${harmonyType}) */
:root {
  --color-primary: ${primaryOklchStr}; /* Modern Perceptual OKLCH */
  --color-primary-fallback: ${primaryHex};
${harmonyColors
  .slice(1)
  .map((c, i) => `  --color-harmony-${i + 1}: ${c.hex}; /* ${c.hsl} */`)
  .join('\n')}
}

/* Accessibility (WCAG 2.2):
   Contrast against #FFFFFF: ${contrastOnWhite.toFixed(2)}:1 (${contrastOnWhite >= 4.5 ? 'PASS AA' : 'FAIL AA'})
   Contrast against #000000: ${contrastOnBlack.toFixed(2)}:1 (${contrastOnBlack >= 4.5 ? 'PASS AA' : 'FAIL AA'})
*/`;
    }

    return `/* Modern CSS Gradient Studio */
.hero-surface {
  background: ${gradientCssString};
  ${useOklchInterpolation ? '/* "in oklch" delivers vivid transitions without the muddy gray midpoint! */' : ''}
}

/* Base Color Tokens */
:root {
  --brand-primary: ${primaryOklchStr};
  --brand-secondary: ${secondaryHslStr};
  --brand-hex: ${primaryHex};
}`;
  }, [
    activeTab,
    contrastOnBlack,
    contrastOnWhite,
    gradientCssString,
    harmonyColors,
    harmonyType,
    primaryHex,
    primaryOklchStr,
    secondaryHslStr,
    useOklchInterpolation,
  ]);

  const tasks = [
    'Toggle "in oklch" interpolation on the gradient to observe how it removes muddy gray transitional midpoints.',
    'Test contrast scores against white vs black to find an accessible text color pairing.',
    'Switch to the Harmonies tab to generate mathematically balanced color schemes (Complementary, Triadic).',
    'Compare the modern oklch() color syntax with traditional hsl() and hex values.',
  ];

  return (
    <VisualizerPanel
      title="Color, Contrast & Gradient Studio"
      description="Design accessible palettes with OKLCH wide-gamut colors, real-time WCAG 2.2 contrast validation, and modern gradient interpolation."
      cssOutput={cssOutput}
      tasks={tasks}
      badge="Modern CSS Color Space"
      onReset={() => {
        setHue(220);
        setSecondaryHue(165);
        setSaturation(85);
        setLightness(55);
        setAlpha(100);
        setAngle(135);
        setGradientType('linear');
        setUseOklchInterpolation(true);
      }}
      controls={
        <div className="space-y-4">
          {/* Tab Selector */}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('gradient')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md font-semibold transition-all',
                activeTab === 'gradient'
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              )}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Gradients & Interpolation</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('harmonies')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md font-semibold transition-all',
                activeTab === 'harmonies'
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              )}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Harmonies & WCAG</span>
            </button>
          </div>

          {/* Primary Color Sliders */}
          <div className="space-y-3">
            <SliderControl
              label="Primary Hue (0° - 360°)"
              value={hue}
              min={0}
              max={360}
              onChange={setHue}
              suffix="°"
            />

            <SliderControl
              label="Saturation"
              value={saturation}
              min={0}
              max={100}
              onChange={setSaturation}
              suffix="%"
            />

            <SliderControl
              label="Lightness"
              value={lightness}
              min={5}
              max={95}
              onChange={setLightness}
              suffix="%"
            />

            <SliderControl
              label="Alpha Transparency"
              value={alpha}
              min={10}
              max={100}
              onChange={setAlpha}
              suffix="%"
            />
          </div>

          {activeTab === 'gradient' ? (
            /* GRADIENT CONTROLS */
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <SliderControl
                label="Secondary Stop Hue"
                value={secondaryHue}
                min={0}
                max={360}
                onChange={setSecondaryHue}
                suffix="°"
              />

              <SliderControl
                label="Gradient Angle"
                value={angle}
                min={0}
                max={360}
                onChange={setAngle}
                suffix="°"
              />

              <SelectControl
                label="Gradient Type"
                value={gradientType}
                onChange={(v) => setGradientType(v as GradientType)}
                options={[
                  { label: 'linear-gradient', value: 'linear' },
                  { label: 'radial-gradient', value: 'radial' },
                  { label: 'conic-gradient', value: 'conic' },
                ]}
              />

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Color Interpolation</div>
                  <div className="text-[11px] text-slate-500">in oklch vs in srgb</div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseOklchInterpolation(!useOklchInterpolation)}
                  className={cn(
                    'px-2.5 py-1 rounded text-xs font-mono font-bold transition-all',
                    useOklchInterpolation
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {useOklchInterpolation ? 'in oklch (Vibrant)' : 'in srgb (Standard)'}
                </button>
              </div>
            </div>
          ) : (
            /* HARMONY CONTROLS */
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Color Harmony Algorithm
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['complementary', 'analogous', 'triadic', 'split'] as HarmonyType[]).map((ht) => (
                  <button
                    key={ht}
                    type="button"
                    onClick={() => setHarmonyType(ht)}
                    className={cn(
                      'py-1.5 px-2 rounded-lg border text-xs font-medium capitalize transition-all',
                      harmonyType === ht
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {ht}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      preview={
        <div className="space-y-4">
          {activeTab === 'gradient' ? (
            /* GRADIENT PREVIEW */
            <div className="space-y-3">
              <div
                className="relative h-64 rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col justify-between overflow-hidden transition-all"
                style={{ background: gradientCssString }}
              >
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-xs font-mono bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    {gradientType}-gradient
                  </span>
                  <span className="text-xs font-mono bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    {angle}°
                  </span>
                </div>

                <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white max-w-sm">
                  <h4 className="font-bold text-sm mb-0.5">High-Precision CSS Surface</h4>
                  <p className="text-xs text-white/80">
                    Interpolation mode: <code className="font-bold text-amber-300">{useOklchInterpolation ? 'in oklch' : 'in srgb'}</code>
                  </p>
                </div>
              </div>

              {/* Color Stops Row */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full shadow-xs" style={{ background: primaryHex }} />
                  <div>
                    <div className="text-[10px] text-slate-400">Stop 1 (Primary)</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{primaryHex}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full shadow-xs" style={{ background: secondaryHex }} />
                  <div>
                    <div className="text-[10px] text-slate-400">Stop 2 (Secondary)</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{secondaryHex}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* HARMONIES & WCAG PREVIEW */
            <div className="space-y-4">
              {/* Palette Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {harmonyColors.map((col, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-28 shadow-sm transition-transform hover:-translate-y-0.5"
                    style={{ background: col.hex }}
                  >
                    <span className="text-[10px] font-mono bg-black/40 backdrop-blur-xs text-white px-1.5 py-0.5 rounded self-start">
                      {idx === 0 ? 'Primary' : `Stop ${idx + 1}`}
                    </span>
                    <div className="bg-black/60 backdrop-blur-md p-1.5 rounded text-white text-[10px] font-mono">
                      <div>{col.hex}</div>
                      <div className="opacity-75">{col.h}°</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WCAG 2.2 Contrast Auditor */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <SunMedium className="w-4 h-4 text-amber-500" />
                    WCAG 2.2 Contrast Ratio Auditor
                  </span>
                  <span className="font-mono text-xs text-slate-500">{primaryHex}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Against White */}
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-900 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Against White (#FFF)</span>
                      <span className="font-mono font-bold text-sm">{contrastOnWhite.toFixed(2)}:1</span>
                    </div>
                    <div
                      className="p-2 rounded font-medium text-center text-xs mb-2"
                      style={{ backgroundColor: primaryHex, color: '#ffffff' }}
                    >
                      Sample Text on Primary
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>AA Normal (4.5:1)</span>
                      {contrastOnWhite >= 4.5 ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                        </span>
                      ) : (
                        <span className="text-rose-500 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Fail
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Against Black */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-white flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Against Black (#000)</span>
                      <span className="font-mono font-bold text-sm">{contrastOnBlack.toFixed(2)}:1</span>
                    </div>
                    <div
                      className="p-2 rounded font-medium text-center text-xs mb-2"
                      style={{ backgroundColor: primaryHex, color: '#000000' }}
                    >
                      Sample Text on Primary
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>AA Normal (4.5:1)</span>
                      {contrastOnBlack >= 4.5 ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Fail
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
