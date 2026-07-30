'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, Layers, Orbit, Palette } from 'lucide-react';
import GlassCard from '@/components/visualizers/cssviz/components/common/GlassCard';
import PageTransition from '@/components/visualizers/cssviz/components/common/PageTransition';
import SectionHeader from '@/components/visualizers/cssviz/components/common/SectionHeader';
import { Button } from '@/components/visualizers/cssviz/components/ui/Button';
import { featuredTopics, topics } from '@/components/visualizers/cssviz/data/topics';

const visualizerCards = [
  {
    title: 'Flexbox Lab',
    path: '/flexbox',
    icon: <LayoutGrid className="h-5 w-5" />,
    summary: 'Adjust axes, wrapping, and gap. Drag blocks to reorder and see live CSS output.',
  },
  {
    title: 'Grid Lab',
    path: '/grid',
    icon: <Layers className="h-5 w-5" />,
    summary: 'Switch between auto-fit and explicit tracks, with minmax() and responsive templates.',
  },
  {
    title: 'Color Lab',
    path: '/colors',
    icon: <Palette className="h-5 w-5" />,
    summary: 'HSL sliders + gradient builder with copyable CSS variables.',
  },
  {
    title: 'Animation Studio',
    path: '/animations',
    icon: <Orbit className="h-5 w-5" />,
    summary: 'Keyframe-inspired preview with duration, easing, delay, and iteration controls.',
  },
];

const Home = () => {
  const quickTopics = topics.filter((topic) => topic.difficulty === 'foundation').slice(0, 6);

  return (
    <PageTransition>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white px-6 py-12 shadow-glow transition-colors duration-300 dark:bg-surface sm:px-10">
        <div className="absolute inset-0 animate-gradient-move bg-[length:200%_200%] bg-[linear-gradient(135deg,rgba(99,102,241,0.35),rgba(34,211,238,0.3),rgba(22,163,74,0.25))]" />
        <div className="absolute -right-6 top-10 h-40 w-40 rounded-full bg-white/10 blur-[80px]" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr,1fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">CSS Universe</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              Master every CSS concept visually, with interactive labs.
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-200">
              From selectors to Houdini, explore the full spectrum with neon gradients, glass panels, and live playgrounds
              that output copy-ready CSS.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} href="/css-cosmos/topics/flexbox" size="lg">
                Start learning
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} href="/css-cosmos/visualizers" variant="secondary" size="lg">
                Explore visualizers
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Live CSS output', 'Dark / light with persistence', 'Smooth motion & scroll reveal'].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-white/10 px-3 py-2 text-sm text-slate-700 dark:text-white">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <GlassCard className="neon-border">
            <div className="neon-content space-y-4 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Live token playground</p>
                <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs dark:bg-white/10 dark:text-white">
                  Real-time
                </span>
              </div>
              <div className="grid gap-3">
                <div className="rounded-xl border p-4 bg-white text-slate-900 border-slate-200/80 shadow-sm dark:bg-black/40 dark:text-white dark:border-white/10">
                  <p className="text-xs text-primary">Clamp formula</p>
                  <p className="font-mono text-sm">
                    clamp(1rem, 0.8rem + 1vw, 1.5rem)
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-200">
                  <div className="rounded-lg bg-primary/15 text-primary/90 px-3 py-2 dark:bg-primary/20 dark:text-white">
                    container queries
                  </div>
                  <div className="rounded-lg bg-secondary/15 text-secondary/90 px-3 py-2 dark:bg-secondary/20 dark:text-white">
                    animations
                  </div>
                  <div className="rounded-lg bg-accent/15 text-accent/90 px-3 py-2 dark:bg-accent/20 dark:text-white">
                    gradients
                  </div>
                  <div className="rounded-lg bg-slate-200/70 text-slate-800 px-3 py-2 dark:bg-white/10 dark:text-white">
                    houdini
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <SectionHeader
          eyebrow="Curriculum"
          title="All CSS domains, organized"
          subtitle="Jump into fundamentals, layout systems, motion, rendering, and Houdini APIs with curated cards."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {featuredTopics.map((topic, index) => (
            <motion.div
              key={topic.path}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <GlassCard className="h-full">
                <div className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">{topic.difficulty}</p>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {topic.tags.slice(0, 2).join(' · ')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{topic.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{topic.summary}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <Link className="text-sm font-semibold text-primary hover:text-slate-900 dark:hover:text-white" href={`/css-cosmos/topics${topic.path}`}>
                      Open page
                    </Link>
                    {topic.visualizer && (
                      <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                        Live visualizer
                      </span>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-14 space-y-6">
        <SectionHeader
          eyebrow="Playgrounds"
          title="Popular visualizers"
          subtitle="Each lab streams real-time CSS so you can copy the output into your project instantly."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {visualizerCards.map((card, index) => (
            <motion.div
              key={card.path}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <GlassCard className="h-full">
                <div className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200/80 bg-slate-100 text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-glow">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{card.title}</h3>
                      <p className="text-xs uppercase tracking-[0.14em] text-primary">Interactive</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{card.summary}</p>
                  <Button as={Link} href={`/css-cosmos/topics${card.path}`} variant="secondary" size="sm" className="mt-auto self-start">
                    Open visualizer
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-14 space-y-6">
        <SectionHeader
          eyebrow="Foundation"
          title="Start with the essentials"
          subtitle="Selectors, cascade, units, and responsive techniques—all visualized."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickTopics.map((topic) => (
            <GlassCard key={topic.path}>
              <div className="space-y-3 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-primary">{topic.difficulty}</p>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{topic.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{topic.summary}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {topic.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-sm font-semibold text-primary hover:border-slate-300 hover:bg-white/70 hover:text-slate-900 dark:hover:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
                  href={`/css-cosmos/topics${topic.path}`}
                >
                  Read the page
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;
