import { describe, expect, it } from 'vitest';
import { steps } from './learningPath';
import { TOPIC_BASE_PATH, TOPIC_DOMAIN, TOPIC_SLUG } from './topic';
import { getTopicMeta } from '@/data/topic-meta';

function parseMinutes(range: string): [number, number] {
  const match = range.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (!match) throw new Error(`Invalid time range: ${range}`);
  return [Number(match[1]), Number(match[2])];
}

describe('programviz learning path', () => {
  it('uses the canonical topic path for every step', () => {
    expect(TOPIC_BASE_PATH).toBe(`/${TOPIC_DOMAIN}/${TOPIC_SLUG}`);

    for (const step of steps) {
      expect(step.path.startsWith(`${TOPIC_BASE_PATH}/`)).toBe(true);
      expect(step.path.startsWith('/program-cosmos/')).toBe(false);
    }
  });

  it('has unique step numbers and paths', () => {
    const numbers = steps.map((step) => step.step);
    const paths = steps.map((step) => step.path);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('keeps the catalog estimate inside the sum of step estimates', () => {
    const ranges = steps.map((step) => parseMinutes(step.estimatedTime));
    const min = ranges.reduce((total, [low]) => total + low, 0);
    const max = ranges.reduce((total, [, high]) => total + high, 0);
    const meta = getTopicMeta(TOPIC_SLUG, TOPIC_DOMAIN, 'How Programs Execute');

    expect(meta.estimatedMinutes).toBeGreaterThanOrEqual(min);
    expect(meta.estimatedMinutes).toBeLessThanOrEqual(max);
  });
});
