'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Cpu,
  Layers,
  Sliders,
  Terminal,
  Table as TableIcon
} from 'lucide-react';
import { foundationSubtopics, getFoundationSubtopic, type FoundationSubtopic } from '../data/foundations';

import {
  AiTaxonomyWidget,
  RuleVsLearnedInteractiveWidget,
  RepresentationLearningWidget,
  GenerativeSamplingWidget,
  ModelMathFunctionWidget,
  GeneralizationCurveWidget,
  NextTokenInteractiveWidget,
  AiSystemsArchitectureWidget
} from '../components/foundation-viz/Phase1Viz';

import {
  RolesMatrixWidget,
  PipelineLifecycleWidget,
  DataModelInferenceWidget,
  TrainingVsInferenceDeepWidget
} from '../components/foundation-viz/Phase2Viz';

import {
  TensorInspectorWidget,
  HyperparameterTuningWidget,
  MultiFeatureWeightWidget,
  BiasOffsetWidget,
  FeaturesVectorWidget,
  LabelsLossWidget,
  SoftmaxDistributionWidget
} from '../components/foundation-viz/Phase3Viz';

import {
  InputFlowStepperWidget,
  ProbabilisticSimulatorDeepWidget,
  FailureModeDiagnosticWidget,
  AiToolsStackWidget,
  LocalVsCloudTradeoffWidget
} from '../components/foundation-viz/Phase4Viz';

import {
  FirstTinyPipelineWidget,
  PipelineCapstoneWidget
} from '../components/foundation-viz/Phase5Viz';

interface FoundationTopicProps {
  topicId: string;
  basePath?: string;
}

