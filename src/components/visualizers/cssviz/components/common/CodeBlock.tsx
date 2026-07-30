'use client';
import { Copy } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/components/visualizers/cssviz/utils/cn'

type CodeBlockProps = {
  label?: string
  code: string
  className?: string
}

const CodeBlock = ({ label = 'Code', code, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/80 bg-[#0f172a] p-3 font-mono text-xs text-slate-100 shadow-sm dark:border-white/12 dark:bg-[#0b1220]',
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-amber-300">
        <span>{label}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-100/80 hover:bg-white/10"
        >
          <Copy className="h-3 w-3" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap leading-relaxed text-slate-100">{code}</pre>
    </div>
  )
}

export default CodeBlock
