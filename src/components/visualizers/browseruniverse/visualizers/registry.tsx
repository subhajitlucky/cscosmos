'use client';

import { useEffect, useMemo, useRef, useState } from 'react'
import type React from 'react'
import { VisualizerLayout } from '../components/visualizers/VisualizerLayout'
import type { TopicSlug } from '../types/content'
import { cn } from '../utils/cn'

type VisualizerEntry = {
  title: string
  description: string
  component: () => React.ReactElement
}

type Token = { value: string; type: 'tag' | 'text'; index: number }

const htmlSample = `<html>
  <body>
    <main>
      <h1>Browser Universe</h1>
      <p>Bytes → tokens → DOM → render tree</p>
    </main>
  </body>
</html>`

function tokenizeHTML(input: string): Token[] {
  const parts = input.split(/(<[^>]+>)/g).filter(Boolean)
  return parts.map((part, index) => ({
    value: part.trim(),
    type: part.startsWith('<') ? 'tag' : 'text',
    index,
  }))
}

function HtmlParsingVisualizer() {
  const [html, setHtml] = useState(htmlSample)
  const [tokens, setTokens] = useState<Token[]>(() => tokenizeHTML(htmlSample))
  const [cursor, setCursor] = useState(0)
  const [auto, setAuto] = useState(false)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const worker = new Worker(new URL('../workers/htmlTokenizer.worker.ts', import.meta.url), {
        type: 'module',
      });
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<Token[]>) => {
        setTokens(event.data);
      };
      return () => worker.terminate();
    } catch {
      // Fallback to inline tokenization
    }
  }, [])

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage(html)
    } else {
      setTokens(tokenizeHTML(html))
    }
    setCursor(0)
  }, [html])

  useEffect(() => {
    if (!auto) return
    const id = window.setInterval(() => {
      setCursor((c) => (c + 1) % Math.max(tokens.length, 1))
    }, 900)
    return () => clearInterval(id)
  }, [auto, tokens.length])

  const currentToken = tokens[cursor]
  const openElements = useMemo(() => {
    const stack: string[] = []
    tokens.slice(0, cursor + 1).forEach((t) => {
      if (t.type === 'tag') {
        if (t.value.startsWith('</')) {
          stack.pop()
        } else if (!t.value.endsWith('/>')) {
          stack.push(t.value.replace(/[<>]/g, ''))
        }
      }
    })
    return stack
  }, [tokens, cursor])

  return (
    <VisualizerLayout
      title="HTML Tokenizer"
      description="Stream bytes → tokens → tree. Step through insertion modes and see the open-element stack update."
      controls={
        <div className="space-y-3 text-sm">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">HTML Input</span>
            <textarea
              className="h-32 rounded-xl border border-border bg-base/70 p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-accent/60"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-full bg-accent px-3 py-2 text-xs font-semibold text-white"
              onClick={() => setCursor((c) => Math.min(tokens.length - 1, c + 1))}
            >
              Step
            </button>
            <button
              className="rounded-full border border-border px-3 py-2 text-xs text-slate-200"
              onClick={() => setCursor(0)}
            >
              Reset
            </button>
            <button
              className={cn(
                'rounded-full border px-3 py-2 text-xs font-semibold transition',
                auto ? 'border-accent bg-accent/20 text-white' : 'border-border text-slate-200',
              )}
              onClick={() => setAuto((prev) => !prev)}
            >
              {auto ? 'Pause autoplay' : 'Autoplay'}
            </button>
          </div>
          <div className="text-xs text-slate-300">
            Open elements stack:{' '}
            <span className="font-mono text-white">{openElements.join(' › ') || 'empty'}</span>
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tokens.map((token) => (
              <span
                key={token.index}
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs font-mono',
                  token.index === cursor
                    ? 'border-accent bg-accent/20 text-white'
                    : 'border-border bg-card/60 text-slate-200',
                )}
              >
                {token.value || '(whitespace)'}
              </span>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-card/70 p-3 text-xs text-slate-200">
            Current token:{' '}
            <span className="font-semibold text-white">
              {currentToken ? currentToken.value : 'n/a'}
            </span>
            <div className="mt-2 text-slate-300">
              Insertion mode hint: the stack length guides whether we are in <em>in body</em>,{' '}
              <em>in head</em>, or <em>after body</em>.
            </div>
          </div>
        </div>
      }
      inspector={
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-lg border border-border bg-base/70 p-3">
            <p className="font-semibold text-white">Byte stream</p>
            <p className="text-slate-300">Streamed incrementally; tokenizer can pause for scripts.</p>
          </div>
          <div className="rounded-lg border border-border bg-base/70 p-3">
            <p className="font-semibold text-white">Error recovery</p>
            <p className="text-slate-300">Stray end tags get foster parenting; parser stays resilient.</p>
          </div>
          <div className="rounded-lg border border-border bg-base/70 p-3">
            <p className="font-semibold text-white">Tree builder</p>
            <p className="text-slate-300">Tokens feed the tree builder which manages the DOM stack.</p>
          </div>
        </div>
      }
    />
  )
}

