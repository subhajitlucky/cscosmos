import { TOPICS_1_TO_10 } from './topics/part1';
import { TOPICS_11_TO_20 } from './topics/part2';
import { TOPICS_21_TO_30 } from './topics/part3';
import { TOPICS_31_TO_40 } from './topics/part4';
import { TOPICS_41_TO_50 } from './topics/part5';
import { SqlTopic } from './topics/types';

export * from './topics/types';

export const SQL_TOPICS: SqlTopic[] = [
  ...TOPICS_1_TO_10,
  ...TOPICS_11_TO_20,
  ...TOPICS_21_TO_30,
  ...TOPICS_31_TO_40,
  ...TOPICS_41_TO_50,
];
