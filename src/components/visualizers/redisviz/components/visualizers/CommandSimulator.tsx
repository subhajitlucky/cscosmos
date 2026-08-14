'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Terminal, Database, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import KeyValueInspector from './KeyValueInspector';

const CommandSimulator = () => {
    const [command, setCommand] = useState("SET user:1 'Antigravity'");
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [store, setStore] = useState<Record<string, string | number | (string | number)[] | Record<string, string | number>>>({
        "app:name": "RedisVisualizer",
        "counter": 10
    });
    const [logs, setLogs] = useState<string[]>([]);

    const steps = [
        { title: "Network Receive", description: "Redis receives the raw command over a TCP socket." },
        { title: "Command Parsing", description: "The RESP (Redis Serialization Protocol) parser extracts the command and arguments." },
        { title: "Execution Plan", description: "Redis finds the command implementation and validates arguments." },
        { title: "Atomic Execution", description: "The command is executed in the single-threaded engine." },
        { title: "Response Write", description: "The result is sent back to the client." }
    ];

    const executeCommand = useCallback(() => {
        const parts = command.split(' ');
        const cmd = parts[0].toUpperCase();
        const key = parts[1];
        const val = parts.slice(2).join(' ').replace(/'/g, "");

        let result = "OK";
        setStore(prev => {
            const next = { ...prev };
            if (cmd === "SET") {
                next[key] = val;
            } else if (cmd === "GET") {
                result = String(prev[key] || "(nil)");
            } else if (cmd === "DEL") {
                delete next[key];
                result = prev[key] ? "(integer) 1" : "(integer) 0";
            } else if (cmd === "INCR") {
                const currentValue = prev[key];
                const current = parseInt(String(currentValue || "0"));
                next[key] = current + 1;
                result = `(integer) ${next[key]}`;
            }
            return next;
        });

        setLogs(prev => [...prev, `${cmd} ${key || ""} → ${result}`]);
    }, [command]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (isPlaying && step < steps.length) {
            timer = setTimeout(() => {
                setStep(prev => prev + 1);
                if (step === 3) {
                    executeCommand();
                }
            }, 1500);
        } else if (step === steps.length && isPlaying) {
            // Use a short timeout to avoid direct setState in effect body warning
            timer = setTimeout(() => setIsPlaying(false), 0);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isPlaying, step, executeCommand, steps.length]);

    const reset = () => {
        setStep(0);
        setIsPlaying(false);
    };

    const start = () => {
        if (step === steps.length) setStep(0);
        setIsPlaying(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2 shadow-xl bg-slate-950 text-slate-100 overflow-hidden">
                <CardHeader className="border-b border-slate-800 bg-slate-900/50">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono text-redis">
                        <Terminal className="w-4 h-4" />
                        Command Processor
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Input Command</label>
                        <div className="flex gap-2">
                            <input
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-redis"
                                disabled={isPlaying}
                            />
                            <Button size="sm" onClick={start} disabled={isPlaying} className="bg-redis hover:bg-redis-dark">
                                <Play className="w-4 h-4 mr-1" /> Run
                            </Button>
                            <Button size="sm" variant="outline" onClick={reset} className="border-slate-800 text-slate-400 hover:text-white">
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex gap-1 mt-2">
                            {["SET k v", "GET k", "INCR c", "DEL k"].map(suggestion => (
                                <button
                                    key={suggestion}
                                    onClick={() => setCommand(suggestion)}
                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {steps.map((s, idx) => (
                            <motion.div
                                key={idx}
                                className={cn(
                                    "flex items-start gap-4 p-3 rounded-lg border transition-all",
                                    step === idx ? "bg-redis/20 border-redis shadow-[0_0_15px_rgba(216,44,32,0.2)]" : "bg-slate-900/50 border-slate-800 opacity-50"
                                )}
                                animate={step === idx ? { x: 10 } : { x: 0 }}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                    step === idx ? "bg-redis text-white" : "bg-slate-800 text-slate-500"
                                )}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold">{s.title}</h4>
                                    <p className="text-[10px] text-slate-400 mt-1">{s.description}</p>
                                </div>
                                {step === idx && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}><ChevronRight className="w-4 h-4 text-redis" /></motion.div>}
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-redis" />
                    <h3 className="font-bold uppercase tracking-tight text-sm">Real-time Memory Map</h3>
                </div>

                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
                    <AnimatePresence>
                        {Object.entries(store).map(([k, v]) => (
                            <motion.div
                                key={k}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <KeyValueInspector
                                    redisKey={k}
                                    type={typeof v === 'number' ? 'string' : 'string'}
                                    encoding={typeof v === 'number' ? 'int' : 'embstr'}
                                    value={v as string | number | string[] | number[] | Record<string, string | number>}
                                    className="border-border/30"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <Card className="bg-muted/30 border-dashed">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs uppercase text-muted-foreground tracking-widest">Execution Logs</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 px-4 pb-4">
                        <div className="font-mono text-[11px] space-y-1">
                            {logs.length === 0 ? (
                                <p className="text-muted-foreground italic">No commands executed yet...</p>
                            ) : (
                                logs.slice(-5).map((log, i) => (
                                    <div key={i} className="flex gap-2 text-muted-foreground border-b border-border/20 py-1 last:border-0">
                                        <span className="text-green-500">$</span> {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CommandSimulator;
