import React from 'react';
import EngineMount from './EngineMount';
import { topics } from '@/components/visualizers/solidityviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    { slug: ['about'] },
  ];

  // Derived from the authored topic data. The previous hand-written list named
  // 12 ids — intro-solidity, types-variables, functions-visibility,
  // storage-layout, memory-calldata, control-flow, events-logging,
  // errors-reverts, inheritance-interfaces, modifiers, security-patterns,
  // assembly-yul — of which only `storage-layout` and `memory-calldata` exist in
  // `topics`. The other ten routes therefore rendered "Topic not found", and 22
  // of the 24 real topics (solidity-basics, reentrancy, gas-optimization, …)
  // were never generated at all. This is the same defect class as `gitcosmos`
  // and `webprotocols`.
  topics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
    params.push({ slug: ['concepts', topic.id] });
    params.push({ slug: ['topic', topic.id] });
    params.push({ slug: [topic.id] });
  });

  return params;
}

export default async function SolidityvizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
