import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Home from '@/components/visualizers/webprotocolsviz/pages/Home';
import LearningPath from '@/components/visualizers/webprotocolsviz/pages/LearningPath';
import Playground from '@/components/visualizers/webprotocolsviz/pages/Playground';
import TopicLesson from '@/components/visualizers/webprotocolsviz/pages/TopicLesson';
import Navbar from '@/components/visualizers/webprotocolsviz/components/Navbar';
import Footer from '@/components/visualizers/webprotocolsviz/components/Footer';
import { topics } from '@/components/visualizers/webprotocolsviz/data/topics';
import { TOPIC_BASE_PATH } from '@/components/visualizers/webprotocolsviz/data/topic';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
    return [
        { slug: [] },
        { slug: ['path'] },
        { slug: ['playground'] },
        // Derived from the authored curriculum. The previous hand-written list
        // named 7 topic ids that do not exist (http-methods, headers-deep-dive,
        // validation-etags, cdns-edge, cookies-sessions, cors-security,
        // performance-http23) while omitting 10 real ones, so 7 routes
        // pre-rendered empty and 10 lessons were never generated (AGENTS.md §3).
        ...topics.map((topic) => ({ slug: ['topics', topic.id] })),
    ];
}

function pageMetadata(title: string, description: string, canonicalPath: string): Metadata {
    return {
        title,
        description,
        alternates: { canonical: canonicalPath },
        openGraph: {
            title,
            description,
            url: canonicalPath,
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

    if (first === 'topics') {
        const topic = topics.find((t) => t.id === second);
        return topic
            ? pageMetadata(
                  `${topic.name} | HTTP & Web Protocols - CSCosmos`,
                  topic.content.definition,
                  `${TOPIC_BASE_PATH}/topics/${topic.id}`,
              )
            : { title: 'Topic Not Found - CSCosmos' };
    }

    if (first === 'playground') {
        return pageMetadata(
            'HTTP Protocol Playground - CSCosmos',
            'Compose a real HTTP request — method, status, headers, cookies, latency and caching — and inspect the response, headers and traffic log.',
            `${TOPIC_BASE_PATH}/playground`,
        );
    }

    if (first === 'path') {
        return pageMetadata(
            'HTTP Curriculum Path - CSCosmos',
            `All ${topics.length} modules of the HTTP and web protocols curriculum.`,
            `${TOPIC_BASE_PATH}/path`,
        );
    }

    return pageMetadata(
        'HTTP & Web Protocols - CSCosmos',
        'Interactive visualizers for HTTP, DNS, TCP/IP, caching, cookies and HTTP/3.',
        TOPIC_BASE_PATH,
    );
}


function buildJsonLd(first: string, second: string) {
    const provider = { '@type': 'Organization', name: 'CSCosmos', url: siteConfig.url };

    if (first === 'topics') {
        const topic = topics.find((item) => item.id === second);
        if (!topic) return null;
        return {
            '@context': 'https://schema.org',
            '@type': 'LearningResource',
            name: topic.name,
            description: topic.content.definition,
            url: `${siteConfig.url}${TOPIC_BASE_PATH}/topics/${topic.id}`,
            learningResourceType: 'Interactive Visualization',
            educationalLevel: 'Beginner',
            inLanguage: 'en',
            isAccessibleForFree: true,
            provider,
        };
    }

    if (first === 'path') {
        return {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'HTTP & Web Protocols learning path',
            numberOfItems: topics.length,
            itemListElement: topics.map((topic, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: topic.name,
                url: `${siteConfig.url}${TOPIC_BASE_PATH}${topic.path}`,
            })),
            provider,
        };
    }

    if (first === 'playground') {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'HTTP Protocol Playground',
            url: `${siteConfig.url}${TOPIC_BASE_PATH}/playground`,
            applicationCategory: 'EducationalApplication',
            isAccessibleForFree: true,
            provider,
        };
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: 'HTTP & Web Protocols',
        description: 'A visual, interactive guide to HTTP, DNS, TCP/IP, caching, cookies, and HTTP/3.',
        url: `${siteConfig.url}${TOPIC_BASE_PATH}`,
        isAccessibleForFree: true,
        provider,
    };
}

export default async function WebProtocolsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const firstSegment = slug && slug.length > 0 ? slug[0] : '';
    const secondSegment = slug && slug.length > 1 ? slug[1] : '';
    const jsonLd = buildJsonLd(firstSegment, secondSegment);

    let content = <Home />;

    if (firstSegment === 'path') {
        content = <LearningPath />;
    } else if (firstSegment === 'playground') {
        content = <Playground />;
    } else if (firstSegment === 'topics') {
        // Validate here so an unknown lesson 404s instead of rendering a shell
        // that only redirects once client JavaScript has loaded.
        if (!secondSegment || !topics.some((t) => t.id === secondSegment)) {
            notFound();
        }
        content = <TopicLesson topicId={secondSegment} />;
    } else if (firstSegment !== '') {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
            <Navbar />
            <div className="flex-1 px-4 sm:px-6 max-w-6xl mx-auto w-full pt-6">
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
