'use client';
import { motion } from 'framer-motion';
import { FileCode, Cog, Cpu } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function JSXCompilationVisualizer({ isExecuting }: { isExecuting: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <FileCode className="w-3 h-3 text-react" /> The Build Pipeline
      </div>

      <div className="flex items-center justify-between w-full px-4 gap-4">
        {/* Source JSX */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Source JSX</div>
          <div className="p-4 bg-muted/30 border border-border rounded-lg font-mono text-[10px] h-24 flex items-center justify-center">
            <span className="text-react">{"<div>"}</span>
          </div>
        </div>

        {/* Compiler */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={isExecuting ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-react/10 border border-react/30 rounded-full"
          >
            <Cog className={cn("w-6 h-6", isExecuting ? "text-react" : "text-muted-foreground")} />
          </motion.div>
          <div className="text-[8px] font-bold text-react uppercase">Babel / SWC</div>
        </div>

        {/* Compiled JS */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">JavaScript Output</div>
          <div className="p-4 bg-muted/30 border border-border rounded-lg font-mono text-[10px] h-24 flex items-center justify-center overflow-hidden">
            <motion.div
              animate={isExecuting ? { opacity: [0, 1] } : { opacity: 0.3 }}
              className="text-emerald-500 whitespace-pre"
            >
              {`_jsx("div", {
  className: "hero"
})`}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-[360px] text-center">
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold mb-2">
          <Cpu className={cn("w-3.5 h-3.5", isExecuting ? "text-react" : "text-muted-foreground")} />
          {isExecuting ? "Syntactic sugar being desugared..." : "Browsers can't read JSX natively."}
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          JSX is just a concise way to write nested function calls. Every tag becomes an 
          object-creating instruction for React's engine.
        </p>
      </div>
    </div>
  );
}
