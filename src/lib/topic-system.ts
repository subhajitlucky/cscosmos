import React from 'react';

export interface TopicSubtopicRef {
  id: string;
  number: number;
  title: string;
  category?: string;
}

export interface TopicModule {
  id: string; // Slug e.g. 'ai-engineering-foundations'
  title: string;
  domain: string; // e.g. 'ai', 'fullstack', 'security'
  subtopics: TopicSubtopicRef[];
  HomePage: React.ComponentType<{ basePath?: string }>;
  TopicPage: React.ComponentType<{ topicId: string; basePath?: string }>;
  LabPage: React.ComponentType<{ basePath?: string }>;
  ProblemsPage: React.ComponentType<{ basePath?: string }>;
}
