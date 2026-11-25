'use client';

import type { Headers, JourneyEvent } from '../sim/engine';
import { diffHeaders } from '../sim/headers';

export interface HeaderInspectorProps {
  event?: JourneyEvent;
  previous?: JourneyEvent;
}

const FIELDS: { key: keyof Headers; label: string }[] = [
  { key: 'srcMac', label: 'Source MAC' },
  { key: 'dstMac', label: 'Destination MAC' },
  { key: 'srcIp', label: 'Source IP' },
  { key: 'dstIp', label: 'Destination IP' },
  { key: 'ipTtl', label: 'IP TTL' },
  { key: 'srcPort', label: 'Source port' },
  { key: 'dstPort', label: 'Destination port' },
  { key: 'seq', label: 'Sequence number' },
  { key: 'ack', label: 'Acknowledgement' },
  { key: 'flags', label: 'Flags / protocol' },
  { key: 'checksumOk', label: 'Checksum OK' },
];

function display(value: string | number | boolean | undefined): string {
  return value === undefined ? '—' : String(value);
}

export function HeaderInspector({ event, previous }: HeaderInspectorProps) {
  const changes = diffHeaders(previous?.headers, event?.headers);

  return (
    <section
      aria-label="Packet header inspector"
      className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
    >
      <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-slate-100">Header inspector</h3>
      <p className="mb-2 text-xs text-slate-600 dark:text-slate-400">
        Fields changed from the previous hop are highlighted.
      </p>
      <div className="overflow-x-auto">
        <table aria-label="Header fields for the selected hop" className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-xs uppercase tracking-wide text-slate-600 dark:border-slate-600 dark:text-slate-400">
              <th scope="col" className="py-1.5 pr-3 font-semibold">
                Field
              </th>
              <th scope="col" className="py-1.5 pr-3 font-semibold">
                Current
              </th>
              <th scope="col" className="py-1.5 font-semibold">
                Previous
              </th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map(({ key, label }) => {
              const current = event?.headers[key];
              const before = previous?.headers[key];
              const changed = changes[key] !== undefined;
              return (
                <tr key={key} className="border-b border-slate-200 last:border-0 dark:border-slate-800">
                  <th scope="row" className="py-1.5 pr-3 font-medium text-slate-700 dark:text-slate-300">
                    {label}
                  </th>
                  <td
                    aria-label={
                      changed ? `${label} changed from ${display(before)} to ${display(current)}` : undefined
                    }
                    className={`py-1.5 pr-3 font-mono text-xs ${
                      changed
                        ? 'rounded bg-amber-100 font-bold text-amber-950 dark:bg-amber-900/70 dark:text-amber-50'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {display(current)}
                  </td>
                  <td className="py-1.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {display(before)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
