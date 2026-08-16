import { motion } from "framer-motion";
import { User, Server, Database, RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StatelessStatefulVisualizer() {
  const [type, setType] = useState<'stateless' | 'stateful'>('stateless');
  const [activeNode, setActiveNode] = useState(0);

  const switchNode = () => setActiveNode((activeNode + 1) % 2);

  return (
    <div className="flex flex-col items-center gap-6 w-full py-4">
      <div className="flex p-1 bg-muted rounded-xl">
        <button 
          onClick={() => setType('stateless')}
          className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all", type === 'stateless' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground")}
        >
          STATELESS
        </button>
        <button 
          onClick={() => setType('stateful')}
          className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all", type === 'stateful' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground")}
        >
          STATEFUL
        </button>
      </div>

      <div className="relative w-full max-w-[300px] aspect-square flex flex-col items-center justify-between py-6">
        <motion.div 
          onClick={switchNode}
          className="cursor-pointer group flex flex-col items-center gap-1"
        >
          <User className="h-6 w-6 text-primary" />
          <span className="text-[8px] font-bold uppercase tracking-tighter">User Request</span>
          <div className="text-[10px] text-muted-foreground group-hover:text-primary flex items-center gap-1">
             <RefreshCw className="h-3 w-3" /> Switch Target Node
          </div>
        </motion.div>

        <div className="flex gap-12 relative w-full justify-center">
           {[0, 1].map(i => (
             <div key={i} className="flex flex-col items-center gap-2">
                <motion.div 
                  animate={{ 
                    scale: activeNode === i ? 1.1 : 1
                  }}
                  className={cn(
                    "p-4 glass border-2 rounded-2xl relative transition-colors duration-300",
                    activeNode === i ? "border-primary" : "border-border"
                  )}
                >
                   <Server className={cn("h-6 w-6", activeNode === i ? "text-primary" : "text-muted-foreground")} />
                   {type === 'stateful' && i === 0 && (
                     <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-background">
                        <Database className="h-2 w-2 text-white" />
                     </div>
                   )}
                </motion.div>
                <span className="text-[8px] font-mono">Node_{i}</span>
             </div>
           ))}
        </div>

        <div className="w-full p-3 rounded-xl bg-muted/50 text-center">
           {type === 'stateless' ? (
             <p className="text-[9px] text-green-600 dark:text-green-400 font-bold uppercase">
               No Session Data: User can hit ANY node safely.
             </p>
           ) : (
             <p className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase leading-tight">
               Session in Node_0 memory: <br /> Hit Node_1 = Authentication Error
             </p>
           )}
        </div>
      </div>
    </div>
  );
}
