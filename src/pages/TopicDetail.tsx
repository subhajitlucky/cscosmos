import { Link, Navigate, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { topics } from "../data/topics";
import { domains } from "../data/domains";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";

export function TopicDetail() {
    const { domainKey, topicSlug } = useParams<{ domainKey: string; topicSlug: string }>();

    const topic = topics.find((t) => t.domain === domainKey && t.slug === topicSlug);
    if (!topic) {
        return <Navigate to="/" replace />;
    }

    const domain = domains.find((d) => d.domainKey === topic.domain);

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <main className="flex-grow">
                <section className="relative overflow-hidden py-16 md:py-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent blur-3xl opacity-70" />
                    <div className="page-container relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-semibold text-primary mb-6">
                            <Sparkles className="h-4 w-4" />
                            {domain ? domain.name : topic.domain}
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{topic.name}</h1>
                            <p className="text-lg text-muted-foreground max-w-3xl">
                                {topic.shortDescription} The interactive experience is coming soon. In the meantime,
                                we’re outlining the learning map, visuals, and exercises that will ship with this
                                microsite.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="pill-badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800">
                                    Status: {topic.status === "coming-soon" ? "Coming Soon" : "Live"}
                                </span>
                                <span className="pill-badge bg-primary/10 text-primary border border-primary/30">
                                    Domain: {domain ? domain.name : topic.domain}
                                </span>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to={`/${topic.domain}`}>
                                <Button variant="ghost" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Back to {domain ? domain.name : "Domain"}
                                </Button>
                            </Link>
                            <Link to="/topics">
                                <Button variant="outline" className="gap-2">
                                    View all topics
                                </Button>
                            </Link>
                            <Button variant="primary" className="gap-2" disabled>
                                <ExternalLink className="h-4 w-4" /> Microsite link (soon)
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="pb-16">
                    <div className="page-container grid gap-6 md:grid-cols-2">
                        <div className="glass-card rounded-2xl p-6 space-y-3">
                            <h3 className="text-xl font-semibold">What you’ll learn</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Concept explanations with visuals tailored to this topic.</li>
                                <li>Interactive simulations to build intuition.</li>
                                <li>Common pitfalls, edge cases, and performance trade-offs.</li>
                            </ul>
                        </div>
                        <div className="glass-card rounded-2xl p-6 space-y-3">
                            <h3 className="text-xl font-semibold">Status</h3>
                            <p className="text-muted-foreground">
                                This module is queued for build. Track updates on the All Topics page or subscribe to
                                releases.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