function CssParsingVisualizer() {
  const [css, setCss] = useState(`.card.primary { background: #0f172a; color: #e2e8f0; }
button.cta:hover { transform: translateY(-1px); }
#app .card .title { letter-spacing: 0.02em; }`)
  const rules = useMemo(() => {
    return css
      .split('}')
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const [selector, body] = block.split('{')
        const specificity = calcSpecificity(selector.trim())
        return { selector: selector.trim(), body: body?.trim(), specificity }
      })
  }, [css])

  const [active, setActive] = useState(0)
  const activeRule = rules[active]

  return (
    <VisualizerLayout
      title="CSSOM & Cascade"
      description="From tokens → stylesheet object → selector matching → cascade → computed styles."
      controls={
        <div className="space-y-3 text-sm">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">CSS Source</span>
            <textarea
              className="h-32 rounded-xl border border-border bg-base/70 p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-accent/60"
              value={css}
              onChange={(e) => setCss(e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            {rules.map((rule, idx) => (
              <button
                key={rule.selector}
                onClick={() => setActive(idx)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs text-left',
                  active === idx
                    ? 'border-accent bg-accent/20 text-white'
                    : 'border-border bg-card/60 text-slate-200',
                )}
              >
                {rule.selector}
                <div className="text-[10px] text-slate-400">
                  {rule.specificity.id}-{rule.specificity.class}-{rule.specificity.type}
                </div>
              </button>
            ))}
          </div>
        </div>
      }
      canvas={
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card/70 p-3 text-sm text-slate-200">
            <p className="text-xs font-semibold uppercase text-slate-400">Selector match</p>
            <p className="font-mono text-white">{activeRule?.selector}</p>
            <p className="mt-2 text-xs text-slate-300">
              Specificity: ({activeRule?.specificity.id}, {activeRule?.specificity.class},{' '}
              {activeRule?.specificity.type})
            </p>
            <p className="mt-2 text-xs text-slate-300">
              Cascade: origin (author) → importance (normal) → specificity → source order.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-base/70 p-3 text-sm text-slate-200">
            <p className="text-xs font-semibold uppercase text-slate-400">Computed style (sample)</p>
            <ul className="space-y-1 font-mono text-xs">
              {(activeRule?.body?.split(';') || [])
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => (
                  <li key={line} className="rounded bg-card/60 px-2 py-1">
                    {line};
                  </li>
                ))}
            </ul>
          </div>
        </div>
      }
      inspector={
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <InspectorCard title="Selector matching" body="Right-to-left matching with pre-scanning and bloom filters in engines." />
          <InspectorCard title="Cascade layers" body="Author vs. user vs. UA; importance and specificity decide winners." />
          <InspectorCard title="Used vs. computed" body="Computed values become used values after layout converts relative units." />
        </div>
      }
    />
  )
}

