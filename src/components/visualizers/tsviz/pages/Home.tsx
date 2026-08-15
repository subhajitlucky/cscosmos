'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Cpu, Layers, Terminal, BookOpen, Target, Swords } from 'lucide-react';

export function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
            <section className="space-y-10 pb-12 pt-10 md:pb-16 md:pt-14 lg:py-36">
                <div className="container mx-auto px-4 flex max-w-[72rem] flex-col items-center gap-6 text-center">
                    <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                        Master TypeScript by
                        <br className="hidden sm:inline" />
                        <span className="text-primary"> Visualizing It</span>
                    </h1>
                    <p className="max-w-[50rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        Don&apos;t just read definitions. See the <strong>Stack & Heap</strong> in real-time, step through execution, and build a deep mental model of how TypeScript works.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/tsviz/concepts">
                            <Button size="lg" className="gap-2">
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

            <section className="container mx-auto px-4 space-y-8 py-12 md:py-16 lg:py-24 border-t border-border/60">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Why TSViz?</h2>
                    <p className="text-muted-foreground">Visual mental models + hands-on practice.</p>
                </div>
                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <Layers className="h-10 w-10 mb-2 text-primary" />
                            <CardTitle>Memory Graph</CardTitle>
                            <CardDescription>
                                Visualize the difference between <strong>Stack</strong> (primitives) and <strong>Heap</strong> (objects). See references and mutations happen live.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Cpu className="h-10 w-10 mb-2 text-primary" />
                            <CardTitle>Execution Flow</CardTitle>
                            <CardDescription>
                                Step-by-step execution highlighting. Understand exactly how the JavaScript engine processes your TypeScript code.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Terminal className="h-10 w-10 mb-2 text-primary" />
                            <CardTitle>Interactive Playground</CardTitle>
                            <CardDescription>
                                A full-featured Monaco editor. Write code, fix type errors, and visualize the results instantly in the browser.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            <section className="container mx-auto px-4 space-y-8 py-12 md:py-16 border-t border-border/60">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Learning Path</h2>
                    <p className="text-muted-foreground">Basics → Intermediate → Advanced</p>
                </div>
                <div className="mx-auto grid gap-4 md:grid-cols-3 max-w-5xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Basics</CardTitle>
                            <CardDescription>Primitives, functions, interfaces vs types, inference, literals, tuples, safety types.</CardDescription>
                            <Link href="/tsviz/concepts">
                                <Button variant="outline" size="sm" className="mt-2">View basics</Button>
                            </Link>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Intermediate</CardTitle>
                            <CardDescription>Unions, guards, assertions, type queries, modules/interop, async/await, tsconfig strict.</CardDescription>
                            <Link href="/tsviz/concepts">
                                <Button variant="outline" size="sm" className="mt-2">View intermediate</Button>
                            </Link>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5 text-primary" /> Advanced</CardTitle>
                            <CardDescription>Generics, utility/mapped/conditional/template literal types, ambient/augmentation.</CardDescription>
                            <Link href="/tsviz/concepts">
                                <Button variant="outline" size="sm" className="mt-2">View advanced</Button>
                            </Link>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            <section className="container mx-auto px-4 space-y-8 py-12 md:py-16 border-t border-border/60">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-5xl mx-auto">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Practice to mastery</h2>
                        <p className="text-muted-foreground">50+ problems with hints, solutions, and expected outputs across Easy/Medium/Hard.</p>
                    </div>
                    <Link href="/tsviz/problems">
                        <Button size="sm" variant="default" className="gap-2">
                            Go to Problems <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Guided practice</CardTitle>
                            <CardDescription>Hints + solutions on every problem. See expected outputs to verify.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Run in-browser</CardTitle>
                            <CardDescription>TypeScript checks + runtime output, no setup. Use the built-in editor.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Concept-linked</CardTitle>
                            <CardDescription>Problems aligned to core TS topics: unions, guards, generics, async, modules, strict config, and more.</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>
        </div>
    );
}

export default Home;
