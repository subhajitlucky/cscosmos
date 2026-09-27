import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/components/visualizers/aicosmos/styles.css';
import { getTopicModule, getAllTopicModules } from '@/lib/topic-registry';

export function generateStaticParams() {
  const modules = getAllTopicModules();
  const params: { domain: string; topic: string; slug: string[] }[] = [];

  for (const m of modules) {
    // 1. Root / [domain] / [topic]
    params.push({ domain: m.domain, topic: m.id, slug: [] });
    // 2. / [domain] / [topic] / learn
    params.push({ domain: m.domain, topic: m.id, slug: ['learn'] });
    // 3. / [domain] / [topic] / lab
    params.push({ domain: m.domain, topic: m.id, slug: ['lab'] });
    // 4. / [domain] / [topic] / problems
    params.push({ domain: m.domain, topic: m.id, slug: ['problems'] });

    // 5. All subtopic deep dives: / [domain] / [topic] / learn / [subtopicId]
    for (const sub of m.subtopics) {
      params.push({ domain: m.domain, topic: m.id, slug: ['learn', sub.id] });
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

  if (!mod || mod.domain !== domain) {
    return { title: 'Topic Not Found - CSCosmos' };
  }

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

export default async function UniversalTopicPage({
  params,
}: {
  params: Promise<{ domain: string; topic: string; slug?: string[] }>;
}) {
  const { domain, topic, slug } = await params;
  const mod = getTopicModule(topic);

  if (!mod || mod.domain !== domain) {
    notFound();
  }

  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  let pageContent = <mod.HomePage />;

  if (first === 'learn') {
    if (second) {
      pageContent = <mod.TopicPage topicId={second} />;
    } else {
      pageContent = <mod.HomePage />;
    }
  } else if (first === 'lab') {
    pageContent = <mod.LabPage />;
  } else if (first === 'problems') {
    pageContent = <mod.ProblemsPage />;
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
