'use client';

import { useState } from 'react';
import { WidgetButton, WidgetPanel, WidgetSlider, WidgetStat, WidgetToggle, type WidgetProps } from './shared';

interface Field {
  name: string;
  bits: string;
  value: string;
  note: string;
}

const EXTENSION_HEADERS = ['Hop-by-Hop', 'Routing', 'Fragment', 'Destination Options'];

function fieldsFor(
  kind: string,
  state: {
    ttl: number;
    df: boolean;
    payload: number;
    extensions: string[];
    srcPort: number;
    dstPort: number;
    checksumOk: boolean;
    secure: boolean;
    httpOnly: boolean;
    maxAge: number;
    conditional: boolean;
    nat: boolean;
  },
): Field[] {
  if (kind === 'ipv6') {
    return [
      { name: 'Version / class / flow', bits: '0–63', value: '6 / 0 / 0x3B4', note: 'The 40-byte base header is fixed; options move into extension headers.' },
      { name: 'Payload length', bits: '64–79', value: '1480 bytes', note: 'Counts only bytes after the base header.' },
      { name: 'Next header', bits: '80–87', value: state.extensions[0] ?? 'TCP (6)', note: 'Points to the first extension header, which chains to the next.' },
      { name: 'Hop limit', bits: '88–95', value: '64', note: 'Each router decrements this; zero ends the journey with ICMPv6 Time Exceeded.' },
      { name: 'Source address', bits: '96–255', value: '2001:db8::9', note: '128-bit source address; documentation prefix shown here.' },
      { name: 'Destination address', bits: '256–383', value: '2001:db8::1', note: '128-bit destination; end hosts, not routers, perform fragmentation.' },
    ];
  }
  if (kind === 'ports') {
    return [
      { name: 'Source port', bits: '0–15', value: String(state.srcPort), note: 'Ephemeral port chosen by the client; together with the address it identifies one socket.' },
      { name: 'Destination port', bits: '16–31', value: String(state.dstPort), note: 'Identifies the receiving service, e.g. 443 for HTTPS or 53 for DNS.' },
      { name: 'Sequence number', bits: '32–63', value: '3521001443', note: 'Byte-stream position of the first data byte in this segment.' },
      { name: 'Acknowledgment number', bits: '64–95', value: '41820651', note: 'The next byte the receiver expects; cumulative ACKs confirm earlier bytes.' },
      { name: 'Data offset / flags', bits: '96–111', value: '5 words · ACK', note: 'A 20-byte header with no options; SYN, ACK, FIN and RST drive the state machine.' },
      { name: 'Window', bits: '112–127', value: '64240 bytes', note: 'Receiver window: how many bytes beyond the ACK the sender may still transmit.' },
      { name: 'Checksum', bits: '128–143', value: state.checksumOk ? 'valid' : 'invalid', note: 'Covers the TCP header, payload and an IP pseudo-header; a mismatch makes the receiver discard the segment.' },
    ];
  }
  if (kind === 'udp') {
    return [
      { name: 'Source port', bits: '0–15', value: String(state.srcPort), note: 'Ephemeral port chosen by the client; NAT may rewrite it.' },
      { name: 'Destination port', bits: '16–31', value: String(state.dstPort), note: 'Identifies the receiving socket, e.g. 443 for HTTPS or 53 for DNS.' },
      { name: 'Length', bits: '32–47', value: String(8 + 64), note: 'UDP length counts the 8-byte header plus the payload.' },
      { name: 'Checksum', bits: '48–63', value: state.checksumOk ? 'valid' : 'invalid', note: 'Covers header, payload and an IP pseudo-header; a mismatch drops the datagram silently.' },
    ];
  }
  if (kind === 'cookies') {
    return [
      { name: 'Cookie', bits: 'header bytes', value: 'session=7f3a...', note: 'Echoed by the browser on matching requests; the protocol itself stays stateless.' },
      { name: 'Domain', bits: 'attribute', value: 'example.com', note: 'A too-broad domain sends the token to sibling hosts.' },
      { name: 'Secure', bits: 'attribute', value: state.secure ? 'set' : 'absent', note: 'Without Secure the cookie can travel over plaintext.' },
      { name: 'HttpOnly', bits: 'attribute', value: state.httpOnly ? 'set' : 'absent', note: 'Blocks script access to the cookie value.' },
      { name: 'Max-Age', bits: 'attribute', value: `${state.maxAge} s`, note: 'Controls how long caches and browsers may reuse it.' },
    ];
  }
  if (kind === 'caching') {
    return [
      { name: 'Cache-Control', bits: 'response header', value: `max-age=${state.maxAge}`, note: 'A cache may serve a fresh response without contacting the origin.' },
      { name: 'ETag', bits: 'response header', value: '"v3"', note: 'Validator sent back in If-None-Match on revalidation.' },
      { name: 'Age', bits: 'response header', value: '12 s', note: 'Time since the response was generated at the origin.' },
      { name: 'Vary', bits: 'response header', value: 'Accept-Encoding', note: 'A missing Vary can serve one client’s variant to another.' },
      { name: 'Conditional request', bits: 'request header', value: state.conditional ? 'If-None-Match: "v3"' : 'none', note: state.conditional ? 'A still-fresh validator returns a small 304 with no body.' : 'Without a validator the cache must fetch a full response.' },
    ];
  }
  if (kind === 'nat') {
    return [
      { name: 'Inside source', bits: 'before rewrite', value: '192.168.1.10:51000', note: 'Private address that cannot be routed on the public Internet.' },
      { name: 'Outside source', bits: 'after rewrite', value: state.nat ? '203.0.113.5:40001' : '192.168.1.10:51000', note: 'NAT stores the mapping keyed by protocol, internal endpoint and external port.' },
      { name: 'Destination', bits: 'unchanged', value: '93.184.216.34:443', note: 'Only the source endpoint is rewritten on the outbound packet.' },
      { name: 'Mapping state', bits: 'NAT table', value: state.nat ? 'active' : 'no mapping', note: 'An expired mapping drops the reply even though the application thinks the socket is open.' },
    ];
  }
  return [
    { name: 'Version / IHL', bits: '0–7', value: '4 / 5 words', note: 'Version 4 with a 20-byte header; options extend IHL in 4-byte words.' },
    { name: 'DSCP / ECN', bits: '8–15', value: '0 / 0', note: 'Marking bits used by QoS classification and congestion notification.' },
    { name: 'Total length', bits: '16–31', value: String(20 + state.payload), note: 'Header plus payload; a mismatch makes the receiver discard the packet.' },
    { name: 'ID / flags / offset', bits: '32–63', value: state.df ? 'DF set, offset 0' : 'DF clear, offset 0', note: 'DF forbids fragmentation and triggers ICMP fragmentation-needed when the MTU is too small.' },
    { name: 'TTL', bits: '64–71', value: String(state.ttl), note: 'Decremented by every router; zero produces ICMP Time Exceeded.' },
    { name: 'Protocol', bits: '72–79', value: '6 (TCP)', note: 'Identifies the upper-layer protocol carried in the payload.' },
    { name: 'Header checksum', bits: '80–95', value: 'recomputed per hop', note: 'Covers only the header; routers must recompute it after decrementing TTL.' },
    { name: 'Source IP', bits: '96–127', value: '203.0.113.9', note: 'End-to-end source address, distinct from the link-layer source MAC.' },
    { name: 'Destination IP', bits: '128–159', value: '93.184.216.34', note: 'Used for the longest-prefix lookup at every hop.' },
  ];
}

