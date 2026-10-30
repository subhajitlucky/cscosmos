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
import { steps } from '@/components/visualizers/programviz/data/learningPath';
import { TOPIC_BASE_PATH } from '@/components/visualizers/programviz/data/topic';
import { siteConfig } from '@/config/site';

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
        ...steps.map((step) => ({
            slug: [step.path.replace(`${TOPIC_BASE_PATH}/`, '')],
        })),
    ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
    const { slug } = await params;
    const subRoute = slug && slug.length > 0 ? slug[0] : '';
    const meta = SUB_ROUTE_META[subRoute];
    const canonicalPath = subRoute ? `${TOPIC_BASE_PATH}/${subRoute}` : TOPIC_BASE_PATH;
    const ogImage = { url: `${TOPIC_BASE_PATH}/og${subRoute ? `?step=${subRoute}` : ''}`, width: 1200, height: 630 };

    if (!meta) {
        return {
            title: 'ProgramViz — How Programs Execute (CPU, Memory, I/O) | CSCosmos',
            description: 'Interactive visualizer for program execution: CPU basics, instruction cycle, memory layout, and I/O.',
            alternates: { canonical: canonicalPath },
            openGraph: {
                title: 'ProgramViz — How Programs Execute (CPU, Memory, I/O)',
                description: 'Interactive visualizer for program execution: CPU basics, instruction cycle, memory layout, and I/O.',
                url: canonicalPath,
                siteName: 'CSCosmos',
                type: 'website',
                images: [ogImage],
            },
            twitter: { card: 'summary_large_image' },
        };
    }

    return {
        title: `${meta.title} — ProgramViz | CSCosmos`,
        description: meta.description,
        alternates: { canonical: canonicalPath },
        openGraph: {
            title: `${meta.title} — ProgramViz`,
            description: meta.description,
            url: canonicalPath,
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
    const canonicalPath = subRoute ? `${TOPIC_BASE_PATH}/${subRoute}` : TOPIC_BASE_PATH;

    return {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: meta
            ? `${meta.title} — ProgramViz`
            : 'ProgramViz — How Programs Execute (CPU, Memory, I/O)',
        description: meta
            ? meta.description
            : 'Interactive visualizer for program execution: CPU basics, instruction cycle, memory layout, and I/O.',
        url: `${siteConfig.url}${canonicalPath}`,
        image: `${siteConfig.url}${TOPIC_BASE_PATH}/og`,
        learningResourceType: 'Interactive Visualization',
        educationalLevel: 'Beginner',
        inLanguage: 'en',
        isAccessibleForFree: true,
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
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(subRoute)).replace(/</g, '\\u003c') }}
                />
                {content}
            </Layout>
        </ProgressProvider>
    );
}
