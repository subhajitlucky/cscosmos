'use client';
import { motion } from 'framer-motion';
import { Target, List, CheckCircle2 } from 'lucide-react';

export default function DeclarativeUIVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const steps = [
    "Find button element",
    "Add 'loading' class",
    "Disable button",
    "Start fetch request",
    "Update text to 'Saving...'"
  ];

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Target className="w-3 h-3 text-react" /> The "What" vs the "How"
      </div>

      <div className="grid grid-cols-2 gap-12 w-full h-full pt-8">
        {/* Imperative Side */}
        <div className="flex flex-col gap-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
            <List className="w-3 h-3" /> Imperative (How)
          </div>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3, x: -10 }}
                animate={isExecuting ? { 
                  opacity: [0.3, 1, 0.3],
                  x: [0, 5, 0],
                  backgroundColor: ['transparent', 'rgba(255,255,255,0.05)', 'transparent']
                } : {}}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="p-2 border border-border rounded text-[10px] font-mono text-muted-foreground"
              >
                {i + 1}. {step}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Declarative Side */}
        <div className="flex flex-col gap-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-react mb-2 flex items-center gap-2">
            <Target className="w-3 h-3" /> Declarative (What)
          </div>
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/20 relative">
             <motion.div
               animate={isExecuting ? { 
                 scale: [1, 1.1, 1],
                 borderColor: ['var(--border)', '#00d8ff', 'var(--border)']
               } : {}}
               className="p-6 bg-card border border-border rounded-2xl shadow-xl flex flex-col items-center gap-3"
             >
                <div className="text-[11px] font-mono text-react">
                  {"{ isLoading ? <Loading /> : <Submit /> }"}
                </div>
                {isExecuting && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase"
                   >
                     <CheckCircle2 className="w-3 h-3" /> UI Synced
                   </motion.div>
                )}
             </motion.div>

             <div className="absolute bottom-4 text-center px-4">
                <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                  React handles the DOM manipulations. You only describe the state.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
