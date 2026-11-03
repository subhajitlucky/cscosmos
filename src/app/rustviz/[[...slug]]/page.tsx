import React from 'react';
import EngineMount from './EngineMount';
import { rustConcepts } from '@/components/visualizers/rustviz/data/concepts';
import { rustProblems } from '@/components/visualizers/rustviz/data/problems';
import { rustInterviewQuestions } from '@/components/visualizers/rustviz/data/interview';

export function generateStaticParams() {
  const conceptRoutes = rustConcepts.map((concept) => ({
    slug: ['concepts', concept.slug],
  }));

  const problemRoutes = rustProblems.map((problem) => ({
    slug: ['problems', problem.slug],
  }));

  const interviewRoutes = rustInterviewQuestions.map((q) => ({
    slug: ['interview', q.slug],
  }));

  return [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['lab'] },
    { slug: ['problems'] },
    { slug: ['interview'] },
    { slug: ['ownership-lab'] },
    { slug: ['borrow-checker'] },
    { slug: ['lifetimes-lab'] },
    { slug: ['smart-pointers'] },
    { slug: ['concurrency-lab'] },
    { slug: ['pitfalls'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
    ...conceptRoutes,
    ...problemRoutes,
    ...interviewRoutes,
  ];
}

export default async function RustVizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  return <EngineMount slug={slug} />;
}
