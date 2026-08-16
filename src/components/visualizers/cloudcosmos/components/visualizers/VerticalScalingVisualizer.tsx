import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import { useState } from "react";
import { Button } from '@/components/visualizers/cloudcosmos/components/ui/button';

export function VerticalScalingVisualizer() {
  const [tier, setTier] = useState(1);
  const tiers = [
    { name: 't3.micro', cpu: 1, ram: 1, size: 0.8 },
    { name: 't3.medium', cpu: 2, ram: 4, size: 1 },
    { name: 't3.large', cpu: 4, ram: 8, size: 1.2 },
    { name: 't3.2xlarge', cpu: 8, ram: 32, size: 1.5 },
  ];

  const upgrade = () => setTier(prev => Math.min(prev + 1, tiers.length - 1));
  const downgrade = () => setTier(prev => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col items-center gap-8 w-full py-4">
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        <Button onClick={downgrade} size="sm" variant="ghost" disabled={tier === 0} className="text-[10px] font-bold">DOWNGRADE</Button>
        <Button onClick={upgrade} size="sm" variant="ghost" disabled={tier === tiers.length - 1} className="text-[10px] font-bold">UPGRADE</Button>
      </div>

      <div className="relative flex flex-col items-center justify-center h-48 w-full">
        <motion.div
          key={tier}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: tiers[tier].size, opacity: 1 }}
          className="p-8 rounded-[2rem] border-4 border-primary bg-primary/10 shadow-2xl relative group"
        >
          <Cpu className="h-12 w-12 text-primary" />
          <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            {tiers[tier].cpu}x
          </div>
        </motion.div>
        
        <div className="mt-8 text-center space-y-1">
          <div className="text-sm font-bold text-foreground">{tiers[tier].name}</div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {tiers[tier].cpu} vCPU • {tiers[tier].ram}GB RAM
          </div>
        </div>
      </div>

      <div className="text-[10px] text-center text-muted-foreground italic px-6 leading-relaxed">
        Vertical scaling increases the capacity of a single machine. <br />
        <span className="text-amber-500 font-bold">Limitation:</span> Usually requires a restart (downtime).
      </div>
    </div>
  );
}
