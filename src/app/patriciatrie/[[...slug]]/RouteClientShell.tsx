'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';
import { ThemeProvider } from '@/components/visualizers/patriciatrie/hooks/useTheme';
import Layout from '@/components/visualizers/patriciatrie/components/layout/Layout';

const Home = dynamic(() => import('@/components/visualizers/patriciatrie/pages/Home'), { ssr: false });
const Learn = dynamic(() => import('@/components/visualizers/patriciatrie/pages/Learn'), { ssr: false });
const TopicPage = dynamic(() => import('@/components/visualizers/patriciatrie/pages/TopicPage'), { ssr: false });
const Playground = dynamic(() => import('@/components/visualizers/patriciatrie/pages/Playground'), { ssr: false });

export default function RouteClientShell({ slug }: { slug: string[] }) {
  const first = slug[0] || '';
  const second = slug[1] || '';

  let pageContent = <Home />;

  if (first === 'learn' || first === 'concepts') {
    if (second) {
      pageContent = <TopicPage />;
    } else {
      pageContent = <Learn />;
    }
  } else if (first === 'topic' && second) {
    pageContent = <TopicPage />;
  } else if (first === 'playground' || first === 'lab') {
    pageContent = <Playground />;
  } else if (first !== '') {
    pageContent = <TopicPage />;
  }

  const routeParams = {
    topicId: second || first,
    id: second || first,
    conceptId: second || first,
    slug: second || first
  };

  return (
    <ThemeProvider>
      <RouteProvider basePath="/patriciatrie" params={routeParams}>
        <Layout>
          {pageContent}
        </Layout>
      </RouteProvider>
    </ThemeProvider>
  );
}
