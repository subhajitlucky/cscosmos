import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/button';
import { ShieldAlert, ShieldCheck, Activity, Flame, TrendingUp } from 'lucide-react';
import { cn } from '../../../lib/utils';

type Block = {
    id: number;
    confirmed: boolean;
    workRequired: number;
};

export const ImmutabilityViz = () => {
    const [blocks, setBlocks] = useState<Block[]>([
        { id: 100, confirmed: true, workRequired: 10 },
        { id: 101, confirmed: true, workRequired: 20 },
        { id: 102, confirmed: true, workRequired: 30 },
        { id: 103, confirmed: true, workRequired: 40 },
        { id: 104, confirmed: true, workRequired: 50 },
    ]);
    
    const [attackIndex, setAttackIndex] = useState<number | null>(null);
    const [miningProgress, setMiningProgress] = useState(0);
    const [totalEnergySpent, setTotalEnergySpent] = useState(0);

    // Accumulated work: The deeper the block, the more blocks above it must be remined.
    const totalAccumulatedWork = useMemo(() => {
        return blocks.reduce((acc, b) => acc + b.workRequired, 0);
    }, [blocks]);

    const startAttack = (index: number) => {
        if (attackIndex !== null) return;
        setAttackIndex(index);
        setMiningProgress(0);
        setTotalEnergySpent(0);
        
        // Mark subsequent blocks as "Invalid/Broken"
        setBlocks(prev => prev.map((b, i) => i >= index ? { ...b, confirmed: false } : b));
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        
        if (attackIndex !== null) {
            interval = setInterval(() => {
                setMiningProgress(prev => {
                    const currentBlock = blocks[attackIndex];
                    if (prev >= 100) {
                        // Move to next block in the attack chain
                        const nextIdx = attackIndex + 1;
                        if (nextIdx >= blocks.length) {
                            setAttackIndex(null);
                            setBlocks(prevB => prevB.map(b => ({ ...b, confirmed: true })));
                            return 100;
                        }
                        setAttackIndex(nextIdx);
                        return 0;
                    }
                    
                    // Increment energy and progress
                    setTotalEnergySpent(e => e + 5);
                    return prev + (10 / (currentBlock.workRequired / 10)); // Speed decreases as workRequired increases
                });
            }, 100);
        }

        return () => clearInterval(interval);
    }, [attackIndex, blocks]);

    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-4xl mx-auto py-6">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" /> The Cost of Deception
                    </h3>
                    <p className="text-xs text-muted-foreground italic">Simulation of a 51% reorganization attempt.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-secondary/30 border border-border px-4 py-2 rounded-2xl flex items-center gap-3">
                         <div className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Total Energy<br/>Required</div>
                         <div className="text-xl font-mono font-black text-primary flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-500" /> {totalEnergySpent || totalAccumulatedWork} PJ
                         </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col-reverse items-center gap-2">
                {blocks.map((block, index) => {
                    const isBeingMined = attackIndex === index;
                    const isSecure = block.confirmed;
                    const depth = blocks.length - 1 - index;

                    return (
                        <motion.div 
                            key={block.id}
                            layout
                            className={cn(
                                "w-72 p-4 rounded-2xl border-2 transition-all duration-500 relative flex justify-between items-center",
                                isSecure ? "bg-card border-primary/20 shadow-sm" : 
                                isBeingMined ? "bg-primary/5 border-primary shadow-2xl animate-pulse" :
                                "bg-destructive/10 border-destructive border-dashed opacity-50"
                            )}
                        >
                            {/* Progress Fill */}
                            {isBeingMined && (
                                <motion.div 
                                    className="absolute left-0 top-0 bottom-0 bg-primary/10 z-0" 
                                    style={{ width: `${miningProgress}%` }}
                                />
                            )}

                            <div className="relative z-10 flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold",
                                    isSecure ? "bg-green-500 text-white" : "bg-destructive text-destructive-foreground"
                                )}>
                                    {isSecure ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-xs">Block #{block.id}</span>
                                    <span className="text-[9px] opacity-50 uppercase font-bold">{depth} Confirmations</span>
                                </div>
                            </div>

                            <div className="relative z-10 text-right">
                                <div className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">Difficulty</div>
                                <div className="text-xs font-mono font-bold">{block.workRequired}x</div>
                            </div>

                            {/* Attack Button - only on confirmed blocks */}
                            {isSecure && attackIndex === null && (
                                <div className="absolute inset-y-0 -right-4 md:-right-36 flex items-center translate-x-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                     <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-1 rounded-full border border-border shadow-lg">
                                        <ArrowRight className="hidden md:block w-4 h-4 text-destructive" />
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            onClick={() => startAttack(index)}
                                            className="h-7 md:h-8 text-[9px] md:text-[10px] uppercase font-black tracking-widest rounded-full px-3 md:px-4"
                                        >
                                            Tamper
                                        </Button>
                                     </div>
                                </div>
                            )}
                            
                            {/* Desktop hover container */}
                            <div className="absolute inset-0 group" />
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer Insights */}
            <div className="w-full max-w-2xl px-4 text-center space-y-4">
                <AnimatePresence mode="wait">
                    {attackIndex !== null ? (
                        <motion.div 
                            key="attacking"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary/5 border border-primary/20 p-5 rounded-[2rem] space-y-2"
                        >
                            <h4 className="font-black text-sm text-primary uppercase flex items-center justify-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Attacking Block #{blocks[attackIndex].id}
                            </h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                To rewrite this block, you must spend energy equal to its difficulty. <strong>Crucially</strong>, because of Hash Linking, you must then re-mine <strong>all {blocks.length - 1 - attackIndex} blocks</strong> that were built on top of it.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.p key="hint" className="text-xs text-muted-foreground opacity-50 italic">
                            Hover over a block to attempt a "Tamper" attack. See how energy cost scales with depth.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Helper for the arrow in the attack button
const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3L15 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);