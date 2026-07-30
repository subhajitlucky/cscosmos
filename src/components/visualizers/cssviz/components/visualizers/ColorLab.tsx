'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl'
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl'
import { hsl } from '@/components/visualizers/cssviz/utils/color'

type GradientType = 'linear' | 'radial'

const ColorLab = () => {
  const [hue, setHue] = useState(220)
  const [secondaryHue, setSecondaryHue] = useState(160)
  const [saturation, setSaturation] = useState(70)
  const [lightness, setLightness] = useState(60)
  const [angle, setAngle] = useState(135)
  const [type, setType] = useState<GradientType>('linear')

  const colorA = hsl(hue, saturation, lightness)
  const colorB = hsl(secondaryHue, Math.min(100, saturation + 10), Math.max(10, lightness - 10))
  const gradient =
    type === 'linear'
      ? `linear-gradient(${angle}deg, ${colorA}, ${colorB})`
      : `radial-gradient(circle at 30% 30%, ${colorA}, ${colorB})`

  const cssOutput = useMemo(
    () => `
:root {
  --primary: ${colorA};
  --accent: ${colorB};
}
.gradient-bg {
  background: ${gradient};
}
`,
    [colorA, colorB, gradient],
  )

  const reset = () => {
    setHue(220)
    setSecondaryHue(160)
    setSaturation(70)
    setLightness(60)
    setAngle(135)
    setType('linear')
  }

  return (
    <VisualizerPanel
      title="Colors & Gradients"
      description="Blend hues with HSL sliders and build gradients. Real-time CSS variables let you reuse the palette anywhere."
      cssOutput={cssOutput.trim()}
      onReset={reset}
      controls={
        <>
          <SliderControl label="Hue A" value={hue} min={0} max={360} onChange={setHue} suffix="°" />
          <SliderControl label="Hue B" value={secondaryHue} min={0} max={360} onChange={setSecondaryHue} suffix="°" />
          <SliderControl label="Saturation" value={saturation} min={0} max={100} onChange={setSaturation} suffix="%" />
          <SliderControl label="Lightness" value={lightness} min={0} max={100} onChange={setLightness} suffix="%" />
          <SliderControl label="Gradient angle" value={angle} min={0} max={360} onChange={setAngle} suffix="°" />
          <SelectControl
            label="Gradient type"
            value={type}
            onChange={(value) => setType(value as GradientType)}
            options={[
              { label: 'Linear', value: 'linear' },
              { label: 'Radial', value: 'radial' },
            ]}
          />
        </>
      }
      preview={
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="absolute inset-0" style={{ background: gradient }} />
              <div className="relative z-10 space-y-2 text-sm font-semibold text-white">
                <p>Gradient preview</p>
                <p className="text-xs text-white/70">Variables: --primary, --accent</p>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4">
              <div
                className="h-40 w-40 rounded-full border border-white/20 shadow-glow"
                style={{
                  background: `conic-gradient(${colorA}, ${colorB}, ${colorA})`,
                }}
              />
            </div>
          </div>
          <div className="grid gap-2 text-xs text-slate-300 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span>Primary</span>
              <span className="font-mono text-primary">{colorA}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span>Accent</span>
              <span className="font-mono text-emerald-300">{colorB}</span>
            </div>
          </div>
        </div>
      }
    />
  )
}

export default ColorLab

