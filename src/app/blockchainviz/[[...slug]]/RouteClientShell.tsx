'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';
import { Layout } from '@/components/visualizers/blockchainviz/components/layout/Layout';

const LandingPage = dynamic(() => import('@/components/visualizers/blockchainviz/pages/LandingPage'), { ssr: false });
const ConceptPage = dynamic(() => import('@/components/visualizers/blockchainviz/pages/ConceptPage'), { ssr: false });
const TopicPage = dynamic(() => import('@/components/visualizers/blockchainviz/pages/TopicPage'), { ssr: false });
const ModulePage = dynamic(() => import('@/components/visualizers/blockchainviz/pages/ModulePage'), { ssr: false });

export default function RouteClientShell({ slug }: { slug: string[] }) {
  const first = slug[0] || '';
  const second = slug[1] || '';

  let pageContent = <LandingPage />;

  if (first === 'concepts') {
    if (second) {
      pageContent = <TopicPage />;
    } else {
      pageContent = <ConceptPage />;
    }
  } else if (first === 'playground') {
    pageContent = <ModulePage />;
  } else if (first !== '') {
    pageContent = <TopicPage />;
  }

  const routeParams = {
    topicId: second || first,
    id: second || first,
    slug: second || first,
  };

  return (
    <RouteProvider basePath="/blockchainviz" params={routeParams}>
      <Layout>
        {pageContent}
      </Layout>
    </RouteProvider>
  );
}
