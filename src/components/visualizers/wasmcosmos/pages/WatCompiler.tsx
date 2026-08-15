'use client';

import React, { useState } from 'react';
import { Binary, Code2, Copy, Check, Sparkles, Cpu, Layers } from 'lucide-react';

interface WatPreset {
  id: string;
  name: string;
  wat: string;
  sections: {
    name: string;
    id: string;
    hex: string;
    desc: string;
    color: string;
  }[];
}

const PRESETS: WatPreset[] = [
  {
    id: 'add-func',
    name: 'Add Two Integers',
    wat: `(module
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)
  (export "add" (func $add))
)`,
    sections: [
      { name: 'Preamble', id: '0x00', hex: '00 61 73 6d 01 00 00 00', desc: 'Magic bytes \\0asm + Version 1', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
      { name: 'Type Section', id: '0x01', hex: '01 07 01 60 02 7f 7f 01 7f', desc: 'Declares signature (i32, i32) -> i32', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
      { name: 'Function Section', id: '0x03', hex: '03 02 01 00', desc: 'Maps func 0 to Type signature index 0', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
      { name: 'Export Section', id: '0x07', hex: '07 07 01 03 61 64 64 00 00', desc: 'Exports func 0 with name "add"', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
      { name: 'Code Section', id: '0x0a', hex: '0a 09 01 07 00 20 00 20 01 6a 0b', desc: 'local.get 0 (20 00), local.get 1 (20 01), i32.add (6a), end (0b)', color: 'text-pink-400 border-pink-500/30 bg-pink-500/10' },
    ]
  },
  {
    id: 'memory-store',
    name: 'Linear Memory Store',
    wat: `(module
  (memory (export "mem") 1)
  (func $storeAt (param $val i32)
    i32.const 0
    local.get $val
    i32.store)
  (export "storeAt" (func $storeAt))
)`,
    sections: [
      { name: 'Preamble', id: '0x00', hex: '00 61 73 6d 01 00 00 00', desc: 'Magic bytes \\0asm + Version 1', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
      { name: 'Type Section', id: '0x01', hex: '01 05 01 60 01 7f 00', desc: 'Signature: (i32) -> void', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
      { name: 'Memory Section', id: '0x05', hex: '05 03 01 00 01', desc: 'Allocates 1 page (64 KiB) linear memory', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
      { name: 'Export Section', id: '0x07', hex: '07 11 02 03 6d 65 6d 02 00 07 73 74 6f 72 65 41 74 00 00', desc: 'Exports "mem" (memory) and "storeAt" (function)', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
      { name: 'Code Section', id: '0x0a', hex: '0a 0b 01 09 00 41 00 20 00 36 02 00 0b', desc: 'i32.const 0 (41 00), local.get 0, i32.store (36 02 00), end (0b)', color: 'text-pink-400 border-pink-500/30 bg-pink-500/10' },
    ]
  }
];

export function WatCompiler() {
  const [selectedPreset, setSelectedPreset] = useState<WatPreset>(PRESETS[0]);
  const [copied, setCopied] = useState(false);

  const fullHex = selectedPreset.sections.map(s => s.hex).join(' ');

  const copyHex = () => {
    navigator.clipboard.writeText(fullHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--wasm-magenta)]/30 bg-[var(--wasm-magenta)]/10 text-[var(--wasm-magenta)] text-xs font-mono">
          <Binary className="w-3.5 h-3.5" /> Binary Bytecode &amp; Section Tables
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--wasm-text)]">
          WAT Text &rarr; <span className="text-[var(--wasm-primary)] wasm-glow">Binary Hex Inspector</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--wasm-muted)] max-w-2xl leading-relaxed">
          Inspect how human-readable WebAssembly Text S-expressions encode into raw machine bytecode with sequential section headers.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-[var(--wasm-muted)]">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPreset(p)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedPreset.id === p.id
                ? 'bg-[var(--wasm-primary)] text-white font-bold'
                : 'border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] text-[var(--wasm-muted)] hover:text-[var(--wasm-text)]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left WAT Source Code */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--wasm-border)] bg-[var(--wasm-surface)] p-6 space-y-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--wasm-border-subtle)] pb-4">
            <span className="text-[var(--wasm-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5" /> WebAssembly S-Expression (WAT)
            </span>
            <span className="text-[10px] text-[var(--wasm-muted)]">
              HUMAN_READABLE
            </span>
          </div>

          <pre className="p-4 rounded-xl bg-[var(--wasm-bg)] border border-[var(--wasm-border-subtle)] text-[var(--wasm-text)] overflow-x-auto leading-relaxed">
            <code>{selectedPreset.wat}</code>
          </pre>
        </div>

        {/* Right Binary Section Decoder */}
        <div className="lg:col-span-7 space-y-6 font-mono text-xs">
          <div className="rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--wasm-border-subtle)] pb-4">
              <span className="text-[var(--wasm-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Binary className="w-3.5 h-3.5" /> Encoded Bytecode Sections
              </span>
              <button
                onClick={copyHex}
                className="text-[10px] text-[var(--wasm-muted)] hover:text-[var(--wasm-primary)] flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied Hex' : 'Copy All Bytes'}
              </button>
            </div>

            {/* Section Breakdown List */}
            <div className="space-y-3">
              {selectedPreset.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 ${sec.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">
                      {sec.name} ({sec.id})
                    </span>
                    <span className="text-[10px] opacity-80">{sec.desc}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 text-[11px] font-mono select-all break-all tracking-wider text-white">
                    {sec.hex}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
