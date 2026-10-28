"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}

export function TopicComments({ slug, bare = false }: { slug: string; bare?: boolean }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(slug)}/comments`, {
        cache: "no-store",
      });
      const payload = await response.json();
      setComments(payload.comments ?? []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!cancelled) setUser(payload.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [loadComments]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPosting(true);
    setError("");

    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setError(payload.error || "Could not post the comment.");
        return;
      }
      setBody("");
      await loadComments();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className={bare ? "" : "rounded-xl border border-border bg-card/60 p-4"}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-xs font-semibold text-foreground">Discussion</h2>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {comments.length} comment{comments.length === 1 ? "" : "s"}
        </span>
      </div>

      {loading ? (
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          Loading discussion…
        </p>
      ) : comments.length > 0 ? (
        <ul className="mt-3 divide-y divide-border/60">
          {comments.map((comment) => (
            <li key={comment.id} className="py-2.5">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="font-medium text-foreground">{comment.author}</span>
                <span>·</span>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {comment.body}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          No questions yet. Ask the first one.
        </p>
      )}

      {user ? (
        <form onSubmit={submit} className="mt-3 border-t border-border pt-3">
          <label htmlFor={`comment-${slug}`} className="sr-only">
            Add a comment
          </label>
          <textarea
            id={`comment-${slug}`}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            maxLength={4000}
            placeholder="Ask a question or add a correction…"
            className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground">
              Posting as {user.email}. Be specific and kind.
            </span>
            <button
              type="submit"
              disabled={posting || body.trim().length < 2}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[11px] font-semibold text-background disabled:opacity-40"
            >
              {posting ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-3 w-3" aria-hidden="true" />
              )}
              Post
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </form>
      ) : (
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <Link href="/login" className="font-semibold text-foreground underline underline-offset-4">
            Sign in
          </Link>{" "}
          to ask a question.
        </p>
      )}
    </section>
  );
}
