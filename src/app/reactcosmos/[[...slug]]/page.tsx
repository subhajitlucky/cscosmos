import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/visualizers/reactcosmos/components/layout/Navbar';
import Footer from '@/components/visualizers/reactcosmos/components/layout/Footer';
import Home from '@/components/visualizers/reactcosmos/pages/Home';
import Learn from '@/components/visualizers/reactcosmos/pages/Learn';
import Playground from '@/components/visualizers/reactcosmos/pages/Playground';
import About from '@/components/visualizers/reactcosmos/pages/About';
import TopicDetail from '@/components/visualizers/reactcosmos/pages/TopicDetail';
import { TOPICS } from '@/components/visualizers/reactcosmos/data/topics';

import WhatIsReact from '@/components/visualizers/reactcosmos/pages/topics/WhatIsReact';
import DeclarativeUi from '@/components/visualizers/reactcosmos/pages/topics/DeclarativeUi';
import VirtualDom from '@/components/visualizers/reactcosmos/pages/topics/VirtualDom';
import JsxCompilation from '@/components/visualizers/reactcosmos/pages/topics/JsxCompilation';
import ComponentsComposition from '@/components/visualizers/reactcosmos/pages/topics/ComponentsComposition';
import PropsFlow from '@/components/visualizers/reactcosmos/pages/topics/PropsFlow';
import StateUpdates from '@/components/visualizers/reactcosmos/pages/topics/StateUpdates';
import ControlledUncontrolled from '@/components/visualizers/reactcosmos/pages/topics/ControlledUncontrolled';
import EventHandling from '@/components/visualizers/reactcosmos/pages/topics/EventHandling';
import ConditionalRendering from '@/components/visualizers/reactcosmos/pages/topics/ConditionalRendering';
import ListsKeys from '@/components/visualizers/reactcosmos/pages/topics/ListsKeys';
import ComponentRerendering from '@/components/visualizers/reactcosmos/pages/topics/ComponentRerendering';
import UsestateDeepDive from '@/components/visualizers/reactcosmos/pages/topics/UsestateDeepDive';
import Useeffect from '@/components/visualizers/reactcosmos/pages/topics/Useeffect';
import Uselayouteffect from '@/components/visualizers/reactcosmos/pages/topics/Uselayouteffect';
import Useref from '@/components/visualizers/reactcosmos/pages/topics/Useref';
import Usememo from '@/components/visualizers/reactcosmos/pages/topics/Usememo';
import Usecallback from '@/components/visualizers/reactcosmos/pages/topics/Usecallback';
import CustomHooks from '@/components/visualizers/reactcosmos/pages/topics/CustomHooks';
import RulesOfHooks from '@/components/visualizers/reactcosmos/pages/topics/RulesOfHooks';
import ContextApi from '@/components/visualizers/reactcosmos/pages/topics/ContextApi';
import PropDrilling from '@/components/visualizers/reactcosmos/pages/topics/PropDrilling';
import StateLifting from '@/components/visualizers/reactcosmos/pages/topics/StateLifting';
import ReconciliationAlgorithm from '@/components/visualizers/reactcosmos/pages/topics/ReconciliationAlgorithm';
import FiberArchitecture from '@/components/visualizers/reactcosmos/pages/topics/FiberArchitecture';
import RenderVsCommit from '@/components/visualizers/reactcosmos/pages/topics/RenderVsCommit';
import BatchingUpdates from '@/components/visualizers/reactcosmos/pages/topics/BatchingUpdates';
import PerformanceBottlenecks from '@/components/visualizers/reactcosmos/pages/topics/PerformanceBottlenecks';
import MemoizationStrategies from '@/components/visualizers/reactcosmos/pages/topics/MemoizationStrategies';
import ErrorBoundaries from '@/components/visualizers/reactcosmos/pages/topics/ErrorBoundaries';
import CodeSplittingLazy from '@/components/visualizers/reactcosmos/pages/topics/CodeSplittingLazy';
import Suspense from '@/components/visualizers/reactcosmos/pages/topics/Suspense';
import ConcurrentRendering from '@/components/visualizers/reactcosmos/pages/topics/ConcurrentRendering';
import ServerComponents from '@/components/visualizers/reactcosmos/pages/topics/ServerComponents';
import SchedulerInternals from '@/components/visualizers/reactcosmos/pages/topics/SchedulerInternals';

const TOPIC_COMPONENTS: Record<string, React.ComponentType> = {
  'what-is-react': WhatIsReact,
  'declarative-ui': DeclarativeUi,
  'virtual-dom': VirtualDom,
  'jsx-compilation': JsxCompilation,
  'components-composition': ComponentsComposition,
  'props-flow': PropsFlow,
  'state-updates': StateUpdates,
  'controlled-uncontrolled': ControlledUncontrolled,
  'event-handling': EventHandling,
  'conditional-rendering': ConditionalRendering,
  'lists-keys': ListsKeys,
  'component-rerendering': ComponentRerendering,
  'usestate-deep-dive': UsestateDeepDive,
  'useeffect': Useeffect,
  'uselayouteffect': Uselayouteffect,
  'useref': Useref,
  'usememo': Usememo,
  'usecallback': Usecallback,
  'custom-hooks': CustomHooks,
  'rules-of-hooks': RulesOfHooks,
  'context-api': ContextApi,
  'prop-drilling': PropDrilling,
  'state-lifting': StateLifting,
  'reconciliation-algorithm': ReconciliationAlgorithm,
  'fiber-architecture': FiberArchitecture,
  'render-vs-commit': RenderVsCommit,
  'batching-updates': BatchingUpdates,
  'performance-bottlenecks': PerformanceBottlenecks,
  'memoization-strategies': MemoizationStrategies,
  'error-boundaries': ErrorBoundaries,
  'code-splitting-lazy': CodeSplittingLazy,
  'suspense': Suspense,
  'concurrent-rendering': ConcurrentRendering,
  'server-components': ServerComponents,
  'scheduler-internals': SchedulerInternals,
};

export function generateStaticParams() {
  const topicParams = TOPICS.map(topic => ({ slug: ['topic', topic.id] }));
  return [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['playground'] },
    { slug: ['about'] },
    ...topicParams,
  ];
}

export default async function ReactCosmosPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const firstSegment = slug && slug.length > 0 ? slug[0] : '';
  const secondSegment = slug && slug.length > 1 ? slug[1] : '';

  let content = <Home />;

  if (firstSegment === 'learn') {
    content = <Learn />;
  } else if (firstSegment === 'playground') {
    content = <Playground />;
  } else if (firstSegment === 'about') {
    content = <About />;
  } else if (firstSegment === 'topic') {
    if (!secondSegment) {
      notFound();
    }
    const SpecificTopicComponent = TOPIC_COMPONENTS[secondSegment];
    if (SpecificTopicComponent) {
      content = <SpecificTopicComponent />;
    } else {
      content = <TopicDetail topicId={secondSegment} />;
    }
  } else if (firstSegment !== '') {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <main className="flex-1">{content}</main>
      <Footer />
    </div>
  );
}
