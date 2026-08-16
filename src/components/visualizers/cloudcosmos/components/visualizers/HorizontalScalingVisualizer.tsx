import { motion } from "framer-motion";
import { Server } from "lucide-react";
import { useState } from "react";
import { Button } from '@/components/visualizers/cloudcosmos/components/ui/button';

export function HorizontalScalingVisualizer() {
  const [instances, setInstances] = useState([1, 2]);

  const addInstance = () => {
    if (instances.length < 6) {
      setInstances([...instances, Date.now()]);
    }
  };

  const removeInstance = () => {
    if (instances.length > 1) {
      setInstances(instances.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <div className="flex gap-3 p-1 glass border rounded-2xl">
        <Button onClick={addInstance} size="sm" variant="ghost" className="rounded-xl h-8 text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10">Add Node</Button>
        <Button onClick={removeInstance} size="sm" variant="ghost" className="rounded-xl h-8 text-[10px] font-bold uppercase tracking-wider hover:bg-destructive/10" disabled={instances.length <= 1}>Remove Node</Button>
      </div>

      <div className="relative w-full max-w-[300px] h-[150px] flex items-center justify-center">
         {/* Connector lines from a central point */}
         <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <circle cx="50%" cy="0" r="4" fill="hsl(var(--primary))" />
            {instances.map((_, i) => {
               const angle = (i / (instances.length - 1 || 1)) * 140 - 70;
               const rad = (angle * Math.PI) / 180;
               const tx = 150 + Math.sin(rad) * 100;
               const ty = 120;
               return (
                 <motion.path 
                   key={i}
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   d={`M 150 0 L ${tx} ${ty}`}
                   stroke="url(#lineGrad)"
                   strokeWidth="1"
                   fill="none"
                 />
               );
            })}
         </svg>

         <div className="flex flex-wrap justify-center gap-4 items-end mt-12">
          {instances.map((id) => (
            <motion.div
              key={id}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              className="group relative"
            >
              <div className="p-3 glass border-2 border-primary/20 rounded-xl shadow-lg group-hover:border-primary/50 transition-colors">
                <Server className="h-6 w-6 text-primary" />
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 shadow-sm" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 max-w-[280px]">
        <p className="text-[10px] text-primary/70 font-medium leading-relaxed italic text-center">
          "Horizontal scaling adds more parallel nodes to handle traffic, unlike vertical scaling which upgrades a single node."
        </p>
      </div>
    </div>
  );
}