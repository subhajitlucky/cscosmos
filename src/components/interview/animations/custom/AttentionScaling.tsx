'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const MAX_EXP = 9;
const MAX_SIGMA = Math.sqrt(2 ** MAX_EXP);

export function AttentionScaling() {
  const [exp, setExp] = useState(MAX_EXP);
  const dk = 2 ** exp;
  const sigma = Math.sqrt(dk);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="space-y-4 px-4 py-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Why divide attention scores by √d_k?</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Each attention score is a sum of d_k products, so its standard deviation grows with √d_k. Dividing by
            √d_k keeps the logits at σ = 1.
          </p>
        </div>

        <div
          className="flex items-end gap-1 sm:gap-2"
          role="img"
          aria-label="Standard deviation of dot products as dimension doubles from 1 to 512"
        >
          {Array.from({ length: MAX_EXP + 1 }, (_, e) => {
            const selected = e === exp;
            const redHeight = (Math.sqrt(2 ** e) / MAX_SIGMA) * 100;
            const greenHeight = (1 / MAX_SIGMA) * 100;
            return (
              <div key={e} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-32 w-full items-end gap-0.5 rounded-md border px-0.5 pt-0.5',
                    selected ? 'border-primary/60 bg-primary/5' : 'border-transparent bg-muted/40',
                  )}
                >
                  <div
                    className="w-1/2 rounded-t-sm bg-red-500/70"
                    style={{ height: `${redHeight}%` }}
                    title={`unscaled σ ≈ ${Math.sqrt(2 ** e).toFixed(2)}`}
                  />
                  <div
                    className="w-1/2 rounded-t-sm bg-green-500/70"
                    style={{ height: `${greenHeight}%` }}
                    title="scaled σ = 1.00"
                  />
                </div>
                <span className={cn('font-mono text-[9px]', selected ? 'text-primary' : 'text-muted-foreground')}>
                  {2 ** e}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-sm bg-red-500/70" aria-hidden="true" />
            unscaled σ ≈ √d_k
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-sm bg-green-500/70" aria-hidden="true" />
            scaled σ = 1
          </span>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-foreground" htmlFor="attention-dk">
            d_k = {dk}
          </label>
          <input
            id="attention-dk"
            type="range"
            min={0}
            max={MAX_EXP}
            step={1}
            value={exp}
            onChange={(event) => setExp(Number(event.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            <span className="text-red-600 dark:text-red-400">unscaled σ ≈ √d_k = {sigma.toFixed(2)}</span>
            <span className="text-green-600 dark:text-green-400">scaled σ = 1.00</span>
          </div>
        </div>

        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          softmax over logits with σ ≈ √d_k saturates: nearly all weight collapses onto one token and gradients
          vanish.
        </p>
      </div>
    </div>
  );
}
