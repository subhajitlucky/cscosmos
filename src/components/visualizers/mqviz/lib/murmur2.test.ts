import { describe, expect, it } from 'vitest';
import { murmur2, partitionForKey, toPositive } from './murmur2';
import {
  PARTITION_COUNT,
  SEED_CONSUMER_OFFSETS,
  SEED_KEY_INPUT,
  SEED_PARTITIONS,
  seedPartitionMismatches,
} from './seedEvents';

/**
 * The vectors are copied verbatim from Apache Kafka's own unit test, so this checks the
 * port against the reference implementation rather than against my own arithmetic.
 *
 *   clients/src/test/java/org/apache/kafka/common/utils/UtilsTest.java — `testMurmur2()`
 *
 *     cases.put("21".getBytes(), -973932308);
 *     cases.put("foobar".getBytes(), -790332482);
 *     cases.put("a-little-bit-long-string".getBytes(), -985981536);
 *     cases.put("a-little-bit-longer-string".getBytes(), -1486304829);
 *     cases.put("lkjh234lh9fiuh90y23oiuhsafujhadof229phr9h19h89h8".getBytes(), -58897971);
 *     cases.put(new byte[] {'a', 'b', 'c'}, 479470107);
 */
const KAFKA_VECTORS: Array<[string, number]> = [
  ['21', -973932308],
  ['foobar', -790332482],
  ['a-little-bit-long-string', -985981536],
  ['a-little-bit-longer-string', -1486304829],
  ['lkjh234lh9fiuh90y23oiuhsafujhadof229phr9h19h89h8', -58897971],
  ['abc', 479470107],
];

const utf8 = (s: string) => new TextEncoder().encode(s);

describe('murmur2 — Apache Kafka reference vectors', () => {
  for (const [key, expected] of KAFKA_VECTORS) {
    it(`matches Utils.murmur2 for ${JSON.stringify(key)}`, () => {
      expect(murmur2(utf8(key))).toBe(expected);
    });
  }

  it('reads blocks little-endian, so byte order is significant', () => {
    // Values produced by Appleby's canonical C `MurmurHash2` (see the differential harness in
    // scratch/murmur-ref/, which also reproduces all six Kafka vectors). "abcd" and "dcba" are
    // the same multiset of bytes in a different order and must not collide.
    expect(murmur2(utf8('abcd'))).toBe(-1323649548);
    expect(murmur2(utf8('dcba'))).toBe(-1374980206);
    expect(murmur2(utf8('abcd'))).not.toBe(murmur2(utf8('dcba')));
  });

  it('hashes tail bytes as unsigned', () => {
    // Java masks every tail byte with 0xff. A port that forgot would sign-extend bytes >= 0x80
    // and still be self-consistent, so these are reference values, not round-tripped ones.
    // (I first wrote the two 0xff cases from memory, guessed -1664672372 and 1054419715, and the
    // C oracle showed both were wrong — which is why the harness exists.)
    expect(murmur2(new Uint8Array([0x61, 0x62, 0xff]))).toBe(-1839913349);
    expect(murmur2(new Uint8Array([0x61, 0xff, 0x63]))).toBe(-1253289233);
    expect(murmur2(new Uint8Array([0x61, 0x62, 0x63]))).toBe(479470107);
  });

  it('hashes the empty input', () => {
    // No vector is published for the empty key; this value is from the C reference.
    expect(murmur2(new Uint8Array(0))).toBe(275646681);
  });
});

describe('toPositive', () => {
  it('clears the sign bit instead of taking an absolute value', () => {
    expect(toPositive(-1)).toBe(2147483647);
    expect(toPositive(-2147483648)).toBe(0);
    expect(toPositive(12345)).toBe(12345);
  });
});

describe('partitionForKey', () => {
  it('is exactly toPositive(murmur2(keyBytes)) % numPartitions', () => {
    for (const key of ['order-1', 'user-42', '', 'a', 'lkjh234lh9fiuh90y23oiuhsafujhadof229phr9h19h89h8']) {
      for (const n of [1, 2, 3, 7, 12]) {
        expect(partitionForKey(key, n)).toBe(toPositive(murmur2(utf8(key))) % n);
      }
    }
  });

  it('always returns an in-range partition', () => {
    for (const key of ['order-1', 'user-42', '', 'a', 'b', 'c', '\u00e9\u00e8', '\u{1f600}']) {
      for (const n of [1, 2, 3, 7, 12]) {
        const p = partitionForKey(key, n);
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThan(n);
      }
    }
  });

  it('is deterministic', () => {
    expect(partitionForKey('order-1', 3)).toBe(partitionForKey('order-1', 3));
  });

  it('is not the old 31-multiplier hash it replaced', () => {
    const legacy = (key: string) => {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash) % 3;
    };
    // At least one of these keys must move partition, otherwise the port changed nothing.
    const moved = ['order-1', 'user-42', 'abc', 'foobar'].filter((k) => partitionForKey(k, 3) !== legacy(k));
    expect(moved.length).toBeGreaterThan(0);
  });
});

describe('the lab seed agrees with the partitioner', () => {
  it('places every seeded record in the partition Murmur2 assigns its key', () => {
    expect(seedPartitionMismatches()).toEqual([]);
  });

  it('opens on a key that lands in a seeded partition', () => {
    const p = partitionForKey(SEED_KEY_INPUT, PARTITION_COUNT);
    expect(Object.keys(SEED_PARTITIONS).map(Number)).toContain(p);
  });

  it('gives every partition contiguous offsets starting at 0', () => {
    for (const [partition, records] of Object.entries(SEED_PARTITIONS)) {
      expect(records.map((r) => r.offset)).toEqual(records.map((_, i) => i));
      for (const r of records) expect(r.partition).toBe(Number(partition));
    }
  });

  it('points every consumer offset at a position within its partition log', () => {
    for (const [partition, offset] of Object.entries(SEED_CONSUMER_OFFSETS)) {
      const len = (SEED_PARTITIONS[Number(partition)] ?? []).length;
      expect(offset).toBeGreaterThanOrEqual(0);
      expect(offset).toBeLessThanOrEqual(len);
    }
  });

  it('keeps the record that the old seed had in the wrong partition out of P0', () => {
    // `user_102` was seeded in P0; Murmur2 puts it in P1. Guard the correction.
    expect(partitionForKey('user_102', 3)).toBe(1);
    const inP0 = (SEED_PARTITIONS[0] ?? []).some((r) => r.key === 'user_102');
    expect(inP0).toBe(false);
  });
});
