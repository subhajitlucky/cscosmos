'use client';

import { useState } from 'react';
import { WidgetButton, WidgetPanel, WidgetSlider, WidgetStat, WidgetToggle, type WidgetProps } from './shared';

interface Packet {
  time: string;
  proto: string;
  src: string;
  dst: string;
  info: string;
  hop?: number;
  hidden?: boolean;
}

const PACKETS: Packet[] = [
  { time: '0.000', proto: 'ARP', src: '203.0.113.9', dst: 'broadcast', info: 'Who has 203.0.113.1? Tell 203.0.113.9' },
  { time: '0.004', proto: 'ARP', src: '203.0.113.1', dst: '203.0.113.9', info: 'Gratuitous reply: .1 is at DE:AD:BE:EF', hidden: true },
  { time: '0.011', proto: 'DNS', src: '203.0.113.9:53122', dst: '198.51.100.53:53', info: 'Standard query A example.com' },
  { time: '0.048', proto: 'DNS', src: '198.51.100.53:53', dst: '203.0.113.9:53122', info: 'Response A 93.184.216.34, TTL 300' },
  { time: '0.052', proto: 'TCP', src: '203.0.113.9:51000', dst: '93.184.216.34:443', info: 'SYN seq=0 win=64240' },
  { time: '0.054', proto: 'TCP', src: '93.184.216.34:443', dst: '203.0.113.9:51000', info: 'SYN, ACK seq=0 ack=1' },
  { time: '0.055', proto: 'TCP', src: '203.0.113.9:51000', dst: '93.184.216.34:443', info: 'ACK ack=1 win=64240' },
  { time: '0.101', proto: 'ICMP', src: '203.0.113.9', dst: '192.0.2.1', info: 'Echo request id=7 seq=1', hop: 1 },
  { time: '0.104', proto: 'ICMP', src: '192.0.2.1', dst: '203.0.113.9', info: 'Time Exceeded (TTL expired)', hop: 1 },
  { time: '0.108', proto: 'ICMP', src: '203.0.113.9', dst: '192.0.2.2', info: 'Echo request id=7 seq=2', hop: 2 },
  { time: '0.111', proto: 'ICMP', src: '192.0.2.2', dst: '203.0.113.9', info: 'Time Exceeded (TTL expired)', hop: 2 },
  { time: '0.118', proto: 'ICMP', src: '93.184.216.34', dst: '203.0.113.9', info: 'Echo reply id=7 seq=3', hop: 3 },
  { time: '0.200', proto: 'TLS', src: '203.0.113.9', dst: '93.184.216.34:443', info: 'ClientHello, SNI=example.com' },
  { time: '0.240', proto: 'UDP', src: '203.0.113.9', dst: '93.184.216.34:443', info: 'QUIC Initial, DCID=8a6f' },
];

const FILTER_CHIPS = ['ARP', 'DNS', 'TCP', 'ICMP', 'TLS', 'UDP'];

