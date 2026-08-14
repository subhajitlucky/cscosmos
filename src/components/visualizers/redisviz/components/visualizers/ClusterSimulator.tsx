'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Server, Search, Cpu } from 'lucide-react';
import { cn } from "@/lib/utils";

// CRC16 simulation
const getHashSlot = (key: string) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash % 16384);
};

const ClusterSimulator = () => {
    const [nodes] = useState([
        { id: 'Node-1', ip: '192.168.0.1', slots: [0, 5460] },
        { id: 'Node-2', ip: '192.168.0.2', slots: [5461, 10922] },
        { id: 'Node-3', ip: '192.168.0.3', slots: [10923, 16383] }
    ]);
    const [searchKey, setSearchKey] = useState("user:42");
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

    const currentSlot = useMemo(() => getHashSlot(searchKey), [searchKey]);

    const targetNode = useMemo(() => {
        return nodes.find(n => currentSlot >= n.slots[0] && currentSlot <= n.slots[1]);
    }, [nodes, currentSlot]);

    const handleSearch = () => {
        setActiveNodeId(targetNode?.id || null);
        setTimeout(() => setActiveNodeId(null), 2000);
    };

    return (
        <div className="space-y-8">
            <Card className="border-2 shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5 text-redis" />
                                Sharding & Slots
                            </CardTitle>
                            <CardDescription>Enter a key to see which cluster node it belongs to.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={searchKey}
                                onChange={(e) => setSearchKey(e.target.value)}
                                placeholder="Enter key..."
                                className="w-40 h-9 font-mono text-xs"
                            />
                            <Button size="sm" onClick={handleSearch} className="bg-redis">
                                <Search className="w-4 h-4 mr-1" /> Locate
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
                        {/* Slot Visualization */}
                        <div className="flex-1 w-full space-y-4">
                            <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase font-bold px-2">
                                <span>Slot 0</span>
                                <span>16383</span>
                            </div>
                            <div className="h-12 w-full bg-muted/30 rounded-full flex overflow-hidden border-2 border-border shadow-inner relative">
                                {nodes.map((node, i) => (
                                    <div
                                        key={node.id}
                                        className={cn(
                                            "h-full flex items-center justify-center text-[10px] font-bold border-r border-border last:border-0 transition-all",
                                            i === 0 ? "bg-blue-500/10 text-blue-500" :
                                                i === 1 ? "bg-purple-500/10 text-purple-500" :
                                                    "bg-amber-500/10 text-amber-500",
                                            targetNode?.id === node.id ? "opacity-100 ring-2 ring-inset ring-redis/50" : "opacity-50"
                                        )}
                                        style={{ width: `${(node.slots[1] - node.slots[0]) / 163.83}%` }}
                                    >
                                        {node.id}
                                    </div>
                                ))}
                                {/* Active Slot Pointer */}
                                <motion.div
                                    className="absolute top-0 bottom-0 w-1 bg-redis z-20 shadow-[0_0_10px_rgba(216,44,32,1)]"
                                    initial={{ left: 0 }}
                                    animate={{ left: `${(currentSlot / 16384) * 100}%` }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                />
                            </div>
                            <div className="text-center">
                                <Badge variant="outline" className="font-mono text-redis border-redis/30 px-4 py-1">
                                    Slot Hash: {currentSlot}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {nodes.map((node) => (
                            <motion.div
                                key={node.id}
                                animate={activeNodeId === node.id ? { scale: [1, 1.05, 1], y: [0, -5, 0] } : {}}
                                className={cn(
                                    "p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3",
                                    activeNodeId === node.id ? "border-redis bg-redis/5 shadow-2xl" : "border-border hover:border-redis/20"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                                    node.id === 'Node-1' ? "bg-blue-500" : node.id === 'Node-2' ? "bg-purple-500" : "bg-amber-500"
                                )}>
                                    <Server className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{node.id}</h4>
                                    <p className="text-[10px] text-muted-foreground font-mono">{node.ip}</p>
                                </div>
                                <div className="w-full h-px bg-border my-2" />
                                <div className="space-y-1">
                                    <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-widest">Slots Assigned</p>
                                    <p className="text-xs font-mono">{node.slots[0]} - {node.slots[1]}</p>
                                </div>
                                {activeNodeId === node.id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute -top-3 -right-3"
                                    >
                                        <div className="bg-redis text-white p-2 rounded-full shadow-lg">
                                            <Cpu className="w-4 h-4" />
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClusterSimulator;
