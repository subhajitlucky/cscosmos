'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'

const PositioningLab = () => {
  const [pos, setPos] = useState<'static' | 'relative' | 'absolute' | 'sticky' | 'fixed'>('relative')
  const [offset, setOffset] = useState(20)

  const cssOutput = useMemo(
    () => `.card {
  position: ${pos};
  top: ${pos === 'static' ? 0 : offset}px;
  left: ${pos === 'static' ? 0 : offset}px;
}`,
    [offset, pos],
  )
  const htmlMarkup = `<div class="stage">
  <div class="card">Positioned box (${pos})</div>
</div>`
  const status = `Position: ${pos}${pos !== 'static' ? ` · offset: ${offset}px` : ''}`
  const tasks = [
    'Switch between static/relative to see offsets applied on relative.',
    'Try absolute: note it is positioned relative to the nearest positioned ancestor.',
    'Try fixed/sticky and scroll to observe behavior (sticky respects threshold).',
  ]

  return (
    <VisualizerPanel
      title="Positioning"
      description="Switch between static, relative, absolute, sticky, and fixed to see how offsets and stacking change."
      cssOutput={cssOutput}
      tasks={tasks}
      status={status}
      codeBlocks={[
        { label: 'CSS', code: cssOutput },
        { label: 'HTML', code: htmlMarkup },
      ]}
      onReset={() => {
        setPos('relative')
        setOffset(20)
      }}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Position</span>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-white/10 dark:bg-surface dark:text-white"
              value={pos}
              onChange={(e) => setPos(e.target.value as typeof pos)}
            >
              {['static', 'relative', 'absolute', 'sticky', 'fixed'].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Offset (top/left)</span>
            <input
              type="range"
              min={0}
              max={120}
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              disabled={pos === 'static'}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">{offset}px</span>
          </label>
        </div>
      }
      preview={
        <div className="relative min-h-[220px] rounded-xl border border-slate-200/80 bg-white p-4 dark:border-white/12 dark:bg-slate-900/60">
          <div className="absolute inset-3 rounded-lg border border-dashed border-slate-300/60 dark:border-white/15" />
          <div
            className="card rounded-lg bg-amber-400 px-4 py-3 text-slate-900 shadow-md"
            style={{
              position: pos,
              top: pos === 'static' ? undefined : offset,
              left: pos === 'static' ? undefined : offset,
              right: undefined,
              bottom: undefined,
            }}
          >
            Positioned box ({pos})
          </div>
          <p className="mt-28 text-sm text-slate-600 dark:text-slate-300">
            Observe stacking and flow changes as you toggle the position and offsets.
          </p>
        </div>
      }
    />
  )
}

export default PositioningLab

