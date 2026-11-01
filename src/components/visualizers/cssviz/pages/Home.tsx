'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, FlaskConical, Sparkles } from 'lucide-react';
import GlassCard from '@/components/visualizers/cssviz/components/common/GlassCard';
import PageTransition from '@/components/visualizers/cssviz/components/common/PageTransition';
import SectionHeader from '@/components/visualizers/cssviz/components/common/SectionHeader';
import { Button } from '@/components/visualizers/cssviz/components/ui/Button';
import { topics } from '@/components/visualizers/cssviz/data/topics';

const BASE = '/fullstack/css-cosmos';

const START_HERE_PATHS = [
  '/selectors',
  '/cascade',
  '/box-model',
  '/flexbox',
  '/grid',
  '/responsive',
];

const startHereTopics = START_HERE_PATHS.map((path) =>
  topics.find((topic) => topic.path === path),
).filter((topic): topic is (typeof topics)[number] => Boolean(topic));

const labCount = new Set(
  topics.map((topic) => topic.visualizer).filter(Boolean),
).size;

const Home = () => {
  const firstTopic = startHereTopics[0];

  return (
    <PageTransition>
      <section className="relative overflow-hidden rounded-3xl border border-glass bg-surface px-6 py-14 shadow-glow transition-colors duration-300 sm:px-10">
        <div className="absolute inset-0 bg-indigo-500/10" />
        <div className="absolute -right-6 top-10 h-40 w-40 rounded-full bg-white/10 blur-[80px]" />
        <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-glass bg-surface/70 px-3 py-1 text-xs uppercase tracking-[0.22em] text-primary">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">CSS Universe · </span>
            {topics.length} concepts · {labCount} labs
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Learn CSS by seeing it change.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-200">
            Selectors, layout, motion, and rendering — explained with interactive labs
            that output copy-ready CSS.
          </p>
          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
            <Button
              as={Link}
              href={firstTopic ? `${BASE}/topics${firstTopic.path}` : `${BASE}/concepts`}
              size="lg"
            >
              Start learning
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button as={Link} href={`${BASE}/visualizers`} variant="secondary" size="lg">
              Explore visualizers
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-5">
        <SectionHeader
          eyebrow="Beginner path"
          title="Start with these six"
          subtitle="A simple order from selectors to responsive layout. Open any step and its lab."
        />
        <div className="overflow-hidden rounded-2xl border border-glass bg-surface">
          <div className="divide-y divide-slate-200/70 dark:divide-white/10">
            {startHereTopics.map((topic, index) => (
              <Link
                key={topic.path}
                href={`${BASE}/topics${topic.path}`}
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-slate-100/70 dark:hover:bg-white/5 sm:p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-glass bg-surface/70 font-mono text-xs font-bold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                      {topic.name}
                    </h3>
                    {topic.visualizer && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Lab
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                    {topic.summary}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <GlassCard>
          <Link href={`${BASE}/concepts`} className="group flex h-full flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {topics.length} topics
              </span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Core concepts
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                The full curriculum, grouped from foundation to advanced.
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Browse concepts
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </GlassCard>

        <GlassCard>
          <Link href={`${BASE}/visualizers`} className="group flex h-full flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <FlaskConical className="h-5 w-5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {labCount} labs
              </span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Visualizer labs
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Tweak layout, color, and motion live, then copy the CSS.
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Open all labs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </GlassCard>
      </section>
    </PageTransition>
  );
};

export default Home;
