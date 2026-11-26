import { describe, expect, it } from "vitest";
import { getTopicMeta } from "./topic-meta";
import { topics } from "./topics";

describe("topic metadata", () => {
  it("applies curated overrides", () => {
    const meta = getTopicMeta("jsviz", "fullstack", "JavaScript Visualizer");
    expect(meta.difficulty).toBe("beginner");
    expect(meta.tags).toContain("javascript");
    expect(meta.related.length).toBeGreaterThan(0);
  });

  it("falls back to domain defaults", () => {
    const meta = getTopicMeta("made-up-topic", "dsa", "Made Up Topic");
    expect(meta.difficulty).toBe("intermediate");
    expect(meta.estimatedMinutes).toBeGreaterThan(0);
    expect(meta.tags.length).toBeGreaterThan(0);
  });

  it("every catalog topic has valid learning metadata", () => {
    for (const topic of topics) {
      const meta = getTopicMeta(topic.slug, topic.domain, topic.name);
      expect(["beginner", "intermediate", "advanced"]).toContain(meta.difficulty);
      expect(meta.estimatedMinutes).toBeGreaterThan(0);
      expect(meta.tags.length).toBeGreaterThan(0);
      expect(Array.isArray(meta.prerequisites)).toBe(true);
      expect(Array.isArray(meta.related)).toBe(true);
    }
  });

  it("only references real catalog topics in prerequisites and related topics", () => {
    // Coming-soon topics still have canonical pages (the in-development view), so
    // metadata may legitimately point at them while their engine is rebuilt.
    const catalogSlugs = new Set(topics.map((topic) => topic.slug));

    for (const topic of topics) {
      const meta = getTopicMeta(topic.slug, topic.domain, topic.name);
      for (const slug of [...meta.prerequisites, ...meta.related]) {
        expect(catalogSlugs.has(slug), `${topic.slug} references unknown topic ${slug}`).toBe(true);
      }
    }
  });
});
