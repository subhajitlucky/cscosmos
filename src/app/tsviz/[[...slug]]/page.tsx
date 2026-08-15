import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/visualizers/tsviz/layouts/MainLayout';
import { Home } from '@/components/visualizers/tsviz/pages/Home';
import { Concepts } from '@/components/visualizers/tsviz/pages/Concepts';
import { Topic } from '@/components/visualizers/tsviz/pages/Topic';
import { Problems } from '@/components/visualizers/tsviz/pages/Problems';
import { ProblemDetail } from '@/components/visualizers/tsviz/pages/ProblemDetail';
import { Playground } from '@/components/visualizers/tsviz/pages/Playground';
import { concepts } from '@/components/visualizers/tsviz/data/concepts';
import { problems } from '@/components/visualizers/tsviz/data/problems';

export function generateStaticParams() {
    const conceptParams = concepts.map((c) => ({ slug: ['concepts', c.id] }));
    const problemParams = problems.map((p) => ({ slug: ['problems', p.id] }));

    return [
        { slug: [] },
        { slug: ['concepts'] },
        ...conceptParams,
        { slug: ['problems'] },
        ...problemParams,
        { slug: ['playground'] },
    ];
}

export default async function TsVizAppPage({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}) {
    const { slug } = await params;
    const first = slug && slug.length > 0 ? slug[0] : '';
    const second = slug && slug.length > 1 ? slug[1] : '';

    let content = <Home />;

    if (first === 'concepts') {
        if (second) {
            content = <Topic topicId={second} />;
        } else {
            content = <Concepts />;
        }
    } else if (first === 'problems') {
        if (second) {
            content = <ProblemDetail problemId={second} />;
        } else {
            content = <Problems />;
        }
    } else if (first === 'playground') {
        content = <Playground />;
    } else if (first !== '') {
        notFound();
    }

    return (
        <MainLayout>
            <Suspense fallback={<div className="container mx-auto py-10 text-center text-muted-foreground">Loading...</div>}>
                {content}
            </Suspense>
        </MainLayout>
    );
}
