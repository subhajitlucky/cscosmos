'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'

const ResponsiveDesignLab = () => {
  const [min, setMin] = useState(16)
  const [max, setMax] = useState(32)

  const cssOutput = useMemo(
    () => `.responsive-headline {
  font-size: clamp(${min}px, 2vw + 1rem, ${max}px);
  padding: clamp(12px, 2vw, 20px);
}`,
    [max, min],
  )
  const htmlMarkup = `<h3 class="responsive-headline">Fluid headline scales with viewport</h3>`
  const status = `Clamp: min ${min}px · max ${max}px`
  const tasks = [
    'Tighten the min/max to see the clamped range shrink.',
    'Widen the range and resize the viewport to observe scaling.',
    'Pair clamp() with padding clamp for consistent rhythm.',
  ]

  return (
    <VisualizerPanel
      title="Responsive Design"
      description="Use clamp() to scale typography and spacing fluidly between breakpoints."
      cssOutput={cssOutput}
      tasks={tasks}
      status={status}
      codeBlocks={[
        { label: 'CSS', code: cssOutput },
        { label: 'HTML', code: htmlMarkup },
      ]}
      onReset={() => {
        setMin(16)
        setMax(32)
      }}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Min size (px)</span>
            <input type="range" min={12} max={24} value={min} onChange={(e) => setMin(Number(e.target.value))} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{min}px</span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Max size (px)</span>
            <input type="range" min={24} max={48} value={max} onChange={(e) => setMax(Number(e.target.value))} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{max}px</span>
          </label>
        </div>
      }
      preview={
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/12 dark:bg-slate-900/60">
          <h3
            className="responsive-headline rounded-lg bg-amber-100 px-3 py-2 text-slate-900 dark:bg-amber-500/20 dark:text-white"
            style={{
              fontSize: `clamp(${min}px, 2vw + 1rem, ${max}px)`,
              padding: 'clamp(12px, 2vw, 20px)',
            }}
          >
            Fluid headline scales with viewport
          </h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Resize to see fluid typography and padding change. Use clamp() for predictable min/max bounds.
          </p>
        </div>
      }
    />
  )
}

export default ResponsiveDesignLab

