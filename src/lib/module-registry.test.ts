import { describe, it, expect } from 'vitest';
import {
  getModule,
  getAllModules,
  isRegisteredModule,
} from './module-registry';

describe('Module Registry', () => {
  it('registers the AI curriculum modules', () => {
    const s1 = getModule('ai-engineering-foundations');
    expect(s1).toBeDefined();
    expect(s1?.domain).toBe('ai');
    expect(s1?.subtopics.length).toBe(26);

    const s2 = getModule('python-for-ai-engineering');
    expect(s2).toBeDefined();
    expect(s2?.domain).toBe('ai');
    expect(s2?.subtopics.length).toBe(24);
  });

  it('guarantees every registered module conforms to the curriculum module contract', () => {
    const modules = getAllModules();
    expect(modules.length).toBeGreaterThanOrEqual(2);

    for (const mod of modules) {
      expect(mod.topicSlug).toBeDefined();
      expect(mod.title.length).toBeGreaterThan(0);
      expect(mod.domain.length).toBeGreaterThan(0);
      expect(mod.HomePage).toBeDefined();
      expect(mod.TopicPage).toBeDefined();
      expect(mod.LabPage).toBeDefined();
      expect(mod.ProblemsPage).toBeDefined();
      expect(mod.subtopics.length).toBeGreaterThan(0);
    }
  });

  it('correctly reports isRegisteredModule', () => {
    expect(isRegisteredModule('ai-engineering-foundations')).toBe(true);
    expect(isRegisteredModule('python-for-ai-engineering')).toBe(true);
    expect(isRegisteredModule('unknown-module-xyz')).toBe(false);
  });
});
