import { cn } from "@/lib/utils";
import { computeChanges } from "./computeChanges";
import type { DiagramStep } from "./types";

interface Props {
    step: DiagramStep;
    prev?: DiagramStep;
}

export function MemoryDiagram({ step, prev }: Props) {
    const stack = step.stack;
    const heap = step.heap ?? [];
    const changed = computeChanges(prev, step);

    // Layout constants for simple positioning
    const stackX = 120;
    const heapX = 420;
    const rowH = 72;

    const positions = stack.map((slot, idx) => ({
        id: slot.id,
        x: stackX,
        y: 40 + idx * rowH,
    }));

    const heapPositions = heap.map((obj, idx) => ({
        id: obj.id,
        x: heapX,
        y: 40 + idx * rowH,
    }));

    const arrows = stack
        .filter((slot) => slot.pointsTo)
        .map((slot) => {
            const from = positions.find((p) => p.id === slot.id)!;
            const target = heapPositions.find((h) => h.id === slot.pointsTo);
            if (!target) return null;
            return { from, to: target, key: `${slot.id}-${slot.pointsTo}` };
        })
        .filter(Boolean) as { from: { x: number; y: number }; to: { x: number; y: number }; key: string }[];

    return (
        <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-background via-muted/30 to-background p-4">
            <div className="absolute inset-0 pointer-events-none">
                <svg width="100%" height={Math.max((stack.length + heap.length) * rowH, 220)} className="overflow-visible">
                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" />
                        </marker>
                    </defs>
                    {arrows.map((arrow) => (
                        <line
                            key={arrow.key}
                            x1={arrow.from.x + 140}
                            y1={arrow.from.y + 24}
                            x2={arrow.to.x - 12}
                            y2={arrow.to.y + 16}
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            markerEnd="url(#arrow)"
                            strokeOpacity={0.85}
                        />
                    ))}
                </svg>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <div className="text-xs uppercase text-muted-foreground mb-2 font-semibold">Stack</div>
                    <div className="space-y-3">
                        {stack.map((slot, idx) => (
                            <div
                                key={slot.id}
                                style={{ transform: `translateY(${idx * 2}px)` }}
                                className={cn(
                                    "relative rounded-lg border bg-background/90 shadow-sm p-3 transition",
                                    changed.stack.has(slot.id) && "border-primary/70 ring-1 ring-primary/40"
                                )}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <div className="text-[10px] uppercase text-muted-foreground tracking-wide">{slot.type || "value"}</div>
                                        <div className="font-semibold text-sm">{slot.label}</div>
                                        {(slot.address || slot.size) && (
                                            <div className="text-[11px] text-muted-foreground">
                                                {slot.address ? `@${slot.address}` : ""} {slot.size ? `• ${slot.size}` : ""}
                                            </div>
                                        )}
                                    </div>
                                    <div className="font-mono text-xs px-2 py-1 rounded bg-muted/50 text-foreground/90">
                                        {slot.pointsTo ? `→ ${slot.pointsTo}` : slot.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stack.length === 0 && <div className="text-sm text-muted-foreground">No stack entries.</div>}
                    </div>
                </div>
                <div>
                    <div className="text-xs uppercase text-muted-foreground mb-2 font-semibold">Heap / Objects</div>
                    <div className="space-y-3">
                        {heap.map((obj, idx) => (
                            <div
                                key={obj.id}
                                style={{ transform: `translateY(${idx * 2}px)` }}
                                className={cn(
                                    "relative rounded-lg border bg-muted/60 shadow-sm p-3 transition",
                                    changed.heap.has(obj.id) && "border-primary/70 ring-1 ring-primary/40"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="font-semibold text-sm">{obj.label}</div>
                                    <div className="text-[11px] text-muted-foreground space-x-2">
                                        {obj.address && <span>@{obj.address}</span>}
                                        {obj.size && <span>{obj.size}</span>}
                                        {obj.note && <span>{obj.note}</span>}
                                    </div>
                                </div>
                                <div className="mt-2 space-y-1">
                                    {obj.fields.map((f) => (
                                        <div key={f.key} className="flex items-center justify-between text-sm">
                                            <div className="text-muted-foreground">{f.key}</div>
                                            <div className="font-mono text-xs px-2 py-1 rounded bg-background/70">
                                                {f.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {heap.length === 0 && <div className="text-sm text-muted-foreground">No heap objects.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

