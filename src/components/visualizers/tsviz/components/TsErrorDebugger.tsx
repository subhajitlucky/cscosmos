'use client';

import React, { useState } from 'react';
import { AlertCircle, Bug, CheckCircle2, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { TS_ERRORS, type TsErrorItem } from '../data/errors';

export function TsErrorDebugger() {
  const [selectedError, setSelectedError] = useState<TsErrorItem>(TS_ERRORS[0]);

  return (
    <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-rose-600 dark:text-rose-400">
              Interactive Diagnostic Debugger
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Top TypeScript Compiler Errors Decoded
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold">
          Diagnostic Code: {selectedError.code}
        </span>
      </div>

      {/* Error Selector */}
      <div className="flex flex-wrap gap-2">
        {TS_ERRORS.map((err) => (
          <button
            key={err.code}
            onClick={() => setSelectedError(err)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
              selectedError.code === err.code
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-card border border-border text-foreground hover:border-rose-500'
            }`}
          >
            {err.code}: {err.title}
          </button>
        ))}
      </div>

      {/* Diagnostic Message */}
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-mono text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
        <span><strong>Error:</strong> {selectedError.errorMessage}</span>
      </div>

      {/* Bad vs Good Code Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bad Code */}
        <div className="rounded-2xl border border-rose-500/40 bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner space-y-2">
          <div className="flex items-center justify-between text-rose-400 text-[11px] border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Problematic Code</span>
            <span>Compiler Error</span>
          </div>
          <pre className="text-rose-300 whitespace-pre-wrap leading-relaxed py-2">
            {selectedError.badCode}
          </pre>
        </div>

        {/* Good Code */}
        <div className="rounded-2xl border border-emerald-500/40 bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner space-y-2">
          <div className="flex items-center justify-between text-emerald-400 text-[11px] border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Idiomatic Fix</span>
            <span>Type Safe ✅</span>
          </div>
          <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed py-2">
            {selectedError.goodCode}
          </pre>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Why This Error Happens:
        </span>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {selectedError.explanation}
        </p>
      </div>
    </div>
  );
}
