import { useState } from 'react';
import { Server, Database, User, ShieldAlert, Zap, RefreshCw, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

type Node = {
    id: number;
    status: 'online' | 'offline';
    value: number;
};

export const WhatIsBlockchainViz = () => {
    const getInitialNodes = (targetMode: 'centralized' | 'blockchain', val: number): Node[] => {
        if (targetMode === 'centralized') {
            return [{ id: 1, status: 'online', value: val }];
        }
        return [
            { id: 1, status: 'online', value: val },
            { id: 2, status: 'online', value: val },
            { id: 3, status: 'online', value: val },
            { id: 4, status: 'online', value: val },
        ];
    };

    const [mode, setMode] = useState<'centralized' | 'blockchain'>('centralized');
    const [globalValue, setGlobalValue] = useState(10);
    const [nodes, setNodes] = useState<Node[]>(() => getInitialNodes('centralized', 10));
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastAction, setLastAction] = useState<string | null>(null);

    const handleModeChange = (newMode: 'centralized' | 'blockchain') => {
        setMode(newMode);
        setNodes(getInitialNodes(newMode, globalValue));
        setLastAction(null);
    };

    const submitTransaction = () => {
        if (isProcessing) return;
        
        const activeNodes = nodes.filter(n => n.status === 'online');
        
        if (activeNodes.length === 0) {
            setLastAction("❌ System Failure: No nodes available");
            return;
        }

        setIsProcessing(true);
        setLastAction("📡 Broadcasting Transaction: Increment +1");

        // Simulation logic
        if (mode === 'centralized') {
            setTimeout(() => {
                setNodes(prev => prev.map(n => ({ ...n, value: n.value + 1 })));
                setGlobalValue(v => v + 1);
                setIsProcessing(false);
                setLastAction("✅ State Updated successfully");
            }, 800);
        } else {
            // Blockchain replication simulation
            setTimeout(() => {
                setNodes(prev => prev.map(n => n.status === 'online' ? { ...n, value: n.value + 1 } : n));
                setGlobalValue(v => v + 1);
                setIsProcessing(false);
                setLastAction("💎 Consensus Reached: All nodes replicated state");
            }, 1200);
        }
    };

    const toggleNode = (id: number) => {
        setNodes(prev => prev.map(n => 
            n.id === id ? { ...n, status: n.status === 'online' ? 'offline' : 'online', value: globalValue } : n
        ));
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto p-4">
            {/* Control Panel */}
            <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-between border-b border-border pb-6">
                <div className="flex gap-2 bg-muted p-1 rounded-xl">
                    <Button 
                        variant={mode === 'centralized' ? 'default' : 'ghost'}
                        onClick={() => handleModeChange('centralized')}
                        className="rounded-lg px-6"
                    >
                        Centralized
                    </Button>
                    <Button 
                        variant={mode === 'blockchain' ? 'default' : 'ghost'}
                        onClick={() => handleModeChange('blockchain')}
                        className="rounded-lg px-6"
                    >
                        Blockchain
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button 
                        onClick={submitTransaction} 
                        disabled={isProcessing}
                        className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                        <Zap className={cn("w-4 h-4", isProcessing && "animate-pulse")} />
                        Submit Transaction
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => {
                        setGlobalValue(10);
                        setNodes(getInitialNodes(mode, 10));
                        setLastAction(null);
                    }}>
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Simulation Canvas */}
            <div className="w-full h-[400px] bg-secondary/10 rounded-3xl border border-border/50 relative overflow-hidden flex items-center justify-center">
                
                {/* Background Grid Decor */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                {/* Users (Clients) */}
                <div className="absolute left-8 md:left-16 flex flex-col gap-12">
                    {[1, 2].map(u => (
                        <div key={u} className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-background border border-border rounded-full shadow-sm">
                                <User className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Client {u}</span>
                            
                            {/* Animated Signal to System */}
                            {isProcessing && (
                                <motion.div 
                                    initial={{ x: 0, opacity: 0 }}
                                    animate={{ x: 100, opacity: [0, 1, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="absolute left-12"
                                >
                                    <Zap className="w-4 h-4 text-primary fill-primary" />
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>

                {/* System Architecture */}
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        {mode === 'centralized' ? (
                            <motion.div 
                                key="cent"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => toggleNode(1)}
                                    className={cn(
                                        "w-32 h-32 rounded-2xl border-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-500 relative",
                                        nodes[0]?.status === 'online' 
                                            ? "bg-card border-primary shadow-2xl shadow-primary/20" 
                                            : "bg-destructive/10 border-destructive grayscale shadow-none"
                                    )}
                                >
                                    <Server className={cn("w-12 h-12", nodes[0]?.status === 'online' ? "text-primary" : "text-destructive")} />
                                    <div className="text-xl font-black font-mono">v{nodes[0]?.value || '??'}</div>
                                    <div className="absolute -top-3 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
                                        CENTRAL SERVER
                                    </div>
                                    {nodes[0]?.status === 'offline' && <ShieldAlert className="absolute -top-3 right-0 text-destructive animate-bounce" />}
                                </motion.div>
                                <p className="mt-4 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Click to Attack Server</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="block"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-2 gap-6 md:gap-12"
                            >
                                {nodes.map((node, i) => (
                                    <motion.div 
                                        key={node.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => toggleNode(node.id)}
                                        className={cn(
                                            "w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-500 relative",
                                            node.status === 'online' 
                                                ? "bg-card border-primary/50 shadow-lg" 
                                                : "bg-destructive/5 border-destructive opacity-40 grayscale"
                                        )}
                                    >
                                        <Database className={cn("w-6 h-6", node.status === 'online' ? "text-primary" : "text-destructive")} />
                                        <div className="text-sm font-bold font-mono">v{node.status === 'online' ? node.value : '--'}</div>
                                        <span className="text-[8px] opacity-50 uppercase">Node {node.id}</span>
                                        
                                        {/* Consensus Pulse */}
                                        {isProcessing && node.status === 'online' && (
                                            <motion.div 
                                                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                                className="absolute inset-0 bg-primary rounded-xl"
                                            />
                                        )}
                                    </motion.div>
                                ))}
                                
                                {/* Mesh Network Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible">
                                    <motion.path 
                                        d="M 25% 25% L 75% 25% L 75% 75% L 25% 75% Z M 25% 25% L 75% 75% M 75% 25% L 25% 75%" 
                                        stroke="currentColor" 
                                        className="text-primary/10" 
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] max-w-md">
                    <div className="bg-background/80 backdrop-blur-md border border-border rounded-full px-6 py-2 flex items-center justify-between shadow-xl">
                        <div className="flex items-center gap-3">
                            <Activity className={cn("w-4 h-4", isProcessing ? "text-primary animate-spin" : "text-green-500")} />
                            <span className="text-xs font-medium truncate max-w-[200px]">
                                {lastAction || "System Idle - Waiting for transaction"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className={cn("w-2 h-2 rounded-full", nodes.some(n => n.status === 'online') ? "bg-green-500" : "bg-red-500")} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">
                                {nodes.filter(n => n.status === 'online').length} Nodes Live
                             </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Educational Takeaway */}
            <div className="grid md:grid-cols-2 gap-6 w-full mt-4">
                <div className="bg-card border border-border p-5 rounded-2xl">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" /> The "State Machine"
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        The state is simply the value <code className="bg-muted px-1 rounded font-mono">v{globalValue}</code>. 
                        Every transaction is a set of instructions that moves the machine from <code className="bg-muted px-1 rounded font-mono">v{globalValue}</code> to <code className="bg-muted px-1 rounded font-mono">v{globalValue + 1}</code>. 
                        Blockchain ensures this "State Transition" happens identically on all nodes.
                    </p>
                </div>
                <div className="bg-card border border-border p-5 rounded-2xl">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-destructive" /> Byzantine Fault Tolerance
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Try <strong>attacking the Central Server</strong>—the system stops instantly. 
                        In the Blockchain mode, try <strong>killing 2 or 3 nodes</strong>. 
                        The network remains active and the state transition still succeeds as long as a quorum exists.
                    </p>
                </div>
            </div>
        </div>
    );
};