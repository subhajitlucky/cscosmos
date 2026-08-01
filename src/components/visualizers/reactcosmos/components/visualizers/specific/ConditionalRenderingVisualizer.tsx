'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleLeft, Circle, Triangle } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function ConditionalRenderingVisualizer({ isExecuting }: { isExecuting: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <ToggleLeft className="w-3 h-3 text-react" /> UI Logic
      </div>

      <div className="flex flex-col items-center gap-10 w-full pt-8">
        {/* Logic Toggle */}
        <div className="p-4 bg-muted/30 border border-border rounded-2xl flex flex-col items-center gap-4 w-48 shadow-inner">
           <div className="text-[10px] font-mono font-bold">
              if (<span className={cn("transition-colors", isExecuting ? "text-react" : "text-muted-foreground")}>{isExecuting ? "true" : "false"}</span>)
           </div>
           <div className="w-12 h-6 bg-border/30 rounded-full relative p-1">
              <motion.div
                animate={{ x: isExecuting ? 24 : 0 }}
                className={cn("w-4 h-4 rounded-full", isExecuting ? "bg-react" : "bg-muted-foreground/30")}
              />
           </div>
        </div>

        {/* UI Outcome */}
        <div className="relative h-24 flex items-center justify-center w-full">
           <AnimatePresence mode="wait">
              {isExecuting ? (
                <motion.div
                  key="on"
                  initial={{ scale: 0, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="p-8 bg-react/10 border border-react/30 rounded-3xl flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(0,216,255,0.1)]"
                >
                   <Triangle className="w-10 h-10 text-react fill-react/20" />
                   <span className="text-[10px] font-black text-react uppercase">Authenticated UI</span>
                </motion.div>
              ) : (
                <motion.div
                  key="off"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="p-8 bg-muted/20 border border-border rounded-3xl flex flex-col items-center gap-2"
                >
                   <Circle className="w-10 h-10 text-muted-foreground opacity-30" />
                   <span className="text-[10px] font-black text-muted-foreground uppercase">Guest UI</span>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <p className="text-[10px] text-muted-foreground italic text-center max-w-[300px]">
          Conditional rendering is the power to describe multiple states of the UI in 
          the same component. React only mounts what is needed.
        </p>
      </div>
    </div>
  );
}
