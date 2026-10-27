import type React from 'react';
import type { DomainKey } from '@/data/domains';

export interface SubtopicRef {
  /** Stable slug for a section inside a curriculum module. */
  slug: string;
  number: number;
  title: string;
  category?: string;
}

/**
 * A curriculum module is a multi-view learning package for one topic.
 * Most topics are single-page engines; only registered modules use this contract.
 */
export interface TopicModule {
  /** Canonical catalog slug for the topic this module teaches. */
  topicSlug: string;
  title: string;
  domain: DomainKey;
  subtopics: SubtopicRef[];
  HomePage: React.ComponentType<{ basePath?: string }>;
  LearnPage?: React.ComponentType<{ basePath?: string }>;
  TopicPage: React.ComponentType<{ subtopicSlug: string; basePath?: string }>;
  LabPage: React.ComponentType<{ basePath?: string }>;
  ProblemsPage: React.ComponentType<{ basePath?: string }>;
}
