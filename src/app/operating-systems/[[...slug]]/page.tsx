import React from 'react';
import type { Metadata } from 'next';
import EngineMount from './EngineMount';
import { osChapters, getOSChapter } from '@/components/visualizers/osviz/data/curriculum';
import { osProblems, getOSProblem } from '@/components/visualizers/osviz/data/problems';

const CANONICAL_BASE = '/corecs/operating-systems';

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['learn'] },
    ...osChapters.map((chapter) => ({ slug: ['learn', chapter.id] })),
    { slug: ['lab'] },
    { slug: ['problems'] },
    ...osProblems.map((problem) => ({ slug: ['problems', problem.id] })),
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

  let title = 'Operating Systems (Processes, Memory, Files) - CSCosmos';
  let description =
    'A visual operating systems curriculum covering processes, CPU scheduling, context switching, memory, virtual memory, I/O, DMA, file systems, addressing, and OS families.';
  let suffix = '';

  if (first === 'learn' && second) {
    const chapter = getOSChapter(second);
    if (chapter) {
      title = `${chapter.title} | OS // Cosmos - CSCosmos`;
      description = `${chapter.summary} Lesson ${chapter.number} of the Operating Systems curriculum.`;
      suffix = `/learn/${chapter.id}`;
    }
  } else if (first === 'learn') {
    title = 'Operating Systems Curriculum (12 Lessons) - CSCosmos';
    description = 'All 12 lessons of the Operating Systems curriculum, with worked examples, common traps, and quick checks.';
    suffix = '/learn';
  } else if (first === 'lab') {
    title = 'Operating Systems Scheduler, Paging & File Labs - CSCosmos';
    description = 'Interactive OS workbench: compare CPU scheduling policies, translate virtual addresses through a page table, and walk FAT and indexed file allocation.';
    suffix = '/lab';
  } else if (first === 'problems' && second) {
    const problem = getOSProblem(second);
    if (problem) {
      title = `${problem.title} | OS Practice - CSCosmos`;
      description = problem.prompt;
      suffix = `/problems/${problem.id}`;
    }
  } else if (first === 'problems') {
    title = 'Operating Systems Practice Drills - CSCosmos';
    description = 'Scheduling, address translation, page replacement, I/O, and file-system drills for the Operating Systems curriculum.';
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

export default async function OperatingSystemsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <EngineMount slug={slug || []} />;
}
