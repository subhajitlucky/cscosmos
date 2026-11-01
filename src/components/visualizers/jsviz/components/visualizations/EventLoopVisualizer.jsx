'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    Play, Pause, SkipForward, SkipBack, RotateCcw, RefreshCw, 
    Zap, Clock, Layers, Sparkles, Terminal, CheckCircle2, ArrowRight,
    ArrowDown, ArrowUp, Cpu, Activity
} from 'lucide-react';

const PRESETS = [
    {
        id: 'promise-timeout',
        title: '1. Promise vs setTimeout (Classic)',
        badge: 'Fundamental',
        codeSnippet: `console.log("1: Sync Start");

setTimeout(() => {
  console.log("4: setTimeout (macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Promise (microtask)");
});

console.log("2: Sync End");`,
        steps: [
            {
                phase: 'STACK_EXEC',
                phaseLabel: '1. Synchronous Execution',
                activePillar: 'stack',
                stack: ['console.log("1: Sync Start")', 'globalContext()'],
                webApi: [],
                microtasks: [],
                macrotasks: [],
                logs: ['1: Sync Start'],
                explanation: 'Call Stack runs synchronous code first. console.log("1: Sync Start") executes immediately on the main thread.',
            },
            {
                phase: 'WEBAPI_OFFLOAD',
                phaseLabel: '2. Web API Timer Offload',
                activePillar: 'webapi',
                stack: ['setTimeout(cb, 0)', 'globalContext()'],
                webApi: ['Timer (0ms) -> cb'],
                microtasks: [],
                macrotasks: [],
                logs: ['1: Sync Start'],
                explanation: 'setTimeout() is a browser Web API. JavaScript offloads timer tracking to browser host threads; main thread is not blocked.',
            },
            {
                phase: 'MICRO_VIP',
                phaseLabel: '3. Microtask VIP Scheduling',
                activePillar: 'micro',
                stack: ['Promise.resolve().then(...)', 'globalContext()'],
                webApi: ['Timer (0ms)'],
                microtasks: ['Promise.then() callback'],
                macrotasks: [],
                logs: ['1: Sync Start'],
                explanation: 'Promise fulfills immediately. Its .then() callback is enqueued into the high-priority VIP Microtask Queue.',
            },
            {
                phase: 'STACK_EXEC',
                phaseLabel: '4. Stack Finishes Sync Code',
                activePillar: 'stack',
                stack: ['console.log("2: Sync End")', 'globalContext()'],
                webApi: [],
                microtasks: ['Promise.then() callback'],
                macrotasks: ['setTimeout callback'],
                logs: ['1: Sync Start', '2: Sync End'],
                explanation: 'Web API 0ms timer fires and pushes callback to Macrotask Queue. Stack finishes final synchronous log "2: Sync End".',
            },
            {
                phase: 'LOOP_CHECK',
                phaseLabel: '5. Event Loop Check (Stack Clear)',
                activePillar: 'loop',
                stack: [],
                webApi: [],
                microtasks: ['Promise.then() callback'],
                macrotasks: ['setTimeout callback'],
                logs: ['1: Sync Start', '2: Sync End'],
                explanation: 'Call Stack is completely empty! Event Loop activates. Rule #1: Always drain ALL Microtasks before executing any Macrotask!',
            },
            {
                phase: 'MICRO_VIP',
                phaseLabel: '6. Microtask Flush (Priority)',
                activePillar: 'stack',
                stack: ['Promise callback: log("3: Promise")'],
                webApi: [],
                microtasks: [],
                macrotasks: ['setTimeout callback'],
                logs: ['1: Sync Start', '2: Sync End', '3: Promise (microtask)'],
                explanation: 'Event Loop dequeues the Microtask into the Call Stack. It prints "3: Promise (microtask)".',
            },
            {
                phase: 'MACRO_TICK',
                phaseLabel: '7. Macrotask Dequeue',
                activePillar: 'stack',
                stack: ['setTimeout callback: log("4: setTimeout")'],
                webApi: [],
                microtasks: [],
                macrotasks: [],
                logs: ['1: Sync Start', '2: Sync End', '3: Promise (microtask)', '4: setTimeout (macrotask)'],
                explanation: 'Microtasks are fully drained! Event Loop now picks 1 task from Macrotask Queue and pushes it onto the Call Stack.',
            },
            {
                phase: 'IDLE',
                phaseLabel: '8. Event Loop Idle',
                activePillar: 'idle',
                stack: [],
                webApi: [],
                microtasks: [],
                macrotasks: [],
                logs: ['1: Sync Start', '2: Sync End', '3: Promise (microtask)', '4: setTimeout (macrotask)'],
                explanation: 'All queues drained. The Event Loop pauses in its tick loop, ready to dispatch new asynchronous user events or timers.',
            }
        ]
    },
    {
        id: 'async-await',
        title: '2. Async / Await Execution Flow',
        badge: 'Coroutines',
        codeSnippet: `async function async1() {
  console.log("2: async1 start");
  await async2();
  console.log("4: async1 end");
}
async function async2() {
  console.log("3: async2 body");
}
console.log("1: script start");
async1();
console.log("5: script end");`,
        steps: [
            {
                phase: 'STACK_EXEC',
                phaseLabel: '1. Script Start',
                activePillar: 'stack',
                stack: ['console.log("1: script start")', 'globalContext()'],
                webApi: [],
                microtasks: [],
                macrotasks: [],
                logs: ['1: script start'],
                explanation: 'Global script begins executing synchronously on Call Stack.',
            },
            {
                phase: 'STACK_EXEC',
                phaseLabel: '2. Enter async1() Synchronously',
                activePillar: 'stack',
                stack: ['console.log("2: async1 start")', 'async1()', 'globalContext()'],
                webApi: [],
                microtasks: [],
                macrotasks: [],
                logs: ['1: script start', '2: async1 start'],
                explanation: 'async functions run synchronously until they encounter the first await keyword.',
            },
            {
                phase: 'MICRO_VIP',
                phaseLabel: '3. Await Evaluates & Packages Microtask',
                activePillar: 'micro',
                stack: ['async2()', 'async1()', 'globalContext()'],
                webApi: [],
                microtasks: ['async1 resumption (continuation microtask)'],
                macrotasks: [],
                logs: ['1: script start', '2: async1 start', '3: async2 body'],
                explanation: 'await async2() executes async2 body, then suspends async1 execution context and enqueues its remainder as a Microtask.',
            },
            {
                phase: 'STACK_EXEC',
                phaseLabel: '4. Main Script Resumes & Clears',
                activePillar: 'stack',
                stack: ['console.log("5: script end")', 'globalContext()'],
                webApi: [],
                microtasks: ['async1 resumption (continuation microtask)'],
                macrotasks: [],
                logs: ['1: script start', '2: async1 start', '3: async2 body', '5: script end'],
                explanation: 'With async1 suspended, control returns to the synchronous script: "5: script end" executes.',
            },
            {
                phase: 'MICRO_VIP',
                phaseLabel: '5. Event Loop Drains Await Continuation',
                activePillar: 'stack',
                stack: ['async1 (resumed): log("4: async1 end")'],
                webApi: [],
                microtasks: [],
                macrotasks: [],
                logs: ['1: script start', '2: async1 start', '3: async2 body', '5: script end', '4: async1 end'],
                explanation: 'Call Stack cleared! Event Loop picks async1 continuation microtask, restoring its execution context to print "4: async1 end".',
            }
        ]
    },
    {
        id: 'microtask-starvation',
        title: '3. Microtask Queue Starvation',
        badge: 'Priority Proof',
        codeSnippet: `setTimeout(() => console.log("Macrotask"), 0);

function recursiveMicro(count) {
  if (count > 2) return;
  Promise.resolve().then(() => {
    console.log("Microtask #" + count);
    recursiveMicro(count + 1);
  });
}
recursiveMicro(1);`,
        steps: [
            {
                phase: 'WEBAPI_OFFLOAD',
                phaseLabel: '1. Macrotask Registered in Web API',
                activePillar: 'webapi',
                stack: ['setTimeout(cb, 0)', 'globalContext()'],
                webApi: ['Timer (0ms) -> Macrotask'],
                microtasks: [],
                macrotasks: [],
                logs: [],
                explanation: 'setTimeout is scheduled. The Macrotask is ready and enqueued to the Macrotask Queue.',
            },
            {
                phase: 'MICRO_VIP',
                phaseLabel: '2. Microtask #1 Queued',
                activePillar: 'micro',
                stack: ['recursiveMicro(1)', 'globalContext()'],
                webApi: [],
                microtasks: ['Microtask #1'],
                macrotasks: ['Macrotask (setTimeout)'],
                logs: [],
                explanation: 'Promise resolves and places Microtask #1 into the Microtask Queue. Global script finishes.',
            },
            {
                phase: 'MICRO_VIP',
                phaseLabel: '3. Microtask #1 Spawns Microtask #2',
                activePillar: 'micro',
                stack: ['Microtask #1 -> log("Microtask #1")'],
                webApi: [],
                microtasks: ['Microtask #2'],
                macrotasks: ['Macrotask (setTimeout)'],
                logs: ['Microtask #1'],
                explanation: 'While draining Microtask #1, it schedules Microtask #2. The Event Loop refuses to run the Macrotask until Microtasks reach 0!',
            },
            {
                phase: 'MICRO_VIP',
                phaseLabel: '4. Microtask #2 Spawns Microtask #3',
                activePillar: 'micro',
                stack: ['Microtask #2 -> log("Microtask #2")'],
                webApi: [],
                microtasks: ['Microtask #3'],
                macrotasks: ['Macrotask (setTimeout)'],
                logs: ['Microtask #1', 'Microtask #2'],
                explanation: 'Microtask #2 runs and schedules Microtask #3. Macrotask remains blocked! This is how runaway microtasks starve the main thread.',
            },
            {
                phase: 'MACRO_TICK',
                phaseLabel: '5. Microtasks Finally Empty -> Macrotask Runs',
                activePillar: 'macro',
                stack: ['Macrotask -> log("Macrotask")'],
                webApi: [],
                microtasks: [],
                macrotasks: [],
                logs: ['Microtask #1', 'Microtask #2', 'Microtask #3', 'Macrotask'],
                explanation: 'All recursive microtasks are finally exhausted! Event Loop is at last allowed to dequeue the waiting Macrotask.',
            }
        ]
    },
    {
        id: 'webapi-dom',
        title: '4. Web APIs & DOM Click Events',
        badge: 'Browser Host',
        codeSnippet: `button.addEventListener('click', () => {
  console.log("Click callback handled!");
});

console.log("Listener registered.");
// User clicks button...`,
        steps: [
            {
                phase: 'STACK_EXEC',
                phaseLabel: '1. Register Listener via Web API',
                activePillar: 'webapi',
                stack: ['addEventListener("click", cb)', 'globalContext()'],
                webApi: ['DOM Event Listener: [click]'],
                microtasks: [],
                macrotasks: [],
                logs: ['Listener registered.'],
                explanation: 'addEventListener registers an event handler inside the browser host Web API environment.',
            },
            {
                phase: 'IDLE',
                phaseLabel: '2. Stack Empty, Browser Waits for User',
                activePillar: 'idle',
                stack: [],
                webApi: ['DOM Event Listener: [click]'],
                microtasks: [],
                macrotasks: [],
                logs: ['Listener registered.'],
                explanation: 'Call Stack is empty. JavaScript is idle while browser Web APIs listen on the OS UI thread for user input.',
            },
            {
                phase: 'WEBAPI_OFFLOAD',
                phaseLabel: '3. User Clicks -> Web API Enqueues Task',
                activePillar: 'macro',
                stack: [],
                webApi: ['DOM Event Listener: [click] (Active)'],
                microtasks: [],
                macrotasks: ['Button Click Callback (Macrotask)'],
                logs: ['Listener registered.'],
                explanation: 'User clicks the button! Web API captures the hardware interrupt and pushes the registered callback to the Macrotask Queue.',
            },
            {
                phase: 'MACRO_TICK',
                phaseLabel: '4. Event Loop Dispatches Callback to Stack',
                activePillar: 'stack',
                stack: ['clickCallback: log("Click callback handled!")'],
                webApi: ['DOM Event Listener: [click]'],
                microtasks: [],
                macrotasks: [],
                logs: ['Listener registered.', 'Click callback handled!'],
                explanation: 'Event Loop notices Call Stack is clear and Microtasks are clean. It pushes the click handler onto the Call Stack for execution.',
            }
        ]
    }
];

