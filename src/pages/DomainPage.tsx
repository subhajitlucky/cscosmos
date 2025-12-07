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

    const domain = domains.find(d => d.domainKey === domainKey);

    if (!domain) {
        return <Navigate to="/" replace />;
    }

    const domainTopics = useMemo(() => {
        return topics.filter(t => t.domain === domainKey && t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [domainKey, searchQuery]);

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />

            <section className={`py-12 md:py-20 ${domain.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center rounded-lg bg-background/50 px-3 py-1 text-sm font-medium mb-4 backdrop-blur-sm border border-border/50">
                            Domain: {domain.name}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{domain.name}</h1>
                        <p className="text-xl text-muted-foreground">{domain.description}</p>
                    </div>
                </div>
            </section>

            <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
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
                    <div className="text-center py-20 text-muted-foreground">
                        No topics found matching your search.
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
