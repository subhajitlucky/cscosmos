'use client';

import { useState } from 'react';
import {
  Segmented,
  WidgetButton,
  WidgetPanel,
  WidgetStat,
  ipv4ToInt,
  prefixMask,
  type WidgetProps,
} from './shared';

interface Route {
  cidr: string;
  network: string;
  prefix: number;
  next: string;
  metric: number;
  note: string;
}

const DESTINATIONS = ['203.0.113.10', '203.0.113.200', '198.51.100.7', '8.8.8.8'];

export function LpmWidget({ concept }: WidgetProps) {
  const isEcmp = concept.slug.includes('metrics-and-ecmp');
  const routes: Route[] = isEcmp
    ? [
        { cidr: '0.0.0.0/0', network: '0.0.0.0', prefix: 0, next: 'eth2', metric: 100, note: 'Fallback default route' },
        { cidr: '203.0.113.0/24', network: '203.0.113.0', prefix: 24, next: 'eth0', metric: 10, note: 'Equal-cost path one' },
        { cidr: '203.0.113.0/24', network: '203.0.113.0', prefix: 24, next: 'eth1', metric: 10, note: 'Equal-cost path two' },
      ]
    : [
        { cidr: '0.0.0.0/0', network: '0.0.0.0', prefix: 0, next: 'eth2', metric: 100, note: 'Matches everything, least specific' },
        { cidr: '203.0.113.0/24', network: '203.0.113.0', prefix: 24, next: 'eth0', metric: 10, note: 'LAN prefix' },
        { cidr: '203.0.113.128/25', network: '203.0.113.128', prefix: 25, next: 'eth1', metric: 10, note: 'Specific exception for the upper half' },
      ];

  const [destination, setDestination] = useState(
    concept.defaultFault === 'loop' ? '203.0.113.200' : DESTINATIONS[0],
  );
  const [disabled, setDisabled] = useState<number[]>([]);
  const [flow, setFlow] = useState<'a' | 'b'>('a');

  const destinationInt = ipv4ToInt(destination);
  const rows = routes.map((route, index) => ({
    ...route,
    index,
    off: disabled.includes(index),
    match:
      !disabled.includes(index) &&
      (destinationInt & prefixMask(route.prefix)) === ipv4ToInt(route.network),
  }));
  const longest = rows.filter((row) => row.match).sort((a, b) => b.prefix - a.prefix);
  const tied = longest.filter((row) => row.prefix === longest[0]?.prefix);
  const winner = isEcmp && tied.length > 1 ? tied[(destinationInt + (flow === 'a' ? 0 : 1)) % tied.length] : longest[0];

  return (
    <WidgetPanel
      title="Forwarding lookup"
      subtitle="Pick a destination, then click table rows to disable a route and watch longest-prefix matching react."
      badge="Routing"
    >
      <div role="group" aria-label="Destination address presets" className="flex flex-wrap gap-1.5">
        {DESTINATIONS.map((address) => (
          <WidgetButton
            key={address}
            label={`Look up destination ${address}`}
            pressed={destination === address}
            onClick={() => setDestination(address)}
          >
            <span className="font-mono">{address}</span>
          </WidgetButton>
        ))}
      </div>

      <div className="mt-3 overflow-x-auto">
        <table aria-label="Forwarding table; use the next-hop buttons to disable or enable a route" className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400">
              <th scope="col" className="py-1.5 pr-3 font-semibold">Prefix</th>
              <th scope="col" className="py-1.5 pr-3 font-semibold">Next hop</th>
              <th scope="col" className="py-1.5 pr-3 font-semibold">Metric</th>
              <th scope="col" className="py-1.5 font-semibold">State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.index} className={`border-b border-slate-200 last:border-0 dark:border-slate-800 ${row.index === winner?.index ? 'bg-sky-50 dark:bg-sky-950/50' : ''}`}>
                <th scope="row" className="py-1.5 pr-3 font-mono font-medium text-slate-900 dark:text-slate-100">
                  {row.cidr}
                </th>
                <td className="py-1.5 pr-3 font-mono text-slate-800 dark:text-slate-200">
                  <WidgetButton
                    label={`${row.cidr} via ${row.next}, ${row.off ? 'disabled, click to enable' : 'enabled, click to disable'}`}
                    pressed={row.off}
                    onClick={() =>
                      setDisabled((current) =>
                        current.includes(row.index) ? current.filter((value) => value !== row.index) : [...current, row.index],
                      )
                    }
                  >
                    {row.next}
                  </WidgetButton>
                </td>
                <td className="py-1.5 pr-3 font-mono text-slate-700 dark:text-slate-300">{row.metric}</td>
                <td className="py-1.5 text-slate-700 dark:text-slate-300">
                  {row.off ? 'disabled' : row.match ? 'matches' : 'no match'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEcmp && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">Flow hash input</p>
          <Segmented
            label="Flow used by ECMP hash"
            value={flow}
            options={[
              { value: 'a' as const, label: 'Flow A · port 51000' },
              { value: 'b' as const, label: 'Flow B · port 51002' },
            ]}
            onChange={setFlow}
          />
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WidgetStat label="Destination" value={destination} />
        <WidgetStat label="Selected prefix" value={winner?.cidr ?? 'none'} tone={winner ? 'good' : 'bad'} />
        <WidgetStat label="Next hop" value={winner?.next ?? 'drop'} tone={winner ? 'good' : 'bad'} />
        <WidgetStat label="Matching entries" value={String(longest.length)} />
      </div>
      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300" aria-live="polite">
        {winner
          ? `${winner.cidr} wins with /${winner.prefix}: ${winner.note}.` +
            (isEcmp && tied.length > 1 ? ' Equal-cost entries are hashed per flow, not per packet.' : '')
          : 'No usable entry matches: the packet is dropped (or would follow a missing default route).'}
      </p>
    </WidgetPanel>
  );
}
