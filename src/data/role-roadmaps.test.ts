import { describe, it, expect } from 'vitest';
import { ROLE_ROADMAPS, getRoleRoadmap, getEnrichedStages } from './role-roadmaps';
import { topics } from './topics';

describe('Role Roadmaps Data Suite', () => {
  const topicMap = new Map(topics.map((t) => [t.slug, t]));

  it('contains the Top 10 curated engineering roles in industry', () => {
    expect(ROLE_ROADMAPS.length).toBe(10);
    const expectedRoles = [
      'fullstack',
      'backend',
      'frontend',
      'kernel',
      'ai',
      'devops',
      'security',
      'data_infra',
      'systems_compilers',
      'crossplatform',
    ];
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

    const dataInfra = getRoleRoadmap('data_infra');
    expect(dataInfra).toBeDefined();
    expect(dataInfra?.title).toContain('Database');

    const nonExistent = getRoleRoadmap('non-existent');
    expect(nonExistent).toBeUndefined();
  });

  it('enriches stages with step numbers and valid calculation metrics for all 10 roles', () => {
    for (const role of ROLE_ROADMAPS) {
      const enriched = getEnrichedStages(role);
      expect(enriched.length).toBe(4);

      let expectedStep = 1;
      for (const stage of enriched) {
        expect(stage.totalMinutes).toBeGreaterThan(0);
        for (const topic of stage.topics) {
          expect(topic.stepNumber).toBe(expectedStep);
          expectedStep++;
        }
      }
    }
  });
});
