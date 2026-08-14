'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, GitBranch, Play, RefreshCw, RotateCcw, Sparkles, Zap } from 'lucide-react';

export function GraphqlResolverVisualizer() {
  const [step, setStep] = useState<number>(0);
  const [log, setLog] = useState<string>('Ready to execute GraphQL Query AST traversal.');

  const steps = [
    { title: '1. Root Query.user(id: "42")', desc: 'Executes Query.user(parent: null, args: { id: "42" }, context, info). Queries DB for user #42.' },
    { title: '2. User.name', desc: 'Leaf resolver receives parent={ id: 42, name: "Alice" }. Returns "Alice" with 0 database queries.' },
    { title: '3. User.posts', desc: 'Executes User.posts(parent: User#42). Queries DB: SELECT * FROM posts WHERE user_id = 42.' },
    { title: '4. Post.title (Leaves)', desc: 'Maps over posts array. Returns ["Mastering GraphQL", "Building APIs with Next.js"].' },
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setLog(steps[step].desc);
      setStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setLog('Reset GraphQL execution pipeline.');
  };

  return (
    <div className="rounded-3xl border border-pink-500/30 bg-pink-500/5 dark:bg-pink-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-md">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400">
              GraphQL Execution Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Recursive Field Resolver Pipeline (parent, args, context, info)
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300 font-mono text-xs font-bold">
          Step {Math.min(step, 4)} of 4
        </span>
      </div>

      {/* Query vs Resolved Result */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Query AST */}
        <div className="p-5 rounded-3xl bg-slate-950 text-pink-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
            <span>GraphQL Query Document:</span>
            <span className="text-[10px] text-pink-400 font-bold">POST /graphql</span>
          </div>
          <pre className="whitespace-pre leading-relaxed text-[11px]">
{`query {
  user(id: "42") {
    name
    posts {
      title
    }
  }
}`}
          </pre>
        </div>

        {/* Dynamic JSON Output */}
        <div className="p-5 rounded-3xl bg-slate-950 text-emerald-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
            <span>Resolved JSON Payload:</span>
            <span className="text-[10px] text-emerald-400 font-bold">HTTP 200 OK</span>
          </div>
          <pre className="whitespace-pre leading-relaxed text-[11px]">
{step === 0
  ? `{\n  "data": null\n}`
  : step === 1
  ? `{\n  "data": {\n    "user": { ... }\n  }\n}`
  : step === 2
  ? `{\n  "data": {\n    "user": {\n      "name": "Alice"\n    }\n  }\n}`
  : `{\n  "data": {\n    "user": {\n      "name": "Alice",\n      "posts": [\n        { "title": "Mastering GraphQL" },\n        { "title": "Building APIs" }\n      ]\n    }\n  }\n}`}
          </pre>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-pink-400 font-bold">Resolver Execution Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          onClick={handleNext}
          disabled={step >= 4}
          className="px-6 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Step Next Field Resolver ({step}/4)</span>
        </button>
      </div>
    </div>
  );
}
