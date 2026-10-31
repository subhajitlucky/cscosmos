'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Layers, Boxes, Cpu, ArrowRight, CheckCircle2, Terminal, Sparkles, RefreshCw } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type LanguageKey = 'c' | 'java' | 'js' | 'python';

interface PipelineStage {
  step: number;
  title: string;
  tool: string;
  input: string;
  output: string;
  codeSnippet: string;
  explanation: string;
}

interface LanguagePipeline {
  name: string;
  badge: string;
  badgeColor: string;
  summary: string;
  philosophy: string;
  stages: PipelineStage[];
}

const PIPELINES: Record<LanguageKey, LanguagePipeline> = {
  c: {
    name: 'C / C++',
    badge: 'Ahead-Of-Time (AOT) Native Compilation',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    summary: 'Directly translated into native CPU machine instructions before you ever run it.',
    philosophy: 'Maximum execution speed and hardware control. The compiled binary runs directly on the bare CPU without any interpreter.',
    stages: [
      {
        step: 1,
        title: 'High-Level Source Code',
        tool: 'Text Editor (.c file)',
        input: 'Human-readable text file (main.c)',
        output: 'ASCII / UTF-8 source file',
        codeSnippet: `#include <stdio.h>
int main() {
    int a = 15, b = 27;
    int result = a + b;
    printf("%d", result);
    return 0;
}`,
        explanation: 'Source code is written for human programmers to understand and maintain. CPUs cannot understand words like "int" or "main".',
      },
      {
        step: 2,
        title: 'Compiler & Assembler',
        tool: 'GCC / Clang (AOT Compiler)',
        input: 'Source code text',
        output: 'Object File (main.o) containing binary machine code',
        codeSnippet: `; Generated x86_64 Assembly:
main:
  mov eax, 15
  mov edx, 27
  add eax, edx
  ret`,
        explanation: 'The compiler translates C expressions into assembly instructions for the specific target CPU architecture (x86_64 or ARM64).',
      },
      {
        step: 3,
        title: 'Linker',
        tool: 'Linker (ld / lld)',
        input: 'main.o + C Standard Library (libc.so / libc.a)',
        output: 'Standalone Executable file (ELF on Linux, .exe on Windows, Mach-O on macOS)',
        codeSnippet: `Binary Executable Header:
  Format: ELF 64-bit LSB executable
  Entry point address: 0x401050
  Symbols resolved: printf -> 0x7ffff7e0...`,
        explanation: 'The linker stitches your compiled object files together with standard libraries (like the code that implements printf) into a single launchable file.',
      },
      {
        step: 4,
        title: 'Direct Hardware Execution',
        tool: 'OS Loader + Physical CPU',
        input: 'Executable binary file on SSD',
        output: 'CPU runs billions of instructions per second',
        codeSnippet: `01001000 10001001 11100101 ...
Register RAX = 42
Terminal prints: 42`,
        explanation: 'The OS copies the binary instructions into RAM and sets the Program Counter to the entry point. The CPU runs instructions directly at native electrical clock speed.',
      },
    ],
  },
  java: {
    name: 'Java',
    badge: 'Bytecode + Java Virtual Machine (JVM)',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    summary: 'Compiled once to universal bytecode, then executed and JIT-optimized by the JVM.',
    philosophy: '"Write Once, Run Anywhere". The compiler does not target x86 or ARM chips directly; it targets an imaginary ideal CPU called the Java Virtual Machine.',
    stages: [
      {
        step: 1,
        title: 'Java Source Code',
        tool: 'Text Editor (.java file)',
        input: 'Main.java text file',
        output: 'UTF-8 Java source file',
        codeSnippet: `public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 27;
        System.out.println(a + b);
    }
}`,
        explanation: 'Standard object-oriented Java code that is independent of any operating system or CPU hardware.',
      },
      {
        step: 2,
        title: 'Bytecode Compiler',
        tool: 'javac (Java Compiler)',
        input: 'Main.java',
        output: 'Main.class (Binary Bytecode)',
        codeSnippet: `// Disassembled JVM Bytecode:
0: bipush        15
2: istore_1
3: bipush        27
5: istore_2
6: iload_1
7: iload_2
8: iadd
9: invokevirtual println`,
        explanation: 'javac translates Java into JVM Bytecode. Bytecode is like assembly, but designed for the virtual JVM instead of real physical silicon.',
      },
      {
        step: 3,
        title: 'JVM Execution & HotSpot JIT',
        tool: 'Java Virtual Machine (HotSpot)',
        input: 'Main.class bytecode',
        output: 'Dynamic translation to native machine code',
        codeSnippet: `JVM Interpreter starts running bytecode.
Hot code detected: JIT compiler emits:
  add eax, edx
Native instruction runs directly on hardware.`,
        explanation: 'When you run "java Main", the JVM interprets bytecode. Frequently executed ("hot") code is dynamically compiled on the fly into native CPU machine code by the Just-In-Time (JIT) compiler.',
      },
    ],
  },
  js: {
    name: 'JavaScript',
    badge: 'Dynamic JIT Engine (e.g. Chrome V8)',
    badgeColor: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
    summary: 'Interpreted immediately for fast start-up, then compiled to native machine code at runtime.',
    philosophy: 'Instant execution in the browser. No ahead-of-time compilation step required by the developer.',
    stages: [
      {
        step: 1,
        title: 'JavaScript Source Text',
        tool: 'Browser / Node.js Runtime',
        input: 'script.js string or file',
        output: 'Plain-text JavaScript',
        codeSnippet: `const a = 15;
const b = 27;
console.log(a + b);`,
        explanation: 'JavaScript code is sent over the network as plain text and handed directly to the browser JavaScript engine (like Google V8).',
      },
      {
        step: 2,
        title: 'Parser & AST Generation',
        tool: 'V8 Parser',
        input: 'Source text tokens',
        output: 'Abstract Syntax Tree (AST)',
        codeSnippet: `Program
  VariableDeclaration (const a = 15)
  VariableDeclaration (const b = 27)
  CallExpression (console.log)
    BinaryExpression (a + b)`,
        explanation: 'The parser reads the text characters, validates syntax, and builds a hierarchical tree of operations called an Abstract Syntax Tree (AST).',
      },
      {
        step: 3,
        title: 'Ignition Interpreter & TurboFan JIT',
        tool: 'V8 Execution Engine',
        input: 'AST -> Bytecode -> Native Code',
        output: 'Direct execution + high-speed native code',
        codeSnippet: `1. Ignition generates bytecode:
   LdaSmi [15] -> Star r0 -> Add r0 -> Print
2. TurboFan watches loop:
   Optimizes into native CPU ADD instruction.`,
        explanation: 'V8 first interprets bytecode for instant startup. If a function runs thousands of times, the TurboFan JIT compiler compiles it directly to native machine code for maximum speed.',
      },
    ],
  },
  python: {
    name: 'Python',
    badge: 'Bytecode Compilation + Python Virtual Machine (PVM)',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    summary: 'Compiled automatically to .pyc bytecode, then evaluated instruction by instruction by the PVM.',
    philosophy: 'Developer productivity, clarity, and rapid iteration. The CPython runtime handles execution and memory management automatically.',
    stages: [
      {
        step: 1,
        title: 'Python Source Script',
        tool: 'Text Editor (.py file)',
        input: 'main.py text file',
        output: 'UTF-8 Python script',
        codeSnippet: `a = 15
b = 27
result = a + b
print(result)`,
        explanation: 'Clean, high-level code with dynamic typing and automatic memory management.',
      },
      {
        step: 2,
        title: 'CPython Bytecode Compiler',
        tool: 'CPython Internal Compiler',
        input: 'main.py source code',
        output: 'Bytecode stored in __pycache__/*.pyc',
        codeSnippet: `// Disassembled Python Bytecode:
LOAD_CONST   1 (15)
STORE_NAME   0 (a)
LOAD_CONST   2 (27)
STORE_NAME   1 (b)
LOAD_NAME    0 (a)
LOAD_NAME    1 (b)
BINARY_OP    0 (+)
CALL         1 (print)`,
        explanation: 'When you run "python main.py", Python automatically compiles the code into internal Python bytecode instructions.',
      },
      {
        step: 3,
        title: 'Python Virtual Machine (PVM)',
        tool: 'CPython Runtime Evaluation Loop',
        input: 'Python Bytecode',
        output: 'Terminal output via C standard library',
        codeSnippet: `PVM giant switch loop (ceval.c):
while (instruction) {
  case BINARY_OP:
    PyNumber_Add(v, w);
}
Screen output: 42`,
        explanation: 'The PVM is a giant C loop that evaluates each bytecode instruction one by one, managing objects on the heap and calling OS system calls to print results.',
      },
    ],
  },
};

