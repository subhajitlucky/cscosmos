'use client';

import CommandSimulator from '@/components/visualizers/redisviz/components/visualizers/CommandSimulator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Zap, Clock, Shield, Terminal } from 'lucide-react';

const CommandExecution = () => {
    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    Command <span className="text-redis">Execution</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    How does Redis handle a command from the moment it leaves your client to the moment a response is returned? Explore the atomic execution model and the command lifecycle.
                </p>
            </section>

            <section>
                <CommandSimulator />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0">
                        <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-2">
                            <Shield className="w-5 h-5 text-blue-500" />
                        </div>
                        <CardTitle>Atomicity</CardTitle>
                        <CardDescription className="text-sm">
                            Commands in Redis are atomic. Once a command starts, no other command can run until it finishes. This guarantees data consistency without locks.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0">
                        <div className="bg-amber-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                        </div>
                        <CardTitle>Fast Path</CardTitle>
                        <CardDescription className="text-sm">
                            Most Redis commands prioritize O(1) or O(log N) time complexity. This ensures the single thread isn't blocked for long periods.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0">
                        <div className="bg-green-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-2">
                            <Clock className="w-5 h-5 text-green-500" />
                        </div>
                        <CardTitle>Latency Sources</CardTitle>
                        <CardDescription className="text-sm">
                            High latency usually comes from networking, slow commands (like KEYS *), or disk I/O when persistence is enabled.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <Card className="bg-muted/50 border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Terminal className="w-5 h-5" />
                        The RESP Protocol
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed">
                    <p>
                        Redis uses a simple request-response protocol called <span className="font-bold text-redis">RESP</span>. It's human-readable and easy to parse.
                    </p>
                    <div className="bg-black text-green-500 p-4 rounded-md font-mono text-xs overflow-x-auto">
                        <div>*3</div>
                        <div className="text-slate-500"># Array of 3 elements</div>
                        <div>$3</div>
                        <div className="text-slate-500"># String of 3 bytes</div>
                        <div>SET</div>
                        <div>$4</div>
                        <div>user</div>
                        <div>$10</div>
                        <div>Antigravity</div>
                    </div>
                    <p className="text-muted-foreground italic">
                        This format allows Redis to know exactly how many bytes to read from the network before starting to parse, making it extremely efficient.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default CommandExecution;
