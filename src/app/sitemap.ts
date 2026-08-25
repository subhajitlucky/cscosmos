import type { MetadataRoute } from "next";

import { domains } from "@/data/domains";
import { topics } from "@/data/topics";
import { tracks } from "@/data/tracks";

const BASE_URL = "https://cscosmos.vercel.app";

/**
 * Generated sitemap: core pages + all 8 domain hubs + every active topic url
 * + the free Learning Tracks. Replaces the hand-maintained public/sitemap.xml,
 * which had drifted down to 11 URLs while the catalog grew past 55 live topics.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const entry = (
        path: string,
        changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
        priority: number,
    ): MetadataRoute.Sitemap[number] => ({
        url: BASE_URL + path,
        lastModified: now,
        changeFrequency,
        priority,
    });

    const entries: MetadataRoute.Sitemap = [
        entry("/", "weekly", 1),
        entry("/topics", "weekly", 0.9),
        entry("/tracks", "weekly", 0.9),
        entry("/about", "monthly", 0.7),
        ...domains.map((d) => entry(d.path, "weekly", 0.8)),
        ...tracks.map((t) => entry(`/tracks/${t.slug}`, "weekly", 0.8)),
    ];

    // One entry per unique active topic url (shared engines dedupe naturally).
    const seen = new Set<string>();
    for (const t of topics) {
        if (t.status !== "active" || !t.url) continue;
        if (seen.has(t.url)) continue;
        seen.add(t.url);
        entries.push(entry(t.url, "weekly", 0.7));
    }

    return entries;
}
