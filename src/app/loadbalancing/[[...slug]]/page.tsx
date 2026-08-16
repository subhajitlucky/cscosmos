import React from 'react';
import RouteClientShell from './RouteClientShell';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    
  ];

  const topicIds = ["round-robin","weighted-round-robin","least-connections","least-response-time","ip-hash","consistent-hashing","health-checks","layer4-vs-layer7"];
  topicIds.forEach((id: string) => {
    params.push({ slug: ['learn', id] });
    params.push({ slug: ['concepts', id] });
    params.push({ slug: ['topic', id] });
    params.push({ slug: [id] });
  });

  return params;
}

export default async function LoadbalancingPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <RouteClientShell slug={resolved?.slug || []} />;
}
