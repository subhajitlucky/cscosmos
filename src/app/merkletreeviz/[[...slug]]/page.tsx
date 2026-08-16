import React, { Suspense } from 'react';
import RouteClientShell from './RouteClientShell';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
  ];

  const topicIds = ["why-integrity","hashing-recap","leaf-nodes","internal-nodes","merkle-root","binary-tree-structure","merkle-proofs","efficiency","blockchains"];
  topicIds.forEach((id: string) => {
    params.push({ slug: ['learn', id] });
    params.push({ slug: ['concepts', id] });
    params.push({ slug: ['topic', id] });
    params.push({ slug: [id] });
  });

  return params;
}

export default async function MerkletreevizPage({
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
