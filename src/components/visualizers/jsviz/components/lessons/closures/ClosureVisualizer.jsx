'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Database, 
  Activity, 
  Sparkles, 
  ArrowDown, 
  CheckCircle2,
  Trash2,
  Info,
  Maximize2,
  Zap
} from 'lucide-react';

const EXECUTION_STEPS = [
  {
    step: 0,
    title: 'Script Evaluation & Global Context',
    codeHighlightLine: 1,
    action: 'Global context initializes. Function createCounter is registered in Global Lexical Environment.',
    callStack: [
      { name: 'Global Execution Context', type: 'global', status: 'running' }
    ],
    heap: {
      global: {
        record: {
          'createCounter': 'ƒ createCounter()'
        }
      },
      closureEnv: null,
      innerFn: null
    },
    insight: 'Execution begins at the top level. The JavaScript engine allocates the Global Execution Context on the Call Stack and records function definitions in the Global Environment Record.',
    activePhase: 'PARSE & GLOBAL SETUP'
  },
  {
    step: 1,
    title: 'Invoke createCounter()',
    codeHighlightLine: 13,
    action: 'createCounter() is called. A new Execution Context is pushed to the Call Stack.',
    callStack: [
      { name: 'Global Execution Context', type: 'global', status: 'suspended' },
      { name: 'createCounter()', type: 'function', status: 'running' }
    ],
    heap: {
      global: {
        record: {
          'createCounter': 'ƒ createCounter()',
          'counter': '<uninitialized>'
        }
      },
      closureEnv: {
        name: 'createCounter Lexical Environment',
        outer: 'Global Environment',
        record: {
          'count': '<uninitialized>'
        },
        retained: true
      },
      innerFn: null
    },
    insight: 'Pushing createCounter() onto the Call Stack suspends Global Context. A fresh Lexical Environment is allocated with an outer reference pointing to Global.',
    activePhase: 'CONTEXT PUSH'
  },
  {
    step: 2,
    title: 'Initialize local variable "count = 0"',
    codeHighlightLine: 2,
    action: 'let count = 0 executes. The binding count is initialized in createCounter\'s Environment Record.',
    callStack: [
      { name: 'Global Execution Context', type: 'global', status: 'suspended' },
      { name: 'createCounter()', type: 'function', status: 'running' }
    ],
    heap: {
      global: {
        record: {
          'createCounter': 'ƒ createCounter()',
          'counter': '<uninitialized>'
        }
      },
      closureEnv: {
        name: 'createCounter Lexical Environment',
        outer: 'Global Environment',
        record: {
          'count': 0
        },
        retained: true,
        highlightKey: 'count'
      },
      innerFn: null
    },
    insight: 'The variable "count" lives inside this specific invocation\'s Environment Record. If createCounter() were called again, a completely distinct record would be spawned.',
    activePhase: 'VARIABLE INITIALIZATION'
  },
  {
    step: 3,
    title: 'Instantiate increment() Function Object',
    codeHighlightLine: 4,
    action: 'The increment function object is created. Its hidden [[Environment]] slot is permanently set to the current Lexical Environment.',
    callStack: [
      { name: 'Global Execution Context', type: 'global', status: 'suspended' },
      { name: 'createCounter()', type: 'function', status: 'running' }
    ],
    heap: {
      global: {
        record: {
          'createCounter': 'ƒ createCounter()',
          'counter': '<uninitialized>'
        }
      },
      closureEnv: {
        name: 'createCounter Lexical Environment',
        outer: 'Global Environment',
        record: {
          'count': 0
        },
        retained: true
      },
      innerFn: {
        name: 'increment() Function Object',
        envSlot: 'createCounter Lexical Environment',
        code: 'count++; return count;'
      }
    },
    insight: 'CRITICAL MECHANISM: The engine attaches the internal slot increment.[[Environment]] = createCounterEnv. This internal reference forms the closure backbone!',
    activePhase: 'FUNCTION CREATION & [[Environment]]'
  },
  {
    step: 4,
    title: 'Return increment & Assign to "counter"',
    codeHighlightLine: 9,
    action: 'createCounter returns the increment function reference. Global variable "counter" receives this reference.',
    callStack: [
      { name: 'Global Execution Context', type: 'global', status: 'suspended' },
      { name: 'createCounter()', type: 'function', status: 'completing' }
    ],
    heap: {
      global: {
        record: {
          'createCounter': 'ƒ createCounter()',
          'counter': 'ƒ increment() [ref]'
        }
      },
      closureEnv: {
        name: 'createCounter Lexical Environment',
        outer: 'Global Environment',
        record: {
          'count': 0
        },
        retained: true
      },
      innerFn: {
        name: 'increment() Function Object',
        envSlot: 'createCounter Lexical Environment',
        code: 'count++; return count;'
      }
    },
    insight: 'The function reference escapes createCounter\'s local scope and is now stored in global variable "counter". Both counter and increment point to the same memory object.',
    activePhase: 'RETURN REFERENCE'
  },
  {
    step: 5,
    title: 'createCounter() Stack Frame Pops & Destroys!',
    codeHighlightLine: 13,
    action: 'createCounter() completes execution and its frame is REMOVED from the Call Stack. But its Lexical Environment stays on the Heap!',
    callStack: [
      { name: 'Global Execution Context', type: 'global', status: 'running' }
    ],
    heap: {
      global: {
        record: {
          'createCounter': 'ƒ createCounter()',
          'counter': 'ƒ increment() [ref]'
        }
      },
      closureEnv: {
        name: 'createCounter Lexical Environment',
        outer: 'Global Environment',
        record: {
          'count': 0
        },
        retained: true,
        isOrphanFromStack: true
      },
      innerFn: {
        name: 'increment() Function Object',
        envSlot: 'createCounter Lexical Environment',
        code: 'count++; return count;'
      }
    },
    insight: 'TECHNICAL CORE: The Call Stack frame is gone! But the Garbage Collector (GC) sees: Global -> counter -> increment -> [[Environment]] -> createCounterEnv. Since a path from the GC Root exists, it CANNOT be collected!',
    activePhase: 'CALL STACK POP & HEAP RETENTION'
  },
  {
    step: 6,
    title: 'First Invocation: counter() -> Returns 1',
    codeHighlightLine: 15,
    action: 'counter() is invoked. New context for increment() pushes to stack. It looks up "count" via [[Environment]], updates 0 -> 1, and returns 1.',
    callStack: [
      { name: 'Global Execution Context', type: 'global', status: 'suspended' },
      { name: 'counter() [increment]', type: 'function', status: 'running' }
    ],
    heap: {
      global: {
        record: {
          'createCounter': 'ƒ createCounter()',
          'counter': 'ƒ increment() [ref]'
        }
      },
      closureEnv: {
        name: 'createCounter Lexical Environment',
        outer: 'Global Environment',
        record: {
          'count': 1
        },
        retained: true,
        highlightKey: 'count',
        isOrphanFromStack: true
      },
      innerFn: {
        name: 'increment() Function Object',
        envSlot: 'createCounter Lexical Environment',
        code: 'count++; return count;'
      }
    },
    insight: 'When increment executes, its local environment record is empty. Identifier resolution follows [[OuterEnv]] to the retained createCounter environment where "count" is found and mutated directly in-place from 0 to 1.',
    activePhase: 'LEXICAL LOOKUP & MUTATION'
  },
  {
    step: 7,
    title: 'Second Invocation: counter() -> Returns 2',
    codeHighlightLine: 16,
    action: 'counter() is called again. It reads the updated binding count (1) and increments it to 2. State persists across calls!',
    callStack: [
      { name: 'Global Execution Context', type: 'global', status: 'suspended' },
      { name: 'counter() [increment]', type: 'function', status: 'running' }
    ],
    heap: {
      global: {
        record: {
          'createCounter': 'ƒ createCounter()',
          'counter': 'ƒ increment() [ref]'
        }
      },
      closureEnv: {
        name: 'createCounter Lexical Environment',
        outer: 'Global Environment',
        record: {
          'count': 2
        },
        retained: true,
        highlightKey: 'count',
        isOrphanFromStack: true
      },
      innerFn: {
        name: 'increment() Function Object',
        envSlot: 'createCounter Lexical Environment',
        code: 'count++; return count;'
      }
    },
    insight: 'This confirms closures do NOT copy values by snapshot! They maintain a living reference to the exact same Environment Record. The state is remembered across disconnected calls.',
    activePhase: 'STATE PERSISTENCE'
  }
];

