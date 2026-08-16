import { motion } from "framer-motion";
import { Cloud, Globe, Cpu, Database, Shield } from "lucide-react";

export function CloudComputingVisualizer() {
  return (
    <div className="flex flex-col items-center gap-6 w-full py-4">
      <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
        {/* Central Orchestration Layer */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
        />

        <div className="z-10 p-6 glass border-2 border-primary rounded-3xl shadow-2xl flex flex-col items-center gap-2">
           <Cloud className="h-10 w-10 text-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest text-primary">Orchestration</span>
        </div>

        {/* Distributed Resources */}
        {[
          { icon: Cpu, label: 'Compute', angle: 0 },
          { icon: Database, label: 'Storage', angle: 120 },
          { icon: Shield, label: 'Security', angle: 240 },
        ].map((resource, i) => {
          const rad = (resource.angle * Math.PI) / 180;
          const x = Math.cos(rad) * 110;
          const y = Math.sin(rad) * 110;
          
          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.2 }}
              style={{ x, y }}
              className="absolute p-3 glass border rounded-2xl flex flex-col items-center gap-1"
            >
               <resource.icon className="h-4 w-4 text-primary/60" />
               <span className="text-[7px] font-bold uppercase tracking-tighter">{resource.label}</span>
            </motion.div>
          );
        })}

        {/* Global Access */}
        <div className="absolute -bottom-4 flex items-center gap-2 px-3 py-1 glass border rounded-full text-[9px] font-bold text-muted-foreground">
           <Globe className="h-3 w-3" /> Worldwide On-Demand Access
        </div>
      </div>

      <p className="text-[10px] text-center text-muted-foreground italic leading-relaxed px-4">
        "Cloud computing is the abstraction of physical hardware into <br /> APIs and on-demand resources."
      </p>
    </div>
  );
}
