import React from 'react';
import EngineMount from './EngineMount';
import { TOPICS } from '@/components/visualizers/stringalgoviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    { slug: ['about'] },
  ];

  // Derived from the authored topic data (25 topics -> 100 concept params, plus
  // the 6 section routes above). The previous hand-written list named 8 ids —
  // naive-search, kmp-algorithm, rabin-karp, z-algorithm, boyer-moore,
  // trie-structures, suffix-array, aho-corasick — of which only 5 exist in
  // `TOPICS`: `naive-search`, `trie-structures` and `suffix-array` are spelled
  // `naive-matching`, `trie-search` and `suffix-arrays` there. Those three routes
  // pre-rendered as an empty 87-byte `<div>` (TopicDetail bounces them to /learn
  // with `<Navigate>`), and the other 20 authored topics were never generated at
  // all. Same defect class as the gitcosmos concept list.
  TOPICS.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
    params.push({ slug: ['concepts', topic.id] });
    params.push({ slug: ['topic', topic.id] });
    params.push({ slug: [topic.id] });
  });

  return params;
}

export default async function StringalgovizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
