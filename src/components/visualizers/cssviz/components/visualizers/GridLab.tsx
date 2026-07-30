'use client';
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import VisualizerPanel from './VisualizerPanel'
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl'
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl'
import SwitchControl from '@/components/visualizers/cssviz/components/controls/SwitchControl'

type GridAlign = 'stretch' | 'start' | 'center' | 'end'

const gridItems = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const GridLab = () => {
  const [cols, setCols] = useState(3)
  const [rows, setRows] = useState(2)
  const [gap, setGap] = useState(16)
  const [autoFit, setAutoFit] = useState(true)
  const [align, setAlign] = useState<GridAlign>('stretch')

  const templateColumns = autoFit ? `repeat(auto-fit, minmax(140px, 1fr))` : `repeat(${cols}, minmax(80px, 1fr))`
  const templateRows = `repeat(${rows}, 120px)`

  const cssOutput = useMemo(
    () => `
.grid-lab {
  display: grid;
  grid-template-columns: ${templateColumns};
  grid-template-rows: ${templateRows};
  gap: ${gap}px;
  align-items: ${align};
}
`,
    [align, gap, templateColumns, templateRows],
  )

  const reset = () => {
    setCols(3)
    setRows(2)
    setGap(16)
    setAutoFit(true)
    setAlign('stretch')
  }

  return (
    <VisualizerPanel
      title="Grid Visualizer"
      description="Tune templates with repeat(), minmax(), and implicit sizing. Auto-fit fills available space while respecting minimum tracks."
      cssOutput={cssOutput.trim()}
      onReset={reset}
      controls={
        <>
          <SwitchControl label="Auto-fit columns" checked={autoFit} onChange={setAutoFit} />
          {!autoFit && (
            <SliderControl label="Columns" value={cols} min={1} max={6} onChange={setCols} suffix=" tracks" />
          )}
          <SliderControl label="Rows" value={rows} min={1} max={4} onChange={setRows} suffix=" tracks" />
          <SliderControl label="Gap" value={gap} min={0} max={36} step={2} onChange={setGap} suffix="px" />
          <SelectControl
            label="Align items"
            value={align}
            onChange={(value) => setAlign(value as GridAlign)}
            options={[
              { label: 'stretch', value: 'stretch' },
              { label: 'start', value: 'start' },
              { label: 'center', value: 'center' },
              { label: 'end', value: 'end' },
            ]}
          />
        </>
      }
      preview={
        <div className="space-y-3">
          <div
            className="grid min-h-[260px] rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/12 dark:bg-slate-900/40"
            style={{ gap: `${gap}px`, gridTemplateColumns: templateColumns, gridTemplateRows: templateRows, alignItems: align }}
          >
            {gridItems.map((item) => (
              <motion.div
                key={item}
                layout
                className="flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 text-lg font-semibold text-slate-900 shadow-glow"
                whileHover={{ scale: 1.03 }}
              >
                {item}
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Auto-fit compresses or expands tracks to fill the row; toggle it off to compare with fixed repeat() counts.
          </p>
        </div>
      }
    />
  )
}

export default GridLab

