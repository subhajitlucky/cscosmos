'use client';

import Link from 'next/link';
import GlassCard from '@/components/visualizers/cssviz/components/common/GlassCard';
import PageTransition from '@/components/visualizers/cssviz/components/common/PageTransition';
import SectionHeader from '@/components/visualizers/cssviz/components/common/SectionHeader';
import { topics } from '@/components/visualizers/cssviz/data/topics';

const difficultyOrder: Array<'foundation' | 'intermediate' | 'advanced'> = [
  'foundation',
  'intermediate',
  'advanced',
];

const Concepts = () => {
  const grouped = difficultyOrder.map((level) => ({
    level,
    items: topics.filter((t) => t.difficulty === level),
  }));

  return (
    <PageTransition>
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Learning path"
          title="CSS concepts from basics to advanced"
          subtitle="Follow this sequence to master CSS. Jump into any concept to view details or open its visualizer."
        />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Start with foundations, then progress through layout, responsiveness, effects, motion, architecture, and
          Houdini. Each card links to the concept’s dedicated page and visualizer (where available).
        </p>
      </section>

      <div className="mt-8 space-y-10">
        {grouped.map(({ level, items }) => (
          <section key={level} className="space-y-4">
            <h2 className="text-lg font-semibold capitalize text-slate-900 dark:text-white">{level}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((topic) => (
                <GlassCard key={topic.path}>
                  <div className="flex flex-col gap-3 p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-primary">
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
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{topic.name}</h3>
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
                    <div className="flex gap-3 text-sm font-semibold">
                      <Link className="text-primary hover:text-slate-900 dark:hover:text-white" href={`/css-cosmos/topics${topic.path}`}>
                        View concept
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageTransition>
  );
};

export default Concepts;
