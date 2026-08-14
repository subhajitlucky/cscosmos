'use client';

import MemorySimulator from '@/components/visualizers/redisviz/components/visualizers/MemorySimulator';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, ShieldAlert, Zap } from 'lucide-react';

const MemoryManagement = () => {
    return (
        <div className="space-y-12 pb-20">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    Memory <span className="text-redis">Management</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    Redis is an in-memory database. How it handles RAM is the difference between peak performance and a system crash. Explore allocation, overhead, and eviction.
                </p>
            </section>

            <section>
                <MemorySimulator />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-redis" />
                            Allocation Strategy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-relaxed">
                        <p>
                            Redis doesn't allocate memory directly from the OS for every key. It uses a general-purpose allocator like <span className="font-bold text-redis">jemalloc</span> or <span className="font-bold text-redis">libc malloc</span>.
                        </p>
                        <p>
                            Jemalloc is the default on Linux because it reduces memory fragmentation, which is the biggest enemy of long-running Redis instances.
                        </p>
                        <div className="bg-muted p-4 rounded-md border border-border">
                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-500" /> Fragmentation Ratio
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                The ratio between memory requested from the OS and memory actually used by Redis. A ratio {">"} 1.5 usually indicates serious fragmentation.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-redis" />
                            maxmemory-policy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Policy</TableHead>
                                    <TableHead>Behavior</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-mono text-[10px] font-bold">noeviction</TableCell>
                                    <TableCell className="text-xs">Returns errors when memory is full.</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono text-[10px] font-bold">allkeys-lru</TableCell>
                                    <TableCell className="text-xs">Evicts least recently used keys.</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono text-[10px] font-bold">volatile-lru</TableCell>
                                    <TableCell className="text-xs">Only evicts keys with an expire set.</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono text-[10px] font-bold">allkeys-random</TableCell>
                                    <TableCell className="text-xs">Evicts random keys to make room.</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle>Memory Overhead of a Redis Object</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 border rounded-lg bg-background">
                            <div className="text-2xl font-bold text-redis">16B</div>
                            <div className="text-[10px] uppercase text-muted-foreground">Redis Object Header</div>
                        </div>
                        <div className="p-4 border rounded-lg bg-background">
                            <div className="text-2xl font-bold text-blue-500">8B-24B</div>
                            <div className="text-[10px] uppercase text-muted-foreground">Pointer / metadata</div>
                        </div>
                        <div className="p-4 border rounded-lg bg-background">
                            <div className="text-2xl font-bold text-green-500">??B</div>
                            <div className="text-[10px] uppercase text-muted-foreground">Actual Payload</div>
                        </div>
                        <div className="p-4 border rounded-lg bg-background">
                            <div className="text-2xl font-bold text-slate-500">8B</div>
                            <div className="text-[10px] uppercase text-muted-foreground">Allocator Overhead</div>
                        </div>
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground text-center italic">
                        Even a tiny 1-byte string can take up to 40+ bytes in RAM due to the object header and allocator alignment.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default MemoryManagement;
