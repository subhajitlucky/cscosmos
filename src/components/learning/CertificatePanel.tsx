"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, ExternalLink } from "lucide-react";

export default function CertificatePanel({
  completed,
  certificates,
}: {
  completed: number;
  certificates: Array<{ id: string; title: string; issued_at: string }>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const eligible = completed >= 10;

  const claim = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/user/certificates", { method: "POST" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.error || "Could not issue the certificate.");
        return;
      }
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            Certificate
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {eligible
              ? `${completed} topics complete. You can claim a certificate.`
              : `${completed}/10 topics complete to unlock a certificate.`}
          </p>
        </div>
        {eligible && (
          <button
            type="button"
            onClick={claim}
            disabled={status === "loading"}
            className="inline-flex h-9 items-center rounded-lg bg-foreground px-3.5 text-xs font-semibold text-background disabled:opacity-50"
          >
            {status === "loading" ? "Issuing…" : "Claim certificate"}
          </button>
        )}
      </div>

      {certificates.length > 0 && (
        <div className="mt-3 divide-y divide-border/60 border-t border-border pt-2">
          {certificates.map((certificate) => (
            <Link
              key={certificate.id}
              href={`/certificate/${certificate.id}`}
              className="flex items-center justify-between gap-2 py-2 text-xs text-foreground hover:text-primary"
            >
              <span className="truncate">{certificate.title}</span>
              <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
                View
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      )}

      {message && <p className="mt-2 text-xs text-red-500">{message}</p>}
    </div>
  );
}
