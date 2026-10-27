import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { topics } from "@/data/topics";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return topics
    .filter((topic) => topic.status === "active")
    .map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}): Promise<Metadata> {
  const { topicSlug } = await params;
  const topic = topics.find((item) => item.slug === topicSlug);
  return {
    title: topic ? `${topic.name} - CSCosmos Embed` : "CSCosmos Embed",
    robots: { index: false, follow: false },
  };
}

export default async function EmbedTopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = topics.find((item) => item.slug === topicSlug && item.status === "active");

  if (!topic) notFound();

  const path = topic.canonicalPath;
  const separator = path.includes("?") ? "&" : "?";
  const src = `${siteConfig.url}${path}${separator}embed=1`;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <iframe
        src={src}
        title={`${topic.name} - CSCosmos visualizer`}
        className="h-full w-full border-0"
        allow="fullscreen"
      />
    </div>
  );
}
