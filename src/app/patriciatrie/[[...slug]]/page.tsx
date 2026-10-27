import React, { Suspense } from 'react';
import EngineMount from './EngineMount';
import { topicData } from '@/components/visualizers/patriciatrie/utils/topicContent';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
  ];

  // Derived from the authored topic map — these are exactly the keys TopicPage
  // resolves via `topicData[topicId]`. The previous hand-written list named 8
  // ids — intro, radix-trie, node-types, hex-nibbles, hp-encoding, state-trie,
  // storage-trie, proofs — of which only `node-types` exists in `topicData`.
  // The other seven (28 params) therefore rendered "Topic not found", and 9 of
  // the 10 real topics (why-trie, patricia-trie, trie-vs-map, nibble-paths,
  // path-compression, merkle-proofs, state-updates, rlp-encoding, state-root)
  // were never generated at all. This is the same defect class as `gitcosmos`.
  Object.keys(topicData).forEach((id: string) => {
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
      <EngineMount slug={resolved?.slug || []} />
    </Suspense>
  );
}
