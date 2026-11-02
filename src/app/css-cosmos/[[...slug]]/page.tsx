import React from 'react';
import { notFound } from 'next/navigation';
import RootLayout from '@/components/visualizers/cssviz/components/layout/RootLayout';
import Home from '@/components/visualizers/cssviz/pages/Home';
import Concepts from '@/components/visualizers/cssviz/pages/Concepts';
import CssLab from '@/components/visualizers/cssviz/pages/CssLab';
import ProblemList from '@/components/visualizers/cssviz/pages/ProblemList';
import ProblemSolver from '@/components/visualizers/cssviz/pages/ProblemSolver';
import TopicPage from '@/components/visualizers/cssviz/pages/topics/TopicPage';
import { topics } from '@/components/visualizers/cssviz/data/topics';
import { cssProblems } from '@/components/visualizers/cssviz/data/problems';

export function generateStaticParams() {
    const topicParams = topics.map(topic => ({ slug: ['topics', topic.path.replace(/^\//, '')] }));
    const directTopicParams = topics.map(topic => ({ slug: [topic.path.replace(/^\//, '')] }));
    const problemParams = cssProblems.map(p => ({ slug: ['problems', String(p.id)] }));
    return [
        { slug: [] },
        { slug: ['concepts'] },
        { slug: ['lab'] },
        { slug: ['problems'] },
        ...problemParams,
        ...topicParams,
        ...directTopicParams,
    ];
}

export default async function CssCosmosPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const firstSegment = slug && slug.length > 0 ? slug[0] : '';
    const secondSegment = slug && slug.length > 1 ? slug[1] : '';

    let content = <Home />;

    if (firstSegment === 'concepts') {
        content = <Concepts />;
    } else if (firstSegment === 'lab') {
        content = <CssLab />;
    } else if (firstSegment === 'problems') {
        if (secondSegment) {
            content = <ProblemSolver problemId={secondSegment} />;
        } else {
            content = <ProblemList />;
        }
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
