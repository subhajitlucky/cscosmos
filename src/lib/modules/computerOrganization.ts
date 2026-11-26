import type { TopicModule } from '@/lib/topic-module';
import { computerOrganizationChapters } from '@/components/visualizers/computerorganization/data/chapters';
import { ComputerOrganizationHome } from '@/components/visualizers/computerorganization/pages/Home';
import { ComputerOrganizationLearn } from '@/components/visualizers/computerorganization/pages/Learn';
import { ComputerOrganizationTopic } from '@/components/visualizers/computerorganization/pages/Topic';
import { ComputerOrganizationLab } from '@/components/visualizers/computerorganization/pages/Lab';
import { ComputerOrganizationProblems } from '@/components/visualizers/computerorganization/pages/Problems';

export const computerOrganizationModule: TopicModule = {
  topicSlug: 'computer-organization',
  title: 'Computer Organization & Block Diagram',
  domain: 'corecs',
  subtopics: computerOrganizationChapters.map((c) => ({
    slug: c.id,
    number: c.number,
    title: c.title,
    category: c.category,
  })),
  HomePage: ComputerOrganizationHome,
  LearnPage: ComputerOrganizationLearn,
  TopicPage: ComputerOrganizationTopic,
  LabPage: ComputerOrganizationLab,
  ProblemsPage: ComputerOrganizationProblems,
};
