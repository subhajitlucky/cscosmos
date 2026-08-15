import { cn } from "@/lib/utils";
import type { DiagramStep } from "./types";

interface Props {
    steps: DiagramStep[];
    activeIndex: number;
    onSelect: (index: number) => void;
}

export function StepTimeline({ steps, activeIndex, onSelect }: Props) {
    return (
        <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">Step breakdown (tap to jump)</div>
            <div className="grid md:grid-cols-3 gap-3">
                {steps.map((step, idx) => (
                    <button
                        key={step.title + idx}
                        type="button"
                        onClick={() => onSelect(idx)}
                        className={cn(
                            "text-left border rounded-lg p-3 transition bg-background/70 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40",
                            idx === activeIndex && "border-primary/70 ring-1 ring-primary/40"
                        )}
                    >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
                                {idx + 1}
                            </span>
                            <span className="font-semibold text-sm text-foreground">{step.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