type Specificity = { id: number; class: number; type: number }
function calcSpecificity(selector: string): Specificity {
  const id = (selector.match(/#/g) || []).length
  const cls = (selector.match(/\./g) || []).length
  const type = (selector.match(/[a-zA-Z]/g) || []).length - id - cls
  return { id, class: cls, type: Math.max(type, 0) }
}

function DomConstructionVisualizer() {
  type Node = { id: number; name: string; children?: Node[] }
  const [tree, setTree] = useState<Node[]>([
    { id: 1, name: '<html>', children: [{ id: 2, name: '<body>', children: [{ id: 3, name: '<main>' }] }] },
  ])
  const [log, setLog] = useState<string[]>(['Tokenizer enters "in body" mode'])
  const [counter, setCounter] = useState(4)

  const addNode = (label: string) => {
    setTree((prev) => {
      const clone = structuredClone(prev) as Node[]
      clone[0].children?.[0].children?.push({ id: counter, name: label })
      return clone
    })
    setLog((prev) => [`Inserted ${label}`, ...prev].slice(0, 6))
    setCounter((c) => c + 1)
  }

  const removeLast = () => {
    setTree((prev) => {
      const clone = structuredClone(prev) as Node[]
      clone[0].children?.[0].children?.pop()
      return clone
    })
    setLog((prev) => ['Removed last node', ...prev].slice(0, 6))
  }

  return (
    <VisualizerLayout
      title="DOM Tree Construction"
      description="Insertion modes build the DOM incrementally. Watch nodes attach and mutations stream in."
      controls={
        <div className="space-y-2 text-sm">
          <button
            className="w-full rounded-lg bg-accent px-3 py-2 text-white"
            onClick={() => addNode('<section>')}
          >
            Insert &lt;section&gt;
          </button>
          <button
            className="w-full rounded-lg bg-card/80 px-3 py-2 text-slate-200 border border-border"
            onClick={() => addNode('<p>')}
          >
            Insert &lt;p&gt;
          </button>
          <button
            className="w-full rounded-lg border border-border px-3 py-2 text-slate-200"
            onClick={removeLast}
          >
            Remove last child
          </button>
          <p className="text-xs text-slate-400">
            Live DOM inspectors and mutation observers depend on this structure.
          </p>
        </div>
      }
      canvas={
        <div className="space-y-3 text-sm">
          <RenderTree nodes={tree} depth={0} />
          <div className="rounded-xl border border-border bg-card/70 p-3">
            <p className="text-xs font-semibold uppercase text-slate-400">Mutation log</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-200">
              {log.map((entry, idx) => (
                <li key={idx} className="rounded bg-base/70 px-2 py-1">
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  )
}

function RenderTree({ nodes, depth }: { nodes: { id: number; name: string; children?: any[] }[]; depth: number }) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <div key={node.id}>
          <div
            className="rounded-lg border border-border bg-base/70 px-2 py-1 text-xs text-white"
            style={{ marginLeft: depth * 14 }}
          >
            {node.name}
          </div>
          {node.children ? <RenderTree nodes={node.children} depth={depth + 1} /> : null}
        </div>
      ))}
    </div>
  )
}

function RenderLayoutVisualizer() {
  const [viewport, setViewport] = useState(900)
  const [reflows, setReflows] = useState(0)
  const [formatting, setFormatting] = useState<'normal' | 'flex' | 'grid'>('grid')

  const boxes = useMemo(
    () => [
      { id: 1, label: 'Header', span: formatting === 'grid' ? 2 : 1 },
      { id: 2, label: 'Sidebar', span: 1 },
      { id: 3, label: 'Content', span: formatting === 'grid' ? 2 : 1 },
      { id: 4, label: 'Footer', span: formatting === 'grid' ? 2 : 1 },
    ],
    [formatting],
  )

  return (
    <VisualizerLayout
      title="Render Tree & Layout"
      description="Render tree merges DOM + CSSOM. Layout picks formatting contexts, computes used values, and triggers reflows."
      controls={
        <div className="space-y-3 text-sm">
          <label className="flex flex-col gap-2">
            <span className="text-xs text-slate-400">Viewport width: {viewport}px</span>
            <input
              type="range"
              min={360}
              max={1400}
              value={viewport}
              onChange={(e) => setViewport(Number(e.target.value))}
            />
          </label>
          <div className="flex gap-2">
            {(['normal', 'flex', 'grid'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFormatting(mode)}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-xs capitalize',
                  formatting === mode
                    ? 'border-accent bg-accent/20 text-white'
                    : 'border-border bg-card/70 text-slate-200',
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          <button
            className="w-full rounded-lg bg-accent px-3 py-2 text-white"
            onClick={() => setReflows((c) => c + 1)}
          >
            Trigger reflow
          </button>
          <p className="text-xs text-slate-400">
            Reflows: {reflows} · Layout invalidation bubbles up the ancestor chain.
          </p>
        </div>
      }
      canvas={
        <div className="rounded-xl border border-border bg-base/70 p-3">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns:
                formatting === 'grid'
                  ? 'repeat(auto-fit, minmax(220px, 1fr))'
                  : 'repeat(2, minmax(0, 1fr))',
            }}
          >
            {boxes.map((box) => (
              <div
                key={box.id}
                className="rounded-xl border border-border bg-card/70 p-3 text-sm text-white"
                style={
                  formatting === 'grid'
                    ? { gridColumn: `span ${box.span}` }
                    : { minHeight: 110 + box.id * 3 }
                }
              >
                <p className="font-semibold">{box.label}</p>
                <p className="text-xs text-slate-300">
                  Formatting: {formatting} · Span: {box.span}
                </p>
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}

function PaintCompositeVisualizer() {
  const [layers, setLayers] = useState([
    { id: 1, name: 'Base layer', ops: ['Paint background', 'Text'], gpu: true },
    { id: 2, name: 'Overlay', ops: ['Box-shadow', 'Transform'], gpu: true },
    { id: 3, name: 'Tooltip', ops: ['Opacity'], gpu: false },
  ])

  const toggleGPU = (id: number) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, gpu: !l.gpu } : l)))
  }

  return (
    <VisualizerLayout
      title="Painting & Compositing"
      description="Paint records become layers. Compositor threads raster tiles and blends them into the final frame."
      controls={
        <div className="space-y-2 text-sm">
          {layers.map((layer) => (
            <label key={layer.id} className="flex items-center justify-between rounded-lg border border-border bg-card/70 px-3 py-2">
              <div>
                <p className="font-semibold text-white">{layer.name}</p>
                <p className="text-xs text-slate-400">{layer.ops.join(' • ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">GPU</span>
                <input type="checkbox" checked={layer.gpu} onChange={() => toggleGPU(layer.id)} />
              </div>
            </label>
          ))}
        </div>
      }
      canvas={
        <div className="space-y-3">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={cn(
                'rounded-xl border px-3 py-3',
                layer.gpu
                  ? 'border-accent bg-accent/15 text-white shadow-glow'
                  : 'border-border bg-base/70 text-slate-200',
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{layer.name}</p>
                <span className="rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.2rem] text-slate-400">
                  {layer.gpu ? 'Composited' : 'Paint-only'}
                </span>
              </div>
              <p className="text-xs text-slate-300">Ops: {layer.ops.join(', ')}</p>
            </div>
          ))}
          <div className="rounded-xl border border-border bg-card/70 p-3 text-xs text-slate-300">
            GPU raster threads build tiles; compositor thread assembles them at vsync. Promote only
            when it reduces paint work.
          </div>
        </div>
      }
    />
  )
}

function GpuPipelineVisualizer() {
  const [tasks, setTasks] = useState<{ id: number; stage: 'raster' | 'composite'; cost: number }[]>([
    { id: 1, stage: 'raster', cost: 4 },
    { id: 2, stage: 'composite', cost: 2 },
  ])
  const [counter, setCounter] = useState(3)

  const simulate = () => {
    setTasks((prev) => [...prev, { id: counter, stage: counter % 2 ? 'raster' : 'composite', cost: 5 }])
    setCounter((c) => c + 1)
  }

  const memory = tasks.reduce((sum, t) => sum + t.cost * 2, 20)

  return (
    <VisualizerLayout
      title="GPU Pipeline"
      description="Compositor thread schedules raster tasks, uploads textures, and composites layers to the backbuffer."
      controls={
        <div className="space-y-3 text-sm">
          <button className="w-full rounded-lg bg-accent px-3 py-2 text-white" onClick={simulate}>
            Simulate heavy GPU task
          </button>
          <div className="rounded-lg border border-border bg-base/70 p-3 text-xs">
            <p className="text-slate-300">Memory usage</p>
            <p className="text-lg font-semibold text-white">{memory} MB</p>
            <p className="text-[11px] text-slate-400">Textures + tile cache</p>
          </div>
        </div>
      }
      canvas={
        <div className="space-y-2 text-sm">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card/70 px-3 py-2"
            >
              <div>
                <p className="font-semibold text-white">
                  {task.stage === 'raster' ? 'Raster thread' : 'Compositor thread'}
                </p>
                <p className="text-xs text-slate-300">Cost: {task.cost} ms</p>
              </div>
              <div
                className={cn(
                  'h-2 rounded-full bg-accent/30',
                  task.stage === 'raster' ? 'w-24' : 'w-16',
                )}
              />
            </div>
          ))}
        </div>
      }
    />
  )
}

