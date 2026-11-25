'use client';

import { useState } from 'react';
import {
  Segmented,
  WidgetButton,
  WidgetPanel,
  WidgetStat,
  WidgetToggle,
  type WidgetProps,
} from './shared';

type HttpMode = '1.1' | '2' | '3';

interface FrameField {
  key: string;
  name: string;
  hex: string;
}

function parseHex(hex: string): number[] {
  return hex
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((byte) => parseInt(byte, 16));
}

function formatHex(bytes: number[]): string {
  return bytes.map((byte) => byte.toString(16).toUpperCase().padStart(2, '0')).join(' ');
}

function crc32(bytes: number[]): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function flipLastByte(hex: string): string {
  const bytes = parseHex(hex);
  bytes[bytes.length - 1] ^= 0x01;
  return formatHex(bytes);
}

// IEEE 802.3 FCS covers Destination MAC through Data/Pad. Preamble and SFD
// are synchronization symbols before the frame and are never FCS-covered.
function fcsBytes(fields: FrameField[]): number[] {
  return parseHex(
    fields
      .filter((field) => field.key !== 'preamble' && field.key !== 'sfd')
      .map((field) => field.hex)
      .join(' '),
  );
}

export function FrameWidget({ concept }: WidgetProps) {
  const slug = concept.slug;
  const isMac = slug.includes('mac-addresses') || slug.includes('arp-and-neighbor');
  const isVlan = slug.includes('vlans-trunking');
  const isTunnel = slug.includes('tunnels-and-vpns');
  const isHttp = slug.includes('http-versions');
  const isError = slug.includes('error-detection');

  const [corrupted, setCorrupted] = useState<string | null>(
    concept.defaultFault === 'loss' ? 'payload' : null,
  );
  const [forged, setForged] = useState(concept.defaultFault === 'arpSpoof');
  const [vlan, setVlan] = useState(isVlan);
  const [tunnel, setTunnel] = useState(isTunnel);
  const [http, setHttp] = useState<HttpMode>('1.1');
  const [fec, setFec] = useState(false);
  const [sent, setSent] = useState(false);

  const cleanFields: FrameField[] = [
    { key: 'preamble', name: 'Preamble', hex: 'AA AA AA AA AA AA AA AA' },
    { key: 'sfd', name: 'SFD', hex: 'AB' },
    {
      key: 'dst',
      name: 'Dest MAC',
      hex: forged ? 'DE AD BE EF 00 02' : '02 00 00 00 00 02',
    },
    {
      key: 'src',
      name: 'Source MAC',
      hex: forged ? 'DE AD BE EF 00 01' : '02 00 00 00 00 01',
    },
    { key: 'type', name: vlan ? '802.1Q tag' : 'EtherType', hex: vlan ? '81 00 00 64 08 00' : '08 00' },
    ...(tunnel
      ? [{ key: 'outer', name: 'Outer IP', hex: '45 00 00 68 00 00 40 00 40 06 0A 00 00 01 0A 00 00 02' }]
      : []),
    {
      key: 'payload',
      name: http === '1.1' ? 'HTTP/1.1 text' : http === '2' ? 'HTTP/2 frames' : 'QUIC frames',
      hex:
        http === '1.1'
          ? '47 45 54 20 2F 20 48 54 54 50 2F 31 2E 31'
          : http === '2'
            ? '00 00 18 01 04 00 00 00 01 82 84'
            : 'C0 00 00 01 08 43 8A 6A 7F 00 00 01',
    },
  ];

  const onWire = cleanFields.map((field) =>
    field.key === corrupted ? { ...field, hex: flipLastByte(field.hex) } : field,
  );
  const repaired = fec && corrupted === 'payload';
  const expectedFcs = crc32(fcsBytes(cleanFields));
  const receivedFcs = crc32(fcsBytes(repaired ? cleanFields : onWire));
  const accepted = expectedFcs === receivedFcs;
  const syncLoss = corrupted === 'preamble' || corrupted === 'sfd';
  const effectiveMtu = tunnel ? 1476 : 1500;

  return (
    <WidgetPanel
      title="Frame builder"
      subtitle="Click a field to flip a bit, then send it. The FCS covers Destination MAC through Data/Pad."
      badge="Link layer"
    >
      <div role="group" aria-label="Frame fields, click to corrupt or repair a bit" className="flex flex-wrap gap-1.5">
        {onWire.map((field) => (
          <WidgetButton
            key={field.key}
            label={`${field.name}: ${field.hex}. ${corrupted === field.key ? 'Corrupted, click to repair' : field.key === 'preamble' || field.key === 'sfd' ? 'Click to damage frame synchronization' : 'Click to corrupt one bit'}`}
            active={corrupted === field.key}
            onClick={() => setCorrupted((current) => (current === field.key ? null : field.key))}
          >
            <span className="block text-[10px] uppercase tracking-wide opacity-80">{field.name}</span>
            <span className="block max-w-[13rem] truncate font-mono text-[11px]">{field.hex}</span>
          </WidgetButton>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <WidgetButton label="Send frame through the receiver" onClick={() => setSent(true)}>
          Send frame →
        </WidgetButton>
        <WidgetButton
          label="Reset frame to its clean state"
          onClick={() => {
            setCorrupted(null);
            setSent(false);
          }}
        >
          Reset
        </WidgetButton>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {isMac && (
          <WidgetToggle
            label="Forge source MAC"
            checked={forged}
            onChange={setForged}
            hint="Poison the switch's learned port mapping"
          />
        )}
        {isVlan && (
          <WidgetToggle
            label="802.1Q VLAN tag"
            checked={vlan}
            onChange={setVlan}
            hint="Adds a 4-byte tag with VLAN ID 100"
          />
        )}
        {isTunnel && (
          <WidgetToggle
            label="Encapsulate in outer IP"
            checked={tunnel}
            onChange={setTunnel}
            hint={`Effective MTU drops to ${effectiveMtu} bytes`}
          />
        )}
        {isHttp && (
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">HTTP framing</p>
            <Segmented
              label="HTTP version on the wire"
              value={http}
              options={[
                { value: '1.1' as HttpMode, label: 'HTTP/1.1 text' },
                { value: '2' as HttpMode, label: 'HTTP/2 frames' },
                { value: '3' as HttpMode, label: 'HTTP/3 / QUIC' },
              ]}
              onChange={setHttp}
            />
          </div>
        )}
        {isError && (
          <WidgetToggle
            label="Forward error correction"
            checked={fec}
            onChange={setFec}
            hint="Repairs a single flipped payload byte before the FCS check"
          />
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <WidgetStat label="Expected FCS" value={expectedFcs.toString(16).toUpperCase().padStart(8, '0')} />
        <WidgetStat label="Received FCS" value={receivedFcs.toString(16).toUpperCase().padStart(8, '0')} />
        <WidgetStat
          label="Receiver verdict"
          value={!sent ? 'Idle' : syncLoss ? 'No sync' : accepted ? 'Accepted' : 'Discarded'}
          tone={!sent ? 'neutral' : accepted && !syncLoss ? 'good' : 'bad'}
        />
      </div>
      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300" aria-live="polite">
        {!sent
          ? 'CRC-32 covers Destination MAC through Data/Pad; preamble and SFD are outside the FCS. Corrupt a field to see what happens.'
          : syncLoss
            ? 'Preamble or SFD damage is a synchronization problem: the receiver cannot locate the frame start, so no FCS check happens.'
            : accepted
              ? 'FCS matches over Destination MAC through Data/Pad: the receiver unstuffs delimiters and hands the payload upward.'
              : 'FCS mismatch: the frame is dropped silently and the sender must retransmit.'}
      </p>
    </WidgetPanel>
  );
}
