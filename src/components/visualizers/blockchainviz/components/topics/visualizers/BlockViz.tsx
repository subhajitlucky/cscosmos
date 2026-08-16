import { useState } from 'react';
import { Button } from '../../ui/button';
import { ArrowRight, Box, PackagePlus, Zap, CheckCircle2, Loader2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface Tx {
    id: string;
    fee: number;
    size: number;
}

export const BlockViz = () => {
    const [mempool, setMempool] = useState<Tx[]>([
        { id: 'tx_8a2f', fee: 0.002, size: 250 },
        { id: 'tx_1c9d', fee: 0.005, size: 400 },
        { id: 'tx_5e3b', fee: 0.001, size: 180 },
        { id: 'tx_9b4a', fee: 0.008, size: 550 },
        { id: 'tx_2f7c', fee: 0.003, size: 300 },
    ]);
    const [blockTxs, setBlockTxs] = useState<Tx[]>([]);
    const [isMining, setIsMining] = useState(false);
    const [isMined, setIsMined] = useState(false);

    const totalSize = blockTxs.reduce((acc, tx) => acc + tx.size, 0);
    const MAX_SIZE = 1000;

    const addToBlock = (tx: Tx) => {
        if (totalSize + tx.size > MAX_SIZE || isMining || isMined) return;
        setMempool(prev => prev.filter(t => t.id !== tx.id));
        setBlockTxs(prev => [...prev, tx]);
    };

    const mine = () => {
        setIsMining(true);
        setTimeout(() => {
            setIsMining(false);
            setIsMined(true);
        }, 2000);
    };

    const reset = () => {
        setMempool([...mempool, ...blockTxs]);
        setBlockTxs([]);
        setIsMined(false);
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                
                {/* 1. The Mempool (Unconfirmed) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Zap className="w-3 h-3" /> Mempool (Unconfirmed)
                        </h3>
                        <span className="text-[10px] font-mono opacity-50">{mempool.length} txs waiting</span>
                    </div>

                    <div className="bg-secondary/10 border border-border/50 rounded-2xl p-4 min-h-[300px] flex flex-col gap-2">
                        <AnimatePresence>
                            {mempool.map(tx => (
                                <motion.div
                                    key={tx.id}
                                    layoutId={tx.id}
                                    onClick={() => addToBlock(tx)}
                                    className="bg-card border border-border p-3 rounded-xl flex justify-between items-center cursor-pointer hover:border-primary transition-all group active:scale-95"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                                            <PackagePlus className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="font-mono text-xs font-bold">{tx.id}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-primary">{tx.fee} BTC</div>
                                        <div className="text-[9px] text-muted-foreground">{tx.size} bytes</div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {mempool.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-30 gap-2">
                                <CheckCircle2 className="w-8 h-8" />
                                <span className="text-xs italic">All transactions cleared</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. The Candidate Block */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Box className="w-3 h-3" /> Candidate Block
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase">Weight:</span>
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                                <motion.div 
                                    animate={{ width: `${(totalSize / MAX_SIZE) * 100}%` }}
                                    className={cn("h-full transition-colors", totalSize > 800 ? "bg-orange-500" : "bg-primary")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={cn(
                        "relative rounded-3xl border-4 p-6 min-h-[300px] transition-all duration-500 overflow-hidden",
                        isMined ? "bg-primary/5 border-primary shadow-2xl shadow-primary/20" : "bg-secondary/20 border-dashed border-border/50"
                    )}>
                        {/* Mining Overlay */}
                        <AnimatePresence>
                            {isMining && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-30 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-primary"
                                >
                                    <Loader2 className="w-12 h-12 animate-spin" />
                                    <span className="font-black text-xs uppercase tracking-widest">Sealing Block...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-3 relative z-10">
                            <AnimatePresence>
                                {blockTxs.map(tx => (
                                    <motion.div
                                        key={tx.id}
                                        layoutId={tx.id}
                                        className="bg-card border border-border/50 p-3 rounded-xl flex justify-between items-center"
                                    >
                                        <span className="font-mono text-xs font-black">{tx.id}</span>
                                        <span className="text-[10px] opacity-50">{tx.size} bytes</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {blockTxs.length === 0 && (
                                <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                                    <ArrowRight className="w-8 h-8 rotate-90 md:rotate-0" />
                                    <span className="text-[10px] text-center max-w-[120px] uppercase font-bold">Pack transactions into the block</span>
                                </div>
                            )}
                        </div>

                        {blockTxs.length > 0 && !isMining && !isMined && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                                <Button onClick={mine} className="w-full h-12 rounded-xl bg-primary shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs">
                                    Seal & Mine Block
                                </Button>
                            </motion.div>
                        )}

                        {isMined && (
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 flex flex-col gap-2">
                                <div className="bg-green-500 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                    <CheckCircle2 className="w-4 h-4" /> Block Mined Successfully
                                </div>
                                <Button variant="ghost" onClick={reset} className="text-[10px] uppercase font-bold opacity-50">
                                    Reset Simulator
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Engineer Insight */}
            <div className="bg-secondary/10 border border-border/50 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <h4 className="text-xs font-bold mb-1">Economic Incentives: The Fee Market</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Since Block Size is limited (<strong>1000 bytes</strong> in this demo), miners don't pick transactions randomly. 
                        They sort the mempool by <strong>Fee-per-Byte</strong> and pick the most profitable ones first. 
                        This creates a competitive "Fee Market" during times of high network congestion.
                    </p>
                </div>
            </div>
        </div>
    );
};