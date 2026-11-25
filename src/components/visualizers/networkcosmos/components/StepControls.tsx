'use client';

import { useEffect, useRef } from 'react';

export interface StepControlsProps {
  playing: boolean;
  onToggle: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (n: number) => void;
  disabled?: boolean;
}

const SPEEDS = [0.5, 1, 2, 4];

const BUTTON_CLASS =
  'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 transition-colors motion-reduce:transition-none hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:outline-sky-400';

export function StepControls({
  playing,
  onToggle,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  disabled = false,
}: StepControlsProps) {
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      // Only claim shortcuts while focus is inside this controls group; the
      // rest of the page keeps normal Space and arrow-key scrolling.
      const root = controlsRef.current;
      if (!root || !(event.target instanceof Node) || !root.contains(event.target)) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      // Let focused form controls and editable regions keep their own key behaviour.
      if (
        event.target instanceof HTMLElement &&
        event.target.closest('input, select, textarea, button, [contenteditable="true"]')
      ) {
        return;
      }

      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        onToggle();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onStep();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onToggle, onStep, onReset]);

  return (
    <div
      ref={controlsRef}
      role="group"
      aria-label="Journey playback controls"
      tabIndex={0}
      className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-300 bg-white p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:focus-visible:outline-sky-400"
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={playing ? 'Pause journey playback' : 'Play journey playback'}
        aria-keyshortcuts="Space"
        className={BUTTON_CLASS}
      >
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span> {playing ? 'Pause' : 'Play'}
      </button>
      <button
        type="button"
        onClick={onStep}
        disabled={disabled}
        aria-label="Step to the next hop"
        aria-keyshortcuts="ArrowRight"
        className={BUTTON_CLASS}
      >
        Step <span aria-hidden="true">→</span>
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        aria-label="Reset the journey"
        aria-keyshortcuts="ArrowLeft"
        className={BUTTON_CLASS}
      >
        Reset <span aria-hidden="true">↺</span>
      </button>
      <label className="ml-auto flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        Speed
        <select
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          disabled={disabled}
          aria-label="Playback speed"
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:outline-sky-400"
        >
          {!SPEEDS.includes(speed) && (
            <option value={speed}>{speed}&times;</option>
          )}
          {SPEEDS.map((option) => (
            <option key={option} value={option}>
              {option}&times;
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
