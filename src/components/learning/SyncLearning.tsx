"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import {
  LEARNING_EVENT,
  LEARNING_STORAGE_KEY,
  readLearningState,
  writeLearningState,
  type LearningState,
} from "@/lib/local-learning";

const NOTES_KEY = "cscosmos:notes:v1";

function readNotes(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(NOTES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function SyncLearning({ loggedIn }: { loggedIn: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const push = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/user/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...readLearningState(), notes: readNotes() }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Sync failed.");
      setStatus("success");
      setMessage("Progress, bookmarks, and notes pushed to your account.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sync failed.");
    }
  };

  const pull = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/user/learning", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Sync failed.");

      const learning = payload.learning as LearningState;
      writeLearningState({
        bookmarks: learning.bookmarks ?? [],
        completed: learning.completed ?? [],
        visited: learning.visited ?? {},
      });
      window.localStorage.setItem(NOTES_KEY, JSON.stringify(payload.learning?.notes ?? {}));
      window.dispatchEvent(new Event("cscosmos:notes-updated"));
      window.dispatchEvent(new Event(LEARNING_EVENT));
      setStatus("success");
      setMessage("Pulled your account state to this device.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sync failed.");
    }
  };

  if (!loggedIn) {
    return (
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Account sync
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to sync progress, bookmarks, and notes.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-foreground px-3.5 text-xs font-semibold text-background"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            Account sync
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep this device and your account in step.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={push}
            disabled={status === "loading"}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-foreground hover:bg-secondary/40"
          >
            <ArrowUpFromLine className="h-3.5 w-3.5" aria-hidden="true" />
            Push local
          </button>
          <button
            type="button"
            onClick={pull}
            disabled={status === "loading"}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-foreground hover:bg-secondary/40"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden="true" />
            Pull account
          </button>
        </div>
      </div>
      {message && (
        <p className={`mt-2 text-xs ${status === "success" ? "text-emerald-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
