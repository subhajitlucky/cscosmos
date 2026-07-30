'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'

const UnitsFunctionsLab = () => {
  const [min, setMin] = useState(14)
  const [max, setMax] = useState(28)

  const cssOutput = useMemo(
    () => `.utility {
  font-size: clamp(${min}px, 1vw + 1rem, ${max}px);
  width: min(90vw, 640px);
}`,
    [max, min],
  )
  const htmlMarkup = `<div class="utility">Constraint-based sizing with clamp(), min(), and viewport units.</div>`
  const status = `Clamp: ${min}px min → ${max}px max`
  const tasks = [
    'Increase max to see upper bound loosen.',
    'Drop min to watch minimum size shrink on narrow viewports.',
    'Notice width uses min() to cap container across breakpoints.',
  ]

  return (
    <VisualizerPanel
      title="Units & Functions"
      description="Play with clamp(), min(), and viewport units to build constraint-based sizing."
      cssOutput={cssOutput}
      tasks={tasks}
      status={status}
      codeBlocks={[
        { label: 'CSS', code: cssOutput },
        { label: 'HTML', code: htmlMarkup },
      ]}
      onReset={() => {
        setMin(14)
        setMax(28)
      }}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Min size (px)</span>
            <input type="range" min={12} max={20} value={min} onChange={(e) => setMin(Number(e.target.value))} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{min}px</span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Max size (px)</span>
            <input type="range" min={24} max={40} value={max} onChange={(e) => setMax(Number(e.target.value))} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{max}px</span>
          </label>
        </div>
      }
      preview={
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/12 dark:bg-slate-900/60">
          <div
            className="utility rounded-lg bg-amber-100 px-3 py-2 text-slate-900 dark:bg-amber-500/20 dark:text-white"
            style={{
              fontSize: `clamp(${min}px, 1vw + 1rem, ${max}px)`,
              width: 'min(90vw, 640px)',
            }}
          >
            Constraint-based sizing with clamp(), min(), and viewport units.
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Adjust min/max to see the clamped range. Width uses min() to cap the container across breakpoints.
          </p>
        </div>
      }
    />
  )
}

export default UnitsFunctionsLab

