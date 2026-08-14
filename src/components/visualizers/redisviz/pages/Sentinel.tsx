'use client';

import DiagramCanvas, { DiagramNode, DiagramEdge } from '@/components/visualizers/redisviz/components/visualizers/DiagramCanvas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield, Search, RefreshCw, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const Sentinel = () => {
    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    High Availability <span className="text-redis">Sentinel</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    How do you ensure Redis stays up if the Master server dies? Redis Sentinel provides monitoring, notification, and automatic failover.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-0 overflow-hidden border-2 shadow-2xl">
                        <CardHeader className="p-6 pb-0">
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-500" />
                                Sentinel Quorum & Monitoring
                            </CardTitle>
                            <CardDescription>Sentinels watch the Master and agree on when to trigger a failover.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <DiagramCanvas title="Sentinel Cluster View" height={400}>
                                {/* Sentinels */}
                                <DiagramNode x={100} y={50} width={150} height={60} label="Sentinel 1" icon={<Shield className="w-4 h-4" />} color="bg-blue-500" delay={0.1} />
                                <DiagramNode x={325} y={50} width={150} height={60} label="Sentinel 2" icon={<Shield className="w-4 h-4" />} color="bg-blue-500" delay={0.2} />
                                <DiagramNode x={550} y={50} width={150} height={60} label="Sentinel 3" icon={<Shield className="w-4 h-4" />} color="bg-blue-500" delay={0.3} />

                                {/* Master */}
                                <DiagramNode x={325} y={250} width={150} height={80} label="MASTER (Node A)" icon={<Search className="w-4 h-4" />} color="bg-redis" delay={0.5} />

                                {/* Edges */}
                                <DiagramEdge fromX={175} fromY={110} toX={325} toY={250} label="Heartbeat" animated={true} delay={1} />
                                <DiagramEdge fromX={400} fromY={110} toX={400} toY={250} label="Heartbeat" animated={true} delay={1.2} />
                                <DiagramEdge fromX={625} fromY={110} toX={475} toY={250} label="Heartbeat" animated={true} delay={1.4} />

                                {/* Quorum Info */}
                                <rect x={10} y={350} width={780} height={40} rx={8} className="fill-blue-500/5 stroke-blue-500/20" />
                                <text x={400} y={375} textAnchor="middle" className="text-xs font-bold fill-blue-600">QUORUM = 2 (At least 2 Sentinels must agree the Master is down)</text>
                            </DiagramCanvas>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Search className="w-5 h-5 text-amber-500" />
                                    Monitoring
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground leading-relaxed">
                                Sentinels constantly check if your master and replica instances are working as expected. If an instance doesn't respond to PING within a timeout, it's marked as <strong>Subjectively Down (SDOWN)</strong>.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5 text-green-500" />
                                    Failover
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground leading-relaxed">
                                If enough Sentinels agree the master is down (<strong>Objectively Down - ODOWN</strong>), one sentinel is elected as leader to promote a replica to be the new master.
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="bg-muted/30 border-none h-full">
                        <CardHeader>
                            <CardTitle className="text-xl">The Failover Steps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { step: 1, title: "Detection", desc: "Master stops responding to PINGs.", icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
                                { step: 2, title: "Agreement", desc: "Quorum of Sentinels confirm the failure.", icon: <CheckCircle className="w-4 h-4 text-blue-500" /> },
                                { step: 3, title: "Election", desc: "Sentinels vote for a 'Leader' to handle failover.", icon: <RefreshCw className="w-4 h-4 text-purple-500" /> },
                                { step: 4, title: "Promotion", desc: "Best Replica is promoted to Master.", icon: <Zap className="w-4 h-4 text-redis" /> },
                                { step: 5, title: "Reconfiguration", desc: "Other replicas are told to follow new Master.", icon: <Shield className="w-4 h-4 text-green-500" /> }
                            ].map((s) => (
                                <div key={s.step} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background border flex items-center justify-center font-bold text-xs shadow-sm">
                                        {s.step}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm flex items-center gap-2">
                                            {s.icon} {s.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Sentinel;