export function FoundationTopic({
  topicId,
  basePath = '/ai/ai-engineering-foundations',
}: FoundationTopicProps) {
  const router = useRouter();
  const topic = getFoundationSubtopic(topicId) || foundationSubtopics[0];
  const index = foundationSubtopics.findIndex((t) => t.id === topic.id);
  const previous = foundationSubtopics[index - 1];
  const next = foundationSubtopics[index + 1];

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(topic.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Top Nav Breadcrumbs & Quick-Jump Topic Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-3">
          <Link
            href={basePath}
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Overview
          </Link>
          <span className="opacity-40">/</span>
          <Link
            href={`${basePath}/learn`}
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <TableIcon className="h-3.5 w-3.5" /> All Topics Table
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground hidden sm:inline">Jump to:</span>
            <select
              value={topic.id}
              onChange={(e) => {
                if (e.target.value) {
                  router.push(`${basePath}/learn/${e.target.value}`);
                }
              }}
              aria-label="Jump to module"
              className="rounded-lg border border-border/80 bg-secondary/40 px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
            >
              {foundationSubtopics.map((t) => (
                <option key={t.id} value={t.id} className="bg-card text-foreground">
                  {String(t.number).padStart(2, '0')}. {t.title}
                </option>
              ))}
            </select>
          </div>

          <span className="font-semibold text-foreground hidden sm:inline">
            // {String(topic.number).padStart(2, '0')}/26
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-mono font-semibold text-foreground">
            {topic.category.toUpperCase()}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Estimated ~5 min read &bull; Client-Side Reactive
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight font-display">
          {topic.title}
        </h1>

        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-3xl">
          {topic.definition}
        </p>
      </header>

      {/* Mental Model & Analogy */}
      <section className="rounded-xl border border-border/80 bg-secondary/30 p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
          <Lightbulb className="h-4 w-4 text-foreground" /> Real-World Mental Model
        </div>
        <p className="text-base sm:text-lg font-display font-bold text-foreground leading-snug">
          &ldquo;{topic.analogy}&rdquo;
        </p>
      </section>

      {/* Interactive Visualization Studio */}
      <section className="rounded-xl border border-border/80 bg-card overflow-hidden">
        <div className="border-b border-border/80 bg-secondary/40 px-5 py-3 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Terminal className="h-3.5 w-3.5 text-foreground" />
            <span>INTERACTIVE ENGINE: {topic.visualization.toUpperCase().replace(/-/g, ' ')}</span>
          </div>
          <span className="text-[11px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live Reactive
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <SubtopicInteractiveVisualizer topic={topic} />
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 space-y-4">
        <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
          CORE PRINCIPLES
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
          What You Must Understand
        </h2>
        <div className="space-y-3">
          {topic.keyPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Code Snippet */}
      {topic.codeSnippet && (
        <section className="rounded-xl border border-border/80 bg-card overflow-hidden">
          <div className="border-b border-border/80 bg-secondary/40 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Code2 className="h-4 w-4 text-foreground" /> Reference Implementation
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border bg-secondary/60"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>
          <pre className="p-6 text-xs sm:text-sm font-mono text-foreground bg-secondary/20 overflow-x-auto leading-relaxed">
            <code>{topic.codeSnippet}</code>
          </pre>
        </section>
      )}

      {/* Common Pitfall Warning */}
      {topic.pitfall && (
        <section className="rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Production Failure Mode
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {topic.pitfall}
          </p>
        </section>
      )}

      {/* Bottom Navigation */}
      <div className="space-y-4 pt-6 border-t border-border/80">
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {previous ? (
            <Link
              href={`${basePath}/learn/${previous.id}`}
              className="group rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between hover:border-foreground/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                &larr; Previous Module ({previous.number})
              </span>
              <div className="mt-2 font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                {previous.title}
              </div>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`${basePath}/learn/${next.id}`}
              className="group rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between text-right sm:items-end hover:border-foreground/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">
                Next Module ({next.number}) &rarr;
              </span>
              <div className="mt-2 font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                {next.title}
              </div>
            </Link>
          ) : (
            <Link
              href={`${basePath}/lab`}
              className="group rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between text-right sm:items-end hover:border-foreground/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-emerald-500 uppercase font-semibold">
                Curriculum Complete &rarr;
              </span>
              <div className="mt-2 font-display font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">
                Launch The Micro-Model Studio
              </div>
            </Link>
          )}
        </nav>

        <div className="flex justify-center pt-2">
          <Link
            href={`${basePath}/learn`}
            className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/20 px-5 py-2.5 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <TableIcon className="h-3.5 w-3.5" /> View Full 26-Topic Curriculum Table
          </Link>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Interactive Subtopic Visualizers Dispatcher (26 Modules)
// -------------------------------------------------------------
function SubtopicInteractiveVisualizer({ topic }: { topic: FoundationSubtopic }) {
  // Phase 1: Core Mental Models (Topics 1 - 8)
  if (topic.id === 'what-is-artificial-intelligence' || topic.visualization === 'ai-taxonomy') {
    return <AiTaxonomyWidget />;
  }
  if (topic.id === 'ai-vs-machine-learning' || topic.visualization === 'rule-vs-learned') {
    return <RuleVsLearnedInteractiveWidget />;
  }
  if (topic.id === 'machine-learning-vs-deep-learning' || topic.visualization === 'representation') {
    return <RepresentationLearningWidget />;
  }
  if (topic.id === 'what-is-generative-ai' || topic.visualization === 'generative-sampling') {
    return <GenerativeSamplingWidget />;
  }
  if (topic.id === 'what-is-an-ai-model' || topic.visualization === 'math-function') {
    return <ModelMathFunctionWidget />;
  }
  if (topic.id === 'what-is-a-machine-learning-model' || topic.visualization === 'generalization') {
    return <GeneralizationCurveWidget />;
  }
  if (topic.id === 'what-is-an-llm' || topic.visualization === 'next-token') {
    return <NextTokenInteractiveWidget />;
  }
  if (topic.id === 'what-is-ai-engineering' || topic.visualization === 'system-architecture') {
    return <AiSystemsArchitectureWidget />;
  }

  // Phase 2: Lifecycle & Roles (Topics 9 - 12)
  if (topic.id === 'ai-vs-ml-engineer-vs-data-scientist' || topic.visualization === 'roles-matrix') {
    return <RolesMatrixWidget />;
  }
  if (topic.id === 'ai-engineering-pipeline' || topic.visualization === 'lifecycle-stepper') {
    return <PipelineLifecycleWidget />;
  }
  if (topic.id === 'data-model-inference' || topic.visualization === 'data-pipeline') {
    return <DataModelInferenceWidget />;
  }
  if (topic.id === 'training-vs-inference' || topic.visualization === 'training-vs-inference') {
    return <TrainingVsInferenceDeepWidget />;
  }

  // Phase 3: Parameters & Mechanics (Topics 13 - 19)
  if (topic.id === 'parameters' || topic.visualization === 'tensor-inspector') {
    return <TensorInspectorWidget />;
  }
  if (topic.id === 'hyperparameters' || topic.visualization === 'hyperparameters') {
    return <HyperparameterTuningWidget />;
  }
  if (topic.id === 'weights' || topic.visualization === 'weight-slider') {
    return <MultiFeatureWeightWidget />;
  }
  if (topic.id === 'bias' || topic.visualization === 'bias-slider') {
    return <BiasOffsetWidget />;
  }
  if (topic.id === 'features' || topic.visualization === 'features-vector') {
    return <FeaturesVectorWidget />;
  }
  if (topic.id === 'labels' || topic.visualization === 'ground-truth') {
    return <LabelsLossWidget />;
  }
  if (topic.id === 'predictions' || topic.visualization === 'softmax-distribution') {
    return <SoftmaxDistributionWidget />;
  }

  // Phase 4: Systems & Reliability (Topics 20 - 24)
  if (topic.id === 'what-happens-when-model-receives-input' || topic.visualization === 'input-flow') {
    return <InputFlowStepperWidget />;
  }
  if (topic.id === 'deterministic-vs-probabilistic-systems' || topic.visualization === 'probabilistic-dice') {
    return <ProbabilisticSimulatorDeepWidget />;
  }
  if (topic.id === 'why-ai-makes-mistakes' || topic.visualization === 'failure-modes') {
    return <FailureModeDiagnosticWidget />;
  }
  if (topic.id === 'ai-engineering-tools' || topic.visualization === 'tools-radar') {
    return <AiToolsStackWidget />;
  }
  if (topic.id === 'local-ai-vs-cloud-ai' || topic.visualization === 'cloud-vs-local') {
    return <LocalVsCloudTradeoffWidget />;
  }

  // Phase 5: Pipeline Projects (Topics 25 - 26)
  if (topic.id === 'first-tiny-ai-pipeline' || topic.visualization === 'pipeline-stepper') {
    return <FirstTinyPipelineWidget />;
  }
  if (topic.id === 'tiny-ai-pipeline-project' || topic.visualization === 'pipeline-capstone') {
    return <PipelineCapstoneWidget />;
  }

  return <ModelMathFunctionWidget />;
}
