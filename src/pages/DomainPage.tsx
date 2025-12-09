import { useParams, Navigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { domains } from "../data/domains"
import { topics } from "../data/topics"
import { TopicCard } from "../components/TopicCard"
import { SearchBar } from "../components/SearchBar"
import { useState, useMemo } from "react"

export function DomainPage() {
    const { domainKey } = useParams<{ domainKey: string }>();
    const [searchQuery, setSearchQuery] = useState("");

    const domain = useMemo(
        () => domains.find((d) => d.domainKey === domainKey),
        [domainKey]
    );

    const domainTopics = useMemo(() => {
        return topics.filter(
            (t) => t.domain === domainKey && t.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [domainKey, searchQuery]);

    if (!domain) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />

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

            <main className="flex-grow pb-16">
                <div className="page-container space-y-8">
                    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="text-muted-foreground">
                        Showing {domainTopics.length} topics
                    </div>
                    <div className="w-full md:w-96">
                        <SearchBar
                            placeholder={`Search in ${domain.name}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {domainTopics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {domainTopics.map(topic => (
                            <TopicCard key={topic.id} topic={topic} />
                        ))}
                    </div>
                ) : (
                        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
                        No topics found matching your search.
                    </div>
                )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
