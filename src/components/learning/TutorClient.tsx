"use client";

import { useState, useSyncExternalStore } from "react";
import { Bot, KeyRound, Send, Sparkles, Trash2 } from "lucide-react";
import { topics } from "@/data/topics";
import {
  DEFAULT_TUTOR_SETTINGS,
  getTutorSnapshot,
  parseTutorSettings,
  saveTutorSettings,
  subscribeTutor,
  type TutorSettings,
} from "@/lib/tutor";

export function TutorClient({ initialTopic }: { initialTopic?: string }) {
  const raw = useSyncExternalStore(subscribeTutor, getTutorSnapshot, () => "");
  const settings = parseTutorSettings(raw);
  const [topicSlug, setTopicSlug] = useState(
    topics.find((item) => item.slug === initialTopic)?.slug ??
      topics.find((item) => item.status === "active")?.slug ??
      ""
  );
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topic = topics.find((item) => item.slug === topicSlug);

  const update = (patch: Partial<TutorSettings>) => {
    saveTutorSettings({ ...settings, ...patch });
  };

  const ask = async () => {
    if (!settings.apiKey || !question.trim() || !topic) return;
    setLoading(true);
    setAnswer("");
    setError(null);

    const context = [
      `Topic: ${topic.name}`,
      `Domain: ${topic.domain}`,
      `Level: ${topic.difficulty}`,
      `Description: ${topic.shortDescription}`,
      topic.tags.length ? `Tags: ${topic.tags.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch(`${settings.baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content:
                "You are a concise computer science tutor. Explain with a mental model first, then a concrete example. Prefer 150-250 words. Never invent citations.",
            },
            {
              role: "user",
              content: `Context:\n${context}\n\nQuestion: ${question.trim()}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Provider error ${response.status}: ${text.slice(0, 160)}`);
      }

      const payload = await response.json();
      const content = payload?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        throw new Error("The provider returned an empty answer.");
      }
      setAnswer(content.trim());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not reach the provider.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <div className="glass-card space-y-4 rounded-2xl border p-5">
          <div>
            <label htmlFor="tutor-topic" className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Topic context
            </label>
            <select
              id="tutor-topic"
              value={topicSlug}
              onChange={(event) => setTopicSlug(event.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none"
            >
              {topics
                .filter((item) => item.status === "active")
                .map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="tutor-question" className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Your question
            </label>
            <textarea
              id="tutor-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={5}
              placeholder="Explain this like I have never seen it. Where does the abstraction leak?"
              className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={ask}
              disabled={loading || !settings.apiKey || !question.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {loading ? (
                "Thinking…"
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  Ask tutor
                </>
              )}
            </button>
            <span className="text-[10px] text-muted-foreground">
              Uses your key. Nothing is sent to CSCosmos.
            </span>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="glass-card min-h-[180px] rounded-2xl border p-5">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Tutor
            </p>
          </div>
          {answer ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {answer}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              {settings.apiKey
                ? "Ask a question to get a focused explanation for the selected topic."
                : "Add a provider key in the panel to enable the tutor."}
            </p>
          )}
        </div>
      </div>

      <aside className="glass-card h-fit space-y-4 rounded-2xl border p-5">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Bring your own key</h2>
        </div>

        <div>
          <label htmlFor="tutor-base" className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            Base URL
          </label>
          <input
            id="tutor-base"
            value={settings.baseUrl}
            onChange={(event) => update({ baseUrl: event.target.value })}
            className="mt-2 h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[11px] text-foreground focus:border-foreground/30 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="tutor-model" className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            Model
          </label>
          <input
            id="tutor-model"
            value={settings.model}
            onChange={(event) => update({ model: event.target.value })}
            className="mt-2 h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[11px] text-foreground focus:border-foreground/30 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="tutor-key" className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
            API key
          </label>
          <input
            id="tutor-key"
            type="password"
            value={settings.apiKey}
            onChange={(event) => update({ apiKey: event.target.value })}
            placeholder="sk-..."
            autoComplete="off"
            className="mt-2 h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-[11px] text-foreground focus:border-foreground/30 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => saveTutorSettings({ ...DEFAULT_TUTOR_SETTINGS })}
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-3 w-3" aria-hidden="true" />
          Clear key and settings
        </button>

        <div className="border-t border-border pt-3">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            OpenAI-compatible
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
            Works with any endpoint that accepts{" "}
            <code className="font-mono">/chat/completions</code>. The key is stored in this
            browser and sent directly to your provider.
          </p>
        </div>
      </aside>
    </div>
  );
}
