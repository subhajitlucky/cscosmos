'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import PersistenceVisualizer from '@/components/visualizers/redisviz/components/visualizers/PersistenceVisualizer';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, RefreshCw } from 'lucide-react';

const Persistence = () => {
    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    Durability & <span className="text-redis">Persistence</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    Redis is in-memory, but it's not ephemeral. Discover how Redis ensures data survives crashes through RDB snapshots and AOF logs.
                </p>
            </section>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <PersistenceVisualizer />
            </motion.section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
                    <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:border-redis/40 transition-all group h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl group-hover:text-redis transition-colors">
                                <div className="p-2 rounded-lg bg-redis/10 text-redis">
                                    <RefreshCw className="w-5 h-5" />
                                </div>
                                AOF Rewrite (BGREWRITEAOF)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-base leading-relaxed">
                            <p className="text-muted-foreground">
                                As more writes occur, the AOF file grows. Redis solves this by "rewriting" the AOF in the background to its minimal representation.
                            </p>
                            <div className="bg-slate-950 p-6 rounded-2xl border border-border/40 font-mono shadow-inner">
                                <div className="space-y-1">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2"># Original Log</p>
                                    <p className="text-redis/80">SET x 1</p>
                                    <p className="text-redis/80">SET x 2</p>
                                    <p className="text-redis">SET x 3</p>
                                </div>
                                <div className="my-4 border-t border-slate-800" />
                                <div className="space-y-1">
                                    <p className="text-green-500/50 text-[10px] uppercase font-bold tracking-widest mb-2"># After Rewrite</p>
                                    <p className="text-green-400 font-bold">SET x 3</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground italic flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-redis" />
                                Reconstruction of current state, not log modification.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
                    <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:border-blue-500/40 transition-all group h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl group-hover:text-blue-500 transition-colors">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                Copy-on-Write (CoW)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-base leading-relaxed">
                            <p className="text-muted-foreground">
                                Redis uses the <code className="bg-muted px-1.5 py-0.5 rounded text-blue-400 font-bold">fork()</code> system call to create a child process for non-blocking persistence.
                            </p>
                            <p className="text-muted-foreground">
                                The child process has a "copy" of the parent's memory. Memory is only actually copied if it's modified, making forks extremely efficient.
                            </p>
                            <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                                <div className="p-2 bg-blue-500 text-white rounded-lg shadow-sm">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-bold text-sm">Non-blocking Persistence</p>
                                    <p className="text-xs opacity-80">Parent continues serving clients while child saves data.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="space-y-8 pt-8">
                <div className="text-center space-y-2">
                    <h3 className="text-3xl font-bold">Choosing a Strategy</h3>
                    <p className="text-muted-foreground italic">Balance between performance and durability.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            badge: "High Performance",
                            title: "RDB Only",
                            desc: "Best for caches where occasional data loss is acceptable. Nearly zero overhead.",
                            color: "border-blue-500/20 text-blue-400 bg-blue-500/5"
                        },
                        {
                            badge: "Maximum Safety",
                            title: "AOF Only",
                            desc: "Strict durability. can be slower due to FSYNC operations on every write.",
                            color: "border-amber-500/20 text-amber-400 bg-amber-500/5"
                        },
                        {
                            badge: "Recommended",
                            title: "Hybrid (Both)",
                            desc: "Uses RDB for snapshots and AOF for incremental changes. The gold standard.",
                            color: "border-redis/20 text-redis bg-redis/5"
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                        >
                            <Card className={cn("h-full transition-all hover:scale-[1.02]", item.color)}>
                                <CardHeader className="pb-2">
                                    <Badge variant="outline" className="w-fit mb-3 border-current opacity-60 font-mono text-[10px]">{item.badge}</Badge>
                                    <CardTitle className="text-xl text-foreground">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Persistence;
