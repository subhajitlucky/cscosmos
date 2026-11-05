import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Home from '@/components/visualizers/websecureviz/pages/Home';
import Concepts from '@/components/visualizers/websecureviz/pages/Concepts';
import Lab from '@/components/visualizers/websecureviz/pages/Lab';
import Problems from '@/components/visualizers/websecureviz/pages/Problems';
import TopicLesson from '@/components/visualizers/websecureviz/pages/TopicLesson';
import About from '@/components/visualizers/websecureviz/pages/About';
import Navbar from '@/components/visualizers/websecureviz/components/Navbar';
import Footer from '@/components/visualizers/websecureviz/components/Footer';
import { securityTopics } from '@/components/visualizers/websecureviz/data/topics';
import { TOPIC_BASE_PATH } from '@/components/visualizers/websecureviz/data/topic';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['lab'] },
    { slug: ['problems'] },
    { slug: ['about'] },
    // Legacy routes preserved for backward compatibility
    { slug: ['browser-security'] },
    { slug: ['cors'] },
    { slug: ['xss'] },
    { slug: ['csrf'] },
    { slug: ['csp'] },
    { slug: ['exercises'] },
    { slug: ['simulations'] },
    // Authored curriculum topics
    ...securityTopics.map((topic) => ({ slug: ['topics', topic.id] })),
  ];
}

function pageMetadata(title: string, description: string, canonicalPath: string): Metadata {
  const canonicalUrl = `${siteConfig.url}${canonicalPath}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'CSCosmos',
      type: 'website',
    },
    twitter: { card: 'summary' },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  if (first === 'concepts') {
    return pageMetadata(
      'Web Security Concepts & Mental Models - CSCosmos',
      `All ${securityTopics.length} core architectural modules of modern browser security and defense.`,
      `${TOPIC_BASE_PATH}/concepts`
    );
  }

  if (first === 'topics') {
    const topic = securityTopics.find((t) => t.id === second);
    return topic
      ? pageMetadata(
          `${topic.name} | Web Security - CSCosmos`,
          topic.content.definition,
          `${TOPIC_BASE_PATH}/topics/${topic.id}`
        )
      : { title: 'Security Topic Not Found - CSCosmos' };
  }

  if (first === 'lab' || first === 'simulations') {
    return pageMetadata(
      'Web Security Interactive Lab - CSCosmos',
      'Test live CSP policy rules, CORS preflights, XSS sanitizers, and SameSite cookie configurations in a safe sandbox.',
      `${TOPIC_BASE_PATH}/lab`
    );
  }

  if (first === 'problems' || first === 'exercises') {
    return pageMetadata(
      'Web Security Practice Arena (52 Problems) - CSCosmos',
      'Master Same-Origin Policy, CORS, XSS, CSRF, CSP Level 3, and browser isolation with 52 interactive questions and detailed explanations.',
      `${TOPIC_BASE_PATH}/problems`
    );
  }

  if (first === 'about') {
    return pageMetadata(
      'About Web Security Engine - CSCosmos',
      'Visual learning engine for web browser security models, attack surfaces, and defense-in-depth mitigations.',
      `${TOPIC_BASE_PATH}/about`
    );
  }

  return pageMetadata(
    'Web Security (XSS, CSRF, CSP, CORS) - CSCosmos',
    'Interactive visualization and deep-dive learning module for Same-Origin Policy, CORS preflights, XSS prevention, CSRF mitigations, and CSP Level 3.',
    TOPIC_BASE_PATH
  );
}

function buildJsonLd(first: string, second: string) {
  const provider = { '@type': 'Organization', name: 'CSCosmos', url: siteConfig.url };

  if (first === 'concepts') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Web Security Core Curriculum',
      numberOfItems: securityTopics.length,
      itemListElement: securityTopics.map((topic, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: topic.name,
        url: `${siteConfig.url}${TOPIC_BASE_PATH}/topics/${topic.id}`,
      })),
      provider,
    };
  }

  if (first === 'topics') {
    const topic = securityTopics.find((item) => item.id === second);
    if (!topic) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: topic.name,
      description: topic.content.definition,
      url: `${siteConfig.url}${TOPIC_BASE_PATH}/topics/${topic.id}`,
      learningResourceType: 'Interactive Security Visualization',
      educationalLevel: 'Intermediate',
      inLanguage: 'en',
      isAccessibleForFree: true,
      provider,
    };
  }

  if (first === 'lab' || first === 'simulations') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Web Security Interactive Lab',
      url: `${siteConfig.url}${TOPIC_BASE_PATH}/lab`,
      applicationCategory: 'EducationalApplication',
      isAccessibleForFree: true,
      provider,
    };
  }

  if (first === 'problems' || first === 'exercises') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Web Security 52 Practice Problems',
      description: '52 comprehensive practice questions covering SOP, CORS, XSS, CSRF, CSP, cookies, and defense-in-depth headers.',
      url: `${siteConfig.url}${TOPIC_BASE_PATH}/problems`,
      isAccessibleForFree: true,
      provider,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Web Security (XSS, CSRF, CSP, CORS)',
    description: 'A visual, interactive guide to browser security boundaries, attack vectors, and defense-in-depth engineering.',
    url: `${siteConfig.url}${TOPIC_BASE_PATH}`,
    isAccessibleForFree: true,
    provider,
  };
}

export default async function WebSecurityPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const firstSegment = slug && slug.length > 0 ? slug[0] : '';
  const secondSegment = slug && slug.length > 1 ? slug[1] : '';
  const jsonLd = buildJsonLd(firstSegment, secondSegment);

  let content = <Home />;

  if (firstSegment === 'concepts') {
    content = <Concepts />;
  } else if (firstSegment === 'lab' || firstSegment === 'simulations') {
    content = <Lab />;
  } else if (firstSegment === 'problems' || firstSegment === 'exercises') {
    content = <Problems />;
  } else if (firstSegment === 'about') {
    content = <About />;
  } else if (firstSegment === 'topics') {
    if (!secondSegment || !securityTopics.some((t) => t.id === secondSegment)) {
      notFound();
    }
    content = <TopicLesson topicId={secondSegment} />;
  } else if (firstSegment === 'browser-security') {
    content = <TopicLesson topicId="same-origin-policy" />;
  } else if (firstSegment === 'cors') {
    content = <TopicLesson topicId="cors-architecture" />;
  } else if (firstSegment === 'xss') {
    content = <TopicLesson topicId="xss-cross-site-scripting" />;
  } else if (firstSegment === 'csrf') {
    content = <TopicLesson topicId="csrf-and-samesite" />;
  } else if (firstSegment === 'csp') {
    content = <TopicLesson topicId="content-security-policy" />;
  } else if (firstSegment !== '') {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <div className="flex-1 px-4 sm:px-6 max-w-7xl mx-auto w-full pt-6">
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        {content}
      </div>
      <Footer />
    </div>
  );
}
