import React from 'react';
import { notFound } from 'next/navigation';
import { ProgressProvider } from '@/components/visualizers/programviz/context/ProgressContext';
import { Layout } from '@/components/visualizers/programviz/components/Layout';
import { Home } from '@/components/visualizers/programviz/pages/Home';
import { WhatIsProgram } from '@/components/visualizers/programviz/pages/WhatIsProgram';
import { CPUBasics } from '@/components/visualizers/programviz/pages/CPUBasics';
import { InstructionCycle } from '@/components/visualizers/programviz/pages/InstructionCycle';
import { MemoryBasics } from '@/components/visualizers/programviz/pages/MemoryBasics';
import { MemoryLayout } from '@/components/visualizers/programviz/pages/MemoryLayout';
import { IOBasics } from '@/components/visualizers/programviz/pages/IOBasics';
import { ExecutionSummary } from '@/components/visualizers/programviz/pages/ExecutionSummary';

export function generateStaticParams() {
    return [
        { slug: [] },
        { slug: ['what-is-a-program'] },
        { slug: ['cpu-basics'] },
        { slug: ['instruction-cycle'] },
        { slug: ['memory-basics'] },
        { slug: ['memory-layout'] },
        { slug: ['io-basics'] },
        { slug: ['execution-summary'] },
    ];
}

export default async function ProgramCosmosPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const subRoute = slug && slug.length > 0 ? slug[0] : '';

    let content = <Home />;

    if (subRoute === 'what-is-a-program') {
        content = <WhatIsProgram />;
    } else if (subRoute === 'cpu-basics') {
        content = <CPUBasics />;
    } else if (subRoute === 'instruction-cycle') {
        content = <InstructionCycle />;
    } else if (subRoute === 'memory-basics') {
        content = <MemoryBasics />;
    } else if (subRoute === 'memory-layout') {
        content = <MemoryLayout />;
    } else if (subRoute === 'io-basics') {
        content = <IOBasics />;
    } else if (subRoute === 'execution-summary') {
        content = <ExecutionSummary />;
    } else if (subRoute !== '') {
        notFound();
    }

    return (
        <ProgressProvider>
            <Layout>
                {content}
            </Layout>
        </ProgressProvider>
    );
}
