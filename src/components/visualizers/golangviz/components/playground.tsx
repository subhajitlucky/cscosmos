"use client";

import { useMemo, useState } from "react";

type MemoryCell = { label: string; value: string; emphasis?: boolean };
type Step = {
  line: string;
  note: string;
  stack: MemoryCell[];
  heap: MemoryCell[];
  channels: MemoryCell[];
  goroutines: MemoryCell[];
};

const sampleSteps: Step[] = [
  {
    line: "x := 10",
    note: "Allocate x on the stack with value 10.",
    stack: [{ label: "x", value: "10", emphasis: true }],
    heap: [],
    channels: [],
    goroutines: [{ label: "main", value: "running", emphasis: true }],
  },
  {
    line: "p := &x",
    note: "Pointer p holds the address of x (still stack-allocated).",
    stack: [
      { label: "x", value: "10" },
      { label: "p", value: "&x", emphasis: true },
    ],
    heap: [],
    channels: [],
    goroutines: [{ label: "main", value: "running" }],
  },
  {
    line: "go worker(p)",
    note: "New goroutine scheduled; p escapes? Not yet, only pointer shared.",
    stack: [
      { label: "x", value: "10" },
      { label: "p", value: "&x" },
    ],
    heap: [],
    channels: [],
    goroutines: [
      { label: "main", value: "running" },
      { label: "g0 worker", value: "runnable", emphasis: true },
    ],
  },
  {
    line: "ch := make(chan int, 2)",
    note: "Buffered channel allocated on heap; capacity 2.",
    stack: [
      { label: "x", value: "10" },
      { label: "p", value: "&x" },
      { label: "ch", value: "chan int (cap 2)", emphasis: true },
    ],
    heap: [{ label: "chan buffer", value: "[_, _]" }],
    channels: [
      { label: "ch", value: "len=0 cap=2 (buffered)", emphasis: true },
    ],
    goroutines: [
      { label: "main", value: "running" },
      { label: "g0 worker", value: "waiting to start" },
    ],
  },
];

export function Playground() {
  const [code, setCode] = useState(
    ["x := 10", "p := &x", "go worker(p)", "ch := make(chan int, 2)"].join(
      "\n",
    ),
  );
  const [stepIndex, setStepIndex] = useState(0);

  const current = useMemo(() => sampleSteps[stepIndex], [stepIndex]);

  return (
    <div className="surface rounded-2xl p-6 shadow-xl shadow-blue-500/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-3 text-[var(--foreground)]">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Mini Playground (static demo)</span>
            <span className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-1 text-xs text-[var(--muted)]">
              Step {stepIndex + 1} / {sampleSteps.length}
            </span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-40 w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-3 font-mono text-sm text-[var(--foreground)] shadow-inner focus:border-blue-400 focus:outline-none"
          />
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live execution & memory view will run in-browser (WASM) in the full
            build. This static demo shows the UX.
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              className="rounded-full border border-[var(--panel-border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:border-[var(--panel-border)] disabled:opacity-50"
              disabled={stepIndex === 0}
            >
              Prev
            </button>
            <button
              onClick={() =>
                setStepIndex((i) => Math.min(sampleSteps.length - 1, i + 1))
              }
              className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={stepIndex === sampleSteps.length - 1}
            >
              Next
            </button>
          </div>
          <div className="surface-ghost rounded-xl p-4 text-sm text-[var(--foreground)]">
            <div className="font-mono text-xs text-blue-700 dark:text-blue-100">
              {current.line}
            </div>
            <p className="mt-2 text-[var(--muted)]">{current.note}</p>
          </div>
        </div>
        <div className="flex-1 space-y-4 text-[var(--foreground)]">
          <MemoryPanel title="Stack" cells={current.stack} accent="blue" />
          <MemoryPanel title="Heap" cells={current.heap} accent="emerald" />
          <MemoryPanel
            title="Channels"
            cells={current.channels}
            accent="amber"
          />
          <MemoryPanel
            title="Goroutines"
            cells={current.goroutines}
            accent="violet"
          />
        </div>
      </div>
    </div>
  );
}

function MemoryPanel({
  title,
  cells,
  accent,
}: {
  title: string;
  cells: MemoryCell[];
  accent: "blue" | "emerald" | "amber" | "violet";
}) {
  const accentColor: Record<typeof accent, string> = {
    blue:
      "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-400/40 dark:bg-blue-500/5 dark:text-blue-100",
    emerald:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-500/5 dark:text-emerald-100",
    amber:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-500/5 dark:text-amber-100",
    violet:
      "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-400/40 dark:bg-violet-500/5 dark:text-violet-100",
  };

  return (
    <div className="surface-ghost rounded-xl p-4">
      <div className="flex items-center justify-between text-sm text-[var(--foreground)]">
        <span className="font-semibold">{title}</span>
        <span className="text-xs text-[var(--muted)]">
          {cells.length ? `${cells.length} entries` : "empty"}
        </span>
      </div>
      {cells.length === 0 ? (
        <div className="mt-3 rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-xs text-[var(--muted)]">
          No allocations yet.
        </div>
      ) : (
        <div className="mt-3 grid gap-2">
          {cells.map((cell) => (
            <div
              key={`${title}-${cell.label}-${cell.value}`}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm shadow-sm ${accentColor[accent]} ${
                cell.emphasis
                  ? "ring-2 ring-[color-mix(in srgb, var(--accent) 30%, transparent)]"
                  : ""
              }`}
            >
              <span className="font-semibold">{cell.label}</span>
              <span className="font-mono text-xs">{cell.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

