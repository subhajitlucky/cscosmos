'use client';
import { motion } from 'framer-motion';
import { Database, Zap, Monitor } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function WhatIsReactVisualizer({ isExecuting }: { isExecuting: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Zap className="w-3 h-3 text-react" /> UI as a Function
      </div>

      <div className="flex items-center gap-12 relative z-10">
        {/* State Node */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={isExecuting ? { 
              scale: [1, 1.2, 1],
              backgroundColor: ['rgba(255,255,255,0.05)', 'rgba(0,216,255,0.1)', 'rgba(255,255,255,0.05)']
            } : {}}
            className="w-16 h-16 rounded-2xl border border-border bg-muted/30 flex items-center justify-center relative"
          >
            <Database className={cn("w-6 h-6 transition-colors", isExecuting ? "text-react" : "text-muted-foreground")} />
            {isExecuting && (
              <motion.div
                layoutId="pulse"
                className="absolute inset-0 rounded-2xl border-2 border-react"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">State</span>
        </div>

        {/* Arrow 1 */}
        <div className="relative w-12 h-0.5 bg-border">
          {isExecuting && (
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: '100%' }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-react rounded-full shadow-[0_0_10px_#00d8ff]"
            />
          )}
        </div>

        {/* React Node */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={isExecuting ? { rotate: 360 } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-2 border-react/30 flex items-center justify-center bg-react/5 relative"
          >
            <Zap className="w-8 h-8 text-react fill-react/20" />
          </motion.div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-react">React</span>
        </div>

        {/* Arrow 2 */}
        <div className="relative w-12 h-0.5 bg-border">
          {isExecuting && (
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: '100%' }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.5 }}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-react rounded-full shadow-[0_0_10px_#00d8ff]"
            />
          )}
        </div>

        {/* UI Node */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={isExecuting ? { 
              y: [0, -5, 0],
              boxShadow: ['0 0 0px rgba(0,0,0,0)', '0 0 30px rgba(0,216,255,0.2)', '0 0 0px rgba(0,0,0,0)']
            } : {}}
            className="w-16 h-16 rounded-2xl border border-border bg-muted/30 flex items-center justify-center"
          >
            <Monitor className={cn("w-6 h-6 transition-colors", isExecuting ? "text-react" : "text-muted-foreground")} />
          </motion.div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">UI</span>
        </div>
      </div>

      <div className="mt-12 text-center max-w-[280px]">
        <div className="text-[13px] font-mono text-foreground mb-2 flex justify-center gap-2">
          <span className="text-react">f</span>(state) = <span className="text-foreground font-bold">UI</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
          {isExecuting 
            ? "Detecting state change, re-running component function, and patching the DOM." 
            : "The UI is a deterministic reflection of state. Change state, and the UI follows."}
        </p>
      </div>
    </div>
  );
}
