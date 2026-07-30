'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Server, RefreshCw, HardDrive, Globe, AlertCircle, CheckCircle2, Search, Zap } from 'lucide-react';

interface FlowVisualizerProps {
  type: 'flow' | 'cycle' | 'methods' | 'headers' | 'status' | 'caching' | 'validation' | 'cdn' | 'performance';
  topicId?: string;
}

const FlowVisualizer: React.FC<FlowVisualizerProps> = ({ type }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
     const interval = setInterval(() => {
       setStep(s => (s + 1) % 4);
     }, 3000);
     return () => clearInterval(interval);
  }, []);

    const renderCycle = () => (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="flex items-center justify-between w-full max-w-md relative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 shadow-lg rounded-2xl flex items-center justify-center border-2 border-primary/20 z-10">
              <Laptop size={40} className="text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">Browser</span>
          </motion.div>
  
          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 relative mx-4 rounded-full overflow-hidden">
             <AnimatePresence mode="wait">
               {step % 2 === 0 ? (
                  <motion.div 
                    key="req"
                    initial={{ left: '-10%' }}
                    animate={{ left: '110%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
               ) : (
                  <motion.div 
                     key="res"
                     initial={{ right: '-10%' }}
                     animate={{ right: '110%' }}
                     transition={{ duration: 1.5, ease: "easeInOut" }}
                     className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  />
               )}
             </AnimatePresence>
          </div>
  
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 shadow-lg rounded-2xl flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 z-10">
              <Server size={40} className="text-slate-700 dark:text-slate-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">Server</span>
          </motion.div>
        </div>
        <div className="mt-8 text-center bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
           {step % 2 === 0 ? "Requesting index.html..." : "Received Response: 200 OK"}
        </div>
      </div>
    );
  
    const renderStatus = () => (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-6">
         <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {[
              { code: '200', text: 'OK', color: 'bg-green-500', icon: <CheckCircle2 size={20}/> },
              { code: '304', text: 'Not Modified', color: 'bg-blue-500', icon: <RefreshCw size={20}/> },
              { code: '404', text: 'Not Found', color: 'bg-amber-500', icon: <Search size={20}/> },
              { code: '500', text: 'Server Error', color: 'bg-red-500', icon: <AlertCircle size={20}/> }
            ].map((s, i) => (
               <motion.div 
                 key={s.code}
                 animate={{ scale: step === i ? 1.05 : 1, opacity: step === i ? 1 : 0.6 }}
                 className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-colors ${step === i ? 'border-slate-900 dark:border-primary bg-white dark:bg-slate-900 shadow-xl' : 'border-transparent bg-slate-100 dark:bg-slate-800'}`}
               >
                  <div className={`w-10 h-10 ${s.color} text-white rounded-full flex items-center justify-center shadow-lg`}>
                    {s.icon}
                  </div>
                  <div className="font-bold text-xl dark:text-white">{s.code}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">{s.text}</div>
               </motion.div>
            ))}
         </div>
         <div className="h-12 flex items-center justify-center text-center px-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              {step === 0 ? "Success! Everything went as expected." :
               step === 1 ? "Redirecting: You already have this file, use your cache!" :
               step === 2 ? "Error: The resource you requested doesn't exist." :
               "Ouch! The server crashed while handling your request."}
            </p>
         </div>
      </div>
    );
  
    const renderHeaders = () => (
      <div className="w-full h-full flex flex-col p-6">
         <div className="flex justify-between mb-8">
            <div className="p-3 bg-white dark:bg-slate-900 border-2 dark:border-slate-800 rounded-xl shadow-sm"><Laptop className="text-primary"/></div>
            <div className="p-3 bg-white dark:bg-slate-900 border-2 dark:border-slate-800 rounded-xl shadow-sm"><Server className="text-slate-600 dark:text-slate-300"/></div>
         </div>
         
         <div className="flex-1 relative border-l-2 border-dashed border-slate-200 dark:border-slate-800 ml-6 pl-8 space-y-4">
            {[
              { name: 'User-Agent', value: 'Mozilla/5.0...', type: 'Browser Info' },
              { name: 'Accept', value: 'text/html', type: 'Preference' },
              { name: 'Host', value: 'example.com', type: 'Destination' },
              { name: 'Cookie', value: 'session_id=123', type: 'Identity' }
            ].map((h, i) => (
              <motion.div 
                key={h.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white dark:bg-slate-900 p-3 rounded-xl border dark:border-slate-800 shadow-sm relative transition-colors"
              >
                 <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white dark:border-slate-950 shadow-sm" />
                 <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-primary">{h.name}:</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">{h.type}</span>
                 </div>
                 <div className="font-mono text-xs text-slate-600 dark:text-slate-300 truncate">{h.value}</div>
              </motion.div>
            ))}
         </div>
      </div>
    );
  
    const renderCDN = () => (
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
         <div className="relative w-full max-w-sm h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center transition-colors">
            <div className="absolute top-4 right-4 flex flex-col items-center">
               <div className="w-12 h-12 bg-white dark:bg-slate-900 shadow border dark:border-slate-800 rounded-lg flex items-center justify-center">
                  <Server size={24} className="text-red-500" />
               </div>
               <span className="text-[8px] font-bold uppercase mt-1 dark:text-slate-400">Origin Server</span>
            </div>
  
            <div className="relative grid grid-cols-2 gap-12">
               {[1, 2, 3, 4].map((id) => (
                 <div key={id} className="relative flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-all ${step % 2 === 0 ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-300'}`}>
                       <Globe size={28} />
                    </div>
                    <span className="text-[8px] font-bold uppercase mt-1 text-slate-400">Edge Node {id}</span>
                    {step % 2 === 0 && (
                      <motion.div 
                        layoutId="pulse"
                        className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping"
                      />
                    )}
                 </div>
               ))}
            </div>
            
            <div className="absolute -bottom-10 flex flex-col items-center">
               <Laptop size={32} className="text-slate-700 dark:text-slate-300" />
               <span className="text-[8px] font-bold uppercase mt-1 dark:text-slate-400">User</span>
               <motion.div 
                 animate={{ y: step % 2 === 0 ? -40 : -100 }}
                 className="mt-2 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
               />
            </div>
         </div>
         <div className="mt-16 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">
           {step % 2 === 0 ? "CDN HIT: Edge node serves data" : "CDN MISS: Fetching from Origin"}
         </div>
      </div>
    );
  
    const renderValidation = () => (
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
         <div className="flex items-center gap-12 w-full max-w-md">
            <div className="flex flex-col items-center gap-2">
               <div className="w-16 h-16 bg-white dark:bg-slate-900 border-2 dark:border-slate-800 rounded-2xl flex items-center justify-center">
                  <Laptop size={32} className="text-primary"/>
               </div>
               <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center relative">
                  <HardDrive size={20} className="text-slate-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-950" />
               </div>
            </div>
  
            <div className="flex-1 space-y-4">
               <div className="h-0.5 bg-slate-200 dark:bg-slate-800 w-full relative">
                  <motion.div 
                    animate={{ left: step % 2 === 0 ? '0%' : '100%' }}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full"
                  />
               </div>
               <div className="bg-slate-900 dark:bg-slate-950 text-white p-2 rounded-lg font-mono text-[8px] leading-tight border dark:border-slate-800 transition-colors">
                  {step % 2 === 0 ? (
                    <>
                      <div className="text-amber-400">GET /image.png</div>
                      <div className="text-slate-400">If-None-Match: "v1"</div>
                    </>
                  ) : (
                    <>
                      <div className="text-green-400">HTTP/1.1 304</div>
                      <div className="text-slate-400">ETag: "v1"</div>
                    </>
                  )}
               </div>
            </div>
  
            <div className="flex flex-col items-center gap-2">
               <div className="w-16 h-16 bg-white dark:bg-slate-900 border-2 dark:border-slate-800 rounded-2xl flex items-center justify-center">
                  <Server size={32} className="text-slate-700 dark:text-slate-300"/>
               </div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter transition-colors">Matches "v1"?</div>
            </div>
         </div>
         <div className="mt-8 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 transition-colors">
            Conditional Request: No data transfer needed!
         </div>
      </div>
    );
  
      const renderMethods = () => {
        const methodsInfo = [
          { name: 'GET', desc: 'Read a resource. No side effects.', body: false },
          { name: 'POST', desc: 'Create a new resource.', body: true },
          { name: 'PUT', desc: 'Replace a resource entirely.', body: true },
          { name: 'DELETE', desc: 'Remove a resource forever.', body: false }
        ];
        const currentMethod = methodsInfo[step % 4];
    
        return (
          <div className="w-full h-full flex flex-col p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
                {methodsInfo.map((m, i) => (
                  <motion.div 
                    key={m.name}
                    animate={{ 
                      scale: step % 4 === i ? 1.05 : 1,
                      opacity: step % 4 === i ? 1 : 0.5,
                      borderColor: step % 4 === i ? '#3b82f6' : 'transparent'
                    }}
                    className={`p-4 rounded-2xl border-2 flex flex-col gap-2 transition-all cursor-pointer ${
                      m.name === 'GET' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300' : 
                      m.name === 'POST' ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300' :
                      m.name === 'PUT' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300' :
                      'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{m.name}</span>
                      {step % 4 === i && <Zap size={12} className="text-amber-500 animate-pulse" />}
                    </div>
                    <p className="text-[10px] leading-tight opacity-80">{m.desc}</p>
                  </motion.div>
                ))}
            </div>
            
            <div className="mt-6 flex-1 bg-slate-900 dark:bg-slate-950 rounded-2xl p-4 font-mono text-[10px] text-slate-300 overflow-hidden relative border dark:border-slate-800">
                <div className="text-primary mb-2 flex justify-between">
                  <span>// Request Animation</span>
                  <span className="text-[8px] bg-primary/20 text-primary px-1.5 rounded uppercase">{currentMethod.name}</span>
                </div>
                <div className="text-green-400">{currentMethod.name} /api/users/123 HTTP/1.1</div>
                <div className="text-slate-400">Host: example.com</div>
                {currentMethod.body && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="mt-2 text-amber-400"
                  >
                    {'{ "status": "active" }'}
                  </motion.div>
                )}
                
                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute bottom-4 right-4 text-[8px] font-bold text-slate-500"
                >
                  SIMULATING NETWORK...
                </motion.div>
            </div>
          </div>
        );
      };
        const renderCaching = () => (
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
         <div className="flex items-center gap-12">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white dark:bg-slate-900 shadow rounded-xl flex items-center justify-center border dark:border-slate-800">
                <Laptop size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
            </div>
  
            <div className="relative">
               <motion.div 
                 animate={{ scale: step % 2 === 0 ? 1.1 : 1, borderColor: step % 2 === 0 ? '#3b82f6' : '#e2e8f0' }}
                 className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-4 shadow-xl dark:border-slate-800 transition-colors"
               >
                  <HardDrive size={32} className={step % 2 === 0 ? "text-primary" : "text-slate-300 dark:text-slate-700"} />
               </motion.div>
               <div className={`absolute -top-2 -right-2 ${step % 2 === 0 ? 'bg-primary' : 'bg-slate-400 dark:bg-slate-600'} text-white text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors`}>CACHE</div>
            </div>
  
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white dark:bg-slate-900 shadow rounded-xl flex items-center justify-center border dark:border-slate-800">
                <Server size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
            </div>
         </div>
  
         <div className="mt-12 w-full max-w-sm">
            <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${step % 2 === 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-900 border-transparent grayscale opacity-50'}`}>
               <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold italic">HIT</div>
               <div>
                  <div className="text-sm font-bold text-green-900 dark:text-green-300">Cache Hit</div>
                  <div className="text-[10px] text-green-700 dark:text-green-400">Data found locally. Ultra fast.</div>
               </div>
            </div>
         </div>
      </div>
    );
  
    const renderPerformance = () => (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-8">
         <div className="w-full space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase text-red-500">Unoptimized</span>
                  <span className="text-[10px] font-bold text-slate-400">Time: 1.2s</span>
               </div>
               <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: step % 2 === 0 ? '100%' : '10%' }}
                    className="h-full bg-red-400"
                  />
               </div>
            </div>
  
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-primary/20 dark:border-primary/40 shadow-lg relative overflow-hidden transition-colors">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase text-primary">Optimized (with Caching)</span>
                  <span className="text-[10px] font-bold text-primary">Time: 0.1s</span>
               </div>
               <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: step % 2 === 0 ? '8%' : '2%' }}
                    className="h-full bg-primary"
                  />
               </div>
               <motion.div 
                 animate={{ opacity: [0, 1, 0] }}
                 transition={{ repeat: Infinity, duration: 1.5 }}
                 className="absolute top-1 right-20 text-[8px] font-bold text-primary"
               >
                  90% FASTER
               </motion.div>
            </div>
         </div>
         <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium px-8 transition-colors">
           Optimization strategies like caching and compression significantly reduce the Round Trip Time (RTT).
         </p>
      </div>
    );
    switch (type) {
    case 'cycle': return renderCycle();
    case 'status': return renderStatus();
    case 'headers': return renderHeaders();
    case 'cdn': return renderCDN();
    case 'validation': return renderValidation();
    case 'methods': return renderMethods();
    case 'caching': return renderCaching();
    case 'performance': return renderPerformance();
    case 'flow': return renderCycle();
    default: return renderCycle();
  }
};

export default FlowVisualizer;