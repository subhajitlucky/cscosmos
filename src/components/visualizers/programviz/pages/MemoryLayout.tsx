'use client';

import React, { useState, useEffect } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layers, Play, Pause, RotateCcw, Lightbulb, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MEMORY_SEGMENTS = [
  {
    name: 'Stack Segment',
    color: 'bg-red-500',
    borderColor: 'border-red-500/40',
    textColor: 'text-red-500',
    desc: 'Stores local variables and active function call frames. Grows downward automatically as functions are called and shrinks as they return.',
    details: 'LIFO (Last-In, First-Out) / Ultra-Fast',
  },
  {
    name: 'Heap Segment',
    color: 'bg-amber-500',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-500',
    desc: 'Stores dynamic memory allocated at runtime (e.g. malloc in C, new in Java/JS). Grows upward toward the stack.',
    details: 'Dynamic Size / Manual or GC Managed',
  },
  {
    name: 'Data Segment (Globals)',
    color: 'bg-blue-500',
    borderColor: 'border-blue-500/40',
    textColor: 'text-blue-500',
    desc: 'Stores global and static variables declared outside functions. Allocated once when the program launches and exists until termination.',
    details: 'Fixed Size / Read & Write',
  },
  {
    name: 'Code (Text) Segment',
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-500',
    desc: 'Contains the raw binary machine code instructions executed by the CPU. Marked read-only by the OS to prevent self-modifying code crashes.',
    details: 'Read-Only / Fixed Size',
  },
];

const CALL_TIMELINE: { stack: string[]; heap: string[]; caption: string; highlight: string }[] = [
  {
    stack: [],
    heap: [],
    caption: 'Before execution: No function is running yet. The Stack and Heap are empty.',
    highlight: 'Code and Data segments are loaded into RAM.',
  },
  {
    stack: ['main() [a=15, b=27]'],
    heap: [],
    caption: '1. main() starts executing -> A stack frame is PUSHED for main holding local variables a and b.',
    highlight: 'Stack grew downward with main() frame.',
  },
  {
    stack: ['main() [a=15, b=27]', 'compute(x=15)'],
    heap: [],
    caption: '2. main() calls compute(15) -> A new stack frame is PUSHED on top of main’s frame.',
    highlight: 'compute() frame holds parameter x=15 and return address back to main.',
  },
  {
    stack: ['main() [a=15, b=27]', 'compute(x=15)', 'square(n=15)'],
    heap: ['heap_buffer [size 64B]'],
    caption: '3. compute() calls square(15) and allocates a dynamic buffer on the Heap.',
    highlight: 'Stack is at maximum depth (3 frames). Heap has 1 allocation.',
  },
  {
    stack: ['main() [a=15, b=27]', 'compute(x=15)'],
    heap: ['heap_buffer [size 64B]'],
    caption: '4. square() finishes and returns 225 -> Its stack frame is automatically POPPED (destroyed)!',
    highlight: 'Control returns to compute(). square’s local variables are gone.',
  },
  {
    stack: ['main() [a=15, b=27]'],
    heap: [],
    caption: '5. compute() frees its heap memory and returns -> Its frame is POPPED too.',
    highlight: 'Heap buffer freed; stack frame popped.',
  },
  {
    stack: [],
    heap: [],
    caption: '6. main() finishes and returns 0 -> Stack is completely clear. OS reclaims process memory.',
    highlight: 'Process execution complete.',
  },
];

