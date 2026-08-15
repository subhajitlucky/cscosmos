import type React from 'react'

export type TopicSlug =
  | 'parsing-tokenization'
  | 'css-parsing-stylecalc'
  | 'dom-construction'
  | 'render-tree-layout'
  | 'paint-composite-raster'
  | 'gpu-pipeline'
  | 'event-loop-microtasks'
  | 'v8-architecture'
  | 'garbage-collection'
  | 'devtools-protocol'
  | 'shadow-dom-web-components'
  | 'webidl-bindings'
  | 'security-sandboxing'
  | 'performance-optimizations'

export type TraceType =
  | 'parsing'
  | 'layout'
  | 'paint'
  | 'gc'
  | 'trace'
  | 'execution'

export type Topic = {
  id: string
  title: string
  slug: TopicSlug
  description: string
  exampleHTML: string
  exampleCSS: string
  exampleJS: string
  tags?: string[]
}

export type Trace = {
  id: string
  type: TraceType
  data: Record<string, unknown>
}

export type VisualizerMeta = {
  slug: TopicSlug
  title: string
  description: string
  component: React.ReactNode
  controls: string[]
}

