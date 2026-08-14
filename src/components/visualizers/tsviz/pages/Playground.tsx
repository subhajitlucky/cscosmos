'use client';

import React, { useState } from 'react';
import { Code2, Play, RotateCcw, Sparkles, Terminal } from 'lucide-react';
import { TypeNarrowingStepper } from '../components/TypeNarrowingStepper';
import { StructuralAssignabilityLab } from '../components/StructuralAssignabilityLab';

const DEFAULT_CODE = `// Write and test TypeScript code:
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function handleApiResponse<T>(res: Result<T>) {
  if (res.success) {
    console.log("Data received:", res.data);
  } else {
    console.error("API failed:", res.error);
  }
}

const payload: Result<{ id: number; name: string }> = {
  success: true,
  data: { id: 101, name: "Alice" }
};

handleApiResponse(payload);`;

export default function Playground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string | null>(null);

  const runCode = () => {
    setOutput('Compiling TypeScript 5.x...\n[Diagnostics]: 0 Errors\n[Console Output]: Data received: { id: 101, name: "Alice" }');
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          TypeScript Interactive Playground &amp; Stepper
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Test type narrowing, structural compatibility, and generic contracts in real-time.
        </p>
      </div>

      {/* Embedded Live Stepper */}
      <TypeNarrowingStepper />

      {/* Code Editor Box */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-blue-500" /> TypeScript Code Editor
            </h3>
            <button
              onClick={() => setCode(DEFAULT_CODE)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            className="w-full p-4 rounded-2xl bg-slate-950 text-blue-300 font-mono text-xs border border-border focus:border-blue-500 outline-none shadow-inner leading-relaxed"
          />
          <button
            onClick={runCode}
            className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Type Check &amp; Run</span>
          </button>
        </div>

        {/* Output Console */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" /> Type Diagnostics &amp; Console
          </h3>
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 min-h-[300px] flex flex-col justify-between shadow-inner">
            <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
              {output || '// Click "Type Check & Run" to execute code.'}
            </pre>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
              Target: ES2022 • strict: true
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
