'use client';
import { motion } from "framer-motion";
import { User, Globe, Cookie, Shield, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export function CsrfFlow() {
  const [step, setStep] = useState(0);

  // 0: Idle (Logged in)
  // 1: User visits Evil Site
  // 2: Evil Site sends Request
  // 3: Browser attaches Cookie
  // 4: Bank accepts request

  const reset = () => setStep(0);
  const next = () => setStep((s) => Math.min(s + 1, 4));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border rounded-xl p-8 flex flex-col items-center gap-8 w-full max-w-3xl mx-auto overflow-hidden relative">
      <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">
        VISUALIZATION: CSRF ATTACK
      </div>

      <div className="flex justify-between w-full gap-8 mt-8 px-4 relative">
        {/* Evil Site */}
        <div className="flex flex-col items-center gap-4 w-1/4">
           <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg border-2 border-purple-500 w-full flex flex-col items-center relative h-40">
              <span className="text-xs font-bold text-purple-600 mb-2">Evil.com</span>
              {step === 0 && <span className="text-[10px] text-muted-foreground text-center">User is not here yet</span>}
              {step >= 1 && (
                 <motion.div 
                   initial={{ scale: 0 }} 
                   animate={{ scale: 1 }}
                   className="flex flex-col items-center gap-2"
                 >
                    <User className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                    <span className="text-[10px] text-center">"Win a Prize!"</span>
                    {step >= 2 && (
                       <motion.div 
                         className="bg-red-500 text-white text-[10px] px-2 py-1 rounded"
                         animate={{ y: [0, 5, 0] }}
                         transition={{ repeat: Infinity, duration: 1 }}
                       >
                         Sending POST...
                       </motion.div>
                    )}
                 </motion.div>
              )}
           </div>
        </div>

        {/* Browser Middleware Area */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
            <div className="w-full h-1 border-t-2 border-dashed border-slate-300 absolute top-1/2 -translate-y-1/2" />
            
            {step >= 2 && (
               <motion.div
                  className="absolute bg-white dark:bg-slate-800 border shadow-sm px-2 py-1 text-xs rounded flex items-center gap-2 z-10"
                  initial={{ left: "10%", opacity: 0 }}
                  animate={{ 
                    left: step >= 4 ? "90%" : step === 3 ? "50%" : "20%",
                    opacity: step === 4 ? 0 : 1 
                  }}
                  transition={{ duration: 1 }}
               >
                  <span className="font-bold">POST /transfer</span>
                  {step >= 3 && (
                     <motion.div 
                       initial={{ scale: 0 }} 
                       animate={{ scale: 1 }}
                       className="bg-yellow-100 text-yellow-700 px-1 rounded flex items-center gap-1 border border-yellow-300"
                     >
                       <Cookie className="h-3 w-3" />
                       session_id
                     </motion.div>
                  )}
               </motion.div>
            )}

            {step === 3 && (
                <motion.div
                   className="absolute top-[60%] text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-muted-foreground"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                >
                   Browser Auto-Attaches Cookie
                </motion.div>
            )}
        </div>

        {/* Bank Site */}
        <div className="flex flex-col items-center gap-4 w-1/4">
           <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg border-2 border-blue-500 w-full flex flex-col items-center relative h-40">
              <span className="text-xs font-bold text-blue-600 mb-2">Bank.com</span>
              <Globe className="h-8 w-8 text-blue-500 mb-2" />
              
              {/* Session State */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 text-yellow-700 p-1 rounded w-full flex items-center gap-2 text-[10px] mb-2">
                 <Cookie className="h-3 w-3" />
                 <span>Valid Session</span>
              </div>

              {step === 4 && (
                 <motion.div 
                   initial={{ scale: 0 }} 
                   animate={{ scale: 1 }}
                   className="bg-red-500 text-white text-[10px] p-2 rounded text-center font-bold absolute bottom-2 w-[90%]"
                 >
                   TRANSFER COMPLETE
                   <div className="font-normal opacity-80 mt-1">Request valid.</div>
                 </motion.div>
              )}
           </div>
        </div>
      </div>

      <div className="flex gap-4 z-10 mt-4">
        <Button onClick={reset} variant="outline" disabled={step === 0}>Reset</Button>
        <Button onClick={next} disabled={step === 4}>
          {step === 0 ? "Visit Malicious Site" : step === 4 ? "Done" : "Next Step"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground text-center max-w-lg h-12">
        {step === 0 && "User is logged into Bank.com (Session Cookie is stored in browser)."}
        {step === 1 && "User unwittingly visits Evil.com (e.g., via a link)."}
        {step === 2 && "Evil.com has a hidden form that submits a POST request to Bank.com/transfer."}
        {step === 3 && "CRITICAL: The browser sees a request to 'bank.com' and AUTOMATICALLY attaches the cookies for that domain."}
        {step === 4 && "Bank.com receives the request + valid cookie. It thinks the User intended to do this. Money stolen!"}
      </div>
    </div>
  );
}
