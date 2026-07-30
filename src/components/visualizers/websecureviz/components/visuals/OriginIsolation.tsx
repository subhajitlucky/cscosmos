'use client';
import { motion } from "framer-motion";
import { Lock, Globe, FileCode, ShieldAlert, ArrowRight, Database } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export function OriginIsolation() {
  const [step, setStep] = useState(0);

  // 0: Initial state
  // 1: Script Request (Evil -> Bank)
  // 2: Browser Check (SOP)
  // 3: Blocked

  const reset = () => setStep(0);
  const next = () => setStep((s) => Math.min(s + 1, 3));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border rounded-xl p-8 flex flex-col items-center gap-8 w-full max-w-3xl mx-auto overflow-hidden relative">
      <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">
        VISUALIZATION: SAME-ORIGIN POLICY
      </div>
      
      <div className="flex justify-between w-full gap-8 mt-8">
        {/* Origin A (Target) */}
        <div className="flex-1 border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 relative min-h-[200px] flex flex-col items-center">
          <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Origin A (bank.com)
          </div>
          <Globe className="h-8 w-8 text-blue-500 mb-4" />
          <div className="bg-white dark:bg-slate-900 p-3 rounded border shadow-sm text-xs w-full flex items-center gap-2">
             <Database className="h-4 w-4 text-blue-500" />
             <div className="flex flex-col">
                <span className="font-bold">User Data</span>
                <span className="text-[10px] text-muted-foreground">Cookies, localStorage</span>
             </div>
          </div>
        </div>

        {/* Browser / Wall */}
        <div className="w-4 bg-slate-200 dark:bg-slate-800 rounded-full relative flex items-center justify-center z-10">
            <motion.div 
               className="absolute bg-slate-800 text-white p-2 rounded-full z-20 shadow-lg"
               animate={{ 
                 scale: step >= 2 ? 1.2 : 1,
                 backgroundColor: step >= 3 ? "#ef4444" : "#1e293b"
               }}
            >
               {step >= 3 ? <ShieldAlert className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
            </motion.div>
        </div>

        {/* Origin B (Attacker) */}
        <div className="flex-1 border-2 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 relative min-h-[200px] flex flex-col items-center">
          <div className="absolute -top-3 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded">
            Origin B (evil.com)
          </div>
          <Globe className="h-8 w-8 text-purple-500 mb-4" />
          
          <div className="mt-auto w-full">
             <motion.div 
               className="bg-red-100 dark:bg-red-900/50 p-2 rounded border border-red-200 text-red-600 flex items-center gap-2 text-xs font-bold shadow-sm"
               animate={{ scale: step === 1 ? [1, 1.05, 1] : 1 }}
             >
               <FileCode className="h-4 w-4" />
               Malicious Script
             </motion.div>
          </div>
        </div>
      </div>

      {/* Animation Layer */}
      <div className="absolute inset-0 pointer-events-none">
          {/* Request Arrow B -> A */}
          {step >= 1 && (
             <motion.div
               className="absolute top-[50%] h-1 bg-red-500 z-0"
               initial={{ right: "25%", width: 0 }}
               animate={{ 
                 width: step >= 2 ? "25%" : step === 1 ? "12%" : 0, 
                 right: "25%"
               }}
               transition={{ duration: 0.5 }}
             />
          )}

          {step === 3 && (
             <motion.div
                className="absolute top-[40%] left-[50%] -translate-x-1/2 bg-red-100 text-red-600 px-3 py-1 rounded border border-red-500 text-xs font-bold z-30 shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
             >
                CROSS-ORIGIN READ BLOCKED
             </motion.div>
          )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 z-10">
        <Button onClick={reset} variant="outline" disabled={step === 0}>Reset</Button>
        <Button onClick={next} disabled={step === 3}>
          {step === 0 ? "Execute Script" : step === 3 ? "Finished" : "Next Step"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground text-center max-w-md h-12">
        {step === 0 && "A script on 'evil.com' tries to read data from 'bank.com'."}
        {step === 1 && "The script sends a request (fetch/XHR) to bank.com..."}
        {step === 2 && "The browser receives the response but checks the Same-Origin Policy."}
        {step === 3 && "Origins match? No. The browser refuses to expose the response data to the script!"}
      </div>
    </div>
  );
}