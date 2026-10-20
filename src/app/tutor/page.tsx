import type { Metadata } from "next";
import { Bot } from "lucide-react";
import { TutorClient } from "@/components/learning/TutorClient";

export const metadata: Metadata = {
  title: "AI Tutor - CSCosmos",
  description:
    "Bring your own OpenAI-compatible key and ask focused questions about any CSCosmos topic.",
};

export default async function TutorPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="py-12">
      <div className="page-container max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <Bot className="h-3.5 w-3.5" aria-hidden="true" />
            AI tutor
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
            A tutor with your <span className="text-muted-foreground">own key</span>.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            No accounts, no inference bills, no lock-in. Add an OpenAI-compatible endpoint,
            pick a topic, and ask. The key stays in your browser.
          </p>
        </header>

        <TutorClient initialTopic={typeof params.topic === "string" ? params.topic : undefined} />
      </div>
    </div>
  );
}