export function CaptureWidget({ concept }: WidgetProps) {
  const traceroute = concept.slug.includes('ping-and-traceroute');
  const isTroubleshooting = concept.slug.includes('troubleshooting');

  const [shown, setShown] = useState(7);
  const [query, setQuery] = useState('');
  const [chips, setChips] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [promiscuous, setPromiscuous] = useState(concept.defaultFault === 'arpSpoof');
  const [ttl, setTtl] = useState(3);

  const needle = query.trim().toLowerCase();
  const visible = PACKETS.map((packet, index) => ({ packet, index })).filter(({ packet }) => {
    if (packet.hidden && !promiscuous) return false;
    if (traceroute && packet.hop !== undefined && packet.hop > ttl) return false;
    if (chips.length > 0 && !chips.includes(packet.proto)) return false;
    if (needle && !`${packet.proto} ${packet.src} ${packet.dst} ${packet.info}`.toLowerCase().includes(needle)) return false;
    return true;
  }).slice(0, shown);

  return (
    <WidgetPanel
      title="Capture & filter"
      subtitle="Captured frames are timestamped in arrival order. Filter them, capture more, and expand a row to read its fields."
      badge="Measurement"
    >
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={`capture-filter-${concept.number}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Display filter
        </label>
        <input
          id={`capture-filter-${concept.number}`}
          type="search"
          value={query}
          aria-label="Filter captured packets by address, protocol or text"
          placeholder="e.g. SYN, 203.0.113, TTL"
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-[10rem] flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 font-mono text-xs text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus-visible:outline-sky-400"
        />
      </div>

      <div role="group" aria-label="Protocol filter chips" className="mt-2 flex flex-wrap gap-1.5">
        {FILTER_CHIPS.map((chip) => (
          <WidgetButton
            key={chip}
            label={`Filter protocol ${chip}`}
            pressed={chips.includes(chip)}
            onClick={() =>
              setChips((current) => (current.includes(chip) ? current.filter((value) => value !== chip) : [...current, chip]))
            }
          >
            {chip}
          </WidgetButton>
        ))}
        <WidgetButton label="Clear all filters" onClick={() => { setChips([]); setQuery(''); }}>Clear ↺</WidgetButton>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        <WidgetButton label="Capture the next frame" onClick={() => setShown((value) => Math.min(PACKETS.length, value + 2))} disabled={shown >= PACKETS.length}>
          Capture next +
        </WidgetButton>
        {traceroute && (
          <WidgetSlider label="Probe TTL" value={ttl} min={1} max={3} suffix=" hops" onChange={setTtl} hint="Each router returns Time Exceeded as TTL reaches zero" />
        )}
        {isTroubleshooting && (
          <WidgetToggle label="Promiscuous mode" checked={promiscuous} onChange={setPromiscuous} hint="Reveals gratuitous ARP frames not addressed to this host" />
        )}
      </div>

      <div className="mt-3 overflow-x-auto rounded-md border border-slate-300 dark:border-slate-700">
        <table aria-label="Captured packets" className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-2 py-1.5 font-semibold">Time</th>
              <th scope="col" className="px-2 py-1.5 font-semibold">Protocol</th>
              <th scope="col" className="px-2 py-1.5 font-semibold">Source → Dest</th>
              <th scope="col" className="px-2 py-1.5 font-semibold">Info</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(({ packet, index }) => (
              <CaptureRow
                key={index}
                rowId={`capture-row-${concept.number}-${index}`}
                packet={packet}
                expanded={selected === index}
                onToggle={() => setSelected((current) => (current === index ? null : index))}
              />
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={4} className="px-2 py-3 text-center text-slate-600 dark:text-slate-400">
                  No frames match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <WidgetStat label="Buffered frames" value={String(shown)} />
        <WidgetStat label="Matching filter" value={String(visible.length)} />
        <WidgetStat label="Selected protocol" value={chips.length === 1 ? chips[0] : chips.length ? `${chips.length} types` : 'all'} />
      </div>
    </WidgetPanel>
  );
}

function CaptureRow({
  rowId,
  packet,
  expanded,
  onToggle,
}: {
  rowId: string;
  packet: Packet;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className={`border-t border-slate-200 dark:border-slate-800 ${expanded ? 'bg-sky-50 dark:bg-sky-950/50' : ''}`}>
        <td className="px-2 py-1.5 font-mono text-slate-700 dark:text-slate-300">
          <button
            type="button"
            aria-label={`Inspect ${packet.proto} frame at ${packet.time} seconds: ${packet.info}`}
            aria-expanded={expanded}
            aria-controls={expanded ? `${rowId}-detail` : undefined}
            onClick={onToggle}
            className="font-mono text-sky-800 underline decoration-dotted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:focus-visible:outline-sky-400"
          >
            {packet.time}
          </button>
        </td>
        <td className="px-2 py-1.5 font-semibold text-slate-900 dark:text-slate-100">{packet.proto}</td>
        <td className="px-2 py-1.5 font-mono text-[11px] text-slate-800 dark:text-slate-200">{packet.src} → {packet.dst}</td>
        <td className="px-2 py-1.5 text-slate-700 dark:text-slate-300">{packet.info}</td>
      </tr>
      {expanded && (
        <tr id={`${rowId}-detail`} className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
          <td colSpan={4} className="px-2 py-2">
            <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-800 dark:text-slate-200">
              {`Frame ${packet.time}s · protocol ${packet.proto}\nSource:      ${packet.src}\nDestination: ${packet.dst}\nParsed:      ${packet.info}${packet.hidden ? '\nNote:        only visible in promiscuous mode' : ''}`}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}
