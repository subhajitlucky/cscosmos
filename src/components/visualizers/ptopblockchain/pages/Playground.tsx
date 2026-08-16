import { useState, useRef, useEffect, useMemo } from 'react';
import { useNetwork } from '../hooks/useNetwork';
import NetworkGraph from '../components/visualizer/NetworkGraph';
import { Plus, Send, Zap, Database, Terminal, BookOpen, BarChart3, Trash2, Link as LinkIcon, Unlink, Activity } from 'lucide-react';
import type { NetworkState, Node } from '../lib/simulation/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INITIAL_STATE: NetworkState = {
  nodes: [
    { id: 'Alpha', type: 'full', x: 200, y: 200, peers: ['Beta'], mempool: [], chain: [], latency: 200 },
    { id: 'Beta', type: 'full', x: 400, y: 200, peers: ['Alpha', 'Gamma'], mempool: [], chain: [], latency: 200 },
    { id: 'Gamma', type: 'full', x: 300, y: 400, peers: ['Beta'], mempool: [], chain: [], latency: 200 },
  ],
  connections: [
    { id: '1-2', from: 'Alpha', to: 'Beta', latency: 1500 },
    { id: '2-3', from: 'Beta', to: 'Gamma', latency: 1200 },
  ],
  packets: []
};

