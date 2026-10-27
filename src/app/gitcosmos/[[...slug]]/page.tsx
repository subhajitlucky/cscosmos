import React from 'react';
import EngineMount from './EngineMount';
import { allConcepts } from '@/components/visualizers/gitcosmos/data/concepts';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
  ];

  // Derived from the authored concept data. The previous hand-written list named
  // 8 ids — git-architecture, commits-trees, branches-head, merge-rebase,
  // cherry-pick-revert, reset-checkout-restore, remote-tracking, stash-reflog —
  // none of which exist in `allConcepts` (which has 31 different ids such as
  // `version-control`, `repository`, `commit`). Every one of those routes
  // therefore rendered "Concept not found", and the 31 real concepts were never
  // generated at all. This is the same defect class as the `webprotocols` route.
  allConcepts.forEach((concept) => {
    params.push({ slug: ['learn', concept.id] });
    params.push({ slug: ['concepts', concept.id] });
    params.push({ slug: ['topic', concept.id] });
    params.push({ slug: [concept.id] });
  });

  return params;
}

export default async function GitcosmosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
