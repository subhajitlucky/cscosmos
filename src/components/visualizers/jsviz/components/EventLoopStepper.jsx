'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Play, RefreshCw, RotateCcw, SkipForward, Sparkles, Terminal, Zap } from 'lucide-react';

const PRESETS = [
  {
    id: 'promise-timeout',
    title: 'Promise vs setTimeout vs Synchronous',
    code: `console.log('1: Sync Start');

setTimeout(() => {
  console.log('4: setTimeout callback');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise microtask');
});

console.log('2: Sync End');`,
    steps: [
      {
        line: 1,
        stack: ['console.log("1: Sync Start")'],
        webApi: [],
        microtasks: [],
        macrotasks: [],
        logs: ['1: Sync Start'],
        explanation: 'Synchronous log executes immediately on the Call Stack.'
      },
      {
        line: 3,
        stack: ['setTimeout(...)'],
        webApi: ['Timer (0ms)'],
        microtasks: [],
        macrotasks: [],
        logs: ['1: Sync Start'],
        explanation: 'setTimeout is offloaded to the browser Web APIs background thread.'
      },
      {
        line: 7,
        stack: ['Promise.resolve().then(...)'],
        webApi: ['Timer (0ms)'],
        microtasks: ['Promise callback () => log("3: Promise microtask")'],
        macrotasks: [],
        logs: ['1: Sync Start'],
        explanation: 'Resolved promise schedules its .then callback onto the high-priority Microtask Queue.'
      },
      {
        line: 11,
        stack: ['console.log("2: Sync End")'],
        webApi: [],
        microtasks: ['Promise callback'],
        macrotasks: ['setTimeout callback'],
        logs: ['1: Sync Start', '2: Sync End'],
        explanation: 'Timer completes in Web APIs and moves to Macrotask Queue. Final sync log executes.'
      },
      {
        line: 8,
        stack: ['Promise callback'],
        webApi: [],
        microtasks: [],
        macrotasks: ['setTimeout callback'],
        logs: ['1: Sync Start', '2: Sync End', '3: Promise microtask'],
        explanation: 'Call Stack is empty! Event Loop flushes the Microtask Queue BEFORE touching macrotasks.'
      },
      {
        line: 4,
        stack: ['setTimeout callback'],
        webApi: [],
        microtasks: [],
        macrotasks: [],
        logs: ['1: Sync Start', '2: Sync End', '3: Promise microtask', '4: setTimeout callback'],
        explanation: 'Microtasks are fully drained. Event Loop picks the oldest callback from Macrotask Queue.'
      }
    ]
  },
  {
    id: 'async-await',
    title: 'Async / Await Execution Order',
    code: `async function async1() {
  console.log('2: async1 start');
  await async2();
  console.log('4: async1 end');
}

async function async2() {
  console.log('3: async2 body');
}

console.log('1: script start');
async1();
console.log('5: script end');`,
    steps: [
      {
        line: 10,
        stack: ['console.log("1: script start")'],
        webApi: [],
        microtasks: [],
        macrotasks: [],
        logs: ['1: script start'],
        explanation: 'Synchronous script start executes on Call Stack.'
      },
      {
        line: 2,
        stack: ['async1()', 'console.log("2: async1 start")'],
        webApi: [],
        microtasks: [],
        macrotasks: [],
        logs: ['1: script start', '2: async1 start'],
        explanation: 'async1 begins executing synchronously until the first await.'
      },
      {
        line: 7,
        stack: ['async2()', 'console.log("3: async2 body")'],
        webApi: [],
        microtasks: ['async1 resumption (microtask)'],
        macrotasks: [],
        logs: ['1: script start', '2: async1 start', '3: async2 body'],
        explanation: 'async2 executes. The await pauses async1 and packages its remainder into a microtask.'
      },
      {
        line: 12,
        stack: ['console.log("5: script end")'],
        webApi: [],
        microtasks: ['async1 resumption'],
        macrotasks: [],
        logs: ['1: script start', '2: async1 start', '3: async2 body', '5: script end'],
        explanation: 'Synchronous script completes; call stack empties.'
      },
      {
        line: 4,
        stack: ['async1 (resumed)', 'console.log("4: async1 end")'],
        webApi: [],
        microtasks: [],
        macrotasks: [],
        logs: ['1: script start', '2: async1 start', '3: async2 body', '5: script end', '4: async1 end'],
        explanation: 'Event loop runs the microtask, resuming async1 after the await keyword.'
      }
    ]
  }
];

