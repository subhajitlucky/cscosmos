import { cn } from '@/lib/utils';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Completed units. */
    value: number;
    /** Total units. */
    max: number;
    ariaLabel?: string;
}

/**
 * Presentational progress bar themed with CSCosmos tokens.
 * Safe to render on the server; pair it with useTrackProgress for live data.
 */
export function ProgressBar({ value, max, className, ariaLabel, ...rest }: ProgressBarProps) {
    const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

    return (
        <div
            role="progressbar"
            aria-label={ariaLabel ?? 'Progress'}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={value}
            className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
            {...rest}
        >
            <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300 dark:bg-emerald-400"
                style={{ width: pct + '%' }}
            />
        </div>
    );
}
