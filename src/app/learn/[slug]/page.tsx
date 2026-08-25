import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { topics } from '@/data/topics';
import { VisualizerShell } from '@/components/visualizers/VisualizerShell';
import { VisualizerRegistry } from '@/components/visualizers/VisualizerRegistry';

export function generateStaticParams() {
    return topics
        .filter((t) => t.status === 'active')
        .map((t) => ({ slug: t.slug }));
}

const BASE_URL = 'https://cscosmos.vercel.app';

// /learn/<slug> routes mirror the canonical engine URLs for convenience.
// Tell crawlers which copy counts so the mirrors never compete in search.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const topic = topics.find((t) => t.slug === slug && t.status === 'active');
    if (!topic?.url || topic.url === `/learn/${topic.slug}`) {
        return {};
    }
    return {
        title: `${topic.name} - CSCosmos`,
        alternates: { canonical: BASE_URL + topic.url },
    };
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const topic = topics.find((t) => t.slug === slug);

    if (!topic || topic.status !== 'active') {
        notFound();
    }

    return (
        <VisualizerShell topic={topic}>
            <VisualizerRegistry slug={slug} topic={topic} />
        </VisualizerShell>
    );
}
