import { describe, it, expect } from 'vitest';
import { ROLE_ROADMAPS, getRoleRoadmap, getEnrichedStages } from './role-roadmaps';
import { topics } from './topics';

describe('Role Roadmaps Data Suite', () => {
  const topicMap = new Map(topics.map((t) => [t.slug, t]));

  it('contains all 8 curated engineering roles', () => {
    expect(ROLE_ROADMAPS.length).toBe(8);
    const expectedRoles = ['frontend', 'backend', 'fullstack', 'kernel', 'ai', 'devops', 'security', 'corecs'];
    expect(ROLE_ROADMAPS.map((r) => r.id)).toEqual(expectedRoles);
  });

  it('verifies that every single topic slug exists in CSCosmos topics catalog', () => {
    for (const role of ROLE_ROADMAPS) {
      expect(role.stages.length).toBe(4);
      for (const stage of role.stages) {
        expect(stage.slugs.length).toBeGreaterThan(0);
        for (const slug of stage.slugs) {
          const topic = topicMap.get(slug);
          expect(topic, `Slug "${slug}" in role "${role.id}" must exist in topics catalog`).toBeDefined();
        }
      }
    }
  });

  it('retrieves role roadmaps by id correctly', () => {
    const kernelRole = getRoleRoadmap('kernel');
    expect(kernelRole).toBeDefined();
    expect(kernelRole?.title).toContain('Kernel');

    const nonExistent = getRoleRoadmap('non-existent');
    expect(nonExistent).toBeUndefined();
  });

  it('enriches stages with step numbers and valid calculation metrics', () => {
    const kernelRole = getRoleRoadmap('kernel')!;
    const enriched = getEnrichedStages(kernelRole);

    expect(enriched.length).toBe(4);
    let expectedStep = 1;
    for (const stage of enriched) {
      expect(stage.totalMinutes).toBeGreaterThan(0);
      for (const topic of stage.topics) {
        expect(topic.stepNumber).toBe(expectedStep);
        expectedStep++;
      }
    }
  });
});
