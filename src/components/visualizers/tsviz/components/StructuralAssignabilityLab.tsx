'use client';

import React, { useState } from 'react';
import { CheckCircle2, Layers, Sparkles, XCircle } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  props: Record<string, string>;
  isDirectLiteral: boolean;
}

const CANDIDATES: Candidate[] = [
  {
    id: 'exact',
    name: 'Candidate 1: Exact Match (id, name)',
    props: { id: 'number', name: 'string' },
    isDirectLiteral: true
  },
  {
    id: 'superset-var',
    name: 'Candidate 2: Superset via Variable (id, name, age, email)',
    props: { id: 'number', name: 'string', age: 'number', email: 'string' },
    isDirectLiteral: false
  },
  {
    id: 'superset-literal',
    name: 'Candidate 3: Direct Object Literal with Excess Key (id, name, age)',
    props: { id: 'number', name: 'string', age: 'number' },
    isDirectLiteral: true
  },
  {
    id: 'missing-prop',
    name: 'Candidate 4: Missing Required Key (only id)',
    props: { id: 'number' },
    isDirectLiteral: true
  }
];

export function StructuralAssignabilityLab() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(CANDIDATES[0]);

  // Target interface requires: id: number, name: string
  const hasId = selectedCandidate.props.id === 'number';
  const hasName = selectedCandidate.props.name === 'string';
  const hasExcessLiteral = selectedCandidate.isDirectLiteral && Object.keys(selectedCandidate.props).length > 2;

  const isAssignable = hasId && hasName && !hasExcessLiteral;

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Structural Subtyping Playground
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Shape Compatibility &amp; Excess Property Checker
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          isAssignable
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          {isAssignable ? 'Assignability: VALID ✅' : 'Assignability: ERROR ❌'}
        </span>
      </div>

      {/* Candidate Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CANDIDATES.map((cand) => (
          <button
            key={cand.id}
            onClick={() => setSelectedCandidate(cand)}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              selectedCandidate.id === cand.id
                ? 'bg-indigo-600 text-white shadow-md border-indigo-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-indigo-500'
            }`}
          >
            {cand.name}
          </button>
        ))}
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Target Interface */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            Target Parameter Type: User
          </span>
          <pre className="p-3 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs">
{`interface User {
  id: number;
  name: string;
}`}
          </pre>
          <div className="text-xs text-muted-foreground">
            Requires at minimum: <code>id: number</code> and <code>name: string</code>.
          </div>
        </div>

        {/* Candidate Evaluation */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Candidate Object Shape:
            </span>
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs">
{selectedCandidate.isDirectLiteral
  ? `function printUser(u: User) {}\n// Direct literal:\nprintUser(${JSON.stringify(selectedCandidate.props, null, 2)});`
  : `const temp = ${JSON.stringify(selectedCandidate.props, null, 2)};\n// Variable assignment:\nprintUser(temp);`}
            </pre>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 text-xs font-mono space-y-1">
            <div className="text-slate-400 font-bold">Compiler Verdict:</div>
            {isAssignable ? (
              <div className="text-emerald-400">
                ✅ Compatible: Shape possesses all required members. Excess properties are allowed through variable reference.
              </div>
            ) : hasExcessLiteral ? (
              <div className="text-rose-400">
                ❌ TS2353 Excess Property Check: Direct object literals cannot contain undeclared keys ({Object.keys(selectedCandidate.props).filter(k => !['id', 'name'].includes(k)).join(', ')}).
              </div>
            ) : (
              <div className="text-rose-400">
                ❌ TS2322 Missing Property: Candidate is missing required property &apos;name&apos;.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
