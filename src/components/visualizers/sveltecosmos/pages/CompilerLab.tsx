'use client';

import React, { useState } from 'react';
import { Cpu, Code2, Layers, Binary, CheckCircle2, Copy } from 'lucide-react';

export function CompilerLab() {
  const [templateCode, setTemplateCode] = useState(`<script>
  let name = $state('Svelte');
  let count = $state(0);
  let double = $derived(count * 2);
</script>

<div class="card">
  <h1>Hello {name}!</h1>
  <button onclick={() => count++}>
    Count: {count} (2x = {double})
  </button>
</div>

<style>
  .card { padding: 1rem; border: 1px solid #ff3e00; }
</style>`);

  const [mode, setMode] = useState<'client' | 'ssr' | 'ast'>('client');
  const [copied, setCopied] = useState(false);

  const clientOutput = `// Svelte 5 Client Compiler Output (ESM)
import * as $ from "svelte/internal/client";

export default function App($$anchor) {
  // 1. Reactive Sources & Signals
  let name = $.source("Svelte");
  let count = $.source(0);
  let double = $.derive(() => $.get(count) * 2);

  // 2. Surgical DOM Template Creation
  var div = $.element("div", "svelte-1b2c3d");
  var h1 = $.element("h1");
  $.append(h1, $.text("Hello "));
  $.append(h1, $.derive(() => $.get(name)));
  $.append(h1, $.text("!"));
  $.append(div, h1);

  // 3. Event Listener Binding
  var button = $.element("button");
  $.append(button, $.text("Count: "));
  $.append(button, $.derive(() => $.get(count)));
  $.append(button, $.text(" (2x = "));
  $.append(button, $.derive(() => $.get(double)));
  $.append(button, $.text(")"));

  $.on(button, "click", () => $.set(count, $.get(count) + 1));
  $.append(div, button);

  // 4. Mount to Host Anchor (0 VDOM passes)
  $.append($$anchor, div);
}`;

  const ssrOutput = `// Svelte 5 SSR Output (Zero Client JS payload required)
import * as $ from "svelte/internal/server";

export default function App($$payload, $$props) {
  let name = "Svelte";
  let count = 0;
  let double = count * 2;

  $$payload.out += \`<div class="card svelte-1b2c3d">
    <h1>Hello \${$.escape(name)}!</h1>
    <button>Count: \${$.escape(count)} (2x = \${$.escape(double)})</button>
  </div>\`;
}`;

  const astOutput = `{
  "type": "Root",
  "instance": {
    "type": "Script",
    "context": "default",
    "content": [
      { "type": "VariableDeclaration", "kind": "let", "name": "name", "rune": "$state" },
      { "type": "VariableDeclaration", "kind": "let", "name": "count", "rune": "$state" },
      { "type": "VariableDeclaration", "kind": "let", "name": "double", "rune": "$derived" }
    ]
  },
  "fragment": {
    "type": "Fragment",
    "nodes": [
      {
        "type": "RegularElement",
        "name": "div",
        "attributes": [{ "type": "ClassAttribute", "name": "card" }],
        "children": ["h1", "button"]
      }
    ]
  },
  "css": {
    "type": "StyleSheet",
    "hash": "svelte-1b2c3d"
  }
}`;

  const handleCopy = () => {
    const text = mode === 'client' ? clientOutput : mode === 'ssr' ? ssrOutput : astOutput;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--svelte-primary)]/30 bg-[var(--svelte-primary)]/10 text-[var(--svelte-primary)] text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" /> Compiler AST Laboratory
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--svelte-text)]">
          Compiler <span className="text-[var(--svelte-primary)] svelte-glow">AST &amp; CodeGen</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--svelte-muted)] max-w-2xl leading-relaxed">
          Inspect how the Svelte lexer, parser, and code generator compile your Single File Components into client DOM mutators or streaming server strings.
        </p>
      </div>

      {/* Compiler Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Input Editor */}
        <div className="lg:col-span-6 rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="px-4 py-3 border-b border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface-2)] flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--svelte-muted)] flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[var(--svelte-primary)]" />
              Input: Component.svelte
            </span>
            <span className="text-[10px] font-mono text-[var(--svelte-primary)] bg-[var(--svelte-primary)]/10 px-2 py-0.5 rounded border border-[var(--svelte-primary)]/20">
              SVELTE_5_SYNTAX
            </span>
          </div>

          <textarea
            value={templateCode}
            onChange={(e) => setTemplateCode(e.target.value)}
            className="w-full h-[450px] p-6 bg-transparent font-mono text-xs text-[var(--svelte-text)] leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[var(--svelte-primary)]"
            spellCheck="false"
          />

          <div className="px-4 py-2.5 border-t border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface-2)] flex items-center justify-between text-[10px] font-mono text-[var(--svelte-muted)]">
            <span>Lexical Parser: Acorn + Svelte HTML Lexer</span>
            <span>UTF-8</span>
          </div>
        </div>

        {/* Right Output Inspector */}
        <div className="lg:col-span-6 rounded-2xl border border-[var(--svelte-border)] bg-[var(--svelte-surface)] overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="px-4 py-3 border-b border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface-2)] flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[var(--svelte-bg)] p-1 rounded-md border border-[var(--svelte-border-subtle)]">
              <button
                onClick={() => setMode('client')}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                  mode === 'client' ? 'bg-[var(--svelte-primary)] text-white' : 'text-[var(--svelte-muted)] hover:text-[var(--svelte-text)]'
                }`}
              >
                Client DOM
              </button>
              <button
                onClick={() => setMode('ssr')}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                  mode === 'ssr' ? 'bg-[var(--svelte-primary)] text-white' : 'text-[var(--svelte-muted)] hover:text-[var(--svelte-text)]'
                }`}
              >
                SSR String
              </button>
              <button
                onClick={() => setMode('ast')}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                  mode === 'ast' ? 'bg-[var(--svelte-primary)] text-white' : 'text-[var(--svelte-muted)] hover:text-[var(--svelte-text)]'
                }`}
              >
                AST JSON
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="text-[10px] font-mono text-[var(--svelte-muted)] hover:text-[var(--svelte-primary)] flex items-center gap-1"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-[var(--svelte-mint)]" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Output'}
            </button>
          </div>

          <div className="p-6 font-mono text-xs overflow-x-auto h-[450px]">
            <pre className="text-[var(--svelte-text)] leading-relaxed">
              <code>
                {mode === 'client' ? clientOutput : mode === 'ssr' ? ssrOutput : astOutput}
              </code>
            </pre>
          </div>

          <div className="px-4 py-2.5 border-t border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface-2)] flex items-center justify-between text-[10px] font-mono text-[var(--svelte-muted)]">
            <span>Target: {mode === 'client' ? 'Hydratable Client ESM' : mode === 'ssr' ? 'Streaming SSR Function' : 'Acorn AST Tree'}</span>
            <span className="text-[var(--svelte-mint)]">Zero VDOM Overhead</span>
          </div>
        </div>
      </div>
    </div>
  );
}
