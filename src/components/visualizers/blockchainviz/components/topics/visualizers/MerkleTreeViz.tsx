import { useState, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import { motion } from 'framer-motion';
import { Input } from '../../ui/input';
import { GitMerge, Search, ShieldCheck } from 'lucide-react';

const truncate = (str: string) => str.substring(0, 10) + '...';

export const MerkleTreeViz = () => {
    const [txs, setTxs] = useState(["Tx_1: 10 BTC", "Tx_2: 0.5 BTC", "Tx_3: 22 BTC", "Tx_4: 1.2 BTC"]);
    
    const leaves = useMemo(() => txs.map(t => CryptoJS.SHA256(t).toString()), [txs]);
    const branch1 = useMemo(() => CryptoJS.SHA256(leaves[0] + leaves[1]).toString(), [leaves]);
    const branch2 = useMemo(() => CryptoJS.SHA256(leaves[2] + leaves[3]).toString(), [leaves]);
    const root = useMemo(() => CryptoJS.SHA256(branch1 + branch2).toString(), [branch1, branch2]);

    const updateTx = (index: number, val: string) => {
        const newTxs = [...txs];
        newTxs[index] = val;
        setTxs(newTxs);
    };

    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-4xl mx-auto py-6">
            <div className="flex flex-col items-center gap-8 w-full relative">
                
                {/* 1. Root Level */}
                <motion.div 
                    layout
                    className="flex flex-col items-center z-30"
                >
                    <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-2xl shadow-primary/30 border-2 border-primary/50 text-center scale-110">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Merkle Root</div>
                        <div className="font-mono text-sm font-black">{truncate(root)}</div>
                    </div>
                </motion.div>

                {/* Connectors: Root to Branches */}
                <svg className="absolute top-16 w-full h-16 pointer-events-none opacity-20" preserveAspectRatio="none">
                    <line x1="50%" y1="0" x2="30%" y2="100%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="50%" y1="0" x2="70%" y2="100%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                {/* 2. Branch Level */}
                <div className="flex justify-around w-full max-w-2xl z-20">
                    {[branch1, branch2].map((branch, i) => (
                        <motion.div key={i} layout className="flex flex-col items-center">
                            <div className="bg-card border-2 border-border p-3 rounded-xl shadow-lg text-center">
                                <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1 flex items-center gap-1 justify-center">
                                    <GitMerge className="w-2.5 h-2.5" /> Branch {i + 1}
                                </div>
                                <div className="font-mono text-[10px] font-bold text-muted-foreground">{truncate(branch)}</div>
                            </div>
                            {/* Connectors: Branch to Leaves */}
                            <svg className="w-32 h-10 mt-2 opacity-10" preserveAspectRatio="none">
                                <line x1="50%" y1="0" x2="20%" y2="100%" stroke="currentColor" strokeWidth="2" />
                                <line x1="50%" y1="0" x2="80%" y2="100%" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </motion.div>
                    ))}
                </div>

                {/* 3. Leaf Level (Hashes) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4 z-10">
                    {leaves.map((leaf, i) => (
                        <motion.div key={i} layout className="flex flex-col items-center gap-3">
                            <div className="w-full bg-secondary/30 border border-border/50 p-2 rounded-lg text-center">
                                <div className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">Hash {i+1}</div>
                                <div className="font-mono text-[9px] truncate text-muted-foreground">{truncate(leaf)}</div>
                            </div>
                            
                            {/* Input Area */}
                            <div className="w-full space-y-2">
                                <Input 
                                    value={txs[i]} 
                                    onChange={(e) => updateTx(i, e.target.value)}
                                    className="h-8 text-[10px] text-center font-bold bg-background shadow-inner"
                                />
                                <div className="flex justify-center">
                                    <div className="text-[8px] font-black uppercase text-primary/40">Tx Data</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Insight Grid */}
            <div className="grid md:grid-cols-2 gap-6 w-full px-4">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                    <h4 className="font-black text-xs mb-3 flex items-center gap-2 uppercase tracking-tight">
                        <Search className="w-4 h-4 text-primary" /> Simplified Verification
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        To prove <strong>Tx_1</strong> exists, a light client only needs the root and the "sibling" hashes (Hash 2 and Branch 2). This is why Merkle Trees are the backbone of high-performance mobile wallets.
                    </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h4 className="font-black text-xs mb-3 flex items-center gap-2 uppercase tracking-tight">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> Tamper-Proof Root
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Try changing <strong>Tx_1</strong>. Notice how the change "Avalanches" up through Branch 1 and eventually results in a completely different Merkle Root. 
                    </p>
                </div>
            </div>
        </div>
    );
};