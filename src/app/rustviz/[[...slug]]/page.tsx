import React from 'react';
import RustVizClientPage from './RustVizClientPage';
import { rustConcepts } from '@/components/visualizers/rustviz/data/concepts';

export function generateStaticParams() {
  const conceptRoutes = rustConcepts.map((concept) => ({
    slug: ['concepts', concept.slug],
  }));

  return [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['ownership-lab'] },
    { slug: ['borrow-checker'] },
    { slug: ['lifetimes-lab'] },
    { slug: ['smart-pointers'] },
    { slug: ['concurrency-lab'] },
    { slug: ['pitfalls'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
    ...conceptRoutes,
  ];
}

export default async function RustVizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  return <RustVizClientPage slug={slug} />;
}
