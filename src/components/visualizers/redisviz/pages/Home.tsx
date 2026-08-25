'use client';

'use client';

import { motion } from 'framer-motion';
import { Database, Zap, Cpu, Server, Layers, ArrowRight, Rocket, Terminal, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Home = () => {
    const roadmapSteps = [
        {
            stage: "Level 1",
            title: "The Basics",
            items: [
                {
                    title: "Data Structures",
                    description: "Learn how Redis stores data in-memory using Strings, Hashes, and Lists.",
                    icon: <Database className="w-6 h-6" />,
                    path: "/redisviz/data-structures",
                    color: "bg-blue-500/10 text-blue-500",
                },
                {
                    title: "Architecture",
                    description: "Understand the Event Loop and Single-Threaded nature of Redis.",
                    icon: <Cpu className="w-6 h-6" />,
                    path: "/redisviz/architecture",
                    color: "bg-purple-500/10 text-purple-500",
                }
            ]
        },
        {
            stage: "Level 2",
            title: "Simulations",
            items: [
                {
                    title: "Command Execution",
                    description: "Step through how a single command is parsed and executed.",
                    icon: <Terminal className="w-6 h-6" />,
                    path: "/redisviz/execution",
                    color: "bg-amber-500/10 text-amber-500",
                },
                {
                    title: "Memory Internals",
                    description: "Fragmentation, Allocation, and Eviction policies in action.",
                    icon: <Layers className="w-6 h-6" />,
                    path: "/redisviz/memory",
                    color: "bg-green-500/10 text-green-500",
                }
            ]
        },
        {
            stage: "Level 3",
            title: "Advanced Concepts",
            items: [
                {
                    title: "Persistence",
                    description: "Snapshots (RDB) vs Logs (AOF). Ensuring data durability.",
                    icon: <Server className="w-6 h-6" />,
                    path: "/redisviz/persistence",
                    color: "bg-orange-500/10 text-orange-500",
                },
                {
                    title: "Scaling & Replication",
                    description: "Sentinels, Clusters, and High Availability setups.",
                    icon: <Zap className="w-6 h-6" />,
                    path: "/redisviz/replication",
                    color: "bg-rose-500/10 text-rose-500",
                }
            ]
        }
    ];

    return (
        <div className="space-y-32 pb-20 max-w-7xl mx-auto px-6 md:px-8">
            {/* Hero Section */}
            <section className="relative text-center space-y-10 max-w-4xl mx-auto pt-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-sm font-medium">
                        <Rocket className="w-4 h-4" />
                        Interactive Redis Learning Engine
                    </div>
                    <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                        Visual Guide to <br />
                        <span className="text-redis">Redis Internals</span>
                    </h1>
                </motion.div>

                <motion.p
                    className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Master Redis concepts through interactive simulations, architectural maps, and deep-dives into internal data structures. Perfect for CS graduates and system engineers.
                </motion.p>

                <motion.div
                    className="flex flex-wrap justify-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 h-14 text-lg">
                        <Link href="/redisviz/data-structures">
                            Start Journey <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-xl px-8 h-14 text-lg">
                        <Link href="/redisviz/architecture">Quick Overview</Link>
                    </Button>
                </motion.div>
            </section>

            {/* Learning Roadmap */}
            <section className="space-y-12">
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
                        <GraduationCap className="text-rose-600 dark:text-rose-400 w-10 h-10" />
                        Learning Roadmap
                    </h2>
                    <p className="text-muted-foreground text-lg">Follow this sequential path to master Redis from zero to expert.</p>
                </div>

                <div className="space-y-24 relative">
                    {/* Road Connector Line (Visible on md+) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border/40 -translate-x-1/2 hidden md:block" />

                    {roadmapSteps.map((group) => (
                        <div key={group.stage} className="space-y-12 relative">
                            <div className="flex justify-center mb-8 relative z-10">
                                <Badge className="bg-muted text-foreground border-border px-6 py-1.5 text-lg rounded-full">
                                    {group.stage}: {group.title}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative z-10">
                                {group.items.map((item, iIdx) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link href={item.path}>
                                            <Card className="group relative h-full hover:shadow-2xl hover:shadow-rose-500/5 border-border/40 hover:border-rose-500/40 transition-all duration-300 overflow-hidden bg-white/5 backdrop-blur-sm">
                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                                                    {item.icon}
                                                </div>
                                                <CardHeader className="p-8">
                                                    <div className={`p-4 rounded-2xl w-fit mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                                        {item.icon}
                                                    </div>
                                                    <CardTitle className="text-3xl mb-4 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                                        {item.title}
                                                    </CardTitle>
                                                    <CardDescription className="text-lg leading-relaxed">
                                                        {item.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-redis/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-12 md:p-20 text-center space-y-8">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(216,44,32,0.15),transparent)] pointer-events-none" />
                <h2 className="text-4xl md:text-5xl font-bold relative z-10">Ready to dive deeper?</h2>
                <p className="text-slate-400 text-xl max-w-2xl mx-auto relative z-10">
                    Explore real-world use cases or jump straight into our interactive command simulator.
                </p>
                <div className="flex flex-wrap justify-center gap-4 relative z-10 pt-4">
                    <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-10">
                        <Link href="/redisviz/use-cases">Use Cases</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="rounded-xl px-10">
                        <Link href="/redisviz/execution">Interactive CLI</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
