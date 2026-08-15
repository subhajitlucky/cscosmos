/// <reference lib="webworker" />

export type WorkerToken = { value: string; type: 'tag' | 'text'; index: number }

self.onmessage = (event: MessageEvent<string>) => {
  const html = event.data || ''
  const parts = html.split(/(<[^>]+>)/g).filter(Boolean)
  const tokens: WorkerToken[] = parts.map((part, index) => ({
    value: part.trim(),
    type: part.startsWith('<') ? 'tag' : 'text',
    index,
  }))
  self.postMessage(tokens)
}

