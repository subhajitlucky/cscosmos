/**
 * Redis Cluster hash slots — a faithful port of Redis' `crc16()`
 * (src/crc16.c) and `keyHashSlot()` (src/cluster.c).
 *
 * Redis hashes the *bytes* of a key with CRC-16/XMODEM — polynomial 0x1021,
 * initial value 0, MSB-first, no reflection, no final XOR — and keeps the low
 * 14 bits, which is the same as `CRC16(key) % 16384`:
 *
 *     slot = CRC16(key) & 0x3FFF   // 0 … 16383
 *
 * Hash tags: when the key contains a `{` followed by a later `}`, only the
 * bytes *between* them are hashed. That is what lets `user:{101}:name` and
 * `user:{101}:profile` share a node. An empty `{}` (or a `{` with no closing
 * `}` after it) is not a hash tag: the whole key is hashed, exactly as Redis
 * does it.
 *
 * Reference vectors — checked against the published `CLUSTER KEYSLOT` examples
 * (https://redis.io/docs/latest/commands/cluster-keyslot/) and the standard
 * CRC-16/XMODEM check value:
 *
 *   CRC16("123456789")            = 0x31C3           → slot 12739
 *   keyHashSlot("somekey")        = 11058
 *   keyHashSlot("foo{hash_tag}")  = 2515
 *   keyHashSlot("bar{hash_tag}")  = 2515
 *
 * They are asserted at module load below, so a bad edit fails loudly instead
 * of quietly drawing keys into the wrong slot.
 */

const CRC16_POLY = 0x1021;
/** Low 14 bits == `% 16384`, because crc16() is a 16-bit value. */
const SLOT_MASK = 0x3fff;

const encoder = new TextEncoder();

/**
 * CRC-16/CCITT (XMODEM): poly 0x1021, init 0, MSB-first, no final XOR.
 * Bitwise rather than table-driven — keys here are a handful of bytes.
 */
export function crc16(bytes: Uint8Array): number {
  let crc = 0;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i] << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ CRC16_POLY) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc;
}

/** CRC-16/XMODEM over the UTF-8 bytes of `input` (Redis hashes raw bytes). */
export function crc16OfString(input: string): number {
  return crc16(encoder.encode(input));
}

/**
 * The slot `CLUSTER KEYSLOT <key>` would return for `key`.
 *
 * Works on UTF-8 bytes rather than JS characters: `{` and `}` are ASCII and
 * can never appear inside a multi-byte sequence, so byte offsets and the
 * hash-tag substring match Redis' C implementation for non-ASCII keys too.
 */
export function keyHashSlot(key: string): number {
  const bytes = encoder.encode(key);

  let start = 0;
  while (start < bytes.length && bytes[start] !== 0x7b /* { */) start++;

  // No '{' at all: the whole key is hashed.
  if (start === bytes.length) return crc16(bytes) & SLOT_MASK;

  let end = start + 1;
  while (end < bytes.length && bytes[end] !== 0x7d /* } */) end++;

  // No closing '}', or nothing between the braces: the whole key is hashed.
  if (end === bytes.length || end === start + 1) return crc16(bytes) & SLOT_MASK;

  // Only the hash tag (the bytes between '{' and '}') is hashed.
  return crc16(bytes.subarray(start + 1, end)) & SLOT_MASK;
}

/**
 * `[key, expected slot]`. The first three are the published Redis docs
 * examples; the last two are the hash-tag guarantee, cross-checked against
 * Python's independent `binascii.crc_hqx` (the same XMODEM algorithm).
 */
const SLOT_VECTORS: ReadonlyArray<readonly [string, number]> = [
  ['somekey', 11058],
  ['foo{hash_tag}', 2515],
  ['bar{hash_tag}', 2515],
  ['user:{101}:name', 4466],
  ['user:{101}:profile', 4466],
];

/** CRC-16/XMODEM check value: CRC16("123456789") === 0x31C3. */
const CRC16_CHECK_VALUE = 0x31c3;

function assertReferenceVectors(): void {
  const check = crc16OfString('123456789');
  if (check !== CRC16_CHECK_VALUE) {
    throw new Error(
      `[hashSlot] CRC-16 self-check failed: CRC16("123456789") = 0x${check.toString(16).toUpperCase()}, expected 0x31C3`,
    );
  }
  for (const [key, expected] of SLOT_VECTORS) {
    const actual = keyHashSlot(key);
    if (actual !== expected) {
      throw new Error(
        `[hashSlot] self-check failed: keyHashSlot(${JSON.stringify(key)}) = ${actual}, expected ${expected}`,
      );
    }
  }
}

// Runs once, costs microseconds, and only throws if the hash above is wrong.
assertReferenceVectors();
