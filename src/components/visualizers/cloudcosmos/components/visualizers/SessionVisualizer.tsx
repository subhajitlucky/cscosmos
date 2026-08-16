import { motion } from "framer-motion";
import { User, Server, Database, Key } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SessionVisualizer() {
  const [store, setStore] = useState<'local' | 'distributed'>('local');

  return (
    <div className="flex flex-col items-center gap-8 w-full py-4 px-6">
      <div className="flex p-1 bg-muted rounded-xl">
        <button 
          onClick={() => setStore('local')}
          className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all", store === 'local' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground")}
        >
          LOCAL SESSION
        </button>
        <button 
          onClick={() => setStore('distributed')}
          className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all", store === 'distributed' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground")}
        >
          DISTRIBUTED (REDIS)
        </button>
      </div>

      <div className="relative w-full max-w-[300px] aspect-video flex flex-col items-center justify-between py-4">
        <User className="h-8 w-8 text-primary mb-4" />

        <div className="flex justify-between w-full relative">
           {/* Connection lines */}
           <div className="absolute top-0 left-1/4 w-[1px] h-full border-l-2 border-dashed border-border -z-10" />
           <div className="absolute top-0 right-1/4 w-[1px] h-full border-l-2 border-dashed border-border -z-10" />

           <div className="flex flex-col items-center gap-2">
              <div className="p-4 glass border-2 rounded-2xl relative">
                 <Server className="h-6 w-6 text-muted-foreground" />
                 {store === 'local' && (
                   <motion.div 
                    layoutId="session"
                    className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-background"
                   >
                      <Key className="h-2 w-2 text-white" />
                   </motion.div>
                 )}
              </div>
              <span className="text-[8px] font-mono uppercase">Node A</span>
           </div>

           <div className="flex flex-col items-center gap-2">
              <div className="p-4 glass border-2 rounded-2xl relative">
                 <Server className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-[8px] font-mono uppercase">Node B</span>
           </div>
        </div>

        {store === 'distributed' && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 p-3 glass border-2 border-primary rounded-2xl flex items-center gap-3 relative"
          >
             <Database className="h-6 w-6 text-primary" />
             <div className="flex flex-col">
                <span className="text-[8px] font-bold uppercase">External Store</span>
                <span className="text-[7px] text-muted-foreground">Redis / ElastiCache</span>
             </div>
             <motion.div 
                layoutId="session"
                className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-background shadow-lg shadow-green-500/20"
             >
                <Key className="h-3 w-3 text-white" />
             </motion.div>
          </motion.div>
        )}
      </div>

      <p className="text-[10px] text-center text-muted-foreground italic leading-relaxed">
        {store === 'local' 
          ? "Local storage makes the node stateful. If the user hits Node B, they'll be logged out." 
          : "Distributed session storage allows any node to authenticate the user, enabling perfect horizontal scaling."}
      </p>
    </div>
  );
}
