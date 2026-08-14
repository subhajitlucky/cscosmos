'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Timer, Gauge, Rocket } from 'lucide-react';

const Performance = () => {
    const benchmarks = [
        { metric: "SET Ops/sec", value: "110,000+", note: "Single instance, commodity hardware" },
        { metric: "GET Ops/sec", value: "125,000+", note: "Single instance, commodity hardware" },
        { metric: "Latency (P99)", value: "< 1ms", note: "Typical network round-trip + execution" },
        { metric: "Memory Efficiency", value: "High", note: "Compact data representations" }
    ];

    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    High <span className="text-redis">Performance</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    Redis is famous for its speed. But what exactly makes it fast, and how do you measure it? Let's dive into the benchmarks and tuning.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {benchmarks.map((b) => (
                    <Card key={b.metric} className="bg-redis/5 border-redis/20">
                        <CardContent className="p-6 text-center">
                            <div className="text-xs font-bold text-muted-foreground uppercase mb-2">{b.metric}</div>
                            <div className="text-3xl font-extrabold text-redis">{b.value}</div>
                            <div className="text-[10px] text-muted-foreground mt-2">{b.note}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Timer className="w-5 h-5 text-redis" />
                            Latency vs Throughput
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                        <p>
                            <strong>Latency</strong> is the time it takes for a single command to complete. In Redis, this is usually sub-millisecond.
                        </p>
                        <p>
                            <strong>Throughput</strong> is the number of commands handled per second. While Redis is single-threaded, it can handle hundreds of thousands of operations per second due to its non-blocking I/O.
                        </p>
                        <div className="p-4 bg-muted rounded-lg border border-border">
                            <h4 className="font-bold text-foreground mb-1 text-xs">Pipelining</h4>
                            <p className="text-xs">
                                By sending multiple commands at once without waiting for replies, you can significantly increase throughput by reducing the number of network RTTs (Round Trip Times).
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gauge className="w-5 h-5 text-redis" />
                            Performance Tuning
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <Rocket className="w-4 h-4 text-redis flex-shrink-0" />
                                <span><strong>Disable THP:</strong> Transparent Huge Pages can cause latency spikes during background saves.</span>
                            </li>
                            <li className="flex gap-3">
                                <Rocket className="w-4 h-4 text-redis flex-shrink-0" />
                                <span><strong>TCP Backlog:</strong> Raise `/proc/sys/net/core/somaxconn` to handle more simultaneous connections.</span>
                            </li>
                            <li className="flex gap-3">
                                <Rocket className="w-4 h-4 text-redis flex-shrink-0" />
                                <span><strong>Max Clients:</strong> Ensure `maxclients` is high enough to avoid connection rejection.</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Performance;
