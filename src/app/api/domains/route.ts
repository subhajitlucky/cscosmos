import { NextResponse } from "next/server";
import { domains } from "@/data/domains";
import { topics } from "@/data/topics";
import { siteConfig } from "@/config/site";

export const revalidate = 3600;

export function GET() {
  const payload = {
    count: domains.length,
    generatedAt: new Date().toISOString(),
    domains: domains.map((domain) => {
      const domainTopics = topics.filter(
        (topic) =>
          topic.domain === domain.domainKey || topic.aliases?.includes(domain.domainKey)
      );
      return {
        key: domain.domainKey,
        name: domain.name,
        description: domain.description,
        path: `${siteConfig.url}${domain.path}`,
        totalTopics: domainTopics.length,
        activeTopics: domainTopics.filter((topic) => topic.status === "active").length,
      };
    }),
  };

  return NextResponse.json(payload, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
