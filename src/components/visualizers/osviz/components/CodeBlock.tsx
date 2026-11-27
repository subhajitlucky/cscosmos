'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ code, caption }: { code: string; caption?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-2">
      {caption && (
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'var(--os-muted)' }}
          >
            {caption}
          </span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
            OS
          </span>
        </div>
      )}
      <div className="osviz-code relative">
        <button
          type="button"
          onClick={copy}
          className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/80 hover:bg-white/20"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <pre className="p-4 pr-20">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
