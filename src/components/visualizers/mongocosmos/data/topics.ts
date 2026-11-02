import { PART1_TOPICS } from './topics/part1';
import { PART2_TOPICS } from './topics/part2';
import { PART3_TOPICS } from './topics/part3';
import { PART4_TOPICS } from './topics/part4';
import { PART5_TOPICS } from './topics/part5';
import { MongoTopic } from './topics/types';

export * from './topics/types';

export const MONGO_TOPICS: MongoTopic[] = [
  ...PART1_TOPICS,
  ...PART2_TOPICS,
  ...PART3_TOPICS,
  ...PART4_TOPICS,
  ...PART5_TOPICS,
];

// Helper to look up topics by ID
export function getMongoTopicById(id: string): MongoTopic | undefined {
  return MONGO_TOPICS.find((t) => t.id === id);
}
