'use client';
import { motion } from 'framer-motion';
import { Database, RefreshCw } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function StateUpdatesVisualizer({ isExecuting }: { isExecuting: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Database className="w-3 h-3 text-react" /> Component Memory
      </div>

      <div className="grid grid-cols-2 gap-12 w-full h-full pt-8">
        {/* Component State (Memory) */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Internal State</div>
          <motion.div
            animate={isExecuting ? { 
              backgroundColor: ['rgba(0,216,255,0.05)', 'rgba(0,216,255,0.2)', 'rgba(0,216,255,0.05)'],
              borderColor: ['var(--border)', '#00d8ff', 'var(--border)']
            } : {}}
            className="w-32 h-32 border-2 border-border rounded-3xl bg-muted/30 flex items-center justify-center relative overflow-hidden"
          >
            <div className="text-2xl font-mono font-black text-foreground">
              {isExecuting ? (
                 <motion.span
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                 >
                   1
                 </motion.span>
              ) : (
                "0"
              )}
            </div>
            {isExecuting && (
              <motion.div
                className="absolute inset-0 bg-react/10"
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>
        </div>

        {/* Action & Trigger */}
        <div className="flex flex-col items-center justify-center gap-6">
           <motion.button
             whileTap={{ scale: 0.95 }}
             className="px-6 py-3 bg-react/10 border border-react/30 rounded-xl flex items-center gap-3 text-react font-bold uppercase tracking-widest text-xs"
           >
              <RefreshCw className={cn("w-4 h-4", isExecuting && "animate-spin")} />
              Update State
           </motion.button>

           <div className="text-center space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Result:</div>
              <p className="text-[11px] text-foreground font-medium italic">
                {isExecuting ? "State changed → Triggering re-render" : "Component remembers '0'"}
              </p>
           </div>
        </div>
      </div>

      <div className="mt-8 text-center max-w-[400px]">
        <p className="text-[10px] text-muted-foreground leading-relaxed italic">
          State is like a component's personal notebook. When the information in that 
          notebook changes, React automatically knows it needs to update the UI.
        </p>
      </div>
    </div>
  );
}
