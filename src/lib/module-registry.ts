import type { TopicModule } from './topic-module';

import { foundationSubtopics } from '@/components/visualizers/aicosmos/data/foundations';
import { FoundationHome } from '@/components/visualizers/aicosmos/pages/FoundationHome';
import { FoundationLearn } from '@/components/visualizers/aicosmos/pages/FoundationLearn';
import { FoundationTopic } from '@/components/visualizers/aicosmos/pages/FoundationTopic';
import { FoundationLab } from '@/components/visualizers/aicosmos/pages/FoundationLab';
import { FoundationProblems } from '@/components/visualizers/aicosmos/pages/FoundationProblems';

import { pythonAiSubtopics } from '@/components/visualizers/aicosmos/data/python-ai';
import { PythonAiHome } from '@/components/visualizers/aicosmos/pages/PythonAiHome';
import { PythonAiTopic } from '@/components/visualizers/aicosmos/pages/PythonAiTopic';
import { PythonAiLab } from '@/components/visualizers/aicosmos/pages/PythonAiLab';
import { PythonAiProblems } from '@/components/visualizers/aicosmos/pages/PythonAiProblems';

const modules = new Map<string, TopicModule>();

export function registerModule(module: TopicModule): void {
  modules.set(module.topicSlug, module);
}

export function getModule(topicSlug: string): TopicModule | undefined {
  return modules.get(topicSlug);
}

export function getAllModules(): TopicModule[] {
  return Array.from(modules.values());
}

export function isRegisteredModule(topicSlug: string): boolean {
  return modules.has(topicSlug);
}

// ---------------------------------------------------------------------------
// Registered curriculum modules
// ---------------------------------------------------------------------------

// Topic: AI Engineering Foundations
registerModule({
  topicSlug: 'ai-engineering-foundations',
  title: 'AI Engineering Foundations',
  domain: 'ai',
  subtopics: foundationSubtopics.map((topic) => ({
    slug: topic.id,
    number: topic.number,
    title: topic.title,
    category: topic.category,
  })),
  HomePage: FoundationHome,
  LearnPage: FoundationLearn,
  TopicPage: FoundationTopic,
  LabPage: FoundationLab,
  ProblemsPage: FoundationProblems,
});

// Topic: Python for AI Engineering
registerModule({
  topicSlug: 'python-for-ai-engineering',
  title: 'Python for AI Engineering',
  domain: 'ai',
  subtopics: pythonAiSubtopics.map((topic) => ({
    slug: topic.id,
    number: topic.number,
    title: topic.title,
    category: topic.category,
  })),
  HomePage: PythonAiHome,
  TopicPage: PythonAiTopic,
  LabPage: PythonAiLab,
  ProblemsPage: PythonAiProblems,
});
