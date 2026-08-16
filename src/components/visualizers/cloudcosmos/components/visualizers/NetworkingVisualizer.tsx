import { motion } from "framer-motion";
import { Network, Lock, Globe, ArrowRight, ShieldCheck, Box } from "lucide-react";

interface Props {
  mode: 'vpc' | 'subnet' | 'gateway';
}

export function NetworkingVisualizer({ mode }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 w-full py-4">
      <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
        {/* VPC Outer Bound */}
        <div className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-[3rem] bg-primary/5 flex items-start justify-center pt-4">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">VPC Scope (10.0.0.0/16)</span>
        </div>

        {mode === 'vpc' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="z-10 flex flex-col items-center gap-4"
          >
             <div className="p-6 glass border-4 border-primary rounded-full shadow-2xl">
                <Network className="h-12 w-12 text-primary" />
             </div>
             <p className="text-[10px] font-bold text-center leading-relaxed max-w-[180px]">
               Isolated Virtual Network. No traffic enters or leaves without configuration.
             </p>
          </motion.div>
        )}

        {mode === 'subnet' && (
          <div className="grid grid-cols-1 gap-4 w-full px-10 z-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-4 glass border-2 border-green-500/30 rounded-2xl flex items-center justify-between"
            >
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-[10px] font-bold">Public Subnet</span>
               </div>
               <div className="text-[8px] font-mono text-green-500">0.0.0.0/0 → IGW</div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 glass border-2 border-primary/30 rounded-2xl flex items-center justify-between"
            >
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold">Private Subnet</span>
               </div>
               <div className="text-[8px] font-mono text-primary">No External Route</div>
            </motion.div>
          </div>
        )}

        {mode === 'gateway' && (
          <div className="flex flex-col items-center gap-6 w-full z-10 px-8">
             <div className="flex items-center justify-between w-full">
                <div className="p-3 glass border rounded-xl flex flex-col items-center gap-1">
                   <Box className="h-4 w-4 text-primary" />
                   <span className="text-[7px] font-bold">Instance</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground animate-pulse" />
                <div className="p-4 glass border-2 border-primary rounded-2xl flex flex-col items-center gap-1">
                   <ShieldCheck className="h-6 w-6 text-primary" />
                   <span className="text-[8px] font-bold uppercase tracking-widest">NAT Gateway</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground animate-pulse" />
                <Globe className="h-6 w-6 text-muted-foreground" />
             </div>
             <p className="text-[9px] text-center text-muted-foreground leading-relaxed">
               NAT Gateway: One-way outbound traffic. Private instances can download updates but remain hidden from the public internet.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
