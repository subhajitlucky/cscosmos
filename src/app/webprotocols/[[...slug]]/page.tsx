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
            ? {
                  title: `${topic.name} | HTTP & Web Protocols - CSCosmos`,
                  description: topic.content.definition,
              }
            : { title: 'Topic Not Found - CSCosmos' };
    }

    if (first === 'playground') {
        return {
            title: 'HTTP Protocol Playground - CSCosmos',
            description:
                'Compose a real HTTP request — method, status, headers, cookies, latency and caching — and inspect the response, headers and traffic log.',
        };
    }

    if (first === 'path') {
        return {
            title: 'HTTP Curriculum Path - CSCosmos',
            description: `All ${topics.length} modules of the HTTP and web protocols curriculum.`,
        };
    }

    return {
        title: 'HTTP & Web Protocols - CSCosmos',
        description:
            'Interactive visualizers for HTTP, DNS, TCP/IP, caching, cookies and HTTP/3.',
    };
}

export default async function WebProtocolsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const firstSegment = slug && slug.length > 0 ? slug[0] : '';
    const secondSegment = slug && slug.length > 1 ? slug[1] : '';

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
                {content}
            </div>
            <Footer />
        </div>
    );
}
