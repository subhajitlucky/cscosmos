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

  const topicIds = ["intro","radix-trie","node-types","hex-nibbles","hp-encoding","state-trie","storage-trie","proofs"];
  topicIds.forEach((id: string) => {
    params.push({ slug: ['learn', id] });
    params.push({ slug: ['concepts', id] });
    params.push({ slug: ['topic', id] });
    params.push({ slug: [id] });
  });

  return params;
}

export default async function PatriciatriePage({
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
