/**
 * Apache Kafka's default partitioner hash: **MurmurHash2**, 32-bit, seed `0x9747b28c`.
 *
 * This is a direct port of `org.apache.kafka.common.utils.Utils.murmur2(byte[])` from the
 * Kafka clients (`clients/src/main/java/org/apache/kafka/common/utils/Utils.java`). The
 * engine previously used a plain 31-multiplier string hash (`hash * 33 + c`) while the UI
 * called it "Murmur2", which taught the wrong algorithm — see FS-82 in
 * `docs/audits/2026-10-18-fullstack-remediation-todo.md`.
 *
 * Three details matter for bit-for-bit parity with the JVM, and all three are easy to get
 * wrong in JavaScript:
 *
 *  1. **Java `int` overflow is silent and wraps.** JS `*` is floating point, so every
 *     multiply here goes through `Math.imul`, which keeps the low 32 bits exactly as the
 *     JVM does.
 *  2. **Blocks are read little-endian.** Kafka uses a little-endian `VarHandle`, so the
 *     first byte of a 4-byte block is the least significant.
 *  3. **The tail switch falls through.** `case 3` also runs `case 2` and `case 1`.
 *
 * The final `>>>` shifts are unsigned, matching Java's `>>>` on an `int`.
 */

const SEED = 0x9747b28c;
const M = 0x5bd1e995;
const R = 24;

/** Kafka's `Utils.murmur2` — a signed 32-bit hash of the given bytes. */
export function murmur2(data: Uint8Array): number {
  const length = data.length;

  let h = (SEED ^ length) | 0;
  const length4 = length >> 2;

  for (let i = 0; i < length4; i++) {
    const i4 = i << 2;
    let k =
      (data[i4] & 0xff) |
      ((data[i4 + 1] & 0xff) << 8) |
      ((data[i4 + 2] & 0xff) << 16) |
      ((data[i4 + 3] & 0xff) << 24);

    k = Math.imul(k, M);
    k ^= k >>> R;
    k = Math.imul(k, M);

    h = Math.imul(h, M);
    h ^= k;
  }

  // Handle the last few bytes of the input array (deliberate fallthrough, as in Java).
  const index = length4 << 2;
  switch (length - index) {
    case 3:
      h ^= (data[index + 2] & 0xff) << 16;
    // falls through
    case 2:
      h ^= (data[index + 1] & 0xff) << 8;
    // falls through
    case 1:
      h ^= data[index] & 0xff;
      h = Math.imul(h, M);
  }

  h ^= h >>> 13;
  h = Math.imul(h, M);
  h ^= h >>> 15;

  return h | 0;
}

/** Kafka's `Utils.toPositive` — clears the sign bit instead of taking an absolute value. */
export function toPositive(value: number): number {
  return value & 0x7fffffff;
}

const encoder = new TextEncoder();

/**
 * The partition Kafka's default partitioner assigns a key to:
 * `toPositive(murmur2(keyBytes)) % numPartitions`.
 *
 * Note this is `toPositive`, not `Math.abs`: `Math.abs` differs for the single value
 * `-2147483648`, which `toPositive` maps to 0.
 */
export function partitionForKey(key: string, numPartitions: number): number {
  if (numPartitions <= 0) return 0;
  return toPositive(murmur2(encoder.encode(key))) % numPartitions;
}
