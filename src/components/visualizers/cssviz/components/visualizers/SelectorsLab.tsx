'use client';
import { useEffect, useMemo, useRef, useState } from 'react'
import VisualizerPanel from './VisualizerPanel'

type SelectorOption = {
  label: string
  selector: string
}

const options: SelectorOption[] = [
  { label: 'Class chain (.card .title)', selector: '.card .title' },
  { label: 'ID + desc (.hero #cta)', selector: '.hero #cta' },
  { label: 'Direct child (section > p)', selector: 'section > p' },
  { label: 'Nth-child (.list li:nth-child(2))', selector: '.list li:nth-child(2)' },
  { label: 'Relational :has (.card:has(.badge))', selector: '.card:has(.badge)' },
  { label: 'Low specificity :where (.nav :where(a))', selector: '.nav :where(a)' },
]

const computeSpecificity = (sel: string) => {
  // Very rough: ids, classes/attributes/pseudo-classes, elements/pseudo-elements
  const ids = (sel.match(/#/g) || []).length
  const classes = (sel.match(/\./g) || []).length + (sel.match(/\[/g) || []).length
  const pseudosClass = (sel.match(/:(?!:)/g) || []).length
  const pseudosElement = (sel.match(/::/g) || []).length
  const elements = (sel.match(/\b[a-zA-Z]+\b/g) || []).length
  return { a: ids, b: classes + pseudosClass, c: elements + pseudosElement }
}

const SelectorsLab = () => {
  const [selector, setSelector] = useState(options[0].selector)
  const [customSelector, setCustomSelector] = useState('')
  const previewRef = useRef<HTMLDivElement | null>(null)

  const activeSelector = customSelector.trim() || selector
  const specificity = useMemo(() => computeSpecificity(activeSelector), [activeSelector])

  useEffect(() => {
    const root = previewRef.current
    if (!root) return
    root.querySelectorAll('.matched').forEach((el) => el.classList.remove('matched'))
    try {
      root.querySelectorAll(activeSelector).forEach((el) => el.classList.add('matched'))
    } catch {
      // ignore invalid selectors
    }
  }, [activeSelector])

  const cssOutput = useMemo(
    () => `${activeSelector} {
  outline: 2px solid #f59e0b;
  background: #fef3c7;
  color: #0f172a;
}`,
    [activeSelector],
  )

  return (
    <VisualizerPanel
      title="Selectors & Specificity"
      description="Pick a selector to highlight matched nodes and see its specificity tuple."
      cssOutput={cssOutput}
      onReset={() => {
        setSelector(options[0].selector)
        setCustomSelector('')
      }}
      controls={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Selector</span>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-white/10 dark:bg-surface dark:text-white"
              value={selector}
              onChange={(e) => {
                setSelector(e.target.value)
                setCustomSelector('')
              }}
            >
              {options.map((opt) => (
                <option key={opt.selector} value={opt.selector}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800 dark:text-white">Or type a custom selector</span>
            <input
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-white/10 dark:bg-surface dark:text-white"
              placeholder="e.g. .card .title, .nav a, section > p"
              value={customSelector}
              onChange={(e) => setCustomSelector(e.target.value)}
            />
          </label>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Specificity: ({specificity.a}, {specificity.b}, {specificity.c}) — ids, classes/pseudo-classes, elements.
          </div>
        </div>
      }
      preview={
        <div className="grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
          <div
            ref={previewRef}
            className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-4 text-sm text-slate-900 shadow-sm dark:border-white/12 dark:bg-slate-900/60 dark:text-slate-100"
          >
            <style>{`.matched { outline: 2px solid #f59e0b; background: #fef3c7; color: #0f172a; }`}</style>
            <section className="hero space-y-3 rounded-lg bg-slate-100 p-3 dark:bg-white/5">
              <h3 className="title text-lg font-semibold">Hero title</h3>
              <p className="subtitle text-sm text-slate-600 dark:text-slate-300">A subtitle under the hero.</p>
              <button id="cta" className="btn rounded-md bg-amber-400 px-3 py-2 text-slate-900 shadow-sm">
                Call to action
              </button>
            </section>

            <section className="card space-y-3 rounded-lg bg-slate-50 p-3 dark:bg-white/10">
              <div className="badge inline-flex rounded-full bg-amber-200 px-2 py-0.5 text-xs text-amber-900">badge</div>
              <p className="title text-sm">This is a card title</p>
              <ul className="list list-disc space-y-1 pl-5">
                <li>Item one</li>
                <li>Item two</li>
                <li>Item three</li>
              </ul>
              <nav className="nav flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                <a className="rounded px-2 py-1 hover:bg-slate-200 dark:hover:bg-white/10" href="#">
                  Link A
                </a>
                <a className="rounded px-2 py-1 hover:bg-slate-200 dark:hover:bg-white/10" href="#">
                  Link B
                </a>
              </nav>
            </section>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-[#0f172a] p-3 font-mono text-xs text-slate-100 shadow-sm dark:border-white/12 dark:bg-[#0b1220]">
            <span className="text-[11px] uppercase tracking-[0.18em] text-amber-300">HTML</span>
            <pre className="whitespace-pre-wrap leading-relaxed">
              <code>
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">section</span>{' '}
                <span className="text-emerald-300">class</span>
                <span className="text-slate-500">="hero"</span>
                <span className="text-slate-500">&gt;</span>
                {'\n  '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">h3</span>{' '}
                <span className="text-emerald-300">class</span>
                <span className="text-slate-500">="title"</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">Hero title</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">h3</span>
                <span className="text-slate-500">&gt;</span>
                {'\n  '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">p</span>{' '}
                <span className="text-emerald-300">class</span>
                <span className="text-slate-500">="subtitle"</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">A subtitle under the hero.</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">p</span>
                <span className="text-slate-500">&gt;</span>
                {'\n  '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">button</span>{' '}
                <span className="text-emerald-300">id</span>
                <span className="text-slate-500">="cta"</span>{' '}
                <span className="text-emerald-300">class</span>
                <span className="text-slate-500">="btn"</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">Call to action</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">button</span>
                <span className="text-slate-500">&gt;</span>
                {'\n'}
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">section</span>
                <span className="text-slate-500">&gt;</span>
                {'\n'}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">section</span>{' '}
                <span className="text-emerald-300">class</span>
                <span className="text-slate-500">="card"</span>
                <span className="text-slate-500">&gt;</span>
                {'\n  '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">div</span>{' '}
                <span className="text-emerald-300">class</span>
                <span className="text-slate-500">="badge"</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">badge</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">div</span>
                <span className="text-slate-500">&gt;</span>
                {'\n  '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">p</span>{' '}
                <span className="text-emerald-300">class</span>
                <span className="text-slate-500">="title"</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">This is a card title</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">p</span>
                <span className="text-slate-500">&gt;</span>
                {'\n  '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">ul</span>{' '}
                <span className="text-emerald-300">class</span>
                <span className="text-slate-500">="list"</span>
                <span className="text-slate-500">&gt;</span>
                {'\n    '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">li</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">Item one</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">li</span>
                <span className="text-slate-500">&gt;</span>
                {'\n    '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">li</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">Item two</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">li</span>
                <span className="text-slate-500">&gt;</span>
                {'\n    '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">li</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">Item three</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">li</span>
                <span className="text-slate-500">&gt;</span>
                {'\n  '}
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">ul</span>
                <span className="text-slate-500">&gt;</span>
                {'\n  '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">nav</span>{' '}
                <span className="text-emerald-300">class</span>
                <span className="text-slate-500">="nav"</span>
                <span className="text-slate-500">&gt;</span>
                {'\n    '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">a</span>{' '}
                <span className="text-emerald-300">href</span>
                <span className="text-slate-500">="#"</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">Link A</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">a</span>
                <span className="text-slate-500">&gt;</span>
                {'\n    '}
                <span className="text-slate-500">&lt;</span>
                <span className="text-amber-300">a</span>{' '}
                <span className="text-emerald-300">href</span>
                <span className="text-slate-500">="#"</span>
                <span className="text-slate-500">&gt;</span>
                <span className="text-white">Link B</span>
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">a</span>
                <span className="text-slate-500">&gt;</span>
                {'\n  '}
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">nav</span>
                <span className="text-slate-500">&gt;</span>
                {'\n'}
                <span className="text-slate-500">&lt;/</span>
                <span className="text-amber-300">section</span>
                <span className="text-slate-500">&gt;</span>
              </code>
            </pre>
          </div>
        </div>
      }
    />
  )
}

export default SelectorsLab

