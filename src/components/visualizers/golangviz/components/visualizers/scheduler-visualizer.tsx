"use client";

import { useMemo, useState } from "react";

type GoroutineState = "runnable" | "running" | "waiting";

type Goroutine = {
  id: number;
  state: GoroutineState;
  on: number | null; // P index
};

export function SchedulerVisualizer() {
  const [processors] = useState(2);
  const [goroutines, setGoroutines] = useState<Goroutine[]>([
    { id: 1, state: "running", on: 0 },
    { id: 2, state: "runnable", on: null },
    { id: 3, state: "waiting", on: null },
  ]);
  const [nextId, setNextId] = useState(4);

  const runQueue = useMemo(
    () => goroutines.filter((g) => g.state === "runnable"),
    [goroutines],
  );
  const waiting = useMemo(
    () => goroutines.filter((g) => g.state === "waiting"),
    [goroutines],
  );

  const dispatch = () => {
    setGoroutines((prev) => {
      const updated = [...prev];
      for (let p = 0; p < processors; p++) {
        const running = updated.find((g) => g.state === "running" && g.on === p);
        if (running) continue;
        const candidateIndex = updated.findIndex((g) => g.state === "runnable");
        if (candidateIndex !== -1) {
          updated[candidateIndex] = {
            ...updated[candidateIndex],
            state: "running",
            on: p,
          };
        }
      }
      return updated;
    });
  };

  const park = (id: number) => {
    setGoroutines((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, state: "waiting", on: null } : g,
      ),
    );
  };

  const makeRunnable = (id: number) => {
    setGoroutines((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, state: "runnable", on: null } : g,
      ),
    );
  };

  const spawn = () => {
    setGoroutines((prev) => [
      ...prev,
      { id: nextId, state: "runnable", on: null },
    ]);
    setNextId((n) => n + 1);
  };

  const steal = () => {
    // Simplified: move first runnable to any free P.
    dispatch();
  };

  return (
    <div className="surface rounded-2xl p-5 shadow-lg shadow-purple-500/10">
      <div className="flex items-center justify-between text-[var(--foreground)]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-700 dark:text-purple-200">
            Scheduler
          </p>
          <h3 className="text-lg font-semibold">
            Goroutine / M:N Scheduler View
          </h3>
          <p className="text-sm text-[var(--muted)]">
            Visualize Ps, run queues, runnable vs waiting goroutines, and
            dispatch/steal.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={spawn}
            className="rounded-full bg-[var(--accent)] px-3 py-2 font-semibold text-white shadow"
          >
            Spawn
          </button>
          <button
            onClick={dispatch}
            className="rounded-full border border-[var(--panel-border)] bg-[var(--background)] px-3 py-2 font-semibold text-[var(--foreground)]"
          >
            Dispatch
          </button>
          <button
            onClick={steal}
            className="rounded-full border border-[var(--panel-border)] bg-[var(--background)] px-3 py-2 font-semibold text-[var(--foreground)]"
          >
            Work Steal
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
        <div className="surface-ghost rounded-xl p-4">
          <div className="flex items-center justify-between text-sm text-[var(--foreground)]">
            <span className="font-semibold">Processors (P)</span>
            <span className="text-xs text-[var(--muted)]">
              {processors} Ps
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {Array.from({ length: processors }).map((_, idx) => {
              const running = goroutines.find(
                (g) => g.state === "running" && g.on === idx,
              );
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-purple-400/30 bg-purple-500/10 p-3 text-sm text-purple-900 dark:text-purple-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">P{idx}</span>
                    <span className="text-xs text-purple-800 dark:text-purple-100">
                      {running ? "running" : "idle"}
                    </span>
                  </div>
                  <div className="mt-2 rounded-md border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-[var(--foreground)]">
                    {running ? (
                      <div className="flex items-center justify-between">
                        <span>G{running.id}</span>
                        <button
                          onClick={() => park(running.id)}
                          className="rounded-full border border-[var(--panel-border)] bg-[var(--background)] px-2 py-1 text-[11px] text-[var(--foreground)]"
                        >
                          Park
                        </button>
                      </div>
                    ) : (
                      <span className="text-[var(--muted)]">
                        no goroutine
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <QueueCard title="Run queue" color="blue" items={runQueue}>
            {runQueue.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-md border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-blue-900 dark:text-blue-50"
              >
                <span>G{g.id}</span>
                <button
                  onClick={() => makeRunnable(g.id)}
                  className="rounded-full border border-[var(--panel-border)] bg-[var(--background)] px-2 py-1 text-[11px] text-[var(--foreground)]"
                >
                  keep runnable
                </button>
              </div>
            ))}
          </QueueCard>
          <QueueCard title="Waiting" color="amber" items={waiting}>
            {waiting.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-md border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-amber-900 dark:text-amber-50"
              >
                <span>G{g.id}</span>
                <button
                  onClick={() => makeRunnable(g.id)}
                  className="rounded-full border border-[var(--panel-border)] bg-[var(--background)] px-2 py-1 text-[11px] text-[var(--foreground)]"
                >
                  Wake
                </button>
              </div>
            ))}
          </QueueCard>
        </div>
      </div>
    </div>
  );
}

function QueueCard({
  title,
  items,
  children,
  color,
}: {
  title: string;
  items: Goroutine[];
  children: React.ReactNode;
  color: "blue" | "amber";
}) {
  const palette =
    color === "blue"
      ? "border-blue-400/30 bg-blue-500/5 text-blue-100"
      : "border-amber-400/30 bg-amber-500/5 text-amber-100";
  return (
    <div className="surface-ghost rounded-xl p-4">
      <div className="flex items-center justify-between text-sm text-[var(--foreground)]">
        <span className="font-semibold">{title}</span>
        <span className="text-xs text-[var(--muted)]">
          {items.length || "empty"}
        </span>
      </div>
      <div
        className={`mt-3 rounded-lg border px-3 py-3 text-sm shadow-sm ${palette}`}
      >
        {items.length === 0 ? (
          <div className="text-[var(--muted)]">No goroutines here.</div>
        ) : (
          <div className="space-y-2">{children}</div>
        )}
      </div>
    </div>
  );
}

