'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Hash, List, Globe, Boxes, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export type RedisType = 'string' | 'list' | 'set' | 'zset' | 'hash';
export type RedisEncoding = 'raw' | 'int' | 'embstr' | 'hashtable' | 'ziplist' | 'listpack' | 'intset' | 'skiplist' | 'quicklist';

interface KeyValueInspectorProps {
    redisKey: string;
    type: RedisType;
    encoding: RedisEncoding;
    value: string | number | string[] | number[] | Record<string, string | number>;
    memoryUsage?: number;
    className?: string;
}

const typeIcons = {
    string: <Hash className="w-4 h-4" />,
    list: <List className="w-4 h-4" />,
    set: <Boxes className="w-4 h-4" />,
    zset: <Layers className="w-4 h-4" />,
    hash: <Globe className="w-4 h-4" />,
};

const typeColors = {
    string: "text-blue-500 bg-blue-500/10",
    list: "text-green-500 bg-green-500/10",
    set: "text-purple-500 bg-purple-500/10",
    zset: "text-redis bg-redis/10",
    hash: "text-amber-500 bg-amber-500/10",
};

const KeyValueInspector: React.FC<KeyValueInspectorProps> = ({
    redisKey,
    type,
    encoding,
    value,
    memoryUsage,
    className
}) => {
    return (
        <Card className={cn("overflow-hidden border-2", className)}>
            <CardHeader className="bg-muted/30 pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-md", typeColors[type])}>
                            {typeIcons[type]}
                        </div>
                        <CardTitle className="text-lg font-mono truncate max-w-[200px]" title={redisKey}>
                            {redisKey}
                        </CardTitle>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                        {type}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">Internal Encoding</p>
                        <Badge variant="secondary" className="font-mono text-xs">
                            {encoding}
                        </Badge>
                    </div>
                    {memoryUsage && (
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Memory Usage</p>
                            <p className="font-mono text-sm">{memoryUsage} bytes</p>
                        </div>
                    )}
                </div>

                <Separator />

                <div className="space-y-2">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">Value Content</p>
                    <div className="bg-muted/50 rounded-md p-3 font-mono text-sm overflow-auto max-h-[150px]">
                        {type === 'string' ? (
                            <span className="text-redis">{JSON.stringify(value)}</span>
                        ) : type === 'hash' ? (
                            <div className="space-y-1">
                                {Object.entries(value).map(([k, v]) => (
                                    <div key={k} className="flex justify-between border-b border-border/50 py-1 last:border-0">
                                        <span className="text-blue-500 italic">{k}</span>
                                        <span className="text-muted-foreground">→</span>
                                        <span className="text-redis">{String(v)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(value) && value.map((item, i) => (
                                    <Badge key={i} variant="outline" className="bg-background">
                                        {String(item)}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default KeyValueInspector;
