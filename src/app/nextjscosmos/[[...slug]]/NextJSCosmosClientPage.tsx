'use client';

import React from 'react';
import HomePage from '@/components/visualizers/nextjscosmos/app/page';
import ConceptsCatalogPage from '@/components/visualizers/nextjscosmos/app/concepts/page';
import ErrorsCatalogPage from '@/components/visualizers/nextjscosmos/app/errors/page';
import ErrorDetailPage from '@/components/visualizers/nextjscosmos/app/errors/[slug]/page';
import PlaygroundPage from '@/components/visualizers/nextjscosmos/app/playground/page';
import { Navbar } from '@/components/visualizers/nextjscosmos/components/navbar';
import { Footer } from '@/components/visualizers/nextjscosmos/components/footer';

// Import all 35 concept pages
import AppRouterOverview from '@/components/visualizers/nextjscosmos/app/concepts/app-router-overview/page';
import CachingRevalidation from '@/components/visualizers/nextjscosmos/app/concepts/caching-revalidation/page';
import ClientComponents from '@/components/visualizers/nextjscosmos/app/concepts/client-components/page';
import ClientFetching from '@/components/visualizers/nextjscosmos/app/concepts/client-fetching/page';
import DeploymentModel from '@/components/visualizers/nextjscosmos/app/concepts/deployment-model/page';
import DynamicRoutes from '@/components/visualizers/nextjscosmos/app/concepts/dynamic-routes/page';
import ErrorBoundaries from '@/components/visualizers/nextjscosmos/app/concepts/error-boundaries/page';
import FetchOptions from '@/components/visualizers/nextjscosmos/app/concepts/fetch-options/page';
import FileBasedRouting from '@/components/visualizers/nextjscosmos/app/concepts/file-based-routing/page';
import FontOptimization from '@/components/visualizers/nextjscosmos/app/concepts/font-optimization/page';
import FormHandling from '@/components/visualizers/nextjscosmos/app/concepts/form-handling/page';
import Hydration from '@/components/visualizers/nextjscosmos/app/concepts/hydration/page';
import ImageOptimization from '@/components/visualizers/nextjscosmos/app/concepts/image-optimization/page';
import InterceptingRoutes from '@/components/visualizers/nextjscosmos/app/concepts/intercepting-routes/page';
import ISR from '@/components/visualizers/nextjscosmos/app/concepts/isr/page';
import LayoutsAndTemplates from '@/components/visualizers/nextjscosmos/app/concepts/layouts-and-templates/page';
import LoadingUI from '@/components/visualizers/nextjscosmos/app/concepts/loading-ui/page';
import MetadataAPI from '@/components/visualizers/nextjscosmos/app/concepts/metadata-api/page';
import Middleware from '@/components/visualizers/nextjscosmos/app/concepts/middleware/page';
import NestedRoutes from '@/components/visualizers/nextjscosmos/app/concepts/nested-routes/page';
import NotFoundRoutes from '@/components/visualizers/nextjscosmos/app/concepts/not-found-routes/page';
import OptimisticUpdates from '@/components/visualizers/nextjscosmos/app/concepts/optimistic-updates/page';
import ParallelRoutes from '@/components/visualizers/nextjscosmos/app/concepts/parallel-routes/page';
import PPR from '@/components/visualizers/nextjscosmos/app/concepts/ppr/page';
import RouteGroups from '@/components/visualizers/nextjscosmos/app/concepts/route-groups/page';
import RouteHandlers from '@/components/visualizers/nextjscosmos/app/concepts/route-handlers/page';
import RSC from '@/components/visualizers/nextjscosmos/app/concepts/rsc/page';
import ServerActions from '@/components/visualizers/nextjscosmos/app/concepts/server-actions/page';
import ServerClientBoundary from '@/components/visualizers/nextjscosmos/app/concepts/server-client-boundary/page';
import ServerFetching from '@/components/visualizers/nextjscosmos/app/concepts/server-fetching/page';
import ServerOnly from '@/components/visualizers/nextjscosmos/app/concepts/server-only/page';
import SSG from '@/components/visualizers/nextjscosmos/app/concepts/ssg/page';
import SSR from '@/components/visualizers/nextjscosmos/app/concepts/ssr/page';
import Streaming from '@/components/visualizers/nextjscosmos/app/concepts/streaming/page';
import UseClient from '@/components/visualizers/nextjscosmos/app/concepts/use-client/page';

const topicComponentsMap: Record<string, React.ComponentType> = {
  'app-router-overview': AppRouterOverview,
  'caching-revalidation': CachingRevalidation,
  'client-components': ClientComponents,
  'client-fetching': ClientFetching,
  'deployment-model': DeploymentModel,
  'dynamic-routes': DynamicRoutes,
  'error-boundaries': ErrorBoundaries,
  'fetch-options': FetchOptions,
  'file-based-routing': FileBasedRouting,
  'font-optimization': FontOptimization,
  'form-handling': FormHandling,
  'hydration': Hydration,
  'image-optimization': ImageOptimization,
  'intercepting-routes': InterceptingRoutes,
  'isr': ISR,
  'layouts-and-templates': LayoutsAndTemplates,
  'loading-ui': LoadingUI,
  'metadata-api': MetadataAPI,
  'middleware': Middleware,
  'nested-routes': NestedRoutes,
  'not-found-routes': NotFoundRoutes,
  'optimistic-updates': OptimisticUpdates,
  'parallel-routes': ParallelRoutes,
  'ppr': PPR,
  'route-groups': RouteGroups,
  'route-handlers': RouteHandlers,
  'rsc': RSC,
  'server-actions': ServerActions,
  'server-client-boundary': ServerClientBoundary,
  'server-fetching': ServerFetching,
  'server-only': ServerOnly,
  'ssg': SSG,
  'ssr': SSR,
  'streaming': Streaming,
  'use-client': UseClient,
};

export default function NextJSCosmosClientPage({ slug }: { slug: string[] }) {
  const mainRoute = slug[0];
  const subRoute = slug[1];

  const renderContent = () => {
    if (!mainRoute) {
      return <HomePage />;
    }

    if (mainRoute === 'concepts') {
      if (!subRoute) {
        return <ConceptsCatalogPage />;
      }
      const TopicComp = topicComponentsMap[subRoute];
      if (TopicComp) {
        return <TopicComp />;
      }
      return <ConceptsCatalogPage />;
    }

    if (mainRoute === 'errors') {
      if (!subRoute) {
        return <ErrorsCatalogPage />;
      }
      return <ErrorDetailPage params={Promise.resolve({ slug: subRoute })} />;
    }

    if (mainRoute === 'playground') {
      return <PlaygroundPage />;
    }

    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-zinc-950 text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-1">{renderContent()}</main>
      <Footer />
    </div>
  );
}
