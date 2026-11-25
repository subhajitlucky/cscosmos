'use client';

import { useId, useMemo, useState } from 'react';
import type { JourneyEvent } from '../sim/engine';

export interface PacketLogProps {
  events: JourneyEvent[];
  activeId?: number;
}

export function PacketLog({ events, activeId }: PacketLogProps) {
  const [layerFilter, setLayerFilter] = useState('all');
  const filterId = useId();

  const layers = useMemo(
    () => Array.from(new Set(events.map((event) => event.layer))).sort(),
    [events],
  );
  // A stale filter (e.g. after switching scenarios) falls back to all layers.
  const selectedLayer = layerFilter === 'all' || layers.includes(layerFilter) ? layerFilter : 'all';
  const visible = useMemo(
    () =>
      events
        .filter((event) => selectedLayer === 'all' || event.layer === selectedLayer)
        .slice()
        .reverse(),
    [events, selectedLayer],
  );

  return (
    <section
      aria-label="Packet log"
      className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Packet log</h3>
        <label htmlFor={filterId} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Layer
          <select
            id={filterId}
            value={selectedLayer}
            onChange={(event) => setLayerFilter(event.target.value)}
            aria-label="Filter packet log by layer"
            className="ml-2 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:outline-sky-400"
          >
            <option value="all">All layers</option>
            {layers.map((layer) => (
              <option key={layer} value={layer}>
                {layer}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ol
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Packet events, newest first"
        className="max-h-72 space-y-1.5 overflow-y-auto"
      >
        {visible.length === 0 && (
          <li className="rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-400">
            No packets yet. Start or step the journey to see events.
          </li>
        )}
        {visible.map((event) => {
          const isActive = event.packetId === activeId;
          return (
            <li
              key={event.packetId}
              aria-current={isActive ? 'step' : undefined}
              className={`rounded-md border p-2 text-sm ${
                isActive
                  ? 'border-sky-500 bg-sky-100 text-slate-900 dark:border-sky-400 dark:bg-sky-950 dark:text-slate-100'
                  : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 font-mono text-xs font-semibold">
                <span>#{event.packetId}</span>
                <span>{event.time} ms</span>
                <span className="rounded bg-slate-200 px-1 text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                  {event.layer}
                </span>
                <span>
                  {event.device} · {event.direction === 'out' ? 'outbound' : 'inbound'}
                </span>
              </div>
              <p className="mt-1 leading-snug">{event.note}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
