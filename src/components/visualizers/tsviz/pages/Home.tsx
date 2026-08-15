'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Cpu, Layers, Terminal, BookOpen, Target, Swords } from 'lucide-react';

export function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
            <section className="space-y-10 pb-12 pt-10 md:pb-16 md:pt-14 lg:py-28">
                <div className="container mx-auto max-w-5xl px-4 flex flex-col items-center gap-6 text-center">
                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground">
                        Master TypeScript by
                        <br className="hidden sm:inline" />
                        <span className="text-blue-600 dark:text-blue-400"> Visualizing It</span>
                    </h1>
                    <p className="max-w-[48rem] leading-relaxed text-muted-foreground sm:text-xl">
                        Don&apos;t just read definitions. See the <strong>Stack & Heap</strong> in real-time, step through execution, and build a deep mental model of how TypeScript works.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <Link href="/tsviz/concepts">
                            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                                Start Learning <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/tsviz/problems">
                            <Button variant="secondary" size="lg" className="gap-2">
                                Practice Problems <Swords className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/tsviz/playground">
                            <Button variant="outline" size="lg">
                                Try Playground
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="container mx-auto max-w-6xl px-4 space-y-8 py-12 md:py-16 border-t border-border/60">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Why TSViz?</h2>
                    <p className="text-muted-foreground">Visual mental models + hands-on practice.</p>
                </div>
                <div className="grid justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <Layers className="h-10 w-10 mb-2 text-blue-600 dark:text-blue-400" />
                            <CardTitle>Memory Graph</CardTitle>
                            <CardDescription className="leading-relaxed">
                                Visualize the difference between <strong>Stack</strong> (primitives) and <strong>Heap</strong> (objects). See references and mutations happen live.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <Cpu className="h-10 w-10 mb-2 text-blue-600 dark:text-blue-400" />
                            <CardTitle>Execution Flow</CardTitle>
                            <CardDescription className="leading-relaxed">
                                Step-by-step execution highlighting. Understand exactly how the JavaScript engine processes your TypeScript code.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <Terminal className="h-10 w-10 mb-2 text-blue-600 dark:text-blue-400" />
                            <CardTitle>Interactive Playground</CardTitle>
                            <CardDescription className="leading-relaxed">
                                A full-featured Monaco editor. Write code, fix type errors, and visualize the results instantly in the browser.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            <section className="container mx-auto max-w-6xl px-4 space-y-8 py-12 md:py-16 border-t border-border/60">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Learning Path</h2>
                    <p className="text-muted-foreground">Basics → Intermediate → Advanced</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground"><BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Basics</CardTitle>
                            <CardDescription className="leading-relaxed">Primitives, functions, interfaces vs types, inference, literals, tuples, safety types.</CardDescription>
                            <Link href="/tsviz/concepts" className="pt-2">
                                <Button variant="outline" size="sm" className="mt-2">View basics</Button>
                            </Link>
                        </CardHeader>
                    </Card>
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground"><Target className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Intermediate</CardTitle>
                            <CardDescription className="leading-relaxed">Unions, guards, assertions, type queries, modules/interop, async/await, tsconfig strict.</CardDescription>
                            <Link href="/tsviz/concepts" className="pt-2">
                                <Button variant="outline" size="sm" className="mt-2">View intermediate</Button>
                            </Link>
                        </CardHeader>
                    </Card>
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground"><Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Advanced</CardTitle>
                            <CardDescription className="leading-relaxed">Generics, utility/mapped/conditional/template literal types, ambient/augmentation.</CardDescription>
                            <Link href="/tsviz/concepts" className="pt-2">
                                <Button variant="outline" size="sm" className="mt-2">View advanced</Button>
                            </Link>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            <section className="container mx-auto max-w-6xl px-4 space-y-8 py-12 md:py-16 border-t border-border/60 mb-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Practice to mastery</h2>
                        <p className="text-muted-foreground">50+ problems with hints, solutions, and expected outputs across Easy/Medium/Hard.</p>
                    </div>
                    <Link href="/tsviz/problems">
                        <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            Go to Problems <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Guided practice</CardTitle>
                            <CardDescription className="leading-relaxed">Hints + solutions on every problem. See expected outputs to verify.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Run in-browser</CardTitle>
                            <CardDescription className="leading-relaxed">TypeScript checks + runtime output, no setup. Use the built-in editor.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Concept-linked</CardTitle>
                            <CardDescription className="leading-relaxed">Problems aligned to core TS topics: unions, guards, generics, async, modules, strict config, and more.</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>
        </div>
    );
}

export default Home;
