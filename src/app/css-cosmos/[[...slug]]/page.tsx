import React from 'react';
import { notFound } from 'next/navigation';
import RootLayout from '@/components/visualizers/cssviz/components/layout/RootLayout';
import Home from '@/components/visualizers/cssviz/pages/Home';
import Concepts from '@/components/visualizers/cssviz/pages/Concepts';
import Visualizers from '@/components/visualizers/cssviz/pages/Visualizers';
import TopicPage from '@/components/visualizers/cssviz/pages/topics/TopicPage';
import { topics } from '@/components/visualizers/cssviz/data/topics';

export function generateStaticParams() {
    const topicParams = topics.map(topic => ({ slug: ['topics', topic.path.replace(/^\//, '')] }));
    return [
        { slug: [] },
        { slug: ['concepts'] },
        { slug: ['visualizers'] },
        ...topicParams,
    ];
}

export default async function CssCosmosPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const firstSegment = slug && slug.length > 0 ? slug[0] : '';
    const secondSegment = slug && slug.length > 1 ? slug[1] : '';

    let content = <Home />;

    if (firstSegment === 'concepts') {
        content = <Concepts />;
    } else if (firstSegment === 'visualizers') {
        content = <Visualizers />;
    } else if (firstSegment === 'topics') {
        const foundTopic = topics.find(t => t.path.replace(/^\//, '') === secondSegment);
        if (!foundTopic) {
            notFound();
        }
        content = <TopicPage topic={foundTopic} />;
    } else if (firstSegment !== '') {
        const directTopic = topics.find(t => t.path.replace(/^\//, '') === firstSegment);
        if (directTopic) {
            content = <TopicPage topic={directTopic} />;
        } else {
            notFound();
        }
    }

    return (
        <RootLayout>
            {content}
        </RootLayout>
    );
}
