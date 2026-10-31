'use client';

import React from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { CompilationPipelineExplorer } from '../components/CompilationPipelineExplorer';
import { FileCode, Layers, Boxes, Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ExecutablePipeline: React.FC = () => {
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={9} title="How Does Code Become an Executable?">
      <div className="space-y-12">
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            You type your source code in plain text using an editor like VS Code. 
            Yet, silicon transistors can only process patterns of electronic voltages (0s and 1s). 
            How does human-written source code actually reach the CPU?
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The answer depends on your programming language. Some languages translate everything in advance (<strong>Compilation</strong>), 
            others translate line-by-line at runtime (<strong>Interpretation</strong>), and modern platforms combine both using <strong>Bytecode &amp; JIT compilation</strong>.
          </p>
        </section>

        {/* Section B & C: Why Different Pipelines & The Book Translation Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              Why Don't All Languages Work the Same Way?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every language was designed for a different goal: 
              <strong> C/C++ and Rust</strong> prioritize maximum raw speed and direct hardware control. 
              <strong> Java and C#</strong> prioritize "Write Once, Run Anywhere" portability. 
              <strong> Python and JavaScript</strong> prioritize rapid developer prototyping and web deployment.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              The Book Translator Analogy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Imagine an English book that needs to be read in Tokyo:
              <strong> 1. AOT Compiler:</strong> A translator translates the entire book into Japanese beforehand and prints thousands of copies. Readers read it at native speed, but translating took time upfront.
              <strong> 2. Interpreter:</strong> A live interpreter sits beside you, translating sentences into Japanese as they are spoken. No prep time needed, but speaking takes longer!
            </p>
          </div>
        </div>

        {/* Section D: Interactive Multi-Language Compilation Explorer */}
        <CompilationPipelineExplorer />

        {/* Section E: How It Works Internally — Key Terminology */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">
            Core Building Blocks of Code Translation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-blue-500 uppercase">
                1. Compiler &amp; Assembler
              </span>
              <h4 className="font-bold text-foreground text-base">From Syntax to Object Files (.o)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The compiler parses code into an Abstract Syntax Tree (AST), checks types, eliminates dead code, and generates CPU assembly. The assembler converts assembly mnemonics (<code className="font-mono">mov, add</code>) into binary machine code packaged in an <strong>Object File</strong> (<code className="font-mono">main.o</code>).
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-purple-500 uppercase">
                2. The Linker
              </span>
              <h4 className="font-bold text-foreground text-base">Stitching Modules and Libraries</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your code rarely exists alone. When you call <code className="font-mono">printf()</code> or <code className="font-mono">Math.sqrt()</code>, that implementation lives in the standard system library. The <strong>Linker</strong> connects your object files with library files, resolves memory addresses, and outputs a ready-to-run executable binary (<code className="font-mono">.exe</code>, ELF, Mach-O).
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase">
                3. Bytecode &amp; Virtual Machines
              </span>
              <h4 className="font-bold text-foreground text-base">Universal Intermediate Code</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Instead of generating x86 or ARM instructions directly, Java (<code className="font-mono">.class</code>) and Python (<code className="font-mono">.pyc</code>) compile to universal <strong>Bytecode</strong>. A software engine called a <strong>Virtual Machine</strong> (JVM or PVM) simulates a processor in software to execute that bytecode on any OS.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-500 uppercase">
                4. Just-In-Time (JIT) Compilation
              </span>
              <h4 className="font-bold text-foreground text-base">The Best of Both Worlds</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Modern runtimes like Chrome’s V8 (JavaScript) and Java’s HotSpot start out by interpreting bytecode for instant page loading. While running, a background profiler watches for functions that run frequently ("hot code") and compiles them dynamically into native CPU machine code!
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
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside leading-relaxed">
            <li>
              <strong>"Java is slow because it's interpreted."</strong> <br />
              <span className="text-foreground">Reality:</span> Java hasn't been purely interpreted since the 1990s! The modern JVM uses the HotSpot JIT compiler to compile heavily executed loops into native machine code that often approaches the speed of compiled C++.
            </li>
            <li>
              <strong>"An executable file only contains machine code."</strong> <br />
              <span className="text-foreground">Reality:</span> An executable binary (like an ELF file on Linux or .exe on Windows) also contains headers, section tables telling the OS where the code and data segments belong in memory, debug symbols, and external library dependency lists.
            </li>
          </ul>
        </section>

        {/* Section H: Quick Knowledge Check */}
        <PredictCheck
          question="What is the primary role of the Linker during the C / C++ build process?"
          options={[
            'To format your source code indentation according to style guidelines',
            'To stitch compiled object files (.o) together with system libraries and resolve function addresses into a final executable file',
            'To translate binary machine code back into English text',
            'To load the program into CPU registers during execution',
          ]}
          correctIndex={1}
          explanation="The compiler only compiles individual source files into object files (.o). The Linker is the crucial tool that stitches your object files together with system libraries (like libc for printf) into a single standalone executable!"
        />

        {/* Section I: Summary */}
        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-blue-500">
            Lesson 09 Key Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>AOT compilers (C/Rust) produce native hardware binaries before runtime.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Bytecode languages (Java/Python) target a universal Virtual Machine for portability.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>JIT compilers (V8/HotSpot) dynamically compile hot bytecode into native machine code at runtime.</span>
            </li>
          </ul>
        </div>
      </div>
    </TopicLayout>
  );
};
