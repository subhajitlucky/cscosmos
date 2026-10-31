import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProgressProvider } from '@/components/visualizers/programviz/context/ProgressContext';
import { Layout } from '@/components/visualizers/programviz/components/Layout';
import { Home } from '@/components/visualizers/programviz/pages/Home';
import { WhatIsProgram } from '@/components/visualizers/programviz/pages/WhatIsProgram';
import { DataRepresentation } from '@/components/visualizers/programviz/pages/DataRepresentation';
import { CPUBasics } from '@/components/visualizers/programviz/pages/CPUBasics';
import { InstructionCycle } from '@/components/visualizers/programviz/pages/InstructionCycle';
import { MemoryBasics } from '@/components/visualizers/programviz/pages/MemoryBasics';
import { MemoryLayout } from '@/components/visualizers/programviz/pages/MemoryLayout';
import { MultitaskingProcesses } from '@/components/visualizers/programviz/pages/MultitaskingProcesses';
import { IOBasics } from '@/components/visualizers/programviz/pages/IOBasics';
import { ExecutablePipeline } from '@/components/visualizers/programviz/pages/ExecutablePipeline';
import { ExecutionSummary } from '@/components/visualizers/programviz/pages/ExecutionSummary';
import { steps } from '@/components/visualizers/programviz/data/learningPath';
import { TOPIC_BASE_PATH } from '@/components/visualizers/programviz/data/topic';
import { siteConfig } from '@/config/site';

const SUB_ROUTE_META: Record<string, { title: string; description: string }> = {
    'what-is-a-program': {
        title: 'What Is a Program?',
        description: 'Understand instructions, source code vs machine code, and what happens when we click Run.',
    },
    'how-computers-understand-data': {
        title: 'How Does a Computer Understand Data?',
        description: 'Explore bits, bytes, binary, hexadecimal, ASCII text, and RGB pixel representations.',
    },
    'cpu-basics': {
        title: 'Understanding the CPU',
        description: 'Discover CPU cores, the ALU, Control Unit, hardware registers, and the CPU clock.',
    },
    'instruction-cycle': {
        title: 'How Does a CPU Execute Instructions?',
        description: 'Step through fetch, decode, execute, and write-back with an interactive 8-bit assembly simulator.',
    },
    'memory-basics': {
        title: 'Understanding Computer Memory',
        description: 'Learn about RAM, ROM, storage, memory addresses, and read/write operations with an interactive grid.',
    },
    'memory-layout': {
        title: 'How Does a Program Live in Memory?',
        description: 'Explore process address space: Code, Data, Heap, and Stack with an animated call stack.',
    },
    'multitasking-and-processes': {
        title: 'How Does a Computer Run Multiple Programs?',
        description: 'Understand processes, threads, time-sharing, timer interrupts, and context switching.',
    },
    'io-basics': {
        title: 'How Does a Program Interact With Hardware?',
        description: 'Learn how programs communicate with devices via system calls, drivers, and blocking vs non-blocking I/O.',
    },
    'how-code-becomes-an-executable': {
        title: 'How Does Code Become an Executable?',
        description: 'Compare native compilers, linkers, bytecode virtual machines, and JIT engines across C, Java, JS, and Python.',
    },
    'execution-summary': {
        title: 'Putting Everything Together',
        description: 'Watch the complete 13-milestone journey of a C program from source code to screen output.',
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
            description: 'Interactive beginner-friendly visualizer for computer architecture, CPU execution, memory layout, and system calls.',
            alternates: { canonical: canonicalPath },
            openGraph: {
                title: 'ProgramViz — How Programs Execute (CPU, Memory, I/O)',
                description: 'Interactive beginner-friendly visualizer for computer architecture, CPU execution, memory layout, and system calls.',
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
    } else if (subRoute === 'how-computers-understand-data') {
        content = <DataRepresentation />;
    } else if (subRoute === 'cpu-basics') {
        content = <CPUBasics />;
    } else if (subRoute === 'instruction-cycle') {
        content = <InstructionCycle />;
    } else if (subRoute === 'memory-basics') {
        content = <MemoryBasics />;
    } else if (subRoute === 'memory-layout') {
        content = <MemoryLayout />;
    } else if (subRoute === 'multitasking-and-processes') {
        content = <MultitaskingProcesses />;
    } else if (subRoute === 'io-basics') {
        content = <IOBasics />;
    } else if (subRoute === 'how-code-becomes-an-executable') {
        content = <ExecutablePipeline />;
    } else if (subRoute === 'execution-summary') {
        content = <ExecutionSummary />;
    } else if (subRoute !== '') {
        notFound();
    }

    return (
        <ProgressProvider>
            <Layout isHome={!subRoute}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(subRoute)).replace(/</g, '\\u003c') }}
                />
                {content}
            </Layout>
        </ProgressProvider>
    );
}
