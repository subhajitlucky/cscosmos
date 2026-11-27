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
    <div className="it-code">
      <div className="it-code-header">
        <span>{caption ?? 'Example'}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 border border-white/15 px-2 py-1 text-[9px] font-semibold text-white/70 hover:border-white/40 hover:text-white"
          aria-label="Copy example"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}
