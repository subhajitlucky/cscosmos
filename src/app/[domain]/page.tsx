import { notFound } from "next/navigation";
import { domains } from "@/data/domains";
import { topics } from "@/data/topics";
import { TopicCard } from "@/components/TopicCard";

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
        (t) => t.domain === domain.domainKey || t.aliases?.includes(domain.domainKey),
    );

    return (
        <div className="pb-16">
            <section className="relative py-14 md:py-18">
                <div className="page-container relative z-10">
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Domain: {domain.name}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">{domain.name}</h1>
                        <p className="text-xl text-muted-foreground font-normal">{domain.description}</p>
                    </div>
                </div>
            </section>

            <div className="page-container space-y-8">
                <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="text-muted-foreground">
                        Showing {domainTopics.length} topics
                    </div>
                </div>

                {domainTopics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {domainTopics.map((topic) => (
                            <TopicCard
                                key={topic.id}
                                topic={topic}
                                alsoInDomain={
                                    topic.domain === domainKey
                                        ? undefined
                                        : domains.find((d) => d.domainKey === topic.domain)
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
                        No topics found.
                    </div>
                )}
            </div>
        </div>
    );
}
