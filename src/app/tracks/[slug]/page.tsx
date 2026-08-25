import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, ListChecks } from 'lucide-react';

import { getTrackBySlug, tracks } from '@/data/tracks';
import { TrackModules } from '@/components/TrackModules';

export function generateStaticParams() {
    return tracks.map((t) => ({ slug: t.slug }));
}

// Pure SSG: unknown slugs 404 statically instead of rendering on demand.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const track = getTrackBySlug(slug);
    if (!track) {
        return { title: 'Track not found - CSCosmos' };
    }
    return {
        title: track.title + ' - CSCosmos Learning Tracks',
        description: track.outcome,
    };
}

export default async function TrackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const track = getTrackBySlug(slug);

    if (!track) {
        notFound();
    }

    return (
        <div className="py-12">
            <div className="page-container space-y-10">
                <Link
                    href="/tracks"
                    className="focus-ring inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    All tracks
                </Link>

                <header className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.18em] text-primary/70">Learning Track</p>
                    <div className="space-y-3 max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{track.title}</h1>
                        <p className="text-lg font-medium text-primary/90">{track.outcome}</p>
                        <p className="text-muted-foreground">{track.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="pill-badge border border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-100">
                            Free forever
                        </span>
                        <span className="pill-badge border border-border bg-secondary text-secondary-foreground normal-case tracking-normal">
                            {track.level}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ListChecks className="h-3.5 w-3.5" />
                            {track.modules.length} modules
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            ~{track.estHours} hours total
                        </span>
                    </div>
                </header>

                <section aria-label={track.title + ' curriculum'} className="space-y-6">
                    <h2 className="text-2xl font-bold">Curriculum</h2>
                    <TrackModules track={track} />
                </section>
            </div>
        </div>
    );
}
