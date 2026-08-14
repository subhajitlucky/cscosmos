'use client';

import React, { useState } from 'react';
import { Database, Play, RotateCcw, Sparkles, Terminal, Zap } from 'lucide-react';

export function NodePlayground() {
  const [code, setCode] = useState<string>(
`console.log('1. Sync Start');

setTimeout(() => console.log('5. setTimeout (Timers Phase)'), 0);

setImmediate(() => console.log('4. setImmediate (Check Phase)'));

Promise.resolve().then(() => console.log('3. Promise.then (Microtask)'));

process.nextTick(() => console.log('2. process.nextTick (VIP Queue)'));

console.log('1.5. Sync End');`
  );

  const [output, setOutput] = useState<string[]>([
    '1. Sync Start',
    '1.5. Sync End',
    '2. process.nextTick (VIP Queue)',
    '3. Promise.then (Microtask)',
    '5. setTimeout (Timers Phase)',
    '4. setImmediate (Check Phase)',
  ]);

  const [execTime, setExecTime] = useState<number>(0.04);

  const handleRun = () => {
    // Client-side simulation
    const logs: string[] = [];
    if (code.includes('nextTick') && code.includes('Promise')) {
      logs.push('1. Sync Start');
      logs.push('1.5. Sync End');
      logs.push('2. process.nextTick (VIP Queue)');
      logs.push('3. Promise.then (Microtask)');
      logs.push('5. setTimeout (Timers Phase)');
      logs.push('4. setImmediate (Check Phase)');
    } else if (code.includes('highWaterMark')) {
      logs.push('[Stream] Readable stream pushing 64KB chunks...');
      logs.push('[Stream] Writable buffer full (highWaterMark reached)!');
      logs.push('[Stream] Emitted "drain" event -> Resumed reading.');
    } else {
      logs.push('Node.js V8 execution completed successfully.');
      logs.push('Event loop idle. Exited with code 0.');
    }
    setOutput(logs);
    setExecTime(Number((Math.random() * 0.05 + 0.02).toFixed(3)));
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Interactive Node.js Sandbox
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Node.js Script Runner &amp; Event Loop Execution Tracer
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Node v22 LTS Engine • V8 + Libuv
        </span>
      </div>

      {/* Editor Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>JavaScript Code (Node.js API):</span>
          <span>Click &ldquo;Execute Script&rdquo; to simulate</span>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={7}
          className="w-full p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs border border-border focus:border-emerald-500 outline-none shadow-inner leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-muted-foreground self-center">Presets:</span>
            <button
              onClick={() => {
                setCode(
`console.log('1. Sync Start');\nsetTimeout(() => console.log('5. setTimeout (Timers)'), 0);\nsetImmediate(() => console.log('4. setImmediate (Check)'));\nPromise.resolve().then(() => console.log('3. Promise.then (Microtask)'));\nprocess.nextTick(() => console.log('2. process.nextTick (VIP)'));\nconsole.log('1.5. Sync End');`
                );
              }}
              className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
            >
              Event Loop Order
            </button>
            <button
              onClick={() => {
                setCode(
`import fs from 'fs';\nconst stream = fs.createReadStream('./huge.mp4', { highWaterMark: 64 * 1024 });\nstream.on('data', (chunk) => console.log('Read chunk:', chunk.length));`
                );
              }}
              className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
            >
              Stream Pipeline
            </button>
          </div>

          <button
            onClick={handleRun}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute Script</span>
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Terminal className="w-3.5 h-3.5" /> node script.js stdout:
          </span>
          <span className="text-slate-400">Execution: {execTime} ms</span>
        </div>

        <div className="space-y-1 py-1">
          {output.map((line, idx) => (
            <div key={idx} className="text-emerald-300 font-mono">
              <span className="text-slate-600 select-none mr-2">&gt;</span>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
