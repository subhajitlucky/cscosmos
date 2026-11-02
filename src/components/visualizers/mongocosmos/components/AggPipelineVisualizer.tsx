'use client';

import React, { useState } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  AlertCircle
} from 'lucide-react';

interface PipelinePreset {
  name: string;
  description: string;
  stages: Array<{
    stageName: string;
    operator: string;
    stageCode: string;
    explanation: string;
    indexPushdown: boolean;
    outputDocs: any[];
  }>;
}

const PRESETS: PipelinePreset[] = [
  {
    name: 'Sales Aggregation ($match -> $group -> $sort)',
    description: 'Filter completed orders, aggregate total revenue by payment method, and sort highest first.',
    stages: [
      {
        stageName: 'Stage 0: Raw Collection Scan',
        operator: 'db.orders',
        stageCode: '// 8 initial orders in collection',
        explanation: 'The pipeline begins by streaming documents from the orders collection into the memory pipeline buffer.',
        indexPushdown: false,
        outputDocs: [
          { _id: 'o101', product: 'MacBook Pro M3', total: 2499, status: 'completed', payment: 'wire' },
          { _id: 'o102', product: 'Mechanical Keyboard', total: 180, status: 'completed', payment: 'card' },
          { _id: 'o103', product: '4K UltraWide Monitor', total: 850, status: 'shipped', payment: 'card' },
          { _id: 'o104', product: 'Ergonomic Desk Chair', total: 650, status: 'completed', payment: 'wire' },
          { _id: 'o105', product: 'Headphones', total: 350, status: 'cancelled', payment: 'card' },
          { _id: 'o106', product: 'Thunderbolt Dock', total: 280, status: 'completed', payment: 'card' },
          { _id: 'o107', product: 'Studio Microphone', total: 220, status: 'completed', payment: 'paypal' },
          { _id: 'o108', product: 'Drawing Tablet Pro', total: 750, status: 'completed', payment: 'card' },
        ]
      },
      {
        stageName: 'Stage 1: $match (Filter Completed)',
        operator: '$match',
        stageCode: '{ $match: { status: "completed" } }',
        explanation: 'Filters out cancelled and shipped orders. Because this is the first stage, MongoDB pushes this predicate down to an IXSCAN on status_1.',
        indexPushdown: true,
        outputDocs: [
          { _id: 'o101', product: 'MacBook Pro M3', total: 2499, payment: 'wire' },
          { _id: 'o102', product: 'Mechanical Keyboard', total: 180, payment: 'card' },
          { _id: 'o104', product: 'Ergonomic Desk Chair', total: 650, payment: 'wire' },
          { _id: 'o106', product: 'Thunderbolt Dock', total: 280, payment: 'card' },
          { _id: 'o107', product: 'Studio Microphone', total: 220, payment: 'paypal' },
          { _id: 'o108', product: 'Drawing Tablet Pro', total: 750, payment: 'card' },
        ]
      },
      {
        stageName: 'Stage 2: $group (Accumulate by Payment)',
        operator: '$group',
        stageCode: '{ $group: { _id: "$payment", totalRev: { $sum: "$total" }, count: { $sum: 1 } } }',
        explanation: 'Allocates hash table in memory partitioned by payment type, accumulating $sum totals for each bucket.',
        indexPushdown: false,
        outputDocs: [
          { _id: 'wire', totalRev: 3149, count: 2 },
          { _id: 'card', totalRev: 1210, count: 3 },
          { _id: 'paypal', totalRev: 220, count: 1 },
        ]
      },
      {
        stageName: 'Stage 3: $sort (Order by Revenue Descending)',
        operator: '$sort',
        stageCode: '{ $sort: { totalRev: -1 } }',
        explanation: 'Performs in-memory quicksort on the 3 grouped documents by totalRev descending.',
        indexPushdown: false,
        outputDocs: [
          { _id: 'wire', totalRev: 3149, count: 2 },
          { _id: 'card', totalRev: 1210, count: 3 },
          { _id: 'paypal', totalRev: 220, count: 1 },
        ]
      }
    ]
  },
  {
    name: 'Array Unwinding ($unwind -> $group)',
    description: 'Deconstruct array fields into individual documents and aggregate occurrence counts.',
    stages: [
      {
        stageName: 'Stage 0: Raw User Documents',
        operator: 'db.users',
        stageCode: '// User documents with tags array',
        explanation: 'Streaming 3 users containing skill tag arrays into the pipeline.',
        indexPushdown: false,
        outputDocs: [
          { _id: 'u1', name: 'Alice', tags: ['infra', 'lead'] },
          { _id: 'u2', name: 'Bob', tags: ['backend', 'go'] },
          { _id: 'u3', name: 'Charlie', tags: ['backend', 'infra'] },
        ]
      },
      {
        stageName: 'Stage 1: $unwind (Flatten Tags Array)',
        operator: '$unwind',
        stageCode: '{ $unwind: "$tags" }',
        explanation: 'Deconstructs the tags array field, emitting a separate document for each array element.',
        indexPushdown: false,
        outputDocs: [
          { _id: 'u1', name: 'Alice', tags: 'infra' },
          { _id: 'u1', name: 'Alice', tags: 'lead' },
          { _id: 'u2', name: 'Bob', tags: 'backend' },
          { _id: 'u2', name: 'Bob', tags: 'go' },
          { _id: 'u3', name: 'Charlie', tags: 'backend' },
          { _id: 'u3', name: 'Charlie', tags: 'infra' },
        ]
      },
      {
        stageName: 'Stage 2: $group (Count Tag Frequencies)',
        operator: '$group',
        stageCode: '{ $group: { _id: "$tags", count: { $sum: 1 } } }',
        explanation: 'Groups flattened documents by the tag string and computes total usage frequencies.',
        indexPushdown: false,
        outputDocs: [
          { _id: 'infra', count: 2 },
          { _id: 'lead', count: 1 },
          { _id: 'backend', count: 2 },
          { _id: 'go', count: 1 },
        ]
      }
    ]
  }
];