export function EventLoopStepper() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = selectedPreset.steps[stepIndex] || selectedPreset.steps[0];

  const handleNext = () => {
    setStepIndex((prev) => (prev < selectedPreset.steps.length - 1 ? prev + 1 : prev));
  };

  const handleReset = () => {
    setStepIndex(0);
  };

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setStepIndex(0);
  };

  return (
    <div className="rounded-3xl border border-lime-500/30 bg-lime-500/5 dark:bg-lime-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lime-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-lime-400 text-black flex items-center justify-center font-bold shadow-md">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-lime-600 dark:text-lime-400">
              Interactive JS Engine Visualizer
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Event Loop, Call Stack &amp; Microtask Queue Stepper
            </h3>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPreset.id === p.id
                  ? 'bg-lime-400 text-slate-950 shadow-md font-extrabold'
                  : 'bg-card border border-border text-foreground hover:border-lime-400'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main 4-Box Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Call Stack */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3 min-h-[180px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-500 border-b border-border pb-2">
            <span>1. Call Stack (LIFO)</span>
            <span className="text-[10px] font-mono">{currentStep.stack.length} frames</span>
          </div>
          <div className="space-y-1.5 flex-1 flex flex-col-reverse justify-end">
            {currentStep.stack.length > 0 ? (
              currentStep.stack.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold animate-in fade-in"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-xs italic font-mono text-center py-6">
                [Stack Empty]
              </div>
            )}
          </div>
        </div>

        {/* 2. Web APIs */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3 min-h-[180px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-500 border-b border-border pb-2">
            <span>2. Web APIs (Background)</span>
            <span className="text-[10px] font-mono">{currentStep.webApi.length} active</span>
          </div>
          <div className="space-y-1.5 flex-1">
            {currentStep.webApi.length > 0 ? (
              currentStep.webApi.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold animate-in fade-in"
                >
                  ⏳ {item}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-xs italic font-mono text-center py-6">
                [No Active Background Timers]
              </div>
            )}
          </div>
        </div>

        {/* 3. Microtask Queue */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3 min-h-[180px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-500 border-b border-border pb-2">
            <span>3. Microtasks (VIP Queue)</span>
            <span className="text-[10px] font-mono">{currentStep.microtasks.length} queued</span>
          </div>
          <div className="space-y-1.5 flex-1">
            {currentStep.microtasks.length > 0 ? (
              currentStep.microtasks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold animate-in fade-in"
                >
                  ⚡ {item}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-xs italic font-mono text-center py-6">
                [Queue Empty]
              </div>
            )}
          </div>
        </div>

        {/* 4. Macrotask (Callback) Queue */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3 min-h-[180px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-500 border-b border-border pb-2">
            <span>4. Callback Queue (Macrotasks)</span>
            <span className="text-[10px] font-mono">{currentStep.macrotasks.length} queued</span>
          </div>
          <div className="space-y-1.5 flex-1">
            {currentStep.macrotasks.length > 0 ? (
              currentStep.macrotasks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold animate-in fade-in"
                >
                  📦 {item}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-xs italic font-mono text-center py-6">
                [Queue Empty]
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Snippet & Explanation */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Code Box */}
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner">
          <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-lime-400" /> snippet.js</span>
            <span>Step {stepIndex + 1} of {selectedPreset.steps.length}</span>
          </div>
          <pre className="text-lime-300 whitespace-pre-wrap leading-relaxed">
            {selectedPreset.code}
          </pre>
        </div>

        {/* Console & Explanation */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> What Just Happened:
            </span>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs">
            <span className="text-slate-400 text-[11px] block border-b border-slate-800 pb-1.5 mb-2">Console Output (stdout):</span>
            <div className="space-y-1 min-h-[50px]">
              {currentStep.logs.map((log, idx) => (
                <div key={idx} className="text-emerald-400 flex items-center gap-1.5">
                  <span className="text-slate-600">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-lime-500/20">
        <button
          onClick={handleNext}
          disabled={stepIndex >= selectedPreset.steps.length - 1}
          className="px-6 py-2.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-extrabold text-xs transition shadow-md flex items-center gap-2 disabled:opacity-40"
        >
          <SkipForward className="w-4 h-4 fill-current" />
          <span>Next Execution Step</span>
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Stepper</span>
        </button>
      </div>
    </div>
  );
}
