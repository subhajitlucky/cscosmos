import React from 'react';
import EngineMount from './EngineMount';
import { topicContent } from '@/components/visualizers/consensusviz/data/content';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    
  ];

  // Derived from the authored topic map — these are exactly the keys
  // `pages/TopicPage.tsx` resolves via `topicContent[topicId]`. The previous
  // hand-written list named 8 ids — pow, pos, dpos, poa, pbft, raft, nakamoto,
  // byzantine — none of which exists in `topicContent`. All 32 topic params
  // (plus the 5 base routes = the 37 routes this engine had) therefore rendered
  // "not found" or an empty page, and none of the 13 real topics
  // (why-consensus, trustless-networks, pow-overview, pow-mining,
  // difficulty-adjustment, longest-chain, forks-reorgs, pos-overview,
  // pos-staking, block-proposers, finality, slashing, consensus-comparison) was
  // ever generated at all. Same defect class as `gitcosmos` / `patriciatrie`.
  Object.keys(topicContent).forEach((id: string) => {
    params.push({ slug: ['learn', id] });
    params.push({ slug: ['concepts', id] });
    params.push({ slug: ['topic', id] });
    params.push({ slug: [id] });
  });

  return params;
}

export default async function ConsensusvizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