function EventLoopVisualizer() {
  const [callStack, setCallStack] = useState<string[]>([])
  const [tasks, setTasks] = useState<string[]>(['setTimeout cb'])
  const [microtasks, setMicrotasks] = useState<string[]>(['promise microtask'])
  const [ticks, setTicks] = useState(0)

  const pushTask = () => setTasks((prev) => [...prev, `task-${prev.length + 1}`])
  const pushMicrotask = () => setMicrotasks((prev) => [...prev, `micro-${prev.length + 1}`])
  const scheduleRAF = () => setTicks((t) => t + 1)

  const runTick = () => {
    const nextMicro = microtasks[0]
    const nextTask = tasks[0]
    if (nextMicro) {
      setCallStack([`microtask: ${nextMicro}`])
      setMicrotasks((prev) => prev.slice(1))
    } else if (nextTask) {
      setCallStack([`task: ${nextTask}`])
      setTasks((prev) => prev.slice(1))
    } else {
      setCallStack([])
    }
  }

  return (
    <VisualizerLayout
      title="Event Loop"
      description="Call stack, task queue, and microtask queue with rendering ticks."
      controls={
        <div className="space-y-2 text-sm">
          <button className="w-full rounded-lg bg-accent px-3 py-2 text-white" onClick={pushTask}>
            Push task
          </button>
          <button
            className="w-full rounded-lg border border-border bg-card/70 px-3 py-2 text-slate-200"
            onClick={pushMicrotask}
          >
            Push microtask
          </button>
          <button
            className="w-full rounded-lg border border-accent bg-accent/20 px-3 py-2 text-white"
            onClick={scheduleRAF}
          >
            schedule rAF
          </button>
          <button className="w-full rounded-lg border border-border px-3 py-2 text-slate-200" onClick={runTick}>
            Run loop tick
          </button>
          <p className="text-xs text-slate-400">Rendering ticks queued: {ticks}</p>
        </div>
      }
      canvas={
        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          <StackList title="Call stack" items={callStack} />
          <StackList title="Task queue" items={tasks} />
          <StackList title="Microtasks" items={microtasks} />
        </div>
      }
    />
  )
}

function StackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-3">
      <p className="text-xs font-semibold uppercase text-slate-400">{title}</p>
      <ul className="mt-2 space-y-1 text-xs text-slate-200">
        {items.length === 0 ? <li className="text-slate-500">empty</li> : null}
        {items.map((item, idx) => (
          <li key={idx} className="rounded bg-base/70 px-2 py-1">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function JsEngineVisualizer() {
  const [hotCount, setHotCount] = useState(0)
  const [optimized, setOptimized] = useState(false)
  const [deopt, setDeopt] = useState(false)

  useEffect(() => {
    if (hotCount > 5) setOptimized(true)
  }, [hotCount])

  return (
    <VisualizerLayout
      title="V8 Pipeline"
      description="Parser → AST → bytecode → interpreter → baseline JIT → TurboFan → deopt."
      controls={
        <div className="space-y-2 text-sm">
          <button
            className="w-full rounded-lg bg-accent px-3 py-2 text-white"
            onClick={() => setHotCount((c) => c + 1)}
          >
            Call hot function
          </button>
          <button
            className="w-full rounded-lg border border-border bg-card/70 px-3 py-2 text-slate-200"
            onClick={() => setDeopt(true)}
          >
            Simulate deopt
          </button>
          <p className="text-xs text-slate-400">
            Hotness: {hotCount} · Optimized: {optimized ? 'yes' : 'no'}
          </p>
        </div>
      }
      canvas={
        <div className="space-y-2 text-sm">
          {[
            'Parsing → AST',
            'Bytecode (Ignition)',
            'Baseline JIT',
            optimized ? 'Optimizing JIT (TurboFan)' : 'Optimizing JIT (pending)',
            deopt ? 'Deoptimized to baseline' : 'Inline caches stable',
          ].map((step, idx) => (
            <div
              key={step}
              className={cn(
                'rounded-xl border px-3 py-2',
                idx <= 2 || optimized
                  ? 'border-accent bg-accent/15 text-white'
                  : 'border-border bg-base/70 text-slate-200',
              )}
            >
              {step}
            </div>
          ))}
        </div>
      }
    />
  )
}

function GarbageCollectorVisualizer() {
  const [heap, setHeap] = useState<{ id: number; gen: 'nursery' | 'old'; size: number }[]>([
    { id: 1, gen: 'nursery', size: 1 },
    { id: 2, gen: 'old', size: 4 },
  ])
  const [counter, setCounter] = useState(3)

  const allocate = () => {
    setHeap((prev) => [...prev, { id: counter, gen: 'nursery', size: Math.ceil(Math.random() * 3) }])
    setCounter((c) => c + 1)
  }

  const triggerGC = () => {
    setHeap((prev) => prev.filter((obj) => obj.gen === 'old' || obj.id % 2 === 0).map((obj) => ({ ...obj, gen: 'old' })))
  }

  const total = heap.reduce((sum, obj) => sum + obj.size, 0)

  return (
    <VisualizerLayout
      title="Garbage Collection"
      description="Generational GC keeps nursery small, promotes survivors, and occasionally runs full mark-sweep."
      controls={
        <div className="space-y-2 text-sm">
          <button className="w-full rounded-lg bg-accent px-3 py-2 text-white" onClick={allocate}>
            Allocate objects
          </button>
          <button
            className="w-full rounded-lg border border-border bg-card/70 px-3 py-2 text-slate-200"
            onClick={triggerGC}
          >
            Trigger GC
          </button>
          <p className="text-xs text-slate-400">Heap size: {total} KB</p>
        </div>
      }
      canvas={
        <div className="grid gap-2 sm:grid-cols-2">
          {heap.map((obj) => (
            <div
              key={obj.id}
              className={cn(
                'rounded-xl border px-3 py-2 text-sm',
                obj.gen === 'old'
                  ? 'border-accent bg-accent/15 text-white'
                  : 'border-border bg-base/70 text-slate-200',
              )}
            >
              <p className="font-semibold">obj-{obj.id}</p>
              <p className="text-xs text-slate-300">
                Gen: {obj.gen} · Size: {obj.size} KB
              </p>
            </div>
          ))}
        </div>
      }
    />
  )
}

function DevtoolsTracingVisualizer() {
  const [recording, setRecording] = useState(false)
  const [events, setEvents] = useState<{ name: string; duration: number }[]>([
    { name: 'Parse HTML', duration: 3 },
    { name: 'Layout', duration: 5 },
  ])

  const toggle = () => setRecording((r) => !r)
  const loadSample = () =>
    setEvents([
      { name: 'Recalculate Style', duration: 4 },
      { name: 'Layout', duration: 8 },
      { name: 'Paint', duration: 6 },
    ])

  return (
    <VisualizerLayout
      title="DevTools Tracing"
      description="Simulate a trace session and render a tiny flame chart."
      controls={
        <div className="space-y-2 text-sm">
          <button
            className={cn(
              'w-full rounded-lg px-3 py-2 text-white',
              recording ? 'bg-red-500/80' : 'bg-accent',
            )}
            onClick={toggle}
          >
            {recording ? 'Stop trace' : 'Start trace'}
          </button>
          <button
            className="w-full rounded-lg border border-border bg-card/70 px-3 py-2 text-slate-200"
            onClick={loadSample}
          >
            Load sample trace
          </button>
          <p className="text-xs text-slate-400">
            CDP domains stream events; DevTools stitches them into lanes.
          </p>
        </div>
      }
      canvas={
        <div className="space-y-2 text-sm">
          {events.map((evt) => (
            <div key={evt.name}>
              <p className="text-xs text-slate-300">{evt.name}</p>
              <div className="h-3 rounded-full bg-card/70">
                <div
                  className="h-3 rounded-full bg-accent"
                  style={{ width: `${Math.min(100, evt.duration * 6)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      }
    />
  )
}

function ShadowDomVisualizer() {
  const [mode, setMode] = useState<'open' | 'closed'>('open')
  const [slots, setSlots] = useState(['title', 'default'])

  const toggleSlot = () => {
    setSlots((prev) => (prev.includes('footer') ? prev.filter((s) => s !== 'footer') : [...prev, 'footer']))
  }

  return (
    <VisualizerLayout
      title="Shadow DOM"
      description="Slots, host, and shadow root. Observe composed tree vs. light DOM."
      controls={
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            {(['open', 'closed'] as const).map((value) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-xs capitalize',
                  mode === value
                    ? 'border-accent bg-accent/20 text-white'
                    : 'border-border bg-card/70 text-slate-200',
                )}
              >
                {value} shadow root
              </button>
            ))}
          </div>
          <button
            className="w-full rounded-lg border border-border bg-card/70 px-3 py-2 text-slate-200"
            onClick={toggleSlot}
          >
            Toggle footer slot
          </button>
        </div>
      }
      canvas={
        <div className="space-y-2 text-sm">
          <div className="rounded-xl border border-border bg-card/70 p-3">
            <p className="text-xs font-semibold uppercase text-slate-400">Shadow root ({mode})</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-200">
              {slots.map((slot) => (
                <li key={slot} className="rounded bg-base/70 px-2 py-1">
                  &lt;slot name=&quot;{slot}&quot;&gt;
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-base/70 p-3 text-xs text-slate-200">
            Composed tree merges light DOM nodes into slots; events retarget at the shadow boundary.
          </div>
        </div>
      }
    />
  )
}

function WebIDLVisualizer() {
  const [selected, setSelected] = useState('URL')
  const signatures = {
    URL: 'constructor USVString url, optional USVString base',
    EventTarget: 'addEventListener(DOMString type, EventListener callback)',
    Element: 'setAttribute(DOMString name, DOMString value)',
  }

  return (
    <VisualizerLayout
      title="WebIDL & Bindings"
      description="IDL defines shape, brand checks, and conversion rules between JS and host types."
      controls={
        <div className="space-y-2 text-sm">
          {Object.keys(signatures).map((key) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-left text-xs',
                selected === key
                  ? 'border-accent bg-accent/20 text-white'
                  : 'border-border bg-card/70 text-slate-200',
              )}
            >
              {key}
            </button>
          ))}
        </div>
      }
      canvas={
        <div className="space-y-2 text-sm">
          <div className="rounded-xl border border-border bg-card/70 p-3">
            <p className="font-semibold text-white">{selected}</p>
            <p className="text-xs text-slate-300">{signatures[selected as keyof typeof signatures]}</p>
          </div>
          <div className="rounded-xl border border-border bg-base/70 p-3 text-xs text-slate-200">
            IDL conversions (e.g., USVString) sanitize input; brand checks ensure correct receiver.
          </div>
        </div>
      }
    />
  )
}

function SecuritySandboxVisualizer() {
  const [allowScripts, setAllowScripts] = useState(true)
  const [allowSameOrigin, setAllowSameOrigin] = useState(false)
  const [csp, setCsp] = useState(`default-src 'none'; script-src 'self';`)

  return (
    <VisualizerLayout
      title="Security & Sandboxing"
      description="Origin model, sandbox flags, and CSP. Toggle isolation controls."
      controls={
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 text-xs text-slate-200">
            <input type="checkbox" checked={allowScripts} onChange={() => setAllowScripts((v) => !v)} />
            allow-scripts
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={allowSameOrigin}
              onChange={() => setAllowSameOrigin((v) => !v)}
            />
            allow-same-origin
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-200">
            CSP
            <textarea
              className="rounded-lg border border-border bg-base/70 p-2 text-xs"
              value={csp}
              onChange={(e) => setCsp(e.target.value)}
            />
          </label>
        </div>
      }
      canvas={
        <div className="space-y-2 text-sm">
          <div className="rounded-xl border border-border bg-card/70 p-3">
            <p className="text-xs text-slate-300">Sandbox attribute</p>
            <p className="font-mono text-white">
              sandbox=&quot;{allowScripts ? 'allow-scripts ' : ''}
              {allowSameOrigin ? 'allow-same-origin' : ''}&quot;
            </p>
          </div>
          <div className="rounded-xl border border-border bg-base/70 p-3 text-xs text-slate-200">
            Always validate <code>postMessage</code> origins and keep execution inside sandboxed
            iframes or workers.
          </div>
        </div>
      }
    />
  )
}

function PerformanceVisualizer() {
  const [fps, setFps] = useState(60)
  const [layoutThrash, setLayoutThrash] = useState(0)

  const simulate = () => {
    setFps((f) => Math.max(24, f - 8))
    setLayoutThrash((v) => v + 1)
  }

  return (
    <VisualizerLayout
      title="Rendering Performance"
      description="Keep frames under 16ms. Avoid layout thrash and defer heavy work."
      controls={
        <div className="space-y-2 text-sm">
          <button className="w-full rounded-lg bg-accent px-3 py-2 text-white" onClick={simulate}>
            Simulate layout thrash
          </button>
          <p className="text-xs text-slate-400">Layout invalidations: {layoutThrash}</p>
        </div>
      }
      canvas={
        <div className="space-y-2 text-sm">
          <div className="rounded-xl border border-border bg-card/70 p-3">
            <p className="text-xs text-slate-300">FPS</p>
            <p className="text-3xl font-bold text-white">{fps}</p>
            <p className="text-xs text-slate-400">RAIL: aim for 60fps; offload to workers.</p>
          </div>
          <div className="rounded-xl border border-border bg-base/70 p-3 text-xs text-slate-200">
            Use <code>requestIdleCallback</code> for background work and <code>postMessage</code> to
            workers to keep the main thread free for rendering.
          </div>
        </div>
      }
    />
  )
}

const registry: Record<TopicSlug, VisualizerEntry> = {
  'parsing-tokenization': {
    title: 'HTML Parsing & Tokenization',
    description: 'Step through tokenizer output and watch the open-element stack change.',
    component: HtmlParsingVisualizer,
  },
  'css-parsing-stylecalc': {
    title: 'CSS Parsing & Style Calculation',
    description: 'Selector matching, specificity, and computed styles.',
    component: CssParsingVisualizer,
  },
  'dom-construction': {
    title: 'DOM Construction',
    description: 'Tree building, foster parenting, and mutation observation.',
    component: DomConstructionVisualizer,
  },
  'render-tree-layout': {
    title: 'Render Tree & Layout',
    description: 'Formatting contexts, flow, and reflow counters.',
    component: RenderLayoutVisualizer,
  },
  'paint-composite-raster': {
    title: 'Paint & Composite',
    description: 'Layer promotion and compositor output.',
    component: PaintCompositeVisualizer,
  },
  'gpu-pipeline': {
    title: 'GPU Pipeline',
    description: 'Raster vs compositor threads and GPU memory.',
    component: GpuPipelineVisualizer,
  },
  'event-loop-microtasks': {
    title: 'Event Loop',
    description: 'Task queue, microtasks, and rendering ticks.',
    component: EventLoopVisualizer,
  },
  'v8-architecture': {
    title: 'V8 Internals',
    description: 'From parser to TurboFan with deopts.',
    component: JsEngineVisualizer,
  },
  'garbage-collection': {
    title: 'Garbage Collection',
    description: 'Generational GC and promotions.',
    component: GarbageCollectorVisualizer,
  },
  'devtools-protocol': {
    title: 'DevTools Tracing',
    description: 'Record events and view a flame strip.',
    component: DevtoolsTracingVisualizer,
  },
  'shadow-dom-web-components': {
    title: 'Shadow DOM',
    description: 'Slots and composed trees.',
    component: ShadowDomVisualizer,
  },
  'webidl-bindings': {
    title: 'WebIDL Bindings',
    description: 'IDL signatures and conversions.',
    component: WebIDLVisualizer,
  },
  'security-sandboxing': {
    title: 'Security & Sandboxing',
    description: 'Sandbox flags and CSP tweaks.',
    component: SecuritySandboxVisualizer,
  },
  'performance-optimizations': {
    title: 'Performance',
    description: 'RAIL and layout thrash simulator.',
    component: PerformanceVisualizer,
  },
}

export function VisualizerForSlug({ slug }: { slug: TopicSlug }) {
  const entry = registry[slug]
  if (!entry) return null
  const Component = entry.component
  return <Component />
}

export function visualizerMeta(slug: TopicSlug) {
  return registry[slug]
}

function InspectorCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-base/70 p-3">
      <p className="font-semibold text-white">{title}</p>
      <p className="text-slate-300">{body}</p>
    </div>
  )
}

