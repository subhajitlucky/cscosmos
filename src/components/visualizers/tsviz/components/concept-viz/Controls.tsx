import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
    title: string;
    subtitle?: ReactNode;
    hasPrev: boolean;
    hasNext: boolean;
    autoPlay: boolean;
    onPrev: () => void;
    onNext: () => void;
    onToggleAuto: () => void;
}

export function Controls({
    title,
    subtitle,
    hasPrev,
    hasNext,
    autoPlay,
    onPrev,
    onNext,
    onToggleAuto,
}: Props) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Memory Visualization</Badge>
                <span className="text-lg font-semibold">{title}</span>
            </div>
            {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
            <div className="flex gap-2">
                <Button size="sm" variant={autoPlay ? "secondary" : "outline"} onClick={onToggleAuto}>
                    {autoPlay ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                    {autoPlay ? "Pause" : "Auto-play"}
                </Button>
                <Button size="sm" variant="outline" disabled={!hasPrev} onClick={onPrev}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                </Button>
                <Button size="sm" variant="outline" disabled={!hasNext} onClick={onNext}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}

