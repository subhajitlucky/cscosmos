import { NextResponse } from "next/server";
import { domains, domainPath } from "@/data/domains";
import { topics } from "@/data/topics";
import { siteConfig } from "@/config/site";

export const revalidate = 3600;

export function GET() {
  const payload = {
    count: topics.length,
    generatedAt: new Date().toISOString(),
    topics: topics.map((topic) => ({
      id: topic.catalogId,
      name: topic.name,
      domain: topic.domain,
      slug: topic.slug,
      status: topic.status,
      description: topic.shortDescription,
      url: `${siteConfig.url}${topic.canonicalPath}`,
      crossListedDomains: topic.crossListedDomains ?? [],
    })),
    domains: domains.map((domain) => ({
      key: domain.domainKey,
      name: domain.name,
      path: `${siteConfig.url}${domainPath(domain.domainKey)}`,
    })),
  };

  return NextResponse.json(payload, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