export function HeaderWidget({ concept }: WidgetProps) {
  const slug = concept.slug;
  const kind = slug.includes('ipv6')
    ? 'ipv6'
    : slug.includes('ports-and-multiplexing') || slug.includes('udp-datagrams')
      ? slug.includes('udp-datagrams') ? 'udp' : 'ports'
      : slug.includes('cookies') ? 'cookies'
        : slug.includes('caching') ? 'caching'
          : slug.includes('nat-and-port') ? 'nat' : 'ipv4';

  const [ttl, setTtl] = useState(64);
  const [df, setDf] = useState(concept.defaultFault === 'mtu');
  const [payload, setPayload] = useState(1480);
  const [extensions, setExtensions] = useState<string[]>([]);
  const [srcPort, setSrcPort] = useState(51000);
  const [dstPort, setDstPort] = useState(443);
  const [checksumOk, setChecksumOk] = useState(concept.defaultFault !== 'loss');
  const [secure, setSecure] = useState(true);
  const [httpOnly, setHttpOnly] = useState(true);
  const [maxAge, setMaxAge] = useState(3600);
  const [conditional, setConditional] = useState(false);
  const [nat, setNat] = useState(true);
  const [selected, setSelected] = useState(0);

  const fields = fieldsFor(kind, {
    ttl, df, payload, extensions, srcPort, dstPort, checksumOk,
    secure, httpOnly, maxAge, conditional, nat,
  });
  const current = fields[Math.min(selected, fields.length - 1)];
  const oversized = 20 + payload > 1500;
  const verdict =
    kind === 'ipv4'
      ? oversized ? (df ? 'ICMP error' : 'Fragmented') : 'Delivered'
      : kind === 'ports' || kind === 'udp'
        ? checksumOk ? 'Delivered' : 'Checksum drop'
        : '—';

  return (
    <WidgetPanel
      title="Header inspector"
      subtitle="Click a field to read what it controls, then change the values that a router or receiver would see."
      badge="Headers"
    >
      <div role="group" aria-label="Header fields, click to inspect" className="grid gap-1.5 sm:grid-cols-2">
        {fields.map((field, index) => (
          <WidgetButton
            key={field.name}
            label={`Inspect ${field.name}: ${field.value}`}
            pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            <span className="block text-left text-[11px] font-bold">{field.name}</span>
            <span className="block text-left font-mono text-[10px] opacity-90">{field.bits} · {field.value}</span>
          </WidgetButton>
        ))}
      </div>

      <div className="mt-2 rounded-md border border-slate-300 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200" aria-live="polite">
        <span className="font-bold">{current.name}: </span>{current.note}
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {kind === 'ipv4' && (
          <>
            <WidgetSlider label="TTL" value={ttl} min={1} max={255} onChange={setTtl} hint="IP TTL, not a DNS TTL" />
            <WidgetSlider label="Payload bytes" value={payload} min={100} max={2000} step={20} onChange={setPayload} hint="Next-hop MTU is 1500 bytes" />
            <WidgetToggle label="Don't Fragment (DF)" checked={df} onChange={setDf} hint="Forces PMTUD via ICMP fragmentation-needed" />
          </>
        )}
        {kind === 'ipv6' && (
          <div role="group" aria-label="IPv6 extension headers" className="flex flex-wrap gap-2">
            {EXTENSION_HEADERS.map((header) => (
              <WidgetToggle
                key={header}
                label={header}
                checked={extensions.includes(header)}
                onChange={(checked) =>
                  setExtensions((currentList) =>
                    checked ? [...currentList, header] : currentList.filter((value) => value !== header),
                  )
                }
              />
            ))}
          </div>
        )}
        {(kind === 'ports' || kind === 'udp') && (
          <>
            <WidgetSlider label="Source port" value={srcPort} min={1024} max={65535} onChange={setSrcPort} />
            <WidgetSlider label="Destination port" value={dstPort} min={1} max={65535} onChange={setDstPort} />
            <WidgetToggle
              label="Checksum valid"
              checked={checksumOk}
              onChange={setChecksumOk}
              hint={kind === 'udp' ? 'A failed checksum drops the datagram' : 'A failed checksum makes the receiver discard the segment'}
            />
          </>
        )}
        {kind === 'cookies' && (
          <>
            <WidgetToggle label="Secure attribute" checked={secure} onChange={setSecure} />
            <WidgetToggle label="HttpOnly attribute" checked={httpOnly} onChange={setHttpOnly} />
            <WidgetSlider label="Max-Age" value={maxAge} min={0} max={86400} suffix=" s" onChange={setMaxAge} />
          </>
        )}
        {kind === 'caching' && (
          <>
            <WidgetSlider label="Cache max-age" value={maxAge} min={0} max={86400} suffix=" s" onChange={setMaxAge} />
            <WidgetToggle label="Send conditional request" checked={conditional} onChange={setConditional} hint="Adds If-None-Match for revalidation" />
          </>
        )}
        {kind === 'nat' && (
          <WidgetToggle label="NAT rewrite enabled" checked={nat} onChange={setNat} hint="Translates the source IP and port at the boundary" />
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WidgetStat label="Header kind" value={kind.toUpperCase()} />
        <WidgetStat label="Inspecting" value={current.name} />
        <WidgetStat label="Extension headers" value={kind === 'ipv6' ? String(extensions.length) : '—'} />
        <WidgetStat
          label="Forwarding verdict"
          value={verdict}
          tone={verdict === 'Delivered' ? 'good' : verdict === 'ICMP error' || verdict === 'Checksum drop' ? 'bad' : 'neutral'}
        />
      </div>
    </WidgetPanel>
  );
}
