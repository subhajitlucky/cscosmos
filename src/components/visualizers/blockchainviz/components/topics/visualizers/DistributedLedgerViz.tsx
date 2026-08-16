import { useState, useRef } from 'react';
import { Database, Send, Radio, Cloud, WifiOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

type Packet = {
    id: string;
    targetNodeId: number;
    data: string;
};

type NodeState = {
    id: number;
    ledger: string[];
    isOnline: boolean;
};

export const DistributedLedgerViz = () => {
    const [nodes, setNodes] = useState<NodeState[]>([
        { id: 1, ledger: [], isOnline: true },
        { id: 2, ledger: [], isOnline: true },
        { id: 3, ledger: [], isOnline: true },
    ]);
    const [packets, setPackets] = useState<Packet[]>([]);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const packetCounter = useRef(0);

    const broadcast = () => {
        setIsBroadcasting(true);
        const txId = `TX_${Math.floor(Math.random() * 900) + 100}`;
        const newPackets: Packet[] = nodes.map(node => ({
            id: `p-${packetCounter.current++}-${node.id}`,
            targetNodeId: node.id,
            data: txId
        }));

        setPackets(prev => [...prev, ...newPackets]);

        newPackets.forEach((packet, index) => {
            const delay = 1000 + (Math.random() * 2000);
            
            setTimeout(() => {
                setNodes(prev => prev.map(n => {
                    if (n.id === packet.targetNodeId && n.isOnline) {
                        return { ...n, ledger: [...n.ledger, packet.data] };
                    }
                    return n;
                }));
                setPackets(prev => prev.filter(p => p.id !== packet.id));
                
                if (index === newPackets.length - 1) {
                    setIsBroadcasting(false);
                }
            }, delay);
        });
    };

    const toggleNode = (id: number) => {
        setNodes(prev => prev.map(n => 
            n.id === id ? { ...n, isOnline: !n.isOnline } : n
        ));
    };

    const allInSync = nodes.length > 0 && 
                      nodes.every(n => n.ledger.length === (nodes[0].ledger.length || 0)) && 
                      nodes.every(n => JSON.stringify(n.ledger) === JSON.stringify(nodes[0].ledger));

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                <div className="space-y-1">
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <Radio className={cn("w-4 h-4", isBroadcasting ? "text-primary animate-pulse" : "text-muted-foreground")} />
                        The Gossip Protocol
                    </h3>
                    <p className="text-[10px] text-muted-foreground">Visualizing asynchronous P2P propagation.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all",
                        allInSync ? "bg-green-500/10 border-green-500/50 text-green-600" : "bg-yellow-500/10 border-yellow-500/50 text-yellow-600"
                    )}>
                        {allInSync ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3 animate-spin-slow" />}
                        {allInSync ? "In Sync" : "Syncing..."}
                    </div>
                    <Button size="sm" onClick={broadcast} disabled={isBroadcasting} className="rounded-full shadow-lg h-8">
                        <Send className="w-3 h-3 mr-2" /> Broadcast
                    </Button>
                </div>
            </div>

            {/* Network Visualization Container */}
            <div className="w-full h-[400px] relative bg-secondary/5 rounded-2xl border border-border/40 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <Cloud className="w-full h-full p-20" />
                </div>

                {/* Animated Packets */}
                <AnimatePresence>
                    {packets.map((packet) => {
                        // Dynamic coordinates based on node ID
                        const coords = {
                            1: { top: '70%', left: '20%' },
                            2: { top: '30%', left: '50%' },
                            3: { top: '70%', left: '80%' }
                        }[packet.targetNodeId as 1|2|3];

                        return (
                            <motion.div
                                key={packet.id}
                                initial={{ left: '50%', top: '50%', opacity: 0, scale: 0 }}
                                animate={{ ...coords, opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="absolute z-20"
                            >
                                <div className="bg-primary text-primary-foreground text-[8px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                    {packet.data}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Nodes Layout */}
                <div className="w-full h-full relative">
                    {nodes.map((node) => {
                        const positionClass = {
                            1: "bottom-8 left-8 md:left-16",
                            2: "top-8 left-1/2 -translate-x-1/2",
                            3: "bottom-8 right-8 md:right-16"
                        }[node.id as 1|2|3];

                        return (
                            <div 
                                key={node.id}
                                onClick={() => toggleNode(node.id)}
                                className={cn(
                                    "absolute flex flex-col items-center gap-2 cursor-pointer transition-all duration-500 group",
                                    positionClass,
                                    !node.isOnline && "opacity-40 grayscale"
                                )}
                            >
                                <div className={cn(
                                    "p-4 rounded-2xl border-2 transition-all duration-300 bg-card",
                                    node.isOnline ? "border-primary/20 shadow-md group-hover:border-primary/50" : "border-dashed border-muted-foreground/30"
                                )}>
                                    <Database className={cn("w-8 h-8", node.isOnline ? "text-primary" : "text-muted-foreground")} />
                                    {!node.isOnline && <WifiOff className="absolute -top-1 -right-1 w-4 h-4 text-destructive" />}
                                    
                                    <div className="mt-2 w-20 border-t border-border/50 pt-2">
                                        <div className="h-16 overflow-y-auto space-y-1 pr-1 scrollbar-hide">
                                            {node.ledger.map((tx, idx) => (
                                                <div key={idx} className="text-[8px] font-mono bg-primary/5 text-primary rounded px-1 flex justify-between">
                                                    <span>{tx}</span>
                                                    <span className="text-green-500">✓</span>
                                                </div>
                                            ))}
                                            {node.ledger.length === 0 && <div className="text-[8px] text-muted-foreground/50 italic text-center">Empty</div>}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Node {node.id}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Insight */}
            <div className="w-full bg-secondary/10 rounded-xl p-4 border border-border/50">
                <h4 className="text-xs font-bold mb-1 flex items-center gap-2">
                    <Cloud className="w-3 h-3 text-primary" /> Network Insight
                </h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Notice how packets arrive at different times. In a distributed system, "order" is relative. 
                    Nodes must use consensus to agree on a single global sequence despite network delays.
                </p>
            </div>
        </div>
    );
};
