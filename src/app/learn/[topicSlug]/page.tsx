import { notFound, permanentRedirect } from 'next/navigation';
import { topics } from '@/data/topics';

export function generateStaticParams() {
    return topics
        .filter((t) => t.status === 'active')
        .map((t) => ({ topicSlug: t.slug }));
}

/**
 * `/learn/<topicSlug>` is an alias, not a page.
 *
 * It previously rendered a decorative placeholder, which contained no engine lookup at
 * all — it printed a decorative "Engine Status: Active & Native" panel and
 * "Initializing visual canvas for {topicSlug}…". All 72 active topics therefore served
 * a fake player from this route, and README/PROJECT_CONTEXT described it as the
 * "universal player loading native visualizers".
 *
 * The real engines live at each topic's `canonicalPath`. Redirect there instead of
 * shipping a placeholder: the alias keeps working for anyone who has the old link,
 * and crawlers consolidate on the canonical URL.
 */
export default async function LearnPage({ params }: { params: Promise<{ topicSlug: string }> }) {
    const { topicSlug } = await params;
    const topic = topics.find((t) => t.slug === topicSlug && t.status === 'active');

    if (!topic) notFound();

    permanentRedirect(topic.canonicalPath);
}
