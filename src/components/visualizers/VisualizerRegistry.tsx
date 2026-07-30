'use client';

import React from 'react';
import type { Topic } from '@/data/topics';
import { Sparkles, Cpu } from 'lucide-react';

interface VisualizerRegistryProps {
    slug: string;
    topic: Topic;
}

export function VisualizerRegistry({ slug, topic }: VisualizerRegistryProps) {
    // Dynamic interactive sandbox placeholder while engine components mount
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse" />
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shadow-2xl">
                    <Cpu className="h-10 w-10 animate-bounce" />
                </div>
            </div>

            <div className="max-w-md space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{topic.name} Engine</h2>
                <p className="text-sm text-muted-foreground">
                    Native visualizer engine for <span className="font-semibold text-foreground">{topic.name}</span>.
                </p>
            </div>

            <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur space-y-4 text-left font-mono text-xs text-muted-foreground">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-emerald-400 flex items-center"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Engine Status: Active & Native</span>
                    <span>Domain: {topic.domain}</span>
                </div>
                <div className="space-y-1 text-foreground/80">
                    <p className="text-primary">&gt; Initializing visual canvas for {slug}...</p>
                    <p>&gt; Pre-rendering static components via Next.js App Router (0 ms serverless execution)...</p>
                    <p>&gt; Client execution context: Active in-memory sandbox.</p>
                </div>
            </div>
        </div>
    );
}
