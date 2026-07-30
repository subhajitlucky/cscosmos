'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'

const MultiColumnLab = () => {
  const [count, setCount] = useState(3)
  const [gap, setGap] = useState(16)

  const cssOutput = useMemo(
    () => `.multi-col {
  column-count: ${count};
  column-gap: ${gap}px;
}`,
    [count, gap],
  )
  const htmlMarkup = `<div class="multi-col">
  <p>Multi-column layout lets text flow into parallel columns...</p>
</div>`
  const status = `Columns: ${count} · Gap: ${gap}px`
  const tasks = [
    'Reduce column count to 1 to see single-flow text.',
    'Increase gap to see spacing impact on readability.',
    'Try 3-4 columns and resize to observe balancing.',
  ]

  const text =
    'Multi-column layout lets text flow into parallel columns. Adjust column-count and column-gap to see balancing.'

  return (
    <VisualizerPanel
      title="Multi-Column Layout"
      description="Balance text across multiple columns; tweak column count and gap."
      cssOutput={cssOutput}
      tasks={tasks}
      status={status}
      codeBlocks={[
        { label: 'CSS', code: cssOutput },
        { label: 'HTML', code: htmlMarkup },
      ]}
      onReset={() => {
        setCount(3)
        setGap(16)
      }}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Column count</span>
            <input
              type="range"
              min={1}
              max={4}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">{count}</span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Column gap</span>
            <input type="range" min={8} max={40} value={gap} onChange={(e) => setGap(Number(e.target.value))} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{gap}px</span>
          </label>
        </div>
      }
      preview={
        <div
          className="multi-col rounded-xl border border-slate-200/80 bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-white/12 dark:bg-slate-900/60 dark:text-slate-200"
          style={{ columnCount: count, columnGap: `${gap}px` }}
        >
          {text} {text} {text} {text}
        </div>
      }
    />
  )
}

export default MultiColumnLab

