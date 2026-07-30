'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'

const FloatsLab = () => {
  const [floatDir, setFloatDir] = useState<'none' | 'left' | 'right'>('left')
  const [clearfix, setClearfix] = useState(true)

  const cssOutput = useMemo(
    () => `.float-box { float: ${floatDir}; width: 160px; }
.clearfix { ${clearfix ? 'overflow: auto;' : ''} }`,
    [clearfix, floatDir],
  )
  const htmlMarkup = `<div class="clearfix">
  <div class="float-box">Floated card</div>
  <p>Lorem ipsum dolor sit amet...</p>
</div>`
  const status = `Float: ${floatDir} · Clearfix: ${clearfix ? 'on' : 'off'}`
  const tasks = [
    'Float left vs right and watch text wrap.',
    'Disable clearfix to see parent collapse.',
    'Set float to none to restore normal flow.',
  ]

  return (
    <VisualizerPanel
      title="Floats & Clearfix"
      description="Toggle float direction and clearfix to see how surrounding text wraps."
      cssOutput={cssOutput}
      tasks={tasks}
      status={status}
      codeBlocks={[
        { label: 'CSS', code: cssOutput },
        { label: 'HTML', code: htmlMarkup },
      ]}
      onReset={() => {
        setFloatDir('left')
        setClearfix(true)
      }}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Float</span>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-white/10 dark:bg-surface dark:text-white"
              value={floatDir}
              onChange={(e) => setFloatDir(e.target.value as typeof floatDir)}
            >
              {['none', 'left', 'right'].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={clearfix} onChange={(e) => setClearfix(e.target.checked)} />
            <span>Apply clearfix (overflow:auto)</span>
          </label>
        </div>
      }
      preview={
        <div className={`space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 dark:border-white/12 dark:bg-slate-900/60 ${clearfix ? 'clearfix' : ''}`}>
          <div
            className="float-box rounded-lg bg-amber-400 px-3 py-2 text-slate-900 shadow-sm"
            style={{ float: floatDir !== 'none' ? floatDir : undefined }}
          >
            Floated card
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porttitor, quam a vulputate volutpat, elit ante
            condimentum magna, nec ultrices ligula nisi nec leo. Vivamus placerat magna vitae dui.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Donec euismod, nisl eget consectetur tempor, nisl nunc aliquet nibh, id ultrices nisl nunc eget lorem.
          </p>
          <div className="clear-both" />
        </div>
      }
    />
  )
}

export default FloatsLab

