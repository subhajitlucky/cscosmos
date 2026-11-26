import { describe, expect, it } from 'vitest';
import { getModule, getAllModules } from './module-registry';

describe('network curriculum module registration', () => {
  it('registers the computer networks module with all 50 subtopics', () => {
    const mod = getModule('computer-networks-internals-tcpip');
    expect(mod).toBeDefined();
    expect(mod!.domain).toBe('corecs');
    expect(mod!.subtopics).toHaveLength(50);
    expect(new Set(mod!.subtopics.map((s) => s.slug)).size).toBe(50);
    // Other curriculum modules register independently; assert the original three still exist.
    expect(getAllModules().length).toBeGreaterThanOrEqual(3);
  });
});
