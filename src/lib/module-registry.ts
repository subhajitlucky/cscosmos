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

import { CONCEPTS } from '@/components/visualizers/networkcosmos/data/concepts';
import { NetworkHome } from '@/components/visualizers/networkcosmos/pages/NetworkHome';
import { NetworkLearn } from '@/components/visualizers/networkcosmos/pages/NetworkLearn';
import { NetworkTopic } from '@/components/visualizers/networkcosmos/pages/NetworkTopic';
import { NetworkLab } from '@/components/visualizers/networkcosmos/pages/NetworkLab';
import { NetworkProblems } from '@/components/visualizers/networkcosmos/pages/NetworkProblems';

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

// Topic: Computer Networks Internals (TCP/IP)
registerModule({
  topicSlug: 'computer-networks-internals-tcpip',
  title: 'Computer Networks Internals (TCP/IP)',
  domain: 'corecs',
  subtopics: CONCEPTS.map((c) => ({
    slug: c.slug,
    number: c.number,
    title: c.title,
    category: c.phase,
  })),
  HomePage: NetworkHome,
  LearnPage: NetworkLearn,
  TopicPage: NetworkTopic,
  LabPage: NetworkLab,
  ProblemsPage: NetworkProblems,
});
