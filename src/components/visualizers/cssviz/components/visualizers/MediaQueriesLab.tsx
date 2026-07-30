'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'

const MediaQueriesLab = () => {
  const [width, setWidth] = useState(480)

  const cssOutput = useMemo(
    () => `@media (max-width: ${width}px) {
  .card { background: #fbbf24; }
}`,
    [width],
  )
  const htmlMarkup = `<div class="card">Below ${width}px, this card becomes amber.</div>`
  const status = `Breakpoint: max-width ${width}px`
  const tasks = [
    'Lower the breakpoint to see when the style would kick in.',
    'Pair with prefers-reduced-motion or color-scheme queries.',
    'Use DevTools device toolbar to simulate devices.',
  ]

  return (
    <VisualizerPanel
      title="Media Queries"
      description="Test a breakpoint-driven style change using max-width media queries."
      cssOutput={cssOutput}
      tasks={tasks}
      status={status}
      codeBlocks={[
        { label: 'CSS', code: cssOutput },
        { label: 'HTML', code: htmlMarkup },
      ]}
      onReset={() => setWidth(480)}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Breakpoint (max-width)</span>
            <input type="range" min={320} max={1024} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{width}px</span>
          </label>
        </div>
      }
      preview={
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/12 dark:bg-slate-900/60">
          <div
            className="card rounded-lg px-4 py-3 text-slate-900"
            style={{
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            }}
          >
            Below {width}px, this card would become amber (simulated breakpoint).
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Use DevTools device toolbar to test breakpoints; pair with prefers-reduced-motion or color-scheme queries.
          </p>
        </div>
      }
    />
  )
}

export default MediaQueriesLab

