'use client';
import { useMemo, useState } from 'react'
import { motion, type Easing } from 'framer-motion'
import VisualizerPanel from './VisualizerPanel'
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl'
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl'
import ToggleGroup from '@/components/visualizers/cssviz/components/controls/ToggleGroup'

type TimingFunction = 'ease-in-out' | 'linear' | 'ease-out' | 'cubic-bezier(0.65,0,0.35,1)'

const easingOptions: { label: string; value: TimingFunction }[] = [
  { label: 'ease-in-out', value: 'ease-in-out' },
  { label: 'linear', value: 'linear' },
  { label: 'ease-out', value: 'ease-out' },
  { label: 'cubic-bezier(0.65,0,0.35,1)', value: 'cubic-bezier(0.65,0,0.35,1)' },
]
type Iterations = 'infinite' | '1' | '2' | '3'
type Direction = 'normal' | 'alternate'

const AnimationLab = () => {
  const [duration, setDuration] = useState(1.8)
  const [delay, setDelay] = useState(0.1)
  const [iterations, setIterations] = useState<Iterations>('infinite')
  const [direction, setDirection] = useState<Direction>('alternate')
  const [timingFunction, setTimingFunction] = useState<TimingFunction>('ease-in-out')

  const cssOutput = useMemo(
    () => `
@keyframes floaty {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(40px, -30px, 0) scale(1.05); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
.orb {
  animation: floaty ${duration}s ${timingFunction} ${delay}s ${iterations} ${direction};
  will-change: transform;
}
`,
    [delay, direction, duration, iterations, timingFunction],
  )

  const reset = () => {
    setDuration(1.8)
    setDelay(0.1)
    setIterations('infinite')
    setDirection('alternate')
    setTimingFunction('ease-in-out')
  }

  const repeat = iterations === 'infinite' ? Infinity : Number(iterations)
  const easingMap: Record<TimingFunction, Easing> = {
    'ease-in-out': 'easeInOut',
    linear: 'linear',
    'ease-out': 'easeOut',
    'cubic-bezier(0.65,0,0.35,1)': [0.65, 0, 0.35, 1],
  }

  return (
    <VisualizerPanel
      title="Animation Studio"
      description="Control duration, easing, delay, and iteration. Watch the orb animate smoothly while the CSS updates live."
      cssOutput={cssOutput.trim()}
      onReset={reset}
      controls={
        <>
          <SliderControl
            label="Duration"
            value={duration}
            min={0.3}
            max={4}
            step={0.1}
            onChange={setDuration}
            suffix="s"
          />
          <SliderControl label="Delay" value={delay} min={0} max={2} step={0.05} onChange={setDelay} suffix="s" />
          <ToggleGroup
            label="Iterations"
            value={iterations}
            options={['1', '2', '3', 'infinite']}
            onChange={(value) => setIterations(value as Iterations)}
          />
          <ToggleGroup
            label="Direction"
            value={direction}
            options={['normal', 'alternate']}
            onChange={(value) => setDirection(value as Direction)}
          />
          <SelectControl
            label="Timing function"
            value={timingFunction}
            onChange={(value) => setTimingFunction(value as TimingFunction)}
            options={easingOptions}
          />
        </>
      }
      preview={
        <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.1),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.12),transparent_40%)]" />
          <motion.div
            className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-glow"
            animate={{
              x: [0, 40, 0],
              y: [0, -30, 0],
              rotate: [0, 6, -4, 0],
            }}
            transition={{
              duration,
              delay,
              ease: easingMap[timingFunction],
              repeat,
              repeatType: direction === 'alternate' ? 'reverse' : 'loop',
            }}
          >
            <div className="h-6 w-6 rounded-full bg-white/80 blur-md" />
          </motion.div>
        </div>
      }
    />
  )
}

export default AnimationLab

