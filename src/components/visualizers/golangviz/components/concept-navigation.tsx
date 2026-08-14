"use client";

import { getConceptNavigation } from "@/components/visualizers/golangviz/lib/curriculum";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ConceptNavigation() {
  const pathname = usePathname();
  const { prev, next } = getConceptNavigation(pathname);

  if (!prev && !next) return null;

  return (
    <div className="flex w-full items-center justify-between border-t border-[var(--panel-border)] pt-8 mt-12">
      <div>
        {prev && (
          <Link
            href={prev.href!}
            className="group flex flex-col items-start gap-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 transition hover:bg-[var(--panel-border)]"
          >
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--muted)]">
              <ChevronLeftIcon /> Previous
            </span>
            <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link
            href={next.href!}
            className="group flex flex-col items-end gap-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 transition hover:bg-[var(--panel-border)]"
          >
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--muted)]">
              Next <ChevronRightIcon />
            </span>
            <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}