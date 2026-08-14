'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Zap,
    MessageSquare,
    Users,
    BarChart,
    ShieldCheck,
    Gamepad2
} from 'lucide-react';

const UseCases = () => {
    const cases = [
        {
            title: "Caching",
            icon: <Zap className="w-6 h-6 text-amber-500" />,
            desc: "The most common use case. Store database results, session data, or API responses to speed up your application.",
            benefits: ["< 1ms Response Time", "TTL Support", "LRU Eviction"]
        },
        {
            title: "Rate Limiting",
            icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
            desc: "Protect your APIs from abuse. Use Redis counters and expiration to limit requests per IP or user.",
            benefits: ["Atomic Increments", "Window-based Limiting", "High Throughput"]
        },
        {
            title: "Pub/Sub Messaging",
            icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
            desc: "Implement real-time chat, notifications, or event-driven architectures using Redis Pub/Sub.",
            benefits: ["Real-time", "Low Latency", "Pattern Matching"]
        },
        {
            title: "Leaderboards",
            icon: <BarChart className="w-6 h-6 text-redis" />,
            desc: "Use Sorted Sets (ZSET) to build real-time rankings for games, social media, or e-commerce.",
            benefits: ["Auto-Sorting", "Range Queries", "Atomic Updates"]
        },
        {
            title: "Session Storage",
            icon: <Users className="w-6 h-6 text-purple-500" />,
            desc: "Share user sessions across multiple application servers for scalability.",
            benefits: ["Centralized", "Persistent Options", "Fast Lookups"]
        },
        {
            title: "Gaming",
            icon: <Gamepad2 className="w-6 h-6 text-pink-500" />,
            desc: "Store game state, player locations, and match-making queues in real-time.",
            benefits: ["Concurrency Safe", "Rich Data Types", "Scaling"]
        }
    ];

    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    Real World <span className="text-redis">Use Cases</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    From tiny startups to giants like Twitter and GitHub, Redis powers the most critical parts of the modern web.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cases.map((c) => (
                    <Card key={c.title} className="hover:border-redis/30 transition-all shadow-sm hover:shadow-xl group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {c.icon}
                            </div>
                            <CardTitle>{c.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {c.desc}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {c.benefits.map(b => (
                                    <Badge key={b} variant="secondary" className="text-[10px] font-semibold">
                                        {b}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-redis/5 border-redis/20">
                <CardContent className="p-12 text-center space-y-4">
                    <h3 className="text-2xl font-bold">Ready to implement?</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Redis is more than just a cache. It's a Swiss Army knife for distributed systems. Start exploring the architectural pages to learn how to build production-ready Redis setups.
                    </p>
                    <div className="pt-4">
                        <Badge className="bg-redis px-4 py-2 text-sm">Redis Stack Included</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UseCases;
