'use client';

import { useMemo, useState } from 'react';
import VisualizerPanel from './VisualizerPanel';
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl';
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl';
import ToggleGroup from '@/components/visualizers/cssviz/components/controls/ToggleGroup';
import SwitchControl from '@/components/visualizers/cssviz/components/controls/SwitchControl';
import { Play, Pause, RotateCcw, Sparkles, Activity, Layers, Flame, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

type AnimationPreset = 'float' | 'bounce' | 'pulse' | 'flip3d' | 'shake' | 'orbit' | 'hue';
type TimingFunction =
  | 'ease'
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  | 'steps(4, jump-end)';
type Iterations = '1' | '2' | '3' | 'infinite';
type Direction = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
type FillMode = 'none' | 'forwards' | 'backwards' | 'both';

interface PresetConfig {
  name: string;
  description: string;
  keyframesName: string;
  cssKeyframes: string;
  stageBadge: string;
  defaultDuration: number;
  defaultTiming: TimingFunction;
  steps: { at: string; style: string }[];
}

const PRESET_CONFIGS: Record<AnimationPreset, PresetConfig> = {
  float: {
    name: 'Float & Hover',
    description: 'Smooth vertical floating with scale expansion and dynamic soft shadow.',
    keyframesName: 'cssviz-float',
    defaultDuration: 2.2,
    defaultTiming: 'ease-in-out',
    stageBadge: 'Y-Axis Elevation & Scale',
    cssKeyframes: `@keyframes cssviz-float {
  0% {
    transform: translateY(0px) scale(1);
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
  }
  50% {
    transform: translateY(-28px) scale(1.06);
    box-shadow: 0 30px 40px -8px rgba(147, 51, 234, 0.5);
  }
  100% {
    transform: translateY(0px) scale(1);
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
  }
}`,
    steps: [
      { at: '0%', style: 'translateY(0) scale(1)' },
      { at: '50%', style: 'translateY(-28px) scale(1.06)' },
      { at: '100%', style: 'translateY(0) scale(1)' },
    ],
  },
  bounce: {
    name: 'Gravity Bounce & Squash',
    description: 'Realistic elastic bounce with squash & stretch upon impact at floor plane.',
    keyframesName: 'cssviz-bounce',
    defaultDuration: 1.4,
    defaultTiming: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    stageBadge: 'Squash & Stretch Kinematics',
    cssKeyframes: `@keyframes cssviz-bounce {
  0% {
    transform: translateY(-90px) scale(1, 1);
  }
  45% {
    transform: translateY(0px) scale(1.2, 0.8); /* Squish on impact */
  }
  60% {
    transform: translateY(-35px) scale(0.9, 1.15); /* Stretch ascending */
  }
  80% {
    transform: translateY(0px) scale(1.05, 0.95);
  }
  100% {
    transform: translateY(0px) scale(1, 1);
  }
}`,
    steps: [
      { at: '0%', style: 'translateY(-90px) scale(1, 1) [Apex]' },
      { at: '45%', style: 'translateY(0px) scale(1.2, 0.8) [Squash impact]' },
      { at: '60%', style: 'translateY(-35px) scale(0.9, 1.15) [Rebound]' },
      { at: '100%', style: 'translateY(0) scale(1, 1) [Rest]' },
    ],
  },
  pulse: {
    name: 'Radar Ping & Pulse',
    description: 'Rhythmic radial pulse with expanding neon glow ring and opacity decay.',
    keyframesName: 'cssviz-pulse',
    defaultDuration: 1.6,
    defaultTiming: 'ease-out',
    stageBadge: 'Concentric Bloom Expansion',
    cssKeyframes: `@keyframes cssviz-pulse {
  0% {
    transform: scale(0.92);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1.08);
    box-shadow: 0 0 0 35px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.92);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}`,
    steps: [
      { at: '0%', style: 'scale(0.92) · zero halo spread' },
      { at: '70%', style: 'scale(1.08) · 35px diffuse halo' },
      { at: '100%', style: 'scale(0.92) · halo fully dissipated' },
    ],
  },
  flip3d: {
    name: '3D Perspective Flip',
    description: 'Card turnover around the Y-axis inside a 3D perspective viewport.',
    keyframesName: 'cssviz-flip3d',
    defaultDuration: 2.0,
    defaultTiming: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    stageBadge: '3D Matrix rotateY Space',
    cssKeyframes: `@keyframes cssviz-flip3d {
  0% {
    transform: perspective(600px) rotateY(0deg) scale(1);
  }
  50% {
    transform: perspective(600px) rotateY(180deg) scale(1.15);
  }
  100% {
    transform: perspective(600px) rotateY(360deg) scale(1);
  }
}`,
    steps: [
      { at: '0%', style: 'rotateY(0deg) · Face Front' },
      { at: '50%', style: 'rotateY(180deg) · Face Back (inverted)' },
      { at: '100%', style: 'rotateY(360deg) · Completed 3D Revolution' },
    ],
  },
  shake: {
    name: 'Alert Wiggle & Shake',
    description: 'High-frequency harmonic rattle used for form errors and notification bells.',
    keyframesName: 'cssviz-shake',
    defaultDuration: 0.6,
    defaultTiming: 'ease-in-out',
    stageBadge: 'Torsional Angle Jitter',
    cssKeyframes: `@keyframes cssviz-shake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  15% { transform: translateX(-12px) rotate(-8deg); }
  30% { transform: translateX(12px) rotate(8deg); }
  45% { transform: translateX(-8px) rotate(-5deg); }
  60% { transform: translateX(8px) rotate(5deg); }
  75% { transform: translateX(-4px) rotate(-2deg); }
}`,
    steps: [
      { at: '0%, 100%', style: 'translateX(0) rotate(0deg)' },
      { at: '15% - 30%', style: '±12px shift · ±8° rotation' },
      { at: '45% - 75%', style: 'Damped decay back to equilibrium' },
    ],
  },
  orbit: {
    name: 'Planetary Orbit & Spin',
    description: 'Continuous 360-degree rotation with a revolving satellite element.',
    keyframesName: 'cssviz-orbit',
    defaultDuration: 3.0,
    defaultTiming: 'linear',
    stageBadge: '360° Circular Revolution',
    cssKeyframes: `@keyframes cssviz-orbit {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}`,
    steps: [
      { at: 'from (0%)', style: 'rotate(0deg)' },
      { at: 'to (100%)', style: 'rotate(360deg)' },
    ],
  },
  hue: {
    name: 'Rainbow Hue Cycle',
    description: 'Chrominance spectrum rotation across 360 degrees using CSS filter.',
    keyframesName: 'cssviz-hue',
    defaultDuration: 3.5,
    defaultTiming: 'linear',
    stageBadge: 'GPU Filter Hue-Rotate',
    cssKeyframes: `@keyframes cssviz-hue {
  0% {
    filter: hue-rotate(0deg) brightness(1);
    transform: scale(1);
  }
  50% {
    filter: hue-rotate(180deg) brightness(1.2);
    transform: scale(1.08);
  }
  100% {
    filter: hue-rotate(360deg) brightness(1);
    transform: scale(1);
  }
}`,
    steps: [
      { at: '0%', style: 'hue-rotate(0deg)' },
      { at: '50%', style: 'hue-rotate(180deg) · Complementary inversion' },
      { at: '100%', style: 'hue-rotate(360deg) · Full spectrum loop' },
    ],
  },
};

const timingOptions: { label: string; value: TimingFunction }[] = [
  { label: 'ease (Standard smooth start/end)', value: 'ease' },
  { label: 'linear (Constant mechanical speed)', value: 'linear' },
  { label: 'ease-in (Slow start, accelerates)', value: 'ease-in' },
  { label: 'ease-out (Fast start, decelerates)', value: 'ease-out' },
  { label: 'ease-in-out (Slow start and slow end)', value: 'ease-in-out' },
  { label: 'cubic-bezier(0.34, 1.56, 0.64, 1) [Elastic]', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { label: 'steps(4, jump-end) [8-Bit Pixelated]', value: 'steps(4, jump-end)' },
];

export default function AnimationLab() {
  const [preset, setPreset] = useState<AnimationPreset>('bounce');
  const [duration, setDuration] = useState<number>(1.4);
  const [delay, setDelay] = useState<number>(0);
  const [timingFunction, setTimingFunction] = useState<TimingFunction>('cubic-bezier(0.34, 1.56, 0.64, 1)');
  const [iterations, setIterations] = useState<Iterations>('infinite');
  const [direction, setDirection] = useState<Direction>('normal');
  const [fillMode, setFillMode] = useState<FillMode>('forwards');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animKey, setAnimKey] = useState<number>(0);

  const currentConfig = PRESET_CONFIGS[preset];

  const handleSelectPreset = (p: AnimationPreset) => {
    setPreset(p);
    const cfg = PRESET_CONFIGS[p];
    setDuration(cfg.defaultDuration);
    setTimingFunction(cfg.defaultTiming);
    setAnimKey((k) => k + 1);
  };

  const restartAnimation = () => {
    setAnimKey((k) => k + 1);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const cssOutput = useMemo(() => {
    return `${currentConfig.cssKeyframes}

.animated-element {
  /* Animation shorthand property */
  animation-name: ${currentConfig.keyframesName};
  animation-duration: ${duration}s;
  animation-timing-function: ${timingFunction};
  animation-delay: ${delay}s;
  animation-iteration-count: ${iterations};
  animation-direction: ${direction};
  animation-fill-mode: ${fillMode};
  animation-play-state: ${isPlaying ? 'running' : 'paused'};

  /* Compact 1-line shorthand: */
  /* animation: ${currentConfig.keyframesName} ${duration}s ${timingFunction} ${delay > 0 ? `${delay}s ` : ''}${iterations} ${direction} ${fillMode}; */

  will-change: transform;
}`;
  }, [currentConfig, delay, direction, duration, fillMode, isPlaying, iterations, timingFunction]);

  const tasks = [
    'Change iterations to "1" and test fill-mode: "none" vs "forwards" to see the box stay at 100%!',
    'Switch timing-function to "steps(4, jump-end)" to see retro 8-bit stepped animation.',
    'Toggle Play/Pause in mid-flight to freeze and inspect the element’s instantaneous state.',
    'Switch presets to inspect how real CSS physics like squash-and-stretch are engineered.',
  ];

  return (
    <VisualizerPanel
      title="Animation & Keyframe Lab"
      description="Design and inspect real CSS keyframe animations. Tweak timing curves, fill-modes, iterations, and physics live."
      cssOutput={cssOutput}
      tasks={tasks}
      badge="CSS3 Physics Engine"
      onReset={() => {
        handleSelectPreset('bounce');
        setDelay(0);
        setIterations('infinite');
        setDirection('normal');
        setFillMode('forwards');
        setIsPlaying(true);
      }}
      controls={
        <div className="space-y-4">
          {/* Preset Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
              Keyframe Presets:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(Object.keys(PRESET_CONFIGS) as AnimationPreset[]).map((pKey) => {
                const p = PRESET_CONFIGS[pKey];
                const isActive = preset === pKey;
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => handleSelectPreset(pKey)}
                    className={cn(
                      'text-left px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all',
                      isActive
                        ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    <div className="truncate">{p.name.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-70 truncate">{p.stageBadge}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Play/Pause & Restart */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={togglePlayPause}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all border shadow-xs',
                isPlaying
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
              )}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Animation' : 'Resume Playback'}</span>
            </button>

            <button
              type="button"
              onClick={restartAnimation}
              title="Restart from 0% frame"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
          </div>

          {/* Sliders */}
          <SliderControl
            label="Duration (animation-duration)"
            value={duration}
            min={0.2}
            max={6}
            step={0.1}
            onChange={setDuration}
            suffix="s"
          />

          <SliderControl
            label="Delay (animation-delay)"
            value={delay}
            min={0}
            max={3}
            step={0.1}
            onChange={setDelay}
            suffix="s"
          />

          {/* Timing Function */}
          <SelectControl
            label="Timing Function (animation-timing-function)"
            value={timingFunction}
            onChange={(v) => setTimingFunction(v as TimingFunction)}
            options={timingOptions}
          />

          {/* Iterations & Direction */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Iterations
              </label>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-0.5">
                {(['1', '2', '3', 'infinite'] as Iterations[]).map((it) => (
                  <button
                    key={it}
                    type="button"
                    onClick={() => {
                      setIterations(it);
                      restartAnimation();
                    }}
                    className={cn(
                      'flex-1 text-center py-1 text-xs rounded-md font-medium transition-all',
                      iterations === it
                        ? 'bg-white dark:bg-slate-800 text-primary font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    )}
                  >
                    {it}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Direction
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as Direction)}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1.5 text-slate-800 dark:text-slate-200"
              >
                <option value="normal">normal (0% ➔ 100%)</option>
                <option value="reverse">reverse (100% ➔ 0%)</option>
                <option value="alternate">alternate (Ping-Pong)</option>
                <option value="alternate-reverse">alternate-reverse</option>
              </select>
            </div>
          </div>

          {/* Fill Mode */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Fill Mode (animation-fill-mode)
              </label>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                {fillMode === 'forwards' ? 'Keeps final 100% state' : fillMode === 'none' ? 'Resets to 0%' : fillMode}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(['none', 'forwards', 'backwards', 'both'] as FillMode[]).map((fm) => (
                <button
                  key={fm}
                  type="button"
                  onClick={() => setFillMode(fm)}
                  className={cn(
                    'py-1 text-center rounded-lg border text-xs font-mono transition-all',
                    fillMode === fm
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  )}
                >
                  {fm}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              💡 <span className="font-semibold">forwards</span> maintains the style set by the last keyframe when animation finishes.
            </p>
          </div>
        </div>
      }
      preview={
        <div className="space-y-4">
          {/* Dynamically Injected Genuine CSS Keyframes */}
          <style>{`
            ${currentConfig.cssKeyframes}
            .cssviz-dynamic-target {
              animation-name: ${currentConfig.keyframesName};
              animation-duration: ${duration}s;
              animation-timing-function: ${timingFunction};
              animation-delay: ${delay}s;
              animation-iteration-count: ${iterations};
              animation-direction: ${direction};
              animation-fill-mode: ${fillMode};
              animation-play-state: ${isPlaying ? 'running' : 'paused'};
              will-change: transform, filter, box-shadow;
            }
          `}</style>

          {/* Stage Banner */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full', isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-amber-500')} />
              <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                Preset: <strong className="text-primary">{currentConfig.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
              <span>{duration}s</span>
              <span>·</span>
              <span>{iterations}</span>
              <span>·</span>
              <span className="capitalize">{isPlaying ? 'Running' : 'Paused'}</span>
            </div>
          </div>

          {/* Animation Interactive Arena */}
          <div className="relative min-h-[300px] flex items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border border-slate-200/80 dark:border-white/10 overflow-hidden p-8">
            {/* Grid Coordinates Background */}
            <div
              className="absolute inset-0 opacity-20 dark:opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #6366f1 1px, transparent 1px), radial-gradient(circle, #6366f1 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Impact floor baseline for bounce preset */}
            {preset === 'bounce' && (
              <div className="absolute bottom-12 left-12 right-12 flex flex-col items-center pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-400 dark:via-slate-600 to-transparent rounded-full" />
                <span className="font-mono text-[10px] text-slate-400 mt-1 tracking-wider uppercase">
                  Floor Contact Plane (Impact Zone)
                </span>
              </div>
            )}

            {/* The Animated Target Element */}
            <div key={animKey} className="relative z-10 flex flex-col items-center">
              {preset === 'orbit' ? (
                /* Specialized Orbit System */
                <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg flex items-center justify-center text-white font-bold text-xs">
                    Sun
                  </div>
                  <div
                    className="cssviz-dynamic-target absolute inset-0 flex items-start justify-center"
                    style={{ transformOrigin: 'center center' }}
                  >
                    <div className="w-8 h-8 -mt-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md flex items-center justify-center text-[10px] text-white font-mono">
                      Planet
                    </div>
                  </div>
                </div>
              ) : (
                /* Primary Interactive Element */
                <div
                  className="cssviz-dynamic-target w-32 h-32 rounded-2xl flex flex-col items-center justify-center p-4 text-center select-none shadow-xl cursor-pointer"
                  style={{
                    background:
                      preset === 'pulse'
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : preset === 'hue'
                        ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)'
                        : preset === 'flip3d'
                        ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white',
                  }}
                  onClick={togglePlayPause}
                >
                  <Sparkles className="w-6 h-6 mb-1 text-white/90" />
                  <span className="text-xs font-bold tracking-wide">@keyframes</span>
                  <span className="text-[10px] font-mono opacity-80 mt-0.5">{currentConfig.name.split(' ')[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Keyframe Step Inspection Ledger */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-primary" />
                Keyframe Step Breakdown
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Timing: <span className="text-primary">{timingFunction.split(' ')[0]}</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentConfig.steps.map((st, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 font-mono text-[11px]"
                >
                  <span className="text-primary font-bold">{st.at}</span>
                  <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]" title={st.style}>
                    {st.style}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}
