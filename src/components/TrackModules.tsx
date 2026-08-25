'use client';

import Link from 'next/link';
import { Check, RotateCcw } from 'lucide-react';

import { topics } from '@/data/topics';
import type { Track, TrackModule } from '@/data/tracks';
import { useTrackProgress } from '@/lib/track-progress';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';

/** Map an engine id to its existing live route (topics.ts owns the canonical urls). */
function resolveEngineHref(engineId: string): string {
    const topic = topics.find((t) => t.slug === engineId && t.status === 'active');
    return topic?.url ?? '/' + engineId;
}

interface TrackModulesProps {
    track: Track;
}

export function TrackModules({ track }: TrackModulesProps) {
    const { doneCount, hydrated, isDone, toggle, reset } = useTrackProgress(track.slug);
    const total = track.modules.length;

    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold">Your progress</p>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground" aria-live="polite">
                            {doneCount} of {total} modules complete
                        </span>
                        {hydrated && doneCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={reset}>
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset
                            </Button>
                        )}
                    </div>
                </div>
                <ProgressBar value={doneCount} max={total} ariaLabel={track.title + ' progress'} />
            </div>

            <ol className="space-y-4">
                {track.modules.map((module, index) => (
                    <ModuleRow
                        key={module.id}
                        module={module}
                        index={index}
                        href={resolveEngineHref(module.engineId)}
                        done={isDone(module.id)}
                        onToggle={() => toggle(module.id)}
                    />
                ))}
            </ol>
        </div>
    );
}

interface ModuleRowProps {
    module: TrackModule;
    index: number;
    href: string;
    done: boolean;
    onToggle: () => void;
}

function ModuleRow({ module, index, href, done, onToggle }: ModuleRowProps) {
    return (
        <li
            className={cn(
                'glass-card card-hover rounded-2xl p-5 transition-all duration-200',
                done && 'border-emerald-400/60 dark:border-emerald-500/40',
            )}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold text-secondary-foreground">
                        {index + 1}
                    </span>
                    <div className="min-w-0 space-y-2">
                        <h3 className={cn('font-semibold leading-tight', done && 'text-muted-foreground')}>
                            {module.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                                /{module.engineId}
                            </code>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
                    <Link
                        href={href}
                        className="focus-ring inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        aria-label={'Open module: ' + module.title}
                    >
                        {done ? 'Revisit module' : 'Start module'}
                    </Link>
                    <Button
                        variant={done ? 'primary' : 'outline'}
                        size="sm"
                        onClick={onToggle}
                        aria-pressed={done}
                    >
                        {done ? (
                            <>
                                <Check className="h-3.5 w-3.5" />
                                Done
                            </>
                        ) : (
                            'Mark done'
                        )}
                    </Button>
                </div>
            </div>
        </li>
    );
}
