'use client';

import ClusterSimulator from '@/components/visualizers/redisviz/components/visualizers/ClusterSimulator';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, RefreshCw, ArrowRight } from 'lucide-react';

const Cluster = () => {
    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    Multi-Node <span className="text-redis">Cluster</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    Scale your data horizontally across hundreds of machine. Redis Cluster provides distributed storage with high availability and automatic sharding.
                </p>
            </section>

            <section>
                <ClusterSimulator />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-redis" />
                            Gossip Protocol
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                        <p>
                            Redis Cluster doesn't use a central proxy or coordinator. Every node knows about every other node and communicates using a <span className="font-bold text-foreground underline decoration-redis/30">Binary Protocol</span>.
                        </p>
                        <p>
                            Nodes "gossip" with each other to share health status and slot ownership info. This makes the cluster decentralized and extremely resilient.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-redis" />
                            Resharding & Migration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                        <p>
                            Adding a new node to the cluster? You don't need to restart. Redis can migrate "slots" from existing nodes to the new node while the cluster is online.
                        </p>
                        <p>
                            During migration, if a key is missing on the target node, the source node is queried. This process is called <strong>ASK redirection</strong>.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h3 className="text-2xl font-bold">The Math Behind Sharding</h3>
                <Card className="bg-muted/40 border-2">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
                            <div className="text-center p-6 bg-background border rounded-2xl shadow-sm w-full md:w-auto">
                                <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Algorithm</div>
                                <div className="text-3xl font-mono font-extrabold text-redis">CRC16(key) % 16384</div>
                            </div>
                            <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
                            <div className="text-center p-6 bg-background border rounded-2xl shadow-sm w-full md:w-auto">
                                <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Hash Slot</div>
                                <div className="text-3xl font-mono font-extrabold text-blue-500">0 - 16383</div>
                            </div>
                            <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
                            <div className="text-center p-6 bg-background border rounded-2xl shadow-sm w-full md:w-auto">
                                <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Mapped To</div>
                                <div className="text-3xl font-mono font-extrabold text-green-500">Physical Node</div>
                            </div>
                        </div>
                        <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <p className="text-sm text-amber-700 dark:text-amber-400 text-center font-medium">
                                <strong>Wait!</strong> What if I want to keep related keys on the same node?
                                <br />
                                Use <span className="underline italic">Hash Tags</span>: `{ }`.
                                <br />
                                `user:{101}:name` and `user:{101}:profile` will always land in the same slot.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Cluster;