const Playground = () => {
  const { state, logs, addNode, removeNode, connectNodes, disconnectNodes, broadcast, reset } = useNetwork(INITIAL_STATE);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleAddNode = () => {
    const id = `Node-${Math.floor(Math.random() * 1000)}`;
    addNode({
      id,
      type: 'full',
      x: 200 + Math.random() * 400,
      y: 200 + Math.random() * 200,
      peers: [],
      mempool: [],
      chain: [],
      latency: 200
    });
  };

  const handleRemoveNode = () => {
    if (selectedNode) {
      removeNode(selectedNode);
      setSelectedNode(null);
    }
  };

  const handleConnect = () => {
    if (selectedNode && state.nodes.length > 1) {
      const node = state.nodes.find(sn => sn.id === selectedNode);
      const otherNodes = state.nodes.filter((n: Node) => n.id !== selectedNode && !node?.peers.includes(n.id));
      if (otherNodes.length > 0) {
        const target = otherNodes[Math.floor(Math.random() * otherNodes.length)];
        connectNodes(selectedNode, target.id);
      }
    }
  };

  const handleDisconnect = () => {
    if (selectedNode) {
      const node = state.nodes.find(sn => sn.id === selectedNode);
      if (node && node.peers.length > 0) {
        const targetId = node.peers[Math.floor(Math.random() * node.peers.length)];
        disconnectNodes(selectedNode, targetId);
      }
    }
  };

  const handleBroadcastTX = () => {
    if (selectedNode) {
      broadcast(selectedNode, 'transaction', `tx-${Math.random().toString(36).substr(2, 5)}`);
    }
  };

  const handleBroadcastBlock = () => {
    if (selectedNode) {
      broadcast(selectedNode, 'block', `blk-${Math.random().toString(36).substr(2, 5)}`);
    }
  };

  const currentNode = state.nodes.find(n => n.id === selectedNode);

  const stats = useMemo(() => {
    const totalNodes = state.nodes.length;
    const nodesWithData = state.nodes.filter(n => n.mempool.length > 0 || n.chain.length > 0).length;
    const coverage = totalNodes > 0 ? (nodesWithData / totalNodes) * 100 : 0;
    return { nodesWithData, coverage };
  }, [state.nodes]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-8 min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] flex flex-col gap-4 sm:gap-6 lg:overflow-hidden">
      
      {/* Tactical Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center premium-panel px-4 sm:px-6 py-3 border-primary/20 gap-4 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-display font-black text-main tracking-widest uppercase leading-tight">Tactical_War_Room</h1>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] sm:text-[9px] text-primary/60 font-mono uppercase tracking-[0.2em]">Live_Simulation_Active</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setShowGuide(!showGuide)} className="flex-1 sm:flex-none premium-btn text-[8px] sm:text-[10px] px-3 sm:px-4 py-1.5 sm:py-2 border-primary/20 uppercase tracking-widest">
            {showGuide ? "HIDE_INTEL" : "SHOW_INTEL"}
          </button>
          <button 
            onClick={() => reset(INITIAL_STATE)} 
            className="flex-1 sm:flex-none premium-btn text-[8px] sm:text-[10px] px-3 sm:px-4 py-1.5 sm:py-2 border-red-500/30 text-red-500 hover:border-red-500 hover:bg-red-500/10 uppercase tracking-widest"
          >
            SYSTEM_REBOOT
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 flex-grow min-h-0">
        
        {/* Left Sidebar - Stacks first on mobile */}
        <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar order-2 lg:order-1">
          {showGuide && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-panel p-4 sm:p-6 border-l-4 border-l-primary bg-primary/[0.02]">
              <h3 className="tech-label mb-3 sm:mb-4 flex items-center gap-2 !text-primary">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Commander_Brief
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-[10px] sm:text-xs font-medium text-main/70">
                <li className="flex gap-2 sm:gap-3"><span className="text-primary font-mono">[01]</span> DEPLOY nodes to sector</li>
                <li className="flex gap-2 sm:gap-3"><span className="text-primary font-mono">[02]</span> ESTABLISH peer mesh uplinks</li>
                <li className="flex gap-2 sm:gap-3"><span className="text-primary font-mono">[03]</span> INITIATE gossip propagation</li>
                <li className="flex gap-2 sm:gap-3"><span className="text-primary font-mono">[04]</span> MONITOR real-time data sync</li>
              </ul>
            </motion.div>
          )}

          <div className="premium-panel p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
            <h3 className="tech-label flex items-center gap-2 border-b border-border-dim pb-3 sm:pb-4">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Topology_Matrix
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <ControlButton onClick={handleAddNode} icon={<Plus />} label="ADD_UNIT" />
              <ControlButton 
                onClick={handleRemoveNode} 
                disabled={!selectedNode} 
                icon={<Trash2 />} 
                label="PURGE" 
                variant="danger" 
              />
              <ControlButton 
                onClick={handleConnect} 
                disabled={!selectedNode} 
                icon={<LinkIcon />} 
                label="UPLINK" 
              />
              <ControlButton 
                onClick={handleDisconnect} 
                disabled={!selectedNode || (currentNode?.peers.length === 0)} 
                icon={<Unlink />} 
                label="SEVER" 
              />
            </div>
          </div>

          <div className="premium-panel p-4 sm:p-6 mt-auto">
            <h3 className="tech-label flex items-center gap-2 mb-3 sm:mb-4">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Propagation_Metrics
            </h3>
            <div className="flex justify-between text-[8px] sm:text-[10px] font-mono text-primary mb-1.5 sm:mb-2">
              <span>SYNC_CONVERGENCE</span>
              <span>{stats.coverage.toFixed(0)}%</span>
            </div>
            <div className="h-1 sm:h-1.5 w-full bg-primary/10 rounded-full overflow-hidden border border-primary/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-blue-600 shadow-[0_0_15px_var(--primary)]" 
                initial={{ width: 0 }}
                animate={{ width: `${stats.coverage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Viewport - Main focus on mobile */}
        <div className="lg:col-span-6 relative flex flex-col h-[450px] sm:h-[600px] lg:h-auto order-1 lg:order-2">
          <div className="flex-grow premium-panel bg-[#02040a] relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border-primary/10">
            <div className="absolute top-3 sm:top-4 left-4 sm:left-6 tech-label opacity-40 text-[7px] sm:text-[9px]">Tactical_Display_01</div>
            <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-6 tech-label opacity-40 text-[7px] sm:text-[9px] hidden xs:block">System_Clock: {new Date().toLocaleTimeString()}</div>
            
            <NetworkGraph 
              state={state} 
              onNodeClick={setSelectedNode} 
            />
          </div>
        </div>

        {/* Right Sidebar - Stacks last on mobile */}
        <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6 lg:min-h-0 order-3 lg:order-3">
          <div className="min-h-[180px] sm:min-h-[200px]">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div 
                  key={selectedNode}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="premium-panel p-4 sm:p-6 h-full border-primary/30 bg-primary/[0.03]"
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-border-dim pb-3 sm:pb-4">
                    <h3 className="font-display font-black text-sm sm:text-lg text-primary tracking-tight truncate max-w-[120px] sm:max-w-none">{selectedNode}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[7px] sm:text-[9px] font-mono text-emerald-500 font-bold tracking-widest">ACTIVE</span>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <button onClick={handleBroadcastTX} className="premium-btn py-2 sm:py-3 text-[8px] sm:text-[10px] bg-amber-500/5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500 shadow-none uppercase tracking-widest">
                      <Send className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-2" /> GOSSIP_TRANSACTION
                    </button>
                    <button onClick={handleBroadcastBlock} className="premium-btn py-2 sm:py-3 text-[8px] sm:text-[10px] bg-emerald-500/5 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500 shadow-none uppercase tracking-widest">
                      <Database className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-2" /> BROADCAST_NEW_BLOCK
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-auto">
                    <DataStat label="BUFFER" value={currentNode?.mempool.length || 0} />
                    <DataStat label="LEDGER" value={currentNode?.chain.length || 0} />
                  </div>
                </motion.div>
              ) : (
                <div className="premium-panel h-full flex flex-col items-center justify-center text-center opacity-40 border-dashed border-primary/20 p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-primary/40" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-display font-bold text-main tracking-widest uppercase opacity-60">Initialize Unit Interface</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="premium-panel flex-grow flex flex-col min-h-[300px] lg:min-h-0">
            <div className="p-3 sm:p-4 border-b border-border-dim font-display font-bold text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-primary/60 flex justify-between items-center bg-primary/[0.02]">
              <span>Event_Log_Stream</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse delay-100" />
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse delay-200" />
              </div>
            </div>
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-3 sm:p-4 space-y-2 font-mono text-[8px] sm:text-[9px]">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-primary/20 italic">-- SILENCE_IN_NETWORK --</div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className={cn(
                    "px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border-l-2 bg-primary/[0.02] transition-all",
                    log.type === 'success' ? "border-emerald-500/50 text-emerald-400/80" :
                    log.type === 'warning' ? "border-amber-500/50 text-amber-400/80" :
                    "border-primary/50 text-primary/80"
                  )}>
                    <div className="flex justify-between mb-0.5 sm:mb-1 opacity-40 font-black text-[6px] sm:text-[7px]">
                      <span>{log.type.toUpperCase()}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <div className="uppercase tracking-tight leading-tight">{log.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'danger';
}

const ControlButton = ({ onClick, disabled, icon, label, variant = 'primary' }: ControlButtonProps) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={cn(
      "premium-btn py-3 text-[9px] flex items-center justify-center gap-2 border-primary/20",
      variant === 'danger' && "border-red-500/30 text-red-500 hover:border-red-500",
      disabled && "opacity-20 cursor-not-allowed grayscale"
    )}
  >
    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-3 h-3' }) : icon}
    <span className="mt-0.5">{label}</span>
  </button>
);

interface DataStatProps {
  label: string;
  value: string | number;
}

const DataStat = ({ label, value }: DataStatProps) => (
  <div className="bg-[#02040a] p-3 rounded-xl border border-primary/10 text-center shadow-inner">
    <p className="text-[8px] text-primary/40 uppercase tracking-widest font-black mb-1">{label}</p>
    <p className="text-2xl font-display font-black text-primary drop-shadow-[0_0_10px_var(--primary-dim)]">{value}</p>
  </div>
);

import React from 'react';
export default Playground;