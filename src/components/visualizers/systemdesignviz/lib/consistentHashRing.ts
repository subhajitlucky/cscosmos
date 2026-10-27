/**
 * The consistent-hashing ring behind `ConsistentHashingVisualizer`, as pure functions.
 *
 * This is the *lesson*, not decoration: a key belongs to the first ring position clockwise
 * from its hash, which is why removing a server only remaps the keys that server owned. The
 * component used to hardcode each sample key's target ("Server B", "Server C", "Server A"),
 * so pressing Remove Server left the ring pointing at a server that no longer existed and
 * inverted the minimal-remapping property the page exists to teach (FS-11).
 */

/** The ring spans 0°–360°, standing in for the 32-bit hash space 0x00000000–0xFFFFFFFF. */
export const RING_SIZE = 360;
/** How many virtual positions the "virtual nodes" toggle spreads across the ring. */
export const TOTAL_VNODES = 150;

export interface RingNode {
  id: string;
  name: string;
  angle: number;
}

/** A position on the ring, owned by a server. With virtual nodes on, a server owns many. */
export interface RingPosition {
  angle: number;
  serverId: string;
  serverName: string;
  label: string;
}

/**
 * FNV-1a — a real, standard 32-bit hash, used to place virtual nodes deterministically.
 *
 * It stands in for the ring's hash function: what matters for the lesson is that positions are
 * a *stable* function of the server name, not that they match any particular product's hash.
 * Naming it matters — an earlier pass on this repo shipped a hand-rolled `hash * 33 + c` under
 * the label "Murmur2", which taught the wrong algorithm.
 */
export const fnv1a = (input: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

export const angleFor = (label: string): number => fnv1a(label) % RING_SIZE;

/**
 * Builds the ring. Without virtual nodes each server occupies exactly one position (its
 * hand-placed angle, which keeps the default picture readable); with them, every server owns
 * `TOTAL_VNODES / nodes` hashed positions, which is what actually evens out the distribution.
 */
export const buildRing = (nodes: RingNode[], vNodesEnabled: boolean): RingPosition[] => {
  const positions: RingPosition[] = [];
  if (!vNodesEnabled) {
    for (const node of nodes) {
      positions.push({ angle: node.angle, serverId: node.id, serverName: node.name, label: node.name });
    }
  } else {
    const perServer = positionsPerServer(nodes.length);
    for (const node of nodes) {
      for (let i = 0; i < perServer; i += 1) {
        positions.push({
          angle: angleFor(`${node.id}#${i}`),
          serverId: node.id,
          serverName: node.name,
          label: `${node.name}·v${i}`,
        });
      }
    }
  }
  return positions.sort((a, b) => a.angle - b.angle);
};

/** How many virtual positions each server gets, so the ring totals about `TOTAL_VNODES`. */
export const positionsPerServer = (nodeCount: number): number =>
  Math.max(1, Math.round(TOTAL_VNODES / Math.max(1, nodeCount)));

/**
 * Clockwise lookup: the first position at or after the key's angle, wrapping to the start of
 * the ring. This *is* the consistent-hashing rule, and it is why removing a server only moves
 * the keys that server owned.
 */
export const routeKey = (ring: RingPosition[], keyAngle: number): RingPosition | null => {
  if (ring.length === 0) return null;
  return ring.find((position) => position.angle >= keyAngle) ?? ring[0];
};

/** The keys this visualizer routes, with fixed angles standing in for their hashes. */
export const SAMPLE_KEYS: ReadonlyArray<{ key: string; angle: number }> = [
  { key: 'user_849', angle: 70 },
  { key: 'session_91', angle: 190 },
  { key: 'cart_102', angle: 340 },
];

export interface KeyMapping {
  key: string;
  angle: number;
  position: RingPosition | null;
}

export const mappingOf = (ring: RingPosition[], keys = SAMPLE_KEYS): KeyMapping[] =>
  keys.map((sample) => ({ ...sample, position: routeKey(ring, sample.angle) }));

/** The keys whose owning server differs between two rings. */
export const movedKeys = (before: KeyMapping[], after: KeyMapping[]): KeyMapping[] =>
  after.filter((entry, i) => entry.position?.serverId !== before[i]?.position?.serverId);

/** The next unused server letter, so a label matches what will actually be added. */
export const nextServerName = (nodeCount: number): string =>
  `Server ${String.fromCharCode(65 + nodeCount)}`;

/**
 * Places a new server in the middle of the widest empty arc. The previous version always used
 * 160°, so adding two servers put them at the same angle and the ring silently had a shadowed
 * position.
 */
export const widestGapAngle = (nodes: RingNode[]): number => {
  if (nodes.length === 0) return 0;
  const angles = [...nodes.map((node) => node.angle)].sort((a, b) => a - b);
  let bestStart = angles[angles.length - 1];
  let bestGap = angles[0] + RING_SIZE - angles[angles.length - 1];
  for (let i = 0; i < angles.length - 1; i += 1) {
    const gap = angles[i + 1] - angles[i];
    if (gap > bestGap) {
      bestGap = gap;
      bestStart = angles[i];
    }
  }
  return (bestStart + bestGap / 2) % RING_SIZE;
};
