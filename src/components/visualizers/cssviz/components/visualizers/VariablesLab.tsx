'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl'
import SwitchControl from '@/components/visualizers/cssviz/components/controls/SwitchControl'

const VariablesLab = () => {
  const [primary, setPrimary] = useState('#7c3aed')
  const [accent, setAccent] = useState('#22d3ee')
  const [radius, setRadius] = useState(16)
  const [gap, setGap] = useState(14)
  const [elevated, setElevated] = useState(true)

  const cssOutput = useMemo(
    () => `
:root {
  --primary: ${primary};
  --accent: ${accent};
  --radius: ${radius}px;
  --gap: ${gap}px;
  --elevation: ${elevated ? '0 24px 60px rgba(0,0,0,0.35)' : '0 6px 20px rgba(0,0,0,0.18)'};
}
.card {
  background: color-mix(in srgb, var(--primary) 35%, #0b1221);
  border-radius: var(--radius);
  gap: var(--gap);
  box-shadow: var(--elevation);
}
`,
    [accent, elevated, gap, primary, radius],
  )

  const reset = () => {
    setPrimary('#7c3aed')
    setAccent('#22d3ee')
    setRadius(16)
    setGap(14)
    setElevated(true)
  }

  return (
    <VisualizerPanel
      title="Custom Properties"
      description="Tweak design tokens as CSS variables. Values cascade automatically and update the live card."
      cssOutput={cssOutput.trim()}
      onReset={reset}
      controls={
        <>
          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            <span>Primary color</span>
            <input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="h-8 w-14 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            <span>Accent color</span>
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="h-8 w-14 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </label>
          <SliderControl label="Radius" value={radius} min={0} max={30} onChange={setRadius} suffix="px" />
          <SliderControl label="Gap" value={gap} min={6} max={30} onChange={setGap} suffix="px" />
          <SwitchControl label="High elevation" checked={elevated} onChange={setElevated} />
        </>
      }
      preview={
        <div className="grid gap-3 md:grid-cols-[1.2fr,1fr]">
          <div
            className="card grid min-h-[220px] grid-rows-[auto,1fr] rounded-xl border border-white/10 p-5 text-white transition-all"
            style={{
              background: `linear-gradient(135deg, ${primary}, ${accent})`,
              borderRadius: radius,
              gap,
              boxShadow: elevated ? '0 24px 60px rgba(0,0,0,0.35)' : '0 6px 20px rgba(0,0,0,0.18)',
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">Tokenized UI</p>
              <span className="rounded-full bg-black/20 px-3 py-1 text-xs">:root</span>
            </div>
            <div className="space-y-2 rounded-xl bg-black/25 p-4">
              <p className="text-sm text-white/80">Gap driven grid</p>
              <div
                className="grid grid-cols-2 gap-2 text-xs"
                style={{ gap: `${gap}px`, borderRadius: radius, color: 'white' }}
              >
                <span className="rounded-lg bg-white/20 px-3 py-2">--primary</span>
                <span className="rounded-lg bg-white/20 px-3 py-2">--accent</span>
                <span className="rounded-lg bg-white/20 px-3 py-2">--radius</span>
                <span className="rounded-lg bg-white/20 px-3 py-2">--gap</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
            <p>Variables cascade and can be overridden at any scope. Use them to theme components without refactoring markup.</p>
            <p className="font-mono text-primary/80">color-mix()</p>
            <p className="text-slate-400">Blend tokens for glass surfaces without maintaining extra swatches.</p>
          </div>
        </div>
      }
    />
  )
}

export default VariablesLab