const CODE_LINES = [
  'function createCounter() {',
  '  let count = 0;',
  '',
  '  function increment() {',
  '    count++;',
  '    return count;',
  '  }',
  '',
  '  return increment;',
  '}',
  '',
  '// Main script:',
  'const counter = createCounter();',
  '',
  'console.log(counter()); // 1',
  'console.log(counter()); // 2'
];

export default function ClosureVisualizer() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x
  const timerRef = useRef(null);

  const step = EXECUTION_STEPS[currentStepIndex];

  // Auto-player interval handler
  useEffect(() => {
    if (isPlaying) {
      const delay = 2600 / playbackSpeed;
      timerRef.current = setTimeout(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= EXECUTION_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, playbackSpeed]);

  const handleNext = () => {
    if (currentStepIndex < EXECUTION_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const togglePlay = () => {
    if (currentStepIndex >= EXECUTION_STEPS.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] overflow-hidden shadow-lg">
      
      {/* Top Controller Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Indicator & Progress */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20">
            <Activity size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
                Interactive Simulator
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Step {currentStepIndex + 1} of {EXECUTION_STEPS.length}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
              {step.title}
            </h3>
          </div>
        </div>

        {/* Center / Right: Interactive Step Controls */}
        <div className="flex items-center gap-2">
          
          {/* Speed selector */}
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-0.5 text-[11px] font-mono">
            {[0.5, 1, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-brand-lime font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Stepper buttons */}
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={togglePlay}
            className="px-3.5 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-brand-lime font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause size={14} /> <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play size={14} /> <span>{currentStepIndex >= EXECUTION_STEPS.length - 1 ? 'REPLAY' : 'RUN'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === EXECUTION_STEPS.length - 1}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Step"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            title="Reset to Beginning"
          >
            <RotateCcw size={16} />
          </button>

        </div>
      </div>

      {/* Progress Dots Bar */}
      <div className="px-5 py-2.5 bg-zinc-100/70 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {EXECUTION_STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-7 sm:w-9 bg-emerald-500 dark:bg-brand-lime'
                  : idx < currentStepIndex
                  ? 'w-2 sm:w-2.5 bg-emerald-500/40 dark:bg-brand-lime/40'
                  : 'w-2 sm:w-2.5 bg-zinc-300 dark:bg-zinc-700'
              }`}
              title={`Jump to Step ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>
        <div className="text-[11px] font-mono text-emerald-700 dark:text-brand-lime font-bold">
          {step.activePhase}
        </div>
      </div>

      {/* 3-Panel Main Visualization Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* PANEL A: Source Code & Execution Timeline (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-emerald-500" />
              PANEL A: EXECUTION TIMELINE
            </span>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
              ECMAScript V8
            </span>
          </div>

          {/* Code Viewer with active line highlight */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#090d16] p-3 font-mono text-xs shadow-xs overflow-hidden flex flex-col">
            <div className="text-[10px] text-zinc-500 pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">closure_engine.js</span>
              <span className="text-emerald-700 dark:text-brand-lime font-bold">Live Active Frame</span>
            </div>
            <div className="space-y-0.5 overflow-x-auto text-[11.5px] leading-5">
              {CODE_LINES.map((line, idx) => {
                const lineNum = idx + 1;
                const isCurrent = lineNum === step.codeHighlightLine;
                return (
                  <div
                    key={idx}
                    className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                      isCurrent
                        ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 font-bold border-l-2 border-emerald-500 dark:border-emerald-400'
                        : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span className="w-6 shrink-0 text-right pr-2 text-zinc-400 dark:text-zinc-600 select-none text-[10px]">
                      {lineNum}
                    </span>
                    <span className="whitespace-pre">
                      {line}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Narration of current step */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 p-3.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400 font-mono mb-1 text-[11px] uppercase">
              <Info size={13} />
              Current Execution Action
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans text-xs">
              {step.action}
            </p>
          </div>
        </div>

        {/* PANEL B: Call Stack (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Layers size={14} className="text-blue-500" />
              PANEL B: CALL STACK
            </span>
            <span className="text-[10px] text-zinc-400">LIFO Order</span>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-3 min-h-[300px] flex flex-col justify-end gap-2 relative">
            
            {/* Top stack limit indicator */}
            <div className="absolute top-3 left-3 right-3 border-b border-dashed border-zinc-300 dark:border-zinc-700 pb-1 flex justify-between text-[10px] font-mono text-zinc-400">
              <span>Stack Top (Current Execution)</span>
              <span>Pops on return</span>
            </div>

            {/* Displaying Call Stack Frames (reversed so top of stack is visually at top) */}
            <div className="pt-8 flex flex-col-reverse gap-2">
              {step.callStack.map((frame, index) => {
                const isTop = index === step.callStack.length - 1;
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      isTop
                        ? 'border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 shadow-md transform scale-[1.02]'
                        : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                        Frame {index}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                          frame.status === 'running'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-brand-lime'
                            : frame.status === 'completing'
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                        }`}
                      >
                        {frame.status}
                      </span>
                    </div>
                    <div className="font-mono text-xs font-bold truncate">
                      {frame.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Popped Frame Notification Callout (at Step 5) */}
            {step.step === 5 && (
              <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 text-[11px] font-mono animate-pulse">
                <div className="flex items-center gap-1 font-bold">
                  <Trash2 size={12} />
                  createCounter() POPPED!
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Stack frame destroyed, but heap memory remains reachable.
                </div>
              </div>
            )}

            {/* Stack Base */}
            <div className="border-t-2 border-zinc-400 dark:border-zinc-600 pt-1 text-center text-[10px] font-mono text-zinc-400">
              Call Stack Base
            </div>
          </div>
        </div>

        {/* PANEL C: Heap & Lexical Environments (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Database size={14} className="text-purple-500" />
              PANEL C: LEXICAL ENVIRONMENT & HEAP
            </span>
            <span className="text-[10px] text-zinc-400">Garbage Collector Root</span>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-3 min-h-[300px] flex flex-col gap-3">
            
            {/* 1. Global Lexical Environment */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/90 p-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1.5 pb-1 border-b border-zinc-100 dark:border-zinc-700">
                <span className="font-bold text-zinc-700 dark:text-zinc-200">Global Environment Record</span>
                <span className="text-zinc-400">[[OuterEnv]]: null</span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                {Object.entries(step.heap.global.record).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[11px] bg-zinc-50 dark:bg-zinc-900/50 px-2 py-1 rounded">
                    <span className="text-blue-600 dark:text-blue-400">{k}:</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. createCounter Lexical Environment (Retained on Heap) */}
            {step.heap.closureEnv ? (
              <div className={`rounded-lg border transition-all duration-300 p-2.5 relative ${
                step.heap.closureEnv.isOrphanFromStack
                  ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/20'
                  : 'border-blue-500/30 bg-blue-500/5 dark:bg-zinc-800/60'
              }`}>
                {/* Pointer Arrow Visual Indicator */}
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 pb-1 border-b border-emerald-500/20">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-800 dark:text-brand-lime">
                      {step.heap.closureEnv.name}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-brand-lime font-bold border border-emerald-500/20">
                    Heap Retained
                  </span>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between text-[10.5px] text-zinc-500 dark:text-zinc-400 pb-0.5">
                    <span>[[OuterEnv]]:</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{step.heap.closureEnv.outer}</span>
                  </div>
                  {Object.entries(step.heap.closureEnv.record).map(([k, v]) => (
                    <div
                      key={k}
                      className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded transition-all duration-300 ${
                        step.heap.closureEnv.highlightKey === k
                          ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-100 font-bold border border-emerald-500/40'
                          : 'bg-zinc-100 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">{k}:</span>
                      <span className="font-bold text-emerald-700 dark:text-brand-lime text-sm">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>

                {step.heap.closureEnv.isOrphanFromStack && (
                  <div className="mt-2 pt-1 border-t border-emerald-500/20 text-[9.5px] font-mono text-emerald-700 dark:text-brand-lime flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Alive on Heap via counter.[[Environment]] reference!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800 p-4 text-center text-xs font-mono text-zinc-400">
                Closure Lexical Environment not yet allocated.
              </div>
            )}

            {/* 3. increment Function Object with [[Environment]] Slot */}
            {step.heap.innerFn && (
              <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20 p-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-purple-700 dark:text-purple-300 mb-1 pb-1 border-b border-purple-500/20">
                  <span className="font-bold">{step.heap.innerFn.name}</span>
                  <span className="text-[9px] bg-purple-500/10 px-1 py-0.5 rounded">Function Object</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                    <span>[[Environment]]:</span>
                    <span className="text-emerald-600 dark:text-brand-lime font-bold">
                      ↳ {step.heap.innerFn.envSlot}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 pt-1 font-mono truncate">
                    Code: {step.heap.innerFn.code}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Bottom Technical Insight Narration Bar */}
      <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 shrink-0">
            <Cpu size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              V8 Engine Runtime Insight
            </span>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-0.5 leading-relaxed font-sans">
              {step.insight}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
