'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Cpu, Binary, Layers, ArrowRight, Boxes, CheckCircle2, Terminal } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PipelineType = 'compiled' | 'interpreted';

interface Stage {
  id: string;
  name: string;
  shortLabel: string;
  tool: string;
  icon: React.ComponentType<{ className?: string }>;
  input: string;
  process: string;
  output: string;
  codeSnippet: string;
  explanation: string;
}

const COMPILED_STAGES: Stage[] = [
  {
    id: 'c-source',
    name: '1. High-Level Source Code',
    shortLabel: 'Source Code',
    tool: 'Editor (.c / .rs / .go)',
    icon: FileCode,
    input: 'Human-written text file (e.g. main.c)',
    process: 'Developer writes high-level expressions, abstractions, and logic.',
    output: 'Plain-text ASCII/UTF-8 source file on disk.',
    codeSnippet: `// main.c
int main() {
    int a = 15;
    int b = 27;
    return a + b; // 42
}`,
    explanation:
      'CPUs cannot understand English keywords or variable names. Source code is meant for humans to write, audit, and reason about.',
  },
  {
    id: 'c-compiler',
    name: '2. Compiler & Assembler',
    shortLabel: 'Compilation',
    tool: 'Compiler (GCC / Clang / rustc)',
    icon: Layers,
    input: 'Source code text',
    process:
      'Parses the syntax into an AST, applies dead-code elimination and register optimization, and translates logic into native CPU assembly instructions.',
    output: 'Object file (main.o) containing binary machine code and symbol references.',
    codeSnippet: `; x86_64 assembly output
main:
  mov eax, 15
  add eax, 27
  ret`,
    explanation:
      'The compiler translates human logic into the exact instruction set architecture (ISA) of the target CPU (e.g. x86_64 or ARM64).',
  },
  {
    id: 'c-linker',
    name: '3. Linker',
    shortLabel: 'Linking',
    tool: 'Linker (ld / lld)',
    icon: Boxes,
    input: 'Multiple object files (.o) + System libraries (libc)',
    process:
      'Stitches compiled modules together, resolves external symbol addresses (like printf), and packages metadata headers.',
    output: 'Stand-alone executable binary file (ELF on Linux, Mach-O on macOS, PE on Windows).',
    codeSnippet: `Binary Header (ELF):
  Entry point: 0x401020
  Program headers:
    LOAD: 0x400000 (R-X Code)
    LOAD: 0x600000 (RW- Data)`,
    explanation:
      'The linker produces the final file stored on your disk. It includes headers instructing the OS kernel how much memory is needed and where execution starts.',
  },
  {
    id: 'c-loader',
    name: '4. OS Loader & CPU Execution',
    shortLabel: 'Execution',
    tool: 'OS Kernel (execve) + CPU',
    icon: Cpu,
    input: 'Executable file on disk',
    process:
      'The OS creates a virtual address space, copies machine code into RAM, initializes the stack and registers, and points the Program Counter (PC) to the entry point.',
    output: 'Active CPU execution at gigahertz speed (billions of instructions/sec).',
    codeSnippet: `01001000 10001001 11100101 ...
CPU Register RAX = 42
Process returns status code 0.`,
    explanation:
      'The CPU fetch-decode-execute cycle runs purely in raw electronic voltages. No translation is needed at runtime—it runs directly at native hardware speed.',
  },
];

const INTERPRETED_STAGES: Stage[] = [
  {
    id: 'i-source',
    name: '1. High-Level Script',
    shortLabel: 'Script File',
    tool: 'Editor (.js / .py / .ts)',
    icon: FileCode,
    input: 'Script file text (e.g. app.js or script.py)',
    process: 'Developer writes dynamic code with high-level runtime features and standard libraries.',
    output: 'Source code loaded directly into the runtime engine.',
    codeSnippet: `// app.js
function calculateTotal(a, b) {
  return a + b;
}
console.log(calculateTotal(15, 27));`,
    explanation:
      'Unlike compiled languages, there is no manual "build" or "compile" step ahead of time. You pass the raw source directly to the runtime engine.',
  },
  {
    id: 'i-parser',
    name: '2. Parser & AST Generation',
    shortLabel: 'AST Parsing',
    tool: 'Engine Parser (V8 / CPython)',
    icon: Layers,
    input: 'Raw source text string',
    process:
      'Performs lexical tokenization and syntactic analysis, producing an Abstract Syntax Tree (AST) tree structure of operations.',
    output: 'In-memory Abstract Syntax Tree representing program expressions.',
    codeSnippet: `CallExpression:
  callee: Identifier('calculateTotal')
  arguments: [
    Literal(15),
    Literal(27)
  ]`,
    explanation:
      'The runtime verifies that your syntax is valid and organizes expressions into a hierarchical tree ready for evaluation.',
  },
  {
    id: 'i-bytecode',
    name: '3. Bytecode Virtual Machine',
    shortLabel: 'Bytecode VM',
    tool: 'Bytecode Generator (Ignition / Python VM)',
    icon: Binary,
    input: 'Abstract Syntax Tree (AST)',
    process:
      'Translates the AST into compact, portable bytecode instructions designed for a software virtual machine interpreter.',
    output: 'Virtual machine bytecode instructions (.pyc or in-memory VM stream).',
    codeSnippet: `; V8 Bytecode snippet
LdaNamedProperty a0, [0]
Star r0
Add a1, [1]
Return`,
    explanation:
      'Bytecode is hardware-neutral: the same bytecode runs on Windows, Linux, ARM, or x86. The software VM executes these virtual opcodes line-by-line.',
  },
  {
    id: 'i-jit',
    name: '4. JIT Compiler & Native Execution',
    shortLabel: 'JIT & Hardware',
    tool: 'JIT Compiler (TurboFan / PyPy / HotSpot)',
    icon: Cpu,
    input: 'Frequently executed ("hot") bytecode functions',
    process:
      'Profiles code during execution. Hot loops are compiled on-the-fly into native machine code and patched directly into CPU execution.',
    output: 'Near-native machine code executed directly by the CPU.',
    codeSnippet: `[JIT Optimized Machine Code]
mov eax, edi
add eax, esi
ret  ; Replaces VM interpretation!`,
    explanation:
      'Modern engines combine interpreter flexibility with native performance: cold code is interpreted quickly, while hot code is compiled into machine instructions at runtime.',
  },
];

