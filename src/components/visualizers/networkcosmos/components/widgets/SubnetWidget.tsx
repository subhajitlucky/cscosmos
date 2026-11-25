'use client';

import { useState } from 'react';
import {
  WidgetButton,
  WidgetPanel,
  WidgetSlider,
  WidgetStat,
  WidgetToggle,
  intToIpv4,
  ipv4ToInt,
  prefixMask,
  type WidgetProps,
} from './shared';

export function SubnetWidget({ concept }: WidgetProps) {
  const aggregation = concept.slug.includes('route-aggregation');
  const vlsm = concept.slug.includes('vlsm');
  const baseIp = aggregation ? '172.16.0.0' : '203.0.113.0';
  const basePrefix = aggregation ? 22 : 24;

  const [prefix, setPrefix] = useState(concept.defaultFault === 'none' ? 26 : 28);
  const [selected, setSelected] = useState(0);
  const [hostOffset, setHostOffset] = useState(0);
  const [summary, setSummary] = useState(concept.defaultFault !== 'none');

  const base = ipv4ToInt(baseIp);
  const listPrefix = aggregation ? 24 : prefix;
  const count = 2 ** (listPrefix - basePrefix);
  const blockSize = 2 ** (32 - listPrefix);
  const usable = blockSize - 2;
  const hostMax = Math.max(0, Math.min(usable - 1, 62));
  const safeHost = Math.min(hostOffset, hostMax);
  const subnets = Array.from({ length: count }, (_, index) => {
    const net = (base + index * blockSize) >>> 0;
    return { net, label: `${intToIpv4(net)}/${listPrefix}` };
  });
  const chosen = subnets[Math.min(selected, count - 1)];
  const address = (chosen.net + 1 + safeHost) >>> 0;
  const displayPrefix = aggregation && summary ? basePrefix : listPrefix;
  const displayMask = prefixMask(displayPrefix);
  const masked = (address & displayMask) >>> 0;
  const displayBroadcast = (masked | ~displayMask) >>> 0;
  const displayUsable = 2 ** (32 - displayPrefix) - 2;
  const summaryNetwork = intToIpv4(base & prefixMask(basePrefix));

  return (
    <WidgetPanel
      title={aggregation ? 'Aggregation lab' : 'Subnet calculator'}
      subtitle={
        aggregation
          ? 'Collapse four contiguous /24 routes into one summary, and see what the summary also attracts.'
          : 'Borrow host bits: click a subnet, then move an address inside it to see the mask do its work.'
      }
      badge="Addresses"
    >
      {aggregation ? (
        <div className="mb-3">
          <WidgetToggle
            label="Advertise one summary instead of four /24s"
            checked={summary}
            onChange={setSummary}
            hint={`Routes installed: ${summary ? 1 : 4}`}
          />
        </div>
      ) : (
        <div className="mb-3 flex flex-wrap gap-4">
          <WidgetSlider
            label="New prefix length"
            value={prefix}
            min={basePrefix}
            max={30}
            suffix={` (/${prefix})`}
            onChange={(value) => {
              setPrefix(value);
              setSelected(0);
              setHostOffset(0);
            }}
            hint={`${count} equal subnets from ${baseIp}/${basePrefix}`}
          />
        </div>
      )}

      <div role="group" aria-label="Subnets, click to inspect one" className="flex flex-wrap gap-1.5">
        {subnets.slice(0, 16).map((subnet, index) => (
          <WidgetButton
            key={subnet.label}
            label={`Inspect subnet ${subnet.label}`}
            pressed={index === selected}
            onClick={() => {
              setSelected(index);
              setHostOffset(0);
            }}
          >
            <span className="font-mono">{subnet.label}</span>
          </WidgetButton>
        ))}
        {count > 16 && (
          <span className="self-center text-xs text-slate-600 dark:text-slate-400">+ {count - 16} more</span>
        )}
      </div>

      {aggregation && (
        <p className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-2 py-1.5 text-xs text-amber-950 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-100">
          {summary
            ? `${summaryNetwork}/22 matches every address from 172.16.0.0 to 172.16.3.255 — including ranges you may not own.`
            : 'Four specific /24 entries let a more specific route win wherever one exists.'}
        </p>
      )}
      {vlsm && (
        <p className="mt-2 rounded-md border border-sky-300 bg-sky-50 px-2 py-1.5 text-xs text-sky-950 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-100">
          VLSM borrows bits unevenly: /26 for 62 hosts, /27 for 30, /30 for a 2-host WAN link.
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-4">
        {!aggregation && (
          <WidgetSlider
            label="Host number in chosen subnet"
            value={safeHost}
            min={0}
            max={hostMax}
            onChange={setHostOffset}
            hint="Network and broadcast addresses are reserved"
          />
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WidgetStat label="Selected subnet" value={aggregation && summary ? `${summaryNetwork}/22` : chosen.label} />
        <WidgetStat label="Network" value={intToIpv4(masked)} />
        <WidgetStat label="Broadcast" value={intToIpv4(displayBroadcast)} />
        <WidgetStat label="Usable hosts" value={String(displayUsable)} />
      </div>
      <p className="mt-2 font-mono text-xs text-slate-700 dark:text-slate-300" aria-live="polite">
        {intToIpv4(address)} &amp; /{displayPrefix} = {intToIpv4(masked)}
        {!aggregation && ' → on-link with this mask'}
      </p>
    </WidgetPanel>
  );
}
