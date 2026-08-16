import { useState } from 'react';
import { Button } from '../../ui/button';
import { GitFork, Trophy, Zap, AlertTriangle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

type Block = {
    id: string;
    branch: 'A' | 'B';
};

export const ForkViz = () => {
    const [chainA, setChainA] = useState<Block[]>([]);
    const [chainB, setChainB] = useState<Block[]>([]);

    const mineA = () => {
        const newBlock: Block = { id: `A-${chainA.length + 1}`, branch: 'A' };
        setChainA([...chainA, newBlock]);
    };

    const mineB = () => {
        const newBlock: Block = { id: `B-${chainB.length + 1}`, branch: 'B' };
        setChainB([...chainB, newBlock]);
    };

    const reset = () => {
        setChainA([]);
        setChainB([]);
    };

    const diff = chainA.length - chainB.length;
    const winner = diff > 0 ? 'A' : diff < 0 ? 'B' : 'None';
    const isForked = chainA.length > 0 && chainB.length > 0;

    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-5xl mx-auto py-6">
            {/* Legend / Status */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                        <GitFork className="w-5 h-5 text-primary" /> The Consensus Race
                    </h3>
                    <p className="text-xs text-muted-foreground italic">Experience a real-time chain reorganization.</p>
                </div>

                <div className="flex gap-3">
                    <AnimatePresence mode="wait">
                        {winner !== 'None' ? (
                            <motion.div 
                                key={winner}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                                    winner === 'A' ? "bg-green-500/10 border-green-500/50 text-green-600" : "bg-blue-500/10 border-blue-500/50 text-blue-600"
                                )}
                            >
                                <Trophy className="w-3.5 h-3.5" /> Chain {winner} is Canonical
                            </motion.div>
                        ) : (
                            <div className="px-4 py-2 rounded-full border bg-secondary/30 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                Waiting for diverge...
                            </div>
                        )}
                    </AnimatePresence>
                    <Button variant="outline" size="icon" onClick={reset} className="rounded-full">
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="w-full flex items-center gap-4 px-4 overflow-x-auto pb-12 scrollbar-hide">
                {/* Common History Anchor */}
                <div className="flex flex-col items-center shrink-0">
                    <div className="w-16 h-16 rounded-2xl border-4 border-primary/20 flex flex-col items-center justify-center bg-card shadow-sm opacity-40">
                        <span className="text-[10px] font-black">B-99</span>
                    </div>
                    <span className="text-[8px] mt-2 uppercase font-bold opacity-30">Common Path</span>
                </div>

                <div className="w-12 h-1 bg-border/30 shrink-0" />

                {/* Forking Logic */}
                <div className="relative flex flex-col gap-12 min-w-[400px]">
                    
                    {/* Branch A */}
                    <div className="flex items-center gap-2">
                        <AnimatePresence>
                            {chainA.map((block, i) => (
                                <motion.div 
                                    key={block.id}
                                    initial={{ scale: 0, x: -20 }}
                                    animate={{ scale: 1, x: 0 }}
                                    className={cn(
                                        "w-14 h-14 rounded-xl border-2 flex items-center justify-center text-[10px] font-black transition-all duration-500 relative shrink-0",
                                        winner === 'A' ? "border-green-500 bg-green-500/10 text-green-700 shadow-lg shadow-green-500/10" : 
                                        winner === 'B' ? "border-muted border-dashed bg-muted/5 text-muted-foreground opacity-30 grayscale" :
                                        "border-primary/40 bg-card"
                                    )}
                                >
                                    {block.id}
                                    {winner === 'A' && i === chainA.length - 1 && (
                                        <Trophy className="absolute -top-6 text-yellow-500 w-5 h-5 animate-bounce" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <Button 
                            size="sm" 
                            onClick={mineA} 
                            className="bg-green-600 hover:bg-green-700 text-[10px] font-black uppercase h-14 w-14 rounded-xl shrink-0 shadow-lg shadow-green-600/20"
                        >
                            Mine A
                        </Button>
                    </div>

                    {/* Branch B */}
                    <div className="flex items-center gap-2">
                        <AnimatePresence>
                            {chainB.map((block, i) => (
                                <motion.div 
                                    key={block.id}
                                    initial={{ scale: 0, x: -20 }}
                                    animate={{ scale: 1, x: 0 }}
                                    className={cn(
                                        "w-14 h-14 rounded-xl border-2 flex items-center justify-center text-[10px] font-black transition-all duration-500 relative shrink-0",
                                        winner === 'B' ? "border-blue-500 bg-blue-500/10 text-blue-700 shadow-lg shadow-blue-500/10" : 
                                        winner === 'A' ? "border-muted border-dashed bg-muted/5 text-muted-foreground opacity-30 grayscale" :
                                        "border-primary/40 bg-card"
                                    )}
                                >
                                    {block.id}
                                    {winner === 'B' && i === chainB.length - 1 && (
                                        <Trophy className="absolute -bottom-6 text-yellow-500 w-5 h-5 animate-bounce" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <Button 
                            size="sm" 
                            onClick={mineB} 
                            className="bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase h-14 w-14 rounded-xl shrink-0 shadow-lg shadow-blue-600/20"
                        >
                            Mine B
                        </Button>
                    </div>

                    {/* The Fork Point Decor */}
                    <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 text-muted-foreground/20">
                        <GitFork className="w-8 h-8" />
                    </div>
                </div>
            </div>

            {/* Educational Insight Card */}
            <div className="w-full max-w-2xl px-4">
                <AnimatePresence mode="wait">
                    {diff !== 0 ? (
                        <motion.div 
                            key="reorg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-primary" />
                                <h4 className="text-sm font-black uppercase text-primary">Chain Reorganization In Effect</h4>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Because <strong>Chain {winner}</strong> is longer, the entire network has switched to it. 
                                Any blocks on the shorter {winner === 'A' ? 'B' : 'A'} branch are now <strong>"Orphans"</strong>. 
                                In a real system, the transactions in those orphan blocks would be returned to the mempool to be re-mined into the main chain.
                            </p>
                        </motion.div>
                    ) : isForked ? (
                        <motion.div 
                            key="draw"
                            className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-[2rem] space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                <h4 className="text-sm font-black uppercase text-yellow-700">Diverged State (Split Brain)</h4>
                            </div>
                            <p className="text-[11px] text-yellow-800/70 leading-relaxed">
                                Both chains have equal work. The network is currently in a state of <strong>uncertainty</strong>. 
                                Miners will continue building on whichever branch they saw first until one becomes longer, resolving the conflict.
                            </p>
                        </motion.div>
                    ) : (
                        <p className="text-center text-xs text-muted-foreground italic opacity-50">
                            Click "Mine A" and "Mine B" to create a fork and watch the Longest Chain Rule in action.
                        </p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};