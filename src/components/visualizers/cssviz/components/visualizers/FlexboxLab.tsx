'use client';
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import VisualizerPanel from './VisualizerPanel'
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl'
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl'
import ToggleGroup from '@/components/visualizers/cssviz/components/controls/ToggleGroup'
import SwitchControl from '@/components/visualizers/cssviz/components/controls/SwitchControl'

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'

const flexItems = ['Nebula', 'Quasar', 'Photon', 'Aurora', 'Pulse', 'Nova']

const FlexboxLab = () => {
  const [justifyContent, setJustifyContent] = useState('space-between')
  const [alignItems, setAlignItems] = useState('center')
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('row')
  const [flexWrap, setFlexWrap] = useState<FlexWrap>('wrap')
  const [gap, setGap] = useState(16)
  const [animated, setAnimated] = useState(true)

  const cssOutput = useMemo(
    () => `
.flex-lab {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}
`,
    [alignItems, flexDirection, flexWrap, gap, justifyContent],
  )

  const reset = () => {
    setJustifyContent('space-between')
    setAlignItems('center')
    setFlexDirection('row')
    setFlexWrap('wrap')
    setGap(16)
    setAnimated(true)
  }

  return (
    <VisualizerPanel
      title="Flexbox Visualizer"
      description="Manipulate axes, spacing, and wrapping. Drag the blocks to see how flex recalculates layout on the fly."
      cssOutput={cssOutput.trim()}
      onReset={reset}
      controls={
        <>
          <SelectControl
            label="Justify content"
            value={justifyContent}
            onChange={setJustifyContent}
            options={[
              { label: 'flex-start', value: 'flex-start' },
              { label: 'center', value: 'center' },
              { label: 'space-between', value: 'space-between' },
              { label: 'space-around', value: 'space-around' },
              { label: 'space-evenly', value: 'space-evenly' },
            ]}
          />
          <SelectControl
            label="Align items"
            value={alignItems}
            onChange={setAlignItems}
            options={[
              { label: 'flex-start', value: 'flex-start' },
              { label: 'center', value: 'center' },
              { label: 'flex-end', value: 'flex-end' },
              { label: 'stretch', value: 'stretch' },
            ]}
          />
          <ToggleGroup
            label="Flex direction"
            value={flexDirection}
            options={['row', 'row-reverse', 'column', 'column-reverse']}
            onChange={(value) => setFlexDirection(value as FlexDirection)}
          />
          <ToggleGroup
            label="Wrapping"
            value={flexWrap}
            options={['nowrap', 'wrap', 'wrap-reverse']}
            onChange={(value) => setFlexWrap(value as FlexWrap)}
          />
          <SliderControl label="Gap" value={gap} min={0} max={48} step={2} onChange={setGap} suffix="px" />
          <SwitchControl label="Animate movement" checked={animated} onChange={setAnimated} />
        </>
      }
      preview={
        <div className="flex min-h-[240px] flex-1 flex-col gap-4">
          <div
            className="flex flex-1 rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-white/10 dark:bg-black/25"
            style={{ justifyContent, alignItems, flexDirection, flexWrap, gap }}
          >
            {flexItems.map((item, index) => (
              <motion.div
                key={item}
                drag
                dragMomentum={false}
                className="flex min-w-[120px] flex-none cursor-grab select-none items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 px-4 py-2 text-slate-900 shadow-glow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                animate={
                  animated
                    ? {
                      y: [0, -6, 0],
                      transition: { duration: 4 + index * 0.3, repeat: Infinity, ease: 'easeInOut' },
                    }
                    : false
                }
              >
                {item}
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag tiles to reorder; wrapping and axis settings will reflow the layout instantly.
          </p>
        </div>
      }
    />
  )
}

export default FlexboxLab

