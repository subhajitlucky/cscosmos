'use client';

import { type ReactElement } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/visualizers/cssviz/components/common/PageTransition';
import GlassCard from '@/components/visualizers/cssviz/components/common/GlassCard';
import SectionHeader from '@/components/visualizers/cssviz/components/common/SectionHeader';
import { Button } from '@/components/visualizers/cssviz/components/ui/Button';

// Labs
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

// Concept Lessons (All 41 Concepts Rebuilt)
import SelectorsConceptLesson from '@/components/visualizers/cssviz/components/concepts/SelectorsConceptLesson';
import CascadeConceptLesson from '@/components/visualizers/cssviz/components/concepts/CascadeConceptLesson';
import PseudoClassesConceptLesson from '@/components/visualizers/cssviz/components/concepts/PseudoClassesConceptLesson';
import IsWhereHasConceptLesson from '@/components/visualizers/cssviz/components/concepts/IsWhereHasConceptLesson';
import CascadeLayersConceptLesson from '@/components/visualizers/cssviz/components/concepts/CascadeLayersConceptLesson';
import BoxModelConceptLesson from '@/components/visualizers/cssviz/components/concepts/BoxModelConceptLesson';
import DisplayModesConceptLesson from '@/components/visualizers/cssviz/components/concepts/DisplayModesConceptLesson';
import PositioningConceptLesson from '@/components/visualizers/cssviz/components/concepts/PositioningConceptLesson';
import FloatsConceptLesson from '@/components/visualizers/cssviz/components/concepts/FloatsConceptLesson';
import FlexboxConceptLesson from '@/components/visualizers/cssviz/components/concepts/FlexboxConceptLesson';
import GridConceptLesson from '@/components/visualizers/cssviz/components/concepts/GridConceptLesson';
import SubgridConceptLesson from '@/components/visualizers/cssviz/components/concepts/SubgridConceptLesson';
import MultiColumnConceptLesson from '@/components/visualizers/cssviz/components/concepts/MultiColumnConceptLesson';
import UnitsConceptLesson from '@/components/visualizers/cssviz/components/concepts/UnitsConceptLesson';
import FunctionsConceptLesson from '@/components/visualizers/cssviz/components/concepts/FunctionsConceptLesson';
import VariablesConceptLesson from '@/components/visualizers/cssviz/components/concepts/VariablesConceptLesson';
import ColorsConceptLesson from '@/components/visualizers/cssviz/components/concepts/ColorsConceptLesson';
import BackgroundsConceptLesson from '@/components/visualizers/cssviz/components/concepts/BackgroundsConceptLesson';
import BordersConceptLesson from '@/components/visualizers/cssviz/components/concepts/BordersConceptLesson';
import ShadowsConceptLesson from '@/components/visualizers/cssviz/components/concepts/ShadowsConceptLesson';
import FiltersConceptLesson from '@/components/visualizers/cssviz/components/concepts/FiltersConceptLesson';
import ClippingConceptLesson from '@/components/visualizers/cssviz/components/concepts/ClippingConceptLesson';
import TypographyConceptLesson from '@/components/visualizers/cssviz/components/concepts/TypographyConceptLesson';
import FontsConceptLesson from '@/components/visualizers/cssviz/components/concepts/FontsConceptLesson';
import ResponsiveConceptLesson from '@/components/visualizers/cssviz/components/concepts/ResponsiveConceptLesson';
import MediaQueriesConceptLesson from '@/components/visualizers/cssviz/components/concepts/MediaQueriesConceptLesson';
import ContainerQueriesConceptLesson from '@/components/visualizers/cssviz/components/concepts/ContainerQueriesConceptLesson';
import AccessibilityConceptLesson from '@/components/visualizers/cssviz/components/concepts/AccessibilityConceptLesson';
import PrintStylingConceptLesson from '@/components/visualizers/cssviz/components/concepts/PrintStylingConceptLesson';
import TransitionsConceptLesson from '@/components/visualizers/cssviz/components/concepts/TransitionsConceptLesson';
import AnimationsConceptLesson from '@/components/visualizers/cssviz/components/concepts/AnimationsConceptLesson';
import Transforms3DConceptLesson from '@/components/visualizers/cssviz/components/concepts/Transforms3DConceptLesson';
import MotionPathConceptLesson from '@/components/visualizers/cssviz/components/concepts/MotionPathConceptLesson';
import RenderingPipelineConceptLesson from '@/components/visualizers/cssviz/components/concepts/RenderingPipelineConceptLesson';
import ReflowRepaintConceptLesson from '@/components/visualizers/cssviz/components/concepts/ReflowRepaintConceptLesson';
import GpuAccelerationConceptLesson from '@/components/visualizers/cssviz/components/concepts/GpuAccelerationConceptLesson';
import CssArchitectureConceptLesson from '@/components/visualizers/cssviz/components/concepts/CssArchitectureConceptLesson';
import CssDebuggingConceptLesson from '@/components/visualizers/cssviz/components/concepts/CssDebuggingConceptLesson';
import HoudiniPaintConceptLesson from '@/components/visualizers/cssviz/components/concepts/HoudiniPaintConceptLesson';
import HoudiniTypedOmConceptLesson from '@/components/visualizers/cssviz/components/concepts/HoudiniTypedOmConceptLesson';
import HoudiniLayoutConceptLesson from '@/components/visualizers/cssviz/components/concepts/HoudiniLayoutConceptLesson';

