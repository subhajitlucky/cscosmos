'use client';
import { useMemo, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'
import SliderControl from '@/components/visualizers/cssviz/components/controls/SliderControl'
import ToggleGroup from '@/components/visualizers/cssviz/components/controls/ToggleGroup'
import SelectControl from '@/components/visualizers/cssviz/components/controls/SelectControl'

const sampleText =
  'CSS Universe gives you responsive controls, variable fonts, and instant visual feedback so you understand every property at a glance.'

const TypographyLab = () => {
  const [fontSize, setFontSize] = useState(22)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [letterSpacing, setLetterSpacing] = useState(0.2)
  const [fontWeight, setFontWeight] = useState('600')
  const [fontFamily, setFontFamily] = useState('Space Grotesk, Inter, sans-serif')

  const cssOutput = useMemo(
    () => `.text-lab {
  font-family: ${fontFamily};
  font-size: ${fontSize}px;
  line-height: ${lineHeight};
  letter-spacing: ${letterSpacing}ch;
  font-weight: ${fontWeight};
  font-variation-settings: "wght" ${fontWeight};
}`,
    [fontFamily, fontSize, fontWeight, letterSpacing, lineHeight],
  )

  const htmlMarkup = `<div class="text-lab">
  <h4>Rhythm & Readability</h4>
  <p>${sampleText}</p>
</div>`

  const status = `${fontSize}px / ${lineHeight} height · weight: ${fontWeight}`
  const tasks = [
    'Increase line-height to improve readability of body text.',
    'Adjust weight to see variable font interpolation.',
    'Negative letter-spacing can tighten headlines; loose spacing helps caps.',
  ]

  const reset = () => {
    setFontSize(22)
    setLineHeight(1.6)
    setLetterSpacing(0.2)
    setFontWeight('600')
    setFontFamily('Space Grotesk, Inter, sans-serif')
  }

  return (
    <VisualizerPanel
      title="Typography Lab"
      description="Balance readability and style with controlled rhythm. Variable font axes react in real time to weight changes."
      cssOutput={cssOutput}
      tasks={tasks}
      status={status}
      codeBlocks={[
        { label: 'CSS', code: cssOutput },
        { label: 'HTML', code: htmlMarkup },
      ]}
      onReset={reset}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <SliderControl label="Font size" value={fontSize} min={14} max={48} onChange={setFontSize} suffix="px" />
          <SliderControl
            label="Line height"
            value={lineHeight}
            min={1}
            max={2.2}
            step={0.05}
            onChange={setLineHeight}
          />
          <SliderControl
            label="Letter spacing"
            value={letterSpacing}
            min={-0.1}
            max={0.6}
            step={0.05}
            onChange={setLetterSpacing}
            suffix="ch"
          />
          <ToggleGroup
            label="Font weight (variable axis)"
            value={fontWeight}
            options={['400', '500', '600', '700']}
            onChange={setFontWeight}
          />
          <SelectControl
            label="Font family"
            value={fontFamily}
            onChange={setFontFamily}
            options={[
              { label: 'Space Grotesk + Inter', value: 'Space Grotesk, Inter, sans-serif' },
              { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
              { label: 'serif sample', value: 'Georgia, Times, serif' },
            ]}
          />
        </div>
      }
      preview={
        <div className="space-y-3">
          <div
            className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black/20"
            style={{
              fontFamily,
              fontSize,
              lineHeight,
              letterSpacing: `${letterSpacing}ch`,
              fontWeight: Number(fontWeight),
              fontVariationSettings: `"wght" ${fontWeight}`,
            }}
          >
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Live preview</p>
            <h4 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-white">Rhythm & Readability</h4>
            <p className="text-slate-700 dark:text-slate-200">{sampleText}</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Line-height sets vertical rhythm; letter-spacing uses character units (ch) to remain proportional.
          </p>
        </div>
      }
    />
  )
}

export default TypographyLab
