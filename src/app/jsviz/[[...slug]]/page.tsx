import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/visualizers/jsviz/components/Navbar';
import Footer from '@/components/visualizers/jsviz/components/Footer';
import Home from '@/components/visualizers/jsviz/pages/Home';
import Learn from '@/components/visualizers/jsviz/pages/Learn';
import Topic from '@/components/visualizers/jsviz/pages/Topic';
import Practice from '@/components/visualizers/jsviz/pages/Practice';
import Problem from '@/components/visualizers/jsviz/pages/Problem';
import Playground from '@/components/visualizers/jsviz/pages/Playground';
import { topics } from '@/components/visualizers/jsviz/data/topics';
import { problems } from '@/components/visualizers/jsviz/data/problems';

export function generateStaticParams() {
    const allTopicItems = topics.flatMap(cat => cat.items);
    const topicParams = allTopicItems.map(item => ({ slug: ['topic', item.id] }));
    const problemParams = problems.map(p => ({ slug: ['problem', p.id] }));

    return [
        { slug: [] },
        { slug: ['learn'] },
        { slug: ['practice'] },
        { slug: ['playground'] },
        ...topicParams,
        ...problemParams,
    ];
}

export default async function JsVizPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const firstSegment = slug && slug.length > 0 ? slug[0] : '';
    const secondSegment = slug && slug.length > 1 ? slug[1] : '';

    let content = <Home />;

    if (firstSegment === 'learn') {
        content = <Learn />;
    } else if (firstSegment === 'practice') {
        content = <Practice />;
    } else if (firstSegment === 'playground') {
        content = <Playground />;
    } else if (firstSegment === 'topic') {
        if (!secondSegment) notFound();
        content = <Topic topicId={secondSegment} />;
    } else if (firstSegment === 'problem') {
        if (!secondSegment) notFound();
        content = <Problem problemId={secondSegment} />;
    } else if (firstSegment !== '') {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
            <Navbar />
            <main className="flex-grow">
                {content}
            </main>
            <Footer />
        </div>
    );
}
