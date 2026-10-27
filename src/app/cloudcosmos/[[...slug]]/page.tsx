import React from 'react';
import EngineMount from './EngineMount';
import { concepts } from '@/components/visualizers/cloudcosmos/data/concepts';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    
  ];

  // Derived from the authored concept data — the same lookup ConceptDetailPage
  // uses (`concepts.find(c => c.id === id)`). The previous hand-written list
  // named 8 ids, 6 of which — regions-zones, compute-autoscaling, vpc-subnets,
  // caching-cdn, database-replication, serverless-edge — exist nowhere in
  // `concepts` (which holds 29 ids such as `cloud-computing`, `regions-azs`,
  // `subnets`). Every one of those routes therefore rendered "Concept not
  // found", while 27 of the 29 real concepts (all but `load-balancers` and
  // `disaster-recovery`) were never generated at all. Same defect class as the
  // `gitcosmos` and `webprotocols` routes.
  concepts.forEach((concept) => {
    params.push({ slug: ['learn', concept.id] });
    params.push({ slug: ['concepts', concept.id] });
    params.push({ slug: ['topic', concept.id] });
    params.push({ slug: [concept.id] });
  });

  return params;
}

export default async function CloudcosmosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
