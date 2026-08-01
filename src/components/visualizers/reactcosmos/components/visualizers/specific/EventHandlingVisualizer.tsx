'use client';
import { motion } from 'framer-motion';
import { MousePointer2, Zap, Share2 } from 'lucide-react';

export default function EventHandlingVisualizer({ isExecuting }: { isExecuting: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Zap className="w-3 h-3 text-react" /> Synthetic Events
      </div>

      <div className="flex flex-col items-center gap-8 w-full pt-8">
        <div className="relative w-48 h-48 border-2 border-border rounded-full flex items-center justify-center bg-muted/5">
           {/* Root Delegation */}
           <div className="absolute inset-0 border-4 border-react/20 rounded-full scale-110" />
           <div className="absolute top-0 -translate-y-1/2 bg-background px-3 py-1 border border-react text-[9px] font-black text-react uppercase rounded-full">
              Root Event Listener
           </div>

           {/* Bubbling path */}
           <div className="w-1 h-32 bg-border/30 absolute" />

           {/* Target Button */}
           <motion.div
             animate={isExecuting ? { 
               scale: [1, 0.9, 1],
               backgroundColor: ['rgba(255,255,255,0.05)', 'rgba(0,216,255,0.1)', 'rgba(255,255,255,0.05)']
             } : {}}
             className="w-24 h-10 border border-border bg-card rounded flex items-center justify-center text-[10px] font-bold uppercase relative z-10"
           >
              Target Button
              {isExecuting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-4 -right-4"
                >
                  <MousePointer2 className="w-5 h-5 text-react fill-react" />
                </motion.div>
              )}
           </motion.div>

           {/* Event Bubble */}
           {isExecuting && (
             <motion.div
               initial={{ bottom: '25%', opacity: 0 }}
               animate={{ bottom: '100%', opacity: 1 }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
               className="absolute w-6 h-6 bg-react/20 border border-react rounded-full flex items-center justify-center shadow-[0_0_15px_#00d8ff]"
             >
                <Share2 className="w-3 h-3 text-react" />
             </motion.div>
           )}
        </div>

        <div className="text-center max-w-[320px]">
           <div className="text-[11px] font-bold mb-2 uppercase tracking-tighter">Event Delegation</div>
           <p className="text-[10px] text-muted-foreground italic leading-relaxed">
             React doesn't attach events to every button. It listens at the root and 
             delegates. The native event is wrapped in a <span className="text-react font-bold">SyntheticEvent</span>.
           </p>
        </div>
      </div>
    </div>
  );
}
