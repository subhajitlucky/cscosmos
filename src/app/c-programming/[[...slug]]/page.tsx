import React from 'react';
import type { Metadata } from 'next';
import EngineMount from './EngineMount';
import { cChapters, getCChapter } from '@/components/visualizers/cviz/data/curriculum';
import { cProblems, getCProblem } from '@/components/visualizers/cviz/data/problems';

const CANONICAL_BASE = '/corecs/c-programming';

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['learn'] },
    ...cChapters.map((chapter) => ({ slug: ['learn', chapter.id] })),
    { slug: ['lab'] },
    { slug: ['problems'] },
    ...cProblems.map((problem) => ({ slug: ['problems', problem.id] })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const first = slug?.[0] || '';
  const second = slug?.[1] || '';

  let title = 'C Programming (Fundamentals, Pointers, Files) - CSCosmos';
  let description =
    'A visual C curriculum covering fundamentals, control flow, functions, arrays, pointers, structs, unions, file I/O, dynamic memory, and bitwise operators.';
  let suffix = '';

  if (first === 'learn' && second) {
    const chapter = getCChapter(second);
    if (chapter) {
      title = `${chapter.title} | C // Cosmos - CSCosmos`;
      description = `${chapter.summary} Chapter ${chapter.number} of the C Programming curriculum.`;
      suffix = `/learn/${chapter.id}`;
    }
  } else if (first === 'learn') {
    title = 'C Programming Curriculum (35 Lessons) - CSCosmos';
    description = 'All 35 lessons of the C Programming curriculum, with worked examples, common traps, and quick checks.';
    suffix = '/learn';
  } else if (first === 'lab') {
    title = 'C Pointer & Bitwise Lab - CSCosmos';
    description = 'Interactive C memory workbench: pointer chains, pointer arithmetic, array walking, and an 8-bit bitwise playground.';
    suffix = '/lab';
  } else if (first === 'problems' && second) {
    const problem = getCProblem(second);
    if (problem) {
      title = `${problem.title} | C Practice - CSCosmos`;
      description = problem.prompt;
      suffix = `/problems/${problem.id}`;
    }
  } else if (first === 'problems') {
    title = 'C Programming Practice Drills - CSCosmos';
    description = 'Output-prediction and concept drills for every chapter of the C Programming curriculum.';
    suffix = '/problems';
  }

  return {
    title,
    description,
    alternates: { canonical: `${CANONICAL_BASE}${suffix}` },
    openGraph: {
      title,
      description,
      url: `${CANONICAL_BASE}${suffix}`,
      siteName: 'CSCosmos',
      type: 'website',
    },
    twitter: { card: 'summary' },
  };
}

export default async function CProgrammingPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <EngineMount slug={slug || []} />;
}
