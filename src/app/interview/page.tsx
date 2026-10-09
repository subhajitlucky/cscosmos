import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Binary, Layers, Network, ShieldAlert } from 'lucide-react';
import { categories, getCategoryFacets } from '@/data/interview';

export const metadata: Metadata = {
  title: 'Interview Preparation - CSCosmos',
  description:
    'Crack your next technical interview: questions explained from zero to 100% with step-by-step animations, filtered by topic, difficulty, frequency and interview round.',
};

const ICONS = { Layers, ShieldAlert, Binary, Network, BrainCircuit } as const;

export default function InterviewHubPage() {
  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="pill-badge mx-auto">Interview Preparation</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Understand one question <span className="text-primary">completely</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Pick a track. Every question is broken into steps, and every step has its own animation
          showing what happens behind the scenes — from first principles to senior-level depth.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = ICONS[category.icon];
          const facets = getCategoryFacets(category.key);
          return (
            <Link
              key={category.key}
              href={`/interview/${category.key}`}
              className="glass-card card-hover group flex flex-col p-6"
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-8 w-8 ${category.accent}`} />
                <span className="font-mono text-xs text-muted-foreground">
                  {facets.count} questions
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{category.shortTitle}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{category.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {facets.topics.map((t) => (
                  <span key={t.value} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                    {t.value}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Browse questions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
