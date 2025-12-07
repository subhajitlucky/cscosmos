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
            <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="container px-4 max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 animate-fade-in-up">
                        <Sparkles className="mr-2 h-3.5 w-3.5" /> 122 Interactive Learning Modules
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 leading-tight">
                        Explore the Entire Universe <br className="hidden md:block" /> of Computer Science
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl mb-10">
                        A hub of 122 interactive visual learning microsites across Full-Stack, DSA, Web3, AI, Core CS, DevOps, and Advanced Engineering.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <Button size="lg" className="text-base h-12 px-8">Explore Topics</Button>
                        <Link to="/about">
                            <Button variant="outline" size="lg" className="text-base h-12 px-8">About CSCosmos</Button>
                        </Link>
                    </div>

                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <SearchBar
                            placeholder="Search any topic (e.g. 'Binary Search', 'React', 'Docker')..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="relative bg-background shadow-xl"
                        />
                    </div>
                </div>

                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[100px] -z-10 rounded-full opacity-50 dark:opacity-20 pointer-events-none" />
            </section>

            <main className="flex-grow container max-w-7xl mx-auto px-4 py-8 space-y-20">

                {/* Search Results or Domain Grid */}
                {searchQuery ? (
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                        {filteredTopics.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTopics.map(topic => (
                                    <TopicCard key={topic.id} topic={topic} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                No topics found for "{searchQuery}".
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        <section>
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">Browse by Domain</h2>
                                    <p className="text-muted-foreground mt-2">Explore our 7 major galaxies of knowledge.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {domains.map(domain => (
                                    <DomainCard key={domain.domainKey} domain={domain} />
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold tracking-tight">Featured Topics</h2>
                                <Button variant="ghost" className="text-primary hover:text-primary/80">
                                    View All <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredTopics.map(topic => (
                                    <TopicCard key={topic.id} topic={topic} />
                                ))}
                            </div>
                        </section>
                    </>
                )}

            </main>
            <Footer />
        </div>
    )
}
