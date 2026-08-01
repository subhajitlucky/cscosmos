'use client';
import { motion } from 'framer-motion';
import { MousePointer2, Cpu, Database } from 'lucide-react';

export default function ControlledUncontrolledVisualizer({ isExecuting }: { isExecuting: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Cpu className="w-3 h-3 text-react" /> Form Management
      </div>

      <div className="grid grid-cols-2 gap-12 w-full pt-8">
        {/* Controlled */}
        <div className="flex flex-col gap-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-react text-center">Controlled</div>
          <div className="flex-1 p-4 border border-react/30 bg-react/5 rounded-xl flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-mono">
                <Database className="w-3 h-3" /> State: <span className="text-react">"Hello"</span>
             </div>
             <div className="relative w-full">
                <div className="w-full h-8 bg-muted border border-border rounded flex items-center px-2 text-[11px]">
                  Hello
                </div>
                {isExecuting && (
                  <motion.div
                    animate={{ x: [0, 10, 0], y: [0, 5, 0] }}
                    className="absolute -right-2 -bottom-2"
                  >
                    <MousePointer2 className="w-4 h-4 text-react fill-react" />
                  </motion.div>
                )}
             </div>
             <p className="text-[9px] text-muted-foreground italic text-center">
                React state is the "single source of truth". Every keystroke updates state.
             </p>
          </div>
        </div>

        {/* Uncontrolled */}
        <div className="flex flex-col gap-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Uncontrolled</div>
          <div className="flex-1 p-4 border border-border bg-muted/20 rounded-xl flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-mono opacity-30">
                <Database className="w-3 h-3" /> State: <span>null</span>
             </div>
             <div className="w-full h-8 bg-muted border border-border rounded flex items-center px-2 text-[11px] text-muted-foreground">
                [Native DOM Input]
             </div>
             <p className="text-[9px] text-muted-foreground italic text-center">
                The DOM holds the value. We use a "ref" to pull it out when needed.
             </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center px-6">
        <div className="text-[11px] font-bold mb-1 uppercase tracking-tighter">Who owns the data?</div>
        <p className="text-[10px] text-muted-foreground italic leading-relaxed">
          In Controlled components, React is the pilot. In Uncontrolled components, 
          the Browser is the pilot.
        </p>
      </div>
    </div>
  );
}
