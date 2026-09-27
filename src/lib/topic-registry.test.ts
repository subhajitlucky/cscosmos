import { describe, it, expect } from 'vitest';
import {
  getTopicModule,
  getAllTopicModules,
  isRegisteredTopic,
} from './topic-registry';

describe('Unified Topic Registry', () => {
  it('registers Subject 01 and Subject 02 correctly', () => {
    const s1 = getTopicModule('ai-engineering-foundations');
    expect(s1).toBeDefined();
    expect(s1?.domain).toBe('ai');
    expect(s1?.subtopics.length).toBe(26);

    const s2 = getTopicModule('python-for-ai-engineering');
    expect(s2).toBeDefined();
    expect(s2?.domain).toBe('ai');
    expect(s2?.subtopics.length).toBe(24);
  });

  it('guarantees every registered module conforms to the 4-view contract', () => {
    const modules = getAllTopicModules();
    expect(modules.length).toBeGreaterThanOrEqual(2);

    for (const mod of modules) {
      expect(mod.id).toBeDefined();
      expect(mod.title.length).toBeGreaterThan(0);
      expect(mod.domain.length).toBeGreaterThan(0);
      expect(mod.HomePage).toBeDefined();
      expect(mod.TopicPage).toBeDefined();
      expect(mod.LabPage).toBeDefined();
      expect(mod.ProblemsPage).toBeDefined();
      expect(mod.subtopics.length).toBeGreaterThan(0);
    }
  });

  it('correctly reports isRegisteredTopic', () => {
    expect(isRegisteredTopic('ai-engineering-foundations')).toBe(true);
    expect(isRegisteredTopic('python-for-ai-engineering')).toBe(true);
    expect(isRegisteredTopic('unknown-module-xyz')).toBe(false);
  });
});
