'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'

const ContainerQueriesLab = () => {
  const [minWidth, setMinWidth] = useState(320)

  const cssOutput = useMemo(
    () => `.card {
  container-type: inline-size;
}
@container (min-width: ${minWidth}px) {
  .card { background: #fbbf24; }
}`,
    [minWidth],
  )
  const htmlMarkup = `<div class="card">Resize parent; above ${minWidth}px, container query applies.</div>`
  const status = `Container query: min-width ${minWidth}px`
  const tasks = [
    'Increase the min width and note when the style flips.',
    'Compare to viewport media queries: this is parent-sized.',
    'Use container-type and @container together to scope styles.',
  ]

  return (
    <VisualizerPanel
      title="Container Queries"
      description="Simulate a component that changes style based on its container width."
      cssOutput={cssOutput}
      tasks={tasks}
      status={status}
      codeBlocks={[
        { label: 'CSS', code: cssOutput },
        { label: 'HTML', code: htmlMarkup },
      ]}
      onReset={() => setMinWidth(320)}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Min container width</span>
            <input
              type="range"
              min={240}
              max={600}
              value={minWidth}
              onChange={(e) => setMinWidth(Number(e.target.value))}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">{minWidth}px</span>
          </label>
        </div>
      }
      preview={
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/12 dark:bg-slate-900/60">
          <div
            className="card rounded-lg px-4 py-3 text-slate-900"
            style={{
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              width: '100%',
              maxWidth: `${minWidth + 80}px`,
            }}
          >
            Resize me via the range; above {minWidth}px, apply the container query style.
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Container queries react to parent size, not viewport. Use container-type and @container rules.
          </p>
        </div>
      }
    />
  )
}

export default ContainerQueriesLab

