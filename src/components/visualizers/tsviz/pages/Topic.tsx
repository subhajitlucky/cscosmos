'use client';

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { concepts } from "../data/concepts";
import { conceptContent } from "../content/concept-content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConceptVisualization } from "../components/ConceptVisualization";
import { ArrowLeft, BookOpen, Code2, Lightbulb } from "lucide-react";

export function Topic({ topicId: propTopicId }: { topicId?: string }) {
    const params = useParams();
    const slug = params?.slug;
    const topicId = propTopicId || (Array.isArray(slug) && slug.length > 1 ? slug[1] : undefined);
    const concept = concepts.find((c) => c.id === topicId);
    const content = topicId ? conceptContent[topicId] : undefined;

    if (!concept) {
        return (
            <div className="container mx-auto py-20 text-center px-4">
                <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
                <Link href="/tsviz/concepts">
                    <Button variant="link">Back to Concepts</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Hero Section */}
            <div className="border-b bg-background/80 backdrop-blur-sm sticky top-14 z-20">
                <div className="container mx-auto max-w-4xl py-4 px-4">
                    <div className="flex items-center justify-between mb-3">
                        <Link href="/tsviz/concepts">
                            <Button variant="ghost" size="sm" className="gap-2 h-8">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back
                            </Button>
                        </Link>
                        <Link href={`/tsviz/problems?concept=${encodeURIComponent(concept.title)}`}>
                            <Button variant="outline" size="sm" className="gap-2 h-8">
                                <BookOpen className="h-3.5 w-3.5" />
                                Problems
                            </Button>
                        </Link>
                        <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-600 dark:text-blue-400">
                            {concept.phase}
                        </Badge>
                    </div>
                    <div className="max-w-4xl">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-foreground">
                            {concept.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {concept.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto py-8 max-w-4xl px-4">
                <div className="space-y-8">

                    {/* Definition Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground">What is it?</h2>
                        </div>
                        <Card className="border-l-4 border-l-blue-600 shadow-sm">
                            <CardContent className="p-5">
                                <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                                    {content?.longDescription || concept.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Syntax Section */}
                    {content?.syntax && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-foreground">Syntax</h2>
                            </div>
                            <Card className="shadow-sm">
                                <CardContent className="p-4">
                                    <div className="bg-muted/60 rounded-lg p-3 border border-border">
                                        <code className="font-mono text-xs md:text-sm text-foreground">
                                            {content.syntax}
                                        </code>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                    )}

                    {/* Example Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Code2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground">Example</h2>
                        </div>
                        <Card className="shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                {/* Terminal Header */}
                                <div className="bg-muted/50 border-b px-3 py-2 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-1 font-mono font-medium">
                                        example.ts
                                    </span>
                                </div>
                                {/* Code Block */}
                                <pre className="p-4 overflow-x-auto bg-card text-foreground font-mono text-sm leading-relaxed">
                                    <code>
                                        {content?.exampleCode || `// Example code for ${concept.title}
const example = "Hello World";
console.log(example);`}
                                    </code>
                                </pre>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Key Takeaway */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Card className="bg-gradient-to-br from-blue-500/5 via-blue-500/5 to-transparent border-blue-500/20 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base mb-1.5 text-foreground">Key Takeaway</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Understanding <strong className="text-foreground">{concept.title}</strong> is
                                            fundamental to mastering TypeScript. Practice with the examples above and
                                            experiment with variations to solidify your knowledge.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Visualization */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <ConceptVisualization conceptId={concept.id} conceptTitle={concept.title} />
                    </motion.section>

                </div>
            </div>
        </div>
    );
}

export default Topic;
