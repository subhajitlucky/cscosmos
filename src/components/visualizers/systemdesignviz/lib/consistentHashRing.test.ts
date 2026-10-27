import { describe, expect, it } from 'vitest';
import {
  angleFor,
  buildRing,
  fnv1a,
  mappingOf,
  movedKeys,
  nextServerName,
  positionsPerServer,
  RING_SIZE,
  routeKey,
  SAMPLE_KEYS,
  TOTAL_VNODES,
  widestGapAngle,
  type RingNode,
} from './consistentHashRing';

const NODES: RingNode[] = [
  { id: 'srv-1', name: 'Server A', angle: 45 },
  { id: 'srv-2', name: 'Server B', angle: 135 },
  { id: 'srv-3', name: 'Server C', angle: 225 },
  { id: 'srv-4', name: 'Server D', angle: 315 },
];

const owners = (nodes: RingNode[], vnodes = false) =>
  mappingOf(buildRing(nodes, vnodes)).map((m) => m.position?.serverName);

describe('consistent hashing ring — the routing rule', () => {
  it('routes a key to the first position clockwise from its hash', () => {
    const ring = buildRing(NODES, false);
    expect(routeKey(ring, 70)?.serverName).toBe('Server B'); // next after 45
    expect(routeKey(ring, 190)?.serverName).toBe('Server C'); // next after 135
    expect(routeKey(ring, 300)?.serverName).toBe('Server D'); // next after 225
  });

  it('wraps around the end of the ring', () => {
    const ring = buildRing(NODES, false);
    expect(routeKey(ring, 340)?.serverName).toBe('Server A'); // nothing above 315, so wrap to 45
    expect(routeKey(ring, 315)?.serverName).toBe('Server D'); // a key exactly on a position belongs to it
  });

  it('reproduces the mapping the component used to hardcode', () => {
    // The old table said B, C, A for these three keys — correct for the initial ring, which is
    // exactly why the bug was invisible until a control was pressed.
    expect(owners(NODES)).toEqual(['Server B', 'Server C', 'Server A']);
  });

  it('FS-11: removing a server remaps only the keys it owned', () => {
    const withoutD = NODES.slice(0, 3);
    const before = mappingOf(buildRing(NODES, false));
    const after = mappingOf(buildRing(withoutD, false));
    // Server D owned nothing at these three angles, so not one key moves.
    expect(movedKeys(before, after)).toEqual([]);
    expect(after.map((m) => m.position?.serverName)).toEqual(['Server B', 'Server C', 'Server A']);

    // Remove Server B instead. B sits at 135 and owns the arc *behind* it — every key whose
    // angle is at or below 135 but above A's 45 — which is user_849 at 70°. (My first version
    // of this test guessed session_91, which at 190 belongs to C; the test caught it.)
    const withoutB = NODES.filter((n) => n.name !== 'Server B');
    const movedB = movedKeys(before, mappingOf(buildRing(withoutB, false)));
    expect(movedB.map((m) => m.key)).toEqual(['user_849']);
    expect(movedB[0].position?.serverName).toBe('Server C'); // the clockwise successor
  });

  it('adding a server in the widest gap remaps only keys in that arc', () => {
    const angle = widestGapAngle(NODES);
    const before = mappingOf(buildRing(NODES, false));
    const after = mappingOf(buildRing([...NODES, { id: 'srv-5', name: 'Server E', angle }], false));
    const moved = movedKeys(before, after);
    for (const entry of moved) {
      expect(entry.angle).toBeGreaterThanOrEqual(0);
      expect(entry.angle).toBeLessThan(RING_SIZE);
      expect(entry.position?.serverName).toBe('Server E');
    }
    // Whatever moves, it moves *to the new server* — never to a different old server.
    expect(moved.length).toBeLessThanOrEqual(SAMPLE_KEYS.length);
  });
});

describe('virtual nodes', () => {
  it('spreads about TOTAL_VNODES positions across the servers', () => {
    const ring = buildRing(NODES, true);
    const per = positionsPerServer(NODES.length);
    expect(ring.length).toBe(per * NODES.length);
    expect(ring.length).toBeGreaterThanOrEqual(TOTAL_VNODES - NODES.length);
    for (const node of NODES) {
      expect(ring.filter((p) => p.serverId === node.id).length).toBe(per);
    }
  });

  it('still routes every key to a real server, and can change the answer', () => {
    const physical = owners(NODES, false);
    const virtual = owners(NODES, true);
    for (const name of virtual) expect(name).toBeTruthy();
    // With many hashed positions the distribution differs from the four hand-placed ones;
    // if it never differed the toggle would still be inert.
    expect(virtual).not.toEqual(physical);
  });

  it('is deterministic — the same servers always produce the same ring', () => {
    expect(buildRing(NODES, true)).toEqual(buildRing(NODES, true));
    expect(angleFor('srv-1#0')).toBe(angleFor('srv-1#0'));
  });

  it('uses a real published hash rather than a made-up one', () => {
    // FNV-1a 32-bit reference values (offset basis 0x811c9dc5, prime 0x01000193).
    expect(fnv1a('')).toBe(0x811c9dc5);
    expect(fnv1a('a')).toBe(0xe40c292c);
    expect(fnv1a('foobar')).toBe(0xbf9cf968);
  });
});

describe('server placement', () => {
  it('never places a new server on an existing angle', () => {
    let nodes = [...NODES];
    for (let i = 0; i < 6; i += 1) {
      const angle = widestGapAngle(nodes);
      const taken = nodes.map((n) => n.angle);
      expect(taken).not.toContain(angle);
      nodes = [...nodes, { id: `srv-x${i}`, name: `Server ${i}`, angle }];
    }
  });

  it('names the next server after the ones that exist, including after a removal', () => {
    expect(nextServerName(4)).toBe('Server E');
    expect(nextServerName(3)).toBe('Server D');
  });
});
