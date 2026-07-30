import React from 'react';
import { notFound } from 'next/navigation';
import Home from '@/components/visualizers/webprotocolsviz/pages/Home';
import LearningPath from '@/components/visualizers/webprotocolsviz/pages/LearningPath';
import Playground from '@/components/visualizers/webprotocolsviz/pages/Playground';
import TopicLesson from '@/components/visualizers/webprotocolsviz/pages/TopicLesson';
import Footer from '@/components/visualizers/webprotocolsviz/components/Footer';

export function generateStaticParams() {
    return [
        { slug: [] },
        { slug: ['path'] },
        { slug: ['playground'] },
        { slug: ['topics', 'http-intro'] },
        { slug: ['topics', 'http-methods'] },
        { slug: ['topics', 'headers-deep-dive'] },
        { slug: ['topics', 'status-codes'] },
        { slug: ['topics', 'caching-basics'] },
        { slug: ['topics', 'cache-control'] },
        { slug: ['topics', 'validation-etags'] },
        { slug: ['topics', 'cdns-edge'] },
        { slug: ['topics', 'cookies-sessions'] },
        { slug: ['topics', 'cors-security'] },
        { slug: ['topics', 'performance-http23'] },
    ];
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
        if (!secondSegment) {
            notFound();
        }
        content = <TopicLesson topicId={secondSegment} />;
    } else if (firstSegment !== '') {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors pt-6">
            <div className="flex-1 px-4 sm:px-6 max-w-6xl mx-auto w-full">
                {content}
            </div>
            <Footer />
        </div>
    );
}
