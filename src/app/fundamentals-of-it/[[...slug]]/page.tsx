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

  let title = 'Fundamentals of IT - CSCosmos';
  let description =
    'A visual introduction to information technology: hardware, data, software, networks, security, and the business systems they enable.';
  let suffix = '';

  if (first === 'learn' && second) {
    const chapter = getITChapter(second);
    if (chapter) {
      title = `${chapter.title} | IT Atlas - CSCosmos`;
      description = `${chapter.summary} Chapter ${chapter.number} of Fundamentals of IT.`;
      suffix = `/learn/${chapter.id}`;
    }
  } else if (first === 'learn') {
    title = 'Fundamentals of IT (24 Chapters) - CSCosmos';
    description = 'All 24 chapters of Fundamentals of IT: the machine, data representation, software, networks, security, and IT in practice.';
    suffix = '/learn';
  } else if (first === 'lab') {
    title = 'Fundamentals of IT Labs - CSCosmos';
    description = 'Build a computer, flip a byte, and trace a web request through the IT stack.';
    suffix = '/lab';
  } else if (first === 'problems' && second) {
    const problem = getITProblem(second);
    if (problem) {
      title = `${problem.title} | Fundamentals of IT Practice - CSCosmos`;
      description = problem.prompt;
      suffix = `/problems/${problem.id}`;
    }
  } else if (first === 'problems') {
    title = 'Fundamentals of IT Question Bank - CSCosmos';
    description = 'Five hundred IT literacy questions covering hardware, data, software, networks, security, and business systems.';
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
