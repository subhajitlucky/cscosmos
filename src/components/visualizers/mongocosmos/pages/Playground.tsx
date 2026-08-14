'use client';

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, RefreshCw, Database, Globe, Cpu, Clock, AlertCircle, Binary, Zap } from 'lucide-react'
import { cn } from '../lib/utils'

export function Playground() {
  const [status, setStatus] = useState<'idle' | 'executing' | 'success' | 'error'>('idle')
  const [latency, setLatency] = useState(0)
  const [useIndex, setUseIndex] = useState(false)
  const [logs, setLogs] = useState<{ id: number; msg: string; time: string; type: string }[]>([])

  const addLog = (msg: string, type: 'SYS' | 'DB' | 'NET' = 'SYS') => {
    setLogs(prev => [{ id: Date.now(), msg, time: new Date().toLocaleTimeString(), type }, ...prev].slice(0, 12))
  }

  const runQuery = () => {
    if (status === 'executing') return
    setStatus('executing')
    setLatency(0)
    addLog('INIT_QUERY_EXECUTION', 'SYS')
    addLog(useIndex ? 'INDEX_SCAN_DETECTED' : 'COLLECTION_SCAN_DETECTED', 'DB')
    
    const targetLatency = useIndex ? 12 : 850
    const start = Date.now()
    
    setTimeout(() => {
      setLatency(Date.now() - start)
      setStatus('success')
      addLog(`QUERY_PLAN_COMPLETE: ${useIndex ? 'IXSCAN' : 'COLLSCAN'}`, 'DB')
      addLog('TRANSACTION_COMMITTED', 'SYS')
    }, targetLatency)
  }

  const reset = () => {
    setStatus('idle')
    setLatency(0)
    setLogs([])
  }

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b-4 border-primary/10 pb-12">
        <div className="space-y-4">
          <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none text-glow">Playground</h1>
          <p className="text-primary/40 text-[11px] font-black uppercase tracking-[0.5em] italic">WiredTiger Virtual Simulation Engine v1.0</p>
        </div>
        <div className="flex items-center gap-6 bg-primary/5 border-2 border-primary/20 p-2">
          <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-4 italic">Index_Mode:</span>
          <button 
            onClick={() => setUseIndex(!useIndex)}
            className={cn(
              "px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
              useIndex ? "bg-primary text-black shadow-[0_0_20px_rgba(0,237,100,0.4)]" : "dark:bg-black/40 bg-white/60 text-primary/40 border border-primary/20 hover:text-primary"
            )}
          >
            {useIndex ? 'IXSCAN_ACTIVE' : 'COLLSCAN_ONLY'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* Controls Panel */}
        <div className="xl:col-span-4 space-y-10">
          <div className="p-10 border-4 border-primary/10 dark:bg-black/40 bg-white/60 space-y-10 shadow-2xl relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
            
            <div className="flex items-center gap-4">
              <Cpu className="w-6 h-6 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary/60 italic">Query_Parameters</span>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-primary/30 uppercase tracking-[0.3em]">Query_Manifest</label>
                <div className="min-h-24 border-2 border-primary/10 dark:bg-black/60 bg-white/80 p-6 text-xs font-bold text-primary italic leading-relaxed">
                  {`db.telemetry.find({\n  status: "active",\n  region: "US-EAST"\n})`}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 border-2 border-primary/10 bg-primary/5 space-y-2">
                  <span className="text-[8px] font-black text-primary/30 uppercase italic">Collection_Size</span>
                  <div className="text-lg font-black text-primary italic leading-none tracking-tighter">1.2M_DOCS</div>
                </div>
                <div className="p-6 border-2 border-primary/10 bg-primary/5 space-y-2">
                  <span className="text-[8px] font-black text-primary/30 uppercase italic">Lock_State</span>
                  <div className="text-lg font-black text-primary italic leading-none tracking-tighter uppercase">Shared</div>
                </div>
              </div>
            </div>

            <button 
              onClick={runQuery}
              disabled={status === 'executing'}
              className="w-full h-20 bg-primary text-black font-black text-sm tracking-[0.4em] uppercase transition-all hover:bg-primary/80 shadow-[0_0_30px_rgba(0,237,100,0.3)] disabled:opacity-20 flex items-center justify-center gap-4 italic active:scale-95"
            >
              <Zap className="w-6 h-6 fill-current" />
              EXEC_PLAN
            </button>
          </div>

          {/* Trace Log */}
          <div className="p-10 border-4 border-primary/10 dark:bg-black/40 bg-white/60 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Execution_Trace_Log</span>
            </div>
            <div className="space-y-3 font-mono text-[9px] h-64 overflow-y-auto custom-scrollbar">
              <AnimatePresence initial={false}>
                {logs.map(log => (
                  <motion.div 
                    key={log.id} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-primary/40 flex justify-between gap-4 border-l-2 border-primary/10 pl-4 py-1"
                  >
                    <span className="font-bold flex gap-2">
                      <span className={cn(
                        "opacity-100",
                        log.type === 'DB' ? "text-primary" : log.type === 'NET' ? "text-blue-400" : "text-primary/40"
                      )}>[{log.type}]</span>
                      {log.msg}
                    </span>
                    <span className="opacity-20 text-[8px]">{log.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <Binary className="w-12 h-12 text-primary animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visual Stage */}
        <div className="xl:col-span-8 flex flex-col h-full min-h-[700px]">
          <div className="flex-grow border-4 border-primary/20 dark:bg-black/60 bg-white/80 flex flex-col overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            
            {/* Stage HUD */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-16 space-y-24">
              
              <div className="w-full flex items-center justify-around gap-12 max-w-4xl">
                {/* Nodes */}
                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 border-4 border-primary/40 dark:bg-black bg-white flex items-center justify-center relative shadow-brutal active:scale-95 transition-transform">
                    <Globe className="w-12 h-12 text-primary" />
                    <div className="absolute -top-4 -left-4 px-3 py-1 bg-primary text-black text-[9px] font-black uppercase italic tracking-widest shadow-brutal">APP_01</div>
                  </div>
                  <span className="text-xs font-black text-primary uppercase tracking-[0.3em] italic">Driver_Node</span>
                </div>

                {/* Packet Simulation */}
                <div className="flex-grow h-px bg-primary/20 relative">
                  {status === 'executing' && (
                    <motion.div 
                      animate={{ x: ["0%", "100%", "0%"] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rotate-45 shadow-[0_0_20px_rgba(0,237,100,1)] border-2 border-black"
                    />
                  )}
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 border-4 border-primary/40 dark:bg-black bg-white flex items-center justify-center relative group-hover:border-primary transition-colors duration-500 shadow-brutal">
                    <Database className={cn("w-12 h-12 transition-colors duration-500", status === 'executing' ? "text-primary text-glow" : "text-primary/40")} />
                    <div className="absolute -bottom-4 -right-4 px-3 py-1 bg-primary text-black text-[9px] font-black uppercase italic tracking-widest shadow-brutal">PRIMARY</div>
                  </div>
                  <span className="text-xs font-black text-primary uppercase tracking-[0.3em] italic">Mongo_Daemon</span>
                </div>
              </div>

              {/* Performance Telemetry */}
              <div className="w-full max-w-2xl grid grid-cols-2 gap-px bg-primary/10 border-4 border-primary/10 shadow-2xl">
                <div className="p-8 bg-background flex flex-col items-center gap-4 group/tele">
                  <Clock className="w-6 h-6 text-primary/40 group-hover/tele:text-primary transition-colors" />
                  <span className="text-[10px] font-black uppercase text-primary/30 tracking-widest italic">Exec_Latency</span>
                  <span className="text-4xl font-black text-primary italic tracking-tighter">{latency}ms</span>
                </div>
                <div className="p-8 bg-background flex flex-col items-center gap-4 group/tele">
                  <AlertCircle className="w-6 h-6 text-primary/40 group-hover/tele:text-primary transition-colors" />
                  <span className="text-[10px] font-black uppercase text-primary/30 tracking-widest italic">Plan_Status</span>
                  <span className={cn("text-4xl font-black italic tracking-tighter", status === 'success' ? "text-primary text-glow" : "text-primary/10")}>
                    {status === 'success' ? '200_OK' : 'PRB_INIT'}
                  </span>
                </div>
              </div>
            </div>

            {/* Visualizer Footer */}
            <div className="p-8 border-t-4 border-primary/10 bg-primary/5 flex items-center justify-between relative z-10 backdrop-blur-md">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,237,100,0.5)]", status === 'executing' ? "bg-primary animate-pulse" : "bg-primary/20")} />
                  <span className="text-[11px] font-black text-primary/60 uppercase tracking-[0.3em] italic">
                    {status === 'idle' && 'READY_FOR_TRAFFIC_CAPTURE'}
                    {status === 'executing' && `TRAVERSING_STORAGE_LAYER...`}
                    {status === 'success' && 'SYNCHRONIZATION_STABLE_IXSCAN'}
                  </span>
                </div>
              </div>
              <button 
                onClick={reset}
                className="text-[10px] font-black text-primary/40 hover:text-primary transition-all flex items-center gap-3 uppercase tracking-widest italic"
              >
                <RefreshCw className="w-4 h-4" />
                SYSTEM_RESET
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
