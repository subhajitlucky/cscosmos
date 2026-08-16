import { useState, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import { Link as LinkIcon, ShieldCheck, Zap, RotateCcw, AlertCircle } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface BlockData {
    id: number;
    data: string;
    nonce: number;
}

const getHash = (block: BlockData, prevHash: string) => {
    return CryptoJS.SHA256(block.id + block.data + block.nonce + prevHash).toString().substring(0, 12);
};

// Static initial data to avoid memoization loops
const INITIAL_BLOCKS: BlockData[] = [
    { id: 1, data: "Alice pays Bob 10 BTC", nonce: 42 },
    { id: 2, data: "Bob pays Charlie 5 BTC", nonce: 128 },
    { id: 3, data: "Charlie pays Dave 2 BTC", nonce: 89 }
];

export const HashLinkingViz = () => {
    const [blocks, setBlocks] = useState<BlockData[]>(INITIAL_BLOCKS);

    // Calculate initial valid hashes once
    const [storedPrevHashes, setStoredPrevHashes] = useState<string[]>(() => {
        const h1 = getHash(INITIAL_BLOCKS[0], "000000000000");
        const h2 = getHash(INITIAL_BLOCKS[1], h1);
        return ["000000000000", h1, h2];
    });

    // Current real-time calculated hashes
    const currentHashes = useMemo(() => {
        const h1 = getHash(blocks[0], storedPrevHashes[0]);
        const h2 = getHash(blocks[1], storedPrevHashes[1]);
        const h3 = getHash(blocks[2], storedPrevHashes[2]);
        return [h1, h2, h3];
    }, [blocks, storedPrevHashes]);

    const validity = useMemo(() => {
        const v1 = true; 
        const v2 = currentHashes[0] === storedPrevHashes[1];
        const v3 = (currentHashes[1] === storedPrevHashes[2]) && v2;
        return [v1, v2, v3];
    }, [currentHashes, storedPrevHashes]);

    const updateBlockData = (id: number, newData: string) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, data: newData } : b));
    };

    const reMine = () => {
        const h1 = getHash(blocks[0], "000000000000");
        const h2 = getHash(blocks[1], h1);
        setStoredPrevHashes(["000000000000", h1, h2]);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-full overflow-hidden py-2">
            {/* Scrollable Container for the Chain */}
            <div className="w-full overflow-x-auto pb-6 px-4 scrollbar-hide">
                <div className="flex items-center justify-start md:justify-center min-w-max gap-0">
                    {blocks.map((block, i) => {
                        const isValid = validity[i];
                        const isLast = i === blocks.length - 1;
                        const nextIsValid = !isLast && validity[i + 1];

                        return (
                            <div key={block.id} className="flex items-center">
                                {/* The Block Card */}
                                <motion.div 
                                    layout
                                    className={cn(
                                        "w-56 flex flex-col gap-2 p-4 rounded-xl border-2 transition-all duration-500 relative bg-card",
                                        isValid ? "border-primary/20 shadow-sm" : "border-destructive shadow-lg animate-shake bg-destructive/5"
                                    )}
                                >
                                    <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Block #{block.id}</span>
                                        {isValid ? <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> : <AlertCircle className="w-3.5 h-3.5 text-destructive" />}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[8px] font-bold text-muted-foreground uppercase">Data</label>
                                        <Input 
                                            value={block.data} 
                                            onChange={(e) => updateBlockData(block.id, e.target.value)}
                                            className={cn(
                                                "h-7 text-[10px] font-mono",
                                                !isValid && "border-destructive focus-visible:ring-destructive"
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[8px] font-bold text-muted-foreground uppercase">Prev Hash</label>
                                        <div className="font-mono text-[9px] bg-muted/30 p-1 rounded border border-border/50 truncate opacity-60">
                                            {storedPrevHashes[i]}
                                        </div>
                                    </div>

                                    <div className="space-y-1 mt-1">
                                        <label className="text-[8px] font-bold text-primary uppercase">Hash</label>
                                                                            <div className={cn(
                                                                                "font-mono text-[9px] p-1.5 rounded border transition-colors truncate font-bold",
                                                                                isValid ? "bg-primary text-primary-foreground border-primary" : "bg-destructive text-destructive-foreground border-destructive"
                                                                            )}>                                            {currentHashes[i]}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Connecting Link */}
                                {!isLast && (
                                    <div className="flex flex-col items-center mx-[-4px] z-10 shrink-0">
                                        <div className={cn("w-8 h-0.5", nextIsValid ? "bg-primary/40" : "bg-destructive/40")} />
                                        <div className={cn(
                                            "p-1 rounded-full border bg-background shadow-sm",
                                            nextIsValid ? "border-primary text-primary" : "border-destructive text-destructive animate-pulse"
                                        )}>
                                            <LinkIcon className="w-2.5 h-2.5" />
                                        </div>
                                        <div className={cn("w-8 h-0.5", nextIsValid ? "bg-primary/40" : "bg-destructive/40")} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-md text-center space-y-4 px-4">
                <AnimatePresence mode="wait">
                    {!validity.every(v => v) ? (
                        <motion.div 
                            key="broken"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-3"
                        >
                            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-xl">
                                <h4 className="text-destructive font-black text-[10px] uppercase flex items-center justify-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5" /> Chain Integrity Compromised
                                </h4>
                                <p className="text-[10px] text-destructive/80 mt-1 leading-tight">
                                    A modification in the past has broken the cryptographic link. All subsequent blocks are now invalid.
                                </p>
                            </div>
                            <Button onClick={reMine} variant="destructive" size="sm" className="rounded-full px-6 gap-2 uppercase font-black tracking-widest text-[10px] h-9 shadow-lg shadow-destructive/20">
                                <RotateCcw className="w-3.5 h-3.5" /> Fix Chain Links
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.p 
                            key="valid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            className="text-[10px] text-muted-foreground italic"
                        >
                            Modify any block data to trigger the avalanche effect.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
