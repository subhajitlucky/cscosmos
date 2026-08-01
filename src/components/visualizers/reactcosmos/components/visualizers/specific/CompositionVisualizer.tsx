'use client';
import { motion } from 'framer-motion';
import { Layout, Grid } from 'lucide-react';

export default function CompositionVisualizer({ isExecuting }: { isExecuting: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Layout className="w-3 h-3 text-react" /> The LEGO Principle
      </div>

      <div className="relative w-64 h-48 border-2 border-dashed border-border rounded-2xl flex items-center justify-center bg-muted/5">
        {/* Child 1: Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={isExecuting ? { x: 0, opacity: 1 } : { x: -20, opacity: 0.5 }}
          className="absolute left-4 top-4 bottom-4 w-12 bg-react/20 border border-react/40 rounded-lg flex items-center justify-center"
        >
          <Grid className="w-4 h-4 text-react opacity-40" />
        </motion.div>

        {/* Child 2: Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={isExecuting ? { y: 0, opacity: 1 } : { y: -10, opacity: 0.5 }}
          className="absolute left-20 top-4 right-4 h-10 bg-purple-500/20 border border-purple-500/40 rounded-lg"
        />

        {/* Child 3: Main Content */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isExecuting ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.5 }}
          className="absolute left-20 top-16 right-4 bottom-4 bg-emerald-500/20 border border-emerald-500/40 rounded-lg flex items-center justify-center p-4 gap-2 flex-wrap"
        >
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-md bg-white/10 border border-white/20" />
          ))}
        </motion.div>

        {!isExecuting && (
          <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 animate-pulse">
            Components Assembling...
          </div>
        )}
      </div>

      <div className="mt-8 text-center max-w-[300px]">
        <div className="text-[11px] font-bold mb-1 uppercase tracking-tighter">Nested Building Blocks</div>
        <p className="text-[10px] text-muted-foreground italic leading-relaxed">
          Instead of one giant file, React encourages small, focused components that 
          compose together to form complex interfaces.
        </p>
      </div>
    </div>
  );
}
