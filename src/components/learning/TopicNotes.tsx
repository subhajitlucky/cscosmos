"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ExternalLink, NotebookPen } from "lucide-react";
import { siteConfig } from "@/config/site";

const NOTES_KEY = "cscosmos:notes:v1";
const NOTES_EVENT = "cscosmos:notes-updated";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(NOTES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(NOTES_EVENT, callback);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(NOTES_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerSnapshot(): string {
  return "";
}

export function TopicNotes({ slug, name, domain }: { slug: string; name: string; domain: string }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const notes = useMemo(() => {
    try {
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return {};
    }
  }, [raw]);

  const update = (value: string) => {
    const next = { ...notes, [slug]: value };
    try {
      window.localStorage.setItem(NOTES_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(NOTES_EVENT));
    } catch {
      // Storage can be unavailable; the textarea stays editable for this session.
    }
  };

  const issueUrl = `${siteConfig.links.github}/issues/new?title=${encodeURIComponent(
    `[Topic] ${name}`
  )}&body=${encodeURIComponent(
    `Topic: ${name}\nPath: ${domain}/${slug}\n\nWhat should be fixed?\n`
  )}`;

  return (
    <details className="group rounded-xl border border-border bg-card/60">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <NotebookPen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Notes
          <span className="font-mono text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
            saved locally
          </span>
        </span>
        <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
      </summary>

      <div className="border-t border-border p-4 pt-3">
        <label htmlFor={`topic-notes-${slug}`} className="sr-only">
          Notes for {name}
        </label>
        <textarea
          id={`topic-notes-${slug}`}
          value={notes[slug] ?? ""}
          onChange={(event) => update(event.target.value)}
          placeholder="Write your own summary, gotchas, or questions..."
          rows={4}
          className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] text-muted-foreground">
            Notes stay in this browser. They are not uploaded.
          </p>
          <a
            href={issueUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Suggest an edit
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </details>
  );
}
