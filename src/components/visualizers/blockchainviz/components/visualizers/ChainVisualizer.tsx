import React, { useRef, useEffect } from 'react';
import { useBlockchain } from '../../lib/use-blockchain';
import { BlockVisualizer } from './BlockVisualizer';
import { Button } from '../ui/button';
import { RefreshCcw, ShieldCheck, Activity, Share2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export const ChainVisualizer: React.FC = () => {
  const { chain, resetChain, validateChain } = useBlockchain();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to end when chain grows
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            left: scrollRef.current.scrollWidth,
            behavior: 'smooth'
        });
    }
  }, [chain.length]);

  const allValid = chain.every(b => b.isValid);

  return (
    <div className="flex flex-col h-full relative">
        {/* Floating Control Dock */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center bg-background/40 backdrop-blur-md border border-border/50 p-4 rounded-3xl shadow-xl">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        allValid ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-destructive animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        Network {allValid ? "Consistent" : "Integrity Failure"}
                    </span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold opacity-40 uppercase">Chain Height</span>
                        <span className="text-xs font-black font-mono">{chain.length}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold opacity-40 uppercase">Valid Confirms</span>
                        <span className="text-xs font-black font-mono text-green-500">{chain.filter(b => b.isValid).length}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                {!allValid && (
                    <Button 
                        size="sm" 
                        onClick={validateChain}
                        className="rounded-full bg-primary shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest px-4 h-9"
                    >
                        <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Validate Chain
                    </Button>
                )}
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetChain}
                    className="rounded-full h-9 px-4 text-[10px] font-black uppercase tracking-widest"
                >
                    <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Reset
                </Button>
            </div>
        </div>
        
        {/* The Chain Canvas */}
        <div 
            ref={scrollRef}
            className="flex-1 overflow-x-auto mt-20 pb-12 flex items-center gap-12 px-8 scrollbar-hide select-none"
        >
            <AnimatePresence initial={false}>
                {chain.map((block, index) => (
                    <React.Fragment key={block.hash + index}>
                        <BlockVisualizer block={block} index={index} />
                        
                        {/* Interactive Link Visual */}
                        {index < chain.length - 1 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-2 shrink-0 z-10"
                            >
                                <div className={cn(
                                    "w-12 h-0.5 transition-colors duration-500",
                                    chain[index+1].isValid ? "bg-primary/20" : "bg-destructive/20"
                                )} />
                                <div className={cn(
                                    "p-2 rounded-full border-2 transition-all duration-500 shadow-sm",
                                    chain[index+1].isValid ? "bg-card border-primary/20 text-primary/40" : "bg-destructive/10 border-destructive text-destructive animate-pulse"
                                )}>
                                    <Share2 className="w-3.5 h-3.5" />
                                </div>
                                <div className={cn(
                                    "w-12 h-0.5 transition-colors duration-500",
                                    chain[index+1].isValid ? "bg-primary/20" : "bg-destructive/20"
                                )} />
                            </motion.div>
                        )}
                    </React.Fragment>
                ))}
            </AnimatePresence>
            
            {/* The Network Tip / Mining Anchor */}
            <div className="min-w-[340px] h-[400px] border-4 border-dashed border-border/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-muted-foreground/20 group hover:border-primary/20 transition-colors">
                <div className="p-6 bg-secondary/5 rounded-full border-2 border-border/10 group-hover:text-primary/40 group-hover:scale-110 transition-all duration-500">
                    <Activity className="w-12 h-12" />
                </div>
                <div className="text-center">
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Network Tip</span>
                    <p className="text-[10px] font-bold mt-1 max-w-[120px] mx-auto opacity-50 uppercase tracking-tighter">Awaiting new block propagation</p>
                </div>
            </div>
            
            <div className="min-w-[100px]" /> {/* Final trailing spacer */}
        </div>

        {/* Floating Help Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-secondary/20 border border-border/50 px-4 py-2 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest backdrop-blur-sm">
            <Info className="w-3.5 h-3.5" />
            Try editing transaction amounts inside blocks to break history
        </div>
    </div>
  );
};