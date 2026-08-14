'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, RefreshCw, Database, Globe, Network, Cpu, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Playground() {
  const [protocol, setProtocol] = useState<'REST' | 'GraphQL'>('REST');
  const [status, setStatus] = useState<'idle' | 'executing' | 'success' | 'error'>('idle');
  const [latency, setLatency] = useState(0);
  const [logs, setLogs] = useState<{ id: number; msg: string; time: string }[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [{ id: Date.now(), msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 8));
  };

  const runSimulation = () => {
    if (status === 'executing') return;
    setStatus('executing');
    setLatency(0);
    addLog(`INITIALIZING_${protocol}_PROTOCOL`);
    
    const start = Date.now();
    setTimeout(() => {
      setLatency(Date.now() - start);
      setStatus('success');
      addLog(`TRANSACTION_COMPLETE: 200_OK`);
    }, 1500);
  };

  const reset = () => {
    setStatus('idle');
    setLatency(0);
    setLogs([]);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-cyan-400/10 pb-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-[#d6f5f5]">Playground</h1>
          <p className="text-cyan-400/40 text-[10px] font-bold uppercase tracking-widest">Multi-Protocol Traffic Simulator v1.0</p>
        </div>
        <div className="flex bg-cyan-400/5 border-2 border-cyan-400/20 p-1">
          <button 
            onClick={() => setProtocol('REST')}
            className={cn(
              "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
              protocol === 'REST' ? "bg-cyan-400 text-black font-black" : "text-cyan-400/40 hover:text-cyan-400"
            )}
          >
            REST
          </button>
          <button 
            onClick={() => setProtocol('GraphQL')}
            className={cn(
              "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
              protocol === 'GraphQL' ? "bg-cyan-400 text-black font-black" : "text-cyan-400/40 hover:text-cyan-400"
            )}
          >
            GRAPHQL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 border-2 border-cyan-400/10 bg-black/40 space-y-8">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">Execution_Parameters</span>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-cyan-400/30 uppercase tracking-widest">Request_Method</label>
                <div className="h-12 border-2 border-cyan-400/10 bg-black/60 flex items-center px-4 text-xs font-bold text-cyan-400 italic">
                  {protocol === 'REST' ? 'GET /api/v1/user/stats' : 'POST /graphql { stats { ... } }'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 border-cyan-400/10 bg-cyan-400/5 space-y-1">
                  <span className="text-[8px] font-black text-cyan-400/30 uppercase">Latency_Sim</span>
                  <div className="text-xs font-black text-cyan-400 uppercase">Variable</div>
                </div>
                <div className="p-4 border-2 border-cyan-400/10 bg-cyan-400/5 space-y-1">
                  <span className="text-[8px] font-black text-cyan-400/30 uppercase">Cache_Policy</span>
                  <div className="text-xs font-black text-cyan-400 uppercase italic">No-Store</div>
                </div>
              </div>
            </div>

            <button 
              onClick={runSimulation}
              disabled={status === 'executing'}
              className="w-full h-16 bg-cyan-400 text-black font-black text-xs tracking-[0.3em] uppercase transition-all hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.2)] disabled:opacity-20 flex items-center justify-center gap-3"
            >
              <Send className="w-4 h-4" />
              EXECUTE_CALL
            </button>
          </div>

          <div className="p-8 border-2 border-cyan-400/10 bg-black/40 space-y-4">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">Execution_Trace</span>
            </div>
            <div className="space-y-2 font-mono text-[9px]">
              <AnimatePresence initial={false}>
                {logs.map(log => (
                  <motion.div 
                    key={log.id} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-cyan-400/40 flex justify-between"
                  >
                    <span>{">"} {log.msg}</span>
                    <span className="opacity-30">{log.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Visual Stage */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
          <div className="flex-grow border-2 border-cyan-400/20 bg-black/60 flex flex-col overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            
            {/* Visual HUD */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 space-y-16">
              <div className="w-full flex items-center justify-around gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 border-2 border-cyan-400/40 bg-black flex items-center justify-center relative">
                    <Globe className="w-10 h-10 text-cyan-400" />
                    <div className="absolute -top-3 -left-3 px-2 bg-cyan-400 text-black text-[8px] font-black uppercase">NODE_01</div>
                  </div>
                  <span className="text-[10px] font-black text-cyan-400 uppercase">Client</span>
                </div>

                <div className="flex-grow h-px bg-cyan-400/20 relative">
                  {status === 'executing' && (
                    <motion.div 
                      animate={{ left: ["0%", "100%"] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rotate-45 shadow-[0_0_15px_rgba(0,255,255,1)]"
                    />
                  )}
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 border-2 border-cyan-400/40 bg-black flex items-center justify-center relative">
                    <Database className="w-10 h-10 text-cyan-400" />
                    <div className="absolute -top-3 -left-3 px-2 bg-cyan-400 text-black text-[8px] font-black uppercase">NODE_02</div>
                  </div>
                  <span className="text-[10px] font-black text-cyan-400 uppercase">API_Cluster</span>
                </div>
              </div>

              {/* Status Display */}
              <div className="w-full max-w-md bg-black/40 border-2 border-cyan-400/10 p-6 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-cyan-400/40 border-b border-cyan-400/10 pb-2">
                  <span>METRICS</span>
                  <span>SYS_LOG</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[8px] font-black text-cyan-400/20 uppercase block">STATUS_CODE</span>
                    <span className="text-xs font-black text-cyan-400 uppercase">{status === 'success' ? '200_OK' : status === 'executing' ? 'PENDING...' : 'IDLE'}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-cyan-400/20 uppercase block">ROUND_TRIP</span>
                    <span className="text-xs font-black text-cyan-400 uppercase">{latency > 0 ? `${latency}ms` : '--'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Toolbar */}
            <div className="p-4 border-t-2 border-cyan-400/10 bg-black/80 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className={cn("w-2 h-2 rounded-full", status === 'executing' ? "bg-amber-400 animate-ping" : status === 'success' ? "bg-cyan-400" : "bg-slate-600")} />
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/40">
                  MONITOR_STATE::{status.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={reset}
                className="p-2 border border-cyan-400/20 hover:border-cyan-400 text-cyan-400 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
