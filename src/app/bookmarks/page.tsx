import type { Metadata } from "next";
import Link from "next/link";
import { BookmarksClient } from "@/components/learning/BookmarksClient";

export const metadata: Metadata = {
  title: "Bookmarks - CSCosmos",
  description: "Your saved CSCosmos topics, stored locally on this device.",
};

export default function BookmarksPage() {
  return (
    <div className="py-12">
      <div className="page-container max-w-6xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-primary/70">My Learning</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Bookmarks</h1>
          <p className="max-w-2xl text-muted-foreground">
            Topics you saved for later. Bookmarks persist on this device and never leave your browser.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/progress"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50"
          >
            View progress
          </Link>
          <Link
            href="/topics"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50"
          >
            Browse all topics
          </Link>
        </div>

        <BookmarksClient />
      </div>
    </div>
  );
}
