import React from 'react';
import EngineMount from './EngineMount';
import { TOPICS } from '@/components/visualizers/cryptviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
  ];

  // Derived from the authored topic data, using the same lookup `TopicPage` performs
  // (`TOPICS.findIndex(t => t.id === topicId)`). The previous hand-written list named the
  // same eight ids, so nothing was missing here, but a hardcoded copy can drift silently —
  // that is the defect behind FS-74 (five other engines shipped phantom ids).
  TOPICS.forEach((topic) => {
    const id = topic.id;
    params.push({ slug: ['learn', id] });
    params.push({ slug: ['concepts', id] });
    params.push({ slug: ['topic', id] });
    params.push({ slug: [id] });
  });

  return params;
}

export default async function CryptvizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
