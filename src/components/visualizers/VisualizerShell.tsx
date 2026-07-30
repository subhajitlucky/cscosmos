'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Topic } from '@/data/topics';

interface VisualizerShellProps {
    topic: Topic;
    children?: React.ReactNode;
}

export function VisualizerShell({ topic, children }: VisualizerShellProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className={`flex flex-col transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'min-h-[calc(100vh-4rem)]'}`}>
            {/* Header Control Bar */}
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/80 bg-background/80 px-4 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                    <Link
                        href="/topics"
                        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                        Topics
                    </Link>
                    <span className="text-border">/</span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-primary/80">{topic.domain}</span>
                    <span className="text-border">/</span>
                    <h1 className="text-sm font-bold tracking-tight text-foreground truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                        {topic.name}
                    </h1>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="hidden sm:inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                        <Sparkles className="mr-1 h-3 w-3" /> Absorbed Native Engine
                    </div>

                    <button
                        onClick={toggleFullscreen}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </button>

                    <ThemeToggle />
                </div>
            </header>

            {/* Main Interactive Canvas Area */}
            <main className="flex-1 relative overflow-hidden bg-background">
                {children}
            </main>
        </div>
    );
}
