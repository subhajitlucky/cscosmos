import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { topics } from "../data/topics"
import { Terminal, Cpu, ShieldCheck } from "lucide-react"
import { siteConfig } from "../config/site"

export function About() {
    const totalTopics = topics.length;

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <main className="flex-grow py-16 md:py-24">
                <div className="page-container max-w-4xl space-y-20">
                    
                    {/* The Hook */}
                    <section className="space-y-8 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            The Survival Guide <br/> for the AI Age.
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
                            We don't teach syntax. We teach Architecture. <br/>
                            We don't teach how to use tools. We teach how to build them.
                        </p>
                    </section>

                    {/* The Philosophy */}
                    <section className="grid md:grid-cols-3 gap-8">
                        <div className="glass-card rounded-2xl p-8 space-y-4 border-t-4 border-t-primary">
                            <Cpu className="h-8 w-8 text-primary" />
                            <h3 className="text-2xl font-bold">Deep Internals</h3>
                            <p className="text-muted-foreground">
                                In a world of AI code generation, the "Coder" is obsolete. The "Architect" is king. 
                                We dive into Memory Allocators, Compilers, and Kernels.
                            </p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 space-y-4 border-t-4 border-t-purple-600">
                            <ShieldCheck className="h-8 w-8 text-purple-600" />
                            <h3 className="text-2xl font-bold">Future Proof</h3>
                            <p className="text-muted-foreground">
                                From <strong>Quantum Computing</strong> to <strong>Neural Implants</strong>. 
                                We cover the technologies that will define the next 20 years, not just the next 20 months.
                            </p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 space-y-4 border-t-4 border-t-rose-600">
                            <Terminal className="h-8 w-8 text-rose-600" />
                            <h3 className="text-2xl font-bold">The Mission</h3>
                            <p className="text-muted-foreground italic font-medium">
                                "{siteConfig.slogan}"
                            </p>
                        </div>
                    </section>

                    {/* The Scale */}
                    <section className="glass-card rounded-2xl p-8 md:p-12 space-y-6 text-center">
                        <h2 className="text-3xl font-bold">The Universe at a Glance</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
                            <div>
                                <p className="text-4xl font-black text-foreground">8</p>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Galaxies</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black text-foreground">{totalTopics}</p>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Microsites</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black text-foreground">100%</p>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Open Source</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black text-foreground">∞</p>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Possibilities</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="flex justify-center gap-4">
                        <Link to="/topics">
                            <Button size="lg" className="h-14 px-8 text-lg">Start Exploring</Button>
                        </Link>
                        <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg">GitHub</Button>
                        </a>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}