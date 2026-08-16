import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, Globe, Server, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  mode: 'ha' | 'dr' | 'multi-region';
}

export function AvailabilityVisualizer({ mode }: Props) {
  const [fail, setFail] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8 w-full py-4">
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        <button 
          onClick={() => setFail(false)}
          className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all", !fail ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground")}
        >
          NOMINAL
        </button>
        <button 
          onClick={() => setFail(true)}
          className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all", fail ? "bg-destructive text-destructive-foreground shadow-sm" : "text-muted-foreground")}
        >
          SIMULATE FAILURE
        </button>
      </div>

      <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center p-4">
        {mode === 'ha' && (
          <div className="grid grid-cols-2 gap-8 w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">AZ-1</div>
              <motion.div 
                animate={{ 
                  opacity: fail ? 0.3 : 1,
                  scale: fail ? 0.9 : 1,
                }}
                className={cn(
                  "p-4 glass border-2 rounded-2xl relative transition-colors duration-500",
                  fail ? "border-destructive" : "border-primary"
                )}
              >
                <Server className={cn("h-8 w-8", fail ? "text-destructive" : "text-primary")} />
                {fail && <AlertTriangle className="absolute -top-2 -right-2 h-5 w-5 text-destructive fill-background" />}
              </motion.div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">AZ-2</div>
              <motion.div 
                animate={{ 
                  scale: fail ? 1.1 : 1,
                  boxShadow: fail ? "0 0 20px rgba(59,130,246,0.3)" : "none"
                }}
                className="p-4 glass border-2 border-primary rounded-2xl"
              >
                <Server className="h-8 w-8 text-primary" />
                {fail && <motion.div animate={{ opacity: [0, 1] }} className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-primary">RECV ALL TRAFFIC</motion.div>}
              </motion.div>
            </div>
          </div>
        )}

        {mode === 'multi-region' && (
          <div className="relative w-full h-full">
            <Globe className="absolute inset-0 m-auto h-32 w-32 text-muted-foreground/10" />
            <div className="flex justify-between items-center h-full px-4 relative z-10">
               <div className="flex flex-col items-center gap-2">
                  <div className="p-3 glass border-2 border-primary rounded-xl">
                     <Server className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-[8px] font-bold uppercase">US-EAST</span>
               </div>
               
               <motion.div 
                 animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="flex-1 h-[2px] bg-gradient-to-r from-primary to-indigo-500 mx-4" 
               />

               <div className="flex flex-col items-center gap-2">
                  <div className="p-3 glass border-2 border-indigo-500 rounded-xl">
                     <Server className="h-6 w-6 text-indigo-500" />
                  </div>
                  <span className="text-[8px] font-bold uppercase">EU-WEST</span>
               </div>
            </div>
          </div>
        )}

        {mode === 'dr' && (
           <div className="flex flex-col items-center gap-6 w-full">
              <motion.div 
                animate={{ 
                  opacity: fail ? 0.2 : 1,
                  y: fail ? 10 : 0
                }}
                className="p-6 glass border-4 border-primary rounded-3xl flex flex-col items-center gap-2"
              >
                 <Zap className="h-10 w-10 text-primary" />
                 <span className="text-[10px] font-bold">PRIMARY SITE</span>
              </motion.div>
              
              <AnimatePresence>
                {fail && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                     <ArrowDown className="h-6 w-6 text-indigo-500 animate-bounce" />
                     <div className="p-6 glass border-4 border-indigo-500 rounded-3xl flex flex-col items-center gap-2 shadow-2xl shadow-indigo-500/20">
                        <ShieldCheck className="h-10 w-10 text-indigo-500" />
                        <span className="text-[10px] font-bold">DR FAILOVER SITE</span>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        )}
      </div>
    </div>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>
    </svg>
  );
}
