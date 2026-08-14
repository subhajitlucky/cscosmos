'use client';

import ReplicationSimulator from '@/components/visualizers/redisviz/components/visualizers/ReplicationSimulator';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, RefreshCcw, Info } from 'lucide-react';

const Replication = () => {
    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    High Scale <span className="text-redis">Replication</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    Scale your reads by distributing data across multiple replicas. Understand how Redis keeps all nodes in sync with minimal latency.
                </p>
            </section>

            <section>
                <ReplicationSimulator />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-redis">
                            <Zap className="w-5 h-5" />
                            Asynchronous Logic
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                        <p>
                            Replication in Redis is <span className="font-bold text-foreground underline decoration-redis/30">asynchronous</span> by default. The Master doesn't wait for Replicas to confirm receipt of data before responding to the client.
                        </p>
                        <div className="p-4 bg-muted rounded-lg border border-border">
                            <h4 className="font-bold text-foreground mb-1 text-xs uppercase tracking-wider">Pros & Cons</h4>
                            <ul className="space-y-1">
                                <li>✅ Low latency (Master isn't blocked)</li>
                                <li>✅ Read scaling (Handle millions of reads)</li>
                                <li>❌ Potential data loss if Master fails before propagation</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-redis">
                            <RefreshCcw className="w-5 h-5" />
                            The Replication Backlog
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                        <p>
                            Redis maintains an in-memory buffer called the <span className="font-bold text-foreground italic">Backlog</span>.
                        </p>
                        <p>
                            When a replica reconnects, it checks its offset against the Master. If the missing data is still in the backlog, a <strong>Partial Resync</strong> occurs. If not, a heavy <strong>Full Resync</strong> is required.
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 font-bold text-xs">
                            <Info className="w-4 h-4" />
                            Tip: Increase `repl-backlog-size` for unstable networks.
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h3 className="text-2xl font-bold">Replication Flow</h3>
                <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border/50 -translate-x-1/2 hidden md:block" />

                    <div className="space-y-8 relative">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-24">
                            <div className="md:w-1/2 md:text-right">
                                <h4 className="font-bold">1. Handshake</h4>
                                <p className="text-xs text-muted-foreground">Replica connects and sends PING. Master responds with PONG.</p>
                            </div>
                            <div className="z-10 w-4 h-4 rounded-full bg-redis border-4 border-white dark:border-slate-800" />
                            <div className="md:w-1/2" />
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-24">
                            <div className="md:w-1/2" />
                            <div className="z-10 w-4 h-4 rounded-full bg-redis border-4 border-white dark:border-slate-800" />
                            <div className="md:w-1/2">
                                <h4 className="font-bold">2. PSYNC Request</h4>
                                <p className="text-xs text-muted-foreground">Replica asks for data from its last known replication offset.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-24">
                            <div className="md:w-1/2 md:text-right">
                                <h4 className="font-bold">3. Data Stream</h4>
                                <p className="text-xs text-muted-foreground">Master streams all new writes to the replica in real-time.</p>
                            </div>
                            <div className="z-10 w-4 h-4 rounded-full bg-redis border-4 border-white dark:border-slate-800" />
                            <div className="md:w-1/2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Replication;