export const CodeToBinaryPipeline: React.FC = () => {
  const { theme } = useTheme();
  const [pipelineType, setPipelineType] = useState<PipelineType>('compiled');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  const stages = pipelineType === 'compiled' ? COMPILED_STAGES : INTERPRETED_STAGES;
  const currentStage = stages[selectedStageIndex] ?? stages[0];

  const handlePipelineSwitch = (type: PipelineType) => {
    setPipelineType(type);
    setSelectedStageIndex(0);
  };

  return (
    <div
      className={cn(
        'rounded-3xl border p-6 sm:p-8 space-y-8 shadow-xl transition-colors duration-300',
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      )}
    >
      {/* Header & Pipeline Mode Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-amber-600 dark:text-amber-400">
            <Terminal className="w-4 h-4" />
            <span>Interactive Architecture Pipeline</span>
          </div>
          <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
            From Code to Binary: How Programs Transform
          </h3>
        </div>

        {/* Switcher Buttons */}
        <div
          role="tablist"
          aria-label="Program translation pipeline modes"
          className={cn(
            'flex rounded-xl p-1 border text-xs font-semibold',
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          )}
        >
          <button
            type="button"
            role="tab"
            aria-selected={pipelineType === 'compiled'}
            onClick={() => handlePipelineSwitch('compiled')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg transition-all',
              pipelineType === 'compiled'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-foreground'
            )}
          >
            Compiled (C, Rust, Go)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={pipelineType === 'interpreted'}
            onClick={() => handlePipelineSwitch('interpreted')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg transition-all',
              pipelineType === 'interpreted'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-foreground'
            )}
          >
            Interpreted &amp; JIT (JS, Python)
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Click any stage below to inspect its inputs, transforms, and machine output:</span>
          <span className="font-mono">
            Stage {selectedStageIndex + 1} of {stages.length}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stages.map((stage, idx) => {
            const IconComponent = stage.icon;
            const isSelected = selectedStageIndex === idx;
            const isPast = selectedStageIndex > idx;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageIndex(idx)}
                className={cn(
                  'group relative text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-zinc-900 dark:bg-zinc-900 shadow-md ring-1 ring-amber-500'
                    : isPast
                    ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                )}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : isPast
                        ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <span className="text-[10px] font-mono opacity-60">0{idx + 1}</span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight line-clamp-1">{stage.shortLabel}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                    {stage.tool}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Inspector Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${pipelineType}-${currentStage.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'p-6 rounded-2xl border transition-colors space-y-6',
            theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          )}
        >
          {/* Title & Tool Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {currentStage.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Key tool or subsystem:{' '}
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                  {currentStage.tool}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedStageIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedStageIndex((prev) => prev - 1)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-card transition"
                >
                  Previous Stage
                </button>
              )}
              {selectedStageIndex < stages.length - 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedStageIndex((prev) => prev + 1)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs font-medium hover:bg-amber-700 transition flex items-center gap-1 shadow"
                >
                  <span>Next Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3-Column Transformation Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border bg-card border-border space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-500 block">
                Incoming Input
              </span>
              <p className="text-muted-foreground leading-relaxed">{currentStage.input}</p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card border-border space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-500 block">
                What the Machine Does
              </span>
              <p className="text-muted-foreground leading-relaxed">{currentStage.process}</p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card border-border space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-500 block">
                Outgoing Output
              </span>
              <p className="text-muted-foreground leading-relaxed">{currentStage.output}</p>
            </div>
          </div>

          {/* Concrete Code Artifact Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Concrete Representation at this stage:</span>
              <span className="text-[10px] font-mono text-amber-500 uppercase">Live Preview</span>
            </div>
            <pre className="rounded-xl p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
              <code>{currentStage.codeSnippet}</code>
            </pre>
          </div>

          {/* Takeaway Insight */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-800 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
            <p>
              <strong className="text-amber-600 dark:text-amber-400">Architectural Note: </strong>
              {currentStage.explanation}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
