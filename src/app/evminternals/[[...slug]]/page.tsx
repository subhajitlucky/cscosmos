import React from 'react';
import EngineMount from './EngineMount';
import { TOPICS } from '@/components/visualizers/evminternals/lib/evm/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },

  ];

  // Derived from the authored lesson data. The previous hand-written list named
  // 8 ids — what-is-evm, stack-machine, memory-model, storage-trie, calldata,
  // opcodes, gas-system, execution-flow — of which only `opcodes` exists in
  // `TOPICS`. The other seven routes rendered "Topic not found", and 10 of the
  // 11 real lessons (intro, execution-env, stack, memory, storage,
  // storage-layout, control-flow, gas, calls, reverts) were never generated at
  // all. This is the same defect class as `gitcosmos` and `webprotocols`.
  TOPICS.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
    params.push({ slug: ['concepts', topic.id] });
    params.push({ slug: ['topic', topic.id] });
    params.push({ slug: [topic.id] });
  });

  return params;
}

export default async function EvminternalsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