export default function EventLoopVisualizer({ hasMicro = false, hasMacro = false }) {
    const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1); // 1x, 1.5x, 2x
    const autoPlayTimerRef = useRef(null);

    const preset = PRESETS[selectedPresetIdx];
    const totalSteps = preset.steps.length;
    const currentStep = preset.steps[stepIndex] || preset.steps[0];

    // Auto-advance player
    useEffect(() => {
        if (isPlaying) {
            const delay = 2200 / speed;
            autoPlayTimerRef.current = setInterval(() => {
                setStepIndex((prev) => {
                    if (prev < totalSteps - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, delay);
        } else {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        }

        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        };
    }, [isPlaying, speed, totalSteps]);

    const handleSelectPreset = (idx) => {
        setIsPlaying(false);
        setSelectedPresetIdx(idx);
        setStepIndex(0);
    };

    const handleNext = () => {
        setIsPlaying(false);
        setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
    };

    const handlePrev = () => {
        setIsPlaying(false);
        setStepIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleReset = () => {
        setIsPlaying(false);
        setStepIndex(0);
    };

    const togglePlay = () => {
        if (stepIndex >= totalSteps - 1) {
            setStepIndex(0);
            setIsPlaying(true);
        } else {
            setIsPlaying((prev) => !prev);
        }
    };

    const cycleSpeed = () => {
        setSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
    };

    // Determine event loop status text
    const getLoopStatus = () => {
        if (currentStep.phase === 'STACK_EXEC') return { text: 'WAITING (Stack Busy)', color: 'text-blue-500', pulse: false };
        if (currentStep.phase === 'MICRO_VIP') return { text: 'VIP FLUSH (Draining Microtasks)', color: 'text-violet-500 dark:text-violet-400', pulse: true };
        if (currentStep.phase === 'MACRO_TICK') return { text: 'TICK (Dequeueing 1 Macrotask)', color: 'text-amber-500', pulse: true };
        if (currentStep.phase === 'WEBAPI_OFFLOAD') return { text: 'OBSERVING (Web API Active)', color: 'text-purple-500', pulse: false };
        if (currentStep.phase === 'LOOP_CHECK') return { text: 'EVALUATING QUEUE PRIORITY', color: 'text-brand-lime font-black', pulse: true };
        return { text: 'IDLE (Waiting for Events)', color: 'text-[var(--text-muted)]', pulse: false };
    };

    const loopStatus = getLoopStatus();

    return (
        <div className="h-full w-full flex flex-col p-3 sm:p-5 overflow-y-auto space-y-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
            {/* Top Toolbar: Presets & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-brand-border" style={{ backgroundColor: 'var(--bg-main)' }}>
                {/* Preset Selector */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mr-1 hidden sm:inline">
                        Curriculum:
                    </span>
                    {PRESETS.map((p, idx) => (
                        <button
                            key={p.id}
                            onClick={() => handleSelectPreset(idx)}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                                selectedPresetIdx === idx
                                    ? 'border-brand-lime bg-[rgba(var(--accent-main-rgb),0.15)] text-brand-lime shadow-sm'
                                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-brand-border'
                            }`}
                        >
                            <span>{p.title}</span>
                        </button>
                    ))}
                </div>

                {/* Step & Playback Controls */}
                <div className="flex items-center gap-1.5 ml-auto">
                    <button
                        onClick={handlePrev}
                        disabled={stepIndex === 0}
                        className="p-1.5 rounded border border-brand-border text-[var(--text-main)] hover:border-brand-lime disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Previous Step"
                    >
                        <SkipBack size={14} />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="px-3 py-1 rounded bg-[var(--accent-main)] text-[var(--text-inverse)] font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
                        title={isPlaying ? 'Pause' : 'Auto Play'}
                    >
                        {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                        <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={stepIndex >= totalSteps - 1}
                        className="p-1.5 rounded border border-brand-border text-[var(--text-main)] hover:border-brand-lime disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Next Step"
                    >
                        <SkipForward size={14} />
                    </button>

                    <button
                        onClick={handleReset}
                        className="p-1.5 rounded border border-brand-border text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-brand-border transition-colors"
                        title="Reset Stepper"
                    >
                        <RotateCcw size={14} />
                    </button>

                    <button
                        onClick={cycleSpeed}
                        className="px-2 py-1 rounded border border-brand-border text-[10px] font-mono font-bold text-[var(--text-muted)] hover:text-brand-lime hover:border-brand-lime transition-colors"
                        title="Toggle Speed"
                    >
                        {speed}x
                    </button>
                </div>
            </div>

            {/* Current Phase Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg border border-brand-border" style={{ backgroundColor: 'var(--bg-main)' }}>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-lime animate-ping" />
                    <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                        Step {stepIndex + 1} of {totalSteps}: <span className="text-brand-lime">{currentStep.phaseLabel}</span>
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <Activity size={13} className="text-brand-lime" />
                    <span>Loop State: <strong className={loopStatus.color}>{loopStatus.text}</strong></span>
                </div>
            </div>

            {/* Core 4-Quadrant Architecture with Center Engine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. Call Stack (LIFO) */}
                <div 
                    className={`p-3.5 rounded-xl border transition-all flex flex-col min-h-[170px] ${
                        currentStep.activePillar === 'stack'
                            ? 'border-blue-500 shadow-md ring-1 ring-blue-500/30'
                            : 'border-brand-border'
                    }`}
                    style={{ backgroundColor: 'var(--bg-main)' }}
                >
                    <div className="flex items-center justify-between pb-2 border-b border-brand-border mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-500">
                            <Layers size={14} />
                            <span>1. CALL STACK (LIFO)</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                            {currentStep.stack.length} frame{currentStep.stack.length === 1 ? '' : 's'}
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col-reverse justify-start gap-1.5">
                        {currentStep.stack.length > 0 ? (
                            currentStep.stack.map((frame, i) => (
                                <div 
                                    key={i} 
                                    className="px-2.5 py-1.5 rounded border font-mono text-xs font-bold transition-all bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300 flex items-center justify-between animate-in fade-in slide-in-from-top-1"
                                >
                                    <span className="truncate">{frame}</span>
                                    {i === currentStep.stack.length - 1 && (
                                        <span className="text-[9px] uppercase tracking-wider text-blue-500 font-extrabold ml-1.5 flex-shrink-0">
                                            [TOP]
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs font-mono italic text-[var(--text-muted)] opacity-60">
                                [Stack is Empty — Loop Permitted to Tick]
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Web APIs (Host Threads) */}
                <div 
                    className={`p-3.5 rounded-xl border transition-all flex flex-col min-h-[170px] ${
                        currentStep.activePillar === 'webapi'
                            ? 'border-purple-500 shadow-md ring-1 ring-purple-500/30'
                            : 'border-brand-border'
                    }`}
                    style={{ backgroundColor: 'var(--bg-main)' }}
                >
                    <div className="flex items-center justify-between pb-2 border-b border-brand-border mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-purple-500">
                            <Clock size={14} />
                            <span>2. WEB APIs (HOST THREADS)</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                            {currentStep.webApi.length} active
                        </span>
                    </div>

                    <div className="flex-1 space-y-1.5">
                        {currentStep.webApi.length > 0 ? (
                            currentStep.webApi.map((task, i) => (
                                <div 
                                    key={i} 
                                    className="px-2.5 py-1.5 rounded border font-mono text-xs font-bold transition-all bg-purple-500/15 border-purple-500/40 text-purple-700 dark:text-purple-300 flex items-center gap-1.5 animate-in fade-in"
                                >
                                    <span className="animate-spin text-purple-500">⏳</span>
                                    <span className="truncate">{task}</span>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs font-mono italic text-[var(--text-muted)] opacity-60">
                                [No Active Web API Timers / Observers]
                            </div>
                        )}
                    </div>
                </div>

                {/* Central Orchestrator Banner: The Event Loop Decision Engine */}
                <div className="md:col-span-2 p-3 rounded-xl border border-brand-lime/40 bg-[rgba(var(--accent-main-rgb),0.06)] flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-lime text-black flex items-center justify-center font-bold shadow">
                            <RefreshCw className={`w-4 h-4 ${loopStatus.pulse ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                        </div>
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-brand-lime font-bold">
                                Orchestrator Heartbeat
                            </div>
                            <div className="text-xs sm:text-sm font-mono font-extrabold text-[var(--text-main)]">
                                {currentStep.phase === 'STACK_EXEC' && 'Call Stack is executing. Event Loop pauses queue dispatch.'}
                                {currentStep.phase === 'WEBAPI_OFFLOAD' && 'Async call offloaded to Web APIs. Main thread stays unblocked.'}
                                {currentStep.phase === 'MICRO_VIP' && 'Event Loop flushes VIP Microtasks before touching any Macrotask.'}
                                {currentStep.phase === 'MACRO_TICK' && 'Microtask queue empty. Event Loop dequeues 1 Macrotask into Stack.'}
                                {currentStep.phase === 'LOOP_CHECK' && 'Stack cleared! Event Loop inspects queues in strict priority order.'}
                                {currentStep.phase === 'IDLE' && 'All queues clear. Event Loop sleeps until next event arrives.'}
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                        <span className="px-2 py-1 rounded bg-[var(--bg-main)] border border-brand-border">Priority: Microtask &gt; Macrotask</span>
                    </div>
                </div>

                {/* 3. Microtask Queue (VIP) */}
                <div 
                    className={`p-3.5 rounded-xl border transition-all flex flex-col min-h-[170px] ${
                        currentStep.activePillar === 'micro'
                            ? 'border-violet-500 shadow-md ring-1 ring-violet-500/30'
                            : 'border-brand-border'
                    }`}
                    style={{ backgroundColor: 'var(--bg-main)' }}
                >
                    <div className="flex items-center justify-between pb-2 border-b border-brand-border mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-violet-500">
                            <Zap size={14} />
                            <span>3. MICROTASKS (VIP QUEUE)</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold">
                            {currentStep.microtasks.length} queued (DRAIN ALL)
                        </span>
                    </div>

                    <div className="flex-1 space-y-1.5">
                        {currentStep.microtasks.length > 0 ? (
                            currentStep.microtasks.map((task, i) => (
                                <div 
                                    key={i} 
                                    className="px-2.5 py-1.5 rounded border font-mono text-xs font-bold transition-all bg-violet-500/15 border-violet-500/40 text-violet-700 dark:text-violet-300 flex items-center justify-between animate-in fade-in"
                                >
                                    <span className="truncate">⚡ {task}</span>
                                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-violet-600 dark:text-violet-400 ml-1">
                                        #VIP {i + 1}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs font-mono italic text-[var(--text-muted)] opacity-60">
                                [Microtask Queue Empty]
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Macrotask (Callback) Queue */}
                <div 
                    className={`p-3.5 rounded-xl border transition-all flex flex-col min-h-[170px] ${
                        currentStep.activePillar === 'macro'
                            ? 'border-amber-500 shadow-md ring-1 ring-amber-500/30'
                            : 'border-brand-border'
                    }`}
                    style={{ backgroundColor: 'var(--bg-main)' }}
                >
                    <div className="flex items-center justify-between pb-2 border-b border-brand-border mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500">
                            <Clock size={14} />
                            <span>4. MACROTASK / CALLBACK QUEUE</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                            {currentStep.macrotasks.length} queued (1 PER TICK)
                        </span>
                    </div>

                    <div className="flex-1 space-y-1.5">
                        {currentStep.macrotasks.length > 0 ? (
                            currentStep.macrotasks.map((task, i) => (
                                <div 
                                    key={i} 
                                    className="px-2.5 py-1.5 rounded border font-mono text-xs font-bold transition-all bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 flex items-center justify-between animate-in fade-in"
                                >
                                    <span className="truncate">📦 {task}</span>
                                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 ml-1">
                                        Task {i + 1}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs font-mono italic text-[var(--text-muted)] opacity-60">
                                [Callback Queue Empty]
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Panel: Step Explanation & Live Stdout Trace */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {/* Step Breakdown Explanation (2 Cols) */}
                <div className="md:col-span-2 p-3.5 rounded-xl border border-brand-border flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-main)' }}>
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-lime uppercase tracking-wider mb-1.5">
                            <Sparkles size={13} />
                            <span>Runtime Engine Step Analysis</span>
                        </div>
                        <p className="font-mono text-xs sm:text-sm leading-relaxed text-[var(--text-main)]">
                            {currentStep.explanation}
                        </p>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-1.5 pt-3 mt-2 border-t border-brand-border">
                        {preset.steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setIsPlaying(false);
                                    setStepIndex(i);
                                }}
                                className={`h-1.5 rounded-full transition-all ${
                                    i === stepIndex 
                                        ? 'w-6 bg-brand-lime' 
                                        : i < stepIndex 
                                            ? 'w-2 bg-[var(--text-muted)] opacity-60' 
                                            : 'w-2 bg-[var(--border-main)]'
                                }`}
                                title={`Jump to step ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Console Output (stdout) Trace (1 Col) */}
                <div className="p-3.5 rounded-xl border border-brand-border flex flex-col min-h-[110px]" style={{ backgroundColor: 'var(--bg-main)' }}>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--text-muted)] pb-1.5 border-b border-brand-border mb-2">
                        <Terminal size={13} className="text-brand-lime" />
                        <span>Stdout Stream</span>
                    </div>

                    <div className="flex-1 font-mono text-xs space-y-1">
                        {currentStep.logs.length > 0 ? (
                            currentStep.logs.map((log, i) => (
                                <div key={i} className="text-emerald-500 dark:text-emerald-400 flex items-start gap-1.5 animate-in fade-in">
                                    <span className="text-[var(--text-muted)] select-none">➜</span>
                                    <span className="font-bold">{log}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-[11px] font-mono italic text-[var(--text-muted)] opacity-60">
                                (No output printed yet)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
