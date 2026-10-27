/** A single message in the stream lab, as stored in one partition's log. */
export interface EventRecord {
  id: string;
  key: string;
  /** The partition this record lives in. Must equal `partitionForKey(key, PARTITION_COUNT)`. */
  partition: number;
  /** Position within its own partition's log — Kafka offsets are per partition, not global. */
  offset: number;
  payload: string;
  timestamp: string;
}
