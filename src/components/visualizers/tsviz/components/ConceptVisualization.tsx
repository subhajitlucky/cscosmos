'use client';

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { conceptVisualizations } from "../content/concept-visualizations";
import { conceptVisualScenes } from "../content/concept-visual-scenes";
import { AlertCircle } from "lucide-react";
import { Controls } from "./concept-viz/Controls";
import { StackHeapList } from "./concept-viz/StackHeapList";
import { MemoryDiagram } from "./concept-viz/MemoryDiagram";
import { StepTimeline } from "./concept-viz/StepTimeline";
import type { DiagramStep } from "./concept-viz/types";

interface Props {
    conceptId: string;
    conceptTitle: string;
}

export function ConceptVisualization({ conceptId, conceptTitle }: Props) {
    const scene = conceptVisualScenes[conceptId];
    const viz = conceptVisualizations[conceptId];
    const [stepIndex, setStepIndex] = useState(0);
    const [autoPlay, setAutoPlay] = useState(false);

    const currentStep = useMemo(() => scene?.steps[stepIndex], [scene?.steps, stepIndex]);
    const prevStep = useMemo<DiagramStep | undefined>(
        () => (scene && stepIndex > 0 ? scene.steps[stepIndex - 1] : undefined),
        [scene, stepIndex]
    );

    // Simple auto-play through steps
    useEffect(() => {
        if (!autoPlay || !scene) return;
        const interval = setInterval(() => {
            setStepIndex((i) => (i + 1) % scene.steps.length);
        }, 1800);
        return () => clearInterval(interval);
    }, [autoPlay, scene]);

    if (!scene && !viz) {
        return (
            <Card className="bg-muted/40 border-dashed">
                <CardHeader className="flex flex-row items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">Visualization coming soon</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    We’re preparing an interactive view for {conceptTitle}.
                </CardContent>
            </Card>
        );
    }

    if (scene && currentStep) {
        const hasPrev = stepIndex > 0;
        const hasNext = stepIndex < scene.steps.length - 1;

        return (
            <Card className="border-primary/30 shadow-sm">
                <CardHeader className="flex flex-col gap-3">
                    <Controls
                        title={scene.title}
                        subtitle={<span>{currentStep.title} — {currentStep.description}</span>}
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                        autoPlay={autoPlay}
                        onPrev={() => setStepIndex((i) => Math.max(0, i - 1))}
                        onNext={() => setStepIndex((i) => Math.min(scene.steps.length - 1, i + 1))}
                        onToggleAuto={() => setAutoPlay((v) => !v)}
                    />
                </CardHeader>
                <CardContent className="space-y-4">
                    <StackHeapList step={currentStep} prev={prevStep} />
                    <MemoryDiagram step={currentStep} prev={prevStep} />
                    <StepTimeline
                        steps={scene.steps}
                        activeIndex={stepIndex}
                        onSelect={(idx) => {
                            setAutoPlay(false);
                            setStepIndex(idx);
                        }}
                    />
                </CardContent>
            </Card>
        );
    }

    // Fallback to textual visualization steps
    if (viz) {
        return (
            <Card className="border-primary/20 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Visualization</span>
                        <CardTitle className="text-lg">{viz.title}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">{viz.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                    {viz.steps.map((step, index) => (
                        <div
                            key={step.title}
                            className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/30 p-3"
                        >
                            <div className="h-7 w-7 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                {index + 1}
                            </div>
                            <div className="space-y-1">
                                <div className="font-semibold text-sm">{step.title}</div>
                                <div className="text-sm text-muted-foreground leading-relaxed">{step.detail}</div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return null;
}
