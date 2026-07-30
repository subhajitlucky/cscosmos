'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'

const DisplayModesLab = () => {
  const [display, setDisplay] = useState<'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'flow-root'>('block')
  const [gap, setGap] = useState(12)

  const cssOutput = useMemo(
    () => `.display-demo {
  display: ${display};
  gap: ${gap}px;
}`,
    [display, gap],
  )

  const items = ['Alpha', 'Beta', 'Gamma', 'Delta']
  const htmlMarkup = `<div class="display-demo">
  <div>Alpha</div>
  <div>Beta</div>
  <div>Gamma</div>
  <div>Delta</div>
</div>`
  const status = `Display: ${display}${display === 'flex' || display === 'grid' ? ` · gap: ${gap}px` : ''}`
  const tasks = [
    'Switch between block, inline, inline-block to see flow differences.',
    'Try flex and grid, adjust gap, and resize to see wrapping/flow-root.',
    'Use flow-root to contain floats if needed.',
  ]

  return (
    <VisualizerPanel
      title="Display Modes"
      description="Switch between inline, block, inline-block, flex, grid, and flow-root to see layout behavior."
      cssOutput={cssOutput}
      tasks={tasks}
      status={status}
      codeBlocks={[
        { label: 'CSS', code: cssOutput },
        { label: 'HTML', code: htmlMarkup },
      ]}
      onReset={() => {
        setDisplay('block')
        setGap(12)
      }}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Display</span>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-white/10 dark:bg-surface dark:text-white"
              value={display}
              onChange={(e) => setDisplay(e.target.value as typeof display)}
            >
              {['block', 'inline', 'inline-block', 'flex', 'grid', 'flow-root'].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Gap (for flex/grid)</span>
            <input
              type="range"
              min={0}
              max={40}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">{gap}px</span>
          </label>
        </div>
      }
      preview={
        <div
          className="min-h-[160px] rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/12 dark:bg-slate-900/60"
          style={{ display, gap: display === 'grid' || display === 'flex' ? `${gap}px` : undefined }}
        >
          {items.map((label) => (
            <div
              key={label}
              className="mb-2 inline-flex min-w-[80px] items-center justify-center rounded-lg bg-amber-300 px-3 py-2 text-slate-900 shadow-sm last:mb-0"
              style={display === 'grid' ? { width: '100%' } : undefined}
            >
              {label}
            </div>
          ))}
        </div>
      }
    />
  )
}

export default DisplayModesLab

