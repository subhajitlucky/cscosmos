'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

const Home = dynamic(() => import('@/components/visualizers/aimathviz/pages/HomePage'), { ssr: false });
const Learn = dynamic(() => import('@/components/visualizers/aimathviz/pages/LearnPage'), { ssr: false });
const TopicPage = dynamic(() => import('@/components/visualizers/aimathviz/pages/TopicPage'), { ssr: false });
const Playground = dynamic(() => import('@/components/visualizers/aimathviz/pages/PlaygroundPage'), { ssr: false });
const About = dynamic(() => import('@/components/visualizers/aimathviz/pages/AboutPage'), { ssr: false });

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
  } else if (first === 'about') {
    pageContent = <About />;
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
    <RouteProvider basePath="/aimathviz" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
