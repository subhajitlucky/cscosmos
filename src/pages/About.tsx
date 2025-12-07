import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"

export function About() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <main className="flex-grow py-14 pb-16">
                <div className="page-container max-w-5xl space-y-12">
                    <section className="space-y-6 text-center">
                        <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary shadow-sm">
                            Building 126 interactive CS microsites
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">About CSCosmos</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                                CSCosmos is mapping the universe of Computer Science into approachable, visual, and interactive microsites—covering everything from browser internals to distributed consensus.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link to="/topics">
                                <Button size="md" className="gap-2">Browse topics</Button>
                            </Link>
                            <a href="https://github.com" target="_blank" rel="noreferrer">
                                <Button variant="outline" size="md" className="gap-2">Contribute on GitHub</Button>
                            </a>
                        </div>
                    </section>

                    <section className="grid md:grid-cols-3 gap-4">
                        <div className="glass-card rounded-2xl p-5 space-y-2">
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Scope</p>
                            <p className="text-3xl font-bold">126</p>
                            <p className="text-muted-foreground text-sm">Microsites spanning 7 domains.</p>
                        </div>
                        <div className="glass-card rounded-2xl p-5 space-y-2">
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Focus</p>
                            <p className="text-3xl font-bold">Visual & Hands-on</p>
                            <p className="text-muted-foreground text-sm">Interactive explainers, step-throughs, and playgrounds.</p>
                        </div>
                        <div className="glass-card rounded-2xl p-5 space-y-2">
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Community</p>
                            <p className="text-3xl font-bold">Open</p>
                            <p className="text-muted-foreground text-sm">Built for learners, educators, and contributors.</p>
                        </div>
                    </section>

                    <section className="glass-card rounded-2xl p-6 space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Learning Computer Science should feel tangible. We combine visuals, interactivity, and concise narration to make complex systems intuitive—whether you’re exploring CPU scheduling, the event loop, cryptography, or model deployment.
                        </p>
                    </section>

                    <section className="glass-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <h3 className="font-semibold text-xl">What we’re building right now</h3>
                            <span className="pill-badge bg-primary/10 text-primary border border-primary/30">In Progress</span>
                        </div>
                        <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                            <li>Deep-dive visualizers for DSA, web architecture, blockchain, AI/ML, and systems.</li>
                            <li>Interactive simulations (e.g., schedulers, consensus, backprop, EVM tracing).</li>
                            <li>Step-through explainers with animations, timelines, and state inspectors.</li>
                            <li>Guided exercises with edge cases, performance notes, and “gotchas”.</li>
                        </ul>
                    </section>

                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="glass-card rounded-2xl p-6 space-y-3">
                            <h3 className="font-semibold text-xl mb-1">Roadmap</h3>
                            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                                <li><strong>Phase 1:</strong> Platform foundation (routing, theming, search, domains).</li>
                                <li><strong>Phase 2:</strong> Core DSA & Web fundamentals microsites.</li>
                                <li><strong>Phase 3:</strong> Systems, AI/ML, and DevOps deep dives.</li>
                                <li><strong>Phase 4:</strong> Community contributions and advanced labs.</li>
                            </ul>
                        </div>
                        <div className="glass-card rounded-2xl p-6 space-y-3">
                            <h3 className="font-semibold text-xl mb-1">How to contribute</h3>
                            <p className="text-muted-foreground">
                                Designers, engineers, educators, and technical writers are welcome. Start with an issue, propose a microsite, or improve UX and accessibility.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                                    View the repo →
                                </a>
                                <Link to="/topics" className="text-muted-foreground hover:text-foreground font-medium">
                                    Pick a topic →
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
