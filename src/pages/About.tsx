import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export function About() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <main className="flex-grow container max-w-4xl mx-auto py-12 px-4">
                <div className="space-y-12">
                    <section className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">About CSCosmos</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            CSCosmos is an ambitious project to map the entire universe of Computer Science into interactive, visual learning experiences.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight">Our Mission</h2>
                        <p className="text-muted-foreground">
                            Learning Computer Science shouldn't just be about reading text. It should be about seeing, interacting, and understanding the systems at play. We are building 122 dedicated microsites to cover everything from the Box Model to Distributed Consensus Algorithms.
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 rounded-lg border border-border bg-card">
                            <h3 className="font-semibold text-xl mb-2">Roadmap</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Phase 1: Platform Foundation (We are here)</li>
                                <li>Phase 2: Core Data Structures Microsites</li>
                                <li>Phase 3: Web Fundamentals</li>
                                <li>Phase 4: Community Contributions</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-lg border border-border bg-card">
                            <h3 className="font-semibold text-xl mb-2">Contributing</h3>
                            <p className="text-muted-foreground mb-4">
                                This is an open initiative. We welcome contributions from developers, educators, and designers.
                            </p>
                            <a href="https://github.com" className="text-primary hover:underline font-medium">Check out our GitHub &rarr;</a>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
