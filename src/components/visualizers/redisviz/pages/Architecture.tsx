'use client';

import { motion } from 'framer-motion';
import DiagramCanvas, { DiagramNode, DiagramEdge } from '@/components/visualizers/redisviz/components/visualizers/DiagramCanvas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Zap, Cpu, ArrowRight, Globe, List } from 'lucide-react';

const Architecture = () => {
    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    Redis <span className="text-redis">Architecture</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    The secret to Redis's incredible speed lies in its simple yet powerful architecture. It's essentially a single-threaded event loop that handles thousands of requests per second.
                </p>
            </section>

            <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-0 overflow-hidden border border-border shadow-2xl bg-card/50 backdrop-blur-md">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <div className="p-2 rounded-lg bg-redis/10 text-redis">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                The Event Loop Visualized
                            </CardTitle>
                            <CardDescription className="text-lg">
                                How Redis processes requests from multiple clients using a single thread.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="rounded-2xl border border-border/40 bg-slate-950/40 p-1">
                                <DiagramCanvas title="Redis Internal Flow" height={450}>
                                    {/* Clients */}
                                    <DiagramNode x={50} y={50} width={150} height={60} label="Client A" icon={<Globe className="w-4 h-4" />} color="bg-blue-500" delay={0.1} />
                                    <DiagramNode x={50} y={150} width={150} height={60} label="Client B" icon={<Globe className="w-4 h-4" />} color="bg-blue-500" delay={0.2} />
                                    <DiagramNode x={50} y={250} width={150} height={60} label="Client C" icon={<Globe className="w-4 h-4" />} color="bg-blue-500" delay={0.3} />

                                    {/* Edges from Clients to Multiplexer */}
                                    <DiagramEdge fromX={200} fromY={80} toX={300} toY={180} animated={true} delay={1} />
                                    <DiagramEdge fromX={200} fromY={180} toX={300} toY={180} animated={true} delay={1.2} />
                                    <DiagramEdge fromX={200} fromY={280} toX={300} toY={180} animated={true} delay={1.4} />

                                    {/* Multiplexer */}
                                    <DiagramNode x={300} y={150} width={180} height={60} label="I/O Multiplexing" icon={<List className="w-4 h-4" />} color="bg-purple-500" delay={0.5} />
                                    <DiagramEdge fromX={480} fromY={180} toX={550} toY={180} label="Command Queue" delay={2} />

                                    {/* Execution Engine */}
                                    <DiagramNode x={550} y={100} width={200} height={160} label="Single Threaded Engine" icon={<Zap className="w-4 h-4" />} color="bg-redis" delay={0.8} />

                                    {/* Internal components of Engine */}
                                    <rect x={570} y={140} width={160} height={40} rx={8} className="fill-white/5 stroke-white/10 stroke-1" />
                                    <text x={585} y={165} className="text-[10px] font-mono fill-white opacity-80 uppercase tracking-tighter">Atomic Execution</text>

                                    <rect x={570} y={190} width={160} height={40} rx={8} className="fill-white/5 stroke-white/10 stroke-1" />
                                    <text x={585} y={215} className="text-[10px] font-mono fill-white opacity-80 uppercase tracking-tighter">In-Memory Store</text>
                                </DiagramCanvas>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
                            <Card className="hover:border-redis/40 transition-all bg-card/40 backdrop-blur-sm group h-full">
                                <CardHeader>
                                    <CardTitle className="text-xl group-hover:text-redis transition-colors">Event Loop</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground text-base leading-relaxed">
                                    Redis uses its own event library called <code className="text-redis font-bold">ae</code>. It's an efficient wrapper around epoll, kqueue, or select depending on the OS.
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
                            <Card className="hover:border-redis/40 transition-all bg-card/40 backdrop-blur-sm group h-full">
                                <CardHeader>
                                    <CardTitle className="text-xl group-hover:text-redis transition-colors">Multiplexing</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground text-base leading-relaxed">
                                    Instead of blocking on a single client, Redis watches thousands of sockets simultaneously and only processes those that have new data available.
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="bg-redis/5 border-redis/10 shadow-xl shadow-redis/5 h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-redis/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Why Single Threaded?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            {[
                                { title: "No Context Switching", desc: "Avoids the overhead of switching between multiple CPU threads." },
                                { title: "No Locks", desc: "Since only one thread modifies data, there's no need for expensive locking mechanisms like mutexes." },
                                { title: "Memory Bound", desc: "Redis performance is usually limited by memory bandwidth, not CPU. A single fast thread is often enough." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border/40"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                >
                                    <div className="mt-1 flex-shrink-0 bg-redis text-white p-1 rounded-lg">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="pt-6 mt-6 border-t border-border/40">
                                <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                                    <span className="font-bold text-redis not-italic mr-1">Pro Tip:</span>
                                    Since Redis 6.0, I/O threads can handle networking in parallel, but command execution remains atomic and single-threaded.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};

export default Architecture;
