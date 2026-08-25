import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ListChecks } from 'lucide-react';

import { tracks } from '@/data/tracks';

export const metadata: Metadata = {
    title: 'Learning Tracks - CSCosmos',
    description:
        'Curated journeys through the cosmos: free guided learning paths that sequence CSCosmos interactive engines into interview-ready outcomes.',
};

export default function TracksPage() {
    return (
        <div className="py-12">
            <div className="page-container space-y-10">
                <div className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.18em] text-primary/70">Curated Journeys</p>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Learning Tracks</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Curated journeys through the cosmos: guided sequences of our interactive engines, ordered the
                            way real mastery builds. Every track is 100% free - pick a path and start anywhere.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tracks.map((track) => {
                        return (
                            <Link
                                key={track.slug}
                                href={'/tracks/' + track.slug}
                                aria-label={'Open track: ' + track.title}
                                className="focus-ring group block h-full"
                            >
                                <article className="glass-card card-hover flex h-full flex-col justify-between rounded-2xl p-6 min-h-[220px]">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="text-xl font-bold leading-tight">{track.title}</h2>
                                            <span className="pill-badge border border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-100 shrink-0">
                                                Free
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-primary/90">{track.outcome}</p>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            <span className="pill-badge border border-border bg-secondary text-secondary-foreground normal-case tracking-normal">
                                                {track.level}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <ListChecks className="h-3.5 w-3.5" />
                                                {track.modules.length} modules
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                ~{track.estHours}h
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground group-hover:text-primary transition-colors">
                                        View curriculum &rarr;
                                    </p>
                                </article>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
