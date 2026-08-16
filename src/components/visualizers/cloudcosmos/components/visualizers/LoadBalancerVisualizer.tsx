import { motion, AnimatePresence } from "framer-motion";
import { Activity, Server, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from '@/components/visualizers/cloudcosmos/components/ui/button';

export function LoadBalancerVisualizer() {
  const [requests, setRequests] = useState<{ id: number; target: number }[]>([]);
  const [lastTarget, setLastTarget] = useState(0);

  const sendRequest = () => {
    const nextTarget = (lastTarget + 1) % 3;
    setRequests([...requests, { id: Date.now(), target: nextTarget }]);
    setLastTarget(nextTarget);
  };

  useEffect(() => {
    if (requests.length > 0) {
      const timer = setTimeout(() => {
        setRequests(requests.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [requests]);

  return (
    <div className="flex flex-col items-center gap-10 w-full h-full justify-center">
      <Button onClick={sendRequest} variant="default" className="gap-2 h-11 px-6 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
        <User className="h-4 w-4" /> Dispatch Request
      </Button>

      <div className="relative w-full max-w-[320px] h-72 glass border-2 border-primary/10 rounded-[2rem] flex flex-col items-center justify-between py-10 overflow-hidden shadow-inner">
        {/* Entrance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-10 bg-gradient-to-b from-primary/40 to-transparent" />
        
        {/* Load Balancer */}
        <div className="relative z-10 p-5 glass border-2 border-primary/50 text-primary rounded-[2rem] shadow-2xl flex flex-col items-center group">
          <div className="absolute -inset-2 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all rounded-full" />
          <Activity className="h-8 w-8 relative z-10" />
          <span className="text-[9px] font-black mt-2 uppercase tracking-[0.3em] relative z-10">ALB_V1</span>
        </div>

        {/* Targets */}
        <div className="grid grid-cols-3 gap-6 relative z-10 w-full px-8">
           {[0, 1, 2].map((i) => (
             <div key={i} className="flex flex-col items-center gap-2">
                <div className="p-3 glass border border-primary/20 rounded-xl shadow-sm relative group">
                   <Server className="h-5 w-5 text-primary/40 group-hover:text-primary transition-colors" />
                   {lastTarget === i && (
                     <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                   )}
                </div>
                <span className="text-[7px] font-mono text-muted-foreground uppercase">NODE_0{i + 1}</span>
             </div>
           ))}
        </div>

        {/* Animated Requests */}
        <AnimatePresence>
          {requests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ y: -120, x: 0, opacity: 0 }}
              animate={{ 
                y: [ -120, -50, 45 ],
                x: [ 0, 0, (req.target - 1) * 75 ],
                opacity: [ 0, 1, 1, 0 ],
                scale: [ 0.5, 1, 1, 0.5 ]
              }}
              transition={{ 
                duration: 2,
                times: [0, 0.3, 0.8, 1],
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20 flex items-center justify-center"
            >
               <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="absolute bottom-4 text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1">
          <ChevronDown className="h-2 w-2" /> Round Robin Distribution <ChevronDown className="h-2 w-2" />
        </div>
      </div>
    </div>
  );
}