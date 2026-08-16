import { motion } from "framer-motion";
import { Database, Shield, Zap, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function RegionsAZsVisualizer() {
  const [activeAZ, setActiveAZ] = useState<string | null>(null);

  const azs = [
    { id: 'az-1', name: 'US-EAST-1A', color: 'text-blue-500' },
    { id: 'az-2', name: 'US-EAST-1B', color: 'text-indigo-500' },
    { id: 'az-3', name: 'US-EAST-1C', color: 'text-violet-500' },
  ];

  return (
    <div className="flex flex-col items-center gap-8 w-full h-full justify-center py-4">
      <div className="relative w-full max-w-[340px] p-8 glass border-2 border-primary/20 rounded-[2.5rem] shadow-2xl">
        <div className="absolute -top-3 left-8 px-3 py-1 glass border border-primary/30 rounded-full text-[9px] font-bold text-primary uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
          <Globe className="h-3 w-3" /> Region: us-east-1
        </div>

        <div className="grid grid-cols-3 gap-3 relative z-10">
          {azs.map((az) => (
            <motion.div
              key={az.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveAZ(az.id === activeAZ ? null : az.id)}
              className={cn(
                "cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group",
                activeAZ === az.id ? "border-primary bg-primary/5 shadow-inner" : "border-transparent glass hover:border-primary/20"
              )}
            >
              <div className={cn("p-2 rounded-xl bg-background border transition-colors group-hover:border-primary/30", az.color)}>
                 <Database className="h-4 w-4" />
              </div>
              <span className="text-[8px] font-extrabold text-center tracking-tighter">{az.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 relative h-24 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
          <div className="relative z-10 p-4 h-full flex items-center justify-center">
            {activeAZ ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 text-center"
              >
                 <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold uppercase">
                   <Shield className="h-3 w-3" /> Isolated Fault Domain
                 </div>
                 <p className="text-[10px] text-muted-foreground leading-snug">Independent power, networking, and cooling systems protect this zone.</p>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                <Zap className="h-5 w-5" />
                <p className="text-[9px] font-bold uppercase tracking-widest">Select Zone</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}