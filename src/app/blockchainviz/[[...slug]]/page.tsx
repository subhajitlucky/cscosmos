import React, { Suspense } from 'react';
import RouteClientShell from './RouteClientShell';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
  ];

  const topicIds = [
    'what-is-blockchain',
    'distributed-ledger',
    'transactions',
    'blocks',
    'block-headers',
    'block-body',
    'hash-linking',
    'genesis-block',
    'merkle-trees',
    'immutability',
    'forks',
  ];

  topicIds.forEach((id: string) => {
    params.push({ slug: ['concepts', id] });
    params.push({ slug: [id] });
  });

  return params;
}

export default async function BlockchainVizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return (
    <Suspense fallback={null}>
      <RouteClientShell slug={resolved?.slug || []} />
    </Suspense>
  );
}
