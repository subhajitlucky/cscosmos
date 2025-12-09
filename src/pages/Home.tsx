import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { SearchBar } from "../components/SearchBar"
import { Button } from "../components/ui/button"
import { DomainCard } from "../components/DomainCard"
import { TopicCard } from "../components/TopicCard"
import { domains } from "../data/domains"
import { topics } from "../data/topics"
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Sparkles } from "lucide-react"

export function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const totalTopics = topics.length;
    const liveTopics = topics.filter(t => t.status === 'active').length;

    const filteredTopics = useMemo(() => {
        if (!searchQuery) return [];
        return topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    // Sample featured topics if no search
    const featuredTopics = topics.slice(0, 6);

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
                <div className="absolute inset-0">
                    <div className="absolute top-[-20%] left-[10%] h-72 w-72 bg-primary/20 blur-3xl rounded-full" />
                    <div className="absolute bottom-[-10%] right-[5%] h-80 w-80 bg-purple-400/25 blur-3xl rounded-full" />
                </div>
                <div className="page-container text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary shadow-sm">
                        <Sparkles className="mr-2 h-3.5 w-3.5" /> {totalTopics} Interactive Learning Modules · {liveTopics} live
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/85 to-primary/90">
                            Explore the Universe of Computer Science
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                        A curated hub of {totalTopics} interactive visual learning microsites across Full-Stack, DSA, Web3,
                        AI, Core CS, DevOps, and Advanced Engineering.
                    </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/topics">
                            <Button size="lg" className="text-base h-12 px-8">
                                Explore Topics
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="outline" size="lg" className="text-base h-12 px-8">
                                About CSCosmos
                            </Button>
                        </Link>
                    </div>

                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute -inset-px bg-gradient-to-r from-primary to-blue-500 rounded-full blur-lg opacity-25 group-hover:opacity-40 transition duration-500 group-hover:duration-200" />
                        <SearchBar
                            placeholder="Search any topic (e.g. 'Binary Search', 'React', 'Docker')..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="relative shadow-xl"
                        />
                    </div>
                </div>
            </section>

            <main className="flex-grow space-y-16 pb-16">
                <div className="page-container space-y-16">
                {/* Search Results or Domain Grid */}
                {searchQuery ? (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Search Results</h2>
                                    <p className="text-muted-foreground">Matches for “{searchQuery}”</p>
                                </div>
                                <Link to="/topics" className="text-sm font-medium text-primary hover:text-primary/80">
                                    View all topics →
                                </Link>
                            </div>
                        {filteredTopics.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTopics.map(topic => (
                                    <TopicCard key={topic.id} topic={topic} />
                                ))}
                            </div>
                        ) : (
                                <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
                                    No topics found for "{searchQuery}". Try a different term.
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                            <section className="space-y-6">
                                <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">Browse by Domain</h2>
                                    <p className="text-muted-foreground mt-2">Explore our 7 major galaxies of knowledge.</p>
                                </div>
                                    <span className="text-sm text-muted-foreground hidden sm:block">{totalTopics} topics total</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {domains.map(domain => (
                                    <DomainCard key={domain.domainKey} domain={domain} />
                                ))}
                            </div>
                        </section>

                            <section className="space-y-6">
                                <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold tracking-tight">Featured Topics</h2>
                                    <Link to="/topics">
                                <Button variant="ghost" className="text-primary hover:text-primary/80">
                                    View All <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                    </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredTopics.map(topic => (
                                    <TopicCard key={topic.id} topic={topic} />
                                ))}
                            </div>
                        </section>
                    </>
                )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
