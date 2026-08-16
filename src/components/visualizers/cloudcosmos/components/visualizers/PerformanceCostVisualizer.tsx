import { motion } from "framer-motion";
import { CircleDollarSign, Zap, Scale, Timer, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Slider } from '@/components/visualizers/cloudcosmos/components/ui/slider';
import { cn } from "@/lib/utils";

interface Props {
  mode: 'cost-perf' | 'latency-consistency';
}

export function PerformanceCostVisualizer({ mode }: Props) {
  const [value, setValue] = useState(50);

  return (
    <div className="flex flex-col items-center gap-8 w-full py-4 px-6">
      <div className="w-full space-y-4">
        <div className="flex justify-between items-end">
           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
             {mode === 'cost-perf' ? 'Budget vs Power' : 'Speed vs Accuracy'}
           </span>
           <span className="text-xs font-bold text-primary">{value}%</span>
        </div>
        <Slider 
          value={[value]} 
          min={0} 
          max={100} 
          step={1} 
          onValueChange={(val) => setValue(val[0])}
        />
      </div>

      <div className="relative w-full aspect-square flex items-center justify-center">
        {mode === 'cost-perf' && (
          <div className="grid grid-cols-2 gap-8 w-full h-full p-4">
             <motion.div 
               animate={{ 
                 scale: 1 + (100 - value) / 100,
                 opacity: 0.5 + (100 - value) / 200,
               }}
               className="flex flex-col items-center justify-center gap-2 p-4 glass border-2 border-amber-500/30 rounded-3xl"
             >
                <CircleDollarSign className="h-10 w-10 text-amber-500" />
                <span className="text-[9px] font-bold uppercase">Cost Savings</span>
             </motion.div>

             <motion.div 
               animate={{ 
                 scale: 1 + value / 100,
                 opacity: 0.5 + value / 200,
               }}
               className={cn(
                 "flex flex-col items-center justify-center gap-2 p-4 glass border-2 rounded-3xl transition-colors duration-300",
                 value > 80 ? "border-primary" : "border-primary/30"
               )}
             >
                <Zap className="h-10 w-10 text-primary" />
                <span className="text-[9px] font-bold uppercase">Performance</span>
             </motion.div>
             
             <div className="col-span-2 flex justify-center">
                <Scale className="h-12 w-12 text-muted-foreground opacity-20" />
             </div>
          </div>
        )}

        {mode === 'latency-consistency' && (
           <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-dashed border-border rounded-full opacity-20" />
              
              <div className="grid grid-cols-2 gap-12 relative z-10">
                 <motion.div 
                    animate={{ 
                      y: (50 - value) / 2,
                      scale: 1 + (100 - value) / 200
                    }}
                    className="flex flex-col items-center gap-2"
                 >
                    <div className="p-5 glass border-2 border-green-500 rounded-2xl shadow-xl shadow-green-500/10">
                       <Timer className="h-10 w-10 text-green-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase">Low Latency</span>
                 </motion.div>

                 <motion.div 
                    animate={{ 
                      y: (value - 50) / 2,
                      scale: 1 + value / 200
                    }}
                    className="flex flex-col items-center gap-2"
                 >
                    <div className="p-5 glass border-2 border-indigo-500 rounded-2xl shadow-xl shadow-indigo-500/10">
                       <ShieldCheck className="h-10 w-10 text-indigo-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase">Consistency</span>
                 </motion.div>
              </div>

              <div className="absolute -bottom-8 w-full text-center">
                 <p className="text-[9px] text-muted-foreground italic leading-relaxed">
                   {value < 30 ? "Eventual Consistency: Updates propagate slowly but users get fast responses." : 
                    value > 70 ? "Strong Consistency: Data is locked until all copies update, increasing latency." : 
                    "Balanced Approach"}
                 </p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