export function AggPipelineVisualizer() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  const preset = PRESETS[presetIdx];
  const stage = preset.stages[currentStageIdx];
  const isFirst = currentStageIdx === 0;
  const isLast = currentStageIdx === preset.stages.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentStageIdx((s) => s + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStageIdx((s) => s - 1);
  };

  const handleReset = () => {
    setCurrentStageIdx(0);
  };

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6 text-card-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Aggregation Pipeline Multi-Stage Stream Stepper
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setPresetIdx(idx);
                setCurrentStageIdx(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                presetIdx === idx
                  ? 'bg-foreground text-background font-semibold shadow-xs'
                  : 'border border-border bg-card hover:bg-muted/40 text-muted-foreground'
              }`}
            >
              Pipeline {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Stepper Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            Stage {currentStageIdx + 1} of {preset.stages.length}:
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-xs font-bold">
            {stage.operator}
          </span>
          {stage.indexPushdown && (
            <span className="px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              INDEX PUSHDOWN (IXSCAN)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground disabled:opacity-40 text-xs font-medium shadow-xs transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLast}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border hover:bg-muted/40 text-muted-foreground transition-colors"
            title="Reset to Stage 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stage Specification & Explanation */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-2">
          <span className="text-xs font-bold text-foreground">{stage.stageName}</span>
          <div className="p-3 rounded-lg border border-border bg-background font-mono text-xs text-foreground overflow-x-auto">
            {stage.stageCode}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{stage.explanation}</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Memory &amp; Output Tuples</span>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {stage.outputDocs.length} Documents Emitted
            </span>
          </div>

          <div className="p-3 rounded-lg border border-border bg-background font-mono text-[11px] space-y-1 max-h-[160px] overflow-y-auto">
            {stage.outputDocs.map((doc, idx) => (
              <div key={idx} className="text-muted-foreground">
                <span className="text-foreground font-bold">{idx + 1}.</span> {JSON.stringify(doc)}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
            <Cpu className="w-3.5 h-3.5 text-foreground" />
            <span>RAM boundary: 100MB per stage (pass allowDiskUse: true for disk spilling).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
