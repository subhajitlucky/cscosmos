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

    const domainTopics = topics.filter((t) => t.domain === domainKey);

    return (
        <div className="pb-16">
            <section className="relative overflow-hidden py-14 md:py-18">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent blur-3xl opacity-70" />
                <div className="page-container relative z-10">
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                            Domain: {domain.name}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{domain.name}</h1>
                        <p className="text-xl text-muted-foreground">{domain.description}</p>
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
                            <TopicCard key={topic.id} topic={topic} />
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
