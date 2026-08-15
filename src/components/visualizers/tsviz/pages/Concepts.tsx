'use client';

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { concepts, type Phase } from "../data/concepts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const phases: Phase[] = ["Basics", "Intermediate", "Advanced"];

export function Concepts() {
    return (
        <div className="container mx-auto px-4 py-10 max-w-5xl">
            <div className="text-center mb-16 space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold tracking-tight lg:text-5xl"
                >
                    Learning Path
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-muted-foreground"
                >
                    A step-by-step journey to TypeScript mastery.
                </motion.p>
            </div>

            <div className="space-y-12 relative">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

                {phases.map((phase) => (
                    <div key={phase} className="relative">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="sticky top-20 z-10 mb-8 md:text-center"
                        >
                            <Badge variant="outline" className="text-lg py-1 px-4 bg-background backdrop-blur">
                                {phase}
                            </Badge>
                        </motion.div>

                        <div className="space-y-8">
                            {concepts
                                .filter((c) => c.phase === phase)
                                .map((concept, index) => {
                                    const isEven = index % 2 === 0;
                                    return (
                                        <motion.div
                                            key={concept.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link href={`/tsviz/concepts/${concept.id}`} className="block">
                                                <Card className={cn(
                                                    "relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/50 hover:shadow-lg group w-full md:w-[calc(50%-2rem)]",
                                                    isEven ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"
                                                )}>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            {concept.title}
                                                        </CardTitle>
                                                        <CardDescription>{concept.description}</CardDescription>
                                                    </CardHeader>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Concepts;
