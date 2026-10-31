import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/components/visualizers/crossplatformviz/styles.css';
import { Navbar } from '@/components/visualizers/crossplatformviz/components/Navbar';
import { Footer } from '@/components/visualizers/crossplatformviz/components/Footer';
import { Home } from '@/components/visualizers/crossplatformviz/pages/Home';
import { Learn } from '@/components/visualizers/crossplatformviz/pages/Learn';
import { TopicDetail } from '@/components/visualizers/crossplatformviz/pages/TopicDetail';
import { BridgeSim } from '@/components/visualizers/crossplatformviz/pages/BridgeSim';
import { EngineMatrix } from '@/components/visualizers/crossplatformviz/pages/EngineMatrix';
import { About } from '@/components/visualizers/crossplatformviz/pages/About';
import { crossPlatformTopics, getCrossPlatformTopic } from '@/components/visualizers/crossplatformviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['bridge-sim'] },
    { slug: ['engine-matrix'] },
    { slug: ['about'] },
  ];

  crossPlatformTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  if (first === 'learn') {
    if (second) {
      const topic = getCrossPlatformTopic(second);
      if (topic) {
        return {
          title: `${topic.title} | Mobile Internals | CSCosmos`,
          description: topic.summary,
        };
      }
    }
    return {
      title: 'Architecture Map | Mobile Internals | CSCosmos',
      description: '14-topic progressive curriculum covering mobile OS pipelines, React Native JSI, Flutter Impeller, and Kotlin Multiplatform.',
    };
  } else if (first === 'bridge-sim') {
    return {
      title: 'Bridge vs JSI Stress Lab | Mobile Internals | CSCosmos',
      description: 'Stress-test 60Hz and 120Hz gesture traffic across React Native Bridge, JSI, and Flutter Impeller.',
    };
  } else if (first === 'engine-matrix') {
    return {
      title: 'Engine Comparison Matrix | Mobile Internals | CSCosmos',
      description: 'Architectural comparison of React Native, Flutter, Kotlin Multiplatform, and WebViews.',
    };
  } else if (first === 'about') {
    return {
      title: 'Architecture Overview | Mobile Internals | CSCosmos',
      description: 'The science of native speed across cross-platform mobile runtimes.',
    };
  }

  return {
    title: 'Cross-Platform Mobile Internals | CSCosmos',
    description: 'Learn how modern mobile runtimes eliminate bridge latency with JSI C++ HostObjects, Fabric, Flutter Impeller, and KMP.',
  };
}

export default async function CrossPlatformVizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  let content = <Home />;

  if (first === 'learn') {
    if (second) {
      const topic = getCrossPlatformTopic(second);
      if (!topic) {
        notFound();
      }
      content = <TopicDetail topicId={second} />;
    } else {
      content = <Learn />;
    }
  } else if (first === 'bridge-sim') {
    content = <BridgeSim />;
  } else if (first === 'engine-matrix') {
    content = <EngineMatrix />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="crossplatformviz-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--cp-muted)]">Loading MOBILE::INTERNALS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
