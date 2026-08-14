'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Server, Zap, WifiOff, Wifi } from 'lucide-react';
import { cn } from "@/lib/utils";

const ReplicationSimulator = () => {
    const [masterData, setMasterData] = useState<string[]>(['k1:v1', 'k2:v2']);
    const [replicas, setReplicas] = useState([
        { id: 1, data: ['k1:v1', 'k2:v2'], status: 'connected', lag: 0 },
        { id: 2, data: ['k1:v1', 'k2:v2'], status: 'connected', lag: 0 }
    ]);
    const [isPropagating, setIsPropagating] = useState(false);

    const writeToMaster = () => {
        const newKey = `k${masterData.length + 1}:v${masterData.length + 1}`;
        setMasterData(prev => [...prev, newKey]);
        setIsPropagating(true);

        // Propagate with lag
        replicas.forEach(replica => {
            if (replica.status === 'connected') {
                setTimeout(() => {
                    setReplicas(prev => prev.map(r => r.id === replica.id ? { ...r, data: [...r.data, newKey] } : r));
                }, Math.random() * 1000 + 500);
            }
        });

        setTimeout(() => setIsPropagating(false), 1500);
    };

    const toggleReplica = (id: number) => {
        setReplicas(prev => prev.map(r =>
            r.id === id ? { ...r, status: r.status === 'connected' ? 'disconnected' : 'syncing' } : r
        ));

        // Handle re-sync
        const replica = replicas.find(r => r.id === id);
        if (replica?.status === 'disconnected') {
            setTimeout(() => {
                setReplicas(prev => prev.map(r => r.id === id ? { ...r, status: 'connected', data: [...masterData] } : r));
            }, 2000);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative min-h-[300px]">
                {/* Master Node */}
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        className="w-32 h-32 rounded-2xl bg-redis flex flex-col items-center justify-center text-white shadow-[0_20px_50px_rgba(216,44,32,0.3)] border-4 border-white dark:border-slate-800"
                        animate={isPropagating ? { scale: [1, 1.05, 1] } : {}}
                    >
                        <Database className="w-10 h-10 mb-2" />
                        <span className="font-bold text-sm">MASTER</span>
                        <Badge variant="outline" className="text-[8px] bg-white/20 text-white border-none mt-1">Writable</Badge>
                    </motion.div>
                    <div className="bg-muted p-2 rounded-lg border border-border w-full max-h-[100px] overflow-auto">
                        <div className="text-[10px] font-mono space-y-1">
                            {masterData.map(d => <div key={d} className="text-redis truncate">{d}</div>)}
                        </div>
                    </div>
                    <Button size="sm" onClick={writeToMaster} variant="outline" className="w-full border-redis text-redis hover:bg-redis/10">
                        <Zap className="w-3 h-3 mr-1" /> Write Data
                    </Button>
                </div>

                {/* Replica Nodes Column */}
                <div className="flex flex-col gap-12">
                    {replicas.map((replica) => (
                        <div key={replica.id} className="flex items-center gap-8 relative">
                            {/* Connector Path */}
                            <div className="absolute -left-12 top-1/2 w-12 h-1 bg-border/50 -translate-y-1/2">
                                {replica.status === 'connected' && isPropagating && (
                                    <motion.div
                                        className="h-full bg-redis shadow-[0_0_10px_rgba(216,44,32,0.8)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                    />
                                )}
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <motion.div
                                    className={cn(
                                        "w-24 h-24 rounded-2xl flex flex-col items-center justify-center text-white transition-all border-2",
                                        replica.status === 'connected' ? "bg-slate-800 border-green-500/50" :
                                            replica.status === 'syncing' ? "bg-slate-800 border-amber-500 animate-pulse" :
                                                "bg-slate-800 border-red-500 grayscale"
                                    )}
                                >
                                    <Server className="w-8 h-8 mb-1" />
                                    <span className="font-bold text-[10px]">REPLICA {replica.id}</span>
                                    <Badge variant="outline" className="text-[8px] bg-white/10 text-white border-none mt-1">Read-Only</Badge>
                                </motion.div>

                                <div className="flex gap-2 w-full">
                                    <Badge className={cn(
                                        "w-full text-[8px] justify-center",
                                        replica.status === 'connected' ? "bg-green-600/20 text-green-500" :
                                            replica.status === 'syncing' ? "bg-amber-600/20 text-amber-500" :
                                                "bg-red-600/20 text-red-500"
                                    )}>
                                        {replica.status.toUpperCase()}
                                    </Badge>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-5 w-5 rounded-full"
                                        onClick={() => toggleReplica(replica.id)}
                                    >
                                        {replica.status === 'connected' ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                                    </Button>
                                </div>

                                <div className="bg-muted p-1 rounded border border-border w-full text-[8px] font-mono max-h-[60px] overflow-auto">
                                    {replica.data.slice(-3).map(d => <div key={d} className="text-green-600 dark:text-green-400">{d}</div>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-muted/30 border-none">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm">Full Resync</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground leading-relaxed">
                        Occurs when a new replica joins or when a replica has been offline for too long. Master sends an entire RDB file.
                    </CardContent>
                </Card>
                <Card className="bg-muted/30 border-none">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm">Partial Resync (PSYNC)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground leading-relaxed">
                        Modern Redis allows replicas to "catch up" by only receiving the missing commands from the backlog buffer.
                    </CardContent>
                </Card>
                <Card className="bg-muted/30 border-none">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm">Replication ID</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground leading-relaxed">
                        A random string used by replicas to verify they are talking to the same Master after a reconnection.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReplicationSimulator;
