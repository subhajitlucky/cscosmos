import React, { Suspense } from 'react';
import EngineMount from './EngineMount';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
  ];

  // Checked against the engine's own data: all nine ids below exist as keys of
  // `topicData` in components/visualizers/merkletreeviz/pages/TopicPage.tsx and in
  // that file's `topics` array, so `TopicPage` never falls back to its default
  // chapter and every concept is pre-rendered. (This is the check that caught a
  // real mismatch in stringalgoviz and gitcosmos; here the hand-written list is
  // already in sync.)
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

  // `new Date()` inside a client component runs on the server (build/request
  // clock) and again in the browser (visitor clock), which is a hydration
  // mismatch whenever the two disagree. Compute it once here, in the server
  // component, and serialise it into the RSC payload: the pre-rendered HTML and
  // the hydrating client both receive this exact number.
  const year = new Date().getFullYear();

  return (
    <Suspense fallback={null}>
      <EngineMount slug={resolved?.slug || []} year={year} />
    </Suspense>
  );
}
