import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Server, Database } from "lucide-react";
import { useState } from "react";
import { Button } from '@/components/visualizers/cloudcosmos/components/ui/button';

export function QueuesMessagingVisualizer() {
  const [messages, setMessages] = useState<number[]>([]);
  const [processed, setProcessed] = useState<number>(0);

  const addMessage = () => {
    if (messages.length < 5) {
      const id = Date.now();
      setMessages(prev => [...prev, id]);
      
      // Simulate processing
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m !== id));
        setProcessed(p => p + 1);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full py-4">
      <Button onClick={addMessage} size="sm" className="gap-2 h-9 rounded-xl font-bold">
        <Send className="h-4 w-4" /> Send Work Task
      </Button>

      <div className="relative w-full max-w-[320px] h-48 flex items-center justify-between px-4">
        {/* Producer */}
        <div className="flex flex-col items-center gap-2">
           <div className="p-3 glass border rounded-xl">
              <Server className="h-5 w-5 text-primary" />
           </div>
           <span className="text-[8px] font-bold">Producer</span>
        </div>

        {/* Queue Container */}
        <div className="flex-1 mx-4 h-16 border-2 border-dashed border-border rounded-xl bg-muted/20 relative flex items-center justify-start px-2 gap-2 overflow-hidden">
           <div className="absolute inset-0 flex items-center justify-center opacity-10 font-black text-[10px] tracking-widest uppercase pointer-events-none">
              Message Queue
           </div>
           <AnimatePresence>
             {messages.map((id) => (
               <motion.div
                 key={id}
                 layout
                 initial={{ x: -20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: 50, opacity: 0 }}
                 className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shrink-0"
               >
                 <Mail className="h-4 w-4" />
               </motion.div>
             ))}
           </AnimatePresence>
        </div>

        {/* Consumer */}
        <div className="flex flex-col items-center gap-2">
           <div className="p-3 glass border rounded-xl relative">
              <Database className="h-5 w-5 text-indigo-500" />
              {messages.length > 0 && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1"
                >
                   <RefreshCw className="h-3 w-3 text-primary" />
                </motion.div>
              )}
           </div>
           <span className="text-[8px] font-bold">Consumer</span>
        </div>
      </div>

      <div className="flex items-center gap-8 text-[10px] font-mono">
         <div className="flex flex-col items-center">
            <span className="text-muted-foreground">In Queue</span>
            <span className="text-primary font-bold">{messages.length}</span>
         </div>
         <div className="flex flex-col items-center">
            <span className="text-muted-foreground">Processed</span>
            <span className="text-green-500 font-bold">{processed}</span>
         </div>
      </div>
    </div>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
      <path d="M16 16h5v5"/>
    </svg>
  );
}