export function CompilationPipelineExplorer() {
  const { theme } = useTheme();
  const [activeLang, setActiveLang] = useState<LanguageKey>('c');
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);

  const pipeline = PIPELINES[activeLang];
  const activeStage = pipeline.stages[activeStageIdx] ?? pipeline.stages[0];

  const handleSelectLang = (lang: LanguageKey) => {
    setActiveLang(lang);
    setActiveStageIdx(0);
  };

  return (
    <div className={cn(
      "rounded-2xl border p-6 sm:p-8 space-y-6 shadow-xl transition-colors",
      theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    )}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-border/80">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
            Interactive Architecture Explorer
          </span>
          <h3 className="text-xl font-bold text-foreground">
            How Different Languages Reach the CPU
          </h3>
        </div>

        {/* Language Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted/60 border border-border" role="tablist">
          {(['c', 'java', 'js', 'python'] as LanguageKey[]).map((lang) => (
            <button
              key={lang}
              type="button"
              role="tab"
              aria-selected={activeLang === lang}
              onClick={() => handleSelectLang(lang)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                activeLang === lang
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {PIPELINES[lang].name}
            </button>
          ))}
        </div>
      </div>

      {/* Language Philosophy Banner */}
      <div className="p-4 rounded-xl border border-border bg-card space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-base font-bold text-foreground">{pipeline.name} Pipeline</h4>
          <span className={cn("text-xs font-mono px-2.5 py-0.5 rounded-full border font-bold", pipeline.badgeColor)}>
            {pipeline.badge}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {pipeline.philosophy}
        </p>
      </div>

      {/* Pipeline Stepper Navigation */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Pipeline Stages (Click a stage to inspect its code &amp; output):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {pipeline.stages.map((stage, idx) => {
            const isSelected = activeStageIdx === idx;
            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setActiveStageIdx(idx)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30"
                    : "border-border bg-card hover:border-muted-foreground/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono",
                    isSelected ? "bg-amber-500 text-zinc-950 font-bold" : "bg-muted text-muted-foreground"
                  )}>
                    {stage.step}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[100px]">
                    {stage.tool}
                  </span>
                </div>
                <span className="text-xs font-bold text-foreground leading-tight">
                  {stage.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-xl border border-border bg-card">
        {/* Stage Narrative and Telemetry */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono text-amber-500 font-bold block mb-1">
              Stage {activeStage.step} of {pipeline.stages.length}
            </span>
            <h4 className="text-lg font-bold text-foreground">
              {activeStage.title}
            </h4>
            <span className="text-xs font-mono text-muted-foreground block mt-0.5">
              Tool / Engine: <strong>{activeStage.tool}</strong>
            </span>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            {activeStage.explanation}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 rounded-lg bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                Input
              </span>
              <span className="text-foreground leading-tight block">
                {activeStage.input}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                Output
              </span>
              <span className="text-foreground leading-tight block">
                {activeStage.output}
              </span>
            </div>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-slate-950 text-slate-100 font-mono text-xs overflow-hidden shadow-inner">
          <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Code / Binary Representation:</span>
            <span>{pipeline.name}</span>
          </div>
          <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed text-amber-300 flex-1">
            <code>{activeStage.codeSnippet}</code>
          </pre>
          <div className="px-4 py-2 bg-slate-900/40 text-[10px] text-slate-400 border-t border-slate-800/80">
            Next Stage: {pipeline.stages[(activeStageIdx + 1) % pipeline.stages.length]?.title}
          </div>
        </div>
      </div>
    </div>
  );
}
