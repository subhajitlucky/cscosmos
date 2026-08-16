import { motion, AnimatePresence } from "framer-motion";
import { Database, Zap, Search } from "lucide-react";
import { useState } from "react";
import { Button } from '@/components/visualizers/cloudcosmos/components/ui/button';

export function CachingVisualizer() {
  const [requestState, setRequestState] = useState<'idle' | 'searching' | 'hit' | 'miss'>('idle');

  const simulateRequest = (isCached: boolean) => {
    setRequestState('searching');
    setTimeout(() => {
      setRequestState(isCached ? 'hit' : 'miss');
      setTimeout(() => setRequestState('idle'), 2000);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full py-4">
      <div className="flex gap-2">
        <Button onClick={() => simulateRequest(true)} size="sm" variant="outline" className="text-[10px] font-bold">REQUEST (CACHED)</Button>
        <Button onClick={() => simulateRequest(false)} size="sm" variant="outline" className="text-[10px] font-bold border-dashed">REQUEST (UNCACHED)</Button>
      </div>

      <div className="relative w-full max-w-[280px] h-64 border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-between">
        {/* Cache Layer */}
        <div className="relative w-full p-4 rounded-2xl border-2 border-primary/40 bg-primary/5 flex items-center justify-between group">
           <div className="flex items-center gap-2">
             <Zap className="h-4 w-4 text-primary" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Cache (RAM)</span>
           </div>
           {requestState === 'hit' && <div className="text-[9px] font-bold text-green-500 animate-bounce">HIT! (2ms)</div>}
        </div>

        <div className="h-10 w-[1px] bg-border border-dashed" />

        {/* DB Layer */}
        <div className="relative w-full p-4 rounded-2xl border-2 border-muted-foreground/20 bg-muted/30 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Database className="h-4 w-4 text-muted-foreground" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Database (Disk)</span>
           </div>
           {requestState === 'miss' && <div className="text-[9px] font-bold text-amber-500 animate-pulse">MISS (200ms)</div>}
        </div>

        {/* Animated Request Particle */}
        <AnimatePresence>
          {requestState === 'searching' && (
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full shadow-lg z-20 flex items-center justify-center"
            >
              <Search className="h-2 w-2 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[10px] text-center text-muted-foreground italic leading-relaxed">
        Caching stores data in high-speed RAM to avoid expensive <br /> disk I/O or complex database queries.
      </p>
    </div>
  );
}
