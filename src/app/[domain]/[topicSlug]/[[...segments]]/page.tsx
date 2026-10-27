import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/components/visualizers/aicosmos/styles.css';
import { getModule, getAllModules } from '@/lib/module-registry';
import { topics } from '@/data/topics';
import { engineRoutes } from '@/data/engine-routes';
import type { DomainKey } from '@/data/domains';
import { TopicInDevelopment } from '@/components/TopicInDevelopment';
import { TopicActionBar } from '@/components/learning/TopicActionBar';
import { TopicNotes } from '@/components/learning/TopicNotes';
import { RelatedTopics } from '@/components/learning/RelatedTopics';
import { TopicComments } from '@/components/learning/TopicComments';

export function generateStaticParams() {
  const modules = getAllModules();
  const engineTopicSlugs = new Set(engineRoutes.map((route) => route.topicSlug));
  const params: { domain: string; topicSlug: string; segments: string[] }[] = [];

  // 1. Pre-render all views and subtopics for registered curriculum modules.
  for (const registeredModule of modules) {
    params.push({ domain: registeredModule.domain, topicSlug: registeredModule.topicSlug, segments: [] });
    params.push({ domain: registeredModule.domain, topicSlug: registeredModule.topicSlug, segments: ['learn'] });
    params.push({ domain: registeredModule.domain, topicSlug: registeredModule.topicSlug, segments: ['lab'] });
    params.push({ domain: registeredModule.domain, topicSlug: registeredModule.topicSlug, segments: ['problems'] });

    for (const subtopic of registeredModule.subtopics) {
      params.push({
        domain: registeredModule.domain,
        topicSlug: registeredModule.topicSlug,
        segments: ['learn', subtopic.slug],
      });
    }
  }

  // 2. Pre-render landing pages for catalog topics that are in development.
  // Engine-backed topics are served by their top-level engine routes instead.
  for (const topic of topics) {
    const isRegistered = modules.some(
      (registeredModule) => registeredModule.topicSlug === topic.slug && registeredModule.domain === topic.domain,
    );
    const isEngineBacked = engineTopicSlugs.has(topic.slug);
    if (!isRegistered && !isEngineBacked) {
      params.push({ domain: topic.domain, topicSlug: topic.slug, segments: [] });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; topicSlug: string; segments?: string[] }>;
}): Promise<Metadata> {
  const { domain, topicSlug, segments } = await params;
  const topicModule = getModule(topicSlug);

  if (topicModule && topicModule.domain === domain) {
    const view = segments && segments.length > 0 ? segments[0] : '';
    const subtopicSlug = segments && segments.length > 1 ? segments[1] : '';

    if (view === 'learn') {
      if (subtopicSlug) {
        const subtopic = topicModule.subtopics.find((item) => item.slug === subtopicSlug);
        return {
          title: `${subtopic ? subtopic.title : subtopicSlug} | ${topicModule.title} - CSCosmos`,
          description: `In-depth interactive deep dive for ${subtopic?.title || subtopicSlug} in ${topicModule.title}.`,
        };
      }
      if (topicModule.LearnPage) {
        return {
          title: `Curriculum & Topics Index | ${topicModule.title} - CSCosmos`,
          description: `Complete syllabus, topic directory, and interactive visualizers for ${topicModule.title}.`,
        };
      }
    }

    if (view === 'lab') {
      return {
        title: `Interactive Lab Studio | ${topicModule.title} - CSCosmos`,
        description: `Hands-on simulation workbench and interactive execution studio for ${topicModule.title}.`,
      };
    }

    if (view === 'problems') {
      return {
        title: `Certification Arena | ${topicModule.title} - CSCosmos`,
        description: `Knowledge checks and certification scenario challenges for ${topicModule.title}.`,
      };
    }

    return {
      title: `${topicModule.title} - CSCosmos`,
      description: `Complete curriculum and interactive visualizers for ${topicModule.title}.`,
    };
  }

  const catalogTopic = topics.find(
    (topic) =>
      topic.slug === topicSlug &&
      (topic.domain === domain || topic.crossListedDomains?.includes(domain as DomainKey)),
  );

  if (catalogTopic) {
    return {
      title: `${catalogTopic.name} - CSCosmos`,
      description: `${catalogTopic.shortDescription} Interactive visualizer workbench and comprehensive curriculum coming soon on CSCosmos.`,
    };
  }

  return { title: 'Topic Not Found - CSCosmos' };
}

