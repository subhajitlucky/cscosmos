import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/components/visualizers/aicosmos/styles.css';
import { getTopicModule, getAllTopicModules } from '@/lib/topic-registry';
import { topics } from '@/data/topics';
import type { DomainKey } from '@/data/domains';
import { TopicInDevelopment } from '@/components/TopicInDevelopment';

export function generateStaticParams() {
  const modules = getAllTopicModules();
  const params: { domain: string; topic: string; slug: string[] }[] = [];

  // 1. Pre-render all views and subtopics for active registered modules
  for (const m of modules) {
    params.push({ domain: m.domain, topic: m.id, slug: [] });
    params.push({ domain: m.domain, topic: m.id, slug: ['learn'] });
    params.push({ domain: m.domain, topic: m.id, slug: ['lab'] });
    params.push({ domain: m.domain, topic: m.id, slug: ['problems'] });

    for (const sub of m.subtopics) {
      params.push({ domain: m.domain, topic: m.id, slug: ['learn', sub.id] });
    }
  }

  // 2. Pre-render landing pages for all catalog topics across domains to prevent 404s
  for (const t of topics) {
    const isRegistered = modules.some((m) => m.id === t.slug && m.domain === t.domain);
    if (!isRegistered) {
      params.push({ domain: t.domain, topic: t.slug, slug: [] });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; topic: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { domain, topic, slug } = await params;
  const mod = getTopicModule(topic);

  if (mod && mod.domain === domain) {
    const view = slug && slug.length > 0 ? slug[0] : 'learn';
    const subtopicId = slug && slug.length > 1 ? slug[1] : '';

    if (view === 'learn' && subtopicId) {
      const sub = mod.subtopics.find((s) => s.id === subtopicId);
      return {
        title: `${sub ? sub.title : subtopicId} | ${mod.title} - CSCosmos`,
        description: `In-depth interactive deep dive for ${sub?.title || subtopicId} in ${mod.title}.`,
      };
    }

    if (view === 'lab') {
      return {
        title: `Interactive Lab Studio | ${mod.title} - CSCosmos`,
        description: `Hands-on simulation workbench and interactive execution studio for ${mod.title}.`,
      };
    }

    if (view === 'problems') {
      return {
        title: `Certification Arena | ${mod.title} - CSCosmos`,
        description: `Knowledge checks and certification scenario challenges for ${mod.title}.`,
      };
    }

    return {
      title: `${mod.title} - CSCosmos`,
      description: `Complete curriculum and interactive visualizers for ${mod.title}.`,
    };
  }

  const catalogTopic = topics.find(
    (t) => t.slug === topic && (t.domain === domain || t.aliases?.includes(domain as DomainKey))
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
  params: Promise<{ domain: string; topic: string; slug?: string[] }>;
}) {
  const { domain, topic, slug } = await params;
  const mod = getTopicModule(topic);
  const basePath = `/${domain}/${topic}`;

  if (mod && mod.domain === domain) {
    const first = slug && slug.length > 0 ? slug[0] : '';
    const second = slug && slug.length > 1 ? slug[1] : '';

    let pageContent = <mod.HomePage basePath={basePath} />;

    if (first === 'learn') {
      if (second) {
        pageContent = <mod.TopicPage topicId={second} basePath={basePath} />;
      } else {
        pageContent = <mod.HomePage basePath={basePath} />;
      }
    } else if (first === 'lab') {
      pageContent = <mod.LabPage basePath={basePath} />;
    } else if (first === 'problems') {
      pageContent = <mod.ProblemsPage basePath={basePath} />;
    } else if (first !== '') {
      notFound();
    }

    return (
      <div className="aicosmos-root min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="p-12 text-center font-mono text-xs text-[var(--ai-muted)]">
              Loading {mod.title}...
            </div>
          }
        >
          {pageContent}
        </Suspense>
      </div>
    );
  }

  const catalogTopic = topics.find(
    (t) => t.slug === topic && (t.domain === domain || t.aliases?.includes(domain as DomainKey))
  );

  if (catalogTopic) {
    const activeDomainTopics = topics.filter(
      (t) =>
        (t.domain === domain || t.aliases?.includes(domain as DomainKey)) &&
        t.status === 'active' &&
        t.slug !== topic
    );

    const first = slug && slug.length > 0 ? slug[0] : undefined;

    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <TopicInDevelopment
          topic={catalogTopic}
          viewName={first}
          activeTopics={activeDomainTopics}
        />
      </div>
    );
  }

  notFound();
}
