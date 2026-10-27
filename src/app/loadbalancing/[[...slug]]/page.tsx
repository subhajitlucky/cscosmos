import React from 'react';
import EngineMount from './EngineMount';
import { concepts } from '@/components/visualizers/loadbalancing/data/concepts';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    
  ];

  // Derived from the authored concept data — these are exactly the `slug`s
  // ConceptDetail resolves via `concepts.findIndex(c => c.slug === slug)`. The
  // previous hand-written list named 8 ids — round-robin,
  // weighted-round-robin, least-connections, least-response-time, ip-hash,
  // consistent-hashing, health-checks, layer4-vs-layer7 — and two of them do
  // not exist in `concepts`: `ip-hash` is an LBAlgorithm id (from the Lab), and
  // `layer4-vs-layer7` conflates the two real concepts `layer-4` and `layer-7`.
  // Those 8 params rendered a shell that only redirects to /concepts once
  // client JS loads, while 19 of the 25 real concepts (what-is-load-balancing,
  // why-needed, client-vs-server-side, reverse-proxy, layer-4, layer-7,
  // hash-based, …) were never generated at all. Same defect class as
  // `gitcosmos`.
  concepts.forEach((concept) => {
    params.push({ slug: ['learn', concept.slug] });
    params.push({ slug: ['concepts', concept.slug] });
    params.push({ slug: ['topic', concept.slug] });
    params.push({ slug: [concept.slug] });
  });

  return params;
}

export default async function LoadbalancingPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
