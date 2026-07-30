'use client';

import Link from 'next/link';
import GlassCard from '@/components/visualizers/cssviz/components/common/GlassCard';
import PageTransition from '@/components/visualizers/cssviz/components/common/PageTransition';
import SectionHeader from '@/components/visualizers/cssviz/components/common/SectionHeader';
import { topics } from '@/components/visualizers/cssviz/data/topics';

const Visualizers = () => {
  const visualizerTopics = topics;

  return (
    <PageTransition>
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Interactive labs"
          title="All visualizers in one place"
          subtitle="Jump straight into any lab. Each one streams live CSS you can copy."
        />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Pick a lab to explore alignment, layout, typography, color, animations, variables, and more. Each card links to
          the dedicated page and opens the live visualizer.
        </p>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {visualizerTopics.map((topic) => (
          <GlassCard key={topic.path}>
            <div className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-primary">
                <span>{topic.difficulty}</span>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 dark:text-slate-300">
                  {topic.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-white/10 dark:text-slate-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{topic.name}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">{topic.summary}</p>
              </div>
              <div className="space-y-1 text-sm text-slate-500 dark:text-slate-300">
                {topic.bullets.slice(0, 3).map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex gap-3 text-sm font-semibold">
                <Link className="text-primary hover:text-slate-900 dark:hover:text-white" href={`/css-cosmos/topics${topic.path}`}>
                  View concept
                </Link>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </PageTransition>
  );
};

export default Visualizers;