import { topics, type Topic, type VisualizerKey } from '@/components/visualizers/cssviz/data/topics';

const conceptLessons: Partial<Record<string, React.ComponentType>> = {
  // Track 1: Selectors & Specificity
  '/selectors': SelectorsConceptLesson,
  '/cascade': CascadeConceptLesson,
  '/pseudo-classes': PseudoClassesConceptLesson,
  '/is-where-has': IsWhereHasConceptLesson,
  '/cascade-layers': CascadeLayersConceptLesson,

  // Track 2: Box Model & Geometry
  '/box-model': BoxModelConceptLesson,
  '/display': DisplayModesConceptLesson,
  '/floats': FloatsConceptLesson,
  '/positioning': PositioningConceptLesson,

  // Track 3: Flexbox & Grid
  '/flexbox': FlexboxConceptLesson,
  '/grid': GridConceptLesson,
  '/subgrid': SubgridConceptLesson,
  '/multicolumn': MultiColumnConceptLesson,

  // Track 4: Units, Math & Custom Properties
  '/units': UnitsConceptLesson,
  '/functions': FunctionsConceptLesson,
  '/variables': VariablesConceptLesson,

  // Track 5: Visual Styling & Color
  '/colors': ColorsConceptLesson,
  '/backgrounds': BackgroundsConceptLesson,
  '/borders': BordersConceptLesson,
  '/shadows': ShadowsConceptLesson,
  '/filters': FiltersConceptLesson,
  '/clipping': ClippingConceptLesson,

  // Track 6: Typography & Text
  '/typography': TypographyConceptLesson,
  '/fonts': FontsConceptLesson,

  // Track 7: Responsive & Component Architecture
  '/responsive': ResponsiveConceptLesson,
  '/media-queries': MediaQueriesConceptLesson,
  '/container-queries': ContainerQueriesConceptLesson,
  '/css-a11y': AccessibilityConceptLesson,
  '/print': PrintStylingConceptLesson,

  // Track 8: Transitions & Animation
  '/transitions': TransitionsConceptLesson,
  '/animations': AnimationsConceptLesson,
  '/3d': Transforms3DConceptLesson,
  '/motion-path': MotionPathConceptLesson,

  // Track 9: Engine Internals, Architecture & Houdini
  '/rendering': RenderingPipelineConceptLesson,
  '/reflow': ReflowRepaintConceptLesson,
  '/gpu': GpuAccelerationConceptLesson,
  '/architecture': CssArchitectureConceptLesson,
  '/debugging': CssDebuggingConceptLesson,
  '/houdini-paint': HoudiniPaintConceptLesson,
  '/houdini-typedom': HoudiniTypedOmConceptLesson,
  '/houdini-layout': HoudiniLayoutConceptLesson,
};

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
  const CustomLesson = conceptLessons[topic.path];
  if (CustomLesson) {
    return (
      <PageTransition>
        <CustomLesson />
      </PageTransition>
    );
  }

  const visualizer = topic.visualizer ? visualizers[topic.visualizer] : null;
  const related = topics.filter((t) => t.path !== topic.path && t.difficulty === topic.difficulty).slice(0, 3);

  return (
    <PageTransition>
      <div className="space-y-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-slate-900 dark:hover:text-white"
            href="/fullstack/css-cosmos/concepts"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Concepts
          </Link>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <span>Difficulty</span>
            <span className="rounded-full border border-slate-300 dark:border-white/10 px-2 py-0.5 text-slate-700 dark:text-slate-200">
              {topic.difficulty}
            </span>
          </div>
        </div>

        <GlassCard>
          <div className="space-y-6 p-6 sm:p-8">
            <div className="space-y-3">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Deep Dive
              </span>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">{topic.name}</h1>
              <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">{topic.summary}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-white/5 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="#visualizer">
                Launch Interactive Lab
              </Button>
              <Button as={Link} variant="ghost" href="/fullstack/css-cosmos/challenges">
                Take a Challenge <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard className="md:col-span-2">
            <div className="space-y-4 p-6">
              <SectionHeader title="Core mental models" subtitle="What happens under the hood." />
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Every property here coordinates with browser layout engines. Rather than memorizing values, connect
                  them to document flow, stacking contexts, and device constraints.
                </p>
                <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
                  {topic.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3 pt-4 sm:grid-cols-2">
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
                    <Link className="text-sm font-semibold text-primary hover:text-slate-900 dark:hover:text-white" href={`/fullstack/css-cosmos/topics${item.path}`}>
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
