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

  it("only references real active topics in prerequisites and related topics", () => {
    const activeSlugs = new Set(
      topics.filter((topic) => topic.status === "active").map((topic) => topic.slug),
    );

    for (const topic of topics) {
      const meta = getTopicMeta(topic.slug, topic.domain, topic.name);
      for (const slug of [...meta.prerequisites, ...meta.related]) {
        expect(activeSlugs.has(slug), `${topic.slug} references unknown topic ${slug}`).toBe(true);
      }
    }
  });
});
