import type { TopicModule } from './topic-system';

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

const modules: Map<string, TopicModule> = new Map();

export function registerTopicModule(module: TopicModule) {
  modules.set(module.id, module);
}

export function getTopicModule(id: string): TopicModule | undefined {
  return modules.get(id);
}

export function getAllTopicModules(): TopicModule[] {
  return Array.from(modules.values());
}

export function isRegisteredTopic(id: string): boolean {
  return modules.has(id);
}

// ---------------------------------------------------------------------------
// INITIALIZE REGISTERED TOPICS
// ---------------------------------------------------------------------------

// Subject 01: AI Engineering Foundations
registerTopicModule({
  id: 'ai-engineering-foundations',
  title: 'AI Engineering Foundations',
  domain: 'ai',
  subtopics: foundationSubtopics.map((t) => ({
    id: t.id,
    number: t.number,
    title: t.title,
    category: t.category,
  })),
  HomePage: FoundationHome,
  LearnPage: FoundationLearn,
  TopicPage: FoundationTopic,
  LabPage: FoundationLab,
  ProblemsPage: FoundationProblems,
});

// Subject 02: Python for AI Engineering
registerTopicModule({
  id: 'python-for-ai-engineering',
  title: 'Python for AI Engineering',
  domain: 'ai',
  subtopics: pythonAiSubtopics.map((t) => ({
    id: t.id,
    number: t.number,
    title: t.title,
    category: t.category,
  })),
  HomePage: PythonAiHome,
  TopicPage: PythonAiTopic,
  LabPage: PythonAiLab,
  ProblemsPage: PythonAiProblems,
});
