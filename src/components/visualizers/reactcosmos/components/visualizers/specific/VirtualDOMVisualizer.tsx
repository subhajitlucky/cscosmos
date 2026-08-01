'use client';
import { motion } from 'framer-motion';
import { Layers, Zap, GitCompare } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function VirtualDOMVisualizer({ isExecuting }: { isExecuting: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Layers className="w-3 h-3 text-react" /> VDOM Diffing Engine
      </div>

      <div className="flex flex-col gap-12 w-full h-full pt-8">
        <div className="flex-1 grid grid-cols-2 gap-8 items-center">
          {/* VDOM Side */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-react mb-2">Virtual DOM (Memory)</div>
            <div className="relative p-6 border-2 border-react/30 rounded-2xl bg-react/5 w-full aspect-square flex items-center justify-center">
              <motion.div
                animate={isExecuting ? { 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 1, 0.5]
                } : { opacity: 0.5 }}
                className="grid grid-cols-2 gap-3"
              >
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded bg-react/20 border border-react/40" />
                ))}
              </motion.div>
              {isExecuting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <GitCompare className="w-8 h-8 text-react animate-spin-slow" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Real DOM Side */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Real DOM (Browser)</div>
            <div className="relative p-6 border-2 border-border rounded-2xl bg-muted/20 w-full aspect-square flex items-center justify-center">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i} 
                    animate={isExecuting && i === 2 ? {
                      backgroundColor: ['rgba(0,0,0,0)', 'rgba(0,216,255,0.2)', 'rgba(0,0,0,0)'],
                      borderColor: ['var(--border)', '#00d8ff', 'var(--border)'],
                      scale: [1, 1.2, 1]
                    } : {}}
                    className="w-8 h-8 rounded border border-border" 
                  />
                ))}
              </div>
              {isExecuting && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded animate-bounce">
                  PATCHING
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center px-8">
           <div className="flex items-center justify-center gap-2 text-[11px] font-bold mb-2">
              <Zap className={cn("w-3.5 h-3.5", isExecuting ? "text-react" : "text-muted-foreground")} />
              {isExecuting ? "Diffing trees & identifying minimum mutations..." : "Comparing new VDOM with previous snapshot."}
           </div>
           <p className="text-[10px] text-muted-foreground italic max-w-[400px] mx-auto">
             React only updates the second node (highlighted) because only that part of the state changed. 
             This avoids re-painting the entire UI.
           </p>
        </div>
      </div>
    </div>
  );
}
