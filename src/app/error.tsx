'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Route-level error boundary for the whole app.
 *
 * There was none: a render-time throw in any client component (for example the authviz
 * flashcard deck that was filtered to an empty category) surfaced Next's bare default error
 * page instead of anything that tells the visitor what happened or offers a way out.
 *
 * It must be a Client Component — that is what Next requires of `error.tsx` — and it should
 * not assume any particular engine's styling, so it sticks to the shared theme tokens.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Keep the failure visible in the console; the digest is what pairs it with the server log.
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Something broke while rendering
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
        This page hit an unexpected error
      </h1>
      <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
        The rest of the site is unaffected. You can retry this page, or head back to the topic
        index and pick something else.
      </p>
      {error.digest ? (
        <p className="font-mono text-[11px] text-muted-foreground">reference: {error.digest}</p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/topics"
          className="px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-bold transition-colors hover:bg-card"
        >
          Browse topics
        </Link>
      </div>
    </div>
  );
}
