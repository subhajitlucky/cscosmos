'use client';
import { motion } from "framer-motion";
import { Server, Globe, ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export function CorsPreflight() {
  const [step, setStep] = useState(0);
  const [allowCors, setAllowCors] = useState(true);

  // 0: Idle
  // 1: Preflight (OPTIONS) sent
  // 2: Server responds (Headers)
  // 3: Browser Check
  // 4: Result (Success or Block)

  const reset = () => setStep(0);
  const next = () => setStep((s) => Math.min(s + 1, 4));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border rounded-xl p-8 flex flex-col items-center gap-8 w-full max-w-3xl mx-auto overflow-hidden relative">
      <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">
        VISUALIZATION: CORS PREFLIGHT
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
         <span className="text-xs font-bold text-muted-foreground">Server Config:</span>
         <Button 
           size="sm" 
           variant={allowCors ? "default" : "secondary"}
           onClick={() => { setAllowCors(!allowCors); reset(); }}
           className={allowCors ? "bg-green-600 hover:bg-green-700" : ""}
         >
           {allowCors ? "Allow Origin" : "Block Origin"}
         </Button>
      </div>
      
      <div className="flex justify-between w-full gap-12 mt-12 px-8">
        {/* Browser */}
        <div className="flex flex-col items-center gap-2 z-10">
           <Globe className="h-12 w-12 text-blue-500" />
           <span className="text-sm font-bold">Browser (Origin A)</span>
        </div>

        {/* Space for arrows */}
        <div className="flex-1 relative h-32 flex flex-col justify-center">
            {/* Preflight Request Arrow */}
            {step >= 1 && (
                <motion.div 
                   initial={{ width: 0, opacity: 0 }}
                   animate={{ width: "100%", opacity: 1 }}
                   transition={{ duration: 0.5 }}
                   className="h-0.5 bg-yellow-500 absolute top-10 left-0 flex items-center"
                >
                   <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-yellow-600 font-mono bg-yellow-50 px-1 rounded">
                     OPTIONS /api/data
                   </span>
                   <ArrowRight className="absolute right-0 -top-2.5 h-5 w-5 text-yellow-500" />
                </motion.div>
            )}

            {/* Response Arrow */}
            {step >= 2 && (
                <motion.div 
                   initial={{ width: 0, opacity: 0 }}
                   animate={{ width: "100%", opacity: 1 }}
                   transition={{ duration: 0.5, delay: 0.2 }}
                   className="h-0.5 bg-purple-500 absolute bottom-10 right-0 flex items-center justify-end"
                >
                   <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-purple-600 font-mono bg-purple-50 px-1 rounded whitespace-nowrap">
                     {allowCors ? "Access-Control-Allow-Origin: *" : "403 Forbidden / No Headers"}
                   </div>
                   <ArrowLeft className="absolute left-0 -top-2.5 h-5 w-5 text-purple-500" />
                </motion.div>
            )}
        </div>

        {/* Server */}
        <div className="flex flex-col items-center gap-2 z-10">
           <Server className="h-12 w-12 text-slate-500" />
           <span className="text-sm font-bold">Server (Origin B)</span>
        </div>
      </div>

      {/* Result Indicator */}
      <div className="h-24 flex items-center justify-center w-full">
         {step === 3 && (
            <motion.div 
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }}
               className="bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-2"
            >
               Checking headers...
            </motion.div>
         )}
         {step === 4 && (
            <motion.div 
               initial={{ scale: 0 }} 
               animate={{ scale: 1.1 }}
               className={`px-6 py-3 rounded-xl text-white font-bold flex items-center gap-3 ${allowCors ? 'bg-green-500' : 'bg-red-500'}`}
            >
               {allowCors ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
               {allowCors ? "REQUEST ALLOWED" : "CORS ERROR"}
            </motion.div>
         )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 z-10">
        <Button onClick={reset} variant="outline" disabled={step === 0}>Reset</Button>
        <Button onClick={next} disabled={step === 4}>
          {step === 0 ? "Send Complex Request" : step === 4 ? "Done" : "Next Step"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground text-center max-w-lg h-12">
        {step === 0 && "Browser is about to send a complex request (e.g., DELETE or Custom Headers)."}
        {step === 1 && "Browser pauses the actual request and sends an OPTIONS 'preflight' to check permissions."}
        {step === 2 && (allowCors ? "Server responds: 'Yes, I allow this origin!'" : "Server responds: 'I don't know you.' or missing headers.")}
        {step === 3 && "Browser inspects the Access-Control-Allow-Origin header."}
        {step === 4 && (allowCors ? "Headers match! Browser sends the actual request." : "Headers missing or mismatch! Browser throws a CORS error.")}
      </div>
    </div>
  );
}
