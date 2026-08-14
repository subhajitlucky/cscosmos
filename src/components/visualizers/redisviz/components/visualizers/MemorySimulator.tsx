'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Layers, Trash2, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MemoryBlock {
    id: string;
    size: number;
    type: string;
    lastAccessed: number;
    accessCount: number;
}

const MemorySimulator = () => {
    const [maxMemory] = useState(100);
    const [blocks, setBlocks] = useState<MemoryBlock[]>([]); // Changed to initialize with an empty array
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const [evictionPolicy, setEvictionPolicy] = useState<'lru' | 'lfu'>('lru');

    const usedMemory = useMemo(() => blocks.reduce((acc, b) => acc + b.size, 0), [blocks]);
    const usagePercentage = (usedMemory / maxMemory) * 100;

    const triggerEviction = useCallback((neededSize: number[] = []) => {
        setBlocks(prev => {
            const currentBlocks = [...prev];
            let currentUsed = currentBlocks.reduce((acc, b) => acc + b.size, 0);
            const targetNeeded = neededSize.length > 0 ? neededSize[0] : 0;

            const newBlocks = [...currentBlocks];
            while (currentUsed + targetNeeded > maxMemory && newBlocks.length > 0) {
                if (evictionPolicy === 'lru') {
                    newBlocks.sort((a, b) => a.lastAccessed - b.lastAccessed);
                } else {
                    newBlocks.sort((a, b) => a.accessCount - b.accessCount);
                }
                const removed = newBlocks.shift();
                if (removed) currentUsed -= removed.size;
            }

            if (targetNeeded > 0) {
                newBlocks.push({
                    id: Math.random().toString(36).substr(2, 9),
                    size: targetNeeded,
                    type: 'string',
                    lastAccessed: Date.now(),
                    accessCount: 1
                });
            }
            return newBlocks;
        });
    }, [maxMemory, evictionPolicy]);

    const addRandomBlock = useCallback(() => {
        const size = Math.floor(Math.random() * 20) + 5;
        const types = ['string', 'list', 'set', 'hash', 'zset'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (usedMemory + size > maxMemory) {
            triggerEviction([size]);
        } else {
            const newBlock: MemoryBlock = {
                id: Math.random().toString(36).substr(2, 9),
                size,
                type,
                lastAccessed: Date.now(),
                accessCount: 1
            };
            setBlocks(prev => [...prev, newBlock]);
        }
    }, [usedMemory, maxMemory, triggerEviction]);

    const accessBlock = useCallback((id: string) => {
        setBlocks(prev => prev.map(b => b.id === id ? {
            ...b,
            lastAccessed: Date.now(),
            accessCount: b.accessCount + 1
        } : b));
    }, []);

    return (
        <div className="space-y-8">
            <Card className="border-2 border-border/50 shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Layers className="w-5 h-5 text-redis" />
                                Live Allocation Map
                            </CardTitle>
                            <CardDescription>Visualize memory blocks and manual eviction</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={evictionPolicy === 'lru' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setEvictionPolicy('lru')}
                                className={evictionPolicy === 'lru' ? "bg-redis" : ""}
                            >
                                LRU
                            </Button>
                            <Button
                                variant={evictionPolicy === 'lfu' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setEvictionPolicy('lfu')}
                                className={evictionPolicy === 'lfu' ? "bg-redis" : ""}
                            >
                                LFU
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Memory Usage ({usedMemory} / {maxMemory}MB)</span>
                            <span className={cn(usagePercentage > 90 ? "text-redis" : usagePercentage > 70 ? "text-amber-500" : "text-green-500")}>
                                {usagePercentage.toFixed(1)}%
                            </span>
                        </div>
                        <Progress value={usagePercentage} className={cn("h-3", usagePercentage > 90 ? "bg-redis/20" : "")} />
                        <div className="flex justify-between p-2 mt-2">
                            <Button size="sm" onClick={addRandomBlock} className="bg-green-600 hover:bg-green-700">
                                <Plus className="w-4 h-4 mr-1" /> Add Key
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => triggerEviction()} className="text-redis border-redis/50 hover:bg-redis/10">
                                <Trash2 className="w-4 h-4 mr-1" /> Evict Now
                            </Button>
                        </div>
                    </div>

                    <div className="relative h-48 bg-muted/20 border-2 border-dashed border-border rounded-xl flex items-start p-4 gap-2 overflow-x-auto">
                        <AnimatePresence>
                            {blocks.map((block) => (
                                <motion.div
                                    key={block.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                    className={cn(
                                        "flex-shrink-0 cursor-pointer rounded-lg border-2 p-2 flex flex-col justify-between transition-all hover:ring-2 hover:ring-redis/50",
                                        block.type === 'string' ? "bg-blue-500/10 border-blue-500/30" :
                                            block.type === 'list' ? "bg-green-500/10 border-green-500/30" :
                                                block.type === 'hash' ? "bg-purple-500/10 border-purple-500/30" :
                                                    "bg-amber-500/10 border-amber-500/30"
                                    )}
                                    style={{ width: `${block.size * 3 + 40}px`, height: '100px' }}
                                    onClick={() => accessBlock(block.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono scale-90 origin-top-left">
                                            {block.type}
                                        </Badge>
                                        <span className="text-[10px] font-bold opacity-60">ID:{block.id.slice(0, 3)}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-center">{block.size}MB</div>
                                        <div className="flex justify-between items-center text-[8px] uppercase tracking-tighter opacity-50">
                                            <span>Hits:{block.accessCount}</span>
                                            <span>{Math.floor((currentTime - block.lastAccessed) / 1000)}s ago</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {blocks.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground italic text-sm">
                                Memory is empty...
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                            <h4 className="font-bold flex items-center gap-1 mb-2">
                                <ArrowUpRight className="w-3 h-3 text-blue-500" /> LRU (Least Recently Used)
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                                Favors retaining keys that were accessed recently. Good for general caching where old data is less likely to be needed.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                            <h4 className="font-bold flex items-center gap-1 mb-2">
                                <ArrowDownRight className="w-3 h-3 text-amber-500" /> LFU (Least Frequently Used)
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                                Favors keys with high access counts. Better for scenarios where popularity remains stable over time.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MemorySimulator;
