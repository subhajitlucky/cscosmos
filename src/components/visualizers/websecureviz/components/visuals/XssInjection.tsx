'use client';
import { motion } from "framer-motion";
import { User, Server, Laptop, MessageSquare, AlertTriangle, Code, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export function XssInjection() {
  const [step, setStep] = useState(0);

  // 0: Idle
  // 1: Attacker sends link
  // 2: Victim clicks link (Request)
  // 3: Server reflects (Response)
  // 4: Browser executes

  const reset = () => setStep(0);
  const next = () => setStep((s) => Math.min(s + 1, 4));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border rounded-xl p-8 flex flex-col items-center gap-8 w-full max-w-3xl mx-auto overflow-hidden relative">
      <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">
        VISUALIZATION: REFLECTED XSS
      </div>

      <div className="flex w-full justify-between items-end h-[200px] relative px-4">
          
          {/* Attacker */}
          <div className="flex flex-col items-center z-10">
             <div className="bg-red-950 p-3 rounded-full mb-2">
                 <User className="h-8 w-8 text-red-500" />
             </div>
             <span className="text-xs font-bold text-red-500">Attacker</span>
          </div>

          {/* Victim */}
          <div className="flex flex-col items-center z-10">
             <div className="bg-blue-950 p-3 rounded-full mb-2 relative">
                 <Laptop className="h-8 w-8 text-blue-500" />
                 {step === 4 && (
                     <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                     >
                        <AlertTriangle className="h-4 w-4" />
                     </motion.div>
                 )}
             </div>
             <span className="text-xs font-bold text-blue-500">Victim</span>
          </div>

          {/* Server */}
          <div className="flex flex-col items-center z-10">
             <div className="bg-slate-800 p-3 rounded-full mb-2">
                 <Server className="h-8 w-8 text-slate-400" />
             </div>
             <span className="text-xs font-bold text-slate-500">Vulnerable Server</span>
          </div>

          {/* Animations */}
          <div className="absolute inset-0 pointer-events-none">
              
              {/* Step 1: Link */}
              {step >= 1 && (
                 <motion.div 
                    initial={{ left: "10%", opacity: 0 }}
                    animate={{ left: step >= 2 ? "45%" : "25%", opacity: step >= 2 ? 0 : 1 }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-20 flex items-center gap-2 bg-white dark:bg-slate-800 border p-1 px-2 rounded-full text-[10px]"
                 >
                    <MessageSquare className="h-3 w-3 text-blue-500" />
                    <span>Click me!</span>
                 </motion.div>
              )}

              {/* Step 2: Request */}
              {step >= 2 && (
                 <motion.div 
                    initial={{ left: "50%", opacity: 0 }}
                    animate={{ left: step >= 3 ? "85%" : "50%", opacity: step >= 3 ? 0 : 1 }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-32 flex flex-col items-center"
                 >
                     <div className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded border border-yellow-300">
                        ?q=&lt;script&gt;...
                     </div>
                     <ArrowRight className="h-4 w-4 text-slate-400 rotate-[-15deg]" />
                 </motion.div>
              )}

              {/* Step 3: Response */}
              {step >= 3 && (
                 <motion.div 
                    initial={{ left: "90%", opacity: 0 }}
                    animate={{ left: step >= 4 ? "50%" : "90%", opacity: step >= 4 ? 0 : 1 }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-32 flex flex-col items-center"
                 >
                     <ArrowRight className="h-4 w-4 text-slate-400 rotate-[195deg]" />
                     <div className="bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded border border-purple-300 flex items-center gap-1">
                        <Code className="h-3 w-3" />
                        &lt;script&gt;alert(1)&lt;/script&gt;
                     </div>
                 </motion.div>
              )}

          </div>
      </div>

      {/* Code Viewer */}
      <div className="w-full bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-hidden h-32 flex items-center justify-center relative">
          <div className="absolute top-2 left-2 text-[10px] text-slate-500">BROWSER RENDERER</div>
          {step < 3 && <div className="text-slate-500 italic">Waiting for response...</div>}
          {step === 3 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400">
                 &lt;div&gt;Search results for: &lt;script&gt;...&lt;/script&gt;&lt;/div&gt;
             </motion.div>
          )}
          {step === 4 && (
             <motion.div 
                initial={{ scale: 0.5, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="bg-white text-black p-4 rounded shadow-xl border-2 border-red-500 min-w-[200px] text-center"
             >
                <div className="font-bold border-b pb-2 mb-2 flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Alert
                </div>
                Hacked! Cookie Stolen!
                <div className="bg-blue-500 text-white text-xs mt-4 py-1 rounded">OK</div>
             </motion.div>
          )}
      </div>

      <div className="flex gap-4 z-10">
        <Button onClick={reset} variant="outline" disabled={step === 0}>Reset</Button>
        <Button onClick={next} disabled={step === 4}>
          {step === 0 ? "Send Phishing Link" : step === 4 ? "Done" : "Next Step"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground text-center max-w-lg h-12">
        {step === 0 && "Attacker crafts a link containing a malicious script in the URL parameters."}
        {step === 1 && "Attacker sends the link to the victim (e.g., via email or chat)."}
        {step === 2 && "Victim clicks the link. The request goes to the legitimate server."}
        {step === 3 && "The server receives the 'query' param and reflects it back into the HTML page WITHOUT sanitization."}
        {step === 4 && "The browser receives the HTML, sees the <script> tag, and blindly executes it!"}
      </div>
    </div>
  );
}
