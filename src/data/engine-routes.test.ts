import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { engineRoutes } from './engine-routes';
import { topics } from './topics';

// Curriculum modules are registered in src/lib/module-registry.ts. They share the
// AI engine's components but have their own canonical topic routes.
const MODULE_TOPIC_SLUGS = new Set([
  'ai-engineering-foundations',
  'python-for-ai-engineering',
]);

const activeTopics = topics.filter((topic) => topic.status === 'active');
const activeBySlug = new Map(activeTopics.map((topic) => [topic.slug, topic]));

describe('engine routes', () => {
  it('has a unique topic slug and engine directory for every engine', () => {
    const slugs = engineRoutes.map((route) => route.topicSlug);
    const engineDirs = engineRoutes.map((route) => route.engineDir);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(engineDirs).size).toBe(engineDirs.length);
  });

  it('points every engine at an existing visualizer directory', () => {
    for (const route of engineRoutes) {
      const engineDir = path.join(
        process.cwd(),
        'src',
        'components',
        'visualizers',
        route.engineDir,
      );
      expect(existsSync(engineDir), `${route.topicSlug} is missing ${engineDir}`).toBe(true);
    }
  });

  it('points every engine at an active catalog topic in the same domain', () => {
    for (const route of engineRoutes) {
      const topic = activeBySlug.get(route.topicSlug);
      expect(topic, `${route.topicSlug} is not an active topic`).toBeDefined();
      expect(topic?.domain).toBe(route.domain);
    }
  });

  it('maps every active topic to exactly one engine or curriculum module', () => {
    const engineSlugs = new Set(engineRoutes.map((route) => route.topicSlug));

    for (const topic of activeTopics) {
      const matches =
        (engineSlugs.has(topic.slug) ? 1 : 0) +
        (MODULE_TOPIC_SLUGS.has(topic.slug) ? 1 : 0);
      expect(matches, `${topic.slug} has ${matches} route owners`).toBe(1);
    }
  });

  it('has a top-level App Router directory for every engine path', () => {
    for (const route of engineRoutes) {
      const routeDir = path.join(
        process.cwd(),
        'src',
        'app',
        route.topicSlug,
        '[[...slug]]',
      );
      expect(existsSync(routeDir), `${route.topicSlug} is missing ${routeDir}`).toBe(true);
    }
  });
});
