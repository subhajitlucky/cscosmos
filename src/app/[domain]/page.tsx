import Link from "next/link";
import { notFound } from "next/navigation";
import { domains, domainPath, type DomainKey } from "@/data/domains";
import { topics, type Topic } from "@/data/topics";
import { TopicCard } from "@/components/TopicCard";

const FULLSTACK_SECTIONS = [
    {
        id: "foundations",
        name: "Foundations",
        description: "The web platform: protocols, markup, styles, language, and the browser.",
    },
    {
        id: "frontend",
        name: "Frontend Engineering",
        description: "Building the interface: components, state, forms, performance, and tests.",
    },
    {
        id: "backend",
        name: "Backend Engineering",
        description: "Servers, APIs, data, jobs, and real-time communication.",
    },
    {
        id: "architecture",
        name: "Architecture & Product",
        description: "How the pieces fit together and connect to real product services.",
    },
] as const;

const FULLSTACK_RELATED_DOMAINS: DomainKey[] = ["devops", "security", "advanced", "ai", "corecs"];

function TopicGrid({ items, domainKey }: { items: Topic[]; domainKey: DomainKey }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((topic) => (
                <TopicCard
                    key={topic.catalogId}
                    topic={topic}
                    alsoInDomain={
                        topic.domain === domainKey
                            ? undefined
                            : domains.find((domain) => domain.domainKey === topic.domain)
                    }
                />
            ))}
        </div>
    );
}

function SectionHeader({
    eyebrow,
    title,
    description,
    count,
}: {
    eyebrow: string;
    title: string;
    description: string;
    count: number;
}) {
    return (
        <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-end">
            <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {eyebrow}
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <span className="w-fit rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-[10px] text-muted-foreground">
                {count} topics
            </span>
        </div>
    );
}

export function generateStaticParams() {
    return domains.map((d) => ({
        domain: d.domainKey,
    }));
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain: domainKey } = await params;
    const domain = domains.find((d) => d.domainKey === domainKey);

    if (!domain) {
        notFound();
    }

    // A topic belongs here if it calls this domain home OR is cross-listed via an alias tag.
    const domainTopics = topics.filter(
        (t) => t.domain === domain.domainKey || t.crossListedDomains?.includes(domain.domainKey),
    );

    const ownedTopics = domainTopics.filter((t) => t.domain === domain.domainKey);
    const sharedTopics = domainTopics.filter((t) => t.domain !== domain.domainKey);
    const coreTopics = ownedTopics.filter((t) => !t.curriculumTags?.includes("elective"));
    const electiveTopics = ownedTopics.filter((t) => t.curriculumTags?.includes("elective"));
    const isFullstack = domain.domainKey === "fullstack";

    const coreSections = FULLSTACK_SECTIONS.map((section) => ({
        ...section,
        topics: coreTopics.filter((topic) => topic.curriculumTags?.includes(section.id)),
    }));
    const uncategorizedCore = coreTopics.filter(
        (topic) =>
            !topic.curriculumTags?.some((tag) =>
                FULLSTACK_SECTIONS.some((section) => section.id === tag),
            ),
    );

    return (
        <div className="pb-16">
            <section className="relative py-14 md:py-18">
                <div className="page-container relative z-10">
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Domain: {domain.name}
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                            {domain.name}
                        </h1>
                        <p className="text-xl font-normal text-muted-foreground">{domain.description}</p>
                    </div>
                </div>
            </section>

            <div className="page-container space-y-10">
                <div className="glass-card flex flex-col justify-between gap-4 rounded-2xl p-4 sm:p-5 md:flex-row md:items-center">
                    <div className="text-muted-foreground">
                        {isFullstack ? (
                            <>
                                <span className="font-semibold text-foreground">{coreTopics.length} core</span>
                                {" · "}
                                <span>{electiveTopics.length} electives</span>
                                {" · "}
                                <span>{sharedTopics.length} shared</span>
                            </>
                        ) : (
                            <>Showing {domainTopics.length} topics</>
                        )}
                    </div>
                    {isFullstack && (
                        <p className="max-w-xl text-xs text-muted-foreground">
                            Core is the path. Electives are optional. Shared topics live in another
                            domain and are linked here so you can open them from both.
                        </p>
                    )}
                </div>

                {isFullstack ? (
                    <div className="space-y-14">
                        <section className="space-y-8">
                            <SectionHeader
                                eyebrow="Core path"
                                title="Full Stack Core"
                                description="Everything you need to build and ship a web application end to end."
                                count={coreTopics.length}
                            />

                            <div className="space-y-12">
                                {coreSections.map((section, index) =>
                                    section.topics.length > 0 ? (
                                        <section key={section.id} className="space-y-4">
                                            <SectionHeader
                                                eyebrow={`Core 0${index + 1}`}
                                                title={section.name}
                                                description={section.description}
                                                count={section.topics.length}
                                            />
                                            <TopicGrid items={section.topics} domainKey={domain.domainKey} />
                                        </section>
                                    ) : null,
                                )}

                                {uncategorizedCore.length > 0 && (
                                    <section className="space-y-4">
                                        <SectionHeader
                                            eyebrow="Core"
                                            title="More Core Topics"
                                            description="Additional core fullstack material."
                                            count={uncategorizedCore.length}
                                        />
                                        <TopicGrid items={uncategorizedCore} domainKey={domain.domainKey} />
                                    </section>
                                )}
                            </div>
                        </section>

                        {electiveTopics.length > 0 && (
                            <section className="space-y-4">
                                <SectionHeader
                                    eyebrow="Optional"
                                    title="Electives"
                                    description="Pick the tools that fit your stack. You do not need all of them."
                                    count={electiveTopics.length}
                                />
                                <TopicGrid items={electiveTopics} domainKey={domain.domainKey} />
                            </section>
                        )}

                        {sharedTopics.length > 0 && (
                            <section className="space-y-4">
                                <SectionHeader
                                    eyebrow="Linked"
                                    title="Shared from Other Domains"
                                    description="These topics live in another domain. Open them here or at their home domain."
                                    count={sharedTopics.length}
                                />
                                <TopicGrid items={sharedTopics} domainKey={domain.domainKey} />
                            </section>
                        )}

                        <section className="glass-card space-y-4 rounded-2xl p-6">
                            <div className="space-y-1">
                                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                    Go deeper
                                </p>
                                <h2 className="text-xl font-bold text-foreground">Related domains</h2>
                                <p className="max-w-2xl text-sm text-muted-foreground">
                                    Fullstack links out to these domains instead of duplicating their
                                    specialized modules.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {FULLSTACK_RELATED_DOMAINS.map((key) => {
                                    const related = domains.find((item) => item.domainKey === key);
                                    if (!related) return null;
                                    return (
                                        <Link
                                            key={key}
                                            href={domainPath(key)}
                                            className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                                        >
                                            {related.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                ) : domainTopics.length > 0 ? (
                    <TopicGrid items={domainTopics} domainKey={domain.domainKey} />
                ) : (
                    <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
                        No topics found.
                    </div>
                )}
            </div>
        </div>
    );
}
