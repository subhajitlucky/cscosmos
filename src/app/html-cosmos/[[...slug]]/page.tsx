import React from 'react';
import { notFound } from 'next/navigation';
import Layout from '@/components/visualizers/htmlviz/components/layout/Layout';
import Home from '@/components/visualizers/htmlviz/features/home/Home';
import ConceptsGrid from '@/components/visualizers/htmlviz/features/concepts/ConceptsGrid';
import TopicPage from '@/components/visualizers/htmlviz/features/concepts/TopicPage';
import CompilerPage from '@/components/visualizers/htmlviz/features/compiler/CompilerPage';
import ProblemList from '@/components/visualizers/htmlviz/features/problems/ProblemList';
import ProblemSolver from '@/components/visualizers/htmlviz/features/problems/ProblemSolver';
import About from '@/components/visualizers/htmlviz/features/about/About';
import { htmlTags } from '@/components/visualizers/htmlviz/data/html-tags';
import { problems } from '@/components/visualizers/htmlviz/data/problems';

/** The lookup `ProblemSolver` performs, used here so the params cannot drift from the data. */
type HtmlProblem = { id: number | string };

export function generateStaticParams() {
    const learnParams = htmlTags.map(tag => ({ slug: ['learn', tag.id] }));
    // FS-18: this listed `problems/1`–`problems/3` by hand while `ProblemList` links every one
    // of the 50 problems in `data/problems.js`, so 47 challenge routes were never pre-rendered.
    const problemParams = (problems as HtmlProblem[]).map(problem => ({
        slug: ['problems', String(problem.id)],
    }));
    return [
        { slug: [] },
        { slug: ['learn'] },
        ...learnParams,
        { slug: ['playground'] },
        { slug: ['problems'] },
        ...problemParams,
        { slug: ['about'] },
    ];
}

export default async function HtmlCosmosPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const firstSegment = slug && slug.length > 0 ? slug[0] : '';
    const secondSegment = slug && slug.length > 1 ? slug[1] : '';

    let content = <Home />;

    if (firstSegment === 'learn') {
        if (secondSegment) {
            content = <TopicPage topicId={secondSegment} />;
        } else {
            content = <ConceptsGrid />;
        }
    } else if (firstSegment === 'playground') {
        content = <CompilerPage />;
    } else if (firstSegment === 'problems') {
        if (secondSegment) {
            content = <ProblemSolver problemId={secondSegment} />;
        } else {
            content = <ProblemList />;
        }
    } else if (firstSegment === 'about') {
        content = <About />;
    } else if (firstSegment !== '') {
        notFound();
    }

    return (
        <Layout>
            {content}
        </Layout>
    );
}
