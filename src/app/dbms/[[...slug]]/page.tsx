import React from 'react';
import type { Metadata } from 'next';
import EngineMount from './EngineMount';
import { dbmsChapters, getDBMSChapter } from '@/components/visualizers/dbmsviz/data/curriculum';
import { dbmsProblems, getDBMSProblem } from '@/components/visualizers/dbmsviz/data/problems';

const CANONICAL_BASE = '/corecs/dbms';

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['learn'] },
    ...dbmsChapters.map((chapter) => ({ slug: ['learn', chapter.id] })),
    { slug: ['lab'] },
    { slug: ['problems'] },
    ...dbmsProblems.map((problem) => ({ slug: ['problems', problem.id] })),
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

  let title = 'DBMS Foundations (ERD, Normalization, Transactions) - CSCosmos';
  let description =
    'A visual database curriculum covering DBMS architecture, ER modeling, relational algebra, keys, normalization, transactions, recovery, concurrency, distributed databases, and analytics.';
  let suffix = '';

  if (first === 'learn' && second) {
    const chapter = getDBMSChapter(second);
    if (chapter) {
      title = `${chapter.title} | DB // Cosmos - CSCosmos`;
      description = `${chapter.summary} Lesson ${chapter.number} of the DBMS curriculum.`;
      suffix = `/learn/${chapter.id}`;
    }
  } else if (first === 'learn') {
    title = 'DBMS Curriculum (32 Lessons) - CSCosmos';
    description = 'All 32 lessons of the DBMS curriculum, with worked examples, common traps, and quick checks.';
    suffix = '/learn';
  } else if (first === 'lab') {
    title = 'DBMS ERD, Algebra & Normalization Labs - CSCosmos';
    description = 'Interactive DBMS workbench: map ERD cardinality to tables, apply relational algebra, and step through 1NF, 2NF, and 3NF.';
    suffix = '/lab';
  } else if (first === 'problems' && second) {
    const problem = getDBMSProblem(second);
    if (problem) {
      title = `${problem.title} | DBMS Practice - CSCosmos`;
      description = problem.prompt;
      suffix = `/problems/${problem.id}`;
    }
  } else if (first === 'problems') {
    title = 'DBMS Practice Drills - CSCosmos';
    description = 'Modeling, relational algebra, normalization, transactions, concurrency, and analytics drills.';
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

export default async function DBMSPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <EngineMount slug={slug || []} />;
}
