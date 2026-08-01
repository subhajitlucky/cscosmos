'use client';
import { motion } from 'framer-motion';
import { ArrowDown, Droplets } from 'lucide-react';

export default function PropsFlowVisualizer({ isExecuting }: { isExecuting: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Droplets className="w-3 h-3 text-react" /> Unidirectional Data Flow
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-[300px]">
        {/* Parent Component */}
        <div className="w-48 p-4 bg-react/10 border border-react/30 rounded-xl flex flex-col items-center gap-2">
           <div className="text-[10px] font-black text-react uppercase">Parent</div>
           <div className="w-full h-8 bg-muted/50 rounded flex items-center justify-center text-[10px] font-mono border border-border">
              user: "Subhajit"
           </div>
        </div>

        {/* The Flow */}
        <div className="relative h-20 w-1 bg-border/30">
           {isExecuting && (
             <motion.div
               initial={{ top: 0 }}
               animate={{ top: '100%' }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-react rounded-full shadow-[0_0_15px_#00d8ff] flex items-center justify-center"
             >
                <ArrowDown className="w-2 h-2 text-background" />
             </motion.div>
           )}
        </div>

        {/* Child Components */}
        <div className="flex gap-4 w-full justify-center">
           {[1, 2].map(i => (
             <motion.div
               key={i}
               animate={isExecuting ? { 
                 borderColor: ['var(--border)', '#00d8ff', 'var(--border)'],
                 scale: [1, 1.05, 1]
               } : {}}
               className="flex-1 p-3 bg-muted/20 border border-border rounded-lg flex flex-col items-center gap-2"
             >
                <div className="text-[8px] font-black text-muted-foreground uppercase">Child {i}</div>
                <div className="w-full h-4 bg-react/5 rounded flex items-center justify-center text-[8px] font-mono text-react">
                  prop.user
                </div>
             </motion.div>
           ))}
        </div>
      </div>

      <div className="mt-8 text-center px-4">
        <p className="text-[10px] text-muted-foreground italic leading-relaxed">
          In React, data flows down like a waterfall. Children cannot change the data 
          directly; they only receive and display what is passed to them.
        </p>
      </div >
    </div>
  );
}
