'use client';
import { useState, type ReactNode } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import GlassCard from '@/components/visualizers/cssviz/components/common/GlassCard'
import { Button } from '@/components/visualizers/cssviz/components/ui/Button'
import CodeBlock from '@/components/visualizers/cssviz/components/common/CodeBlock'

type VisualizerPanelProps = {
  title: string
  description: string
  controls: React.ReactNode
  preview: React.ReactNode
  cssOutput?: string
  onReset?: () => void
  badge?: string
  tasks?: string[]
  status?: ReactNode
  codeBlocks?: Array<{ label?: string; code: string }>
}

const VisualizerPanel = ({
  title,
  description,
  controls,
  preview,
  cssOutput,
  onReset,
  badge,
  tasks,
  status,
  codeBlocks,
}: VisualizerPanelProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!cssOutput) return
    await navigator.clipboard.writeText(cssOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            {badge ?? 'Interactive Lab'}
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        {onReset && (
          <Button variant="secondary" size="sm" onClick={onReset} className="self-start sm:self-center">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[360px,1fr]">
        <div className="flex flex-col gap-4">
          {status && (
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-sm text-slate-700 shadow-sm dark:border-white/12 dark:bg-white/5 dark:text-slate-200">
              {status}
            </div>
          )}
          {tasks && tasks.length > 0 && (
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-sm text-slate-700 shadow-sm dark:border-white/12 dark:bg-white/5 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">Try these</p>
              <ul className="mt-2 space-y-1">
                {tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        <div className="flex flex-col gap-3">{controls}</div>
        </div>
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/75">
            <div className="relative z-10">{preview}</div>
          </div>

          {(codeBlocks && codeBlocks.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {codeBlocks.map((block, idx) => (
                <CodeBlock key={`${block.label ?? 'code'}-${idx}`} label={block.label} code={block.code} />
              ))}
            </div>
          )) ||
            (cssOutput && (
              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-4 font-mono text-xs text-slate-800 shadow-sm dark:border-white/10 dark:bg-black/40 dark:text-primary/90">
                <div className="flex-1 whitespace-pre-wrap break-words leading-relaxed">{cssOutput}</div>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-slate-700 hover:text-slate-900 dark:text-primary dark:hover:text-white">
                <Copy className="h-4 w-4" />
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            ))}
        </div>
      </div>
    </GlassCard>
  )
}

export default VisualizerPanel

