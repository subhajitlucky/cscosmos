// Per-hop header diff helper for the HeaderInspector. Pure and deterministic:
// no React, no browser APIs, no mutation of the headers being compared.

import type { Headers } from './types';

export type HeaderDiff = { [K in keyof Headers]?: [Headers[K], Headers[K]] };

// Listed in `Headers` field order so the returned diff has a stable insertion
// order. `satisfies` requires every field to be present and rejects unknown
// keys; the order itself is maintained by hand.
const HEADER_KEY_REGISTRY = {
  srcMac: true,
  dstMac: true,
  srcIp: true,
  dstIp: true,
  ipTtl: true,
  srcPort: true,
  dstPort: true,
  seq: true,
  ack: true,
  flags: true,
  checksumOk: true,
} satisfies Record<keyof Headers, true>;

const HEADER_KEYS = Object.keys(HEADER_KEY_REGISTRY) as (keyof Headers)[];

/** Returns before/after pairs for changed fields only; `{}` if either side is missing. */
export function diffHeaders(
  before: Headers | null | undefined,
  after: Headers | null | undefined,
): HeaderDiff {
  if (before == null || after == null) return {};

  // Accumulate with an index signature: the loop only writes known Headers
  // keys, each paired with that field's own value type.
  const diff: Record<string, unknown> = {};
  for (const key of HEADER_KEYS) {
    const previous = before[key];
    const next = after[key];
    if (!Object.is(previous, next)) diff[key] = [previous, next];
  }
  return diff as HeaderDiff;
}
