import type { EventRecord } from './types';
import { partitionForKey } from './murmur2';

/** Number of partitions the lab simulates. Kafka's partitioner is `hash % this`. */
export const PARTITION_COUNT = 3;

/**
 * The lab's opening state.
 *
 * Every record here must sit in the partition Kafka's partitioner actually assigns its key —
 * the lab prints that computation next to the key input, so a seed that disagrees with it
 * teaches the opposite of the lesson.
 *
 * The previous seed put two `user_102` records in P0. That key hashes to **P1**, and it did
 * so under the old 31-multiplier hash too — so the mis-seeding was not a consequence of the
 * wrong algorithm, it was simply wrong data. Worth noting for anyone editing this: the lab's
 * default key, `user_881`, happens to land in P2 under *both* hashes, so the default view
 * alone never revealed the discrepancy. `user_101` and `user_305` do move (P2 -> P1), and
 * `foobar` moves P1 -> P0.
 *
 * `seedPartitionMismatches()` below is a test-visible guard: it re-derives each record's
 * partition from the key and reports any record whose stored partition is wrong.
 */
export const SEED_PARTITIONS: Record<number, EventRecord[]> = {
  0: [
    { id: 'evt_1', key: 'user_112', partition: 0, offset: 0, payload: '{"event":"LOGIN"}', timestamp: '12:00:01' },
    { id: 'evt_2', key: 'user_112', partition: 0, offset: 1, payload: '{"event":"PAGE_VIEW"}', timestamp: '12:00:02' },
  ],
  1: [
    { id: 'evt_3', key: 'user_101', partition: 1, offset: 0, payload: '{"event":"ADD_TO_CART"}', timestamp: '12:00:01' },
  ],
  2: [
    { id: 'evt_4', key: 'user_881', partition: 2, offset: 0, payload: '{"event":"SIGNUP"}', timestamp: '12:00:00' },
  ],
};

/** The key the lab opens with. Must also land where the seed says it does. */
export const SEED_KEY_INPUT = 'user_881';

/** Offsets the simulated consumers start from, per partition. */
export const SEED_CONSUMER_OFFSETS: Record<number, number> = { 0: 1, 1: 0, 2: 0 };

/** Returns the records whose stored partition disagrees with Murmur2. Empty is correct. */
export function seedPartitionMismatches(): string[] {
  const bad: string[] = [];
  for (const [partition, records] of Object.entries(SEED_PARTITIONS)) {
    for (const record of records) {
      const expected = partitionForKey(record.key, PARTITION_COUNT);
      if (expected !== Number(partition) || record.partition !== expected) {
        bad.push(`${record.id} key=${record.key} stored=P${partition} murmur2=P${expected}`);
      }
    }
  }
  return bad;
}