export default async function UniversalTopicPage({
  params,
}: {
  params: Promise<{ domain: string; topicSlug: string; segments?: string[] }>;
}) {
  const { domain, topicSlug, segments } = await params;
  const topicModule = getModule(topicSlug);
  const basePath = `/${domain}/${topicSlug}`;

  const catalogTopic = topics.find(
    (topic) =>
      topic.slug === topicSlug &&
      (topic.domain === domain || topic.crossListedDomains?.includes(domain as DomainKey)),
  );
  const moduleTopic = topicModule ? topics.find((topic) => topic.slug === topicModule.topicSlug) : undefined;
  const learningTopic = catalogTopic ?? moduleTopic;
  const learningSlug = learningTopic?.slug ?? topicSlug;
  const learningName = learningTopic?.name ?? topicModule?.title ?? topicSlug;
  const learningDomain = learningTopic?.domain ?? (domain as DomainKey);

  if (topicModule && topicModule.domain === domain) {
    const view = segments && segments.length > 0 ? segments[0] : '';
    const subtopicSlug = segments && segments.length > 1 ? segments[1] : '';

    let pageContent = <topicModule.HomePage basePath={basePath} />;

    if (view === 'learn') {
      if (subtopicSlug) {
        pageContent = <topicModule.TopicPage subtopicSlug={subtopicSlug} basePath={basePath} />;
      } else {
        pageContent = topicModule.LearnPage ? (
          <topicModule.LearnPage basePath={basePath} />
        ) : (
          <topicModule.HomePage basePath={basePath} />
        );
      }
    } else if (view === 'lab') {
      pageContent = <topicModule.LabPage basePath={basePath} />;
    } else if (view === 'problems') {
      pageContent = <topicModule.ProblemsPage basePath={basePath} />;
    } else if (view !== '') {
      notFound();
    }

    return (
      <div className="aicosmos-root min-h-screen">
        <div className="page-container space-y-2 pt-6">
          <TopicActionBar slug={learningSlug} name={learningName} domain={learningDomain} />
          <TopicNotes slug={learningSlug} name={learningName} domain={learningDomain} />
          <RelatedTopics slug={learningSlug} domain={learningDomain} />
          <TopicComments slug={learningSlug} />
        </div>
        <Suspense
          fallback={
            <div className="p-12 text-center font-mono text-xs text-muted-foreground">
              Loading {topicModule.title}...
            </div>
          }
        >
          {pageContent}
        </Suspense>
      </div>
    );
  }

  if (catalogTopic) {
    const activeDomainTopics = topics.filter(
      (topic) =>
        (topic.domain === domain || topic.crossListedDomains?.includes(domain as DomainKey)) &&
        topic.status === 'active' &&
        topic.slug !== topicSlug,
    );

    const view = segments && segments.length > 0 ? segments[0] : undefined;

    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-2">
          <TopicActionBar slug={learningSlug} name={learningName} domain={learningDomain} />
          <TopicNotes slug={learningSlug} name={learningName} domain={learningDomain} />
          <RelatedTopics slug={learningSlug} domain={learningDomain} />
          <TopicComments slug={learningSlug} />
        </div>
        <TopicInDevelopment
          topic={catalogTopic}
          viewName={view}
          activeTopics={activeDomainTopics}
        />
      </div>
    );
  }

  notFound();
}
