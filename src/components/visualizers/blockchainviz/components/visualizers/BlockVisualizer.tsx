import React, { useState } from 'react';
import type { Block } from '../../lib/types';
import { useBlockchain } from '../../lib/use-blockchain';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Clock, CheckCircle2, ChevronRight, ChevronDown, Database, Cpu, Lock, Unlock, ShieldAlert } from 'lucide-react';

interface BlockProps {
  block: Block;
  index: number;
}

export const BlockVisualizer: React.FC<BlockProps> = ({ block, index }) => {
  const { updateTransaction } = useBlockchain();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      className={cn(
        "relative min-w-[340px] max-w-[340px] rounded-[2rem] border-2 p-6 transition-all duration-500",
        block.isValid 
            ? "bg-card border-primary/10 shadow-xl hover:border-primary/30" 
            : "bg-destructive/5 border-destructive shadow-2xl shadow-destructive/20 animate-shake"
      )}
    >
        {/* Header Ribbon */}
        <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
                <div className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                    block.isValid ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                )}>
                    {block.isValid ? <CheckCircle2 className="w-2.5 h-2.5" /> : <ShieldAlert className="w-2.5 h-2.5" />}
                    {block.isValid ? "Valid State" : "Tampered"}
                </div>
                <h3 className="text-2xl font-black tracking-tighter flex items-center gap-2 mt-1">
                    Block <span className="text-primary">#{block.header.index}</span>
                </h3>
            </div>
            <div className="text-right">
                <div className="text-[10px] font-bold opacity-30 uppercase">Work Nonce</div>
                <div className="font-mono text-sm font-black">{block.header.nonce}</div>
            </div>
        </div>

        {/* Technical Data Fields */}
        <div className="space-y-3 font-mono">
            <div className="p-3 bg-secondary/30 rounded-2xl border border-border/50 group cursor-help">
                <div className="text-[9px] font-bold text-muted-foreground mb-1 flex justify-between items-center uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Hash className="w-2.5 h-2.5" /> Prev Hash</span>
                    <Lock className="w-2.5 h-2.5 opacity-20" />
                </div>
                <div className={cn(
                    "text-[10px] truncate font-bold transition-colors",
                    !block.isValid && index > 0 ? "text-destructive" : "text-primary/60"
                )}>
                    {block.header.previousHash}
                </div>
            </div>

            <div className="p-3 bg-secondary/30 rounded-2xl border border-border/50 group cursor-help">
                <div className="text-[9px] font-bold text-muted-foreground mb-1 flex justify-between items-center uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Cpu className="w-2.5 h-2.5" /> Block Hash</span>
                    <Database className="w-2.5 h-2.5 opacity-20" />
                </div>
                <div className="text-[10px] truncate text-primary font-black">
                    {block.hash}
                </div>
            </div>
        </div>

        {/* Transaction Content */}
        <div className="mt-6 pt-6 border-t border-border/50">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center group"
            >
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Database className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest">Payload ({block.transactions.length})</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground transition-all group-hover:text-primary">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4 space-y-2"
                    >
                        {block.transactions.map((tx, txIndex) => (
                            <div key={tx.id} className="p-3 bg-secondary/50 rounded-xl border border-border/50 group/tx relative overflow-hidden">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-mono font-bold opacity-30">{tx.id.substring(0, 12)}</span>
                                    <div className="text-[9px] font-black text-muted-foreground">{tx.sender} → {tx.receiver}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-primary">$</span>
                                    <input 
                                        type="number"
                                        className={cn(
                                            "bg-transparent w-full focus:outline-none focus:bg-primary/5 rounded px-1 transition-colors font-mono font-black text-sm",
                                            block.isValid ? "text-foreground" : "text-destructive"
                                        )}
                                        value={tx.amount}
                                        onChange={(e) => updateTransaction(index, txIndex, Number(e.target.value))}
                                    />
                                    <Unlock className="w-3 h-3 text-destructive opacity-0 group-hover/tx:opacity-100 transition-opacity cursor-pointer" />
                                </div>
                                
                                {/* Tamper Highlight */}
                                {!block.isValid && (
                                    <div className="absolute inset-0 border border-destructive/20 bg-destructive/5 pointer-events-none" />
                                )}
                            </div>
                        ))}
                        {block.transactions.length === 0 && (
                            <div className="text-center text-[10px] font-bold text-muted-foreground py-4 opacity-30">No transactions in block</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Block Footer */}
        <div className="mt-6 flex justify-between items-center opacity-40">
            <div className="flex items-center gap-1.5 font-mono text-[9px] font-black">
                <Clock className="w-3 h-3" />
                {new Date(block.header.timestamp).toLocaleTimeString()}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest">
                Height: {block.header.index}
            </div>
        </div>

        {/* Connection Line Visual */}
        {index > 0 && (
            <div className="absolute top-1/2 -left-8 w-8 h-0.5 bg-border/50 pointer-events-none" />
        )}
    </motion.div>
  );
};