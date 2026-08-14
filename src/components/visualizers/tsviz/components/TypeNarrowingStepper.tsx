'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Filter, Play, RotateCcw, SkipForward, Sparkles, Terminal } from 'lucide-react';

interface StepperScenario {
  id: string;
  title: string;
  initialType: string;
  code: string;
  steps: {
    line: number;
    narrowedType: string;
    guardMethod: string;
    explanation: string;
    accessibleMembers: string[];
  }[];
}

const SCENARIOS: StepperScenario[] = [
  {
    id: 'discriminated-union',
    title: 'Discriminated Union (Kind / Status Tag)',
    initialType: 'Circle | Rectangle | Triangle',
    code: `function calculateArea(shape: Shape) {
  // Shape is: Circle | Rectangle | Triangle
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2;
  } else if (shape.kind === 'rectangle') {
    return shape.width * shape.height;
  } else {
    return 0.5 * shape.base * shape.height;
  }
}`,
    steps: [
      {
        line: 1,
        narrowedType: 'Circle | Rectangle | Triangle',
        guardMethod: 'Broad Initial Union',
        explanation: 'At function entry, shape could be any of the 3 union variants. Only .kind is safe to read.',
        accessibleMembers: ['kind']
      },
      {
        line: 3,
        narrowedType: 'Circle',
        guardMethod: "Equality Guard (shape.kind === 'circle')",
        explanation: "Control Flow Analysis (CFA) narrows shape to Circle. Property .radius is now strictly accessible!",
        accessibleMembers: ['kind', 'radius']
      },
      {
        line: 5,
        narrowedType: 'Rectangle',
        guardMethod: "Else-If Guard (shape.kind === 'rectangle')",
        explanation: 'Circle has been eliminated. shape is narrowed to Rectangle with .width and .height.',
        accessibleMembers: ['kind', 'width', 'height']
      },
      {
        line: 7,
        narrowedType: 'Triangle',
        guardMethod: 'Exhaustive Else Branch',
        explanation: 'All other union possibilities have been pruned. shape is guaranteed to be Triangle.',
        accessibleMembers: ['kind', 'base', 'height']
      }
    ]
  },
  {
    id: 'typeof-instanceof',
    title: 'Primitive & Instanceof Narrowing',
    initialType: 'string | number | Date | Error',
    code: `function processValue(val: string | number | Date | Error) {
  if (typeof val === 'string') {
    return val.toUpperCase();
  } else if (typeof val === 'number') {
    return val.toFixed(2);
  } else if (val instanceof Date) {
    return val.toISOString();
  } else {
    return val.message;
  }
}`,
    steps: [
      {
        line: 1,
        narrowedType: 'string | number | Date | Error',
        guardMethod: 'Initial Type Union',
        explanation: 'Value possesses no common properties across primitives and object instances.',
        accessibleMembers: []
      },
      {
        line: 2,
        narrowedType: 'string',
        guardMethod: "typeof val === 'string'",
        explanation: 'CFA narrows val to string. String methods (toUpperCase, split, slice) become safe.',
        accessibleMembers: ['toUpperCase()', 'slice()', 'length']
      },
      {
        line: 4,
        narrowedType: 'number',
        guardMethod: "typeof val === 'number'",
        explanation: 'CFA narrows val to number. Number methods (toFixed, toPrecision) become safe.',
        accessibleMembers: ['toFixed()', 'toPrecision()']
      },
      {
        line: 6,
        narrowedType: 'Date',
        guardMethod: 'val instanceof Date',
        explanation: 'Checks prototype chain. val is narrowed to native Date instance.',
        accessibleMembers: ['toISOString()', 'getTime()', 'getFullYear()']
      },
      {
        line: 8,
        narrowedType: 'Error',
        guardMethod: 'Final Exhaustive Branch',
        explanation: 'Remaining type is narrowed to Error instance. .message and .stack are accessible.',
        accessibleMembers: ['message', 'stack', 'name']
      }
    ]
  }
];

export function TypeNarrowingStepper() {
  const [selectedScenario, setSelectedScenario] = useState<StepperScenario>(SCENARIOS[0]);
  const [stepIdx, setStepIdx] = useState(0);

  const currentStep = selectedScenario.steps[stepIdx] || selectedScenario.steps[0];

  const handleSelectScenario = (sc: StepperScenario) => {
    setSelectedScenario(sc);
    setStepIdx(0);
  };

  const handleNext = () => {
    setStepIdx((prev) => (prev < selectedScenario.steps.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="rounded-3xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-blue-600 dark:text-blue-400">
              Interactive Type Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Control Flow Analysis (CFA) &amp; Type Narrowing Stepper
            </h3>
          </div>
        </div>

        <div className="flex gap-2">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedScenario.id === sc.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-card border border-border text-foreground hover:border-blue-500'
              }`}
            >
              {sc.title.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Code Snippet */}
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2 mb-3">
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-blue-400" /> narrowing.ts</span>
              <span>Step {stepIdx + 1} of {selectedScenario.steps.length}</span>
            </div>
            <pre className="text-blue-300 whitespace-pre-wrap leading-relaxed">
              {selectedScenario.code}
            </pre>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Target Line: {currentStep.line}</span>
            <span className="text-[11px] text-emerald-400 font-bold">{currentStep.guardMethod}</span>
          </div>
        </div>

        {/* Right: Inferred Type Inspector */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Compiler Evaluated Type:
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono text-base font-extrabold">
              type shape = {currentStep.narrowedType}
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Safe Accessible Members:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentStep.accessibleMembers.length > 0 ? (
                currentStep.accessibleMembers.map((member) => (
                  <span
                    key={member}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-mono text-xs font-bold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> .{member}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">None (Type too broad)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-blue-500/20">
        <button
          onClick={handleNext}
          disabled={stepIdx >= selectedScenario.steps.length - 1}
          className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md flex items-center gap-2 disabled:opacity-40"
        >
          <SkipForward className="w-4 h-4 fill-current" />
          <span>Step Control Flow Analysis</span>
        </button>

        <button
          onClick={() => setStepIdx(0)}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Stepper</span>
        </button>
      </div>
    </div>
  );
}
