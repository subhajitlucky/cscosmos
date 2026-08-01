'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';

interface HookNode {
  type: string;
  memoizedState: unknown;
  next: boolean;
}

const HookVisualizer = ({ hooks }: { hooks: HookNode[] }) => {
  return (
    <div className="p-6 bg-card border border-border rounded-xl h-full flex flex-col shadow-sm transition-premium">
      <div className="flex items-center gap-2 mb-8 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em]">
        <LinkIcon className="w-3.5 h-3.5 text-react" />
        Fiber Hooks Linked List
      </div>
      
      <div className="flex-1 flex flex-wrap content-start gap-4 items-center">
        <AnimatePresence>
          {hooks.map((hook, i) => (
            <div key={i} className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="visualizer-node w-32 p-4 border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/50"
              >
                <div className="text-[9px] text-muted-foreground font-mono mb-1.5 uppercase tracking-tighter opacity-60">{hook.type}</div>
                <div className="text-[12px] font-bold truncate font-mono text-foreground">
                  {JSON.stringify(hook.memoizedState)}
                </div>
              </motion.div>
              {hook.next && (
                <ArrowRight className="w-3.5 h-3.5 text-border" />
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-6 border-t border-border">
        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
          <span className="font-black text-foreground not-italic mr-2 uppercase tracking-tighter">Invariant:</span>
          The stability of this sequence is what allows React to persist state across asynchronous render cycles.
        </p>
      </div>
    </div>
  );
};

export default HookVisualizer;
