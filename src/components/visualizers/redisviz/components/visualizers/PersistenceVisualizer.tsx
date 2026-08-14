'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, FileCode, RotateCcw, Zap, ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

const PersistenceVisualizer = () => {
    const [mode, setMode] = useState<'rdb' | 'aof'>('rdb');
    const [snapshots, setSnapshots] = useState<number[]>([]);
    const [aofLogs, setAofLogs] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;
        if (isRecording) {
            timer = setInterval(() => {
                if (mode === 'aof') {
                    const commands = ['SET x 1', 'INCR counter', 'DEL temp', 'SADD tags web'];
                    setAofLogs(prev => [...prev, commands[Math.floor(Math.random() * commands.length)]].slice(-10));
                }
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRecording, mode]);

    const takeSnapshot = () => {
        setSnapshots(prev => [...prev, Date.now()]);
    };

    const reset = () => {
        setSnapshots([]);
        setAofLogs([]);
        setIsRecording(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-center gap-4">
                <Button
                    variant={mode === 'rdb' ? 'default' : 'outline'}
                    onClick={() => setMode('rdb')}
                    className={mode === 'rdb' ? 'bg-redis' : ''}
                >
                    RDB (Snapshotting)
                </Button>
                <Button
                    variant={mode === 'aof' ? 'default' : 'outline'}
                    onClick={() => setMode('aof')}
                    className={mode === 'aof' ? 'bg-redis' : ''}
                >
                    AOF (Logging)
                </Button>
            </div>

            <Card className="border-2 border-border/50 shadow-xl min-h-[400px]">
                <CardHeader className="bg-muted/30">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {mode === 'rdb' ? <Save className="w-5 h-5 text-blue-500" /> : <FileCode className="w-5 h-5 text-amber-500" />}
                            {mode === 'rdb' ? "RDB Snapshot Timeline" : "AOF Live Stream"}
                        </CardTitle>
                        <div className="flex gap-2">
                            {mode === 'rdb' ? (
                                <Button size="sm" onClick={takeSnapshot} className="bg-blue-600 hover:bg-blue-700">
                                    <Zap className="w-4 h-4 mr-1" /> Snapshot Now
                                </Button>
                            ) : (
                                <Button size="sm" onClick={() => setIsRecording(!isRecording)} className={isRecording ? "bg-redis" : "bg-green-600"}>
                                    {isRecording ? "Stop Logging" : "Start Logging"}
                                </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={reset}>
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {mode === 'rdb' ? (
                        <div className="relative h-40 flex items-center bg-muted/20 rounded-xl px-12">
                            {/* Timeline line */}
                            <div className="absolute left-10 right-10 h-1 bg-border/50 rounded-full" />

                            <AnimatePresence>
                                {snapshots.map((timestamp, i) => (
                                    <motion.div
                                        key={timestamp}
                                        initial={{ opacity: 0, scale: 0, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="absolute z-10 flex flex-col items-center gap-2"
                                        style={{ left: `${(i + 1) * 20}%` }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-mono font-bold text-muted-foreground">dump.rdb</span>
                                        <span className="text-[8px] opacity-40">{new Date(timestamp).toLocaleTimeString()}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {snapshots.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground italic text-sm">
                                    Click 'Snapshot Now' to trigger a background save (BGSAVE)
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-slate-950 rounded-xl p-6 font-mono text-sm border-2 border-slate-800 shadow-inner min-h-[250px] relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 flex items-center px-4 justify-between border-b border-slate-800">
                                    <span className="text-[10px] uppercase text-slate-500 font-bold">appendonly.aof</span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                                    </div>
                                </div>
                                <div className="pt-6 space-y-1">
                                    <AnimatePresence mode="popLayout">
                                        {aofLogs.map((log, i) => (
                                            <motion.div
                                                key={i + log}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-amber-500/80"
                                            >
                                                <span className="text-slate-600 font-bold mr-2">{i + 1}</span>
                                                {log}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {aofLogs.length === 0 && !isRecording && (
                                        <div className="text-slate-600 italic py-10 text-center">
                                            Append Only File is empty. Start logging to see writes in real-time.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 h-40">
                        <div className={cn("p-4 rounded-xl border-2 transition-all", mode === 'rdb' ? "border-blue-500 bg-blue-500/5 shadow-lg" : "border-border opacity-50")}>
                            <h4 className="font-bold flex items-center gap-2 mb-2">
                                <Save className="w-4 h-4 text-blue-500" /> RDB Characteristics
                            </h4>
                            <ul className="text-xs space-y-1 text-muted-foreground">
                                <li>• Periodic point-in-time snapshots</li>
                                <li>• Extremely compact (binary format)</li>
                                <li>• Faster restarts for large datasets</li>
                                <li>• Potential data loss between snapshots</li>
                            </ul>
                        </div>
                        <div className={cn("p-4 rounded-xl border-2 transition-all", mode === 'aof' ? "border-amber-500 bg-amber-500/5 shadow-lg" : "border-border opacity-50")}>
                            <h4 className="font-bold flex items-center gap-2 mb-2">
                                <FileCode className="w-4 h-4 text-amber-500" /> AOF Characteristics
                            </h4>
                            <ul className="text-xs space-y-1 text-muted-foreground">
                                <li>• Append-only log of every write</li>
                                <li>• Much more durable (configurable fsync)</li>
                                <li>• File can grow large (needs Rewrite)</li>
                                <li>• Slower to load but more granular</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PersistenceVisualizer;
