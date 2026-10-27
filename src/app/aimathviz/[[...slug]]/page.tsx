import React from 'react';
import EngineMount from './EngineMount';
import { getAllTopics } from '@/components/visualizers/aimathviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    { slug: ['about'] },
  ];

  // Derived from the authored topic data. `getAllTopics()` flattens
  // `topicsData` exactly the way the engine's own lookup, `getTopicById(id)`,
  // scans it. The previous hand-written list named 8 ids, 7 of which —
  // linear-algebra, calculus-gradients, statistics-inference,
  // matrix-decomposition, vector-spaces, optimization-methods,
  // information-theory — exist nowhere in `topicsData` (which holds 30 ids such
  // as `scalars-vectors-matrices`, `dot-product`, `vector-norms`). Every one of
  // those routes therefore rendered "Topic not found", while 29 of the 30 real
  // topics (all but `probability-distributions`) were never generated at all.
  // Same defect class as the `gitcosmos` and `webprotocols` routes.
  getAllTopics().forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
    params.push({ slug: ['concepts', topic.id] });
    params.push({ slug: ['topic', topic.id] });
    params.push({ slug: [topic.id] });
  });

  return params;
}

export default async function AimathvizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
