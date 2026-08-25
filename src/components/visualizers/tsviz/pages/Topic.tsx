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
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold">Topic not found</h1>
                <Link href="/tsviz/concepts">
                    <Button variant="link">Back to Concepts</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 max-w-5xl">
                    <div className="flex items-center justify-between mb-3">
                        <Link href="/tsviz/concepts">
                            <Button variant="ghost" size="sm" className="gap-2 h-8">
                                <ArrowLeft className="h-4 w-4" />
                                All Topics
                            </Button>
                        </Link>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {concept.phase}
                        </Badge>
                    </div>
                    <div className="max-w-4xl">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                            {concept.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {concept.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="space-y-8">

                    {/* Definition Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold">What is it?</h2>
                        </div>
                        <Card className="border-l-4 border-l-primary">
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
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Code2 className="h-4 w-4 text-blue-500" />
                                </div>
                                <h2 className="text-xl font-semibold">Syntax</h2>
                            </div>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="bg-muted/50 rounded-lg p-3 border">
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
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Code2 className="h-4 w-4 text-green-500" />
                            </div>
                            <h2 className="text-xl font-semibold">Example</h2>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                {/* Terminal Header */}
                                <div className="bg-muted/30 border-b px-3 py-2 flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-1 font-medium">
                                        example.ts
                                    </span>
                                </div>
                                {/* Code Block */}
                                <pre className="p-4 overflow-x-auto bg-muted/10">
                                    <code className="font-mono text-sm leading-relaxed">
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
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="bg-[#3178C6]/5 border-[#3178C6]/20">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Lightbulb className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base mb-1.5">Key Takeaway</h3>
                                        <p className="text-sm text-muted-foreground">
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
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <ConceptVisualization conceptId={concept.id} conceptTitle={concept.title} />
                    </motion.section>

                </div>
            </div>
        </div>
    );
}

export default Topic;
