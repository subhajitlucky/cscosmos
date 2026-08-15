import type { DiagramStep } from "./types";

export function computeChanges(prev: DiagramStep | undefined, curr: DiagramStep) {
    const stack = new Set<string>();
    const heap = new Set<string>();

    if (prev) {
        const prevStack = new Map(prev.stack.map((s) => [s.id, `${s.value}-${s.pointsTo ?? ""}-${s.type ?? ""}`]));
        curr.stack.forEach((s) => {
            const key = `${s.value}-${s.pointsTo ?? ""}-${s.type ?? ""}`;
            if (prevStack.get(s.id) !== key) stack.add(s.id);
        });

        const prevHeap = new Map(
            (prev.heap ?? []).map((h) => [h.id, JSON.stringify(h.fields.map((f) => `${f.key}:${f.value}:${f.type ?? ""}`))])
        );
        (curr.heap ?? []).forEach((h) => {
            const key = JSON.stringify(h.fields.map((f) => `${f.key}:${f.value}:${f.type ?? ""}`));
            if (prevHeap.get(h.id) !== key) heap.add(h.id);
        });
    } else {
        curr.stack.forEach((s) => stack.add(s.id));
        (curr.heap ?? []).forEach((h) => heap.add(h.id));
    }

    return { stack, heap };
}

