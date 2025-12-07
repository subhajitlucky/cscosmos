import { useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SearchBar } from "../components/SearchBar";
import { TopicCard } from "../components/TopicCard";
import { topics } from "../data/topics";
import { domains, type DomainKey } from "../data/domains";
import { Button } from "../components/ui/button";

const allOption: DomainKey | "all" = "all";

export function AllTopics() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState<typeof allOption>(allOption);

    const filteredTopics = useMemo(() => {
        return topics.filter((topic) => {
            const matchesDomain = selectedDomain === allOption || topic.domain === selectedDomain;
            const matchesQuery = topic.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDomain && matchesQuery;
        });
    }, [searchQuery, selectedDomain]);

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <main className="flex-grow py-12">
                <div className="page-container space-y-10">
                    <div className="space-y-4">
                        <p className="text-sm uppercase tracking-[0.18em] text-primary/70">Explore</p>
                        <div className="flex flex-col gap-3">
                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">All Topics</h1>
                            <p className="text-muted-foreground max-w-2xl">
                                Browse the full catalog of 126 interactive modules. Filter by domain and search to
                                jump straight to what you need.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                            <SearchBar
                                className="w-full md:w-2/3"
                                placeholder="Search by topic name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search all topics"
                            />
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={selectedDomain === allOption ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedDomain(allOption)}
                                >
                                    All
                                </Button>
                                {domains.map((domain) => (
                                    <Button
                                        key={domain.domainKey}
                                        variant={selectedDomain === domain.domainKey ? "primary" : "ghost"}
                                        size="sm"
                                        onClick={() => setSelectedDomain(domain.domainKey)}
                                    >
                                        {domain.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Showing {filteredTopics.length} of {topics.length} topics
                        </div>
                    </div>

                    {filteredTopics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTopics.map((topic) => (
                                <TopicCard key={topic.id} topic={topic} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground">
                            No topics found. Try a different search or domain filter.
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

