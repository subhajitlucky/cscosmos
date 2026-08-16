import React from 'react';
import { useBlockchain } from '../../lib/use-blockchain';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Box, Layers, Zap, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export const MempoolVisualizer: React.FC = () => {
  const { mempool, mineBlock } = useBlockchain();

  // Sort mempool by amount (as a proxy for fee)
  const sortedMempool = [...mempool].sort((a, b) => b.amount - a.amount);

  return (
    <Card className="w-full bg-card border-border shadow-xl rounded-3xl h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border bg-secondary/10">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Layers className="w-4 h-4 text-primary" />
            </div>
            <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest">
                    Mempool
                </CardTitle>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                    {mempool.length} Pending Actions
                </div>
            </div>
        </div>
        <Button 
            onClick={mineBlock} 
            disabled={mempool.length === 0}
            size="sm"
            className="rounded-full h-9 px-4 bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
            <Box className="w-3.5 h-3.5 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Mine Block</span>
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 relative bg-secondary/5">
         <AnimatePresence mode="popLayout">
            {mempool.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-20"
                >
                    <Zap className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Transactions</p>
                </motion.div>
            ) : (
                sortedMempool.map((tx, i) => (
                    <motion.div
                        key={tx.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                        className={cn(
                            "group p-4 rounded-2xl border transition-all cursor-default",
                            i === 0 ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10" : "bg-card border-border shadow-sm hover:border-primary/30"
                        )}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    i === 0 ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                                )} />
                                <span className="font-mono text-[9px] font-bold opacity-40 uppercase tracking-widest">ID: {tx.id.substring(0, 12)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-black uppercase text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded">
                                <Timer className="w-2.5 h-2.5" /> High Priority
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <div className="space-y-0.5">
                                <div className="text-[11px] font-bold">
                                    <span className="text-muted-foreground">{tx.sender}</span>
                                    <span className="mx-2 opacity-20">→</span>
                                    <span>{tx.receiver}</span>
                                </div>
                                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Status: Propagation Complete</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black font-mono text-primary leading-none">
                                    {tx.amount.toFixed(2)} BTC
                                </div>
                                <div className="text-[8px] font-bold opacity-30 uppercase mt-1 tracking-tighter">Est. Fee: {(tx.amount * 0.001).toFixed(4)}</div>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
         </AnimatePresence>
      </CardContent>

      <div className="p-4 bg-card border-t border-border">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground mb-3 tracking-widest">
              <span>Mempool Congestion</span>
              <span>{Math.min(mempool.length * 10, 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${Math.min(mempool.length * 10, 100)}%` }}
                className={cn(
                    "h-full transition-colors duration-500",
                    mempool.length > 8 ? "bg-red-500" : mempool.length > 4 ? "bg-yellow-500" : "bg-primary"
                )}
              />
          </div>
      </div>
    </Card>
  );
};