import { useState, useMemo, useEffect } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import CryptoJS from 'crypto-js';
import { Hash, Cpu, Timer, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

export const BlockHeaderViz = () => {
    const [nonce, setNonce] = useState(0);
    const [difficulty] = useState(2); // Number of leading zeros required
    const [isAutoMining, setIsAutoMining] = useState(false);
    
    // Constant header fields for this demo
    const [header] = useState({
        version: '00000002',
        prevHash: '0000000000000000000b5a...f21',
        merkleRoot: 'd8c1...912a',
        timestamp: Math.floor(Date.now() / 1000)
    });

    const hash = useMemo(() => {
        const data = header.version + header.prevHash + header.merkleRoot + header.timestamp + nonce;
        return CryptoJS.SHA256(data).toString();
    }, [header, nonce]);

    const isValid = hash.startsWith('0'.repeat(difficulty));

    // Auto-miner logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isAutoMining && !isValid) {
            interval = setInterval(() => {
                setNonce(prev => prev + 1);
            }, 50);
        } else {
            setIsAutoMining(false);
        }
        return () => clearInterval(interval);
    }, [isAutoMining, isValid]);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-4">
            <div className="grid md:grid-cols-2 gap-8">
                
                {/* 1. Header Structure */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Cpu className="w-3 h-3" /> Block Header Fields
                        </h3>
                        <div className="flex gap-2">
                             <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">80 BYTES</span>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Version</label>
                                <div className="font-mono text-xs p-2 bg-muted rounded border border-border opacity-60">{header.version}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Timestamp</label>
                                <div className="font-mono text-xs p-2 bg-muted rounded border border-border opacity-60">{header.timestamp}</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Previous Hash</label>
                            <div className="font-mono text-[10px] p-2 bg-muted rounded border border-border truncate opacity-60">{header.prevHash}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Merkle Root</label>
                            <div className="font-mono text-[10px] p-2 bg-muted rounded border border-border truncate opacity-60">{header.merkleRoot}</div>
                        </div>

                        <div className="pt-4 border-t border-border">
                             <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                                    <Hash className="w-3 h-3" /> Nonce (The Variable)
                                </label>
                                <span className="text-[10px] font-mono opacity-50">Iterate to solve</span>
                             </div>
                             <div className="flex gap-2">
                                <Input 
                                    type="number" 
                                    value={nonce} 
                                    onChange={(e) => setNonce(parseInt(e.target.value) || 0)} 
                                    className={cn(
                                        "font-mono text-lg h-12 text-center border-2 transition-all",
                                        isValid ? "border-green-500 bg-green-500/5" : "border-primary/30"
                                    )} 
                                />
                                <Button 
                                    variant={isAutoMining ? "destructive" : "default"}
                                    onClick={() => setIsAutoMining(!isAutoMining)}
                                    className="h-12 w-12 rounded-xl"
                                >
                                    {isAutoMining ? <div className="w-2 h-2 bg-white animate-pulse rounded-full" /> : <RefreshCw className="w-4 h-4" />}
                                </Button>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 2. Mining Output */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Timer className="w-3 h-3" /> Hashing Engine (SHA-256)
                    </h3>

                    <div className={cn(
                        "bg-card border-2 rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6 transition-all duration-500",
                        isValid ? "border-green-500 shadow-2xl shadow-green-500/20" : "border-border shadow-inner bg-secondary/10"
                    )}>
                        <div className="text-center space-y-2 w-full">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Calculated Block Hash</span>
                            <div className={cn(
                                "font-mono text-xs md:text-sm break-all p-4 rounded-xl border transition-all",
                                isValid ? "bg-green-500 text-white border-green-400 font-black scale-105" : "bg-background text-muted-foreground border-border"
                            )}>
                                {hash}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase">Target:</span>
                                <div className="flex gap-1">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className={cn(
                                            "w-3 h-3 rounded-sm border",
                                            i < difficulty ? "bg-green-500 border-green-600" : "bg-muted border-border"
                                        )} />
                                    ))}
                                </div>
                                <span className="text-[10px] font-mono opacity-50">Starts with {difficulty} zeros</span>
                            </div>

                            <AnimatePresence mode="wait">
                                {isValid ? (
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex items-center gap-2 text-green-600 font-black text-xs uppercase"
                                    >
                                        <ShieldCheck className="w-5 h-5" /> Block Solved!
                                    </motion.div>
                                ) : (
                                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] uppercase animate-pulse">
                                        <AlertCircle className="w-4 h-4" /> Hash too large
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {isValid && (
                            <Button variant="ghost" size="sm" onClick={() => setNonce(0)} className="text-[10px] opacity-50">
                                Reset Nonce
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Educational Insight */}
            <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl">
                 <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" /> Why 80 bytes?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    By keeping headers small and fixed-size, the network ensures that even a low-power smartphone can verify the entire chain of work. Miners can hash these 80 bytes millions of times per second (ASICs do trillions) to find a Nonce that satisfies the difficulty target. 
                </p>
            </div>
        </div>
    );
};