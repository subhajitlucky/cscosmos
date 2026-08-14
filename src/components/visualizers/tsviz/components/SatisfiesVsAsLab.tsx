'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck, Sparkles, Terminal, XCircle } from 'lucide-react';

type Mode = 'annotation' | 'assertion' | 'satisfies';

export function SatisfiesVsAsLab() {
  const [mode, setMode] = useState<Mode>('satisfies');

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              TypeScript 4.9+ Modern Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              The &ldquo;satisfies&rdquo; Operator vs Type Annotations vs &ldquo;as&rdquo; Assertions
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold">
          Zero Type Widening • 100% Contract Safety
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setMode('annotation')}
          className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
            mode === 'annotation'
              ? 'bg-sky-600 text-white shadow-md border-sky-500 font-bold'
              : 'bg-card border-border text-foreground hover:border-sky-500'
          }`}
        >
          <div className="font-bold">1. Type Annotation</div>
          <div className={`text-[10px] ${mode === 'annotation' ? 'text-sky-100' : 'text-muted-foreground'}`}>
            const x: Record&lt;string, Color&gt;
          </div>
        </button>

        <button
          onClick={() => setMode('assertion')}
          className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
            mode === 'assertion'
              ? 'bg-rose-600 text-white shadow-md border-rose-500 font-bold'
              : 'bg-card border-border text-foreground hover:border-rose-500'
          }`}
        >
          <div className="font-bold">2. Type Assertion</div>
          <div className={`text-[10px] ${mode === 'assertion' ? 'text-rose-100' : 'text-muted-foreground'}`}>
            const x = &#123; ... &#125; as Record&lt;string, Color&gt;
          </div>
        </button>

        <button
          onClick={() => setMode('satisfies')}
          className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
            mode === 'satisfies'
              ? 'bg-emerald-600 text-white shadow-md border-emerald-500 font-bold'
              : 'bg-card border-border text-foreground hover:border-emerald-500'
          }`}
        >
          <div className="font-bold">3. satisfies Operator</div>
          <div className={`text-[10px] ${mode === 'satisfies' ? 'text-emerald-100' : 'text-muted-foreground'}`}>
            const x = &#123; ... &#125; satisfies Record&lt;string, Color&gt;
          </div>
        </button>
      </div>

      {/* Code & Evaluation Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-sky-400" /> palette.ts</span>
            <span>Mode: {mode}</span>
          </div>

          <pre className="text-sky-300 overflow-x-auto whitespace-pre-wrap leading-relaxed py-2">
{mode === 'annotation' && `type RGB = [number, number, number];
type Color = string | RGB;

// Type Annotation widens values to (string | RGB):
const palette: Record<string, Color> = {
  red: [255, 0, 0],
  green: '#00ff00',
  bleu: '#0000ff' // ❌ Typo allowed because key is broad string!
};

// ❌ TypeScript cannot prove green is string:
// palette.green.toUpperCase(); // Property 'toUpperCase' does not exist on type 'Color'!`}

{mode === 'assertion' && `type RGB = [number, number, number];
type Color = string | RGB;

// ⚠️ Type Assertion bypasses compiler checking:
const palette = {
  red: [255, 0, 0],
  green: 12345 // ❌ SILENT BUG! Number is NOT a valid Color!
} as Record<string, Color>;

// 💥 Runtime Crash!
palette.green.toUpperCase(); // Crashes in production!`}

{mode === 'satisfies' && `type RGB = [number, number, number];
type Color = string | RGB;

// ✅ satisfies validates contract AND preserves exact types:
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, Color>;

// ✅ Exact literal access & autocompletion!
palette.green.toUpperCase(); // Inferred as string
palette.red.map(c => c * 2);  // Inferred as [number, number, number]`}
          </pre>
        </div>

        {/* Verdict Box */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Compiler Verdict:
            </div>
            {mode === 'annotation' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-500" /> Type Widening Trap</div>
                <div>Values lose their exact inferred shape and become broad unions (string | RGB), breaking member autocompletion.</div>
              </div>
            )}
            {mode === 'assertion' && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-200 text-xs font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5"><XCircle className="w-4 h-4 text-rose-500" /> Unsound Escape Hatch</div>
                <div>&ldquo;as&rdquo; tells the compiler to shut up and trust you, concealing invalid property values that cause runtime exceptions.</div>
              </div>
            )}
            {mode === 'satisfies' && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Golden Ratio (Best of Both Worlds)</div>
                <div>Enforces strict conformance to Record&lt;string, Color&gt; while preserving exact literal types for keys and values!</div>
              </div>
            )}
          </div>

          <div className="space-y-1 text-xs text-muted-foreground font-mono">
            <div>• Autocompletion: {mode === 'satisfies' ? '✅ Exact Keys & Values' : '❌ Lost or Unsound'}</div>
            <div>• Catches Typos: {mode === 'assertion' ? '❌ Silenced' : '✅ Verified'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
