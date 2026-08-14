'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Cpu, FileCode2, Layers, Play, Sparkles, Terminal } from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  subTitle: string;
  role: string;
  dataStructure: string;
  outputPreview: string;
}

const STAGES: Stage[] = [
  {
    id: 'scanner',
    name: '1. Scanner',
    subTitle: 'Lexical Analysis',
    role: 'Converts raw TypeScript source characters into a stream of syntax tokens (keywords, identifiers, punctuators).',
    dataStructure: 'Token Stream (Array of SyntaxKind enums)',
    outputPreview: `[
  { kind: SyntaxKind.ConstKeyword, text: "const" },
  { kind: SyntaxKind.Identifier, text: "score" },
  { kind: SyntaxKind.ColonToken, text: ":" },
  { kind: SyntaxKind.NumberKeyword, text: "number" },
  { kind: SyntaxKind.EqualsToken, text: "=" },
  { kind: SyntaxKind.NumericLiteral, text: "42" }
]`
  },
  {
    id: 'parser',
    name: '2. Parser',
    subTitle: 'Syntactic Analysis',
    role: 'Consumes tokens and constructs the Abstract Syntax Tree (AST) representing the grammatical structure of the program.',
    dataStructure: 'SourceFile AST Tree (Hierarchical Node graph)',
    outputPreview: `SourceFile
 └── VariableStatement
      └── VariableDeclarationList (flags: Const)
           └── VariableDeclaration
                ├── name: Identifier ("score")
                ├── type: TypeReferenceNode ("number")
                └── initializer: NumericLiteral (value: 42)`
  },
  {
    id: 'binder',
    name: '3. Binder',
    subTitle: 'Symbol & Scope Resolution',
    role: 'Connects variable, function, and interface declarations to Symbols, tracking lexical scopes across files.',
    dataStructure: 'Symbol Table & Scope Environment chains',
    outputPreview: `SymbolTable {
  "score": Symbol {
    flags: SymbolFlags.BlockScopedVariable,
    declarations: [ VariableDeclaration ("score") ],
    valueDeclaration: VariableDeclaration ("score")
  }
}`
  },
  {
    id: 'checker',
    name: '4. Type Checker',
    subTitle: 'Semantic Analysis & Diagnostics',
    role: 'The core brain of TSC (~80% of compile time). Checks type assignability, infers types, resolves generics, and emits errors.',
    dataStructure: 'Type Relations, Constraint Solvers, Diagnostic Messages',
    outputPreview: `TypeChecker.checkSourceFile(file):
• Evaluated type for "score": numberType
• Verified initializer 42 is assignable to number
• Diagnostics: 0 Errors, Type Safety Verified ✅`
  },
  {
    id: 'emitter',
    name: '5. Emitter',
    subTitle: 'Code Generation',
    role: 'Transforms AST into target JavaScript (.js) and declaration files (.d.ts) by erasing types and downleveling modern syntax.',
    dataStructure: 'Emitted JavaScript Files + Source Maps + .d.ts',
    outputPreview: `// output.js
"use strict";
const score = 42;

// output.d.ts
declare const score: number;`
  }
];

export function TscPipelineVisualizer() {
  const [activeStage, setActiveStage] = useState<Stage>(STAGES[0]);

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              TypeScript Compiler Internals
            </div>
            <h3 className="text-xl font-bold text-foreground">
              TSC 5-Stage Compilation Pipeline
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Source ➔ Tokens ➔ AST ➔ Symbols ➔ Checker ➔ JS
        </span>
      </div>

      {/* Stage Stepper Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {STAGES.map((stg) => (
          <button
            key={stg.id}
            onClick={() => setActiveStage(stg)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeStage.id === stg.id
                ? 'bg-emerald-600 text-white shadow-md border-emerald-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-emerald-500'
            }`}
          >
            <div className="text-xs font-bold">{stg.name}</div>
            <div className={`text-[10px] ${activeStage.id === stg.id ? 'text-emerald-100' : 'text-muted-foreground'}`}>
              {stg.subTitle}
            </div>
          </button>
        ))}
      </div>

      {/* Main Stage Detail & Output */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Stage Responsibilities:
            </div>
            <h4 className="text-lg font-bold text-foreground">{activeStage.name}: {activeStage.subTitle}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {activeStage.role}
            </p>
          </div>

          <div className="pt-3 border-t border-border space-y-1 font-mono text-xs">
            <span className="text-muted-foreground">Internal Structure:</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400">{activeStage.dataStructure}</div>
          </div>
        </div>

        {/* Output Artifact Preview */}
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Stage Output Artifact
            </span>
            <span className="text-emerald-400 font-bold">TSC Pipeline</span>
          </div>

          <pre className="text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed py-2 flex-1">
            {activeStage.outputPreview}
          </pre>
        </div>
      </div>
    </div>
  );
}
