import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DiagramStep } from "./types";
import { computeChanges } from "./computeChanges";

interface Props {
    step: DiagramStep;
    prev?: DiagramStep;
}

export function StackHeapList({ step, prev }: Props) {
    const changed = computeChanges(prev, step);
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-background/70">
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Server className="h-4 w-4" />
                        <span>Stack (per call/frame)</span>
                    </div>
                    <div className="space-y-2">
                        {step.stack.map((slot) => (
                            <div
                                key={slot.id}
                                className={cn(
                                    "border rounded-lg p-3 bg-background/60 flex items-start justify-between gap-3 transition",
                                    changed.stack.has(slot.id) && "border-primary/70 ring-1 ring-primary/40"
                                )}
                            >
                                <div>
                                    <div className="text-xs uppercase text-muted-foreground tracking-wide">{slot.type || "value"}</div>
                                    <div className="font-semibold text-sm">{slot.label}</div>
                                    <div className="text-[11px] text-muted-foreground">
                                        {slot.address ? `@${slot.address}` : ""} {slot.size ? `• ${slot.size}` : ""}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {slot.pointsTo ? `→ ${slot.pointsTo}` : slot.value}
                                </div>
                            </div>
                        ))}
                        {step.stack.length === 0 && (
                            <div className="text-sm text-muted-foreground">No stack slots in this step.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-background/70">
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Database className="h-4 w-4" />
                        <span>Heap / Objects</span>
                        <Badge variant="outline" className="text-[10px]">refs</Badge>
                    </div>
                    <div className="space-y-2">
                        {(step.heap ?? []).map((obj) => (
                            <div
                                key={obj.id}
                                className={cn(
                                    "border rounded-lg p-3 bg-muted/40 transition",
                                    changed.heap.has(obj.id) && "border-primary/70 ring-1 ring-primary/40"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="font-semibold text-sm">{obj.label}</div>
                                    <div className="text-xs text-muted-foreground space-x-2">
                                        {obj.address && <span>@{obj.address}</span>}
                                        {obj.size && <span>{obj.size}</span>}
                                        {obj.note && <span>{obj.note}</span>}
                                    </div>
                                </div>
                                <div className="mt-2 space-y-1">
                                    {obj.fields.map((f) => (
                                        <div key={f.key} className="flex items-center justify-between text-sm">
                                            <div className="text-muted-foreground">{f.key}</div>
                                            <div className="font-mono text-xs px-2 py-0.5 rounded bg-background/60">
                                                {f.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {(step.heap ?? []).length === 0 && (
                            <div className="text-sm text-muted-foreground">No heap objects in this step.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

