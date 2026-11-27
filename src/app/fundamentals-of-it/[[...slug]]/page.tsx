import React from 'react';
import type { Metadata } from 'next';
import EngineMount from './EngineMount';
import { getITChapter, itChapters } from '@/components/visualizers/fundamentalsviz/data/curriculum';
import { getITProblem, itProblems } from '@/components/visualizers/fundamentalsviz/data/problems';

const CANONICAL_BASE = '/corecs/fundamentals-of-it';

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['learn'] },
    ...itChapters.map((chapter) => ({ slug: ['learn', chapter.id] })),
    { slug: ['lab'] },
    { slug: ['problems'] },
    ...itProblems.map((problem) => ({ slug: ['problems', problem.id] })),
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

  let title = 'IT Fundamentals (Computer Organization, Boolean Algebra, MS Office) - CSCosmos';
  let description =
    'A focused IT fundamentals curriculum: computer organization, memory and storage, number systems, Boolean algebra, 8086 microprocessors, software, and MS Office.';
  let suffix = '';

  if (first === 'learn' && second) {
    const chapter = getITChapter(second);
    if (chapter) {
      title = `${chapter.title} | IT Fundamentals - CSCosmos`;
      description = `${chapter.summary} Topic ${chapter.number} of IT Fundamentals.`;
      suffix = `/learn/${chapter.id}`;
    }
  } else if (first === 'learn') {
    title = 'IT Fundamentals (7 Topics) - CSCosmos';
    description = 'All seven IT Fundamentals topics: computer organization, memory and storage, number systems, Boolean algebra, microprocessors, software, and MS Office.';
    suffix = '/learn';
  } else if (first === 'lab') {
    title = 'IT Fundamentals Tools - CSCosmos';
    description = 'Study the computer block diagram, convert between number systems, and test Boolean logic gates.';
    suffix = '/lab';
  } else if (first === 'problems' && second) {
    const problem = getITProblem(second);
    if (problem) {
      title = `${problem.title} | IT Fundamentals Practice - CSCosmos`;
      description = problem.prompt;
      suffix = `/problems/${problem.id}`;
    }
  } else if (first === 'problems') {
    title = 'IT Fundamentals Practice (140 Questions) - CSCosmos';
    description = 'One hundred and forty questions covering computer organization, memory, number systems, Boolean algebra, microprocessors, software, and MS Office.';
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

export default async function FundamentalsOfITPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <EngineMount slug={slug || []} />;
}