export const MemoryLayout: React.FC = () => {
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) setPlaying(false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!playing || prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setFrameIndex((f) => {
        if (f >= CALL_TIMELINE.length - 1) {
          setPlaying(false);
          return f;
        }
        return f + 1;
      });
    }, 2200);
    return () => window.clearInterval(id);
  }, [playing, prefersReducedMotion]);

  const current = CALL_TIMELINE[frameIndex];

  return (
    <TopicLayout stepNumber={6} title="How Does a Program Live in Memory?">
      <div className="space-y-12">
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            When the operating system runs a program, it does not throw variables and code into memory randomly. 
            Instead, it assigns the program an isolated memory block called an <strong>address space</strong>, neatly partitioned into four standard segments: 
            <strong> Code, Data, Heap, and Stack</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Understanding this layout explains why functions have local variables, how dynamic memory works, and what causes crashes like "Stack Overflow" or "Memory Leaks".
          </p>
        </section>

        {/* Section B & C: Why Segments & The Cafeteria Tray Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              Stack vs Heap: What Is the Difference?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>The Stack</strong> is managed automatically by the CPU hardware for function calls. It is lightning-fast but fixed in size. 
              <strong>The Heap</strong> is for large, flexible data whose size is only known while running (like loading a 10MB JPEG image). It requires allocation and cleanup.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              The Cafeteria Tray Analogy (LIFO)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think of the <strong>Stack</strong> like a spring-loaded stack of cafeteria trays: 
              When a function is called, a new tray is <strong>pushed</strong> on top. The CPU only ever works on the top tray. 
              When the function finishes, that tray is <strong>popped</strong> off, instantly revealing the previous function underneath.
            </p>
          </div>
        </div>

        {/* C Program Reference & Architectural Insights */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-slate-950 text-slate-100 p-5 font-mono text-xs space-y-2">
            <span className="text-blue-400 font-bold block">
              // C Program demonstrating the 4 Memory Segments:
            </span>
            <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`int global_count = 10;           // -> DATA SEGMENT (Global variable, fixed size)

void square(int n) {
    int sq = n * n;              // -> STACK SEGMENT (Local variable inside square's frame)
}

int main() {
    int a = 15;                  // -> STACK SEGMENT (Local variable inside main's frame)
    char *buffer = malloc(64);   // -> 'buffer' pointer is on STACK; 64 bytes are on HEAP!
    square(a);
    free(buffer);                // -> HEAP SEGMENT  (Freed manually to prevent memory leak)
    return 0;                    // -> CODE SEGMENT  (Executable instructions in text segment)
}`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                Why Do Stack and Heap Grow Toward Each Other?
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                A running program cannot predict whether it will need deep function recursion (more stack) or large data downloads (more heap). By putting the Stack at high memory growing down and the Heap at low memory growing up, both can share the large unallocated middle pool flexibly without wasting fixed partitions!
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-blue-500" />
                The Pointer Duality: Stack Variable vs Heap Block
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Notice <code className="font-mono">char *buffer = malloc(64);</code>. 
                The variable <code className="font-mono">buffer</code> itself is an 8-byte address stored on the <strong>Stack</strong>. 
                The 64 bytes of memory it points to reside in the <strong>Heap</strong>. Freeing the buffer cleans up the heap space.
              </p>
            </div>
          </div>
        </div>

        {/* Section D: Interactive Memory Map & Stack Frame Stepper */}
        <div className={cn(
          "rounded-2xl p-6 sm:p-8 border shadow-xl transition-colors space-y-6",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-border/80">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-500 font-bold">
                Live Memory Animator
              </span>
              <h3 className="text-xl font-bold text-foreground">
                Process Address Space &amp; Call Stack
              </h3>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {playing ? 'Pause' : 'Auto-Step'}
              </button>

              <button
                type="button"
                onClick={() => setFrameIndex((f) => Math.max(0, f - 1))}
                disabled={frameIndex === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-border bg-card text-foreground disabled:opacity-40"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setFrameIndex((f) => Math.min(CALL_TIMELINE.length - 1, f + 1))}
                disabled={frameIndex === CALL_TIMELINE.length - 1}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40"
              >
                Next Step
              </button>

              <button
                type="button"
                onClick={() => { setPlaying(false); setFrameIndex(0); }}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* The Vertical Memory Diagram */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                <span>High Address (0x7FFF FFFF)</span>
                <span>Stack grows ↓</span>
              </div>

              {/* Stack Box */}
              <div className="p-3 rounded-lg border-2 border-red-500/40 bg-red-500/10 min-h-[90px] space-y-1">
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase block">
                  Stack Segment (Calls &amp; Locals)
                </span>
                <AnimatePresence>
                  {current.stack.length === 0 ? (
                    <span className="text-[11px] text-muted-foreground italic block">Empty</span>
                  ) : (
                    current.stack.map((frame, i) => (
                      <motion.div
                        key={frame}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="px-2.5 py-1 rounded bg-red-500/20 text-red-700 dark:text-red-300 text-xs font-mono font-bold border border-red-500/30"
                      >
                        Frame #{i + 1}: {frame}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Free Space in between */}
              <div className="py-2 text-center text-[10px] font-mono text-muted-foreground border-y border-dashed border-border">
                ↕ Free Memory Pool ↕
              </div>

              {/* Heap Box */}
              <div className="p-3 rounded-lg border-2 border-amber-500/40 bg-amber-500/10 min-h-[60px] space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase block">
                  Heap Segment (Dynamic malloc)
                </span>
                {current.heap.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic block">No active allocations</span>
                ) : (
                  current.heap.map((item) => (
                    <div key={item} className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                      {item}
                    </div>
                  ))
                )}
              </div>

              {/* Data Box */}
              <div className="p-3 rounded-lg border-2 border-blue-500/40 bg-blue-500/10 space-y-1">
                <span className="text-[10px] font-mono font-bold text-blue-500 uppercase block">
                  Data Segment: global_count = 10
                </span>
              </div>

              {/* Code Box */}
              <div className="p-3 rounded-lg border-2 border-emerald-500/40 bg-emerald-500/10 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase block">
                  Code Segment (Text): main, square (Read-Only)
                </span>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                <span>Low Address (0x0000 0000)</span>
                <span>Heap grows ↑</span>
              </div>
            </div>

            {/* Step Story Narrative */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-xl border-2 border-blue-500/20 bg-blue-500/5 space-y-2">
                <span className="text-xs font-mono font-bold text-blue-500 uppercase block">
                  Execution State (Step {frameIndex + 1} of {CALL_TIMELINE.length}):
                </span>
                <p className="text-base font-bold text-foreground">
                  {current.caption}
                </p>
                <p className="text-xs text-muted-foreground">
                  {current.highlight}
                </p>
              </div>

              {/* Explanation of the 4 Segments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MEMORY_SEGMENTS.map((seg) => (
                  <div key={seg.name} className={cn("p-4 rounded-xl border bg-card space-y-1", seg.borderColor)}>
                    <div className="flex items-center justify-between">
                      <h4 className={cn("font-bold text-xs uppercase font-mono", seg.textColor)}>
                        {seg.name}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {seg.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section E: Memory Management Across Languages */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="font-bold text-foreground text-base">
            How Different Languages Handle Heap Memory
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Not all languages handle the Heap identically:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5">
              <h4 className="font-bold text-foreground">Manual Memory Management (C / C++ / Rust)</h4>
              <p className="text-muted-foreground leading-relaxed">
                The programmer explicitly requests heap memory with <code className="font-mono">malloc()</code> and must remember to release it with <code className="font-mono">free()</code>. If you forget to free memory, your program leaks RAM. Rust uses compile-time ownership rules to free memory automatically without leaks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5">
              <h4 className="font-bold text-foreground">Automatic Garbage Collection (Java / Python / JS)</h4>
              <p className="text-muted-foreground leading-relaxed">
                You never call <code className="font-mono">free()</code>. A background runtime thread called the <strong>Garbage Collector (GC)</strong> periodically inspects the Heap, finds objects that no longer have any variables pointing to them, and reclaims their memory automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Section G: Common Misconceptions */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="font-bold text-foreground text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            Common Beginner Misconceptions
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside leading-relaxed">
            <li>
              <strong>"A Stack Overflow is just an internet forum."</strong> <br />
              <span className="text-foreground">Reality:</span> The forum was named after a fatal computer hardware trap! The Stack has a fixed maximum size (typically 1MB to 8MB). If a recursive function calls itself without terminating, it keeps pushing frames until it hits an unmapped <strong>OS Guard Page</strong>. The CPU immediately halts the process with a fatal Segmentation Fault (<code className="font-mono">SIGSEGV</code>).
            </li>
            <li>
              <strong>"Variables created inside a function persist after it returns."</strong> <br />
              <span className="text-foreground">Reality:</span> Local variables only exist while that specific function’s stack frame is active. The microsecond the function hits <code className="font-mono">return</code>, the CPU adjusts the Stack Pointer (pops the frame), immediately invalidating those variables.
            </li>
            <li>
              <strong>"malloc() allocates memory on the Stack."</strong> <br />
              <span className="text-foreground">Reality:</span> <code className="font-mono">malloc()</code> always allocates bytes on the <strong>Heap</strong>. Only the pointer variable holding the heap’s memory address resides on the Stack!
            </li>
          </ul>
        </section>

        {/* Section H: Active Learning Check */}
        <PredictCheck
          kind="trace-memory"
          question="In the C program above, function square(n) creates a local variable 'int sq = n * n'. What happens to the memory occupied by 'sq' the moment square() finishes executing and returns?"
          options={[
            'It is permanently copied into the Data Segment for future reuse',
            'The CPU pops square’s stack frame off the Call Stack, immediately invalidating the memory used by sq',
            'It is saved to persistent SSD storage as a temporary cache',
            'It remains permanently on the Stack until the computer is rebooted',
          ]}
          correctIndex={1}
          explanation="Correct! Local variables exist strictly within their function's stack frame. When square() returns, its frame is popped off the top of the stack (LIFO), immediately freeing that memory for future function calls!"
          optionExplanations={[
            'Incorrect! The Data Segment only holds global and static variables declared outside functions.',
            'Correct! The Stack Pointer moves, popping square’s frame and invalidating all its local variables.',
            'Incorrect! Function local variables never touch the SSD storage disk.',
            'Incorrect! If stack frames remained forever, the computer would run out of memory within seconds.',
          ]}
        />

        {/* Section I: Summary */}
        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-blue-500">
            Lesson 06 Key Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>A process address space has 4 segments: Code, Data, Heap, and Stack.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>The Stack manages function calls and local variables automatically via LIFO frames.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>The Heap stores dynamic data and requires manual cleanup (C) or a Garbage Collector (JS/Java).</span>
            </li>
          </ul>
        </div>
      </div>
    </TopicLayout>
  );
};
