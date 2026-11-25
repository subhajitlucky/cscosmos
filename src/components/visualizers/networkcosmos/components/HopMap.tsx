'use client';

import type { JourneyEvent } from '../sim/engine';

export interface HopMapProps {
  events: JourneyEvent[];
  activeIndex: number;
}

const DEVICES = [
  { device: 'client', label: 'Client host', role: 'Host' },
  { device: 'switch', label: 'Switch', role: 'Layer 2' },
  { device: 'router', label: 'Routers', role: 'Layer 3' },
  { device: 'server', label: 'Server host', role: 'Host' },
] as const;

export function HopMap({ events, activeIndex }: HopMapProps) {
  const activeDevice = activeIndex >= 0 ? events[activeIndex]?.device : undefined;

  return (
    <section
      aria-label="Packet hop map"
      className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
    >
      <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">Path across devices</h3>
      <ol aria-label="Hosts, switch, routers and server along the path" className="flex flex-wrap items-center gap-1.5">
        {DEVICES.map((node, index) => {
          const active = node.device === activeDevice;
          return (
            <li key={node.device} className="flex items-center gap-1.5">
              <div
                aria-current={active ? 'step' : undefined}
                className={`rounded-md border px-3 py-2 text-center transition-colors duration-200 motion-reduce:transition-none ${
                  active
                    ? 'border-sky-500 bg-sky-100 text-sky-950 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-50'
                    : 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                <span className="block text-sm font-bold">{node.label}</span>
                <span className="block text-xs opacity-90">{node.role}</span>
                {active && <span className="sr-only">Active hop</span>}
              </div>
              {index < DEVICES.length - 1 && (
                <span aria-hidden="true" className="text-lg font-bold text-slate-400 dark:text-slate-500">
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
