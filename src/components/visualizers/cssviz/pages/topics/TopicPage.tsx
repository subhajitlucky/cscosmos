'use client';

import { type ReactElement } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/visualizers/cssviz/components/common/PageTransition';
import GlassCard from '@/components/visualizers/cssviz/components/common/GlassCard';
import SectionHeader from '@/components/visualizers/cssviz/components/common/SectionHeader';
import { Button } from '@/components/visualizers/cssviz/components/ui/Button';
import AnimationLab from '@/components/visualizers/cssviz/components/visualizers/AnimationLab';
import BoxModelLab from '@/components/visualizers/cssviz/components/visualizers/BoxModelLab';
import ColorLab from '@/components/visualizers/cssviz/components/visualizers/ColorLab';
import FlexboxLab from '@/components/visualizers/cssviz/components/visualizers/FlexboxLab';
import GridLab from '@/components/visualizers/cssviz/components/visualizers/GridLab';
import TypographyLab from '@/components/visualizers/cssviz/components/visualizers/TypographyLab';
import VariablesLab from '@/components/visualizers/cssviz/components/visualizers/VariablesLab';
import SelectorsLab from '@/components/visualizers/cssviz/components/visualizers/SelectorsLab';
import DisplayModesLab from '@/components/visualizers/cssviz/components/visualizers/DisplayModesLab';
import FloatsLab from '@/components/visualizers/cssviz/components/visualizers/FloatsLab';
import PositioningLab from '@/components/visualizers/cssviz/components/visualizers/PositioningLab';
import MultiColumnLab from '@/components/visualizers/cssviz/components/visualizers/MultiColumnLab';
import ResponsiveDesignLab from '@/components/visualizers/cssviz/components/visualizers/ResponsiveDesignLab';
import MediaQueriesLab from '@/components/visualizers/cssviz/components/visualizers/MediaQueriesLab';
import ContainerQueriesLab from '@/components/visualizers/cssviz/components/visualizers/ContainerQueriesLab';
import UnitsFunctionsLab from '@/components/visualizers/cssviz/components/visualizers/UnitsFunctionsLab';
import GenericVisualizer from '@/components/visualizers/cssviz/components/visualizers/GenericVisualizer';
import { topics, type Topic, type VisualizerKey } from '@/components/visualizers/cssviz/data/topics';

const visualizers: Partial<Record<VisualizerKey, ReactElement>> = {
  flexbox: <FlexboxLab />,
  grid: <GridLab />,
  boxModel: <BoxModelLab />,
  typography: <TypographyLab />,
  colors: <ColorLab />,
  animations: <AnimationLab />,
  variables: <VariablesLab />,
  selectors: <SelectorsLab />,
  displayModes: <DisplayModesLab />,
  floats: <FloatsLab />,
  positioning: <PositioningLab />,
  multiColumn: <MultiColumnLab />,
  responsiveDesign: <ResponsiveDesignLab />,
  mediaQueries: <MediaQueriesLab />,
  containerQueries: <ContainerQueriesLab />,
  unitsFunctions: <UnitsFunctionsLab />,
};

const TopicPage = ({ topic }: { topic: Topic }) => {
  const related = topics
    .filter((item) => item.path !== topic.path && item.tags.some((tag) => topic.tags.includes(tag)))
    .slice(0, 3);

  const visualizer = topic.visualizer ? visualizers[topic.visualizer] : null;

  return (
    <PageTransition>
      <div className="space-y-10">
        <div className="flex flex-col gap-4">
          <Link href="/css-cosmos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to CSS Universe
          </Link>
          <GlassCard>
            <div className="grid gap-6 p-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-primary">{topic.difficulty}</p>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{topic.name}</h1>
                <p className="text-slate-600 dark:text-slate-200">{topic.summary}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300">
                  {topic.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button as={Link} href="/css-cosmos/visualizers" variant="secondary">
                    Explore visualizers
                  </Button>
                </div>
              </div>
              <div className="space-y-3 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4 text-sm text-slate-600 dark:text-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-primary">Learning checklist</p>
                <ul className="space-y-2">
                  {topic.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-[6px] h-2 w-2 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="grid gap-4 p-5 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">Definition</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{topic.summary}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">Syntax</p>
              <div className="rounded-lg border border-slate-200/70 bg-slate-50 p-3 font-mono text-xs text-slate-800 shadow-sm dark:border-white/12 dark:bg-slate-900/60 dark:text-slate-100">
                {topic.bullets[0] ?? 'See visualizer for syntax examples.'}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">Example</p>
              <div className="rounded-lg border border-slate-200/70 bg-slate-50 p-3 text-sm text-slate-700 shadow-sm dark:border-white/12 dark:bg-slate-900/60 dark:text-slate-200">
                Use the visualizer below to apply these properties and see the result live.
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-[1.6fr,1fr]">
          <GlassCard>
            <div className="space-y-4 p-5">
              <SectionHeader
                eyebrow="Deep dive"
                title="Why this matters"
                subtitle="Principles, mental models, and debugging clues tailored to the topic."
              />
              <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Visual intuition</h4>
                  <p className="mt-2">
                    Each property is paired with motion or color feedback so you build muscle memory, not just recall
                    syntax.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Copy-ready CSS</h4>
                  <p className="mt-2">
                    Controls emit exact CSS you can copy. Use it as a starter token or paste into DevTools for instant
                    validation.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Performance notes</h4>
                  <p className="mt-2">
                    Learn where reflow, repaint, or compositing occurs so you avoid jank and choose GPU-friendly paths.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Accessibility first</h4>
                  <p className="mt-2">
                    Focus-visible, reduced-motion, and contrast tips are woven into every lab to keep experiences
                    inclusive.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="space-y-3 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">Practice</p>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
                <p>
                  Try recreating a UI card using this topic. Toggle between dark and light modes to validate token
                  contrast and responsiveness.
                </p>
                <p className="text-slate-500 dark:text-slate-400">Tip: use DevTools overlays (grid/flex) plus the copy CSS button.</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <motion.div id="visualizer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {visualizer ?? <GenericVisualizer topic={topic} />}
        </motion.div>

        {related.length > 0 && (
          <section className="space-y-4">
            <SectionHeader title="Related topics" subtitle="Keep exploring adjacent concepts." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <GlassCard key={item.path}>
                  <div className="space-y-2 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">{item.difficulty}</p>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
                    <Link className="text-sm font-semibold text-primary hover:text-slate-900 dark:hover:text-white" href={`/css-cosmos/topics${item.path}`}>
                      View page
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
};

export default TopicPage;
