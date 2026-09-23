import React from 'react';
import type { Metadata } from 'next';
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

const SUB_ROUTE_META: Record<string, { title: string; description: string }> = {
    'what-is-a-program': {
        title: 'What Is a Program?',
        description: 'Understand what a program is, code vs data, and how compiled and interpreted code reaches the CPU.',
    },
    'cpu-basics': {
        title: 'CPU Basics',
        description: 'Visualize the CPU role, registers, ALU, and control unit with interactive diagrams.',
    },
    'instruction-cycle': {
        title: 'Instruction Execution Cycle',
        description: 'Step through fetch, decode, execute, and write-back phases of the CPU instruction cycle.',
    },
    'memory-basics': {
        title: 'Memory Basics',
        description: 'Learn how RAM stores code and data with memory addressing, bytes, and words.',
    },
    'memory-layout': {
        title: 'Program Memory Layout',
        description: 'Explore code segment, stack, heap, and global data with an animated function call stack.',
    },
    'io-basics': {
        title: 'Input / Output (I/O)',
        description: 'See how programs interact with devices through system calls and blocking vs non-blocking I/O.',
    },
    'execution-summary': {
        title: 'Complete Program Execution',
        description: 'Watch a full program execution timeline across OS, CPU, memory, and I/O.',
    },
};

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

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
    const { slug } = await params;
    const subRoute = slug && slug.length > 0 ? slug[0] : '';
    const meta = SUB_ROUTE_META[subRoute];
    const basePath = '/program-cosmos';
    const url = subRoute ? `${basePath}/${subRoute}` : basePath;
    const ogImage = { url: `${basePath}/og${subRoute ? `?step=${subRoute}` : ''}`, width: 1200, height: 630 };

    if (!meta) {
        return {
            title: 'ProgramViz — How Programs Execute (CPU, Memory, I/O)',
            description: 'Interactive visualizer for program execution: CPU basics, instruction cycle, memory layout, and I/O.',
            alternates: { canonical: url },
            openGraph: {
                title: 'ProgramViz — How Programs Execute (CPU, Memory, I/O)',
                description: 'Interactive visualizer for program execution: CPU basics, instruction cycle, memory layout, and I/O.',
                url,
                siteName: 'CSCosmos',
                type: 'website',
                images: [ogImage],
            },
            twitter: { card: 'summary_large_image' },
        };
    }

    return {
        title: `${meta.title} — ProgramViz`,
        description: meta.description,
        alternates: { canonical: url },
        openGraph: {
            title: `${meta.title} — ProgramViz`,
            description: meta.description,
            url,
            siteName: 'CSCosmos',
            type: 'article',
            images: [ogImage],
        },
        twitter: { card: 'summary_large_image' },
    };
}

function buildJsonLd(subRoute: string) {
    const meta = SUB_ROUTE_META[subRoute];
    const isStep = Boolean(meta);
    const stepNumber = isStep ? Object.keys(SUB_ROUTE_META).indexOf(subRoute) + 1 : undefined;

    return {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: meta
            ? `${meta.title} — ProgramViz`
            : 'ProgramViz — How Programs Execute (CPU, Memory, I/O)',
        description: meta
            ? meta.description
            : 'Interactive visualizer for program execution: CPU basics, instruction cycle, memory layout, and I/O.',
        learningResourceType: 'Interactive Visualization',
        educationalLevel: 'Beginner',
        teaches: meta?.title ?? 'How Programs Execute',
        ...(isStep && { position: stepNumber }),
        isPartOf: {
            '@type': 'Course',
            name: 'How Programs Execute (CPU, Memory, I/O)',
            provider: { '@type': 'Organization', name: 'CSCosmos' },
        },
        provider: { '@type': 'Organization', name: 'CSCosmos' },
    };
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(subRoute)) }}
                />
                {content}
            </Layout>
        </ProgressProvider>
    );
}
