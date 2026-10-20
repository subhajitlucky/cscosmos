"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

export default function LeaderboardOptIn({ initialOptIn }: { initialOptIn: boolean }) {
  const router = useRouter();
  const [optIn, setOptIn] = useState(initialOptIn);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggle = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/user/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optIn: !optIn }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setMessage(payload.error || "Could not update the setting.");
        return;
      }
      setOptIn(Boolean(payload.optIn));
      setMessage(payload.optIn ? "You are on the leaderboard." : "Removed from the leaderboard.");
      router.refresh();
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-4">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
          Leaderboard
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {optIn ? "Public: masked email and completed topics." : "Private by default."}
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-colors ${
          optIn
            ? "border border-border text-foreground hover:bg-secondary/40"
            : "bg-foreground text-background"
        }`}
      >
        <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
        {optIn ? "Leave leaderboard" : "Join leaderboard"}
      </button>
      {message && <p className="w-full text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
