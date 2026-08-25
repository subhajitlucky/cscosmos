'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import KeyValueInspector from '@/components/visualizers/redisviz/components/visualizers/KeyValueInspector';
import type { RedisType, RedisEncoding } from '@/components/visualizers/redisviz/components/visualizers/KeyValueInspector';
import { Info, Code, Zap, BookOpen } from 'lucide-react';

const DataStructures = () => {
    const structureData = [
        {
            id: "strings",
            name: "Strings",
            description: "The most basic Redis type. Can contain any data, up to 512MB.",
            encodings: ["int", "embstr", "raw"],
            examples: [
                { key: "user:100:name", type: "string", encoding: "embstr", value: "Alice Smith", memory: 56 },
                { key: "user:100:visits", type: "string", encoding: "int", value: 42, memory: 32 }
            ],
            details: [
                { title: "Integer (int)", content: "Used for small numbers that can be stored as 64-bit signed integers." },
                { title: "Embedded String (embstr)", content: "Used for strings smaller than 44 bytes. It's allocated together with the object header for better performance." },
                { title: "Raw (raw)", content: "Used for large strings. The memory is allocated separately from the object header." }
            ]
        },
        {
            id: "lists",
            name: "Lists",
            description: "Collections of strings, sorted by insertion order.",
            encodings: ["quicklist", "ziplist"],
            examples: [
                { key: "recent_tasks", type: "list", encoding: "quicklist", value: ["Deploy App", "Check Logs", "Email Team"], memory: 128 }
            ],
            details: [
                { title: "Quicklist", content: "A linked list of ziplists. This is the modern encoding that balances memory and performance." },
                { title: "Ziplist (Legacy)", content: "A memory-compressed list used for small collections in older Redis versions." }
            ]
        },
        {
            id: "hashes",
            name: "Hashes",
            description: "Maps between string fields and string values. Perfect for representing objects.",
            encodings: ["listpack", "hashtable"],
            examples: [
                { key: "user:100", type: "hash", encoding: "listpack", value: { name: "Alice", age: 30, city: "NY" }, memory: 92 }
            ],
            details: [
                { title: "Listpack", content: "A memory-efficient representation for small hashes. Replaced ziplists in recent versions." },
                { title: "Hashtable", content: "Standard hash table implementation for large hashes where O(1) lookups are prioritized." }
            ]
        },
        {
            id: "sets",
            name: "Sets",
            description: "Unordered collections of unique strings.",
            encodings: ["intset", "hashtable"],
            examples: [
                { key: "tags:blog", type: "set", encoding: "intset", value: [1001, 1005, 2002], memory: 48 }
            ],
            details: [
                { title: "Intset", content: "Optimized storage for sets containing only integers. Uses minimal memory." },
                { title: "Hashtable", content: "Used for sets containing broad string values or many elements." }
            ]
        }
    ];

    return (
        <div className="space-y-12">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                    Redis <span className="text-redis">Data Structures</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    Redis is often called a "Data Structure Store". Understanding how these structures are represented in memory is key to writing efficient applications.
                </p>
            </section>

            <Tabs defaultValue="strings" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] mb-8">
                    {structureData.map(s => (
                        <TabsTrigger key={s.id} value={s.id} className="font-semibold">
                            {s.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <AnimatePresence mode="wait">
                    {structureData.map((s) => (
                        <TabsContent key={s.id} value={s.id} className="space-y-8 min-h-[600px]">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                            >
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-redis/10 text-redis border border-redis/20 text-sm font-medium">
                                            <Zap className="w-4 h-4" />
                                            {s.name} Data Model
                                        </div>
                                        <h2 className="text-4xl font-bold tracking-tight">{s.name}</h2>
                                        <p className="text-muted-foreground text-lg leading-relaxed">{s.description}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {s.encodings.map(enc => (
                                            <Badge key={enc} variant="secondary" className="px-4 py-1.5 font-mono text-sm bg-muted/50 border-border/50">
                                                {enc}
                                            </Badge>
                                        ))}
                                    </div>

                                    <Accordion type="single" collapsible className="w-full bg-card/50 backdrop-blur-sm rounded-xl border border-border/40 overflow-hidden">
                                        {s.details.map((detail, idx) => (
                                            <AccordionItem key={idx} value={`item-${idx}`} className="px-4 border-b-border/40 last:border-0 font-medium">
                                                <AccordionTrigger className="text-sm hover:no-underline hover:text-redis py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                            <Info className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        {detail.title}
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground leading-relaxed pl-11 pb-6 pr-4">
                                                    {detail.content}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>

                                    <Card className="bg-redis/5 border-redis/20 shadow-lg shadow-redis/5">
                                        <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2 text-redis">
                                                <Zap className="w-4 h-4" />
                                                Engine Insights
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-foreground/80 leading-relaxed font-medium">
                                            Redis automatically optimizes memory by switching between these encodings as your data grows. This "Lazy Optimization" ensures both speed and memory efficiency.
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-muted">
                                                <Code className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Internal Representation</h3>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] border-border/60">Live Preview</Badge>
                                    </div>

                                    <div className="space-y-6">
                                        {s.examples.map((example, idx) => (
                                            <motion.div
                                                key={example.key}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * idx + 0.3 }}
                                            >
                                                <KeyValueInspector
                                                    redisKey={example.key}
                                                    type={example.type as RedisType}
                                                    encoding={example.encoding as RedisEncoding}
                                                    value={example.value}
                                                    memoryUsage={example.memory}
                                                    className="shadow-xl bg-card/80 backdrop-blur border-border/60"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="p-6 rounded-2xl bg-muted/30 border border-dashed border-border/60 flex items-start gap-4">
                                        <div className="mt-1"><BookOpen className="w-5 h-5 text-muted-foreground/60" /></div>
                                        <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                                            Observe how the "Encoding" field changes based on the value. In Redis, integers are often stored in binary to save space, while small strings use the "Embedded String" optimization.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </TabsContent>
                    ))}
                </AnimatePresence>
            </Tabs>
        </div>
    );
};

export default DataStructures;
