import { notFound } from 'next/navigation';
import { topics } from '@/data/topics';
import { VisualizerShell } from '@/components/visualizers/VisualizerShell';
import { VisualizerRegistry } from '@/components/visualizers/VisualizerRegistry';

export function generateStaticParams() {
    return topics
        .filter((t) => t.status === 'active')
        .map((t) => ({ slug: t.slug }));
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
